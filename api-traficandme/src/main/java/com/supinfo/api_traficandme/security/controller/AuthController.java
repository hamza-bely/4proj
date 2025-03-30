package com.supinfo.api_traficandme.security.controller;

import com.supinfo.api_traficandme.security.dto.AuthenticateRequest;
import com.supinfo.api_traficandme.security.dto.AuthenticateResponse;
import com.supinfo.api_traficandme.security.dto.RegisterRequest;
import com.supinfo.api_traficandme.security.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService service;

    public AuthController( AuthService service){
        this.service = service;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticateResponse> register(
            @RequestBody RegisterRequest request
    ) {
        return new ResponseEntity<>(service.register(request), HttpStatus.CREATED);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticateResponse> register(
            @RequestBody AuthenticateRequest request
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }


}