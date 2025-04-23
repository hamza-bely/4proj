package com.supinfo.api_traficandme.statistiques.repository;


import com.supinfo.api_traficandme.statistiques.entity.ParamCalendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CalendarRepository extends JpaRepository<ParamCalendar, LocalDate> {

    @Query(value = "SELECT " +
            "    cal.calendar_date, " +
            "    COUNT(DISTINCT trafic.id) AS trafficCount, " +
            "    COUNT(DISTINCT report.id) AS reportCount " +
            "FROM calendar_stats cal " +
            "LEFT JOIN traffic trafic " +
            "    ON EXTRACT(DAY FROM trafic.create_date) = EXTRACT(DAY FROM cal.calendar_date) " +
            "LEFT JOIN report report " +
            "    ON EXTRACT(DAY FROM report.create_date) = EXTRACT(DAY FROM cal.calendar_date) " +
            "WHERE cal.calendar_date = CURRENT_DATE\n" +
            "GROUP BY cal.calendar_date", nativeQuery = true)
    List<Object[]>getStatisticsForToday();

    @Query(value = "SELECT " +
            "    cal.calendar_date, " +
            "    COUNT(DISTINCT trafic.id) AS trafficCount, " +
            "    COUNT(DISTINCT report.id) AS reportCount " +
            "FROM calendar_stats cal " +
            "LEFT JOIN traffic trafic " +
            "    ON EXTRACT(DAY FROM trafic.create_date) = EXTRACT(DAY FROM cal.calendar_date) " +
            "LEFT JOIN report report " +
            "    ON EXTRACT(DAY FROM report.create_date) = EXTRACT(DAY FROM cal.calendar_date) " +
            "WHERE cal.week_number = EXTRACT(WEEK FROM CURRENT_DATE) \n" +
            "GROUP BY cal.calendar_date", nativeQuery = true)
    List<Object[]> getStatisticsForCurrentWeek();

    @Query(value = "SELECT " +
            "    cal.calendar_date, " +
            "    COUNT(DISTINCT trafic.id) AS trafficCount, " +
            "    COUNT(DISTINCT report.id) AS reportCount " +
            "FROM calendar_stats cal " +
            "LEFT JOIN traffic trafic " +
            "    ON EXTRACT(DAY FROM trafic.create_date) = EXTRACT(DAY FROM cal.calendar_date) " +
            "LEFT JOIN report report " +
            "    ON EXTRACT(DAY FROM report.create_date) = EXTRACT(DAY FROM cal.calendar_date) " +
            "WHERE cal.month_number = EXTRACT(MONTH FROM CURRENT_DATE) \n" +
            "GROUP BY cal.calendar_date", nativeQuery = true)
    List<Object[]> getStatisticsForCurrentMonth();

    @Query(value = "SELECT " +
            "    cal.month_name, " +
            "    COUNT(DISTINCT trafic.id) AS trafficCount, " +
            "    COUNT(DISTINCT report.id) AS reportCount " +
            "FROM calendar_stats cal " +
            "LEFT JOIN traffic trafic " +
            "    ON DATE(trafic.create_date) = cal.calendar_date " +
            "LEFT JOIN report report " +
            "    ON DATE(report.create_date) = cal.calendar_date " +
            "WHERE cal.quarter_number = EXTRACT(QUARTER FROM CURRENT_DATE) \n" +
            "GROUP BY cal.month_name", nativeQuery = true)
    List<Object[]> getStatisticsForCurrentQuarter();

}
