package com.supinfo.api_traficandme.statistiques.dto;

import lombok.Data;

@Data
public class ApiUsageData {
    private String date;
    private long routeSearches;
    private long trafficInfo;

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public long getRouteSearches() {
        return routeSearches;
    }

    public void setRouteSearches(long routeSearches) {
        this.routeSearches = routeSearches;
    }

    public long getTrafficInfo() {
        return trafficInfo;
    }

    public void setTrafficInfo(long trafficInfo) {
        this.trafficInfo = trafficInfo;
    }
}
