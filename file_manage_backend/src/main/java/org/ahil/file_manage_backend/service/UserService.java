package org.ahil.file_manage_backend.service;

import org.ahil.file_manage_backend.dto.response.UserResponse;
import org.ahil.file_manage_backend.enums.Role;

import java.util.List;

public interface UserService {
//    UserDetailsService userDetailsService();

    UserResponse promoteUser(String email);

    UserResponse demoteUser(String email);

    Role getNextRole(Role currentRole, boolean promote);

    List<UserResponse> getAllUsers();

    UserResponse getUser(Integer id);

    UserResponse getUserByEmail(String email);

    UserResponse updateUser(Integer id, String email, String firstName, String lastName);

    UserResponse updatePassword(Integer id, String oldPass, String newPass);

}
