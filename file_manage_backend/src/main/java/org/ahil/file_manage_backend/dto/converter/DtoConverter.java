package org.ahil.file_manage_backend.dto.converter;


import org.ahil.file_manage_backend.dto.response.FileMetaDataResponse;
import org.ahil.file_manage_backend.dto.response.UserResponse;
import org.ahil.file_manage_backend.entity.FileMetaData;
import org.ahil.file_manage_backend.entity.User;

import java.util.List;
import java.util.stream.Collectors;

public class DtoConverter {
    public static UserResponse convertToUserResponse(User user) {
        List<FileMetaDataResponse> fileMetaDataResponses = user.getFiles().stream()
                .map(DtoConverter::convertToFileMetaDataResponse)
                .collect(Collectors.toList());

        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole().toString())
                .accountNonExpired(user.isAccountNonExpired())
                .accountNonLocked(user.isAccountNonLocked())
                .credentialsNonExpired(user.isCredentialsNonExpired())
                .enabled(user.isEnabled())
                .lastLogin(user.getLastLogin())
                .profilePicture(user.getProfilePicture())
                .files(fileMetaDataResponses)
                .build();
    }

    public static FileMetaDataResponse convertToFileMetaDataResponse(FileMetaData file) {
        return FileMetaDataResponse.builder()
                .id(file.getId())
                .fileName(file.getFileName())
                .filePath(file.getFilePath())
                .fileType(file.getFileType())
                .fileSize(file.getFileSize())
                .bio(file.getBio())
                .lastEditedBy(file.getLastEditedBy())
                .lastEditedOn(file.getLastEditedOn())
                .createdOn(file.getCreatedOn())
                .userRole(file.getAuthor().getRole().toString())
                .userEmail(file.getAuthor().getEmail())
                .userFirstName(file.getAuthor().getFirstName())
                .userLastName(file.getAuthor().getLastName())
                .build();
    }
}
