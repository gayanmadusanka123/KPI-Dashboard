package com.ucsc.kpi_dashboard.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "kpi_period_performance")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class KpiPeriodPerformance {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "kpi_id", nullable = false)
    private Kpi kpi;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "period_id", nullable = false)
    private KpiPeriod period;

    private BigDecimal performanceScore;

    private BigDecimal variance;

    private BigDecimal variancePercent;

    private BigDecimal periodChangePercent;

    private String trendDirection;

    private BigDecimal rollingAverage;

    private BigDecimal cumulativePerformance;

    private String status;

    private LocalDateTime calculatedAt;
}