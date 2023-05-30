import { PoolClient } from 'pg';

import * as dal from './dal';
import { CompanyDbParsed, CompanyInput } from './types';

export async function getCompanies(): Promise<CompanyDbParsed[]> {
  return dal.getCompanies();
}

export async function getCompany(companyId: string, transactionClient?: PoolClient): Promise<CompanyDbParsed> {
  return dal.getCompany(companyId, transactionClient);
}

export async function createCompany(companyInput: CompanyInput): Promise<CompanyDbParsed> {
  return await dal.createCompany(companyInput);
}
