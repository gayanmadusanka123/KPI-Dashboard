import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from '../../../../core/http/api-url';
import {
  KpiDto,
  KpiRequestDto
} from '../dto/kpi.dto';

@Injectable({ providedIn: 'root' })
export class KpiApiService {
  private readonly endpoint = `${API_URL}/api/kpis`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<KpiDto[]> {
    return this.http.get<KpiDto[]>(this.endpoint);
  }

  getById(id: string): Observable<KpiDto> {
    return this.http.get<KpiDto>(`${this.endpoint}/${id}`);
  }

  create(request: KpiRequestDto): Observable<KpiDto> {
    return this.http.post<KpiDto>(this.endpoint, request);
  }

  update(id: string, request: KpiRequestDto): Observable<KpiDto> {
    return this.http.put<KpiDto>(`${this.endpoint}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
