package com.supinfo.api_traficandme.traffic.dto;

import com.supinfo.api_traficandme.traffic.model.TrafficModel;

public class TrafficMapper {

    public static TrafficResponse toResponse(TrafficModel trafficModel) {
        return new TrafficResponse(
                trafficModel.getId(),
                trafficModel.getDescription(),
                trafficModel.getLocation()
        );
    }

    public static TrafficModel toModel(TrafficRequest trafficRequest) {
        return new TrafficModel(
                trafficRequest.id(),
                trafficRequest.Description(),
                trafficRequest.stopPosition()
        );
    }
}
