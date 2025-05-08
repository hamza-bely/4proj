package com.supinfo.api_traficandme.traffic.service;

import com.supinfo.api_traficandme.common.TrafficPredictionStatus;
import com.supinfo.api_traficandme.statistiques.dto.TrafficData;
import com.supinfo.api_traficandme.traffic.dto.TrafficResponse;
import com.supinfo.api_traficandme.traffic.entity.Itinerary;
import com.supinfo.api_traficandme.traffic.repository.ItineraryRepository;
import com.supinfo.api_traficandme.traffic.repository.RealTimeTrafficRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TrafficPredictionService {
    private final RealTimeTrafficRepository realTimeTrafficRepository;
    private final ItineraryRepository itineraryRepository;

    public List<TrafficResponse> predictTraffic() {
        LocalDateTime now = LocalDateTime.now();
        int hour = now.getHour();
        DayOfWeek day = now.getDayOfWeek();
        long recentCongestions = 0;
        List<Itinerary> itineraries = itineraryRepository.findAll();

        boolean isRushHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
        boolean isWeekday = day != DayOfWeek.SATURDAY && day != DayOfWeek.SUNDAY;
        List<TrafficResponse> responses = new ArrayList<>();

        for (Itinerary itinerary : itineraries) {
           recentCongestions = realTimeTrafficRepository.countRecentCongestions(itinerary.getId());

            TrafficResponse response = new TrafficResponse();
            response.setStartAddress(itinerary.getAddress_start());
            response.setEndAddress(itinerary.getAddress_end());

            if (isRushHour && isWeekday && recentCongestions > 5) {
                response.setStatus(TrafficPredictionStatus.TRAFFIC_LIKELY.name());
            } else if (isRushHour || recentCongestions > 2) {
                response.setStatus(TrafficPredictionStatus.TRAFFIC_POSSIBLE.name());
            } else {
                response.setStatus(TrafficPredictionStatus.TRAFFIC_NONE.name());
            }

            responses.add(response);
        }
        return responses;
    }

    public List<TrafficData> getItineraryCurrentSpeed() {
        List<Object[]> results = realTimeTrafficRepository.getAverageSpeedByItinerary();
        List<TrafficData> trafficList = new ArrayList<>();

        for (Object[] result : results) {

            String startAddress = (String) result[0];
            TrafficData response = getTrafficResponse(result, startAddress);
            trafficList.add(response);
        }


        return trafficList;
    }

    private static TrafficData getTrafficResponse(Object[] result, String startAddress) {
        String endAddress = (String) result[1];
        Double averageSpeed = (Double) result[2];
        Long congestedCount= (Long) result[3];
        Long itineraryPoint = (Long) result[4];

        TrafficData response = new TrafficData();
        response.setAddress_start(startAddress);
        response.setAddress_end(endAddress);
        response.setAverageSpeed(averageSpeed);
        response.setCongestionCount(congestedCount);
        response.setItineraryPointCount(itineraryPoint);
        return response;
    }
}
