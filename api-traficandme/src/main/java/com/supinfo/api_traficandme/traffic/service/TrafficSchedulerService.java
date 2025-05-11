package com.supinfo.api_traficandme.traffic.service;

import com.supinfo.api_traficandme.traffic.entity.Itinerary;
import com.supinfo.api_traficandme.traffic.entity.RealTimeTraffic;
import com.supinfo.api_traficandme.traffic.entity.TrafficHistory;
import com.supinfo.api_traficandme.traffic.repository.ItineraryRepository;
import com.supinfo.api_traficandme.traffic.repository.RealTimeTrafficRepository;
import com.supinfo.api_traficandme.traffic.repository.TrafficHistoryRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class TrafficSchedulerService {
    private final RestTemplate restTemplate = new RestTemplate();
    private final RealTimeTrafficRepository trafficRepository;
    private final TrafficHistoryRepository historyRepository;
    private final ItineraryRepository itineraryRepository;

    @Value("${tomtom.api}")
    private String tomtomApiKey;

    @PostConstruct
    public void checkApiKey() {
        System.out.println("TomTom API Key: " + tomtomApiKey);  // Log de la clé pour debug
    }

    public TrafficSchedulerService(RealTimeTrafficRepository trafficRepository, TrafficHistoryRepository historyRepository, ItineraryRepository itineraryRepository) {
        this.trafficRepository = trafficRepository;
        this.historyRepository = historyRepository;
        this.itineraryRepository = itineraryRepository;
    }

    /**
     * Archives the daily traffic data by saving it to the TrafficHistory repository and deleting it from the RealTimeTraffic repository.
     *
     * @param oldTrafficData The list of RealTimeTraffic data to be archived.
     */
    public void archiveDailyTraffic(List<RealTimeTraffic> oldTrafficData) {
        //List<RealTimeTraffic> realTimeList = trafficRepository.findAll();
        List<TrafficHistory> historyList = new ArrayList<>();

        for (RealTimeTraffic realTime : oldTrafficData) {
            TrafficHistory history = getTrafficHistory(realTime);

            historyList.add(history);
        }

        historyRepository.saveAll(historyList);
        System.out.println("Dump successfully complete at "+new Date()+" Archives size was : " + historyList.size());
        trafficRepository.deleteAll();
    }


    /**
     * Fetches traffic data for all itineraries and stores it in the RealTimeTraffic repository.
     * This method is scheduled to run every 10 minutes.
     */
    @Scheduled(fixedRate = 21600000)
    public void fetchTrafficDataFixedRate() {
        List<Itinerary> itineraries = itineraryRepository.findAll();
        List<RealTimeTraffic> oldTrafficData = trafficRepository.findAll();

        if (itineraries.isEmpty()) {
            System.out.println("No itineraries found.");
            return;
        }

        archiveDailyTraffic(oldTrafficData);

        for (Itinerary itinerary : itineraries) {
            fetchAndStoreTrafficForItinerary(itinerary);
        }
    }

    /**
     * Fetches traffic data for a specific itinerary and stores it in the RealTimeTraffic repository.
     *
     * @param itinerary The itinerary for which to fetch traffic data.
     */
    private void fetchAndStoreTrafficForItinerary(Itinerary itinerary) {
        String startLat = itinerary.getStartLatitude();
        String startLon = itinerary.getStartLongitude();
        String endLat = itinerary.getEndLatitude();
        String endLon = itinerary.getEndLongitude();
        
        String routingUrl = String.format(
                "https://api.tomtom.com/routing/1/calculateRoute/"+startLat+","+startLon+":"+endLat+","+endLon+"/json?key="+tomtomApiKey+"&traffic=true"

        );

        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(routingUrl, Map.class);
            Map body = response.getBody();

            if (body == null || !body.containsKey("routes")) return;

            List<Map<String, Object>> routes = (List<Map<String, Object>>) body.get("routes");
            if (routes.isEmpty()) return;

            Map<String, Object> route = routes.get(0);
            List<Map<String, Object>> legs = (List<Map<String, Object>>) route.get("legs");
            if (legs.isEmpty()) return;

            Map<String, Object> leg = legs.get(0);
            List<Map<String, Object>> points = (List<Map<String, Object>>) leg.get("points");

            for (Map<String, Object> point : points) {
                double lat = (double) point.get("latitude");
                double lon = (double) point.get("longitude");

                String trafficUrl = String.format(
                        "https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key="+tomtomApiKey+"&point="+lat+","+lon
                         );

                try {
                    ResponseEntity<Map> trafficResponse = restTemplate.getForEntity(trafficUrl, Map.class);
                    Map trafficBody = trafficResponse.getBody();
                    if (trafficBody == null || !trafficBody.containsKey("flowSegmentData")) continue;

                    Map<String, Object> flowData = (Map<String, Object>) trafficBody.get("flowSegmentData");

                    double currentSpeed = ((Number) flowData.get("currentSpeed")).doubleValue();
                    double freeFlowSpeed = ((Number) flowData.get("freeFlowSpeed")).doubleValue();

                    RealTimeTraffic traffic = new RealTimeTraffic();
                    traffic.setLatitude(lat);
                    traffic.setLongitude(lon);
                    traffic.setCurrentSpeed(currentSpeed);
                    traffic.setFreeFlowSpeed(freeFlowSpeed);
                    traffic.setCongested(currentSpeed < freeFlowSpeed * 0.5);
                    traffic.setTimestamp(new Date());
                    traffic.setSource("TomTom"); // je fetch juste pour TomTom pour l'instant
                    traffic.setItinerary(itinerary);

                    trafficRepository.save(traffic);

                } catch (Exception e) {
                    System.out.println("Error fetching traffic for point " + lat + "," + lon + " : " + e.getMessage());
                }
            }
            System.out.println("Fetching data from TOMTOM TrafficApi successfully complete at "+new Date()+" Archives size was : " + trafficRepository.findAll().size());

        } catch (Exception e) {
            System.out.println("Error fetching itinerary route: " + e.getMessage());
        }
    }


    private static TrafficHistory getTrafficHistory(RealTimeTraffic realTime) {
        TrafficHistory history = new TrafficHistory();
        history.setLatitude(realTime.getLatitude());
        history.setLongitude(realTime.getLongitude());
        history.setCurrentSpeed(realTime.getCurrentSpeed());
        history.setFreeFlowSpeed(realTime.getFreeFlowSpeed());
        history.setCongested(realTime.isCongested());
        history.setSource(realTime.getSource());
        history.setItinerary(realTime.getItinerary());
        history.setTimestamp(realTime.getTimestamp());
        return history;
    }


}
