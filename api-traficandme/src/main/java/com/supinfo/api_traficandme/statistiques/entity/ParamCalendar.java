package com.supinfo.api_traficandme.statistiques.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
/**
 * ParamCalendar is an entity class that represents a calendar date and its associated attributes.
 * It is used to store information about the calendar, such as day, month, week, and quarter details.
 */
 @Table(name = "calendar_stats")
public class ParamCalendar {
    @Id
    @Column(name = "calendar_date", nullable = false)
    private LocalDate calendarDate;

    @Column(name = "day_number", nullable = false)
    private int dayNumber;

    @Column(name = "day_name", nullable = false, length = 20)
    private String dayName;

    @Column(name = "month_number", nullable = false)
    private int monthNumber;

    @Column(name = "month_name", nullable = false, length = 20)
    private String monthName;

    @Column(name = "week_number", nullable = false)
    private int weekNumber;

    @Column(name = "week_name", nullable = false, length = 20)
    private String weekName;

    @Column(name = "week_start_date", nullable = false)
    private LocalDate weekStartDate;

    @Column(name = "week_end_date", nullable = false)
    private LocalDate weekEndDate;

    @Column(name = "month_start_date", nullable = false)
    private LocalDate monthStartDate;

    @Column(name = "month_end_date", nullable = false)
    private LocalDate monthEndDate;

    @Column(name = "quarter_number", nullable = false)
    private int quarterNumber;

    @Column(name = "quarter_name", nullable = false, length = 20)
    private String quarterName;

    @Column(name = "quarter_start_date", nullable = false)
    private LocalDate quarterStartDate;

    @Column(name = "quarter_end_date", nullable = false)
    private LocalDate quarterEndDate;
}
