import NavBar from './NavBar';

interface CompanyLayout {
  params: { companyId: string };
  children: React.ReactNode;
}

export default async function CompanyLayout({ params, children }: CompanyLayout) {
  return (
    <>
      <NavBar companyId={params.companyId} />
      <div className="p-4 sm:ml-64">{children}</div>
    </>
  );
}
