import { getDuplicateKeys } from './validation';

describe('validation utils', () => {
  describe('getDuplicateKeys', () => {
    it('should return empty array for no duplicates', () => {
      const data = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Mike' },
      ];
      const duplicates = getDuplicateKeys('id', data);
      expect(duplicates).toEqual([]);
    });

    it('should return array of duplicate keys', () => {
      const data = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 1, name: 'Mike' },
        { id: 3, name: 'John' },
        { id: 2, name: 'Sarah' },
        { id: 4, name: 'Jane' },
      ];
      const duplicates = getDuplicateKeys('id', data);
      expect(duplicates).toEqual(['1', '2']);
    });

    it('should handle non-string field values', () => {
      const data = [
        { id: 1, score: 100 },
        { id: 2, score: 200 },
        { id: 3, score: 100 },
        { id: 4, score: 200 },
      ];
      const duplicates = getDuplicateKeys('score', data);
      expect(duplicates).toEqual(['100', '200']);
    });
  });
});
