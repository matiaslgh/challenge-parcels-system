import { pino } from 'pino';

jest.mock('./src/database/connection-data', () => ({
  user: 'user',
  password: 'password',
  host: 'localhost',
  port: 5433,
  database: 'parcels_test',
}));

jest.mock('./src/common/logger.ts', () => pino({ level: 'error' }));
process.env.PORT = '4000';
