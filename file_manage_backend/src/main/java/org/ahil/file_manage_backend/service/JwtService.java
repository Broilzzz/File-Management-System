package org.ahil.file_manage_backend.service;

import org.springframework.security.core.userdetails.UserDetails;

public interface JwtService {
    String extractUserName(String jwt);
    boolean isTokenValid(String token, UserDetails userDetails);
    String generateToken(UserDetails userDetails);

}
