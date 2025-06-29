package com.supinfo.api_traficandme.traffic.dto;

import lombok.Data;

import java.util.Date;

@Data
public class TrafficResponse {
    private long id;
    private Double currentSpeed;
    private String latitude;
    private String longitude;
}
