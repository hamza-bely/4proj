package com.supinfo.api_traficandme.statistiques.service;

import com.supinfo.api_traficandme.common.DateUtils;
import com.supinfo.api_traficandme.common.PeriodStatus;
import com.supinfo.api_traficandme.statistiques.dto.ApiUsageData;
import com.supinfo.api_traficandme.statistiques.repository.CalendarRepository;
import com.supinfo.api_traficandme.user.dto.StatusUser;
import com.supinfo.api_traficandme.user.service.AdminService;
import com.supinfo.api_traficandme.reports.service.ReportService;
import com.supinfo.api_traficandme.statistiques.dto.SummaryStatistic;
import com.supinfo.api_traficandme.statistiques.dto.ReportData;
import com.supinfo.api_traficandme.statistiques.dto.RouteData;
import com.supinfo.api_traficandme.itinerary.service.TrafficService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class StatisticService {

    private final AdminService adminService;
    private final TrafficService trafficService;
    private final ReportService reportService;
    private final CalendarRepository calendarRepository;

    public StatisticService(AdminService adminService, TrafficService trafficService,
                            ReportService reportService, CalendarRepository calendarRepository) {
        this.adminService = adminService;
        this.trafficService = trafficService;
        this.reportService = reportService;
        this.calendarRepository = calendarRepository;
    }

    public SummaryStatistic StatAdmin(){
        long routeSearches = trafficService.getTotalTraffic();
        long activeUser = adminService.countUsersByStatus(StatusUser.ACTIVE);
        long trafficInfo = reportService.getTotalReports();
        long deletedUser = adminService.countUsersByStatus(StatusUser.DELETED);

        SummaryStatistic summaryStatisticModel = new SummaryStatistic();

        summaryStatisticModel.setRouteSearches(routeSearches);
        summaryStatisticModel.setUserTotal(activeUser);
        summaryStatisticModel.setTrafficInfo(trafficInfo);
        summaryStatisticModel.setDeletedUsers(deletedUser);

        return summaryStatisticModel;
    }

    public List<RouteData> getRouteStatistics() {
        return trafficService.getRouteData();
    }

    public List<ReportData> getReportStatistics() {
        return reportService.getReportData();
    }

    public List<ApiUsageData> getApiUsageStatisticsPerTime(PeriodStatus period) {

        List<Object[]> results = new ArrayList<>();
        List<ApiUsageData> reportDataList = new ArrayList<>();

        results = switch (period) {
            case TODAY -> calendarRepository.getStatisticsForToday();
            case WEEK -> calendarRepository.getStatisticsForCurrentWeek();
            case MONTH -> calendarRepository.getStatisticsForCurrentMonth();
            case QUARTER -> calendarRepository.getStatisticsForCurrentQuarter();
            default -> throw new IllegalStateException("Unexpected value: " + period);
        };

        for (Object response : results) {
            Object[] result = (Object[]) response;
            String date = null;

            if (result[0] != null) {
                if (result[0] instanceof String) {
                    date = (String) result[0];
                } else if (result[0] instanceof Date) {

                    date = DateUtils.DateFormatWithSpecificPattern((Date) result[0], "yyyy-MM-dd");
                }

                Long trafficCount = (Long) result[1];
                Long reportCount = (Long) result[2];

                ApiUsageData apiUsageData = new ApiUsageData();
                apiUsageData.setDate(date);
                apiUsageData.setTrafficInfo(trafficCount);
                apiUsageData.setRouteSearches(reportCount);

                reportDataList.add(apiUsageData);
            }
        }
        return reportDataList;
    }
}
