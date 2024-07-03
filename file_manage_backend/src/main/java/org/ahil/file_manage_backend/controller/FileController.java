    package org.ahil.file_manage_backend.controller;

    import lombok.RequiredArgsConstructor;
    import org.ahil.file_manage_backend.dto.request.UpdateRequest;
    import org.ahil.file_manage_backend.dto.response.ApiResponse;
    import org.ahil.file_manage_backend.dto.response.FileMetaDataResponse;
    import org.ahil.file_manage_backend.entity.FileMetaData;
    import org.ahil.file_manage_backend.entity.User;
    import org.ahil.file_manage_backend.repository.UserRepository;
    import org.ahil.file_manage_backend.service.JwtService;
    import org.ahil.file_manage_backend.service.impl.FileServiceImpl;
    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.http.HttpHeaders;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.access.prepost.PreAuthorize;
    import org.springframework.security.core.userdetails.UsernameNotFoundException;
    import org.springframework.stereotype.Controller;
    import org.springframework.web.bind.annotation.*;
    import org.springframework.web.multipart.MultipartFile;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Path;
    import java.nio.file.Paths;
    import java.time.LocalDateTime;
    import java.util.Arrays;
    import java.util.List;
    import java.util.Optional;
    import java.util.stream.Collectors;

    @Controller
    @RequiredArgsConstructor
    @RequestMapping("/api/v1/files")
    @CrossOrigin(origins = "http://localhost:5173")
    @PreAuthorize("hasAnyRole('ADMIN','CEO','MANAGER','EMPLOYEE')")
    public class FileController {

        private final FileServiceImpl fileService;
        private final JwtService jwtService;
        private final UserRepository userRepository;

        @Value("${file.storage.location}")
        private String fileStorageLocation;

        @GetMapping
        @PreAuthorize("hasAuthority('file:read')")
        public ResponseEntity<ApiResponse<List<FileMetaDataResponse>>> getAllFiles(){
            //get all files from database
            List<FileMetaData> file = fileService.getAllFiles();
            //convert the file to response files
            List<FileMetaDataResponse> responseFiles = file.stream()
                    .map(this::convertToFileResponse)
                    .collect(Collectors.toList());
            //return files
            return ResponseEntity.ok(new ApiResponse<>("All files fetched successfully.", responseFiles));
        }


        //convert file to fileMetadataResponse
        private FileMetaDataResponse convertToFileResponse(FileMetaData metaData) {
            FileMetaDataResponse dto = new FileMetaDataResponse();
            dto.setId(metaData.getId());
            dto.setFileName(metaData.getFileName());
            dto.setFileType(metaData.getFileType());
            dto.setFileSize(metaData.getFileSize());
            dto.setFilePath(metaData.getFilePath());
            dto.setBio(metaData.getBio());
            dto.setLastEditedBy(metaData.getLastEditedBy());
            dto.setLastEditedOn(metaData.getLastEditedOn());
            dto.setCreatedOn(metaData.getCreatedOn());
            //add author details
            dto.setUserRole(metaData.getAuthor().getRole().toString());
            dto.setUserEmail(metaData.getAuthor().getEmail());
            dto.setUserFirstName(metaData.getAuthor().getFirstName());
            dto.setUserLastName(metaData.getAuthor().getLastName());
            return dto;
        }

        @GetMapping("{id}")
        @PreAuthorize("hasAuthority('file:read')")
        public ResponseEntity<ApiResponse<FileMetaDataResponse>> getFileById(@PathVariable Long id){
            Optional<FileMetaData> file =fileService.getFileById(id);
            return file.map(metadata-> ResponseEntity.ok(new ApiResponse<>("file fetched successfully",convertToFileResponse(metadata))))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        }

        @PostMapping("/upload")
        @PreAuthorize("hasAuthority('file:create')")
        public ResponseEntity<ApiResponse<FileMetaDataResponse>> uploadFile(
                @RequestParam("file")MultipartFile file,
                @RequestParam("bio") String bio,
                @RequestHeader("Authorization") String authorizationHeader){

            //validate existence of file
            if(!isValidFile(file)){
                return ResponseEntity.badRequest().body(new ApiResponse<>("Invalid file type or size",null));
            }

            //save filename after storing the file
            String fileName = storeFile(file);

            String fileNameWithoutType = fileName.substring(0, fileName.lastIndexOf('.'));
            //save file type
            String fileType = file.getContentType();
            //get file size
            long fileSize = file.getSize();


            //extract the jwt token
            String jwtToken = authorizationHeader.substring(7);

            // Extract userEmail information from jwtService
            String userEmail = jwtService.extractUserName(jwtToken);

            //get the user from email
            User user = userRepository.findByEmail(userEmail).orElseThrow(()->new IllegalStateException("user not found"));

            //check if file with same details is in database
            if(fileService.fileExists(user.getEmail(),
                    fileNameWithoutType, fileType, bio)){
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse<>("file with same details exists in database",null));
            }

            //create file metadata to be stored in database
            FileMetaData metaData = new FileMetaData();
            metaData.setFileName(fileName);
            metaData.setFileType(fileName.substring(fileName.lastIndexOf('.')+1));
            metaData.setRawFileType(fileType);
            metaData.setFileSize(fileSize);
            metaData.setFilePath(Paths.get(fileStorageLocation, fileName).toString());
            metaData.setAuthor(user);
            metaData.setBio(bio);
            metaData.setLastEditedBy(user.getFirstName()+" "+user.getLastName());
            metaData.setLastEditedOn(LocalDateTime.now());
            metaData.setCreatedOn(LocalDateTime.now());

            FileMetaData savedFile =fileService.saveFile(metaData);
            return ResponseEntity.ok(new ApiResponse<>("File uploaded successfully",convertToFileResponse(savedFile)));
        }

        private String storeFile(MultipartFile file) {
            try {
                // Retrieve the file storage location from the application properties and normalize it
                Path fileStoragePath = Paths.get(fileStorageLocation).toAbsolutePath().normalize();

                // Create the directories if they do not exist
                Files.createDirectories(fileStoragePath);

                // Resolve the target path where the file will be stored
                Path targetPath = fileStoragePath.resolve(file.getOriginalFilename());
                // Transfer the file content to the target path
                file.transferTo(targetPath);
                // Return the file name
                return file.getOriginalFilename();
            } catch (IOException ex) {
                throw new RuntimeException("Error saving file", ex);
            }
        }

        private boolean isValidFile(MultipartFile file) {
            //allowed file types
            String[] allowedExtensions = { "png", "jpeg", "jpg", "docx", "pdf", "xlsx", "csv", "pptx", "txt"};
            //retrieves the original file name from the file
            String originalFileName = file.getOriginalFilename();
            //gets the file type string from the file from the next character of .
            assert originalFileName != null;
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf(".") + 1);
            //is the fileExtension one of the allowed extensions
            boolean validExtension = Arrays.stream(allowedExtensions).anyMatch(ext -> ext.equalsIgnoreCase(fileExtension));
            //max size of 5mb
            boolean validSize = file.getSize() <= 5 * 1024 * 1024;
            //returns true if both file type and size is in limits
            return validExtension && validSize;
        }


        //file download
        @GetMapping("/download/{id}")
        @PreAuthorize("hasAuthority('file:download')")
        public ResponseEntity<byte[]> downloadFile(@PathVariable Long id){
            // Retrieve file metadata by ID
            Optional<FileMetaData> fileOpt = fileService.getFileById(id);
            // If file metadata not found, return 404 Not Found response
            if(fileOpt.isEmpty()){
                System.out.println("file not found");
                return ResponseEntity.notFound().build();
            }
            // Get the file metadata object
            FileMetaData file = fileOpt.get();
            // Get the path to the file
            Path filePath = Paths.get(file.getFilePath());

            try{
                // Read the file content into a byte array
                byte[] fileContent = Files.readAllBytes(filePath);

                // Return the file content in the response with appropriate headers
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, file.getRawFileType())
                        //content disposition is a way for browser to display the content in the window or prompt user to download as attachment
                        //when set to attachment, indicates the response to be treated as a file to be downloaded
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFileName() + "\"")
                        .body(fileContent);
            }catch (IOException e){
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }


        @DeleteMapping("/{id}")
        @PreAuthorize("hasAuthority('file:delete')")
        public ResponseEntity<ApiResponse<String>> deleteFile(@PathVariable Long id) {
            FileMetaData file = fileService.getFileById(id)
                            .orElseThrow(()-> new IllegalStateException("file not found"));
            fileService.deleteFile(id);
            return ResponseEntity.ok(new ApiResponse<>("File deleted successfully.", null));
        }

        @PostMapping("/update/{id}")
        @PreAuthorize("hasAuthority('file:update')")
        public ResponseEntity<FileMetaDataResponse> updateFileDetails(
                @RequestHeader("Authorization") String authorizationHeader,
                @PathVariable Long id,
                @RequestBody UpdateRequest updateRequest
        ){
            //extract the jwt token
            String jwtToken = authorizationHeader.substring(7);

            // Extract userEmail information from jwtService
            String userEmail = jwtService.extractUserName(jwtToken);

            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(()-> new UsernameNotFoundException("user not found"));

            FileMetaData updatedFile = fileService.updateFile(id, updateRequest.getFileName(), updateRequest.getBio(), user.getFirstName()+" "+user.getLastName());
            return ResponseEntity.ok(convertToFileResponse(updatedFile));
        }




    }
