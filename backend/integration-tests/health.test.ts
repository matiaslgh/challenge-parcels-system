import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import app from '../src/app';

describe('/health', () => {
  it('should create a new company and return it', async () => {
    const response = await request(app).get('/health');

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
