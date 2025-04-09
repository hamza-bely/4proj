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

    public @NotNull String getStartLongitude() {
        return startLongitude;
    }

    public void setStartLongitude(@NotNull String startLongitude) {
        this.startLongitude = startLongitude;
    }

    public @NotNull String getStartLatitude() {
        return startLatitude;
    }

    public void setStartLatitude(@NotNull String startLatitude) {
        this.startLatitude = startLatitude;
    }

    public @NotNull String getEndLongitude() {
        return endLongitude;
    }

    public void setEndLongitude(@NotNull String endLongitude) {
        this.endLongitude = endLongitude;
    }

    public String getAddress_end() {
        return address_end;
    }

    public void setAddress_end(String address_end) {
        this.address_end = address_end;
    }

    public @NotNull String getEndLatitude() {
        return endLatitude;
    }

    public void setEndLatitude(@NotNull String endLatitude) {
        this.endLatitude = endLatitude;
    }

    public String getAddress_start() {
        return address_start;
    }

    public void setAddress_start(String address_start) {
        this.address_start = address_start;
    }

    public @NotNull String getUser() {
        return user;
    }

    public void setUser(@NotNull String user) {
        this.user = user;
    }

    public @NotNull ModeCirculation getMode() {
        return mode;
    }

    public void setMode(@NotNull ModeCirculation mode) {
        this.mode = mode;
    }

    public boolean isPeage() {
        return peage;
    }

    public void setPeage(boolean peage) {
        this.peage = peage;
    }
}
