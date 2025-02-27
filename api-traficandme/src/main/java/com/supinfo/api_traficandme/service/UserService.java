package com.supinfo.api_traficandme.service;


import com.supinfo.api_traficandme.entity.UserInfo;
import com.supinfo.api_traficandme.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserInfo findUser(String Username){
        return userRepository.findByEmail(Username);
    }
}
