package com.supinfo.api_traficandme.User.dto;

public record UserResponse(
        Integer id,
        String username,
        String email,
        String role
) {
}
