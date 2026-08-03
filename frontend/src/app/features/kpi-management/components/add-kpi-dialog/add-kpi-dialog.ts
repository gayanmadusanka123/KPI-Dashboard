import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-kpi-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-kpi-dialog.html',
  styleUrl: './add-kpi-dialog.css',
})
export class AddKpiDialog {
  constructor(private dialogRef: MatDialogRef<AddKpiDialog>) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
