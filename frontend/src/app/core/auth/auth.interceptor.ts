import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.token;
  const isAuthRequest = request.url.endsWith('/auth/login') || request.url.endsWith('/auth/signup');

  const authenticatedRequest = token && !isAuthRequest
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;

  return next(authenticatedRequest).pipe(
    catchError(error => {
      if (error.status === 401 && !isAuthRequest) {
        auth.logout();
        void router.navigate(['/auth/login'], {
          queryParams: { reason: 'session-expired' }
        });
      }
      return throwError(() => error);
    })
  );
};
