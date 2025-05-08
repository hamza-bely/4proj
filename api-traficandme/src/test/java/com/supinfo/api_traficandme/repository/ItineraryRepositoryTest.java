package com.supinfo.api_traficandme.repository;

import com.supinfo.api_traficandme.common.ModeCirculation;
import com.supinfo.api_traficandme.traffic.entity.Itinerary;
import com.supinfo.api_traficandme.traffic.repository.ItineraryRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
@ActiveProfiles("test")
class ItineraryRepositoryTest {

    @Autowired
    private ItineraryRepository itineraryRepository;


    @Test
    void  shouldFindAllTraffic() {
        List<Itinerary> itineraries = itineraryRepository.findAll();
        assertEquals(8, itineraries.size());

        assertEquals("Rapide", itineraries.get(1).getMode().name());
        assertEquals("ACTIVE", itineraries.get(2).getStatus().name());
        assertEquals("grace", itineraries.get(6).getUser());
    }

    @Test
    void shouldUpdateTraffic() {
        Itinerary foundItinerary = itineraryRepository.findById(1).orElse(null);
        if (foundItinerary != null) {
            foundItinerary.setMode(ModeCirculation.Court);
            itineraryRepository.save(foundItinerary);
        }
        assertEquals("ACTIVE", foundItinerary.getStatus().name());
        assertEquals("Court", foundItinerary.getMode().name());
    }

    @Test
void shouldDeleteTraffic() {
        Itinerary foundItinerary = itineraryRepository.findById(1).orElse(null);
        if (foundItinerary != null) {
            itineraryRepository.delete(foundItinerary);
        }
        List<Itinerary> itineraries = itineraryRepository.findAll();
        assertEquals(7, itineraries.size());
    }

    @Test
    void shouldCountTrafficByMode() {
        List<Object[]> results = itineraryRepository.countByMode();

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