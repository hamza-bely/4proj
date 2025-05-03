package com.supinfo.api_traficandme.repository;

import com.supinfo.api_traficandme.common.ModeCirculation;
import com.supinfo.api_traficandme.itinerary.entity.Traffic;
import com.supinfo.api_traficandme.itinerary.repository.TrafficRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
@ActiveProfiles("test")
class TrafficRepositoryTest {

    @Autowired
    private TrafficRepository trafficRepository;


    @Test
    void  shouldFindAllTraffic() {
        List<Traffic> traffics = trafficRepository.findAll();
        assertEquals(8, traffics.size());

        assertEquals("Rapide", traffics.get(1).getMode().name());
        assertEquals("ACTIVE", traffics.get(2).getStatus().name());
        assertEquals("grace", traffics.get(6).getUser());
    }

    @Test
    void shouldUpdateTraffic() {
        Traffic foundTraffic = trafficRepository.findById(1).orElse(null);
        if (foundTraffic != null) {
            foundTraffic.setMode(ModeCirculation.Court);
            trafficRepository.save(foundTraffic);
        }
        assertEquals("ACTIVE", foundTraffic.getStatus().name());
        assertEquals("Court", foundTraffic.getMode().name());
    }

    @Test
void shouldDeleteTraffic() {
        Traffic foundTraffic = trafficRepository.findById(1).orElse(null);
        if (foundTraffic != null) {
            trafficRepository.delete(foundTraffic);
        }
        List<Traffic> traffics = trafficRepository.findAll();
        assertEquals(7, traffics.size());
    }

    @Test
    void shouldCountTrafficByMode() {
        List<Object[]> results = trafficRepository.countByMode();

        assertEquals(2, results.size());

        for (Object[] row : results) {
            String mode = (String) row[0];
            Long count = (Long) row[1];

            switch (mode) {
                case "Rapide" -> assertEquals(4, count);
                case "Court" -> assertEquals(4, count);
                default -> throw new AssertionError("Mode inconnu : " + mode);
            }
        }
    }
}