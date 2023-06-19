import { BusinessRule, BusinessRulesDbParsed } from '@/app/types';
import { buildApiUrl } from './common';

const RESOURCE = 'business-rules';

export async function getBusinessRules(companyId: string): Promise<BusinessRulesDbParsed> {
  const response = await fetch(buildApiUrl(`companies/${companyId}/${RESOURCE}`), { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  return response.json();
}

export async function upsertBusinessRules(
  companyId: string,
  rules: BusinessRule[],
): Promise<BusinessRulesDbParsed | null> {
  const response = await fetch(buildApiUrl(`companies/${companyId}/${RESOURCE}`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rules),
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('There was an error creating the company');
    return null;
  }
  return await response.json();
}
