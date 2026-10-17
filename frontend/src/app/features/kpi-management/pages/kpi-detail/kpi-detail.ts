import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AddKpiDialog } from '../../components/add-kpi-dialog/add-kpi-dialog';
import { Kpi, ReportingPeriod } from '../../models/kpi.models';
import { KpiStore } from '../../services/kpi-store';

@Component({
  selector: 'app-kpi-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatDialogModule],
  templateUrl: './kpi-detail.html',
  styleUrl: './kpi-detail.css'
})
export class KpiDetail implements OnInit {
  kpi: Kpi | undefined;
  selectedPeriod: ReportingPeriod | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private store: KpiStore
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.kpi = id ? this.store.getById(id) : undefined;

    this.store.kpis$.subscribe(kpis => {
      if (id) this.kpi = kpis.find(item => item.id === id);
    });
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
        this.store.addReportingPeriod(this.kpi.id, result.periodRecord);
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
      'Off Track': 'badge-bad'
    }[status] ?? 'badge-info';
  }
}