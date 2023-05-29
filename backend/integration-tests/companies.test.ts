import { randomUUID } from 'crypto';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { createCompany } from './test-utils';
import app from '../src/app';
import { CompanyInput } from '../src/components/companies';
import { pool } from '../src/database/connection';

describe('/api/companies', () => {
  afterEach(async () => {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM companies');
    } finally {
      client.release();
    }
  });

  describe('POST /', () => {
    it('should create a new company and return it', async () => {
      const companyName = 'some-name';
      const response = await createCompany({ name: companyName });

      expect(response.statusCode).toEqual(StatusCodes.CREATED);
      expect(response.body).toEqual({
        createdAt: expect.any(String),
        id: expect.any(String),
        name: companyName,
        updatedAt: expect.any(String),
      });
    });

    it('should fail to create a company with existing name', async () => {
      const existingCompany: CompanyInput = { name: 'existing-name' };
      await createCompany(existingCompany);
      const response = await createCompany(existingCompany);

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body.error).toEqual(`Company with name "${existingCompany.name}" already exists`);
    });
  });

  describe('GET /', () => {
    it('should get all companies', async () => {
      // Create some companies in the database
      const company1: CompanyInput = { name: 'Company 1' };
      const company2: CompanyInput = { name: 'Company 2' };
      await createCompany(company1);
      await createCompany(company2);

      const response = await request(app).get('/api/companies');

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toEqual(company1.name);
      expect(response.body[1].name).toEqual(company2.name);
    });

    it('should return an empty list when there are no companies', async () => {
      const response = await request(app).get('/api/companies');

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.body).toHaveLength(0);
    });
  });
  describe('GET /:id', () => {
    it('should get a company by ID', async () => {
      // Create a company in the database
      const company = { name: 'Company' };
      const createResponse = await createCompany(company);
      const companyId = createResponse.body.id;

      const response = await request(app).get(`/api/companies/${companyId}`);

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.body.id).toEqual(companyId);
      expect(response.body.name).toEqual(company.name);
    });

    it('should return a 404 error when company does not exist', async () => {
      const nonExistentCompanyId = randomUUID();

      const response = await request(app).get(`/api/companies/${nonExistentCompanyId}`);

      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(response.body.error).toEqual(`Company with id ${nonExistentCompanyId} does not exist`);
    });
  });
});
