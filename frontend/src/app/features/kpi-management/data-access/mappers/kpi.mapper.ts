import {
  Kpi,
  KpiDetails,
  KpiDirection,
  ReportingPeriod
} from '../../models/kpi.models';
import {
  KpiDto,
  KpiRequestDto
} from '../dto/kpi.dto';
import { KpiPeriodDto } from '../dto/kpi-period.dto';
import { CreateKpiFormValue, UpdateKpiFormValue } from '../../models/kpi-form.models';

export function mapKpiDtoToKpi(dto: KpiDto): KpiDetails {
  return {
    id: dto.id,
    code: dto.kpiCode,
    name: dto.name,
    category: dto.categoryName ?? '—',
    dept: dto.departmentName ?? '—',
    owner: dto.ownerName ?? '—',
    frequency: dto.reportingFrequency ?? '—',
    target: '—',
    actual: '—',
    score: 0,
    status: 'Awaiting actual',
    trend: 'flat',
    updated: dto.updatedAt,
    reportingHistory: [],
    directionOfGood: dto.directionOfGood ?? undefined,
    description: dto.description ?? undefined,
    dataSource: dto.dataSource ?? undefined,
    measurementUnit: dto.measurementUnit ?? undefined,
    notes: dto.notes ?? undefined,
    activeStatus: dto.status,
    categoryId: dto.categoryId,
    departmentId: dto.departmentId,
    ownerId: dto.ownerId,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt
  };
}

export function mapKpiFormToRequest(
  form: CreateKpiFormValue | UpdateKpiFormValue
): KpiRequestDto {
  return {
    name: form.name.trim(),
    description: form.description.trim() || null,
    categoryId: form.categoryId,
    departmentId: form.departmentId,
    ownerId: form.ownerId,
    dataSource: form.dataSource.trim() || null,
    measurementUnit: form.measurementUnit.trim() || null,
    reportingFrequency: form.reportingFrequency,
    directionOfGood: form.directionOfGood,
    status: form.status,
    notes: form.notes.trim() || null
  };
}

export function mapPeriodDtoToReportingPeriod(
  dto: KpiPeriodDto,
  values: Partial<Pick<ReportingPeriod, 'targetValue' | 'actualValue' | 'dataConfidence' | 'notes'>> = {}
): ReportingPeriod {
  return {
    id: dto.id,
    kpiId: dto.kpiId,
    periodId: dto.id,
    period: dto.periodLabel ?? `${dto.periodStart} - ${dto.periodEnd}`,
    periodStart: dto.periodStart,
    periodEnd: dto.periodEnd,
    targetValue: values.targetValue ?? 0,
    actualValue: values.actualValue ?? null,
    performanceScore: null,
    variance: null,
    variancePct: null,
    status: 'Awaiting actual',
    notes: values.notes ?? '',
    dataConfidence: values.dataConfidence ?? 'Medium',
    enteredAt: dto.createdAt
  };
}

export function mapDirectionOfGood(value: string | null | undefined): KpiDirection | undefined {
  if (value === 'Higher is Better' || value === 'Lower is Better') {
    return value;
  }

  return undefined;
}
