package com.supinfo.api_traficandme.User.dto;

import java.util.Date;

public record UserResponse(
        Integer id,
        String username,
        String email,
        String role,
        String status,
        Date createDate,
        Date updateDate
) {
}
