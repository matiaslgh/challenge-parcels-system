'use client';

import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from 'react-beautiful-dnd';
import { BusinessRule } from '@/app/types';
import { ChangeEventHandler, useState } from 'react';
import TopBar from './TopBar';

interface BusinessRulesPageProps {
  params: {
    companyId: string;
  };
}

export default function BusinessRulesPage({ params: { companyId } }: BusinessRulesPageProps) {
  const [businessRules, setBusinessRules] = useState<BusinessRule[]>([
    {
      name: 'needs-insurance',
      sourceDepartment: 'Distribution center',
      targetDepartment: 'Insurance',
      minValue: 1000,
    },
    {
      name: 'less-than-1kg',
      targetDepartment: 'Mail',
      maxWeight: 1,
    },
    {
      name: 'between-1kg-and-10kg',
      targetDepartment: 'Regular',
      minWeight: 1,
      maxWeight: 10,
    },
    {
      name: 'over-10kg',
      targetDepartment: 'Heavy',
      minWeight: 10,
    },
  ]);

  // TODO: Fix
  const addRule = () =>
    setBusinessRules(previous => [
      { name: `new-rule-${Math.floor(Math.random() * 10000)}`, targetDepartment: 'Finished' },
      ...previous,
    ]);

  const handleOnDragEnd: OnDragEndResponder = result => {
    if (!result.destination) return;

    setBusinessRules(previous => {
      const items = Array.from(previous);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination!.index, 0, reorderedItem);
      return items;
    });
  };

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
