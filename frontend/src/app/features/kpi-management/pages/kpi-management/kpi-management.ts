import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AddKpiDialog } from '../../components/add-kpi-dialog/add-kpi-dialog';
import { CommonModule } from '@angular/common';
import { KpiTable } from '../../components/kpi-table/kpi-table';
import { Kpi } from '../../models/kpi.models';
import { KpiFacade } from '../../state/kpi.facade';
import { mapKpiFormToRequest } from '../../data-access/mappers/kpi.mapper';


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
    private facade: KpiFacade
  ) {}

  kpis: Kpi[] = [];
  loading = false;
  error: string | null = null;
  private readonly subscriptions = new Subscription();

  ngOnInit(): void {
    this.subscriptions.add(this.facade.kpis$.subscribe(kpis => this.kpis = kpis));
    this.subscriptions.add(this.facade.loading$.subscribe(loading => this.loading = loading));
    this.subscriptions.add(this.facade.error$.subscribe(error => this.error = error));
    this.facade.loadKpis();
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

      const data = result.kpiData;
      const request = mapKpiFormToRequest({
        name: data['kpiName'] ?? '',
        categoryId: data['categoryId'] || null,
        departmentId: data['departmentId'] || null,
        ownerId: data['ownerId'] || null,
        description: data['description'] ?? '',
        dataSource: data['dataSource'] ?? '',
        measurementUnit: data['measurementUnit'] ?? '',
        reportingFrequency: data['reportingFrequency'] ?? '',
        directionOfGood: data['directionOfGood'] === 'Lower is Better'
          ? 'Lower is Better'
          : 'Higher is Better',
        status: data['status'] === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
        notes: data['notes'] ?? ''
      });

      this.facade.createKpi(request).subscribe({
        next: kpi => {
          this.snackBar.open(`KPI "${kpi.name}" created successfully.`, 'Dismiss', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          void this.router.navigate(['/kpi-management', kpi.id]);
        }
      });
    });
  }

  openKpiDetails(kpi: Kpi): void {
    this.router.navigate(['/kpi-management', kpi.id]);
  }

  reload(): void {
    this.facade.loadKpis();
  }

  deleteKpi(kpi: Kpi): void {
    if (!window.confirm(`Delete KPI "${kpi.name}"?`)) return;

    this.facade.deleteKpi(kpi.id).subscribe({
      next: () => this.snackBar.open('KPI deleted successfully.', 'Dismiss', {
        duration: 3000,
        panelClass: ['success-snackbar']
      })
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
