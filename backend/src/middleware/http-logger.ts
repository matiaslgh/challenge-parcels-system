import pinoHttp from 'pino-http';

import { isDev } from '../common/env-utils';
import logger from '../common/logger';

export default pinoHttp({
  logger,
  customLogLevel: function (_req, res, err) {
    if (res.statusCode === undefined) {
      return 'info';
    }

    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    } else if (res.statusCode >= 500 || err) {
      return 'error';
    }
    return 'info';
  },
  autoLogging: isDev()
    ? false
    : {
        ignore: req => ['/health'].includes(req.url ?? ''),
      },
});
