package com.supinfo.api_traficandme.User.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserRequest(
        Integer id,
        String firstName,
        String lastName,
        String email,
        String password,
        String role,
        String status
) {
}
