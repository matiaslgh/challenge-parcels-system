import { AsyncRouter } from 'express-async-router';

import { companiesRouter } from './components/companies';

export const apiRouter = AsyncRouter();

apiRouter.use('/companies', companiesRouter);
