import { DatabaseError, PoolClient, QueryResult } from 'pg';
import { PostgresError } from 'pg-error-enum';

import { CompanyDb, CompanyDbParsed, CompanyInput } from './types';
import { InvalidInputError, NotFoundError } from '../../common/app-error';
import { pool } from '../../database/connection';

function parseCompanyDb(companyFromDb: CompanyDb): CompanyDbParsed {
  return {
    id: companyFromDb.id,
    name: companyFromDb.name,
    createdAt: companyFromDb.created_at.toISOString(),
    updatedAt: companyFromDb.updated_at.toISOString(),
  };
}

export async function getCompanies(): Promise<CompanyDbParsed[]> {
  const query = 'SELECT * FROM companies';
  const results = await pool.query<CompanyDb>(query);
  return results.rows.map(parseCompanyDb);
}

export async function getCompany(companyId: string, transactionClient?: PoolClient): Promise<CompanyDbParsed> {
  const client = transactionClient ?? pool;
  const query = 'SELECT * FROM companies WHERE id = $1;';
  const values = [companyId];
  const result = await client.query<CompanyDb>(query, values);
  if (result.rowCount === 0) {
    throw new NotFoundError(`Company with id ${companyId} does not exist`);
  }
  return parseCompanyDb(result.rows[0]);
}

export async function createCompany(companyInput: CompanyInput): Promise<CompanyDbParsed> {
  const query = 'INSERT INTO companies (name) VALUES ($1) RETURNING *;';
  const values = [companyInput.name];
  let result: null | QueryResult<CompanyDb> = null;
  try {
    result = await pool.query(query, values);
  } catch (error) {
    if (error instanceof DatabaseError && error.code === PostgresError.UNIQUE_VIOLATION) {
      throw new InvalidInputError(`Company with name "${companyInput.name}" already exists`);
    }
    throw error;
  }
  return parseCompanyDb(result.rows[0]);
}
