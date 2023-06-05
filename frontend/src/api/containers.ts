import { ContainerDbParsedWithParcels, ContainerInput } from '@/app/types';
import { buildApiUrl } from './common';

const RESOURCE = 'containers';
function buildUrl(companyId: string) {
  return buildApiUrl(`companies/${companyId}/${RESOURCE}`);
}

export async function upsertContainer(
  companyId: string,
  input: ContainerInput,
): Promise<ContainerDbParsedWithParcels | null> {
  const response = await fetch(buildUrl(companyId), {
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
