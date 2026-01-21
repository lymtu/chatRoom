type SuccessResponseCode = 200;

export interface SuccessResponse<T> {
  code: SuccessResponseCode;
  data: T;
  message?: string;
}

export type ErrorResponseCode = 301 | 307 | 400 | 401 | 403 | 404 | 409 | 500;

export interface ErrorResponse {
  code: ErrorResponseCode;
  message: string;
}

export type Response<T> = SuccessResponse<T> | ErrorResponse;
