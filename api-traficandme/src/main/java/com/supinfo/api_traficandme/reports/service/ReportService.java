package com.supinfo.api_traficandme.reports.service;

import com.supinfo.api_traficandme.User.dto.UserResponse;
import com.supinfo.api_traficandme.reports.dto.CreateReportRequest;
import com.supinfo.api_traficandme.reports.dto.StatusReport;
import com.supinfo.api_traficandme.reports.dto.TypeReport;
import com.supinfo.api_traficandme.reports.entity.Report;
import com.supinfo.api_traficandme.reports.entity.ReportInteraction;
import com.supinfo.api_traficandme.reports.repository.ReportInteractionRepository;
import com.supinfo.api_traficandme.reports.repository.ReportRepository;
import com.supinfo.api_traficandme.statistiques.model.ReportData;
import lombok.Data;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Data
@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final ReportInteractionRepository reportInteractionRepository;

    public ReportService(ReportRepository reportRepository,ReportInteractionRepository reportInteractionRepository) {
        this.reportRepository = reportRepository;
        this.reportInteractionRepository =reportInteractionRepository;
    }

    public Report createReport(CreateReportRequest request,UserResponse userConnected) {
        if (request.getType() == null) {
            throw new IllegalArgumentException("Type is required.");
        }
        if (request.getStatus() == null) {
            throw new IllegalArgumentException("Status is required.");
        }
        if (request.getLatitude() < -90 || request.getLatitude() > 90) {
            throw new IllegalArgumentException("Latitude must be between -90 and 90.");
        }
        if (request.getLongitude() < -180 || request.getLongitude() > 180) {
            throw new IllegalArgumentException("Longitude must be between -180 and 180.");
        }

        Report report = new Report();
        report.setType(request.getType());
        report.setLatitude(request.getLatitude());
        report.setLongitude(request.getLongitude());
        report.setUser(userConnected.email());
        report.setStatus(request.getStatus());
        report.setCreateDate(new Date());
        report.setUpdateDate(new Date());
        report.setLikeCount(0);
        report.setDislikeCount(0);

        return reportRepository.save(report);
    }

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    public List<Report> getAllReportsByUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(principal instanceof UserDetails)) {
            throw new IllegalStateException("User undefined");
        }
        String username = ((UserDetails) principal).getUsername();

        return reportRepository.findAll().stream()
                .filter(report -> report.getUser().equals(username))
                .collect(Collectors.toList());

    }

    public Report likeReport(String reportId, String userEmail) {
        Report report = reportRepository.findById(Integer.valueOf(reportId))
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + reportId));

        Optional<ReportInteraction> existing = reportInteractionRepository
                .findByReportIdAndUserEmail(reportId, userEmail);

        if (existing.isPresent()) {
            ReportInteraction interaction = existing.get();

            if ("like".equals(interaction.getAction())) {
                report.setLikeCount(report.getLikeCount() - 1);
                reportInteractionRepository.delete(interaction);
                report.setUpdateDate(new Date());
                return reportRepository.save(report);
            }

            if ("dislike".equals(interaction.getAction())) {
                report.setDislikeCount(report.getDislikeCount() - 1);
                report.setLikeCount(report.getLikeCount() + 1);
                interaction.setAction("like");
                reportInteractionRepository.save(interaction);
                report.setUpdateDate(new Date());
                return reportRepository.save(report);
            }
        }

        ReportInteraction newInteraction = new ReportInteraction(reportId, userEmail, "like");
        reportInteractionRepository.save(newInteraction);
        report.setLikeCount(report.getLikeCount() + 1);
        report.setUpdateDate(new Date());
        return reportRepository.save(report);
    }

    public Report dislikeReport(String reportId, String userEmail) {
        Report report = reportRepository.findById(Integer.valueOf(reportId))
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + reportId));

        Optional<ReportInteraction> existing = reportInteractionRepository
                .findByReportIdAndUserEmail(reportId, userEmail);

        if (existing.isPresent()) {
            ReportInteraction interaction = existing.get();

            if ("dislike".equals(interaction.getAction())) {
                report.setDislikeCount(report.getDislikeCount() - 1);
                reportInteractionRepository.delete(interaction);
                report.setUpdateDate(new Date());
                return reportRepository.save(report);
            }

            if ("like".equals(interaction.getAction())) {
                report.setLikeCount(report.getLikeCount() - 1);
                report.setDislikeCount(report.getDislikeCount() + 1);
                interaction.setAction("dislike");
                reportInteractionRepository.save(interaction);
                report.setUpdateDate(new Date());
                return reportRepository.save(report);
            }
        }

        ReportInteraction newInteraction = new ReportInteraction(reportId, userEmail, "dislike");
        reportInteractionRepository.save(newInteraction);
        report.setDislikeCount(report.getDislikeCount() + 1);
        report.setUpdateDate(new Date());
        return reportRepository.save(report);
    }

    public Report changeStatus(String id, StatusReport newStatus) {
        if (newStatus == null || !EnumSet.allOf(StatusReport.class).contains(newStatus)) {
            throw new IllegalArgumentException("Status \"" + newStatus + "\" does not exist");
        }

        Report report = reportRepository.findById(Integer.valueOf(id)).orElseThrow(() ->
                new RuntimeException("Report not found with id: " + id));


        report.setStatus(newStatus);
        report.setStatus(newStatus);
        report.setUpdateDate(new Date());
        if(newStatus.equals(StatusReport.CANCELED)){
            report.setUser("Anonymous User");
        }

        return reportRepository.save(report);
    }

    public Report changeType(String id, TypeReport newType) {
        if (newType == null || !EnumSet.allOf(TypeReport.class).contains(newType)) {
            throw new IllegalArgumentException("Status \"" + newType + "\" does not exist");
        }

        Report report = reportRepository.findById(Integer.valueOf(id)).orElseThrow(() ->
                new RuntimeException("Report not found with id: " + id));
        report.setType(newType);
        report.setUpdateDate(new Date());
        return reportRepository.save(report);
    }

    public void deleteReport(String id) {
        Report report = reportRepository.findById(Integer.valueOf(id))
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + id));

        reportRepository.delete(report);
    }

    public long getTotalReports() {
        return reportRepository.count();
    }

    public List<ReportData> getReportData() {
        List<Object[]> results = reportRepository.countByType();
        List<ReportData> reportDataList = new ArrayList<>();

        for (Object[] result : results) {
            String type = (String) result[0];
            Long count = (Long) result[1];
            ReportData reportData = new ReportData();
            reportData.setType(type);
            reportData.setCount(count);
            reportDataList.add(reportData);
        }
        return reportDataList;
    }
}
