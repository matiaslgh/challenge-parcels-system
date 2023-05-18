import type { Request, Response } from 'express';
import { AsyncRouter } from 'express-async-router';
import { StatusCodes } from 'http-status-codes';

import { getBusinessRules, saveBusinessRules } from './logic';
import { throwIfInvalidBusinessRules } from './validations';
import { getCompanyId } from '../../common/context';

export const router = AsyncRouter();

router.post('/', async (req: Request, res: Response) => {
  const businessRules: unknown = req.body;
  throwIfInvalidBusinessRules(businessRules);
  const savedRule = await saveBusinessRules(getCompanyId(req), businessRules);
  res.status(StatusCodes.CREATED).json(savedRule);
});

router.get('/', async (req: Request, res: Response) => {
  const businessRules = await getBusinessRules(getCompanyId(req));
  res.json(businessRules);
});
