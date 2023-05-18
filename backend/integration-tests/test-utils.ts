import request, { Response } from 'supertest';

import { BusinessRule } from '../src/components/business-rules';
import { CompanyInput } from '../src/components/companies';
import { ContainerInput } from '../src/components/containers';
import app from '../src/index';

const DEFAULT_COMPANY_OUTPUT: CompanyInput = { name: 'company-1' };
export async function createCompany(partialCompanyInput: Partial<CompanyInput> = {}): Promise<Response> {
  const companyInput: CompanyInput = { ...DEFAULT_COMPANY_OUTPUT, ...partialCompanyInput };
  return await request(app).post('/api/companies').send(companyInput);
}

export async function createBusinessRules(companyId: string, businessRules: BusinessRule[]): Promise<Response> {
  return await request(app).post(`/api/companies/${companyId}/business-rules`).send(businessRules);
}

export async function createContainer(companyId: string, containerInput: ContainerInput): Promise<Response> {
  return await request(app).post(`/api/companies/${companyId}/containers`).send(containerInput);
}
