'use client';

import { MouseEventHandler, useRef } from 'react';
import useUploadContainer from './useUploadContainer';

interface TopBarProps {
  companyId: string;
}

export default function TopBar({ companyId }: TopBarProps) {
  const { onFileChange } = useUploadContainer(companyId);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleClick: MouseEventHandler<HTMLButtonElement> = event => {
    event.preventDefault();
    if (fileInput.current) {
      fileInput.current.click();
    }
  };

  return (
    <div className="pl-4 pt-2 sm:ml-64 bg-gray-100 border-gray-200 dark:bg-gray-900">
      <div className="relative overflow-hidden inline-block">
        <button
          onClick={handleClick}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Upload
        </button>
        <input
          ref={fileInput}
          className="absolute top-0 right-0 w-0 h-0 opacity-0"
          type="file"
          onChange={onFileChange}
        />
      </div>
    </div>
  );
}
