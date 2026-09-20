package com.ucsc.kpi_dashboard.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Entity
@Data
@Table(name="kpi_period_data")
public class KpiPeriodData {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne
    @JoinColumn(name="kpi_id")
    private KPI kpi;

    private LocalDate period;

    private Double targetValue;

    private Double actualValue;

    private Double performanceScore;

    private Double variance;

    private Double variancePercentage;

    private String performanceStatus;

    private String notes;

    private String confidenceLevel;

    @Column(nullable = false, updatable = false)
    private LocalDateTime entryDate;

    @PrePersist
    public void prePersist() {
        this.entryDate = LocalDateTime.now();
    }

    @ManyToOne
    @JoinColumn(name="entered_by")
    private User enteredBy;

}