package com.supinfo.api_traficandme.User.dto;

import com.supinfo.api_traficandme.User.entity.UserInfo;
import com.supinfo.api_traficandme.common.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMapper {
    private final PasswordEncoder passwordEncoder;

    public UserInfo toModel(UserRequest request) {
        return UserInfo.builder()
                .id(request.id())
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .roles(Role.valueOf(request.role()))
                .build();
    }

    public UserResponse toResponse(UserInfo userInfo) {
        return new UserResponse(
                userInfo.getId(),
                userInfo.getFirstName() +" "+ userInfo.getLastName(),
                userInfo.getEmail(),
                userInfo.getRoles().name()
        );
    }
}
