/**
 * Converts a camelCase string to snake_case.
 * @param str - The camelCase string to convert.
 * @returns The snake_case version of the input string.
 *
 * @example
 * const camelCaseString = 'myVariableName';
 * const snakeCaseString = camelToSnake(camelCaseString);
 * console.log(snakeCaseString); // Output: 'my_variable_name'
 */
function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Generates placeholders, values, and snake_cased property names for SQL insert queries based on the given data and property names.
 * @param data - An array of objects to be inserted into the database.
 * @param propertyNames - An array of property names to consider for generating placeholders and values.
 * @returns An object containing three properties:
 *          - insertPlaceholders: A string with the generated placeholders for SQL queries.
 *          - insertValues: An array containing the values to be inserted, in the order of the placeholders.
 *          - snakeCasedPropertyNames: An array of property names converted to snake_case.
 *
 * @example
 * const data = [
 *   { fieldOne: "value1", fieldTwo: 2 },
 *   { fieldOne: "value3", fieldTwo: 4 },
 * ];
 * const propertyNames = ['fieldOne', 'fieldTwo'];
 *
 * const { insertPlaceholders, insertValues, snakeCasedPropertyNames } = generateInsertData(data, propertyNames);
 *
 * console.log(insertPlaceholders);
 * // Output: "($1, $2), ($3, $4)"
 *
 * console.log(insertValues);
 * // Output: ["value1", 2, "value3", 4]
 *
 * console.log(snakeCasedPropertyNames);
 * // Output: ["field_one", "field_two"]
 */
export function generateInsertData<T>(
  data: T[],
  propertyNames: Array<keyof T>,
): { placeholders: string; values: unknown[]; snakeCasedPropertyNames: string[] } {
  const placeholders: string[] = [];
  const values: unknown[] = [];
  const snakeCasedPropertyNamesSet = new Set<string>();

  data.forEach((item, index) => {
    const placeholderValues: unknown[] = [];
    propertyNames.forEach(propertyName => {
      const propertyValue = item[propertyName];
      placeholderValues.push(propertyValue);
    });

    const snakeCasedNames = propertyNames.map(propertyName => camelToSnake(propertyName as string));
    snakeCasedNames.forEach(snakeCasedName => snakeCasedPropertyNamesSet.add(snakeCasedName));

    const placeholder = propertyNames.map((_, i) => `$${index * propertyNames.length + i + 1}`).join(', ');

    placeholders.push(`(${placeholder})`);
    values.push(...placeholderValues);
  });

  const snakeCasedPropertyNames = Array.from(snakeCasedPropertyNamesSet);

  const placeholdersString = placeholders.join(', ');

  return { placeholders: placeholdersString, values, snakeCasedPropertyNames };
}
