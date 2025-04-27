package com.supinfo.api_traficandme.user.service;

import com.supinfo.api_traficandme.user.dto.StatusUser;
import com.supinfo.api_traficandme.user.dto.UserMapper;
import com.supinfo.api_traficandme.user.dto.UserRequest;
import com.supinfo.api_traficandme.user.dto.UserResponse;
import com.supinfo.api_traficandme.user.entity.UserInfo;
import com.supinfo.api_traficandme.user.repository.UserRepository;
import com.supinfo.api_traficandme.common.Role;
import com.supinfo.api_traficandme.reports.entity.Report;
import com.supinfo.api_traficandme.reports.repository.ReportRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final ReportRepository reportRepository;

    public UserService (ReportRepository reportRepository,UserRepository userRepository,UserMapper userMapper,PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper= userMapper;
        this.passwordEncoder =passwordEncoder;
        this.reportRepository = reportRepository;
    }

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

    public UserInfo getUserByEmailUserInfo(String email){
        return userRepository.findByEmail(email).orElseThrow();
    }

    public UserResponse createUser(UserRequest request){
        if (isNullOrEmpty(request.firstName())) throw new IllegalArgumentException("First name is required.");
        if (isNullOrEmpty(request.lastName())) throw new IllegalArgumentException("Last name is required.");
        if (isNullOrEmpty(request.email())) throw new IllegalArgumentException("Email is required.");
        if (isNullOrEmpty(request.password())) throw new IllegalArgumentException("Password is required.");

        if (request.password().length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long.");
        }
        if (!Pattern.compile(".*[0-9].*").matcher(request.password()).matches()) {
            throw new IllegalArgumentException("Password must contain at least one digit.");
        }
        if (!Pattern.compile(".*[!@#$%^&*(),.?\":{}|<>].*").matcher(request.password()).matches()) {
            throw new IllegalArgumentException("Password must contain at least one special character.");
        }

        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email is already in use.");
        }

        UserInfo user = new UserInfo(
                null,
                request.firstName(),
                request.lastName(),
                request.email(),
                passwordEncoder.encode(request.password()),
                Role.valueOf(request.role())
        );

        userRepository.save(user);

        System.out.println("Saved User Role: " + user.getRoles());
        System.out.println("Saved User Authorities: " + user.getAuthorities());
        return new UserResponse(
                        user.getId(),
                        user.getFirstName() + " " + user.getLastName(),
                        user.getEmail(),
                        user.getRoles().name(),
                        user.getStatus().name(),
                        user.getCreateDate(),
                        user.getUpdateDate()
        );
    }

    public void deleteUser(Integer id){
        userRepository.deleteById(id);
    }

    public UserInfo updateUser(Integer id, UserRequest request) {

        var user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        if (isNullOrEmpty(request.firstName())) throw new IllegalArgumentException("First name is required.");
        if (isNullOrEmpty(request.lastName())) throw new IllegalArgumentException("Last name is required.");
        if (isNullOrEmpty(request.email())) throw new IllegalArgumentException("Email is required.");
        if (isNullOrEmpty(request.role())) throw new IllegalArgumentException("Role is required.");

        if (!user.getEmail().equals(request.email()) && userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email is already in use.");
        }

        String updatedPassword = user.getPassword();
        if (!isNullOrEmpty(request.password())) {
            if (request.password().length() < 8) {
                throw new IllegalArgumentException("Password must be at least 8 characters long.");
            }
            if (!Pattern.compile(".*[0-9].*").matcher(request.password()).matches()) {
                throw new IllegalArgumentException("Password must contain at least one digit.");
            }
            if (!Pattern.compile(".*[!@#$%^&*(),.?\":{}|<>].*").matcher(request.password()).matches()) {
                throw new IllegalArgumentException("Password must contain at least one special character.");
            }
            updatedPassword = request.password();
        }

        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email());
        user.setPassword(updatedPassword);
        user.setRoles(Role.valueOf(request.role().toUpperCase()));

        if (request.status() != null) {
            user.setStatus(StatusUser.valueOf(request.status().toUpperCase()));
        }

        userRepository.save(user);

        return user;
    }

    public void mergeUser(UserInfo userToUpdate, UserRequest user){
        userToUpdate.setFirstName(user.firstName());
        userToUpdate.setLastName(user.lastName());
        userToUpdate.setEmail(user.email());
        userToUpdate.setRoles(Role.valueOf(user.role()));
        userToUpdate.setPassword(userToUpdate.getPassword());
        userRepository.save(userToUpdate);
    }

    public UserInfo changeStatusUser(StatusUser newStatus,UserResponse userConnected) {

        if (newStatus == null || !EnumSet.allOf(StatusUser.class).contains(newStatus)) {
            throw new IllegalArgumentException("Status \"" + newStatus + "\" does not exist");
        }

        UserInfo user = userRepository.findById(userConnected.id()).orElseThrow(() ->
                new RuntimeException("User not found with id: " + userConnected.id()));

        user.setStatus(newStatus);
        user.setUpdateDate(new Date());

        ///TODO FAIRE LA MEMEM CHOSE AVEC LE ROUTE CHANGE  LE EMAIL  AVEC "Anonymous User"
        if (newStatus == StatusUser.DELETED) {
            String randomSuffix = UUID.randomUUID().toString().substring(0, 8);

            String originalUsername = user.getUsername();

            user.setEmail("deleted_" + randomSuffix + "@example.com");
            user.setFirstName("Anonymous");
            user.setLastName("User");
            user.setPassword(UUID.randomUUID().toString());


            List<Report> userReports = reportRepository.findAll().stream()
                    .filter(report -> report.getUser().equals(originalUsername))
                    .collect(Collectors.toList());

            for (Report report : userReports) {
                report.setUser("Anonymous User");
            }
        }

        return userRepository.save(user);
    }

    public UserInfo getOneUserByEmail(String email){
        return userRepository.findOneByEmail(email);
    }

    private boolean isNullOrEmpty(String value) {
        return value == null || value.trim().isEmpty();
    }

}
