package com.supinfo.api_traficandme.traffic.controller;

import com.supinfo.api_traficandme.common.TrafficPredictionStatus;
import com.supinfo.api_traficandme.security.dto.ApiResponse;
import com.supinfo.api_traficandme.statistiques.dto.TrafficData;
import com.supinfo.api_traficandme.traffic.dto.TrafficResponse;
import com.supinfo.api_traficandme.traffic.entity.RealTimeTraffic;
import com.supinfo.api_traficandme.traffic.repository.RealTimeTrafficRepository;
import com.supinfo.api_traficandme.traffic.service.TrafficPredictionService;
import com.supinfo.api_traficandme.traffic.service.TrafficSchedulerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/real_traffic")
@RequiredArgsConstructor
public class RealTimeTrafficController {
    private final TrafficPredictionService service;
    private final RealTimeTrafficRepository repository;

    @GetMapping("/congested-points")
    public ResponseEntity<ApiResponse<List<TrafficResponse>>> predict() {
        try {
           List<TrafficResponse> response = service.getTrafficCongestedPoints();

            return ResponseEntity.ok(new ApiResponse<>("TrafficData congested points fetched successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/trafficData")
    public ResponseEntity<ApiResponse<List<TrafficData>>> getCurrentSpeed() {
        try {
            List<TrafficData> trafficList = service.getItineraryCurrentSpeed();
            return ResponseEntity.ok(new ApiResponse<>("TrafficData fetched successfully", trafficList));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }
}
