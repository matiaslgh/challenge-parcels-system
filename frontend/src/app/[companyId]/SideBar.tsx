'use client';

import { CubeIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Company } from '@/app/types';

interface SideBarProps {
  company: Company;
}

export default function SideBar({ company }: SideBarProps) {
  console.log('SideBar');
  const pathName = usePathname();
  const navigation = [
    {
      name: 'Containers',
      href: `/${company.id}/containers`,
      icon: CubeIcon,
      current: pathName === `/${company.id}/containers`,
    },
    {
      name: 'Business Rules',
      href: `/${company.id}/business-rules`,
      icon: TableCellsIcon,
      current: pathName === `/${company.id}/business-rules`,
    },
  ];
  return (
    <aside
      id="default-sidebar"
      className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center pl-2.5 mb-7">
          <span className="self-center text-xl font-semibold whitespace-nowrap text-black dark:text-white">
            {company.name}
          </span>
        </div>
        <ul className="space-y-2 font-medium">
          {navigation.map(item => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  item.current ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
              >
                <item.icon
                  aria-hidden="true"
                  className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                />
                <span className="ml-3">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
