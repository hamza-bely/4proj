package com.supinfo.api_traficandme.statistiques.dto;

import lombok.Data;

@Data
public class RouteData {
    private String mode;
    private long count;

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }
}
