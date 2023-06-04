import Link from 'next/link';
import { Company } from './types';
import { getCompanies } from '@/api/companies';

interface CompanyPickerBoxProps {
  title: string;
  children: React.ReactNode;
}

function CompanyPickerBox({ children, title }: CompanyPickerBoxProps) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-black">
      <div className="relative w-full max-w-md max-h-full">
        <div className="relative h-96 bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">{title}</h3>
            <div className="space-y-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateNewCompanyButton() {
  return (
    <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
      <Link href="/new-company" className="text-blue-700 hover:underline dark:text-blue-500">
        Create new company
      </Link>
    </div>
  );
}

interface CompaniesListProps {
  companies: Company[];
}
function CompaniesList({ companies }: CompaniesListProps) {
  return (
    <div className="h-60 overflow-y-auto">
      {companies.map(item => (
        <Link
          href={`/${item.id}/containers`}
          key={item.id}
          className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold text-sm text-gray-900 dark:text-white"
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}

function NoCompanies() {
  return (
    <div className="pt-28 text-center">
      <div className="mb-24">
        <span className="text-gray-900 dark:text-white">There are no companies</span>
      </div>
      <CreateNewCompanyButton />
    </div>
  );
}

export default async function CompanyPickerPage() {
  const companies = await getCompanies();
  return (
    <CompanyPickerBox title="Select a company">
      <>
        {companies.length === 0 && <NoCompanies />}
        {companies.length > 0 && (
          <>
            <CompaniesList companies={companies} />
            <CreateNewCompanyButton />
          </>
        )}
      </>
    </CompanyPickerBox>
  );
}
