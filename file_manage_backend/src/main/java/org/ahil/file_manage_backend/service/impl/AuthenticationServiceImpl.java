package org.ahil.file_manage_backend.service.impl;

import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.ahil.file_manage_backend.dto.request.SigninRequest;
import org.ahil.file_manage_backend.dto.request.SignupRequest;
import org.ahil.file_manage_backend.dto.response.JwtAuthenticationResponse;
import org.ahil.file_manage_backend.entity.Token;
import org.ahil.file_manage_backend.entity.User;
import org.ahil.file_manage_backend.enums.Role;
import org.ahil.file_manage_backend.repository.TokenRepository;
import org.ahil.file_manage_backend.repository.UserRepository;
import org.ahil.file_manage_backend.service.JwtService;
import org.ahil.file_manage_backend.service.AuthenticationService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private static final String CONFIRMATION_URL = "http://localhost:8080/api/v1/auth/confirm?token=%s";

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final TokenRepository tokenRepository;
    private final EmailServiceImpl emailService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    @Transactional
    public String register(SignupRequest signupRequest){

        //check if user exists or not
        boolean userExists = repository.findByEmail(signupRequest.getEmail()).isPresent();
        if(userExists){
            throw new IllegalStateException("A user already exists with the same email");
        }

        //transfer the info from registerDto to User
        User user = User.builder()
                .firstName(signupRequest.getFirstName())
                .lastName(signupRequest.getLastName())
                .email(signupRequest.getEmail())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .role(Role.EMPLOYEE)
                .build();

        //save the user
        User savedUser = repository.save(user);

        //generate a token
        String generatedToken = UUID.randomUUID().toString();
        Token token = Token.builder()
                .token(generatedToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .user(savedUser)
                .build();
        tokenRepository.save(token);

        //send email verification
        try {
            emailService.send(
                    signupRequest.getEmail(),
                    signupRequest.getFirstName(),
                    "confirm-email",
                    String.format(CONFIRMATION_URL,generatedToken)
            );
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }

        //return user registered successfully
        return generatedToken;
    }

    @Override
    public String confirm(String token) {

        Token savedToken = tokenRepository.findByToken(token).orElseThrow(()-> new IllegalStateException("token not found"));

        //expired or not
        if(LocalDateTime.now().isAfter(savedToken.getExpiresAt())){
            //generate a token
            String generatedToken = UUID.randomUUID().toString();
            Token newToken = Token.builder()
                    .token(generatedToken)
                    .createdAt(LocalDateTime.now())
                    .expiresAt(LocalDateTime.now().plusMinutes(10))
                    .user(savedToken.getUser())
                    .build();
            tokenRepository.save(newToken);

            //send email verification
            try {
                emailService.send(
                        savedToken.getUser().getEmail(),
                        savedToken.getUser().getFirstName(),
                        "confirm-email",
                        String.format(CONFIRMATION_URL,generatedToken)
                );
            } catch (MessagingException e) {
                throw new RuntimeException(e);
            }
            return "Token expired, a new token has been sent to your email";
        }

        User user = repository.findById(savedToken.getUser().getId()).orElseThrow(()-> new IllegalStateException("User not found"));
        user.setEnabled(true);

        savedToken.setActivatedAt(LocalDateTime.now());
        tokenRepository.save(savedToken);

        //generate JWT upon successful confirmation
        String jwt = jwtService.generateToken(user);

        return "<h1>Account has been successfully enabled</h1><p>Your JWT: " + jwt + "</p>";
    }

    @Override
    public String resendVerificationEmail(String email) {

        //check if user exists
        User user = repository.findByEmail(email).orElseThrow(()-> new IllegalStateException("user not found"));

        // check if the user is already enabled
        if (user.isEnabled()) {
            return "User is already enabled.";
        }

        // check for an existing unexpired token
        Optional<Token> existingTokenOpt = tokenRepository.findByUserAndExpiresAtAfter(user, LocalDateTime.now());

        String tokenToSend;

        if(existingTokenOpt.isPresent()){
            tokenToSend = existingTokenOpt.get().getToken();
        }else{
            // generate a new token
            tokenToSend = UUID.randomUUID().toString();
            Token token = Token.builder()
                    .token(tokenToSend)
                    .createdAt(LocalDateTime.now())
                    .expiresAt(LocalDateTime.now().plusMinutes(10))
                    .user(user)
                    .build();
            tokenRepository.save(token);

            // send email verification
            try {
                emailService.send(
                        user.getEmail(),
                        user.getFirstName(),
                        "confirm-email",
                        String.format(CONFIRMATION_URL, tokenToSend)
                );
            } catch (MessagingException e) {
                throw new RuntimeException(e);
            }
        }
        return "Verification Link has been sent";
    }

    @Override
    public JwtAuthenticationResponse signin(SigninRequest signinRequest){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(signinRequest.getEmail(),signinRequest.getPassword()));
        var user = userRepository.findByEmail(signinRequest.getEmail()).orElseThrow(()-> new IllegalStateException("Invalid Email or password"));
        //generate the token
        var jwt =jwtService.generateToken(user);
        System.out.println("jwt flag: "+jwt);

        //save the last login time
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        return JwtAuthenticationResponse.builder().token(jwt).build();
    }

}
