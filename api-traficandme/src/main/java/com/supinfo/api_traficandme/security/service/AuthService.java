package com.supinfo.api_traficandme.security.service;

import com.supinfo.api_traficandme.User.dto.UserResponse;
import com.supinfo.api_traficandme.security.dto.AuthenticateRequest;
import com.supinfo.api_traficandme.security.dto.AuthenticateResponse;
import com.supinfo.api_traficandme.security.dto.RegisterRequest;
import com.supinfo.api_traficandme.User.entity.UserInfo;
import com.supinfo.api_traficandme.User.repository.UserRepository;
import com.supinfo.api_traficandme.common.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtAuthService jwtAuthService;
    private final AuthenticationManager authenticationManager;

    public AuthenticateResponse register(RegisterRequest request) {

        if (isNullOrEmpty(request.getFirstName())) throw new IllegalArgumentException("Le prénom est obligatoire.");
        if (isNullOrEmpty(request.getLastName())) throw new IllegalArgumentException("Le nom est obligatoire.");
        if (isNullOrEmpty(request.getEmail())) throw new IllegalArgumentException("L'email est obligatoire.");
        if (isNullOrEmpty(request.getPassword())) throw new IllegalArgumentException("Le mot de passe est obligatoire.");

        if (request.getPassword().length() < 16) {
            throw new IllegalArgumentException("Le mot de passe doit comporter au moins 16 caractères.");
        }
        if (!Pattern.compile(".*[0-9].*").matcher(request.getPassword()).matches()) {
            throw new IllegalArgumentException("Le mot de passe doit contenir au moins un chiffre.");
        }
        if (!Pattern.compile(".*[!@#$%^&*(),.?\":{}|<>].*").matcher(request.getPassword()).matches()) {
            throw new IllegalArgumentException("Le mot de passe doit contenir au moins un caractère spécial.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("L'email est déjà utilisé.");
        }

        var user = UserInfo.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Role.User)
                .build();
        userRepository.save(user);

        System.out.println("Saved User Role: " + user.getRoles());
        System.out.println("Saved User Authorities: " + user.getAuthorities());
        String jwtToken = jwtAuthService.generateToken(user);
        return AuthenticateResponse.builder()
                .token(jwtToken)
                .user(new UserResponse(
                        user.getId(),
                        user.getFirstName()+" "+user.getLastName(),
                        user.getEmail(),
                        user.getRoles().name()
                ))
                .build();
    }

    public AuthenticateResponse authenticate(AuthenticateRequest request) {
        if (isNullOrEmpty(request.getEmail())) throw new IllegalArgumentException("L'email est obligatoire.");
        if (isNullOrEmpty(request.getPassword())) throw new IllegalArgumentException("Le mot de passe est obligatoire.");

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new IllegalArgumentException("Email ou mot de passe invalide.");
        }
        UserInfo user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        String jwtToken = jwtAuthService.generateToken(user);
        return AuthenticateResponse.builder()
                .token(jwtToken)
                .user(new UserResponse(
                        user.getId(),
                        user.getFirstName()+" "+user.getLastName(),
                        user.getEmail(),
                        user.getRoles().name()
                ))
                .build();
    }

    public UserInfo getOneUserByEmail(String email){
        return userRepository.findOneByEmail(email);

    }

    private boolean isNullOrEmpty(String value) {
        return value == null || value.trim().isEmpty();
    }
}

