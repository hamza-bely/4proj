package com.supinfo.api_traficandme.service;

import com.supinfo.api_traficandme.common.ModeCirculation;
import com.supinfo.api_traficandme.common.Role;
import com.supinfo.api_traficandme.itinerary.dto.StatusTraffic;
import com.supinfo.api_traficandme.itinerary.dto.TrafficRequest;
import com.supinfo.api_traficandme.itinerary.entity.Traffic;
import com.supinfo.api_traficandme.itinerary.repository.TrafficRepository;
import com.supinfo.api_traficandme.itinerary.service.TrafficService;
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
public class TrafficServiceTest {
    @Mock
    private TrafficRepository trafficRepository;
    @InjectMocks
    private TrafficService trafficService;
    private TrafficRequest validRequest;
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

        validRequest = new TrafficRequest();
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
        Mockito.when(trafficRepository.countByUser("robert.brown@example.com")).thenReturn(0);
        Mockito.when(trafficRepository.save(Mockito.any(Traffic.class))).thenAnswer(i -> i.getArgument(0));

        Traffic result = trafficService.createTraffic(validRequest, validUser);

        Assertions.assertNotNull(result);
        Assertions.assertEquals("robert.brown@example.com", result.getUser());
        Assertions.assertEquals(ModeCirculation.Rapide, result.getMode());
    }

    @Test
    void shouldThrowExceptionWhenLimitExceeded() {
        Mockito.when(trafficRepository.countByUser("robert.brown@example.com")).thenReturn(10);

        Exception exception = Assertions.assertThrows(IllegalStateException.class, () -> {
            trafficService.createTraffic(validRequest, validUser);
        });

        Assertions.assertEquals("You have reached the maximum number of 10 saved routes. Please delete one before creating a new one.", exception.getMessage());
    }
    @Test
    void shouldReturnTrafficListForUser() {
        Traffic t1 = new Traffic();
        t1.setUser("robert.brown@example.com");

        Traffic t2 = new Traffic();
        t2.setUser("bob@example.com");

        Mockito.when(trafficRepository.findAll()).thenReturn(List.of(t1, t2));

        List<Traffic> result = trafficService.getAllTrafficByUser(validUser);

        Assertions.assertEquals(1, result.size());
        Assertions.assertEquals("robert.brown@example.com", result.get(0).getUser());
    }

    @Test
    void shouldDeleteTrafficForUser() throws Exception {
        Traffic t = new Traffic();
        t.setId(1);
        t.setUser("robert.brown@example.com");
        t.setStatus(StatusTraffic.ACTIVE);

        Mockito.when(trafficRepository.findById(1)).thenReturn(Optional.of(t));
        Mockito.when(trafficRepository.save(Mockito.any(Traffic.class))).thenAnswer(i -> i.getArgument(0));

        Traffic deleted = trafficService.deleteTrafficForAnUser(1);

        Assertions.assertEquals("Anonymous", deleted.getUser());
        Assertions.assertEquals(StatusTraffic.DELETED, deleted.getStatus());
    }

    @Test
    void shouldDeleteDefinitiveTraffic() {
        Traffic t = new Traffic();
        t.setId(1);

        Mockito.when(trafficRepository.findById(1)).thenReturn(Optional.of(t));

        Boolean deleted = trafficService.deleteDefinitiveTrafficForAnAdmin(1);

        Assertions.assertTrue(deleted);
        Mockito.verify(trafficRepository, Mockito.times(1)).delete(t);
    }

    @Test
    void shouldNotDeleteDefinitiveTrafficWhenNotFound() {
        Mockito.when(trafficRepository.findById(999)).thenReturn(Optional.empty());

        Boolean deleted = trafficService.deleteDefinitiveTrafficForAnAdmin(999);

        Assertions.assertFalse(deleted);
    }

}


