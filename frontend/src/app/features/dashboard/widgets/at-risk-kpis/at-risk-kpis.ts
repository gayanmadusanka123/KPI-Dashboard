import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { atRiskKPIs } from '../../data/mockForecasts';

type RiskUrgency = 'Critical' | 'High' | 'Medium';

@Component({
  selector: 'app-at-risk-kpis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './at-risk-kpis.html',
  styleUrl: './at-risk-kpis.css',
})
export class AtRiskKpis {
  readonly riskItems = atRiskKPIs;

  readonly urgencyConfig: Record<
    RiskUrgency,
    { bg: string; color: string }
  > = {
    Critical: {
      bg: '#FEE2E2',
      color: '#991B1B',
    },
    High: {
      bg: '#FEF3C7',
      color: '#92400E',
    },
    Medium: {
      bg: '#E0E7FF',
      color: '#3730A3',
    },
  };

  getUrgencyConfig(urgency: string) {
    return (
      this.urgencyConfig[urgency as RiskUrgency] ??
      this.urgencyConfig.Medium
    );
  }

  formatProbability(probability: number): number {
    return Math.round(probability * 100);
  }
}