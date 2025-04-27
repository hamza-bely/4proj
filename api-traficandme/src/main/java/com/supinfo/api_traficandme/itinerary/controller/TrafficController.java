package com.supinfo.api_traficandme.itinerary.controller;

import com.supinfo.api_traficandme.user.dto.UserResponse;
import com.supinfo.api_traficandme.user.service.UserService;
import com.supinfo.api_traficandme.security.dto.ApiResponse;
import com.supinfo.api_traficandme.itinerary.dto.TrafficRequest;
import com.supinfo.api_traficandme.itinerary.entity.Traffic;
import com.supinfo.api_traficandme.itinerary.service.TrafficService;
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
    public ResponseEntity<ApiResponse<Traffic>> create(@RequestBody TrafficRequest request) {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UserResponse connectedUser = userService.getUserByEmail(((UserDetails) principal).getUsername());
            if(connectedUser.username() == null){
                throw new IllegalArgumentException("User not found");
            }

            Traffic traffic = trafficService.createTraffic(request, connectedUser);
            return ResponseEntity.ok(new ApiResponse<>("TrafficData fetched successfully", traffic));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/get-all")
    public ResponseEntity<ApiResponse<List<Traffic>>> getAll() {
        try {
            List<Traffic> trafficList = trafficService.getAllTraffic();
            return ResponseEntity.ok(new ApiResponse<>("TrafficData fetched successfully", trafficList));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/user")
    public ResponseEntity<ApiResponse<List<Traffic>>> getAllByUser() {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UserResponse userConnected = userService.getUserByEmail(((UserDetails) principal).getUsername());
            if(userConnected.username() == null){
                throw new IllegalArgumentException("User undefined");
            }
            List<Traffic> userTrafficList = trafficService.getAllTrafficByUser(userConnected);
            return ResponseEntity.ok(new ApiResponse<>("Traffic by user was successfully fetched",userTrafficList ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @DeleteMapping("{id}/delete-for-an-user")
    public ResponseEntity<ApiResponse<Traffic>> deleteForAnUSer(@PathVariable Integer id) {
        try {
            Traffic traffic = trafficService.deleteTrafficForAnUser(id);
            return ResponseEntity.ok(new ApiResponse<>("Traffic deleted successfully", traffic));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @DeleteMapping("{id}/delete-definitive")
    public ResponseEntity<ApiResponse<Void>> deleteDefinitive(@PathVariable Integer id) {
        try {
            trafficService.deleteDefinitiveTrafficForAnAdmin(id);
            return ResponseEntity.ok(new ApiResponse<>("Traffic deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }
}
