'use client';

import { MouseEventHandler } from 'react';

interface TopBarProps {
  saveRules: () => void;
}

export default function TopBar({ saveRules }: TopBarProps) {
  const onSave: MouseEventHandler<HTMLButtonElement> = event => {
    event.preventDefault();
    saveRules();
  };

  return (
    <div className="fixed top-0 z-40 w-full pl-4 pt-2 bg-gray-100 border-gray-200 dark:bg-gray-900">
      <div className="relative overflow-hidden inline-block">
        <button
          onClick={onSave}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Save
        </button>
      </div>
    </div>
  );
}
