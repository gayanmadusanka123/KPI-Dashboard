import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { KpiLookupApiService } from '../../data-access/api/kpi-lookup-api.service';
import { DepartmentDto, KpiCategoryDto, UserDto } from '../../data-access/dto/lookup.dto';

@Component({
  selector: 'app-add-kpi-dialog',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule ],
  templateUrl: './add-kpi-dialog.html',
  styleUrl: './add-kpi-dialog.css',
})
export class AddKpiDialog implements OnInit {
  mode: 'create' | 'period' = 'create';
  selectedKpi: any = null;

  kpiForm!: FormGroup;
  submitted = false;
  currentStep = 1;
  categories: KpiCategoryDto[] = [];
  departments: DepartmentDto[] = [];
  users: UserDto[] = [];
  lookupError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddKpiDialog>,
    private readonly lookupApi: KpiLookupApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.mode = data?.mode === 'period' ? 'period' : 'create';
    this.selectedKpi = data?.kpi ?? null;
    if (this.mode === 'period') this.currentStep = 2;
  }

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

      categoryId: ['', Validators.required],

      departmentId: ['', Validators.required],

      ownerId: ['', Validators.required],

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

      status: ['ACTIVE'],

      notes: [''],

      //step2

      period: ['', Validators.required],

      targetValue: ['', [Validators.required, Validators.min(0)]],

      actualValue: [''],

      dataConfidence: ['Medium'],

    });

    if (this.mode === 'create') {
      this.lookupApi.getCategories().subscribe({
        next: categories => this.categories = categories.filter(item => item.status === 'ACTIVE'),
        error: () => this.lookupError = 'Unable to load KPI categories.'
      });
      this.lookupApi.getDepartments().subscribe({
        next: departments => this.departments = departments.filter(item => item.status === 'ACTIVE'),
        error: () => this.lookupError = 'Unable to load departments.'
      });
      this.lookupApi.getUsers().subscribe({
        next: users => this.users = users.filter(item => item.status === null || item.status === 'ACTIVE'),
        error: () => this.lookupError = 'Unable to load KPI owners.'
      });
    }

  }

  get f() {
    return this.kpiForm.controls;
  }

  continue(): void {
    this.submitted = true;

    if (this.mode === 'period') {
      if (this.f['period'].invalid || this.f['targetValue'].invalid) return;

      const targetValue = Number(this.f['targetValue'].value);
      const actualRaw = this.f['actualValue'].value;
      const actualValue = actualRaw === '' || actualRaw === null ? null : Number(actualRaw);
      const score = actualValue === null || targetValue === 0
        ? null
        : (this.selectedKpi?.directionOfGood === 'Lower is Better'
            ? (actualValue === 0 ? 100 : targetValue / actualValue * 100)
            : actualValue / targetValue * 100);
      const variance = actualValue === null ? null : actualValue - targetValue;
      const variancePct = actualValue === null || targetValue === 0 ? null : (variance! / targetValue) * 100;
      const performance = score ?? 0;
      const status = performance > 100 ? 'Exceeded'
        : performance >= 95 ? 'On Track'
        : performance >= 85 ? 'At Risk'
        : 'Off Track';

      this.dialogRef.close({
        type: 'period',
        periodRecord: {
          period: this.f['period'].value,
          targetValue,
          actualValue,
          performanceScore: score === null ? null : Number(score.toFixed(2)),
          variance: variance === null ? null : Number(variance.toFixed(2)),
          variancePct: variancePct === null ? null : Number(variancePct.toFixed(2)),
          status,
          notes: this.f['notes'].value ?? '',
          dataConfidence: this.f['dataConfidence'].value || 'Medium',
          enteredAt: new Date().toISOString()
        }
      });
      return;
    }

    if (
      this.f['kpiName'].invalid ||
      this.f['categoryId'].invalid ||
      this.f['departmentId'].invalid ||
      this.f['ownerId'].invalid ||
      this.f['measurementUnit'].invalid ||
      this.f['reportingFrequency'].invalid
    ) {
      return;
    }

    this.dialogRef.close({
      type: 'create',
      kpiData: this.kpiForm.value
    });
  }

  get performanceScore(): number | null {
    const target = Number(this.f['targetValue']?.value);
    const raw = this.f['actualValue']?.value;
    if (raw === '' || raw === null || raw === undefined || !Number.isFinite(target) || target === 0) return null;
    const actual = Number(raw);
    const score = this.selectedKpi?.directionOfGood === 'Lower is Better'
      ? (actual === 0 ? 100 : target / actual * 100)
      : actual / target * 100;
    return Number.isFinite(score) ? Number(score.toFixed(2)) : null;
  }

  get variance(): number | null {
    const raw = this.f['actualValue']?.value;
    if (raw === '' || raw === null || raw === undefined) return null;
    return Number((Number(raw) - Number(this.f['targetValue']?.value)).toFixed(2));
  }

  get variancePct(): number | null {
    const target = Number(this.f['targetValue']?.value);
    if (!target || this.variance === null) return null;
    return Number((this.variance / target * 100).toFixed(2));
  }

  get periodStatus(): string {
    const score = this.performanceScore;
    if (score === null) return 'Awaiting actual';
    if (score > 100) return 'Exceeded';
    if (score >= 95) return 'On Track';
    if (score >= 85) return 'At Risk';
    return 'Off Track';
  }

  nextStep(): void {
    this.continue();

  }

  previousStep(): void {
    this.currentStep = 1;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}