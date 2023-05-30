import { PoolClient } from 'pg';

import { BusinessRule, BusinessRulesDb, BusinessRulesDbParsed } from './types';
import { pool } from '../../database/connection';

function parseBusinessRulesDb(businessRulesFromDb: BusinessRulesDb): BusinessRulesDbParsed {
  return {
    id: businessRulesFromDb.id,
    companyId: businessRulesFromDb.company_id,
    rules: businessRulesFromDb.rules,
    createdAt: businessRulesFromDb.created_at.toISOString(),
    updatedAt: businessRulesFromDb.updated_at.toISOString(),
  };
}

export async function saveBusinessRules(
  rules: BusinessRule[],
  companyId: string,
  transactionClient: PoolClient,
): Promise<BusinessRulesDbParsed> {
  const businessRulesJson = JSON.stringify(rules);

  const query = `
    INSERT INTO business_rules (company_id, rules)
    VALUES ($1, $2)
    ON CONFLICT (company_id)
    DO UPDATE SET rules = $2, updated_at = NOW()
    RETURNING *;
  `;

  const result = await transactionClient.query<BusinessRulesDb>(query, [companyId, businessRulesJson]);

  return parseBusinessRulesDb(result.rows[0]);
}

export async function getBusinessRules(companyId: string): Promise<BusinessRulesDbParsed | null> {
  const query = 'SELECT * from business_rules WHERE company_id = $1;';
  const result = await pool.query<BusinessRulesDb>(query, [companyId]);
  if (result.rowCount === 0) {
    return null;
  }
  return parseBusinessRulesDb(result.rows[0]);
}
