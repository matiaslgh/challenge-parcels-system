import type { Request, Response } from 'express';
import { AsyncRouter } from 'express-async-router';

import { getParcel } from './logic';
import { getCompanyId } from '../../common/context';

export const router = AsyncRouter();

router.get('/:parcelId', async (req: Request, res: Response) => {
  const parcels = await getParcel(getCompanyId(req), req.params.parcelId);
  res.json(parcels);
});
