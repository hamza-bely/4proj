package com.supinfo.api_traficandme.statistiques.model;

import lombok.Data;

@Data
public class ApiUsageData {
    private String date;
    private int routeSearches;
    private int geocoding;
    private int trafficInfo;

}
