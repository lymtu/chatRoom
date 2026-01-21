import { ErrorResponseCode } from "../types/response";

const responseStore: Record<
  ErrorResponseCode,
  (message?: string) => {
    code: ErrorResponseCode;
    message: string;
  }
> = {
  301: () => ({
    code: 301,
    message: "永久重定向",
  }),
  307: () => ({
    code: 307,
    message: "Temporary Redirect",
  }),
  400: (message: string = "Bad Request") => ({
    code: 400,
    message,
  }),
  401: (message: string = "Unauthorized") => ({
    code: 401,
    message,
  }),
  403: (message: string = "Forbidden") => ({
    code: 403,
    message,
  }),

  404: (message: string = "Not Found") => ({
    code: 404,
    message,
  }),
  409: (message: string = "Conflict") => ({
    code: 409,
    message,
  }),
  500: (message: string = "Internal Server Error") => ({
    code: 500,
    message,
  }),
} as const;

export default Object.freeze(responseStore);
