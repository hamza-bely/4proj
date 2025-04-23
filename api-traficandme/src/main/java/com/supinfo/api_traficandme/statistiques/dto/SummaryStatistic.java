package com.supinfo.api_traficandme.statistiques.dto;

import lombok.Data;

@Data
public class SummaryStatistic {
        private long routeSearches;
        private long userTotal;
        private long trafficInfo;
        private long deletedUsers;

        public long getRouteSearches() {
                return routeSearches;
        }

        public void setRouteSearches(long routeSearches) {
                this.routeSearches = routeSearches;
        }

        public long getUserTotal() {
                return userTotal;
        }

        public void setUserTotal(long userTotal) {
                this.userTotal = userTotal;
        }

        public long getDeletedUsers() {
                return deletedUsers;
        }

        public void setDeletedUsers(long deletedUsers) {
                this.deletedUsers = deletedUsers;
        }

        public long getTrafficInfo() {
                return trafficInfo;
        }

        public void setTrafficInfo(long trafficInfo) {
                this.trafficInfo = trafficInfo;
        }
}
