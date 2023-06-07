'use client';

import useContainers from './useContainers';
import ContainersAccordion from './ContainersAccordion';
import TopBar from './TopBar';
interface CompanyPageProps {
  params: {
    companyId: string;
  };
}

export default function ContainersPage({ params: { companyId } }: CompanyPageProps) {
  const { containers } = useContainers(companyId);
  console.log(containers);
  return (
    <>
      <TopBar companyId={companyId} />
      <div className="p-4 sm:ml-64">
        <ContainersAccordion containers={containers} />
      </div>
    </>
  );
}
