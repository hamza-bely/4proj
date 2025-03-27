package com.supinfo.api_traficandme.security.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticateRequest {
    @NotBlank(message = "Email is required")
    @NotNull(message = "User Email is required")
    @Email(message = "Customer Email is not a valid email address")
    private String email;
    private String password;
}
