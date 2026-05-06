export class AppError extends Error {
  status: number;
  code: string;
  fieldErrors?: Record<string, string>;
  constructor(message: string, status = 0, code = 'APP_ERROR', fieldErrors?: Record<string, string>) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network unavailable') {
    super(message, 0, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class ValidationError extends AppError {
  constructor(fieldErrors: Record<string, string>) {
    super('Validation failed', 422, 'VALIDATION_ERROR', fieldErrors);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}
