'use client';

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { ChangeEventHandler, useState } from 'react';
import TopBar from './TopBar';
import useBusinessRules from './useBusinessRules';
import { BusinessRule } from '@/app/types';

interface BusinessRulesPageProps {
  params: {
    companyId: string;
  };
}

export default function BusinessRulesPage({ params: { companyId } }: BusinessRulesPageProps) {
  const { businessRules, addRule, handleOnDragEnd } = useBusinessRules();

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

        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="droppable-section">
            {provided => (
              <div className="droppable-section" {...provided.droppableProps} ref={provided.innerRef}>
                {businessRules.map((rule, index) => (
                  <Draggable key={rule.name} draggableId={rule.name} index={index}>
                    {provided => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="relative block mt-2 max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                      >
                        <table>
                          <tbody>
                            {rule.sourceDepartment && (
                              <tr>
                                <td className="pl-2 pr-2">Source</td>
                                <td colSpan={2} className="pl-2 pr-2">
                                  <Input placeholder="" value={rule.sourceDepartment} onChange={() => {}} />
                                </td>
                              </tr>
                            )}
                            <tr>
                              <td className="pl-2 pr-2">Target</td>
                              <td colSpan={2} className="pl-2 pr-2">
                                <Input placeholder="" value={rule.targetDepartment} onChange={() => {}} />
                              </td>
                            </tr>
                            {(rule.minValue !== undefined || rule.maxValue !== undefined) && (
                              <tr>
                                <td className="pl-2 pr-2">Price</td>
                                <td className="pl-2 pr-2">
                                  <Input placeholder="Min" value={rule.minValue} onChange={() => {}} />
                                </td>
                                <td className="pl-2 pr-2">
                                  <Input placeholder="Max" value={rule.maxValue} onChange={() => {}} />
                                </td>
                              </tr>
                            )}
                            {(rule.minWeight !== undefined || rule.maxWeight !== undefined) && (
                              <tr>
                                <td className="pl-2 pr-2">Weight</td>
                                <td className="pl-2 pr-2">
                                  <Input placeholder="Min" value={rule.minWeight} onChange={() => {}} />
                                </td>
                                <td className="pl-2 pr-2">
                                  <Input placeholder="Max" value={rule.maxWeight} onChange={() => {}} />
                                </td>
                              </tr>
                            )}
                            <tr>
                              <td colSpan={3} className="pt-2">
                                <AddConstraint rule={rule} />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
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

function AddConstraint({ rule }: { rule: BusinessRule }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        id="dropdownDefaultButton"
        data-dropdown-toggle="dropdown"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={() => setOpen(previous => !previous)}
        onBlur={() => setOpen(false)}
      >
        Add constraint
      </button>

      <div
        id="dropdown"
        className={`z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute ${
          !open ? 'hidden' : ''
        }`}
      >
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
          {rule.sourceDepartment === undefined && (
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                by source department
              </a>
            </li>
          )}
          {rule.maxValue === undefined && rule.minValue === undefined && (
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                by value
              </a>
            </li>
          )}
          {rule.maxWeight === undefined && rule.minWeight === undefined && (
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                by weight
              </a>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}
