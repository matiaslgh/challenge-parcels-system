import { BusinessRulesDbParsed } from '@/app/types';
import { buildApiUrl } from './common';

const RESOURCE = 'business-rules';

export async function getBusinessRules(companyId: string): Promise<BusinessRulesDbParsed> {
  const response = await fetch(buildApiUrl(`companies/${companyId}/${RESOURCE}`), { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  return response.json();
}
