package com.supinfo.api_traficandme.traffic.dto;

import com.supinfo.api_traficandme.common.ModeCirculation;
import lombok.Data;

@Data
public class ItineraryResponse {
    private String startLongitude;
    private String startLatitude;
    private String endLongitude;
    private String endLatitude;
    private String address_start;
    private String address_end;
    private String userName;
    private ModeCirculation mode;
    private boolean peage;
}
