package com.supinfo.api_traficandme.service;

import com.supinfo.api_traficandme.common.ModeCirculation;
import com.supinfo.api_traficandme.common.Role;
import com.supinfo.api_traficandme.traffic.dto.StatusTraffic;
import com.supinfo.api_traficandme.traffic.dto.ItineraryRequest;
import com.supinfo.api_traficandme.traffic.entity.Itinerary;
import com.supinfo.api_traficandme.traffic.repository.ItineraryRepository;
import com.supinfo.api_traficandme.traffic.service.ItineraryService;
import com.supinfo.api_traficandme.user.dto.StatusUser;
import com.supinfo.api_traficandme.user.dto.UserResponse;
import com.supinfo.api_traficandme.user.entity.UserInfo;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class ItineraryServiceTest {
    @Mock
    private ItineraryRepository itineraryRepository;
    @InjectMocks
    private ItineraryService itineraryService;
    private ItineraryRequest validRequest;
    private UserResponse validUser;
    @BeforeEach
    void setUp() {

        UserInfo user = UserInfo.builder()
                .id(1)
                .firstName("Robert")
                .lastName("Brown")
                .email("robert.brown@example.com")
                .password("password123")
                .roles(Role.USER)
                .status(StatusUser.ACTIVE)
                .build();

        validRequest = new ItineraryRequest();
        validRequest.setStartLatitude("48.8600");
        validRequest.setStartLongitude("2.3500");
        validRequest.setEndLatitude("48.8566");
        validRequest.setEndLongitude("2.3522");
        validRequest.setAddress_start("1 Av. des Champs");
        validRequest.setAddress_end("10 Rue de Lyon");
        validRequest.setMode(ModeCirculation.Rapide);
        validRequest.setPeage(false);
        validRequest.setUser("Robert");

        validUser = new UserResponse(
                user.getId(),
                user.getFirstName() + user.getLastName(),
                user.getEmail(),
                user.getRoles().name(),
                user.getStatus().name(),
                user.getCreateDate(),
                user.getUpdateDate()
                );
    }

    @Test
    void shouldCreateTrafficSuccessfully() throws Exception {
        Mockito.when(itineraryRepository.countByUser("robert.brown@example.com")).thenReturn(0);
        Mockito.when(itineraryRepository.save(Mockito.any(Itinerary.class))).thenAnswer(i -> i.getArgument(0));

        Itinerary result = itineraryService.createTraffic(validRequest, validUser);

        Assertions.assertNotNull(result);
        Assertions.assertEquals("robert.brown@example.com", result.getUser());
        Assertions.assertEquals(ModeCirculation.Rapide, result.getMode());
    }

    @Test
    void shouldThrowExceptionWhenLimitExceeded() {
        Mockito.when(itineraryRepository.countByUser("robert.brown@example.com")).thenReturn(10);

        Exception exception = Assertions.assertThrows(IllegalStateException.class, () -> {
            itineraryService.createTraffic(validRequest, validUser);
        });

        Assertions.assertEquals("You have reached the maximum number of 10 saved routes. Please delete one before creating a new one.", exception.getMessage());
    }
    @Test
    void shouldReturnTrafficListForUser() {
        Itinerary t1 = new Itinerary();
        t1.setUser("robert.brown@example.com");

        Itinerary t2 = new Itinerary();
        t2.setUser("bob@example.com");

        Mockito.when(itineraryRepository.findAll()).thenReturn(List.of(t1, t2));

        List<Itinerary> result = itineraryService.getAllTrafficByUser(validUser);

        Assertions.assertEquals(1, result.size());
        Assertions.assertEquals("robert.brown@example.com", result.get(0).getUser());
    }

    @Test
    void shouldDeleteTrafficForUser() throws Exception {
        Itinerary t = new Itinerary();
        t.setId(1);
        t.setUser("robert.brown@example.com");
        t.setStatus(StatusTraffic.ACTIVE);

        Mockito.when(itineraryRepository.findById(1)).thenReturn(Optional.of(t));
        Mockito.when(itineraryRepository.save(Mockito.any(Itinerary.class))).thenAnswer(i -> i.getArgument(0));

        Itinerary deleted = itineraryService.deleteTrafficForAnUser(1);

        Assertions.assertEquals("Anonymous", deleted.getUser());
        Assertions.assertEquals(StatusTraffic.DELETED, deleted.getStatus());
    }

    @Test
    void shouldDeleteDefinitiveTraffic() {
        Itinerary t = new Itinerary();
        t.setId(1);

        Mockito.when(itineraryRepository.findById(1)).thenReturn(Optional.of(t));

        Boolean deleted = itineraryService.deleteDefinitiveTrafficForAnAdmin(1);

        Assertions.assertTrue(deleted);
        Mockito.verify(itineraryRepository, Mockito.times(1)).delete(t);
    }

    @Test
    void shouldNotDeleteDefinitiveTrafficWhenNotFound() {
        Mockito.when(itineraryRepository.findById(999)).thenReturn(Optional.empty());

        Boolean deleted = itineraryService.deleteDefinitiveTrafficForAnAdmin(999);

        Assertions.assertFalse(deleted);
    }

}


