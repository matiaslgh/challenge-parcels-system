'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Company } from '../types';

export default function NewCompanyPage() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Use env variables
    const response = await fetch('http://localhost:3001/api/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
      cache: 'no-store',
    });

    if (!response.ok) {
      // TODO: Handle error
      console.error('There was an error creating the company');
      return;
    }
    const company: Company = await response.json();
    router.push(`/${company.id}/containers`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
        <form onSubmit={handleSubmit}>
          <div className="p-10">
            <div className="mx-auto max-w-2xl text-center pb-5">
              <h1 className="font-bold tracking-tight text-gray-900 text-2xl">Create a new company</h1>
            </div>
            <div className="flex flex-col pt-5">
              <label htmlFor="companyName" className="block text-sm font-semibold leading-6 text-gray-900">
                Company name
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  autoComplete="given-name"
                  onChange={event => setName(event.target.value)}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
          <div className="flex divide-x divide-gray-900/5 bg-gray-50">
            <button
              type="submit"
              className="items-center justify-center p-3 w-3/6 font-semibold text-gray-900 hover:bg-gray-100"
            >
              Create
            </button>
            <div className="flex items-center justify-center p-3 w-3/6 font-semibold text-gray-900 hover:bg-gray-100">
              <Link href="/">Cancel</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
