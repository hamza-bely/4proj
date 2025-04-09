package com.supinfo.api_traficandme.security.service;

import com.supinfo.api_traficandme.User.dto.UserResponse;
import com.supinfo.api_traficandme.security.dto.AuthenticateRequest;
import com.supinfo.api_traficandme.security.dto.AuthenticateResponse;
import com.supinfo.api_traficandme.security.dto.RegisterRequest;
import com.supinfo.api_traficandme.User.entity.UserInfo;
import com.supinfo.api_traficandme.User.repository.UserRepository;
import com.supinfo.api_traficandme.common.Role;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtAuthService jwtAuthService;
    private final AuthenticationManager authenticationManager;


    public AuthService (UserRepository userRepository,PasswordEncoder passwordEncoder,JwtAuthService jwtAuthService,AuthenticationManager authenticationManager){
        this.userRepository =userRepository;
        this.passwordEncoder =passwordEncoder;
        this.jwtAuthService =jwtAuthService;
        this.authenticationManager =authenticationManager;
    }

    public AuthenticateResponse register(RegisterRequest request) {

        if (isNullOrEmpty(request.getFirstName())) throw new IllegalArgumentException("First name is required.");
        if (isNullOrEmpty(request.getLastName())) throw new IllegalArgumentException("Last name is required.");
        if (isNullOrEmpty(request.getEmail())) throw new IllegalArgumentException("Email is required.");
        if (isNullOrEmpty(request.getPassword())) throw new IllegalArgumentException("Password is required.");

        if (request.getPassword().length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long.");
        }
        if (!Pattern.compile(".*[0-9].*").matcher(request.getPassword()).matches()) {
            throw new IllegalArgumentException("Password must contain at least one digit.");
        }
        if (!Pattern.compile(".*[!@#$%^&*(),.?\":{}|<>].*").matcher(request.getPassword()).matches()) {
            throw new IllegalArgumentException("Password must contain at least one special character.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use.");
        }

        UserInfo user = new UserInfo(
                null,
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                Role.USER
        );
        userRepository.save(user);

        System.out.println("Saved User Role: " + user.getRoles());
        System.out.println("Saved User Authorities: " + user.getAuthorities());
        String jwtToken = jwtAuthService.generateToken(user);
        return new AuthenticateResponse(
                jwtToken,
                new UserResponse(
                        user.getId(),
                        user.getFirstName() + " " + user.getLastName(),
                        user.getEmail(),
                        user.getRoles().name(),
                        user.getStatus().name(),
                        user.getCreateDate(),
                        user.getUpdateDate()
                )
        );

    }

    public AuthenticateResponse authenticate(AuthenticateRequest request) {
        if (isNullOrEmpty(request.getEmail())) throw new IllegalArgumentException("Email is required.gatoire.");
        if (isNullOrEmpty(request.getPassword())) throw new IllegalArgumentException("The mot de passe is obligatory.");

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new IllegalArgumentException("Email or many passes invalid.");
        }
        UserInfo user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        String jwtToken = jwtAuthService.generateToken(user);
        return new AuthenticateResponse(
                jwtToken,
                new UserResponse(
                        user.getId(),
                        user.getFirstName() + " " + user.getLastName(),
                        user.getEmail(),
                        user.getRoles().name(),
                        user.getStatus().name(),
                        user.getCreateDate(),
                        user.getUpdateDate()
                )
        );

    }

    public UserInfo getOneUserByEmail(String email){
        return userRepository.findOneByEmail(email);
    }

    private boolean isNullOrEmpty(String value) {
        return value == null || value.trim().isEmpty();
    }
}

