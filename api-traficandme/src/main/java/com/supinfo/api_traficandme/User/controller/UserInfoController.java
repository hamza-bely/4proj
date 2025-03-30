package com.supinfo.api_traficandme.User.controller;

import com.supinfo.api_traficandme.User.dto.UserRequest;
import com.supinfo.api_traficandme.User.dto.UserResponse;
import com.supinfo.api_traficandme.User.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserInfoController {
    private  final UserService userService;

    @PostMapping("create")
    //@PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Integer> createUser(@Valid @RequestBody UserRequest request){
        var use = userService.getOneUserByEmail(request.email());
        if (use != null){
            return new ResponseEntity<>(Integer.valueOf("User already exists"),HttpStatus.BAD_REQUEST);
        }
        var userId = userService.createUser(request);
        return new ResponseEntity<>(userId, HttpStatus.CREATED);
    }

    @GetMapping("list")
    //@PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUser(){
        var list = userService.getAllUsers();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("getUser/{userId}")
    //@PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<UserResponse> getUser(@PathVariable("userId") Integer userId){
        var user = userService.getUserById(userId);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("update/{userId}")
    //@PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> updateUser(@PathVariable ("userId") String userId,@Valid @RequestBody UserRequest request){
         userService.updateUser(Integer.valueOf(userId),request);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
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
    public ResponseEntity<UserResponse> getUSerConnected() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var userAuthenticated = userService.getUserByEmail(((UserDetails) principal).getUsername());
        return new ResponseEntity<>(userAuthenticated, HttpStatus.OK);
    }
}
