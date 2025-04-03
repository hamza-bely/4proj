package com.supinfo.api_traficandme.traffic.dto;
import org.springframework.data.geo.Point;

public record TrafficResponse(
        int stopId,
        String description,
       Point stopPosition
) {
}
