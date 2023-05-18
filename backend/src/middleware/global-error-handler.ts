import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '../common/app-error';
import logger from '../common/logger';

function formatLog(req: Request, statusCode: number, errorMessage: string): string {
  return `${req.method} ${req.url} -> ${statusCode} | ${errorMessage}`;
}

export default function globalErrorHandlerMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  // TODO: Track  metrics here
  if (err instanceof AppError) {
    if (err.httpCode >= 400 && err.httpCode < 500) {
      logger.warn(formatLog(req, err.httpCode, err.message));
    } else if (err.httpCode >= 500) {
      logger.error(err.originalError ?? err, formatLog(req, err.httpCode, err.message));
    }
    res.status(err.httpCode).json({ error: err.message });
  } else {
    const errorMessage = 'Something went wrong';
    const statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    logger.error(err, formatLog(req, statusCode, errorMessage));
    res.status(statusCode).json({ error: errorMessage });
  }
}
