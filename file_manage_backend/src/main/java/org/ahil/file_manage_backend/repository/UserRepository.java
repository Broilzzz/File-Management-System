package org.ahil.file_manage_backend.repository;

import org.ahil.file_manage_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Integer> {


    //SDP
    Optional<User> findByEmail(String email);



}
