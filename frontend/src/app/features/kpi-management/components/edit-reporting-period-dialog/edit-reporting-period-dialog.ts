import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataConfidence, ReportingPeriod } from '../../models/kpi.models';

interface EditReportingPeriodData {
  period: ReportingPeriod;
}

@Component({
  selector: 'app-edit-reporting-period-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-reporting-period-dialog.html',
  styleUrl: './edit-reporting-period-dialog.css'
})
export class EditReportingPeriodDialog {
  readonly form;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<EditReportingPeriodDialog>,
    @Inject(MAT_DIALOG_DATA) public readonly data: EditReportingPeriodData
  ) {
    this.form = this.formBuilder.nonNullable.group({
      targetValue: [data.period.targetValue, [Validators.required, Validators.min(0)]],
      actualValue: [data.period.actualValue === null ? '' : data.period.actualValue, [Validators.min(0)]],
      dataConfidence: [data.period.dataConfidence || 'Medium' as DataConfidence],
      editReason: ['']
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const actualValue = value.actualValue === '' ? null : Number(value.actualValue);
    this.dialogRef.close({
      ...this.data.period,
      targetValue: Number(value.targetValue),
      actualValue,
      dataConfidence: value.dataConfidence,
      editReason: value.editReason.trim() || null,
      enteredAt: this.data.period.enteredAt
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
