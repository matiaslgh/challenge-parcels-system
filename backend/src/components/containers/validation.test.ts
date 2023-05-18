import { ContainerInput } from './types';
import { throwIfInvalidContainerInput } from './validation';

const validContainerInput: Partial<ContainerInput> = {
  id: 'container1',
  shippingDate: '2023-05-17',
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
      weight: 10,
      value: 500,
    },
  ],
};

describe('container validation', () => {
  describe('throwIfInvalidContainerInput', () => {
    it('should not throw an error for valid container input', () => {
      expect(() => throwIfInvalidContainerInput(validContainerInput)).not.toThrow();
    });

    it('should throw an error for container input with missing id', () => {
      const invalidContainerInput = { ...validContainerInput };
      delete invalidContainerInput.id;
      expect(() => throwIfInvalidContainerInput(invalidContainerInput)).toThrow('"id" is required');
    });

    it('should throw an error for container input with missing shippingDate', () => {
      const invalidContainerInput = { ...validContainerInput };
      delete invalidContainerInput.shippingDate;
      expect(() => throwIfInvalidContainerInput(invalidContainerInput)).toThrow('"shippingDate" is required');
    });

    it('should throw an error for container input with missing parcels', () => {
      const invalidContainerInput = { ...validContainerInput };
      delete invalidContainerInput.parcels;
      expect(() => throwIfInvalidContainerInput(invalidContainerInput)).toThrow('"parcels" is required');
    });

    it('should throw an error for container input with invalid id', () => {
      const invalidContainerInput = { ...validContainerInput, id: {} };
      expect(() => throwIfInvalidContainerInput(invalidContainerInput)).toThrow('"id" must be a string');
    });

    it('should throw an error for container input with invalid shippingDate', () => {
      const invalidContainerInput = { ...validContainerInput, shippingDate: {} };
      expect(() => throwIfInvalidContainerInput(invalidContainerInput)).toThrow('"shippingDate" must be a valid date');
    });

    it('should throw an error for container input with invalid parcels', () => {
      const invalidContainerInput = { ...validContainerInput, parcels: [{ weight: 5, value: 1200 }] };
      expect(() => throwIfInvalidContainerInput(invalidContainerInput)).toThrow('"parcels[0].recipient" is required');
    });

    it('should throw an error for container input with extra property', () => {
      const extraPropertyContainerInput: unknown = {
        ...validContainerInput,
        extraProperty: 'Extra',
      };
      expect(() => throwIfInvalidContainerInput(extraPropertyContainerInput)).toThrow('"extraProperty" is not allowed');
    });
    it('should throw an error for undefined container input', () => {
      expect(() => throwIfInvalidContainerInput(undefined)).toThrow('"value" is required');
    });
  });
});
