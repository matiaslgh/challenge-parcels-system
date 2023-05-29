import { randomUUID } from 'crypto';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { createCompany, createBusinessRules, createContainer } from './test-utils';
import app from '../src/app';
import { BusinessRule } from '../src/components/business-rules';
import { ContainerDbParsedWithParcels, ContainerInput } from '../src/components/containers';
import { ParcelDbParsed, ParcelInput } from '../src/components/parcels';
import { pool } from '../src/database/connection';

const containerInput: ContainerInput = {
  id: '68465468',
  shippingDate: '2016-07-22T00:00:00+02:00',
  parcels: [
    {
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
    },
    {
      recipient: {
        name: 'Another Name',
        address: {
          street: 'Another Street',
          houseNumber: '111',
          postalCode: '3036MN',
          city: 'Another City',
        },
      },
      weight: 2.0,
      value: 0.0,
    },
  ],
};

function expectContainer(
  companyId: string,
  containerInput: ContainerInput,
  container: ContainerDbParsedWithParcels,
): void {
  expect(container.id).toEqual(containerInput.id);
  expect(container.companyId).toEqual(companyId);
  expect(container.createdAt).toEqual(expect.any(String));
  expect(container.updatedAt).toEqual(expect.any(String));
  expect(container.parcels).toHaveLength(containerInput.parcels.length);
  // TODO: fix time zone representation
  // expect(container.shippingDate).toEqual(containerInput.shippingDate);
}

describe('/api/companies/:companyId/containers', () => {
  let companyResponse: request.Response;
  let companyId: string;
  let businessRules: BusinessRule[];

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
        sourceDepartment: 'Distribution center',
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
  });

  describe('POST /', () => {
    it('should create a new container and return it with target departments based on business rules', async () => {
      const response = await createContainer(companyId, containerInput);

      expect(response.statusCode).toEqual(StatusCodes.CREATED);

      const container: ContainerDbParsedWithParcels = response.body;
      expectContainer(companyId, containerInput, container);

      // Check if target departments are assigned based on business rules
      expect(container.parcels[0].targetDepartment).toEqual('Mail');
      expect(container.parcels[1].targetDepartment).toEqual('Regular');
    });

    it('should update an existing container with the same ID and return it', async () => {
      // Create the initial container
      await createContainer(companyId, containerInput);

      // Update the container with the same ID
      const parcelInput: ParcelInput = {
        recipient: {
          name: 'John Doe',
          address: {
            street: 'Main Street',
            houseNumber: '123',
            postalCode: '12345',
            city: 'City',
          },
        },
        weight: 1.5,
        value: 100.0,
      };
      const updatedContainerInput: ContainerInput = {
        id: containerInput.id,
        shippingDate: '2016-07-23T00:00:00+02:00',
        parcels: [parcelInput],
      };

      const updatedResponse = await createContainer(companyId, updatedContainerInput);

      expect(updatedResponse.statusCode).toEqual(StatusCodes.CREATED);

      const container: ContainerDbParsedWithParcels = updatedResponse.body;
      expectContainer(companyId, updatedContainerInput, container);

      // Check if the container is updated with the new values
      const parcelResult: ParcelDbParsed = updatedResponse.body.parcels[0];
      expect(parcelResult.recipient.name).toEqual(parcelInput.recipient.name);
      expect(parcelResult.weight).toEqual(parcelInput.weight);
      expect(parcelResult.value).toEqual(parcelInput.value);
    });

    it('should return an error when creating a container for a non-existing company', async () => {
      const nonExistentCompanyId = randomUUID();

      const response = await createContainer(nonExistentCompanyId, containerInput);

      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(response.body.error).toEqual(`Company with id ${nonExistentCompanyId} does not exist`);
    });
  });

  describe('GET /', () => {
    it('should get all containers for a company', async () => {
      // Create some containers for the company
      const containerInput1: ContainerInput = {
        ...containerInput,
        id: '68465468',
        shippingDate: '2016-07-22T00:00:00+02:00',
        parcels: [{ ...containerInput.parcels[0] }],
      };

      const containerInput2: ContainerInput = {
        ...containerInput,
        id: '12345678',
        shippingDate: '2016-07-23T00:00:00+02:00',
        parcels: [{ ...containerInput.parcels[1] }],
      };

      await createContainer(companyId, containerInput1);
      await createContainer(companyId, containerInput2);

      const response = await request(app).get(`/api/companies/${companyId}/containers`);

      expect(response.statusCode).toEqual(StatusCodes.OK);

      const containers: ContainerDbParsedWithParcels[] = response.body;
      expect(containers).toHaveLength(2);
      expectContainer(companyId, containerInput2, containers[0]);
      expectContainer(companyId, containerInput1, containers[1]);
    });

    it('should return an empty list when there are no containers for the company', async () => {
      const response = await request(app).get(`/api/companies/${companyId}/containers`);

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('GET /:containerId', () => {
    it('should get a specific container for a company', async () => {
      const createResponse = await createContainer(companyId, containerInput);

      const container: ContainerDbParsedWithParcels = createResponse.body;

      const response = await request(app).get(`/api/companies/${companyId}/containers/${container.id}`);

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expectContainer(companyId, containerInput, container);
    });

    it('should return a 404 error when the specified container does not exist', async () => {
      const nonExistentContainerId = randomUUID();

      const response = await request(app).get(`/api/companies/${companyId}/containers/${nonExistentContainerId}`);

      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(response.body.error).toEqual(`Container ${nonExistentContainerId} not found for company ${companyId}`);
    });
  });
});
