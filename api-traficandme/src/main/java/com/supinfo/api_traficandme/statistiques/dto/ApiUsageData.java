package com.supinfo.api_traficandme.statistiques.dto;

import lombok.Data;

@Data
public class ApiUsageData {
    private String date;
    private long routeSearches;
    private long trafficInfo;
}
