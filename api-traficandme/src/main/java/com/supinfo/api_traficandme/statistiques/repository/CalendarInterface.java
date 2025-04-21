package com.supinfo.api_traficandme.statistiques.repository;

import com.supinfo.api_traficandme.statistiques.entity.ParamCalendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

public interface CalendarInterface extends JpaRepository<ParamCalendar, LocalDate> {
    @Query(value = "SELECT * FROM param_calendar WHERE date BETWEEN :startDate AND :endDate", nativeQuery = true)
    List<ParamCalendar> findByDateBetween(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query(value = "SELECT * FROM param_calendar WHERE date BETWEEN :startDate AND :endDate", nativeQuery = true)
    List<ParamCalendar> findByDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
