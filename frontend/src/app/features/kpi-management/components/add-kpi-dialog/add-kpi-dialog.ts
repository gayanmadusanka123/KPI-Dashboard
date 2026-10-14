import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-kpi-dialog',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule ],
  templateUrl: './add-kpi-dialog.html',
  styleUrl: './add-kpi-dialog.css',
})
export class AddKpiDialog implements OnInit {

  kpiForm!: FormGroup;
  submitted = false;
  currentStep = 1;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddKpiDialog>
  ) {}

  ngOnInit(): void {

    this.kpiForm = this.fb.group({

      // step1
      kpiName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]
      ],

      category: ['', Validators.required],

      department: ['', Validators.required],

      owner: ['', Validators.required],

      // Optional fields
      description: [
        '',
        [
          Validators.maxLength(500)
        ]
      ],

      dataSource: [''],

      measurementUnit: ['',Validators.required],

      reportingFrequency: ['', Validators.required],

      directionOfGood: ['Higher is Better'],

      tags: [''],

      status: ['Active'],

      notes: [''],

      //step2

      period: [''],

      targetValue: ['', Validators.required],

      actualValue: [''],

      dataConfidence: ['Medium'],

    });

  }

  get f() {
    return this.kpiForm.controls;
  }

  continue(): void {

    this.submitted = true;

    if (this.kpiForm.invalid) {
      return;
    }

    console.log('KPI Created:', this.kpiForm.value);
     alert('✅ KPI created successfully.');
   

    this.dialogRef.close(this.kpiForm.value);

  }

  nextStep(): void {

    this.submitted = true;
    if (
      this.f['kpiName'].invalid ||
      this.f['category'].invalid ||
      this.f['department'].invalid ||
      this.f['owner'].invalid
    ) {
      return;
    }

    this.currentStep = 2;

  }

  previousStep(): void {
    this.currentStep = 1;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}