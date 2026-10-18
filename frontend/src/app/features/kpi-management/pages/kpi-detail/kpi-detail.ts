import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AddKpiDialog } from '../../components/add-kpi-dialog/add-kpi-dialog';
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
  selectedPeriod: ReportingPeriod | null = null;
  loading = false;
  error: string | null = null;
  private readonly subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private facade: KpiFacade
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.subscriptions.add(this.facade.selectedKpi$.subscribe(kpi => this.kpi = kpi ?? undefined));
    this.subscriptions.add(this.facade.loadingDetails$.subscribe(loading => this.loading = loading));
    this.subscriptions.add(this.facade.error$.subscribe(error => this.error = error));
    this.facade.loadKpi(id);
  }

  openAddPeriodDialog(): void {
    if (!this.kpi) return;

    const dialogRef = this.dialog.open(AddKpiDialog, {
      width: '900px',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'kpi-dialog-panel',
      data: { mode: 'period', kpi: this.kpi }
    });

    dialogRef.afterClosed().subscribe((result: { type: string; periodRecord: ReportingPeriod } | undefined) => {
      if (result?.type === 'period' && result.periodRecord && this.kpi) {
        this.facade.addReportingPeriod(this.kpi.id, result.periodRecord).subscribe({
          next: () => {
            this.selectedPeriod = null;
          }
        });
      }
    });
  }

  showPeriodHistory(period: ReportingPeriod): void {
    this.selectedPeriod = period;
  }

  closePeriodHistory(): void {
    this.selectedPeriod = null;
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