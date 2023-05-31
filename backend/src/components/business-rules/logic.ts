import { PoolClient } from 'pg';

import * as dal from './dal';
import { BusinessRule, BusinessRulesDbParsed } from './types';
import { executeInTransaction } from '../../common/db-utils';
import { getCompany } from '../companies';
import { ParcelToSave } from '../parcels';

/**
 * Checks if a given parcel matches a business rule.
 *
 * @param parcel - The parcel to be checked.
 * @param rule - The business rule to be evaluated.
 * @returns A boolean indicating whether the parcel matches the rule.
 */
function checkRule(parcel: ParcelToSave, rule: BusinessRule): boolean {
  return (
    (rule.sourceDepartment === undefined || parcel.sourceDepartment === rule.sourceDepartment) &&
    rule.targetDepartment !== parcel.sourceDepartment &&
    (rule.minWeight === undefined || parcel.weight >= rule.minWeight) &&
    (rule.maxWeight === undefined || parcel.weight <= rule.maxWeight) &&
    (rule.minValue === undefined || parcel.value >= rule.minValue) &&
    (rule.maxValue === undefined || parcel.value <= rule.maxValue)
  );
}

/**
 * Finds the target department for a given parcel based on the provided business rules.
 *
 * @param parcel - The parcel for which to find the target department.
 * @param rules - The business rules to be evaluated.
 * @returns The target department if a matching rule is found, otherwise null.
 */
export function findDepartment(parcel: ParcelToSave, rules: BusinessRule[]): string | null {
  for (const rule of rules) {
    if (checkRule(parcel, rule)) {
      return rule.targetDepartment;
    }
  }

  return null;
}

export async function saveBusinessRules(companyId: string, rules: BusinessRule[]): Promise<BusinessRulesDbParsed> {
  return executeInTransaction(async transactionClient => {
    // Throws NotFoundError if companyId does not exist
    await getCompany(companyId, transactionClient);
    return await dal.saveBusinessRules(rules, companyId, transactionClient);
  });
}

export async function getBusinessRules(
  companyId: string,
  transactionClient?: PoolClient,
): Promise<BusinessRulesDbParsed | null> {
  return await dal.getBusinessRules(companyId, transactionClient);
}
