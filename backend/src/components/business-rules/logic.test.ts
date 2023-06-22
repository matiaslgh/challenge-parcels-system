import { findDepartment } from './logic';
import { BusinessRule } from './types';
import { ParcelToSave } from '../parcels';

const defaultParcel: ParcelToSave = {
  recipient: {
    name: 'John Doe',
    address: {
      street: '123 Main St',
      houseNumber: '456',
      postalCode: '12345',
      city: 'CityA',
    },
  },
  weight: 8,
  value: 1500,
  sourceDepartment: null,
  targetDepartment: null,
  companyId: 'abc123',
  containerId: 'def456',
};

function buildParcel(partialParcel: Partial<ParcelToSave>): ParcelToSave {
  return {
    ...defaultParcel,
    ...partialParcel,
  };
}

describe("business-rule's logic", () => {
  describe('findDepartment', () => {
    it('should return the target department that matches the first rule based on weight', () => {
      const rules: BusinessRule[] = [
        {
          id: 'Rule1',
          name: 'Rule1',
          sourceDepartment: 'DepartmentA',
          targetDepartment: 'DepartmentB',
          minWeight: 5,
          maxWeight: 10,
        },
        {
          id: 'Rule2',
          name: 'Rule2',
          sourceDepartment: 'DepartmentA',
          targetDepartment: 'DepartmentC',
          minWeight: 1,
          maxWeight: 20,
        },
      ];

      const parcel = buildParcel({ sourceDepartment: 'DepartmentA', weight: 8 });

      const department = findDepartment(parcel, rules);

      expect(department).toBe('DepartmentB');
    });

    it('should return the target department that matches the first rule based on value', () => {
      const rules: BusinessRule[] = [
        {
          id: 'Rule1',
          name: 'Rule1',
          sourceDepartment: 'DepartmentA',
          targetDepartment: 'DepartmentB',
          minValue: 1000,
          maxValue: 2000,
        },
        {
          id: 'Rule2',
          name: 'Rule2',
          sourceDepartment: 'DepartmentA',
          targetDepartment: 'DepartmentC',
          minValue: 2000,
          maxValue: 3000,
        },
      ];

      const parcel = buildParcel({ sourceDepartment: 'DepartmentA', value: 1500 });

      const department = findDepartment(parcel, rules);

      expect(department).toBe('DepartmentB');
    });

    it('should return the target department that matches the second rule based on weight', () => {
      const rules: BusinessRule[] = [
        {
          id: 'Rule1',
          name: 'Rule1',
          sourceDepartment: 'DepartmentA',
          targetDepartment: 'DepartmentB',
          minWeight: 5,
          maxWeight: 10,
        },
        {
          id: 'Rule2',
          name: 'Rule2',
          sourceDepartment: 'DepartmentA',
          targetDepartment: 'DepartmentC',
          minWeight: 1,
          maxWeight: 20,
        },
      ];

      const parcel = buildParcel({ sourceDepartment: 'DepartmentA', weight: 15 });

      const department = findDepartment(parcel, rules);

      expect(department).toBe('DepartmentC');
    });

    it('should return the target department that matches the second rule based on value', () => {
      const rules: BusinessRule[] = [
        {
          id: 'Rule1',
          name: 'Rule1',
          sourceDepartment: 'DepartmentA',
          targetDepartment: 'DepartmentB',
          minValue: 1000,
          maxValue: 2000,
        },
        {
          id: 'Rule2',
          name: 'Rule2',
          sourceDepartment: 'DepartmentA',
          targetDepartment: 'DepartmentC',
          minValue: 2000,
          maxValue: 3000,
        },
      ];

      const parcel = buildParcel({ sourceDepartment: 'DepartmentA', value: 2500 });

      const department = findDepartment(parcel, rules);

      expect(department).toBe('DepartmentC');
    });

    it('should return the target department that matches the rule based on weight when source department is missing', () => {
      const rules: BusinessRule[] = [
        {
          id: 'Rule1',
          name: 'Rule1',
          targetDepartment: 'DepartmentB',
          minWeight: 5,
          maxWeight: 10,
        },
      ];

      const parcel = buildParcel({ weight: 8 });

      const department = findDepartment(parcel, rules);

      expect(department).toBe('DepartmentB');
    });

    it('should return the target department that matches the rule based on value when source department is missing', () => {
      const rules: BusinessRule[] = [
        {
          id: 'Rule1',
          name: 'Rule1',
          targetDepartment: 'DepartmentB',
          minValue: 1000,
          maxValue: 2000,
        },
      ];

      const parcel = buildParcel({ value: 1500 });

      const department = findDepartment(parcel, rules);

      expect(department).toBe('DepartmentB');
    });

    it('should return the target department that matches weight, value and source department', () => {
      const matchingRule: BusinessRule = {
        id: 'MatchingRule',
        name: 'MatchingRule',
        sourceDepartment: 'DepartmentA',
        targetDepartment: 'DepartmentC',
        minWeight: 1,
        maxWeight: 100,
        minValue: 1000,
        maxValue: 2000,
      };

      const rules: BusinessRule[] = [
        { ...matchingRule, id: 'Rule1', name: 'Rule1', sourceDepartment: 'DepartmentB' },
        { ...matchingRule, id: 'Rule2', name: 'Rule2', minWeight: 90 },
        { ...matchingRule, id: 'Rule3', name: 'Rule3', minValue: 1900 },
        { ...matchingRule, id: 'Rule4', name: 'Rule4', maxWeight: 3 },
        { ...matchingRule, id: 'Rule5', name: 'Rule5', maxValue: 1100 },
        matchingRule,
        {
          ...matchingRule,
          id: 'AnotherMatchingRule',
          name: 'AnotherMatchingRule',
          targetDepartment: 'AnotherDepartment',
        },
      ];

      const parcel = buildParcel({ sourceDepartment: 'DepartmentA', weight: 50, value: 1500 });

      const department = findDepartment(parcel, rules);

      expect(department).toBe('DepartmentC');
    });

    it('should return null when no matching rule is found', () => {
      const rules: BusinessRule[] = [
        {
          id: 'Rule1',
          name: 'Rule1',
          sourceDepartment: 'DepartmentA',
          targetDepartment: 'DepartmentB',
          minWeight: 5,
          maxWeight: 10,
          minValue: 1000,
          maxValue: 2000,
        },
        {
          id: 'Rule2',
          name: 'Rule2',
          sourceDepartment: 'DepartmentA',
          targetDepartment: 'DepartmentC',
          minWeight: 1,
          maxWeight: 20,
          minValue: 2000,
          maxValue: 3000,
        },
      ];

      const parcel = buildParcel({ weight: 12, value: 500 });

      const department = findDepartment(parcel, rules);

      expect(department).toBeNull();
    });
  });
});
