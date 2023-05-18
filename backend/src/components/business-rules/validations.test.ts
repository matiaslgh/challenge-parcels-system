import { BusinessRule } from './types';
import { throwIfInvalidBusinessRules } from './validations';

const validBusinessRule1: Partial<BusinessRule> = {
  name: 'Rule1',
  sourceDepartment: 'DepartmentA',
  targetDepartment: 'DepartmentB',
  minWeight: 5,
  maxWeight: 10,
  minValue: 1000,
  maxValue: 2000,
};

const validBusinessRule2: Partial<BusinessRule> = {
  ...validBusinessRule1,
  name: 'Rule2',
};

const validBusinessRules: Partial<BusinessRule>[] = [validBusinessRule1, validBusinessRule2];

describe('business-rule validations', () => {
  describe('throwIfInvalidBusinessRules', () => {
    it('should not throw an error for valid business rules', () => {
      expect(() => throwIfInvalidBusinessRules(validBusinessRules)).not.toThrow();
    });

    it('should throw an error for business rules with missing name', () => {
      const invalidBusinessRule = { ...validBusinessRule1 };
      delete invalidBusinessRule.name;
      expect(() => throwIfInvalidBusinessRules([invalidBusinessRule])).toThrow('"[0].name" is required');
    });

    it('should not throw an error for business rules with missing sourceDepartment', () => {
      const validBusinessRule = { ...validBusinessRule1 };
      delete validBusinessRule.sourceDepartment;
      expect(() => throwIfInvalidBusinessRules([validBusinessRule])).not.toThrow();
    });

    it('should throw an error for business rules with missing targetDepartment', () => {
      const invalidBusinessRule = { ...validBusinessRule1 };
      delete invalidBusinessRule.targetDepartment;
      expect(() => throwIfInvalidBusinessRules([invalidBusinessRule])).toThrow('"[0].targetDepartment" is required');
    });

    it('should not throw an error for business rules with missing minWeight', () => {
      const validBusinessRule = { ...validBusinessRule1 };
      delete validBusinessRule.minWeight;
      expect(() => throwIfInvalidBusinessRules([validBusinessRule])).not.toThrow();
    });

    it('should not throw an error for business rules with missing maxWeight', () => {
      const validBusinessRule = { ...validBusinessRule1 };
      delete validBusinessRule.maxWeight;
      expect(() => throwIfInvalidBusinessRules([validBusinessRule])).not.toThrow();
    });

    it('should not throw an error for business rules with missing minValue', () => {
      const validBusinessRule = { ...validBusinessRule1 };
      delete validBusinessRule.minValue;
      expect(() => throwIfInvalidBusinessRules([validBusinessRule])).not.toThrow();
    });

    it('should not throw an error for business rules with missing maxValue', () => {
      const validBusinessRule = { ...validBusinessRule1 };
      delete validBusinessRule.maxValue;
      expect(() => throwIfInvalidBusinessRules([validBusinessRule])).not.toThrow();
    });

    it('should throw an error for undefined business rules input', () => {
      expect(() => throwIfInvalidBusinessRules(undefined)).toThrow('"value" is required');
    });

    it('should throw an error for business rules with name not as a string', () => {
      const invalidBusinessRule = { ...validBusinessRule1, name: 123 };
      expect(() => throwIfInvalidBusinessRules([invalidBusinessRule])).toThrow('"[0].name" must be a string');
    });

    it('should throw an error for business rules with sourceDepartment not as a string', () => {
      const invalidBusinessRule = { ...validBusinessRule1, sourceDepartment: 123 };
      expect(() => throwIfInvalidBusinessRules([invalidBusinessRule])).toThrow(
        '"[0].sourceDepartment" must be a string',
      );
    });

    it('should throw an error for business rules with targetDepartment not as a string', () => {
      const invalidBusinessRule = { ...validBusinessRule1, targetDepartment: 123 };
      expect(() => throwIfInvalidBusinessRules([invalidBusinessRule])).toThrow(
        '"[0].targetDepartment" must be a string',
      );
    });

    it('should throw an error for business rules with minWeight not as a number', () => {
      const invalidBusinessRule = { ...validBusinessRule1, minWeight: {} };
      expect(() => throwIfInvalidBusinessRules([invalidBusinessRule])).toThrow('"[0].minWeight" must be a number');
    });

    it('should throw an error for business rules with maxWeight not as a number', () => {
      const invalidBusinessRule = { ...validBusinessRule1, maxWeight: {} };
      expect(() => throwIfInvalidBusinessRules([invalidBusinessRule])).toThrow('"[0].maxWeight" must be a number');
    });

    it('should throw an error for business rules with minValue not as a number', () => {
      const invalidBusinessRule = { ...validBusinessRule1, minValue: {} };
      expect(() => throwIfInvalidBusinessRules([invalidBusinessRule])).toThrow('"[0].minValue" must be a number');
    });

    it('should throw an error for business rules with maxValue not as a number', () => {
      const invalidBusinessRule = { ...validBusinessRule1, maxValue: {} };
      expect(() => throwIfInvalidBusinessRules([invalidBusinessRule])).toThrow('"[0].maxValue" must be a number');
    });

    it('should throw an error for business rules with negative weight', () => {
      const invalidBusinessRule = { ...validBusinessRule1, minWeight: -5 };
      expect(() => throwIfInvalidBusinessRules([invalidBusinessRule])).toThrow(
        '"[0].minWeight" must be a positive number',
      );
    });

    it('should throw an error for business rules with negative value', () => {
      const invalidBusinessRule = { ...validBusinessRule1, minValue: -1000 };
      expect(() => throwIfInvalidBusinessRules([invalidBusinessRule])).toThrow(
        '"[0].minValue" must be a positive number',
      );
    });

    it('should throw an error for business rules with duplicate name', () => {
      const duplicateNameRule: Partial<BusinessRule> = {
        ...validBusinessRule1,
        name: 'Rule1',
      };
      const businessRules = [validBusinessRule1, duplicateNameRule];
      expect(() => throwIfInvalidBusinessRules(businessRules)).toThrow('Duplicate names: Rule1');
    });

    it('should throw an error for business rules with extra property', () => {
      const extraPropertyRule: unknown = {
        ...validBusinessRule1,
        extraProperty: 'Extra',
      };
      const businessRules = [validBusinessRule1, extraPropertyRule];
      expect(() => throwIfInvalidBusinessRules(businessRules)).toThrow('"[1].extraProperty" is not allowed');
    });

    it('should throw an error for business rules with maxWeight less than minWeight', () => {
      const invalidBusinessRule = { ...validBusinessRule1, minWeight: 10, maxWeight: 5 };
      expect(() => throwIfInvalidBusinessRules([invalidBusinessRule])).toThrow(
        '"[0].maxWeight" must be greater than ref:minWeight',
      );
    });

    it('should throw an error for business rules with maxValue less than minValue', () => {
      const invalidBusinessRule = { ...validBusinessRule1, minValue: 2000, maxValue: 1000 };
      expect(() => throwIfInvalidBusinessRules([invalidBusinessRule])).toThrow(
        '"[0].maxValue" must be greater than ref:minValue',
      );
    });
  });
});
