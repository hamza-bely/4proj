package com.supinfo.api_traficandme.user.controller;

import com.supinfo.api_traficandme.common.PeriodStatus;
import com.supinfo.api_traficandme.reports.dto.StatusReport;
import com.supinfo.api_traficandme.statistiques.dto.ApiUsageData;
import com.supinfo.api_traficandme.user.dto.StatusUser;
import com.supinfo.api_traficandme.user.dto.UserRequest;
import com.supinfo.api_traficandme.user.dto.UserResponse;
import com.supinfo.api_traficandme.user.service.AdminService;
import com.supinfo.api_traficandme.user.service.UserService;
import com.supinfo.api_traficandme.security.dto.ApiResponse;
import com.supinfo.api_traficandme.statistiques.dto.SummaryStatistic;
import com.supinfo.api_traficandme.statistiques.dto.ReportData;
import com.supinfo.api_traficandme.statistiques.dto.RouteData;
import com.supinfo.api_traficandme.statistiques.service.StatisticService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "*")


public class AdminController {
    //TODO AJOUTER LES PREAUTHORIZE

    private  final UserService userService;
    private  final AdminService adminService;
    private  final StatisticService statisticService;
    public AdminController(UserService userService, AdminService adminService, PasswordEncoder passwordEncoder, StatisticService statisticService){
        this.adminService = adminService;
        this.userService = userService;
        this.statisticService = statisticService;
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
    @PreAuthorize("hasRole('ROLE_ADMIN')")
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

    @PutMapping("update/{id}")
    //@PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(@PathVariable ("id") String userId,@Valid @RequestBody UserRequest request){
        try {
            UserResponse response = userService.updateUser(Integer.valueOf(userId),request);
            ApiResponse<UserResponse> apiResponse = new ApiResponse<>("Updated User", response);
            return ResponseEntity.ok(apiResponse);
        } catch (RuntimeException e) {
            ApiResponse<UserResponse> errorResponse = new ApiResponse<>(e.getMessage(), null);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PatchMapping("{id}/update-status")
    public ResponseEntity<ApiResponse<UserResponse>> changeStatus(
            @PathVariable Integer id,
            @RequestBody StatusUser status) {
        try {
            UserResponse updated = adminService.changeStatusUserForAnAdmin(id, status);
            return ResponseEntity.ok(new ApiResponse<>("Status changed", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @DeleteMapping ("{id}/delete-definitive")
    public ResponseEntity<ApiResponse<Boolean>> changeStatus(
            @PathVariable Integer id) {
        try {
            Boolean updated = adminService.deleteUserForAnAdmin(id);
            return ResponseEntity.ok(new ApiResponse<>("Status changed", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/total-map")
    public ResponseEntity<ApiResponse<SummaryStatistic>> getSummary() {
        try {
            SummaryStatistic summary = statisticService.StatAdmin();
            return ResponseEntity.ok(new ApiResponse<>("Summary of map using", summary));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/report-statistics")
    public ResponseEntity<ApiResponse<List<ReportData>>> getReportStatistics() {
        try {
            List<ReportData> reportData = statisticService.getReportStatistics();
            return ResponseEntity.ok(new ApiResponse<>("Report statistics", reportData));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/route-statistics")
    public ResponseEntity<ApiResponse<List<RouteData>>> getRouteStatistics() {
        try {
            List<RouteData> routeData = statisticService.getRouteStatistics();
            return ResponseEntity.ok(new ApiResponse<>("Route statistics", routeData));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/search-statistics")
    public ResponseEntity<ApiResponse<List<ApiUsageData>>> getStatisticsBySearchTime(@RequestBody PeriodStatus period) {
        try {
            List<ApiUsageData> routeData = statisticService.getApiUsageStatisticsPerTime(period);
            return ResponseEntity.ok(new ApiResponse<>("Route statistics", routeData));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }

}
