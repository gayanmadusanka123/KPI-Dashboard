package com.ucsc.kpi_dashboard.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "kpi_values")
public class KpiValues {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "kpi_profiles_id", nullable = false)
    private KpiProfile kpiProfile;

    @Column(nullable = false)
    private double actualValue;

    @Column(nullable = false)
    private LocalDate valueDate;


    public KpiValues(KpiProfile kpiProfile, double actualValue, LocalDate date) {
        this.kpiProfile = kpiProfile;
        this.actualValue = actualValue;
        this.valueDate = date;
    }
}
