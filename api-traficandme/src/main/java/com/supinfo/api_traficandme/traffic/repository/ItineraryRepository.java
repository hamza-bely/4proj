package com.supinfo.api_traficandme.traffic.repository;

import com.supinfo.api_traficandme.traffic.entity.Itinerary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItineraryRepository extends JpaRepository<Itinerary,Integer> {

    boolean existsByStartLongitudeAndStartLatitudeAndEndLongitudeAndEndLatitudeAndUser(
            String startLongitude, String startLatitude, String endLongitude, String endLatitude, String userInfo);

    List<Itinerary> findByUser(String user);
    int countByUser(String email);

    @Query(value = "SELECT mode, COUNT(*) AS count" +
            " FROM Itinerary GROUP BY mode",
            nativeQuery = true)
    List<Object[]> countByMode();
}
