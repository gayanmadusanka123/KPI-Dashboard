package com.ucsc.kpi_dashboard.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "kpi_periods")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class KpiPeriod {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "kpi_id", nullable = false)
    private Kpi kpi;

    @NotNull
    private LocalDate periodStart;

    @NotNull
    private LocalDate periodEnd;

    private String periodLabel;

    private Integer periodSequence;

    private LocalDateTime createdAt;
}