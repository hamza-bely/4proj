package com.supinfo.api_traficandme.user.dto;

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
