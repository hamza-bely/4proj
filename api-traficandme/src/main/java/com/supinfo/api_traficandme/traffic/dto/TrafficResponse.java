package com.supinfo.api_traficandme.traffic.dto;

import lombok.Data;

import java.util.Date;

@Data
public class TrafficResponse {
    String status;
    String startAddress;
    String endAddress;
}
