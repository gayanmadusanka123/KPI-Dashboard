export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ApiErrorResponse {
  error?: string;
  message?: string;
  code?: string;
  errors?: Record<string, string>;
}
