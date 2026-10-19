package com.ucsc.kpi_dashboard.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "kpi_targets",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_kpi_target_period",
                        columnNames = {"kpi_id", "period_id"}
                )
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class KpiTarget {

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

    @NotNull
    @Column(name = "target_value", nullable = false)
    private BigDecimal targetValue;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "updated_by")
    private User updatedBy;
}