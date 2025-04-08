package com.supinfo.api_traficandme.traffic.fetch;

import com.supinfo.api_traficandme.User.entity.UserInfo;
import com.supinfo.api_traficandme.traffic.model.TrafficModel;
import org.springframework.data.geo.Point;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TrafficRepository extends JpaRepository<TrafficModel,Integer> {

    boolean existsByStartLongitudeAndStartLatitudeAndEndLongitudeAndEndLatitudeAndUser(
            String startLongitude, String startLatitude, String endLongitude, String endLatitude, String userInfo);

    List<TrafficModel> findByUser(String user);
}
