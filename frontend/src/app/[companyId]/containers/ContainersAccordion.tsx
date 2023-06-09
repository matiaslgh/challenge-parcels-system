'use client';

import { ContainerDbParsedWithParcels, ParcelDbParsed } from '@/app/types';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useCallback, useState } from 'react';
import ParcelsTable from './ParcelsTable';

interface ContainersAccordionProps {
  containers: ContainerDbParsedWithParcels[];
}

export default function ContainersAccordion({ containers }: ContainersAccordionProps) {
  const [openContainerId, setOpenContainerId] = useState<string | null>(null);

  const handleToggle = useCallback((id: string) => {
    setOpenContainerId(prevId => (prevId === id ? null : id));
  }, []);
  return (
    <div id="containers-accordion-collapse" data-accordion="collapse">
      {containers.map(container => (
        <div key={container.id}>
          <h2 id={`accordion-collapse-heading-${container.id}`}>
            <button
              type="button"
              className="flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              data-accordion-target={`#accordion-collapse-body-${container.id}`}
              aria-expanded="true"
              aria-controls={`accordion-collapse-body-${container.id}`}
              onClick={() => handleToggle(container.id)}
            >
              <span>
                <Status parcels={container.parcels} /> Shipping date: {toHumanReadable(container.shippingDate)}
              </span>
              <ChevronDownIcon
                className={openContainerId === container.id ? 'w-6 h-6' : 'w-6 h-6 rotate-180 shrink-0'}
                fill="currentColor"
              />
            </button>
          </h2>
          <div
            id={`accordion-collapse-body-${container.id}`}
            className={openContainerId === container.id ? '' : 'hidden'}
            aria-labelledby={`accordion-collapse-heading-${container.id}`}
          >
            <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
              <ParcelsTable parcels={container.parcels} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function toHumanReadable(strDate: string): string {
  const date = new Date(strDate);

  const datePart = date.toLocaleDateString();

  // get HH:mm
  const timePart = date.toTimeString().split(' ')[0].substring(0, 5);

  return `${datePart} at ${timePart}`;
}

interface StatusProps {
  parcels: ParcelDbParsed[];
}
function Status({ parcels }: StatusProps) {
  const areThereParcelsThatNeedToBeMoved = parcels.some(parcel => parcel.targetDepartment !== 'Finished');
  if (areThereParcelsThatNeedToBeMoved) {
    return (
      <span className="bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
        Not finished
      </span>
    );
  }
  return (
    <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
      Finished
    </span>
  );
}
