package com.ucsc.kpi_dashboard.Model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(
        name = "kpi_forecasts",
        indexes = {
                @Index(
                        name = "idx_kpi_forecasts_kpi_date",
                        columnList = "kpi_id, forecast_date"
                ),
                @Index(
                        name = "idx_kpi_forecasts_generated_at",
                        columnList = "generated_at"
                )
        }
)
public class KpiForecast {
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kpi_id", nullable = false)
    private Kpi kpi;

    @Column(name = "forecast_date", nullable = false)
    private LocalDate forecastDate;

    @Column(name = "forecast_value", nullable = false, precision = 19, scale = 6)
    private BigDecimal forecastValue;

    @Column(name = "lower_bound", precision = 19, scale = 6)
    private BigDecimal lowerBound;

    @Column(name = "upper_bound", precision = 19, scale = 6)
    private BigDecimal upperBound;
}
