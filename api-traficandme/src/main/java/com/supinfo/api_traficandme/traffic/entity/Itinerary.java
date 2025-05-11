package com.supinfo.api_traficandme.traffic.entity;

import com.supinfo.api_traficandme.common.ModeCirculation;
import com.supinfo.api_traficandme.traffic.dto.StatusTraffic;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "itinerary")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Itinerary {
    @Id
    @GeneratedValue
    private int id;
    private String startLongitude;
    private String startLatitude;
    private String endLongitude;
    private String endLatitude;
    private String address_start;
    private String address_end;
    @Enumerated(EnumType.STRING)
    private ModeCirculation mode;
    @Column(name = "user_name")
    private String user;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date createDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date updateDate;
    private boolean isPeage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusTraffic status = StatusTraffic.ACTIVE;

    @Transient
    private String ItineraryStatus;

    @OneToMany(mappedBy = "itinerary", cascade = CascadeType.REMOVE)
    private List<RealTimeTraffic> realTimeTrafficList;


    public int getId() {
        return id;
    }

    public void setId(int Id) {
        this.id = Id;
    }

    public String getStartLongitude() {
        return startLongitude;
    }

    public void setStartLongitude(String startLongitude) {
        this.startLongitude = startLongitude;
    }

    public String getEndLongitude() {
        return endLongitude;
    }

    public void setEndLongitude(String endLongitude) {
        this.endLongitude = endLongitude;
    }

    public String getStartLatitude() {
        return startLatitude;
    }

    public void setStartLatitude(String startLatitude) {
        this.startLatitude = startLatitude;
    }

    public String getEndLatitude() {
        return endLatitude;
    }

    public void setEndLatitude(String endLatitude) {
        this.endLatitude = endLatitude;
    }

    public String getAddress_start() {
        return address_start;
    }

    public void setAddress_start(String address_start) {
        this.address_start = address_start;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getAddress_end() {
        return address_end;
    }

    public void setAddress_end(String address_end) {
        this.address_end = address_end;
    }

    public ModeCirculation getMode() {
        return mode;
    }

    public void setMode(ModeCirculation mode) {
        this.mode = mode;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    public boolean isPeage() {
        return isPeage;
    }

    public void setPeage(boolean peage) {
        isPeage = peage;
    }

    public StatusTraffic getStatus() {
        return status;
    }

    public void setStatus(StatusTraffic status) {
        this.status = status;
    }

    public String getItineraryStatus() {
        return ItineraryStatus;
    }

    public void setItineraryStatus(String itineraryStatus) {
        ItineraryStatus = itineraryStatus;
    }
}
