package com.supinfo.api_traficandme.security.service;


import com.supinfo.api_traficandme.security.dto.AuthenticateRequest;
import com.supinfo.api_traficandme.security.dto.AuthenticateResponse;
import com.supinfo.api_traficandme.security.dto.RegisterRequest;
import com.supinfo.api_traficandme.User.entity.UserInfo;
import com.supinfo.api_traficandme.User.repository.UserRepository;
import com.supinfo.api_traficandme.common.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtAuthService jwtAuthService;
    private final AuthenticationManager authenticationManager;

    public AuthenticateResponse register(RegisterRequest request) {
        var  user = UserInfo.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Role.User)
                .build();
        userRepository.save(user);

        System.out.println("Saved User Role: " + user.getRoles());
        System.out.println("Saved User Authorities: " + user.getAuthorities());
        var jwtToken = jwtAuthService.generateToken(user);
        return AuthenticateResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticateResponse authenticate(AuthenticateRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        var jwtToken = jwtAuthService.generateToken(user);
        return AuthenticateResponse.builder()
                .token(jwtToken)
                .build();
    }
}

