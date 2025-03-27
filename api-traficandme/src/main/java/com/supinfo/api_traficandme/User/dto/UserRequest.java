package com.supinfo.api_traficandme.User.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserRequest(
        Integer id,
        @NotNull(message = "First Name is required")
        String firstName,
        @NotNull(message = "Last Name is required")
        String lastName,
        @NotBlank(message = "Email is required")
        @NotNull(message = "User Email is required")
        @Email(message = "Customer Email is not a valid email address")
        String email,
        @NotNull(message = "password is required")
        String password,
        @NotNull(message = "Role is required")
        String role
) {
}
