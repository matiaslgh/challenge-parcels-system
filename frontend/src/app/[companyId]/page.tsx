import { Company } from '../types';

async function getCompany(companyId: string): Promise<Company> {
  // TODO: Use env variables
  const res = await fetch(`http://localhost:3001/api/companies/${companyId}`, { cache: 'no-store' });
  if (!res.ok) {
    // TODO: Handle error
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

interface CompanyPageProps {
  params: {
    companyId: string;
  };
}
export default async function CompanyPage({ params: { companyId } }: CompanyPageProps) {
  const company = await getCompany(companyId);
  return <h1>{company.name}</h1>;
}
