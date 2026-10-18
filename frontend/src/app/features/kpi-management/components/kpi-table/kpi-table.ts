import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Kpi } from '../../models/kpi.models';

export type { Kpi } from '../../models/kpi.models';

@Component({
  selector: 'app-kpi-table',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './kpi-table.html',
  styleUrl: './kpi-table.css'
})


export class KpiTable implements OnChanges {

  @Input() kpis: Kpi[] = [];
  @Output() viewDetails = new EventEmitter<Kpi>();
  @Output() delete = new EventEmitter<Kpi>();
  @Output() edit = new EventEmitter<Kpi>();

  filteredKpis: Kpi[] = [];

  searchText = '';

  selectedCategory = '';
  selectedDepartment = '';
  selectedStatus = '';
  selectedKpi: Kpi | null = null;
  viewMode: 'table' | 'cards' = 'table';

  get onTrackCount(): number {
    return this.kpis.filter(kpi => kpi.status === 'On Track').length;
  }

  get atRiskCount(): number {
    return this.kpis.filter(kpi => kpi.status === 'At Risk').length;
  }

  get offTrackCount(): number {
    return this.kpis.filter(kpi => kpi.status === 'Off Track').length;
  }

  get averageScore(): number {
    const scored = this.kpis.filter(kpi => Number.isFinite(kpi.score) && kpi.score > 0);
    if (scored.length === 0) return 0;
    return Number((scored.reduce((sum, kpi) => sum + kpi.score, 0) / scored.length).toFixed(1));
  }


  sortColumn = '';
  sortAsc = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['kpis']) {
      this.filteredKpis = [...this.kpis];
    }
  }

  filterKpis(): void {

    this.filteredKpis = this.kpis.filter(kpi => {

      const matchesSearch =
        kpi.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        kpi.id.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesCategory =
        !this.selectedCategory ||
        kpi.category === this.selectedCategory;

      const matchesDepartment =
        !this.selectedDepartment ||
        kpi.dept === this.selectedDepartment;

      const matchesStatus =
        !this.selectedStatus ||
        kpi.status === this.selectedStatus;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDepartment &&
        matchesStatus
      );

    });

  }

  sort(column: keyof Kpi): void {

    if (this.sortColumn === column) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortColumn = column;
      this.sortAsc = true;
    }

    this.filteredKpis.sort((a: any, b: any) => {

      const valueA = a[column];
      const valueB = b[column];

      if (valueA < valueB) {
        return this.sortAsc ? -1 : 1;
      }

      if (valueA > valueB) {
        return this.sortAsc ? 1 : -1;
      }

      return 0;

    });

  }

  // openActions(kpi: Kpi): void {
  //   console.log('Actions:', kpi);
  // }

  viewKpi(kpi: Kpi): void {
    this.viewDetails.emit(kpi);
  }

  editKpi(kpi: Kpi): void {
    this.edit.emit(kpi);
  }

  deleteKpi(kpi: Kpi): void {
    this.delete.emit(kpi);
  }

  sparklines: { [key: string]: number[] } = {
    'KPI-0031': [96, 99, 101, 98, 103, 102, 105, 104.2],
    'KPI-0018': [94, 96, 97, 99, 98, 100, 101, 102.4],
    'KPI-0007': [99, 98, 99, 97, 98, 98, 97, 97.7],
    'KPI-0052': [88, 85, 82, 80, 77, 75, 73, 71.4],
    'KPI-0044': [98, 96, 93, 91, 90, 88, 89, 87.7],
    'KPI-0009': [102, 99, 96, 94, 92, 90, 89, 88.9],
    'KPI-0061': [98, 101, 103, 105, 104, 107, 108, 109.6],
    'KPI-0025': [103, 101, 99, 98, 97, 96, 95.5, 95.0],
    'KPI-0026': [98, 96, 94, 92, 90, 93.0, 93.0, 93.0]
  };

  getStatusColor(status: string): string {
    switch (status) {
      case 'Exceeded': return '#3B6FD6';
      case 'On Track': return '#1B8A5A';
      case 'At Risk': return '#B7791F';
      case 'Off Track': return '#C13F3F';
      default: return '#3B6FD6';
    }
  }

  getProgressPct(kpi: Kpi): number {
    if (!kpi.score) return 0;
    return Math.max(6, Math.min(100, Math.round((kpi.score / 120) * 100)));
  }

  private getSparklinePointsArray(kpi: Kpi): { x: number; y: number }[] {
    const points = this.sparklines[kpi.id] || [95, 96, 98, 97, 99, 100, 101, kpi.score || 100];
    const w = 240, h = 44, pad = 4;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = (max - min) || 1;
    const step = (w - pad * 2) / (points.length - 1);
    return points.map((v, i) => ({
      x: Number((pad + i * step).toFixed(1)),
      y: Number((pad + (h - pad * 2) * (1 - (v - min) / range)).toFixed(1))
    }));
  }

  getSparklinePath(kpi: Kpi): string {
    const pts = this.getSparklinePointsArray(kpi);
    return pts.map(p => `${p.x},${p.y}`).join(' ');
  }

  getLastSparklinePoint(kpi: Kpi): { x: number; y: number } {
    const pts = this.getSparklinePointsArray(kpi);
    return pts[pts.length - 1] || { x: 236, y: 22 };
  }

}