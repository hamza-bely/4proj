package com.supinfo.api_traficandme.traffic.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "real_time_traffic")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RealTimeTraffic {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        @NotNull(message = "Latitude is required")
        private Double latitude;

        @NotNull(message = "Longitude is required")
        private Double longitude;

        @NotNull(message = "Current speed is required")
        private Double currentSpeed;

        @NotNull(message = "Free flow speed is required")
        private Double freeFlowSpeed;

        private boolean congested;

        @NotBlank(message = "Source is required")
        private String source;

        @ManyToOne
        @JoinColumn(name = "itinerary_id")
        private Itinerary itinerary;

        @NotNull(message = "Timestamp is required")
        private Date timestamp;


}
