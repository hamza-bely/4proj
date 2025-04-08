package com.supinfo.api_traficandme.traffic.model;

import com.supinfo.api_traficandme.User.entity.UserInfo;
import com.supinfo.api_traficandme.common.ModeCirculation;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.geo.Point;

import java.time.LocalDateTime;
import java.util.Date;

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
    private String startLongitude;
    private String startLatitude;
    private String endLongitude;
    private String endLatitude;
    private String address_start;
    private String address_end;
    @Enumerated(EnumType.STRING)
    private ModeCirculation mode;
    @Column(name = "userName")
    private String user;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date createDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date updateDate;
    private boolean isPeage;


}
