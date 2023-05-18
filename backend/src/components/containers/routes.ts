import type { Request, Response } from 'express';
import { AsyncRouter } from 'express-async-router';
import { StatusCodes } from 'http-status-codes';

import { saveContainer, getContainers, getContainer } from './logic';
import { throwIfInvalidContainerInput } from './validation';
import { getCompanyId } from '../../common/context';
import { getParcels, processParcels } from '../parcels';

export const router = AsyncRouter();

router.put('/:containerId/parcels/process', async (req: Request, res: Response) => {
  const savedParcels = await processParcels(getCompanyId(req), req.params.containerId);
  res.json(savedParcels);
});

router.get('/:containerId/parcels', async (req: Request, res: Response) => {
  const parcels = await getParcels(getCompanyId(req), req.params.containerId);
  res.json(parcels);
});

router.post('/', async (req: Request, res: Response) => {
  const containerInput: unknown = req.body;
  throwIfInvalidContainerInput(containerInput);
  const savedContainer = await saveContainer(getCompanyId(req), containerInput);
  res.status(StatusCodes.CREATED).json(savedContainer);
});

router.get('/', async (req: Request, res: Response) => {
  const containers = await getContainers(getCompanyId(req));
  res.json(containers);
});

router.get('/:containerId', async (req: Request, res: Response) => {
  const container = await getContainer(getCompanyId(req), req.params.containerId);
  res.json(container);
});
