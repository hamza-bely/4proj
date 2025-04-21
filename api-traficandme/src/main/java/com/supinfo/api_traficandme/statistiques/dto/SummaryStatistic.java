package com.supinfo.api_traficandme.statistiques.dto;

import lombok.Data;

@Data
public class SummaryStatistic {
        private long routeSearches;
        private long userTotal;
        private long trafficInfo;
        private long deletedUsers;

}
