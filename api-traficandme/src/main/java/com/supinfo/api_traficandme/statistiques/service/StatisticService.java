package com.supinfo.api_traficandme.statistiques.service;

import com.supinfo.api_traficandme.User.service.AdminService;
import com.supinfo.api_traficandme.reports.service.ReportService;
import com.supinfo.api_traficandme.statistiques.model.AdminStatisticModel;
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

    public AdminStatisticModel StatAdmin(){
        long routeSearches = trafficService.getTotalTraffic();
        long userTotal = adminService.getTotalUsers();
        long trafficInfo = reportService.getTotalReports();

        AdminStatisticModel adminStatisticModel = new AdminStatisticModel();

        adminStatisticModel.setRouteSearches(routeSearches);
        adminStatisticModel.setUserTotal(userTotal);
        adminStatisticModel.setTrafficInfo(trafficInfo);

        return adminStatisticModel;
    }

    public List<RouteData> getRouteStatistics() {
        return trafficService.getRouteData();
    }

    public List<ReportData> getReportStatistics() {
        return reportService.getReportData();
    }

}
