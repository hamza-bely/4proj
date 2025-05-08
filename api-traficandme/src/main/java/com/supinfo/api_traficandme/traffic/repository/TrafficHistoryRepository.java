package com.supinfo.api_traficandme.traffic.repository;

import com.supinfo.api_traficandme.traffic.entity.TrafficHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrafficHistoryRepository extends JpaRepository<TrafficHistory, Long> {

}
