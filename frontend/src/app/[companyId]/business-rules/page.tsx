'use client';

import { ReactSortable } from 'react-sortablejs';
import { BusinessRule } from '@/app/types';
import { ChangeEventHandler, useState } from 'react';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import TopBar from './TopBar';

interface BusinessRulesPageProps {
  params: {
    companyId: string;
  };
}

export default function BusinessRulesPage({ params: { companyId } }: BusinessRulesPageProps) {
  const [businessRules, setBusinessRules] = useState<BusinessRule[]>([
    {
      id: 1,
      name: 'needs-insurance',
      sourceDepartment: 'Distribution center',
      targetDepartment: 'Insurance',
      minValue: 1000,
    },
    {
      id: 2,
      name: 'less-than-1kg',
      targetDepartment: 'Mail',
      maxWeight: 1,
    },
    {
      id: 3,
      name: 'between-1kg-and-10kg',
      targetDepartment: 'Regular',
      minWeight: 1,
      maxWeight: 10,
    },
    {
      id: 4,
      name: 'over-10kg',
      targetDepartment: 'Heavy',
      minWeight: 10,
    },
  ]);

  // TODO: Fix
  const addRule = () => setBusinessRules(previous => [{ id: 5, name: 'asd', targetDepartment: 'asd' }, ...previous]);

  return (
    <div className="sm:ml-64">
      <TopBar companyId={companyId} />
      <div className="mt-16 p-4">
        <button
          type="button"
          onClick={addRule}
          className="flex flex-col items-center justify-center w-96 h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          Add rule
        </button>

        <ReactSortable list={businessRules} setList={setBusinessRules} animation={200} handle={'.draggable'}>
          {businessRules.map(rule => (
            <div
              key={rule.id}
              className="relative block mt-2 max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <ChevronUpDownIcon className="draggable cursor-grab absolute top-1 left-1 w-5 h-5" fill="currentColor" />
              <table>
                <tr>
                  <td className="pl-2 pr-2">Price</td>
                  <td className="pl-2 pr-2">
                    <Input placeholder="Min" value={rule.minValue} onChange={() => {}} />
                  </td>
                  <td className="pl-2 pr-2">
                    <Input placeholder="Max" value={rule.maxValue} onChange={() => {}} />
                  </td>
                </tr>
                <tr>
                  <td className="pl-2 pr-2">Weight</td>
                  <td className="pl-2 pr-2">
                    <Input placeholder="Min" value={rule.minWeight} onChange={() => {}} />
                  </td>
                  <td className="pl-2 pr-2">
                    <Input placeholder="Max" value={rule.maxWeight} onChange={() => {}} />
                  </td>
                </tr>
              </table>
            </div>
          ))}
        </ReactSortable>
      </div>
    </div>
  );
}

interface InputProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
  value?: string | number;
  placeholder: string;
}
function Input({ value, placeholder, onChange }: InputProps) {
  return (
    <input
      type="text"
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full m-1 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
