package com.supinfo.api_traficandme.traffic.service;

import com.supinfo.api_traficandme.User.dto.UserResponse;
import com.supinfo.api_traficandme.traffic.dto.TrafficRequest;
import com.supinfo.api_traficandme.traffic.fetch.TrafficRepository;
import com.supinfo.api_traficandme.traffic.messages.StopExceptionMessages;
import com.supinfo.api_traficandme.traffic.model.TrafficModel;
import org.springframework.data.geo.Point;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service

public class TrafficService {
    private final TrafficRepository trafficRepository;

    public TrafficService(TrafficRepository trafficRepository) {
        this.trafficRepository = trafficRepository;
    }

    public TrafficModel addTraffic(TrafficRequest request, UserResponse connectedUser) throws Exception {

        if (isTrafficExists(request.getStartLongitude(), request.getStartLatitude(), request.getEndLongitude(), request.getEndLatitude(), request.getUser())) {
            throw new Exception("Traffic record already exists for this route and user");
        }

        TrafficModel stop = new TrafficModel();
        stop.setStartLongitude(request.getStartLongitude());
        stop.setStartLatitude(request.getStartLatitude());
        stop.setEndLongitude(request.getEndLongitude());
        stop.setEndLatitude(request.getEndLatitude());
        stop.setAddress_start(request.getAddress_start());
        stop.setAddress_end(request.getAddress_end());
        stop.setMode(request.getMode());
        stop.setUser(connectedUser.email());
        stop.setPeage(request.isPeage());
        stop.setCreateDate(new Date());
        stop.setUpdateDate(new Date());

        return trafficRepository.save(stop);
    }

    public List<TrafficModel> getAllTraffic() {
        return trafficRepository.findAll();
    }

    public List<TrafficModel> getAllTrafficByUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(principal instanceof UserDetails)) {
            throw new IllegalStateException("User not found");
        }
        String username = ((UserDetails) principal).getUsername();

        return  trafficRepository.findAll().stream()
                .filter(report -> report.getUser().equals(username))
                .collect(Collectors.toList());
    }

    public List<TrafficModel> getAllTrafficByUser(String user) {
        return trafficRepository.findByUser(user);
    }

    public TrafficModel findById(int id) throws Exception {

        return trafficRepository.findById(id)
                .orElseThrow(() -> new Exception("Traffic record not found"));
    }

    public boolean isTrafficExists(String startLongitude, String startLatitude, String endLongitude, String endLatitude, String user) {
        return trafficRepository.existsByStartLongitudeAndStartLatitudeAndEndLongitudeAndEndLatitudeAndUser(
                startLongitude, startLatitude, endLongitude, endLatitude, user);
    }


}
