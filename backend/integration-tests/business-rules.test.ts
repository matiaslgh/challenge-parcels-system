import { randomUUID } from 'crypto';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { createBusinessRules, createCompany } from './test-utils';
import app from '../src/app';
import { BusinessRule } from '../src/components/business-rules';
import { pool } from '../src/database/connection';

describe('/api/companies/:companyId/business-rules', () => {
  afterEach(async () => {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM business_rules');
      await client.query('DELETE FROM companies');
    } finally {
      client.release();
    }
  });

  describe('POST /', () => {
    it('should create business rules for a company and return them', async () => {
      const companyResponse = await createCompany();
      const companyId = companyResponse.body.id;

      const businessRules: BusinessRule[] = [
        {
          id: '1',
          name: 'needs-insurance',
          sourceDepartment: 'Distribution center',
          targetDepartment: 'Insurance',
          minValue: 1000,
        },
        {
          id: '2',
          name: 'less-than-1kg',
          targetDepartment: 'Mail',
          maxWeight: 1,
        },
        {
          id: '3',
          name: 'between-1kg-and-10kg',
          targetDepartment: 'Regular',
          minWeight: 1,
          maxWeight: 10,
        },
        {
          id: '4',
          name: 'over-10kg',
          targetDepartment: 'Heavy',
          minWeight: 10,
        },
      ];

      const response = await createBusinessRules(companyId, businessRules);

      expect(response.statusCode).toEqual(StatusCodes.CREATED);
      expect(response.body).toEqual({
        id: expect.any(String),
        companyId,
        rules: businessRules,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should update existing business rules and return the updated rules', async () => {
      const initialBusinessRules: BusinessRule[] = [
        {
          id: '1',
          name: 'rule-1',
          targetDepartment: 'Department 1',
        },
        {
          id: '2',
          name: 'rule-2',
          targetDepartment: 'Department 2',
        },
      ];

      const updatedBusinessRules: BusinessRule[] = [
        {
          id: '1',
          name: 'rule-1',
          targetDepartment: 'Updated Department 1',
        },
        {
          id: '3',
          name: 'rule-3',
          targetDepartment: 'Department 3',
        },
      ];

      const companyResponse = await createCompany();
      const companyId = companyResponse.body.id;

      await createBusinessRules(companyId, initialBusinessRules);

      const updateResponse = await createBusinessRules(companyId, updatedBusinessRules);

      expect(updateResponse.statusCode).toEqual(StatusCodes.CREATED);
      expect(updateResponse.body).toEqual({
        id: expect.any(String),
        companyId,
        rules: updatedBusinessRules,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
      expect(updateResponse.body.createdAt).not.toEqual(updateResponse.body.updatedAt);
    });

    it('should return an error when a rule name is repeated', async () => {
      const companyResponse = await createCompany();
      const companyId = companyResponse.body.id;
      const duplicateName = 'duplicate-rule';

      const businessRules: BusinessRule[] = [
        {
          id: '1',
          name: duplicateName,
          targetDepartment: 'Department 1',
        },
        {
          id: '2',
          name: duplicateName,
          targetDepartment: 'Department 2',
        },
      ];

      const response = await createBusinessRules(companyId, businessRules);

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body.error).toEqual(`Duplicate names: ${duplicateName}`);
    });

    it('should return a 404 error when company does not exist', async () => {
      const nonExistentCompanyId = randomUUID();

      const businessRules: BusinessRule[] = [
        {
          id: '1',
          name: 'rule-1',
          targetDepartment: 'Department 1',
        },
      ];

      const response = await createBusinessRules(nonExistentCompanyId, businessRules);

      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(response.body.error).toEqual(`Company with id ${nonExistentCompanyId} does not exist`);
    });
  });

  describe('GET /', () => {
    it('should return business rules for a company', async () => {
      const companyResponse = await createCompany();
      const companyId = companyResponse.body.id;

      const businessRules: BusinessRule[] = [
        {
          id: '1',
          name: 'rule-1',
          targetDepartment: 'Department 1',
        },
        {
          id: '2',
          name: 'rule-2',
          targetDepartment: 'Department 2',
        },
      ];

      await createBusinessRules(companyId, businessRules);

      const response = await request(app).get(`/api/companies/${companyId}/business-rules`);

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.body).toEqual({
        id: expect.any(String),
        companyId,
        rules: businessRules,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should return null when the company has no rules', async () => {
      const companyResponse = await createCompany();
      const companyId = companyResponse.body.id;

      const response = await request(app).get(`/api/companies/${companyId}/business-rules`);

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.body).toEqual(null);
    });
  });
});
