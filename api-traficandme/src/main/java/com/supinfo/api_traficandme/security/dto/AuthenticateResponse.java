package com.supinfo.api_traficandme.security.dto;

import com.supinfo.api_traficandme.User.dto.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticateResponse {
    private String token;
    private UserResponse user;
}
