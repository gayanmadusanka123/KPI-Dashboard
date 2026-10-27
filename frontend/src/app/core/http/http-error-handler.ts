import { HttpErrorResponse } from '@angular/common/http';

import { ApiErrorResponse } from './api-response.models';

export function getHttpErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.'
): string {
  if (!(error instanceof HttpErrorResponse)) {
    return fallback;
  }

  if (typeof error.error === 'string' && error.error.trim()) {
    return error.error;
  }

  if (isApiErrorResponse(error.error)) {
    if (error.error.message?.trim()) {
      return error.error.message;
    }

    if (error.error.error?.trim()) {
      return error.error.error;
    }

    if (error.error.errors) {
      return Object.values(error.error.errors).join(' ');
    }

    const validationMessages = Object.entries(error.error)
      .filter(([key, value]) => key !== 'code' && typeof value === 'string')
      .map(([, value]) => value);

    if (validationMessages.length > 0) {
      return validationMessages.join(' ');
    }
  }

  if (error.status === 0) {
    return 'The backend is unavailable. Check that the API server is running.';
  }

  return error.statusText || fallback;
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return typeof value === 'object' && value !== null;
}
