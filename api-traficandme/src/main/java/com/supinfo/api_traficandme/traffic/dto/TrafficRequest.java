package com.supinfo.api_traficandme.traffic.dto;

import org.springframework.data.geo.Point;

public record TrafficRequest(
        int id,
        String Description,
        Point stopPosition
) {
}
