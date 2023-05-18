import type { Request, Response } from 'express';
import { AsyncRouter } from 'express-async-router';
import { StatusCodes } from 'http-status-codes';

import { createCompany, getCompany, getCompanies } from './logic';
import { throwIfInvalidCompanyInput } from './validation';
import { getCompanyId } from '../../common/context';
import { throwIfNoUuid } from '../../common/validation';
import { businessRulesRouter } from '../business-rules';
import { containersRouter } from '../containers';
import { parcelsRouter } from '../parcels';

export const router = AsyncRouter();

router.get('/', async () => {
  return await getCompanies();
});

router.post('/', async (req: Request, res: Response) => {
  const companyInput: unknown = req.body;
  throwIfInvalidCompanyInput(companyInput);
  const company = await createCompany(companyInput);
  res.status(StatusCodes.CREATED).json(company);
});

router.use('/:companyId', (req, _res, next) => {
  throwIfNoUuid(req.params.companyId);
  req.context = req.context ?? {};
  req.context.companyId = req.params.companyId;
  next();
});

router.use('/:companyId/containers', containersRouter);

router.use('/:companyId/parcels', parcelsRouter);

router.use('/:companyId/business-rules', businessRulesRouter);

router.get('/:companyId', async req => {
  return await getCompany(getCompanyId(req));
});
