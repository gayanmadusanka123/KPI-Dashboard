import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  mockKPIs,
  type KPI,
  type KPIStatus,
} from '../../data/mockKPIs';

type KPIFilter = KPIStatus | 'all';

@Component({
  selector: 'app-kpi-scorecard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-scorecard.html',
  styleUrl: './kpi-scorecard.css',
})
export class KpiScorecard {
  readonly kpis: KPI[] = mockKPIs;

  readonly selectedFilter = signal<KPIFilter>('all');

  readonly filteredKpis = computed(() => {
    const filter = this.selectedFilter();

    if (filter === 'all') {
      return this.kpis;
    }

    return this.kpis.filter((kpi) => kpi.status === filter);
  });

  readonly statusBorderColor: Record<KPIStatus, string> = {
    exceeded: '#2563EB',
    'on-track': '#16A34A',
    'at-risk': '#D97706',
    'off-track': '#DC2626',
  };

  readonly statusTopColor: Record<KPIStatus, string> = {
    exceeded: '#DBEAFE',
    'on-track': '#DCFCE7',
    'at-risk': '#FEF3C7',
    'off-track': '#FEE2E2',
  };

  readonly filterButtons: {
    label: string;
    value: KPIFilter;
    color: string;
  }[] = [
    { label: 'All', value: 'all', color: '#0F172A' },
    { label: 'Exceeded', value: 'exceeded', color: '#2563EB' },
    { label: 'On Track', value: 'on-track', color: '#16A34A' },
    { label: 'At Risk', value: 'at-risk', color: '#D97706' },
    { label: 'Off Track', value: 'off-track', color: '#DC2626' },
  ];

  setFilter(value: KPIFilter): void {
    this.selectedFilter.set(value);
  }

  getTrendSymbol(trend: KPI['trend']): string {
    switch (trend) {
      case 'improving':
        return '↑';
      case 'stable':
        return '→';
      case 'declining':
        return '↓';
    }
  }

  getTrendColor(trend: KPI['trend']): string {
    switch (trend) {
      case 'improving':
        return '#16A34A';
      case 'stable':
        return '#64748B';
      case 'declining':
        return '#DC2626';
    }
  }

  openKpi(kpi: KPI): void {
    // Add KPI detail navigation here when that page is implemented.
    console.log('Selected KPI:', kpi.id, kpi.name);
  }
}