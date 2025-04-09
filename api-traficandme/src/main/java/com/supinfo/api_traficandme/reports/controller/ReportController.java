package com.supinfo.api_traficandme.reports.controller;

import com.supinfo.api_traficandme.User.dto.UserResponse;
import com.supinfo.api_traficandme.User.service.UserService;
import com.supinfo.api_traficandme.reports.dto.CreateReportRequest;
import com.supinfo.api_traficandme.reports.dto.StatusReport;
import com.supinfo.api_traficandme.reports.dto.TypeReport;
import com.supinfo.api_traficandme.reports.entity.Report;
import com.supinfo.api_traficandme.reports.service.ReportService;
import com.supinfo.api_traficandme.security.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports/")
@CrossOrigin(origins = "*")
public class ReportController {

    //TODO AJOUTE LE PREAUHORIZE
    private final ReportService reportService;
    private final UserService userService;

    public ReportController(ReportService reportService, UserService userService) {
        this.reportService = reportService;
        this.userService = userService;
    }

    @PostMapping("create")
    public ResponseEntity<ApiResponse<Report>> create(@RequestBody CreateReportRequest request) {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UserResponse userConnected = userService.getUserByEmail(((UserDetails) principal).getUsername());
            if(userConnected.username() == null){
                throw new IllegalArgumentException("User undefined");
            }

            Report report = reportService.createReport(request,userConnected);
            return ResponseEntity.ok(new ApiResponse<>("Report created successfully", report));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("get-all")
    public ResponseEntity<ApiResponse<List<Report>>> getAll() {
        try {
            List<Report> reports = reportService.getAllReports();
            return ResponseEntity.ok(new ApiResponse<>("Reports fetched successfully", reports));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    @GetMapping("get-all-by-user")
    public ResponseEntity<ApiResponse<List<Report>>> getAllByUser() {
        try {
            List<Report> reports = reportService.getAllReportsByUser();
            return ResponseEntity.ok(new ApiResponse<>("Reports fetched successfully", reports));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @PostMapping("{id}/like")
    public ResponseEntity<ApiResponse<Report>> like(@PathVariable String idReport) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userEmail = ((UserDetails) principal).getUsername();

        try {
            Report updated = reportService.likeReport(idReport, userEmail);
            return ResponseEntity.ok(new ApiResponse<>("Report liked", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @PostMapping("{id}/dislike")
    public ResponseEntity<ApiResponse<Report>> dislike(@PathVariable String id) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userEmail = ((UserDetails) principal).getUsername();

        try {
            Report updated = reportService.dislikeReport(id, userEmail);
            return ResponseEntity.ok(new ApiResponse<>("Report disliked", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }


    @PatchMapping("{id}/update-status")
    public ResponseEntity<ApiResponse<Report>> changeStatus(
            @PathVariable String id,
            @RequestBody StatusReport status) {
        try {
            Report updated = reportService.changeStatus(id, status);
            return ResponseEntity.ok(new ApiResponse<>("Status changed", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @PatchMapping("{id}/update-type")
    public ResponseEntity<ApiResponse<Report>> changeStatus(
            @PathVariable String id,
            @RequestBody TypeReport status) {
        try {
            Report updated = reportService.changeType(id, status);
            return ResponseEntity.ok(new ApiResponse<>("Type changed", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }


    @DeleteMapping("{id}/delete-definitive")
    public ResponseEntity<ApiResponse<Void>> permanentlyDelete(@PathVariable String id) {
        try {
            reportService.deleteReport(id);
            return ResponseEntity.ok(new ApiResponse<>("Report deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }


}
