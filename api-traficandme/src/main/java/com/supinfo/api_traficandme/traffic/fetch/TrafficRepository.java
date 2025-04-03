package com.supinfo.api_traficandme.traffic.fetch;

import com.supinfo.api_traficandme.traffic.model.TrafficModel;
import org.springframework.data.geo.Point;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TrafficRepository extends JpaRepository<TrafficModel,Integer> {

    Optional<TrafficModel> findByLocation(Point location);
}
