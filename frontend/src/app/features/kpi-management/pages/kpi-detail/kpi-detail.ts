import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AddKpiDialog } from '../../components/add-kpi-dialog/add-kpi-dialog';
import { EditReportingPeriodDialog } from '../../components/edit-reporting-period-dialog/edit-reporting-period-dialog';
import { ReportingHistoryDialog } from '../../components/reporting-history-dialog/reporting-history-dialog';
import { Kpi, ReportingPeriod } from '../../models/kpi.models';
import { KpiFacade } from '../../state/kpi.facade';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-kpi-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatDialogModule],
  templateUrl: './kpi-detail.html',
  styleUrl: './kpi-detail.css'
})
export class KpiDetail implements OnInit, OnDestroy {
  kpi: Kpi | undefined;
  loading = false;
  error: string | null = null;
  private readonly subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private facade: KpiFacade,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'The KPI identifier is missing from the URL.';
      return;
    }

    this.subscriptions.add(this.facade.selectedKpi$.subscribe(kpi => {
      this.kpi = kpi ?? undefined;
      this.changeDetector.detectChanges();
    }));
    this.subscriptions.add(this.facade.loadingDetails$.subscribe(loading => {
      this.loading = loading;
      this.changeDetector.detectChanges();
    }));
    this.subscriptions.add(this.facade.error$.subscribe(error => {
      this.error = error;
      this.changeDetector.detectChanges();
    }));
    this.facade.loadKpi(id);
  }

  openAddPeriodDialog(): void {
    if (!this.kpi) return;

    const dialogRef = this.dialog.open(AddKpiDialog, {
      width: '900px',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'kpi-dialog-panel',
      data: {
        mode: 'period',
        kpi: this.kpi,
        existingPeriods: this.kpi.reportingHistory
      }
    });

    dialogRef.afterClosed().subscribe((result: { type: string; periodRecord: ReportingPeriod } | undefined) => {
      if (result?.type === 'period' && result.periodRecord && this.kpi) {
        this.facade.addReportingPeriod(this.kpi.id, result.periodRecord).subscribe({
          next: () => {
          }
        });
      }

    });
  }

  openEditKpiDialog(): void {
    if (!this.kpi) return;

    const dialogRef = this.dialog.open(AddKpiDialog, {
      width: '900px',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'kpi-dialog-panel',
      data: { mode: 'edit', kpi: this.kpi }
    });

    dialogRef.afterClosed().subscribe((result: {
      type: string;
      kpiData: Record<string, string>;
    } | undefined) => {
      if (!result || result.type !== 'edit' || !result.kpiData || !this.kpi) return;
      this.facade.updateKpi(this.kpi.id, {
        name: result.kpiData['kpiName'] ?? '',
        description: result.kpiData['description'] || null,
        categoryId: result.kpiData['categoryId'] || null,
        departmentId: result.kpiData['departmentId'] || null,
        ownerId: result.kpiData['ownerId'] || null,
        dataSource: result.kpiData['dataSource'] || null,
        measurementUnit: result.kpiData['measurementUnit'] || null,
        reportingFrequency: result.kpiData['reportingFrequency'] || null,
        directionOfGood: result.kpiData['directionOfGood'] === 'Lower is Better'
          ? 'Lower is Better'
          : 'Higher is Better',
        status: result.kpiData['status'] === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
        notes: result.kpiData['notes'] || null
      }).subscribe();
    });
  }

  editPeriod(period: ReportingPeriod): void {
    if (!this.kpi) return;

    const dialogRef = this.dialog.open(EditReportingPeriodDialog, {
      width: '480px',
      maxWidth: '95vw',
      disableClose: true,
      data: { period }
    });

    dialogRef.afterClosed().subscribe((updatedPeriod: ReportingPeriod | undefined) => {
      if (updatedPeriod) {
        this.facade.updateReportingPeriod(this.kpi!.id, updatedPeriod).subscribe();
      }
    });
  }

  openPeriodHistory(period: ReportingPeriod): void {
    if (!this.kpi || !period.periodId) return;

    this.facade.loadPeriodHistory(this.kpi.id, period.periodId).subscribe({
      next: history => {
        this.dialog.open(ReportingHistoryDialog, {
          width: '1000px',
          maxWidth: '95vw',
          data: { period, ...history }
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/kpi-management']);
  }

  getStatusClass(status: string): string {
    return {
      Exceeded: 'badge-info',
      'On Track': 'badge-good',
      'At Risk': 'badge-warn',
      'Off Track': 'badge-bad',
      'Awaiting actual': 'badge-info'
    }[status] ?? 'badge-info';
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}