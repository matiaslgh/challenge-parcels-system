import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '../common/app-error';
import { pool } from '../database/connection';

export default async function healthCheck(_req: Request, res: Response): Promise<void> {
  try {
    await pool.query('SELECT 1');
    res.send({ status: 'ok' });
  } catch (err) {
    throw new AppError('Cannot connect to database', StatusCodes.INTERNAL_SERVER_ERROR, err);
  }
}
