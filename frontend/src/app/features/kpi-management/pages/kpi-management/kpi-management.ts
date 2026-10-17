import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { AddKpiDialog } from '../../components/add-kpi-dialog/add-kpi-dialog';
import { CommonModule } from '@angular/common';
import { KpiTable } from '../../components/kpi-table/kpi-table';
import { Kpi } from '../../models/kpi.models';
import { KpiStore } from '../../services/kpi-store';


@Component({
  selector: 'app-kpi-management',
  imports: [CommonModule, KpiTable, MatSnackBarModule],
  templateUrl: './kpi-management.html',
  styleUrl: './kpi-management.css',
})
export class KpiManagement implements OnInit {
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private store: KpiStore
  ) {}

  kpis: Kpi[] = [];

  ngOnInit(): void {
    this.store.kpis$.subscribe(kpis => this.kpis = kpis);
  }

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
      this.store.addKpi(kpi);
      this.snackBar.open(`KPI "${kpi.name}" created successfully.`, 'Dismiss', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });

      this.router.navigate(['/kpi-management', kpi.id]);
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

  openKpiDetails(kpi: Kpi): void {
    this.router.navigate(['/kpi-management', kpi.id]);
  }

}
