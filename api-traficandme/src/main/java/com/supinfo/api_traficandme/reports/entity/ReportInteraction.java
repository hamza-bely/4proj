package com.supinfo.api_traficandme.reports.entity;

import com.supinfo.api_traficandme.reports.dto.StatusReport;
import com.supinfo.api_traficandme.reports.dto.TypeReport;
import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "report_interaction")
public class ReportInteraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String reportId;

    @Column(nullable = false)
    private String userEmail;

    @Column(nullable = false)
    private String action; // "like" ou "dislike"

    public ReportInteraction() {}

    public ReportInteraction(String reportId, String userEmail, String action) {
        this.reportId = reportId;
        this.userEmail = userEmail;
        this.action = action;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReportId() {
        return reportId;
    }

    public void setReportId(String reportId) {
        this.reportId = reportId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }
}
