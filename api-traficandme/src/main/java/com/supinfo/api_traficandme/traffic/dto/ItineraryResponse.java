package com.supinfo.api_traficandme.traffic.dto;

import com.supinfo.api_traficandme.common.ModeCirculation;
import lombok.Data;

import java.util.Date;

@Data
public class ItineraryResponse {
    private int id;
    private String startLongitude;
    private String startLatitude;
    private String endLongitude;
    private String endLatitude;
    private String address_start;
    private String address_end;
    private String userName;
    private String mode;
    private String status;
    private String ItineraryStatus;
    private Date createDate;
    private boolean peage;
}
