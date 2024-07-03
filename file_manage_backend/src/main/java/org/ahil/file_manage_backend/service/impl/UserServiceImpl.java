package org.ahil.file_manage_backend.service.impl;


import lombok.RequiredArgsConstructor;
import org.ahil.file_manage_backend.dto.converter.DtoConverter;
import org.ahil.file_manage_backend.dto.response.UserResponse;
import org.ahil.file_manage_backend.entity.User;
import org.ahil.file_manage_backend.enums.Role;
import org.ahil.file_manage_backend.repository.UserRepository;
import org.ahil.file_manage_backend.service.JwtService;
import org.ahil.file_manage_backend.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;


    @Override
    public UserResponse promoteUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new IllegalStateException("user not found"));
        Role newRole = getNextRole(user.getRole(), true);
        user.setRole(newRole);
        userRepository.save(user);
        return DtoConverter.convertToUserResponse(user);
    }

    @Override
    public UserResponse demoteUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new IllegalStateException("user not found"));
        Role newRole = getNextRole(user.getRole(), false);
        user.setRole(newRole);
        userRepository.save(user);
        return DtoConverter.convertToUserResponse(user);
    }

    @Override
    public Role getNextRole(Role currentRole, boolean promote) {
        return switch (currentRole) {
            case EMPLOYEE -> promote ? Role.MANAGER : Role.EMPLOYEE;
            case MANAGER -> promote ? Role.CEO : Role.EMPLOYEE;
            case CEO -> promote ? Role.ADMIN : Role.MANAGER;
            case ADMIN -> promote ? Role.ADMIN : Role.CEO;
            default -> currentRole;
        };
    }

    @Override
    public List<UserResponse> getAllUsers() {
        List<User> userList = userRepository.findAll();
        return userList.stream()
                .map(DtoConverter::convertToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse getUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        return DtoConverter.convertToUserResponse(user);
    }

    @Override
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        return DtoConverter.convertToUserResponse(user);
    }

    @Override
    public UserResponse updateUser(Integer id, String email, String firstName, String lastName) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        userRepository.save(user);
        return DtoConverter.convertToUserResponse(user);
    }

    @Override
    public UserResponse updatePassword(Integer id, String oldPass, String newPass) {
        if (oldPass == null || newPass == null) {
            throw new IllegalArgumentException("Passwords cannot be null");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        if (!passwordEncoder.matches(oldPass, user.getPassword())) {
            throw new IllegalStateException("Incorrect password provided");
        } else {
            String newPassConv = passwordEncoder.encode(newPass);
            user.setPassword(newPassConv);
            userRepository.save(user);
            return DtoConverter.convertToUserResponse(user);
        }
    }



}
