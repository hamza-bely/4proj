package com.supinfo.api_traficandme.traffic.controller;

import com.supinfo.api_traficandme.User.dto.StatusUser;
import com.supinfo.api_traficandme.User.dto.UserResponse;
import com.supinfo.api_traficandme.User.service.UserService;
import com.supinfo.api_traficandme.security.dto.ApiResponse;
import com.supinfo.api_traficandme.traffic.dto.TrafficRequest;
import com.supinfo.api_traficandme.traffic.model.TrafficModel;
import com.supinfo.api_traficandme.traffic.service.TrafficService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/traffic")
@CrossOrigin (origins = "*")
public class TrafficController {
    //TODO AJOUTER LE @PreAuthorize

    private final TrafficService trafficService;
    private final UserService userService;
    public TrafficController(TrafficService trafficService, UserService userService) {
        this.trafficService = trafficService;
        this.userService = userService;
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<TrafficModel>> create(@RequestBody TrafficRequest request) {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UserResponse connectedUser = userService.getUserByEmail(((UserDetails) principal).getUsername());
            if(connectedUser.username() == null){
                throw new IllegalArgumentException("User not found");
            }

            TrafficModel traffic = trafficService.createTraffic(request, connectedUser);
            return ResponseEntity.ok(new ApiResponse<>("TrafficData fetched successfully", traffic));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/get-all")
    public ResponseEntity<ApiResponse<List<TrafficModel>>> getAll() {
        try {
            List<TrafficModel> trafficList = trafficService.getAllTraffic();
            return ResponseEntity.ok(new ApiResponse<>("TrafficData fetched successfully", trafficList));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/user")
    public ResponseEntity<ApiResponse<List<TrafficModel>>> getAllByUser() {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UserResponse userConnected = userService.getUserByEmail(((UserDetails) principal).getUsername());
            if(userConnected.username() == null){
                throw new IllegalArgumentException("User undefined");
            }
            List<TrafficModel> userTrafficList = trafficService.getAllTrafficByUser(userConnected);
            return ResponseEntity.ok(new ApiResponse<>("traffic by user was successfully fetched",userTrafficList ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @DeleteMapping("{id}/delete-for-an-user")
    public ResponseEntity<ApiResponse<TrafficModel>> deleteForAnUSer(@PathVariable Integer id) {
        try {
            TrafficModel traffic = trafficService.deleteTrafficForAnUser(id);
            return ResponseEntity.ok(new ApiResponse<>("Report deleted successfully", traffic));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @DeleteMapping("{id}/delete-definitive")
    public ResponseEntity<ApiResponse<Void>> deleteDefinitive(@PathVariable Integer id) {
        try {
            trafficService.deleteDefinitiveTrafficForAnAdmin(id);
            return ResponseEntity.ok(new ApiResponse<>("Report deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }
}
