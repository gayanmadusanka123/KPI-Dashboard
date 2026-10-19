import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { KpiLookupApiService } from '../../data-access/api/kpi-lookup-api.service';
import { DepartmentDto, KpiCategoryDto, UserDto } from '../../data-access/dto/lookup.dto';
import { Kpi, KpiDetails } from '../../models/kpi.models';
import { ReportingPeriodOption } from '../../models/kpi-form.models';

@Component({
  selector: 'app-add-kpi-dialog',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule ],
  templateUrl: './add-kpi-dialog.html',
  styleUrl: './add-kpi-dialog.css',
})
export class AddKpiDialog implements OnInit {
  mode: 'create' | 'edit' | 'period' = 'create';
  selectedKpi: KpiDetails | null = null;

  kpiForm!: FormGroup;
  submitted = false;
  currentStep = 1;
  categories: KpiCategoryDto[] = [];
  departments: DepartmentDto[] = [];
  users: UserDto[] = [];
  lookupError: string | null = null;
  periodOptions: ReportingPeriodOption[] = [];
  periodError: string | null = null;
  existingPeriods: Kpi['reportingHistory'] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddKpiDialog>,
    private readonly lookupApi: KpiLookupApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.mode = data?.mode === 'period' ? 'period' : data?.mode === 'edit' ? 'edit' : 'create';
    this.selectedKpi = data?.kpi ?? null;
    this.existingPeriods = (data?.existingPeriods ?? []) as Kpi['reportingHistory'];
    if (this.mode === 'period') this.currentStep = 2;
  }

  buildPeriodOptions(frequency: string | undefined): ReportingPeriodOption[] {
    const normalizedFrequency = (frequency ?? 'Monthly').trim().toLowerCase();
    const options: ReportingPeriodOption[] = [];
    const today = new Date();

    if (normalizedFrequency === 'weekly') {
      const currentWeekStart = this.startOfWeek(today);
      for (let index = 0; index < 12; index += 1) {
        const start = this.addDays(currentWeekStart, -index * 7);
        const end = this.addDays(start, 6);
        options.push(this.createPeriodOption(
          start,
          end,
          `Week ${this.getWeekNumber(start)} · ${this.formatDate(start)} - ${this.formatDate(end)}`,
          index
        ));
      }
      return options;
    }

    if (normalizedFrequency === 'quarterly') {
      const currentQuarterStart = this.startOfQuarter(today);
      for (let index = 0; index < 8; index += 1) {
        const start = new Date(
          currentQuarterStart.getFullYear(),
          currentQuarterStart.getMonth() - index * 3,
          1
        );
        const end = new Date(start.getFullYear(), start.getMonth() + 3, 0);
        const quarter = Math.floor(start.getMonth() / 3) + 1;
        options.push(this.createPeriodOption(start, end, `Q${quarter} ${start.getFullYear()}`, index));
      }
      return options;
    }

    for (let index = 0; index < 12; index += 1) {
      const start = new Date(today.getFullYear(), today.getMonth() - index, 1);
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
      options.push(this.createPeriodOption(
        start,
        end,
        start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        index
      ));
    }
    return options;
  }

  createPeriodOption(
    start: Date,
    end: Date,
    label: string,
    sequence: number
  ): ReportingPeriodOption {
    const startValue = this.toDateValue(start);
    const endValue = this.toDateValue(end);
    return { value: startValue, label, start: startValue, end: endValue, sequence };
  }

  startOfWeek(date: Date): Date {
    const result = new Date(date);
    const day = result.getDay();
    const daysFromMonday = day === 0 ? 6 : day - 1;
    result.setHours(0, 0, 0, 0);
    result.setDate(result.getDate() - daysFromMonday);
    return result;
  }

  startOfQuarter(date: Date): Date {
    return new Date(date.getFullYear(), Math.floor(date.getMonth() / 3) * 3, 1);
  }

  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  getWeekNumber(date: Date): number {
    const firstDay = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - firstDay.getTime()) / 86400000);
    return Math.ceil((days + firstDay.getDay() + 1) / 7);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  toDateValue(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  get periodFrequency(): string {
    return (this.selectedKpi?.frequency ?? 'Monthly').toLowerCase();
  }

  get periodInputType(): 'date' | 'month' {
    return this.periodFrequency === 'weekly' ? 'date' : 'month';
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

    if (this.mode === 'period') {
      this.periodOptions = this.buildPeriodOptions(this.selectedKpi?.frequency);
      this.kpiForm.patchValue({
        period: this.periodOptions[0]?.value ?? ''
      });
    }

    if (this.mode === 'create' || this.mode === 'edit') {
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

    if (this.mode === 'edit' && this.selectedKpi) {
      this.kpiForm.patchValue({
        kpiName: this.selectedKpi.name,
        categoryId: this.selectedKpi.categoryId ?? '',
        departmentId: this.selectedKpi.departmentId ?? '',
        ownerId: this.selectedKpi.ownerId ?? '',
        description: this.selectedKpi.description ?? '',
        dataSource: this.selectedKpi.dataSource ?? '',
        measurementUnit: this.selectedKpi.measurementUnit ?? '',
        reportingFrequency: this.selectedKpi.frequency,
        directionOfGood: this.selectedKpi.directionOfGood ?? 'Higher is Better',
        status: this.selectedKpi.activeStatus ?? 'ACTIVE',
        notes: this.selectedKpi.notes ?? ''
      });
    }

  }

  get f() {
    return this.kpiForm.controls;
  }

  private getSelectedPeriod(): ReportingPeriodOption | null {
    const value = this.f['period'].value as string;
    if (!value) return null;

    if (this.periodFrequency === 'weekly') {
      const selectedDate = new Date(`${value}T00:00:00`);
      if (Number.isNaN(selectedDate.getTime())) return null;
      const start = this.startOfWeek(selectedDate);
      const end = this.addDays(start, 6);
      return this.createPeriodOption(
        start,
        end,
        `Week ${this.getWeekNumber(start)} · ${this.formatDate(start)} - ${this.formatDate(end)}`,
        0
      );
    }

    const [yearValue, monthValue] = value.split('-').map(Number);
    if (!yearValue || !monthValue) return null;
    const monthStart = new Date(yearValue, monthValue - 1, 1);

    if (this.periodFrequency === 'quarterly') {
      const start = this.startOfQuarter(monthStart);
      const end = new Date(start.getFullYear(), start.getMonth() + 3, 0);
      const quarter = Math.floor(start.getMonth() / 3) + 1;
      return this.createPeriodOption(start, end, `Q${quarter} ${start.getFullYear()}`, 0);
    }

    const end = new Date(yearValue, monthValue, 0);
    return this.createPeriodOption(
      monthStart,
      end,
      monthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      0
    );
  }

  continue(): void {
    this.submitted = true;

    if (this.mode === 'period') {
      if (this.f['period'].invalid || this.f['targetValue'].invalid) return;

      const selectedPeriod = this.getSelectedPeriod();
      if (!selectedPeriod) {
        this.periodError = 'Choose a valid reporting period.';
        return;
      }
      if (this.existingPeriods.some(existing =>
        existing.periodStart === selectedPeriod.start &&
        existing.periodEnd === selectedPeriod.end
      )) {
        this.periodError = 'A reporting record already exists for this period.';
        return;
      }
      this.periodError = null;

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
          period: selectedPeriod.label,
          periodStart: selectedPeriod.start,
          periodEnd: selectedPeriod.end,
          periodSequence: selectedPeriod.sequence,
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
      type: this.mode,
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