import { Company, CompanyInput } from '@/app/types';
import { buildApiUrl } from './common';

const RESOURCE = 'companies';

// TODO: Implement centralized error handling to avoid duplicate code

export async function getCompanies(): Promise<Company[]> {
  const response = await fetch(buildApiUrl(RESOURCE), { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  return response.json();
}

export async function getCompany(companyId: string): Promise<Company> {
  const response = await fetch(buildApiUrl(`${RESOURCE}/${companyId}`), { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  return response.json();
}

export async function upsertCompany(input: CompanyInput): Promise<Company | null> {
  const response = await fetch(buildApiUrl(RESOURCE), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('There was an error creating the company');
    return null;
  }
  return await response.json();
}
