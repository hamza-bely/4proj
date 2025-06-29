package com.supinfo.api_traficandme.user.service;

import com.supinfo.api_traficandme.common.Role;
import com.supinfo.api_traficandme.user.dto.StatusUser;
import com.supinfo.api_traficandme.user.dto.UserMapper;
import com.supinfo.api_traficandme.user.dto.UserRequest;
import com.supinfo.api_traficandme.user.dto.UserResponse;
import com.supinfo.api_traficandme.user.entity.UserInfo;
import com.supinfo.api_traficandme.user.repository.UserRepository;
import com.supinfo.api_traficandme.reports.entity.Report;
import com.supinfo.api_traficandme.reports.repository.ReportRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AdminService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final ReportRepository reportRepository;

    public AdminService (ReportRepository reportRepository, UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper= userMapper;
        this.reportRepository =reportRepository;
    }

    public boolean deleteUserForAnAdmin(Integer id){
        Optional<UserInfo> user = userRepository.findById(id);
        if(user.isPresent()){
            userRepository.delete(user.get());
            return true;
        }
        return false;
    }

    public UserResponse changeStatusUserForAnAdmin(Integer id, StatusUser newStatus) {
        if (newStatus == null || !EnumSet.allOf(StatusUser.class).contains(newStatus)) {
            throw new IllegalArgumentException("Status \"" + newStatus + "\" does not exist");
        }

        UserInfo user = userRepository.findById(id).orElseThrow(() ->
                new RuntimeException("User not found with id: " + id));

        user.setStatus(newStatus);
        user.setUpdateDate(new Date());


        ///TODO FAIRE LA MEMEM CHOSE AVEC LE ROUTE CHANGE le EMAIL "Anonymous User"
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

            reportRepository.saveAll(userReports);
        }

        UserResponse userCanceled = userRepository.findById(user.getId())
                .map(this.userMapper::toResponse)
                .orElseThrow();;

        return userCanceled;
    }

    public long countUsersByStatus(StatusUser status) {
        return userRepository.countByStatus(status);
    }

    public UserResponse updateUserByAdmin(Integer id, UserRequest request) {

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

        return userMapper.toResponse(user);

    }

    private boolean isNullOrEmpty(String value) {
        return value == null || value.trim().isEmpty();
    }
}
