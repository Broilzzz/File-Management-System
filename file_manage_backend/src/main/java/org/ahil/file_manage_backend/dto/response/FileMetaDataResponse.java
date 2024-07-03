package org.ahil.file_manage_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileMetaDataResponse {
    private Long id;

    private String fileName;
    private String filePath;
    private String fileType;
    private long fileSize;
    private String lastEditedBy;
    private LocalDateTime createdOn;
    private LocalDateTime lastEditedOn;
    private String bio;

    private String userRole;
    private String userEmail;
    private String userFirstName;
    private String userLastName;
}
