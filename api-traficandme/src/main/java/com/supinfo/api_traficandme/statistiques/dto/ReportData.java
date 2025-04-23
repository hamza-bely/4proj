package com.supinfo.api_traficandme.statistiques.dto;

import lombok.Data;

@Data
public class ReportData {
    private String type;
    private long count;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }
}
