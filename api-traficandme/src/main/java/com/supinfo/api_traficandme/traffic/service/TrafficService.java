package com.supinfo.api_traficandme.traffic.service;

import com.supinfo.api_traficandme.traffic.fetch.TrafficRepository;
import com.supinfo.api_traficandme.traffic.messages.StopExceptionMessages;
import com.supinfo.api_traficandme.traffic.model.TrafficModel;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service

public class TrafficService {
    private final TrafficRepository trafficRepository;

    public TrafficService(TrafficRepository trafficRepository) {
        this.trafficRepository = trafficRepository;
    }

    public TrafficModel findById(int id) throws Exception {
        return trafficRepository.findById(id).orElseThrow(() -> new Exception(StopExceptionMessages.NOT_FOUND));
    }

    public TrafficModel add(TrafficModel stop) throws Exception {
        checkIfExistsByPosition(stop.getLocation());
        return trafficRepository.save(stop);
    }

    public void checkIfExistsByPosition(Point position) throws Exception {
        Optional<TrafficModel> stop = trafficRepository.findByLocation(position);
        if(stop.isPresent())
            throw new Exception(StopExceptionMessages.POSITION_ALREADY_EXISTS +": "+ stop.get().getDescription());

    }


}
