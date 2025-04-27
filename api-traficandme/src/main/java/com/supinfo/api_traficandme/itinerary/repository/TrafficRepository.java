package com.supinfo.api_traficandme.itinerary.repository;

import com.supinfo.api_traficandme.itinerary.entity.Traffic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrafficRepository extends JpaRepository<Traffic,Integer> {

    boolean existsByStartLongitudeAndStartLatitudeAndEndLongitudeAndEndLatitudeAndUser(
            String startLongitude, String startLatitude, String endLongitude, String endLatitude, String userInfo);

    List<Traffic> findByUser(String user);
    int countByUser(String email);

    @Query(value = "SELECT mode, COUNT(*) AS count" +
            " FROM traffic GROUP BY mode",
            nativeQuery = true)
    List<Object[]> countByMode();
}
