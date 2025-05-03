package com.supinfo.api_traficandme.repository;

import com.supinfo.api_traficandme.common.Role;
import com.supinfo.api_traficandme.user.dto.StatusUser;
import com.supinfo.api_traficandme.user.entity.UserInfo;
import com.supinfo.api_traficandme.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
@ActiveProfiles("test")
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    @BeforeEach
    void setUp() {
        UserInfo user = UserInfo.builder()
                .firstName("Robert")
                .lastName("Brown")
                .email("robert.brown@example.com")
                .password("password123")
                .roles(Role.USER)
                .status(StatusUser.ACTIVE)
                .build();

        userRepository.save(user);
    }

    @Test
    void shouldFindAllUsers() {
        List<UserInfo> users = userRepository.findAll();
        assertEquals(21, users.size());
        assertEquals("robert.brown@example.com", users.get(20).getEmail());
    }

    @Test
    void shouldUpdateUser(){
        UserInfo foundUser = userRepository.findById(2).orElse(null);
        if (foundUser != null) {
            foundUser.setFirstName("UpdatedName");
            userRepository.save(foundUser);
        }
        assertEquals("jane.smith@example.com", foundUser.getEmail());
        assertEquals("UpdatedName", foundUser.getFirstName());
    }

    @Test
    void shouldDeleteUser(){
        UserInfo foundUser = userRepository.findById(20).orElse(null);
        if (foundUser != null) {
            userRepository.delete(foundUser);
        }
        List<UserInfo> users = userRepository.findAll();
        assertEquals(20, users.size());
    }

    @Test
    void shouldCountAllUsers() {
        long count = userRepository.count();
        assertEquals(21, count);
    }
}
