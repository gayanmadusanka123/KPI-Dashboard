import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { mockKPIs } from '../../data/mockKPIs';

type FreshnessStatus = 'current' | 'due-today' | 'overdue';

@Component({
  selector: 'app-data-freshness',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-freshness.html',
  styleUrl: './data-freshness.css',
})
export class DataFreshness {
  readonly kpis = mockKPIs;

  readonly freshnessConfig: Record<
    FreshnessStatus,
    {
      bg: string;
      color: string;
      label: string;
      dot: string;
    }
  > = {
    current: {
      bg: '#DCFCE7',
      color: '#166534',
      label: 'Current',
      dot: '#16A34A',
    },
    'due-today': {
      bg: '#FEF3C7',
      color: '#92400E',
      label: 'Due Today',
      dot: '#D97706',
    },
    overdue: {
      bg: '#FEE2E2',
      color: '#991B1B',
      label: 'Overdue',
      dot: '#DC2626',
    },
  };

  readonly freshnessStatuses: FreshnessStatus[] = [
    'current',
    'due-today',
    'overdue',
  ];

  getFreshnessConfig(status: string) {
    return (
      this.freshnessConfig[status as FreshnessStatus] ??
      this.freshnessConfig.current
    );
  }
}