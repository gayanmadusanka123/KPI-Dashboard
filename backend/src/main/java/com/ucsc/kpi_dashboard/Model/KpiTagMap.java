package com.ucsc.kpi_dashboard.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "kpi_tag_map")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class KpiTagMap   {
    @EmbeddedId
    private KpiTagMapId id;

    @ManyToOne
    @MapsId("kpiId")
    @JoinColumn(name = "kpi_id")
    private Kpi kpi;

    @ManyToOne
    @MapsId("tagId")
    @JoinColumn(name = "tag_id")
    private KpiTag tag;

}
