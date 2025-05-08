package com.supinfo.api_traficandme.statistiques.dto;

import lombok.Data;

@Data
public class TrafficData {
    private String address_start;
    private String address_end;
    private double averageSpeed;
    private Long congestionCount;
    private Long itineraryPointCount;
}
