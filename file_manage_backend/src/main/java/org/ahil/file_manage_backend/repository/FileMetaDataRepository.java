package org.ahil.file_manage_backend.repository;

import org.ahil.file_manage_backend.entity.FileMetaData;
import org.ahil.file_manage_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

//import java.util.List;
import java.util.Optional;

public interface FileMetaDataRepository extends JpaRepository<FileMetaData, Long> {

//    Optional<List<FileMetaData>> findAllByAuthor(User user);

    void deleteAllByAuthor(User user);

    Optional<FileMetaData> findByAuthorAndFileNameAndFileTypeAndBio(User user, String fileName, String fileType, String bio);
}
