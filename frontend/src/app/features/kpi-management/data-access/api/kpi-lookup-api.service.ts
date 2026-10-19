import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from '../../../../core/http/api-url';
import { DepartmentDto, KpiCategoryDto, UserDto } from '../dto/lookup.dto';

@Injectable({ providedIn: 'root' })
export class KpiLookupApiService {
  constructor(private readonly http: HttpClient) {}

  getCategories(): Observable<KpiCategoryDto[]> {
    return this.http.get<KpiCategoryDto[]>(`${API_URL}/api/kpi-categories`);
  }

  getDepartments(): Observable<DepartmentDto[]> {
    return this.http.get<DepartmentDto[]>(`${API_URL}/api/departments`);
  }

  getUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${API_URL}/api/users`);
  }
}
