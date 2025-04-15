package com.supinfo.api_traficandme.reports.entity;

import com.supinfo.api_traficandme.reports.dto.StatusReport;
import com.supinfo.api_traficandme.reports.dto.TypeReport;
import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "report")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeReport type;

    @Column(nullable = false)
    private double latitude;

    @Column(nullable = false)
    private double longitude;

    @Column(name = "username_user")
    private String user;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date createDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date updateDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusReport status;

    private Integer likeCount;
    private Integer dislikeCount;

    // Constructeurs
    public Report() {
    }

    public Report(Integer id, TypeReport type, double latitude, double longitude, String user,
                  Date createDate, Date updateDate, StatusReport status,
                  Integer likeCount, Integer dislikeCount) {
        this.id = id;
        this.type = type;
        this.latitude = latitude;
        this.longitude = longitude;
        this.user = user;
        this.createDate = createDate;
        this.updateDate = updateDate;
        this.status = status;
        this.likeCount = likeCount;
        this.dislikeCount = dislikeCount;
    }

    // Getters et Setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public TypeReport getType() {
        return type;
    }

    public void setType(TypeReport type) {
        this.type = type;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
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

    public StatusReport getStatus() {
        return status;
    }

    public void setStatus(StatusReport status) {
        this.status = status;
    }

    public Integer getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(Integer likeCount) {
        this.likeCount = likeCount;
    }

    public Integer getDislikeCount() {
        return dislikeCount;
    }

    public void setDislikeCount(Integer dislikeCount) {
        this.dislikeCount = dislikeCount;
    }
}
