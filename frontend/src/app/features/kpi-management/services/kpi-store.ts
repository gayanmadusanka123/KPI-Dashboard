import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Kpi, ReportingPeriod } from '../models/kpi.models';

@Injectable({ providedIn: 'root' })
export class KpiStore {
  private readonly kpisSubject = new BehaviorSubject<Kpi[]>([
    {
      id: 'KPI-0031', name: 'Monthly Revenue', category: 'Financial', dept: 'Sales', owner: 'A. Fernando',
      frequency: 'Monthly', target: '$118,000', actual: '$122,900', score: 104.2, status: 'On Track', trend: 'up', updated: '2 days ago', reportingHistory: []
    },
    {
      id: 'KPI-0018', name: 'CSAT Score', category: 'Customer', dept: 'CX', owner: 'D. Perera',
      frequency: 'Monthly', target: '4.50', actual: '4.61', score: 102.4, status: 'Exceeded', trend: 'up', updated: '1 day ago', reportingHistory: []
    },
    {
      id: 'KPI-0007', name: 'Headcount', category: 'People', dept: 'People Ops', owner: 'S. Jayasuriya',
      frequency: 'Monthly', target: '86', actual: '84', score: 97.7, status: 'On Track', trend: 'flat', updated: '5 days ago', reportingHistory: []
    },
    {
      id: 'KPI-0052', name: 'Defect Rate', category: 'Operations', dept: 'Manufacturing', owner: 'R. Silva',
      frequency: 'Weekly', target: '1.20%', actual: '1.68%', score: 71.4, status: 'At Risk', trend: 'down', updated: '12 hrs ago', reportingHistory: []
    },
    {
      id: 'KPI-0044', name: 'Sales Conversion', category: 'Growth', dept: 'Sales', owner: 'A. Fernando',
      frequency: 'Monthly', target: '22.0%', actual: '19.3%', score: 87.7, status: 'At Risk', trend: 'down', updated: '2 days ago', reportingHistory: []
    },
    {
      id: 'KPI-0009', name: 'Operational Cost', category: 'Financial', dept: 'Manufacturing', owner: 'R. Silva',
      frequency: 'Monthly', target: '$64,000', actual: '$71,200', score: 88.9, status: 'Off Track', trend: 'down', updated: '3 days ago', reportingHistory: []
    },
    {
      id: 'KPI-0026', name: 'Website Traffic', category: 'Growth', dept: 'Marketing', owner: 'N. Wickrama',
      frequency: 'Weekly', target: '48,000', actual: '52,600', score: 109.6, status: 'Exceeded', trend: 'up', updated: '6 hrs ago', reportingHistory: []
    },
  ]);

  readonly kpis$ = this.kpisSubject.asObservable();

  getAll(): Kpi[] {
    return this.kpisSubject.value;
  }

  getById(id: string): Kpi | undefined {
    return this.kpisSubject.value.find(kpi => kpi.id === id);
  }

  addKpi(kpi: Kpi): void {
    this.kpisSubject.next([kpi, ...this.kpisSubject.value]);
  }

  addReportingPeriod(kpiId: string, period: ReportingPeriod): void {
    const updatedKpis = this.kpisSubject.value.map(kpi => {
      if (kpi.id !== kpiId) return kpi;

      const score = period.performanceScore ?? 0;
      const trend: Kpi['trend'] = score > 100 ? 'up' : score < 95 ? 'down' : 'flat';
      return {
        ...kpi,
        reportingHistory: [...kpi.reportingHistory, period],
        target: String(period.targetValue),
        actual: period.actualValue === null ? '—' : String(period.actualValue),
        score,
        status: period.status,
        updated: 'Just now',
        trend
      };
    });

    this.kpisSubject.next(updatedKpis);
  }
}