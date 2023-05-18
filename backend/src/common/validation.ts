import Joi from 'joi';

import { InvalidInputError } from './app-error';

/**
 * Utility function to validate any input against a Joi's schema
 *
 * @param schema Joi schema that tells what's the expected shape/type of the input.
 * @param input Normally this will be data coming from the frontend which it's not trustworthy.
 */
export function validate<T>(schema: Joi.AnySchema<unknown>, input: unknown): asserts input is T {
  // TODO: { abortEarly: false }
  const { error } = schema.validate(input);
  if (error) {
    // TODO: Handle multiple errors
    throw new InvalidInputError(error.details[0].message);
  }
}

export function throwIfNoUuid(input: unknown): asserts input is string {
  const schema = Joi.string().guid({ version: 'uuidv4' }).required();
  validate(schema, input);
}

/**
 * This function checks for duplicates in a specified field among a list of objects.
 *
 * @param field - The field in the objects to check for duplicates.
 * @param list - The array of objects to check.
 * @returns The array of duplicate keys. If no duplicates are found, an empty array is returned.
 *
 * @example
 * const data = [
 *   { id: 1, name: 'John' },
 *   { id: 2, name: 'Jane' },
 *   { id: 1, name: 'Mike' },
 *   { id: 3, name: 'John' },
 *   { id: 2, name: 'Sarah' },
 * ];
 *
 * const duplicates = getDuplicateKeys('id', data);
 * console.log(duplicates); // Output: ['1', '2']
 */
export function getDuplicateKeys<T>(field: keyof T, list: T[]): string[] {
  const names = new Map();

  for (const item of list) {
    // Convert the field value to string to ensure compatibility with the Map object
    const key = String(item[field]);

    if (!names.has(key)) {
      names.set(key, 0);
    }

    names.set(key, names.get(key) + 1);
  }

  // Convert the Map to an array and filter out the names that only appear once
  // Then, map the array of [name, count] pairs to an array of names
  return [...names.entries()].filter(entries => entries[1] > 1).map(([name]) => name);
}
