import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthRequest, AuthResponse, AuthUser } from './auth.models';

const API_URL = 'http://localhost:8081';
const TOKEN_KEY = 'kpi_access_token';
const USER_KEY = 'kpi_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userSubject = new BehaviorSubject<AuthUser | null>(this.readUser());
  readonly user$ = this.userSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  get currentUser(): AuthUser | null {
    return this.userSubject.value;
  }

  get token(): string | null {
    return this.readStorage(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return Boolean(this.token);
  }

  signup(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/signup`, request);
  }

  login(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/login`, request).pipe(
      tap(response => this.saveSession(response))
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.userSubject.next(null);
  }

  private saveSession(response: AuthResponse): void {
    if (!response.token) {
      throw new Error('The login response did not contain an access token.');
    }

    localStorage.setItem(TOKEN_KEY, response.token);
    if (response.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      this.userSubject.next(response.user);
    }
  }

  private readUser(): AuthUser | null {
    const value = this.readStorage(USER_KEY);
    if (!value) return null;

    try {
      return JSON.parse(value) as AuthUser;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  }

  private readStorage(key: string): string | null {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
  }
}
