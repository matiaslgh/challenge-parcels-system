import { throwIfInvalidCompanyInput } from './validation';

describe('company validation', () => {
  describe('throwIfInvalidCompanyInput', () => {
    it('should not throw an error for valid company input', () => {
      const validCompanyInput = { name: 'CompanyA' };
      expect(() => throwIfInvalidCompanyInput(validCompanyInput)).not.toThrow();
    });

    it('should throw an error for missing company name', () => {
      const invalidCompanyInput = {};
      expect(() => throwIfInvalidCompanyInput(invalidCompanyInput)).toThrow('"name" is required');
    });

    it('should throw an error for company name not as a string', () => {
      const invalidCompanyInput = { name: 123 };
      expect(() => throwIfInvalidCompanyInput(invalidCompanyInput)).toThrow('"name" must be a string');
    });

    it('should throw an error for extra property', () => {
      const extraPropertyCompanyInput: unknown = {
        name: 'CompanyA',
        extraProperty: 'Extra',
      };
      expect(() => throwIfInvalidCompanyInput(extraPropertyCompanyInput)).toThrow('"extraProperty" is not allowed');
    });

    it('should throw an error for undefined company input', () => {
      expect(() => throwIfInvalidCompanyInput(undefined)).toThrow('"value" is required');
    });
  });
});
