import { getCompany } from '@/api/companies';
import SideBar from './SideBar';

interface CompanyLayout {
  params: { companyId: string };
  children: React.ReactNode;
}

export default async function CompanyLayout({ params, children }: CompanyLayout) {
  const company = await getCompany(params.companyId);

  return (
    <>
      <SideBar company={company} />
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">{children}</div>
    </>
  );
}
