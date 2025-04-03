package com.supinfo.api_traficandme.traffic.model;

import com.supinfo.api_traficandme.User.entity.UserInfo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.geo.Point;

import java.time.LocalDateTime;

@Entity
@Table(name = "traffic")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TrafficModel {
    @Id
    @GeneratedValue
    private int Id;
    private Point location;
    private String Description;
    private LocalDateTime dateCreation;


    public TrafficModel(int id, String description, Point point) {
    }
}
