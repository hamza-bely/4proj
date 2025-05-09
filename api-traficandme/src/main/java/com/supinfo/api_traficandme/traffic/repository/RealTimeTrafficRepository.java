package com.supinfo.api_traficandme.traffic.repository;

import com.supinfo.api_traficandme.traffic.dto.TrafficResponse;
import com.supinfo.api_traficandme.traffic.entity.Itinerary;
import com.supinfo.api_traficandme.traffic.entity.RealTimeTraffic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RealTimeTrafficRepository extends JpaRepository<RealTimeTraffic, Long> {

    @Query("SELECT COUNT(t) FROM RealTimeTraffic t WHERE t.congested = true " +
            "AND t.itinerary.id = :itineraryId ")
    long countRecentCongestions(@Param("itineraryId") int itineraryId);


    @Query("""
            SELECT it.address_start, it.address_end, AVG(t.currentSpeed), COUNT(t), \
                    COUNT(CASE WHEN t.congested = true THEN 1 ELSE null END), it.id \
                        FROM RealTimeTraffic t \
            INNER JOIN Itinerary it ON it.id = t.itinerary.id
            GROUP BY it.id, it.address_start, it.address_end""")
    List<Object[]> getAverageSpeedByItinerary();

    @Query("SELECT t FROM RealTimeTraffic t WHERE t.congested = true AND t.itinerary.id = :itineraryId")
    List<RealTimeTraffic> findCongestedTraffic(@Param("itineraryId") int itineraryId);
    }
