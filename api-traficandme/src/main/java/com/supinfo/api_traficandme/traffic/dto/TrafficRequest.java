package com.supinfo.api_traficandme.traffic.dto;

import com.supinfo.api_traficandme.User.entity.UserInfo;
import com.supinfo.api_traficandme.common.ModeCirculation;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TrafficRequest {
    @NotNull
    private String startLongitude;
    @NotNull
    private String startLatitude;
    @NotNull
    private String endLongitude;
    @NotNull
    private String endLatitude;

    private String address_start;
    private String address_end;

    @NotNull
    private String user;
    @NotNull
    private ModeCirculation mode;
    private boolean peage;

}
