package org.ahil.file_manage_backend.repository;

import org.ahil.file_manage_backend.entity.Token;
import org.ahil.file_manage_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token,Integer> {

    Optional<Token> findByToken(String token);

//    Optional<Token> findByUserId(Integer id);

    Optional<Token> findByUserAndExpiresAtAfter(User user, LocalDateTime now);

    void deleteByExpiresAtBefore(LocalDateTime now);
}
