package com.supinfo.api_traficandme.traffic.controller;

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
    private final TrafficService trafficService;
    private final UserService userService;
    public TrafficController(TrafficService trafficService, UserService userService) {
        this.trafficService = trafficService;
        this.userService = userService;
    }

    @PostMapping("/add")
    public ResponseEntity<TrafficModel> addTraffic(@RequestBody TrafficRequest request) {
        try {

            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UserResponse connectedUser = userService.getUserByEmail(((UserDetails) principal).getUsername());
            if(connectedUser.username() == null){
                throw new IllegalArgumentException("User not found");
            }

            TrafficModel trafficModel = trafficService.addTraffic(request, connectedUser);
            return new ResponseEntity<>(trafficModel, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/get-all")
    public ResponseEntity<ApiResponse<List<TrafficModel>>> getAllTraffic() {
        try {
            List<TrafficModel> trafficList = trafficService.getAllTraffic();
            return ResponseEntity.ok(new ApiResponse<>("TrafficData fetched successfully", trafficList));
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("findBy/{id}")
    public ResponseEntity<ApiResponse<TrafficModel>> getTrafficById(@PathVariable int id) {
        try {
            TrafficModel trafficModel = trafficService.findById(id);
            return ResponseEntity.ok(new ApiResponse<>("Traffic found", trafficModel));
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

    }

    @GetMapping("traffic/user")
    public ResponseEntity<ApiResponse<List<TrafficModel>>> getAllTrafficByUser() {
        try {
            List<TrafficModel> userTrafficList = trafficService.getAllTrafficByUser();
            return ResponseEntity.ok(new ApiResponse<>("traffic by user was successfully fetched",userTrafficList ));
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
