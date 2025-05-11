package com.supinfo.api_traficandme.traffic.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "traffic_history")
public class TrafficHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double latitude;
    private double longitude;
    private double currentSpeed;
    private double freeFlowSpeed;
    private boolean congested;
    private String source;
    private int itinerary_id;
    private Date timestamp;
}
