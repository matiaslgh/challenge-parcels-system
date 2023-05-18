import Link from 'next/link';
import { Company } from './types';

async function getCompanies(): Promise<Company[]> {
  // TODO: Use env variables
  const res = await fetch('http://localhost:3001/api/companies', { cache: 'no-store' });
  if (!res.ok) {
    // TODO: Handle error
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function CompanyPickerPage() {
  const companies = await getCompanies();
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
        <div className="p-4">
          {companies.map(item => (
            <div key={item.name} className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
              <Link href={`/${item.id}/containers`} className="font-semibold text-gray-900">
                {item.name}
                <span className="absolute inset-0" />
              </Link>
            </div>
          ))}
        </div>
        <div className="divide-x divide-gray-900/5 bg-gray-50">
          <Link
            href="/new-company"
            className="flex items-center justify-center p-3 w-full font-semibold text-gray-900 hover:bg-gray-100"
          >
            Create new company
          </Link>
        </div>
      </div>
    </div>
  );
}
