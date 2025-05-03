package com.supinfo.api_traficandme.repository;

import com.supinfo.api_traficandme.reports.dto.TypeReport;
import com.supinfo.api_traficandme.reports.entity.Report;
import com.supinfo.api_traficandme.reports.repository.ReportRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
@ActiveProfiles("test")
class ReportRepositoryTest {
    @Autowired
    private ReportRepository reportRepository;

    @BeforeEach
    void setUp() {

    }
    @DisplayName("Should return count of reports grouped by type")
    @Test
    void shouldCountReportsByType() {
        List<Object[]> results = reportRepository.countByType();

        assertThat(results).hasSize(4);

        for (Object[] row : results) {
            String type = (String) row[0];
            Long count = (Long) row[1];

            switch (type) {
                case "ACCIDENTS" -> assertThat(count).isEqualTo(4);
                case "POLICE_CHECKS", "TRAFFIC", "OBSTACLES" -> assertThat(count).isEqualTo(2);
                default -> throw new AssertionError("Type inconnu : " + type);
            }
        }
    }

    @Test
    void shouldFindAllReports() {
        List<Report> reports = reportRepository.findAll();
        assertEquals(10, reports.size());
        assertEquals("ACCIDENTS", reports.get(0).getType().name());
        assertEquals("POLICE_CHECKS", reports.get(1).getType().name());
        assertEquals("TRAFFIC", reports.get(2).getType().name());
        assertEquals("OBSTACLES", reports.get(3).getType().name());
    }

    @Test
    void shouldUpdateReport() {
        Report foundReport = reportRepository.findById(1).orElse(null);
        if (foundReport != null) {
            foundReport.setType(TypeReport.TRAFFIC);
            reportRepository.save(foundReport);
        }
        assertEquals("TRAFFIC", foundReport.getType().name());
        assertEquals("CANCELED", foundReport.getStatus().name());
    }

    @Test
    void shouldDeleteReport() {
        Report foundReport = reportRepository.findById(1).orElse(null);
        if (foundReport != null) {
            reportRepository.delete(foundReport);
        }
        List<Report> reports = reportRepository.findAll();
        assertEquals(9, reports.size());
    }

    @Test
    void shouldCountAllReports() {
        long count = reportRepository.count();
        assertEquals(10, count);
    }
}