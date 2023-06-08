import { Address, ParcelDbParsed } from '@/app/types';

function TableHead() {
  return (
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" className="px-6 py-3">
          Recipient
        </th>
        <th scope="col" className="px-6 py-3">
          Weight (kg)
        </th>
        <th scope="col" className="px-6 py-3">
          Price (€)
        </th>
        <th scope="col" className="px-6 py-3">
          Current department
        </th>
        <th scope="col" className="px-6 py-3">
          Target department
        </th>
        <th scope="col" className="px-6 py-3">
          Action
        </th>
      </tr>
    </thead>
  );
}

interface ParcelsTableProps {
  parcels: ParcelDbParsed[];
}

export default function ParcelsTable({ parcels }: ParcelsTableProps) {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex items-center justify-between pb-4 bg-white dark:bg-gray-900">
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Move all
        </button>
      </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <TableHead />
        <tbody>
          {parcels.map(parcel => (
            <tr
              key={parcel.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                <div className="pl-3">
                  <div className="text-base font-semibold">{parcel.recipient.name}</div>
                  <div className="font-normal text-gray-500">{addressToString(parcel.recipient.address)}</div>
                </div>
              </th>
              <td className="px-6 py-4">{parcel.weight}</td>
              <td className="px-6 py-4">{parcel.value}</td>
              <td className="px-6 py-4">{parcel.sourceDepartment}</td>
              <td className="px-6 py-4">{parcel.targetDepartment}</td>
              <td className="px-6 py-4">
                <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                  Move
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function addressToString(address: Address): string {
  return `${address.street} ${address.houseNumber}, ${address.postalCode}, ${address.city}`;
}
