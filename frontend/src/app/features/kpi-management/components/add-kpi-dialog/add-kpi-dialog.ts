import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-kpi-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-kpi-dialog.html',
  styleUrl: './add-kpi-dialog.css',
})
export class AddKpiDialog {

  private fb = inject(FormBuilder);
  

  constructor(private dialogRef: MatDialogRef<AddKpiDialog>) {}

  kpiForm = this.fb.group({

    kpiName: ['',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ] 
    ],

    description: ['', Validators.maxLength(500)],

    category: ['', Validators.required],

    department: ['', Validators.required],

    measurementUnit: ['', Validators.required],

    reportingFrequency: ['', Validators.required],

    direction: ['', Validators.required],

    status: ['Active', Validators.required]

  });

  submitted = false;

  onSubmit() {
    this.submitted = true;

    if (this.kpiForm.invalid) {
    return;
    }

    console.log(this.kpiForm.value);
    this.dialogRef.close(this.kpiForm.value);
  }
 
  closeDialog() {
    this.dialogRef.close();
  }
}
