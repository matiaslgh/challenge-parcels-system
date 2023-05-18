import { generateInsertData } from './db-utils';

describe('db-utils', () => {
  describe('generateInsertData', () => {
    it('should generate insert data for multiple properties', () => {
      const data = [
        { fieldOne: 'value1', fieldTwo: 2 },
        { fieldOne: 'value3', fieldTwo: 4 },
        { fieldOne: 'value5', fieldTwo: 6 },
      ];
      const propertyNames: Array<keyof { fieldOne: string; fieldTwo: number }> = ['fieldOne', 'fieldTwo'];

      const { placeholders, values, snakeCasedPropertyNames } = generateInsertData(data, propertyNames);

      expect(placeholders).toEqual('($1, $2), ($3, $4), ($5, $6)');
      expect(values).toEqual(['value1', 2, 'value3', 4, 'value5', 6]);
      expect(snakeCasedPropertyNames).toEqual(['field_one', 'field_two']);
    });
  });
});
