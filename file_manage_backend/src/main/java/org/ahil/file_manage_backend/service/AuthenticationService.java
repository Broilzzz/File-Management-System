package org.ahil.file_manage_backend.service;

import org.ahil.file_manage_backend.dto.request.SigninRequest;
import org.ahil.file_manage_backend.dto.request.SignupRequest;
import org.ahil.file_manage_backend.dto.response.JwtAuthenticationResponse;

public interface AuthenticationService {

    String register(SignupRequest signupRequest);

    String confirm(String token);

    String resendVerificationEmail(String email);

    JwtAuthenticationResponse signin(SigninRequest signinRequest);
}
