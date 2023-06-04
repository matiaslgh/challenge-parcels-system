'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Company } from '../types';
import { upsertCompany } from '@/api/companies';

interface BoxProps {
  title: string;
  children: React.ReactNode;
}

function Box({ children, title }: BoxProps) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-black">
      <div className="relative w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">{title}</h3>
            <div className="space-y-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewCompanyPage() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const company = await upsertCompany({ name });

    if (company === null) {
      // TODO: Handle error
      console.error('There was an error creating the company');
    } else {
      router.push(`/${company.id}/containers`);
    }
  };

  return (
    <Box title="Create a new company">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="companyName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Company name
          </label>
          <input
            type="text"
            id="companyName"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            onChange={event => setName(event.target.value)}
          />
        </div>
        <div className="flex items-center pt-6 space-x-2">
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Create
          </button>
          <Link
            href="/"
            className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
          >
            Cancel
          </Link>
        </div>
      </form>
    </Box>
  );
}
