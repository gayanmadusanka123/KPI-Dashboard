import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReportingPeriod } from '../../models/kpi.models';
import { KpiActualHistoryDto, KpiTargetHistoryDto } from '../../data-access/dto/kpi-history.dto';

interface ReportingHistoryData {
  period: ReportingPeriod;
  targetHistory: KpiTargetHistoryDto[];
  actualHistory: KpiActualHistoryDto[];
}

type HistoryRow =
  | { kind: 'Target'; modifiedAt: string; previousValue: number; newValue: number; confidence: string; reason: string | null }
  | { kind: 'Actual'; modifiedAt: string; previousValue: number; newValue: number; confidence: string; reason: string | null };

@Component({
  selector: 'app-reporting-history-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reporting-history-dialog.html',
  styleUrl: './reporting-history-dialog.css'
})
export class ReportingHistoryDialog {
  readonly rows: HistoryRow[];

  constructor(
    private readonly dialogRef: MatDialogRef<ReportingHistoryDialog>,
    @Inject(MAT_DIALOG_DATA) public readonly data: ReportingHistoryData
  ) {
    this.rows = [
      ...data.targetHistory.map(item => ({
        kind: 'Target' as const,
        modifiedAt: item.recordedAt,
        previousValue: item.oldTargetValue,
        newValue: item.newTargetValue,
        confidence: '—',
        reason: item.editReason
      })),
      ...data.actualHistory.map(item => ({
        kind: 'Actual' as const,
        modifiedAt: item.recordedAt,
        previousValue: item.oldActualValue,
        newValue: item.newActualValue,
        confidence: `${item.oldDataConfidence} → ${item.newDataConfidence}`,
        reason: item.editReason
      }))
    ].sort((left, right) => right.modifiedAt.localeCompare(left.modifiedAt));
  }

  close(): void {
    this.dialogRef.close();
  }
}
