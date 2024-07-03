package org.ahil.file_manage_backend.controller;

import lombok.RequiredArgsConstructor;
import org.ahil.file_manage_backend.dto.request.PasswordUpdateRequest;
import org.ahil.file_manage_backend.dto.response.UserResponse;
import org.ahil.file_manage_backend.entity.User;
import org.ahil.file_manage_backend.repository.UserRepository;
import org.ahil.file_manage_backend.service.UserService;
import org.ahil.file_manage_backend.service.impl.FileServiceImpl;
import org.springframework.beans.factory.annotation.Value;
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
import java.util.Arrays;
import java.util.List;

@Controller
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasAnyRole('ADMIN','CEO','MANAGER','EMPLOYEE')")
public class UserController {

    @Value("${file.storage.location}")
    private String fileStorageLocation;

    private final UserService userService;
    private final UserRepository userRepository;
    private final FileServiceImpl fileService;

    @PostMapping("/promote/{id}")
    @PreAuthorize("hasAuthority('user:update')")
    public ResponseEntity<UserResponse> promoteUser(@PathVariable Integer id){
        System.out.println("flag promote");
        User user = userRepository.findById(id)
                .orElseThrow(()-> new UsernameNotFoundException("user not found in database"));

        return ResponseEntity.ok(userService.promoteUser(user.getEmail()));
    }

    @PostMapping("/demote/{id}")
    @PreAuthorize("hasAuthority('user:update')")
    public ResponseEntity<UserResponse> demoteUser(@PathVariable Integer id){
        User user = userRepository.findById(id)
                .orElseThrow(()-> new UsernameNotFoundException("user not found in database"));

        return ResponseEntity.ok(userService.demoteUser(user.getEmail()));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('user:read')")
    public ResponseEntity<List<UserResponse>> getAllUsers(){
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('user:read')")
    public ResponseEntity<UserResponse> getUser(@PathVariable Integer id){
        return ResponseEntity.ok(userService.getUser(id));
    }

    @GetMapping("/me/{email}")
    @PreAuthorize("hasAuthority('user:me')")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable String email){
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('user:delete')")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id){
        fileService.deleteAllFilesOfUser(id);
        userRepository.deleteById(id);
        return ResponseEntity.ok("User Deleted Successfully Along with his Files");
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAuthority('user:update')")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Integer id, String email, String firstName, String lastName){
        return ResponseEntity.ok(userService.updateUser(id, email, firstName, lastName));

    }

    @PutMapping("/update/password/{id}")
    @PreAuthorize("hasAuthority('user:update')")
    public ResponseEntity<UserResponse> updatePassword(@PathVariable Integer id, @RequestBody PasswordUpdateRequest passwordUpdateRequest){
        String oldPass = passwordUpdateRequest.getOldPassword();
        String newPass = passwordUpdateRequest.getNewPassword();

        if (oldPass == null || newPass == null) {
            throw new IllegalArgumentException("Passwords cannot be null");
        }

        return ResponseEntity.ok(userService.updatePassword(id, oldPass, newPass));
    }

    @PostMapping("/upload/picture/{id}")
    @PreAuthorize("hasAuthority('user:update')")
    public ResponseEntity<String> uploadProfilePicture(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file
    ) {
        if (file.isEmpty()) {
            return new ResponseEntity<>("Please select a file!", HttpStatus.BAD_REQUEST);
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body("File size exceeds 5MB limit.");
        }

        // Check file type (optional, depending on frontend validation)
        if (!file.getContentType().equals("image/jpeg") && !file.getContentType().equals("image/png")) {
            return ResponseEntity.badRequest().body("Only JPEG and PNG images are supported.");
        }

        try {
            // Store the file
            String fileName = storeFile(file, id);
            byte[] fileByte = file.getBytes();

            // Update user profile picture path
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            user.setProfilePicture(fileByte);
            userRepository.save(user);

            return ResponseEntity.ok("Profile picture saved");
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


    @GetMapping("/{id}/profilePic")
    @PreAuthorize("hasAuthority('user:me')")
    public ResponseEntity<byte[]> getUserProfilePic(@PathVariable Integer id){
        User user = userRepository.findById(id)
                .orElseThrow(()-> new UsernameNotFoundException("user not found"));
        byte[] profilePic = user.getProfilePicture();
        return ResponseEntity.ok(profilePic);
    }

    private String storeFile(MultipartFile file, Integer id) throws IOException {
        // Normalize file name
        String fileName = id + "_profilePic_" + file.getOriginalFilename();
        Path fileStoragePath = Paths.get(fileStorageLocation).toAbsolutePath().normalize();

        // Create the directories if they do not exist
        Files.createDirectories(fileStoragePath);

        // Copy file to the target location (Replacing existing file with the same name)
        Path targetLocation = fileStoragePath.resolve(fileName);
        file.transferTo(targetLocation);

        return fileName;
    }

    private boolean isValidFile(MultipartFile file) {
        // Allowed file types
        String[] allowedExtensions = { "png", "jpeg", "jpg" };
        // Retrieves the original file name from the file
        String originalFileName = file.getOriginalFilename();
        // Gets the file type string from the file from the next character of .
        assert originalFileName != null;
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf(".") + 1);
        // Is the fileExtension one of the allowed extensions
        boolean validExtension = Arrays.stream(allowedExtensions).anyMatch(ext -> ext.equalsIgnoreCase(fileExtension));
        // Max size of 5MB
        boolean validSize = file.getSize() <= 5 * 1024 * 1024;
        // Returns true if both file type and size are in limits
        return validExtension && validSize;
    }




}
