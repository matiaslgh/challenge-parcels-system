import { randomUUID } from 'crypto';
import { StatusCodes } from 'http-status-codes';
import request, { Response } from 'supertest';

import { createCompany, createBusinessRules, createContainer } from './test-utils';
import { BusinessRule } from '../src/components/business-rules';
import { ContainerInput } from '../src/components/containers';
import { END_DEPARTMENT, START_DEPARTMENT, ParcelDbParsed, ParcelInput } from '../src/components/parcels';
import { pool } from '../src/database/connection';
import app from '../src/index';

const parcelInput1: ParcelInput = {
  recipient: {
    name: 'Some name',
    address: {
      street: 'Some Street',
      houseNumber: '28',
      postalCode: '4744AT',
      city: 'Some City',
    },
  },
  weight: 0.02,
  value: 0.0,
};

const parcelInput2: ParcelInput = {
  ...parcelInput1,
  weight: 2.0,
  value: 0.0,
};

const parcelInput3: ParcelInput = {
  ...parcelInput1,
  weight: 20.0,
  value: 2000.0,
};

const containerInput: ContainerInput = {
  id: '68465468',
  shippingDate: '2016-07-22T00:00:00+02:00',
  parcels: [parcelInput1, parcelInput2, parcelInput3],
};

async function processParcels(companyId: string, containerId: string): Promise<Response> {
  return await request(app).put(`/api/companies/${companyId}/containers/${containerId}/parcels/process`);
}

describe('parcels', () => {
  let companyResponse: request.Response;
  let companyId: string;
  let businessRules: BusinessRule[];
  let containerId: string;

  afterEach(async () => {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM parcels');
      await client.query('DELETE FROM containers');
      await client.query('DELETE FROM business_rules');
      await client.query('DELETE FROM companies');
    } finally {
      client.release();
    }
  });

  beforeEach(async () => {
    companyResponse = await createCompany();
    companyId = companyResponse.body.id;

    businessRules = [
      {
        name: 'needs-insurance',
        sourceDepartment: START_DEPARTMENT,
        targetDepartment: 'Insurance',
        minValue: 1000,
      },
      {
        name: 'less-than-1kg',
        targetDepartment: 'Mail',
        maxWeight: 1,
      },
      {
        name: 'between-1kg-and-10kg',
        targetDepartment: 'Regular',
        minWeight: 1,
        maxWeight: 10,
      },
      {
        name: 'over-10kg',
        targetDepartment: 'Heavy',
        minWeight: 10,
      },
    ];

    await createBusinessRules(companyId, businessRules);

    const containerResponse = await createContainer(companyId, containerInput);
    containerId = containerResponse.body.id;
  });

  describe('/api/companies/:companyId/containers/parcels', () => {
    describe('PUT /process', () => {
      it('should process all the parcels of a container based on business rules', async () => {
        const response1 = await processParcels(companyId, containerId);
        expect(response1.statusCode).toEqual(StatusCodes.OK);
        const processedParcels1: ParcelDbParsed[] = response1.body;
        expect(processedParcels1).toHaveLength(3);
        expect(processedParcels1[0].sourceDepartment).toEqual('Mail');
        expect(processedParcels1[0].targetDepartment).toEqual(END_DEPARTMENT);
        expect(processedParcels1[1].sourceDepartment).toEqual('Regular');
        expect(processedParcels1[1].targetDepartment).toEqual(END_DEPARTMENT);
        expect(processedParcels1[2].sourceDepartment).toEqual('Insurance');
        expect(processedParcels1[2].targetDepartment).toEqual('Heavy');

        const response2 = await processParcels(companyId, containerId);
        expect(response2.statusCode).toEqual(StatusCodes.OK);
        const processedParcels2: ParcelDbParsed[] = response2.body;
        expect(processedParcels2).toHaveLength(3);
        expect(processedParcels2[0].sourceDepartment).toEqual(END_DEPARTMENT);
        expect(processedParcels2[0].targetDepartment).toEqual(null);
        expect(processedParcels2[1].sourceDepartment).toEqual(END_DEPARTMENT);
        expect(processedParcels2[1].targetDepartment).toEqual(null);
        expect(processedParcels2[2].sourceDepartment).toEqual('Heavy');
        expect(processedParcels2[2].targetDepartment).toEqual(END_DEPARTMENT);

        const response3 = await processParcels(companyId, containerId);
        expect(response3.statusCode).toEqual(StatusCodes.OK);
        const processedParcels3: ParcelDbParsed[] = response3.body;
        expect(processedParcels3).toHaveLength(3);
        expect(processedParcels3[0].sourceDepartment).toEqual(END_DEPARTMENT);
        expect(processedParcels3[0].targetDepartment).toEqual(null);
        expect(processedParcels3[1].sourceDepartment).toEqual(END_DEPARTMENT);
        expect(processedParcels3[1].targetDepartment).toEqual(null);
        expect(processedParcels3[2].sourceDepartment).toEqual(END_DEPARTMENT);
        expect(processedParcels3[2].targetDepartment).toEqual(null);
      });

      it('should return an error if there are no business rules for the company', async () => {
        const client = await pool.connect();
        try {
          await client.query('DELETE FROM business_rules');
        } finally {
          client.release();
        }

        const response = await processParcels(companyId, containerId);

        expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(response.body.error).toEqual(
          `Cannot process parcels because of missing business rules for company ${companyId}`,
        );
      });

      it('should return an empty list if the container does not have any parcels', async () => {
        const containerId = '1234';
        await createContainer(companyId, { ...containerInput, id: containerId, parcels: [] });

        const response = await processParcels(companyId, containerId);

        expect(response.statusCode).toEqual(StatusCodes.OK);
        expect(response.body).toHaveLength(0);
      });

      it('should return not found if the container does not exist', async () => {
        const nonExistentContainerId = '4321';

        const response = await processParcels(companyId, nonExistentContainerId);

        expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
        expect(response.body.error).toEqual(`Container ${nonExistentContainerId} not found for company ${companyId}`);
      });

      it('should return not found if the company does not exist', async () => {
        const nonExistentCompanyId = randomUUID();

        const response = await request(app).put(
          `/api/companies/${nonExistentCompanyId}/containers/${containerId}/parcels/process`,
        );

        expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
        expect(response.body.error).toEqual(`Company with id ${nonExistentCompanyId} does not exist`);
      });
    });
  });

  describe('GET /api/companies/:companyId/parcels/:parcelId', () => {
    it('should get a specific parcel for a company', async () => {
      const parcelsResponse = await request(app).get(`/api/companies/${companyId}/containers/${containerId}/parcels`);
      const firstParcel = parcelsResponse.body[0];

      const response = await request(app).get(`/api/companies/${companyId}/parcels/${firstParcel.id}`);

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.body).toEqual(firstParcel);
    });

    it('should return not found if the specified parcel does not exist', async () => {
      const nonExistentParcelId = randomUUID();

      const response = await request(app).get(`/api/companies/${companyId}/parcels/${nonExistentParcelId}`);
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(response.body.error).toEqual(`Parcel with id ${nonExistentParcelId} not found in company ${companyId}`);
    });
  });
});
