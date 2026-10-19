package com.ucsc.kpi_dashboard.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "kpi_target_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class KpiTargetHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "target_id", nullable = false)
    private KpiTarget target;

    @NotNull
    @Column(name = "old_target_value", nullable = false)
    private BigDecimal oldTargetValue;

    @NotNull
    @Column(name = "new_target_value", nullable = false)
    private BigDecimal newTargetValue;

    @Column(name = "edit_reason")
    private String editReason;

    @Column(name = "recorded_at", nullable = false)
    private LocalDateTime recordedAt;

    @ManyToOne
    @JoinColumn(name = "recorded_by")
    private User recordedBy;
}
