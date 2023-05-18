import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import globalErrorHandlerMiddleware from './global-error-handler';
import { AppError } from '../common/app-error';
import logger from '../common/logger';

jest.mock('../common/logger', () => ({
  warn: jest.fn(),
  error: jest.fn(),
}));

describe('globalErrorHandlerMiddleware', () => {
  let req: Request;
  let res: Response;
  let next: jest.Mock;

  beforeEach(() => {
    req = { method: 'GET', url: '/api/users' } as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle AppError with HTTP status code < 500 by responding the error as json and logging a warning', () => {
    const appError = new AppError('This is a bad request', 400);
    globalErrorHandlerMiddleware(appError, req, res, next);

    expect(logger.warn).toHaveBeenCalledWith('GET /api/users -> 400 | This is a bad request');
    expect(res.status).toHaveBeenCalledWith(appError.httpCode);
    expect(res.json).toHaveBeenCalledWith({ error: appError.message });
  });

  it('should handle AppError with HTTP status code >= 500 by responding the error as json and logging an error', () => {
    const appError = new AppError('Internal Server Error', 500);
    globalErrorHandlerMiddleware(appError, req, res, next);

    expect(logger.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(appError.httpCode);
    expect(res.json).toHaveBeenCalledWith({ error: appError.message });
  });

  it('should handle unknown error with HTTP 500 status code and responding custom error message', () => {
    const unknownError = new Error('Unknown Error');
    globalErrorHandlerMiddleware(unknownError, req, res, next);

    expect(logger.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ error: 'Something went wrong' });
  });
});
