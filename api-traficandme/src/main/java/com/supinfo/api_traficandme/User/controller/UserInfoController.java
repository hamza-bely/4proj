package com.supinfo.api_traficandme.User.controller;

import com.supinfo.api_traficandme.User.dto.UserRequest;
import com.supinfo.api_traficandme.User.dto.UserResponse;
import com.supinfo.api_traficandme.User.entity.UserInfo;
import com.supinfo.api_traficandme.User.service.UserService;
import com.supinfo.api_traficandme.security.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")

public class UserInfoController {
    private  final UserService userService;

    public UserInfoController(UserService userService,PasswordEncoder passwordEncoder){
        this.userService = userService;
    }

    @PostMapping("create")
    //@PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@Valid @RequestBody UserRequest request){
        try {
            UserResponse response = userService.createUser(request);
            ApiResponse<UserResponse> apiResponse = new ApiResponse<>("Created user", response);
            return ResponseEntity.ok(apiResponse);
        } catch (RuntimeException e) {
            ApiResponse<UserResponse> errorResponse = new ApiResponse<>(e.getMessage(), null);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("list")
    //@PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUser(){
        try {
            List<UserResponse> response = userService.getAllUsers();
            ApiResponse<List<UserResponse>> apiResponse = new ApiResponse<>("List users", response);
            return ResponseEntity.ok(apiResponse);
        } catch (RuntimeException e) {
            ApiResponse<List<UserResponse>> errorResponse = new ApiResponse<>(e.getMessage(), null);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("getUser/{userId}")
    //@PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<UserResponse> getUser(@PathVariable("userId") Integer userId){
        var user = userService.getUserById(userId);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("update/{userId}")
    //@PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(@PathVariable ("userId") String userId,@Valid @RequestBody UserRequest request){
        try {
            UserResponse response = userService.updateUser(Integer.valueOf(userId),request);
            ApiResponse<UserResponse> apiResponse = new ApiResponse<>("Updated User", response);
            return ResponseEntity.ok(apiResponse);
        } catch (RuntimeException e) {
            ApiResponse<UserResponse> errorResponse = new ApiResponse<>(e.getMessage(), null);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @DeleteMapping("delete/{userId}")
    //@PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable("userId") Integer userId){
        userService.deleteUser(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/info")
    public Map<String, Object> userInfo(OAuth2AuthenticationToken authentication) {
        // Return the user's attributes as a map
        return authentication.getPrincipal().getAttributes();
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getUSerConnected() {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UserResponse response = userService.getUserByEmail(((UserDetails) principal).getUsername());
            ApiResponse<UserResponse> apiResponse = new ApiResponse<>("User", response);
            return ResponseEntity.ok(apiResponse);
        } catch (RuntimeException e) {
            ApiResponse<UserResponse> errorResponse = new ApiResponse<>(e.getMessage(), null);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
