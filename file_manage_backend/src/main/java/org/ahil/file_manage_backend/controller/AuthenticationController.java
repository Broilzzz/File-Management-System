package org.ahil.file_manage_backend.controller;

import lombok.RequiredArgsConstructor;
import org.ahil.file_manage_backend.dto.request.SigninRequest;
import org.ahil.file_manage_backend.dto.request.SignupRequest;
import org.ahil.file_manage_backend.dto.response.JwtAuthenticationResponse;
import org.ahil.file_manage_backend.service.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/signup")
    public ResponseEntity<String> register(@RequestBody SignupRequest signupRequest){
        return ResponseEntity.ok(authenticationService.register(signupRequest));
    }

    @PostMapping("/signin")
    public ResponseEntity<JwtAuthenticationResponse> signin(@RequestBody SigninRequest signinRequest){
        return ResponseEntity.ok(authenticationService.signin(signinRequest));
    }

    @PostMapping("/register/resend")
    public ResponseEntity<String> resendVerificationEmail(@RequestParam String email){
        return ResponseEntity.ok(authenticationService.resendVerificationEmail(email));
    }

    @GetMapping("/confirm")
    public ResponseEntity<String> confirm(@RequestParam String token){
        return ResponseEntity.ok(authenticationService.confirm(token));
    }
}
