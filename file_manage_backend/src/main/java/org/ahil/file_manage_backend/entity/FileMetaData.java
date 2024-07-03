package org.ahil.file_manage_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class FileMetaData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private String filePath;
    private String fileType;
    private String rawFileType;
    private long fileSize;
    private String lastEditedBy;
    private LocalDateTime createdOn;
    private LocalDateTime lastEditedOn;
    private String bio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;
}
