import { StatusCodes } from 'http-status-codes';

/**
 * Custom error class representing an application-specific error.
 * This class is useful to handle errors in a centralized place.
 */
export class AppError extends Error {
  public readonly httpCode: number;
  public readonly originalError: unknown;

  /**
   * Constructs a new instance of the AppError class.
   *
   * @param message - The error message.
   * @param httpCode - The HTTP status code associated with the error.
   * @param originalError - The original error object associated with the error.
   */
  constructor(message: string, httpCode: number, originalError?: unknown) {
    super(message);

    // restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
    this.httpCode = httpCode;
    this.originalError = originalError;

    Error.captureStackTrace(this);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(message, StatusCodes.NOT_FOUND, originalError);
  }
}

export class InvalidInputError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(message, StatusCodes.BAD_REQUEST, originalError);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(message, StatusCodes.FORBIDDEN, originalError);
  }
}
export class NotAuthenticatedError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(message, StatusCodes.UNAUTHORIZED, originalError);
  }
}
