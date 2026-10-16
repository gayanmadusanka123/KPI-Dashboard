import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AddKpiDialog } from '../../components/add-kpi-dialog/add-kpi-dialog';
import { CommonModule } from '@angular/common';
import { KpiTable, Kpi, ReportingPeriod } from '../../components/kpi-table/kpi-table';


@Component({
  selector: 'app-kpi-management',
  imports: [CommonModule, KpiTable, MatSnackBarModule],
  templateUrl: './kpi-management.html',
  styleUrl: './kpi-management.css',
})
export class KpiManagement {
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  openAddKpiDialog(): void {
    const dialogRef = this.dialog.open(AddKpiDialog, {
      width: '900px',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'kpi-dialog-panel'
    });

    dialogRef.afterClosed().subscribe((result: {
      type: string;
      kpiData: Record<string, string>;
    } | undefined) => {
      if (!result || result.type !== 'create' || !result.kpiData) return;

      const kpi = this.createKpi(result.kpiData);
      this.kpis = [kpi, ...this.kpis];
      this.snackBar.open(`KPI "${kpi.name}" created successfully.`, 'Dismiss', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });

      this.openAddPeriodDialog(kpi);
    });
  }

  private createKpi(data: Record<string, string>): Kpi {
    const nextId = this.kpis.reduce((highest, kpi) => {
      const numericId = Number(kpi.id.replace('KPI-', ''));
      return Number.isFinite(numericId) ? Math.max(highest, numericId) : highest;
    }, 0) + 1;

    return {
      id: `KPI-${String(nextId).padStart(4, '0')}`,
      name: data['kpiName'],
      category: data['category'],
      dept: data['department'],
      owner: data['owner'],
      frequency: data['reportingFrequency'],
      target: '—',
      actual: '—',
      score: 0,
      status: 'On Track',
      trend: 'flat',
      updated: 'Just now',
      reportingHistory: [],
      directionOfGood: data['directionOfGood'] as Kpi['directionOfGood']
    };
  }

  openAddPeriodDialog(kpi: Kpi): void {
    const dialogRef = this.dialog.open(AddKpiDialog, {
      width: '900px',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'kpi-dialog-panel',
      data: { mode: 'period', kpi }
    });

    dialogRef.afterClosed().subscribe((result: { type: string; periodRecord: ReportingPeriod } | undefined) => {
      if (!result || result.type !== 'period' || !result.periodRecord) return;

      const existing = this.kpis.find(item => item.id === kpi.id);
      if (!existing) return;

      existing.reportingHistory = [...(existing.reportingHistory ?? []), result.periodRecord];
      existing.target = String(result.periodRecord.targetValue);
      existing.actual = result.periodRecord.actualValue === null ? '—' : String(result.periodRecord.actualValue);
      existing.score = result.periodRecord.performanceScore ?? 0;
      existing.status = result.periodRecord.status;
      existing.updated = 'Just now';
      existing.trend = existing.score > 100 ? 'up' : existing.score < 95 ? 'down' : 'flat';
      this.kpis = [...this.kpis];
    });
  }

  kpis: Kpi[] = [

    {
      id: 'KPI-0031',
      name: 'Monthly Revenue',
      category: 'Financial',
      dept: 'Sales',
      owner: 'A. Fernando',
      frequency: 'Monthly',
      target: '$118,000',
      actual: '$122,900',
      score: 104.2,
      status: 'On Track',
      trend: 'up',
      updated: '2 days ago'
    },

    {
      id: 'KPI-0018',
      name: 'CSAT Score',
      category: 'Customer',
      dept: 'CX',
      owner: 'D. Perera',
      frequency: 'Monthly',
      target: '4.50',
      actual: '4.61',
      score: 102.4,
      status: 'Exceeded',
      trend: 'up',
      updated: '1 day ago'
    },

    {
      id: 'KPI-0007',
      name: 'Headcount',
      category: 'People',
      dept: 'People Ops',
      owner: 'S. Jayasuriya',
      frequency: 'Monthly',
      target: '86',
      actual: '84',
      score: 97.7,
      status: 'On Track',
      trend: 'flat',
      updated: '5 days ago'
    },

    {
      id: 'KPI-0052',
      name: 'Defect Rate',
      category: 'Operations',
      dept: 'Manufacturing',
      owner: 'R. Silva',
      frequency: 'Weekly',
      target: '1.20%',
      actual: '1.68%',
      score: 71.4,
      status: 'At Risk',
      trend: 'down',
      updated: '12 hrs ago'
    },

    {
      id: 'KPI-0044',
      name: 'Sales Conversion',
      category: 'Growth',
      dept: 'Sales',
      owner: 'A. Fernando',
      frequency: 'Monthly',
      target: '22.0%',
      actual: '19.3%',
      score: 87.7,
      status: 'At Risk',
      trend: 'down',
      updated: '2 days ago'
    },

    {
      id: 'KPI-0009',
      name: 'Operational Cost',
      category: 'Financial',
      dept: 'Manufacturing',
      owner: 'R. Silva',
      frequency: 'Monthly',
      target: '$64,000',
      actual: '$71,200',
      score: 88.9,
      status: 'Off Track',
      trend: 'down',
      updated: '3 days ago'
    },

    {
      id: 'KPI-0026',
      name: 'Sales Conversion',
      category: 'Growth',
      dept: 'Sales',
      owner: 'A. Fernando',
      frequency: 'Monthly',
      target: '22.0%',
      actual: '19.3%',
      score: 87.7,
      status: 'At Risk',
      trend: 'down',
      updated: '2 days ago'
    },

  ];

}
