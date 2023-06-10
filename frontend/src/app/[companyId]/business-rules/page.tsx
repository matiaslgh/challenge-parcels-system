'use client';

import { ReactSortable } from 'react-sortablejs';
import { BusinessRule } from '@/app/types';
import { useState } from 'react';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';

export default function BusinessRulesPage() {
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
  return (
    <div className="p-4 sm:ml-64">
      <ReactSortable list={businessRules} setList={setBusinessRules} animation={200} handle={'.draggable'}>
        {businessRules.map(rule => (
          <div
            key={rule.id}
            className="relative block  mb-2 max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <ChevronUpDownIcon className="draggable absolute top-1 left-1 w-5 h-5" fill="currentColor" />
            <table>
              <tr>
                <td className="pl-2 pr-2">Price</td>
                <td className="pl-2 pr-2">
                  <Input placeholder="Min" value={rule.minValue} />
                </td>
                <td className="pl-2 pr-2">
                  <Input placeholder="Max" value={rule.maxValue} />
                </td>
              </tr>
              <tr>
                <td className="pl-2 pr-2">Weight</td>
                <td className="pl-2 pr-2">
                  <Input placeholder="Min" value={rule.minWeight} />
                </td>
                <td className="pl-2 pr-2">
                  <Input placeholder="Max" value={rule.maxWeight} />
                </td>
              </tr>
            </table>
          </div>
        ))}
      </ReactSortable>
    </div>
  );
}

interface InputProps {
  value?: string | number;
  placeholder: string;
}
function Input({ value, placeholder }: InputProps) {
  return (
    <input
      type="text"
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full m-1 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder={placeholder}
      value={value}
    />
  );
}
