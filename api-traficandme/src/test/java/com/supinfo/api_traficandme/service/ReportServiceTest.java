package com.supinfo.api_traficandme.service;

import com.supinfo.api_traficandme.common.Role;
import com.supinfo.api_traficandme.reports.dto.CreateReportRequest;
import com.supinfo.api_traficandme.reports.dto.StatusReport;
import com.supinfo.api_traficandme.reports.dto.TypeReport;
import com.supinfo.api_traficandme.reports.entity.Report;
import com.supinfo.api_traficandme.reports.entity.ReportInteraction;
import com.supinfo.api_traficandme.reports.repository.ReportInteractionRepository;
import com.supinfo.api_traficandme.reports.repository.ReportRepository;
import com.supinfo.api_traficandme.reports.service.ReportService;
import com.supinfo.api_traficandme.user.dto.StatusUser;
import com.supinfo.api_traficandme.user.dto.UserResponse;
import com.supinfo.api_traficandme.user.entity.UserInfo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ReportServiceTest {
    @Mock
    private ReportRepository reportRepository;
    @Mock
    private ReportInteractionRepository reportInteractionRepository;
    @InjectMocks
    private ReportService reportService;

    private UserResponse validUser;

    @BeforeEach
    void setUp() {

        UserInfo user = UserInfo.builder()
                .id(1)
                .firstName("Robert")
                .lastName("Brown")
                .email("robert.brown@example.com")
                .password("password123")
                .roles(Role.USER)
                .status(StatusUser.ACTIVE)
                .build();

        validUser = new UserResponse(
                user.getId(),
                user.getFirstName() + user.getLastName(),
                user.getEmail(),
                user.getRoles().name(),
                user.getStatus().name(),
                user.getCreateDate(),
                user.getUpdateDate()
        );
    }

    @Test
    public void testCreateReport_Success() {
        CreateReportRequest request = new CreateReportRequest();
        request.setType(TypeReport.TRAFFIC);
        request.setStatus(StatusReport.AVAILABLE);
        request.setLatitude(48.8566);
        request.setLongitude(2.3522);
        request.setAddress("Paris");

        Report mockSavedReport = new Report();
        mockSavedReport.setId(1);
        when(reportRepository.save(any(Report.class))).thenReturn(mockSavedReport);

        Report created = reportService.createReport(request, validUser);

        assertNotNull(created);
        verify(reportRepository).save(any(Report.class));
    }

    @Test
    public void testCreateReport_InvalidLatitude_ThrowsException() {
        CreateReportRequest request = new CreateReportRequest();
        request.setType(TypeReport.TRAFFIC);
        request.setStatus(StatusReport.AVAILABLE);
        request.setLatitude(200);  // Invalid latitude
        request.setLongitude(2.3522);

        assertThrows(IllegalArgumentException.class, () ->
            reportService.createReport(request, validUser));
    }

    @Test
    public void testLikeReport_NewLike() {
        Report report = new Report();
        report.setId(1);
        report.setLikeCount(0);
        when(reportRepository.findById(1)).thenReturn(Optional.of(report));
        when(reportInteractionRepository.findByReportIdAndUserEmail("1", "robert.brown@example.com"))
                .thenReturn(Optional.empty());
        when(reportRepository.save(any(Report.class))).thenReturn(report);

        Report result = reportService.likeReport("1", "robert.brown@example.com");

        assertEquals(1, result.getLikeCount());
        verify(reportInteractionRepository).save(any());
    }

    @Test
    public void testDislikeReport_AlreadyLiked() {
        Report report = new Report();
        report.setId(1);
        report.setLikeCount(1);
        report.setDislikeCount(0);

        ReportInteraction interaction = new ReportInteraction("1", "user@example.com", "like");

        when(reportRepository.findById(1)).thenReturn(Optional.of(report));
        when(reportInteractionRepository.findByReportIdAndUserEmail("1", "user@example.com"))
                .thenReturn(Optional.of(interaction));


        when(reportRepository.save(any(Report.class))).thenReturn(report);
        when(reportInteractionRepository.save(any(ReportInteraction.class))).thenReturn(interaction);

        Report result = reportService.dislikeReport("1", "user@example.com");

        assertNotNull(result);
        assertEquals(0, result.getLikeCount());
        assertEquals(1, result.getDislikeCount());
    }


    @Test
    public void testChangeStatus_Canceled() {
        Report report = new Report();
        report.setId(1);
        report.setStatus(StatusReport.AVAILABLE);
        report.setUser("test@user.com");

        when(reportRepository.findById(1)).thenReturn(Optional.of(report));
        when(reportRepository.save(any())).thenReturn(report);

        Report result = reportService.changeStatus("1", StatusReport.CANCELED);

        assertEquals(StatusReport.CANCELED, result.getStatus());
        assertEquals("Anonymous User", result.getUser());
    }

    @Test
    public void testChangeType_Success() {
        Report report = new Report();
        report.setId(1);
        report.setType(TypeReport.TRAFFIC);
        when(reportRepository.findById(1)).thenReturn(Optional.of(report));
        when(reportRepository.save(any())).thenReturn(report);

        Report result = reportService.changeType("1", TypeReport.OBSTACLES);

        assertNotEquals(TypeReport.TRAFFIC, result.getType());
        assertEquals(TypeReport.OBSTACLES, result.getType());
        assertNotNull(report);
    }

    @Test
    public void testDeleteReport_Success() {
        Report report = new Report();
        report.setId(1);
        when(reportRepository.findById(1)).thenReturn(Optional.of(report));

        reportService.deleteReport("1");

        verify(reportRepository).delete(report);
    }
}
