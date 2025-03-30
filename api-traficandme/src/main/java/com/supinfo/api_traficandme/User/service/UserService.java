package com.supinfo.api_traficandme.User.service;

import com.supinfo.api_traficandme.User.dto.UserMapper;
import com.supinfo.api_traficandme.User.dto.UserRequest;
import com.supinfo.api_traficandme.User.dto.UserResponse;
import com.supinfo.api_traficandme.User.entity.UserInfo;
import com.supinfo.api_traficandme.User.repository.UserRepository;
import com.supinfo.api_traficandme.common.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    public UserInfo findUser(String Username){
        return userRepository.findByEmail(Username).orElseThrow();
    }

    public List<UserResponse> getAllUsers(){
        return userRepository.findAll()
                .stream().map(this.userMapper::toResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Integer id){
        return userRepository.findById(id)
                .map(this.userMapper::toResponse)
                .orElseThrow();
    }

    public UserResponse getUserByEmail(String email){
        return userRepository.findByEmail(email)
                .map(this.userMapper::toResponse)
                .orElseThrow();
    }

    public Integer createUser(UserRequest user){
       getOneUserByEmail(user.email());
        var createdUser = userRepository.save(userMapper.toModel(user));
        return createdUser.getId();
    }

    public void deleteUser(Integer id){
        userRepository.deleteById(id);
    }

    public void updateUser(Integer id, UserRequest request){

        var userToUpdate = userRepository.findById(id).orElseThrow();
          mergeUser(userToUpdate, request);
    }

    public void mergeUser(UserInfo userToUpdate, UserRequest user){
        userToUpdate.setFirstName(user.firstName());
        userToUpdate.setLastName(user.lastName());
        userToUpdate.setEmail(user.email());
        userToUpdate.setRoles(Role.valueOf(user.role()));
        userToUpdate.setPassword(userToUpdate.getPassword());
        userRepository.save(userToUpdate);
    }

    public boolean deleteUser(String email){
        Optional<UserInfo> user = userRepository.findByEmail(email);
        if(user.isPresent()){
            userRepository.delete(user.get());
            return true;
        }
        return false;
    }

    public UserInfo getOneUserByEmail(String email){

        return userRepository.findOneByEmail(email);
    }

    /*
    public void softDeleteUser(String email){
        Optional<UserInfo> user = userRepository.findByEmail(email);
        if(user.isPresent()){
            user.get().setFlSup("N");
            userRepository.save(user.get());
        }
    }
     */
}
