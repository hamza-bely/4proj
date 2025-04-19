package com.supinfo.api_traficandme.reports.repository;

import com.supinfo.api_traficandme.reports.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {

    @Query(value = "SELECT type, COUNT(*) AS count" +
            " FROM report GROUP BY type",
            nativeQuery = true)
    List<Object[]> countByType();
}
