import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { mockKPIs, type KPI, type KPIStatus } from '../../data/mockKPIs';

@Component({
  selector: 'app-target-achievement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './target-achievement.html',
  styleUrl: './target-achievement.css',
})
export class TargetAchievement {
  readonly kpis: KPI[] = mockKPIs;

  readonly onTargetCount = this.kpis.filter(
    k => k.status === 'exceeded' || k.status === 'on-track'
  ).length;

  readonly total = this.kpis.length;

  readonly rate = this.total > 0
    ? Math.round((this.onTargetCount / this.total) * 100)
    : 0;

 
  readonly prevRate = 38;

  readonly delta = this.rate - this.prevRate;

  readonly circumference = 188.5;

  abs(value: number): number {
    return Math.abs(value);
  }

  readonly statusSummary: {
    label: string;
    count: number;
    color: string;
  }[] = [
    {
      label: 'Exceeded',
      count: this.countByStatus('exceeded'),
      color: '#2563EB',
    },
    {
      label: 'On Track',
      count: this.countByStatus('on-track'),
      color: '#16A34A',
    },
    {
      label: 'At Risk',
      count: this.countByStatus('at-risk'),
      color: '#D97706',
    },
    {
      label: 'Off Track',
      count: this.countByStatus('off-track'),
      color: '#DC2626',
    },
  ];

  private countByStatus(status: KPIStatus): number {
    return this.kpis.filter(k => k.status === status).length;
  }
}