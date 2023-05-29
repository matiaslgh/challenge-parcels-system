import cors from 'cors';
import express from 'express';

import { apiRouter } from './api';
import { isProd } from './common/env-utils';
import globalErrorHandlerMiddleware from './middleware/global-error-handler';
import healthCheck from './middleware/health-check';
import httpLogger from './middleware/http-logger';

const app = express();
app.use(express.json());
app.use(httpLogger);
app.use(cors(isProd() ? { origin: process.env.FRONTEND_URL } : {}));
app.use('/api/', apiRouter);
app.get('/health', healthCheck);
app.use(globalErrorHandlerMiddleware);

export default app;
