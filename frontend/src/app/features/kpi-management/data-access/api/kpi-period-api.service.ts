import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from '../../../../core/http/api-url';
import {
  KpiPeriodDto,
  KpiPeriodRequestDto
} from '../dto/kpi-period.dto';

@Injectable({ providedIn: 'root' })
export class KpiPeriodApiService {
  private readonly endpoint = `${API_URL}/api/kpi-periods`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<KpiPeriodDto[]> {
    return this.http.get<KpiPeriodDto[]>(this.endpoint);
  }

  getById(id: string): Observable<KpiPeriodDto> {
    return this.http.get<KpiPeriodDto>(`${this.endpoint}/${id}`);
  }

  create(request: KpiPeriodRequestDto): Observable<KpiPeriodDto> {
    return this.http.post<KpiPeriodDto>(this.endpoint, request);
  }

  update(id: string, request: KpiPeriodRequestDto): Observable<KpiPeriodDto> {
    return this.http.put<KpiPeriodDto>(`${this.endpoint}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
