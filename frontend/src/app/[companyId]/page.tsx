import { getCompany } from '@/api/companies';

interface CompanyPageProps {
  params: {
    companyId: string;
  };
}

export default async function CompanyPage({ params: { companyId } }: CompanyPageProps) {
  const company = await getCompany(companyId);
  return <h1>{company.name}</h1>;
}
