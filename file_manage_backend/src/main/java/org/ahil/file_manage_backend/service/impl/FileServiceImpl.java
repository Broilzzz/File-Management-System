package org.ahil.file_manage_backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.ahil.file_manage_backend.entity.FileMetaData;
import org.ahil.file_manage_backend.entity.User;
import org.ahil.file_manage_backend.repository.FileMetaDataRepository;
import org.ahil.file_manage_backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FileServiceImpl {

    private final FileMetaDataRepository fileMetaDataRepository;
    private final UserRepository userRepository;

    public List<FileMetaData> getAllFiles(){
        return fileMetaDataRepository.findAll();
    }

    public Optional<FileMetaData> getFileById(Long id) {
        return fileMetaDataRepository.findById(id);
    }

    public FileMetaData saveFile(FileMetaData fileMetaData) {
        return fileMetaDataRepository.save(fileMetaData);
    }

    public void deleteFile(Long id) {
        fileMetaDataRepository.deleteById(id);
    }

    public void deleteAllFilesOfUser(Integer id){
        User user = userRepository.findById(id)
                .orElseThrow(()-> new UsernameNotFoundException("user not found in database"));
        fileMetaDataRepository.deleteAllByAuthor(user);
    }

    public boolean fileExists(
            String email,
            String fileName,
            String fileType,
            String bio
    ){
        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new UsernameNotFoundException("user not found in database"));
        return fileMetaDataRepository.findByAuthorAndFileNameAndFileTypeAndBio(
                user, fileName, fileType, bio
        ).isPresent();
    }

    public FileMetaData updateFile(Long id, String fileName, String bio, String userName){
        FileMetaData newFile = fileMetaDataRepository.findById(id)
                .orElseThrow(()-> new IllegalStateException("file not found in database"));

        newFile.setBio(bio);
        newFile.setFileName(fileName);
        newFile.setLastEditedBy(userName);
        newFile.setLastEditedOn(LocalDateTime.now());
        return fileMetaDataRepository.save(newFile);
    }

}
