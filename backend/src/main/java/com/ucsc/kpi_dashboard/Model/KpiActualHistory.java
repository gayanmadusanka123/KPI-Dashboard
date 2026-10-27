package com.ucsc.kpi_dashboard.Model;

import com.ucsc.kpi_dashboard.Domain.DataConfidence;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "kpi_actual_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class KpiActualHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "actual_id", nullable = false)
    private KpiActual actual;

    @NotNull
    @Column(name = "old_actual_value", nullable = false)
    private BigDecimal oldActualValue;

    @NotNull
    @Column(name = "new_actual_value", nullable = false)
    private BigDecimal newActualValue;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "old_data_confidence", nullable = false)
    private DataConfidence oldDataConfidence;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "new_data_confidence", nullable = false)
    private DataConfidence newDataConfidence;

    @Column(name = "edit_reason")
    private String editReason;

    @Column(name = "recorded_at", nullable = false)
    private LocalDateTime recordedAt;

    @ManyToOne
    @JoinColumn(name = "recorded_by")
    private User recordedBy;
}