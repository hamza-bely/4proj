package com.supinfo.api_traficandme.statistiques.service;

import com.supinfo.api_traficandme.user.dto.StatusUser;
import com.supinfo.api_traficandme.user.service.AdminService;
import com.supinfo.api_traficandme.reports.service.ReportService;
import com.supinfo.api_traficandme.statistiques.model.SummaryStatistic;
import com.supinfo.api_traficandme.statistiques.model.ReportData;
import com.supinfo.api_traficandme.statistiques.model.RouteData;
import com.supinfo.api_traficandme.traffic.service.TrafficService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StatisticService {

    private final AdminService adminService;
    private final TrafficService trafficService;
    private final ReportService reportService;

    public StatisticService(AdminService adminService, TrafficService trafficService, ReportService reportService) {
        this.adminService = adminService;
        this.trafficService = trafficService;
        this.reportService = reportService;
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

}
