import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from '../../../../core/http/api-url';
import {
  KpiActualDto,
  KpiActualRequestDto
} from '../dto/kpi-actual.dto';

@Injectable({ providedIn: 'root' })
export class KpiActualApiService {
  private readonly endpoint = `${API_URL}/api/kpi-actuals`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<KpiActualDto[]> {
    return this.http.get<KpiActualDto[]>(this.endpoint);
  }

  getById(id: string): Observable<KpiActualDto> {
    return this.http.get<KpiActualDto>(`${this.endpoint}/${id}`);
  }

  create(request: KpiActualRequestDto): Observable<KpiActualDto> {
    return this.http.post<KpiActualDto>(this.endpoint, request);
  }

  update(id: string, request: KpiActualRequestDto): Observable<KpiActualDto> {
    return this.http.put<KpiActualDto>(`${this.endpoint}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
