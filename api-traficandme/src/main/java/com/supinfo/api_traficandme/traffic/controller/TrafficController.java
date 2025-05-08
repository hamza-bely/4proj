package com.supinfo.api_traficandme.traffic.controller;

import com.supinfo.api_traficandme.traffic.entity.Itinerary;
import com.supinfo.api_traficandme.user.dto.UserResponse;
import com.supinfo.api_traficandme.user.service.UserService;
import com.supinfo.api_traficandme.security.dto.ApiResponse;
import com.supinfo.api_traficandme.traffic.dto.ItineraryRequest;
import com.supinfo.api_traficandme.traffic.service.ItineraryService;
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

    private final ItineraryService itineraryService;
    private final UserService userService;
    public TrafficController(ItineraryService itineraryService, UserService userService) {
        this.itineraryService = itineraryService;
        this.userService = userService;
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Itinerary>> create(@RequestBody ItineraryRequest request) {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UserResponse connectedUser = userService.getUserByEmail(((UserDetails) principal).getUsername());
            if(connectedUser.username() == null){
                throw new IllegalArgumentException("User not found");
            }

            Itinerary itinerary = itineraryService.createTraffic(request, connectedUser);
            return ResponseEntity.ok(new ApiResponse<>("Itinerary fetched successfully", itinerary));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/get-all")
    public ResponseEntity<ApiResponse<List<Itinerary>>> getAll() {
        try {
            List<Itinerary> itineraryList = itineraryService.getAllTraffic();
            return ResponseEntity.ok(new ApiResponse<>("Itinerary fetched successfully", itineraryList));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/user")
    public ResponseEntity<ApiResponse<List<Itinerary>>> getAllByUser() {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UserResponse userConnected = userService.getUserByEmail(((UserDetails) principal).getUsername());
            if(userConnected.username() == null){
                throw new IllegalArgumentException("User undefined");
            }
            List<Itinerary> userItineraryList = itineraryService.getAllTrafficByUser(userConnected);
            return ResponseEntity.ok(new ApiResponse<>("Itinerary by user was successfully fetched", userItineraryList));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @DeleteMapping("{id}/delete-for-an-user")
    public ResponseEntity<ApiResponse<Itinerary>> deleteForAnUSer(@PathVariable Integer id) {
        try {
            Itinerary itinerary = itineraryService.deleteTrafficForAnUser(id);
            return ResponseEntity.ok(new ApiResponse<>("Itinerary deleted successfully", itinerary));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @DeleteMapping("{id}/delete-definitive")
    public ResponseEntity<ApiResponse<Void>> deleteDefinitive(@PathVariable Integer id) {
        try {
            itineraryService.deleteDefinitiveTrafficForAnAdmin(id);
            return ResponseEntity.ok(new ApiResponse<>("Itinerary deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }
}
