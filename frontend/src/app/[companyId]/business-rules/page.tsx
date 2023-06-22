'use client';

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { ChangeEventHandler } from 'react';
import TopBar from './TopBar';
import useBusinessRules from './useBusinessRules';
import AddConstraintDropdown from './AddConstraintDropdown';
import { XCircleIcon } from '@heroicons/react/24/outline';

interface BusinessRulesPageProps {
  params: {
    companyId: string;
  };
}

export default function BusinessRulesPage({ params: { companyId } }: BusinessRulesPageProps) {
  const { businessRules, updateBusinessRule, addRule, removeRule, handleOnDragEnd, saveRules } =
    useBusinessRules(companyId);

  return (
    <div className="sm:ml-64">
      <TopBar saveRules={saveRules} />
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
                  <Draggable key={rule.id} draggableId={rule.id} index={index}>
                    {provided => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="relative block mt-2 max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                      >
                        <button className="absolute top-1 right-1" type="button" onClick={() => removeRule(index)}>
                          <XCircleIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                        </button>

                        <table>
                          <tbody>
                            <tr>
                              <td className="pl-2 pr-2">Name</td>
                              <td colSpan={2} className="pl-2 pr-2">
                                <Input
                                  value={rule.name}
                                  onChange={e => updateBusinessRule(rule.id, { ...rule, name: e.currentTarget.value })}
                                />
                              </td>
                            </tr>
                            {rule.sourceDepartment !== undefined && (
                              <tr>
                                <td className="pl-2 pr-2">Source</td>
                                <td colSpan={2} className="pl-2 pr-2">
                                  <Input
                                    value={rule.sourceDepartment}
                                    onChange={e =>
                                      updateBusinessRule(rule.id, {
                                        ...rule,
                                        sourceDepartment: e.currentTarget.value,
                                      })
                                    }
                                  />
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateBusinessRule(rule.id, {
                                        ...rule,
                                        sourceDepartment: undefined,
                                      });
                                    }}
                                  >
                                    <XCircleIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                  </button>
                                </td>
                              </tr>
                            )}
                            <tr>
                              <td className="pl-2 pr-2">Target</td>
                              <td colSpan={2} className="pl-2 pr-2">
                                <Input
                                  value={rule.targetDepartment}
                                  onChange={e =>
                                    updateBusinessRule(rule.id, {
                                      ...rule,
                                      targetDepartment: e.currentTarget.value,
                                    })
                                  }
                                />
                              </td>
                            </tr>
                            {(rule.minValue !== undefined || rule.maxValue !== undefined) && (
                              <tr>
                                <td className="pl-2 pr-2">Price</td>
                                <td className="pl-2 pr-2">
                                  <Input
                                    placeholder="Min"
                                    value={rule.minValue}
                                    onChange={e =>
                                      updateBusinessRule(rule.id, {
                                        ...rule,
                                        minValue: e.currentTarget.value,
                                      })
                                    }
                                  />
                                </td>
                                <td className="pl-2 pr-2">
                                  <Input
                                    placeholder="Max"
                                    value={rule.maxValue}
                                    onChange={e =>
                                      updateBusinessRule(rule.id, {
                                        ...rule,
                                        maxValue: e.currentTarget.value,
                                      })
                                    }
                                  />
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateBusinessRule(rule.id, {
                                        ...rule,
                                        minValue: undefined,
                                        maxValue: undefined,
                                      });
                                    }}
                                  >
                                    <XCircleIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                  </button>
                                </td>
                              </tr>
                            )}
                            {(rule.minWeight !== undefined || rule.maxWeight !== undefined) && (
                              <tr>
                                <td className="pl-2 pr-2">Weight</td>
                                <td className="pl-2 pr-2">
                                  <Input
                                    placeholder="Min"
                                    value={rule.minWeight}
                                    onChange={e =>
                                      updateBusinessRule(rule.id, {
                                        ...rule,
                                        minWeight: e.currentTarget.value,
                                      })
                                    }
                                  />
                                </td>
                                <td className="pl-2 pr-2">
                                  <Input
                                    placeholder="Max"
                                    value={rule.maxWeight}
                                    onChange={e =>
                                      updateBusinessRule(rule.id, {
                                        ...rule,
                                        maxWeight: e.currentTarget.value,
                                      })
                                    }
                                  />
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateBusinessRule(rule.id, {
                                        ...rule,
                                        minWeight: undefined,
                                        maxWeight: undefined,
                                      });
                                    }}
                                  >
                                    <XCircleIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                  </button>
                                </td>
                              </tr>
                            )}
                            {!(
                              (rule.minWeight !== undefined || rule.maxWeight !== undefined) &&
                              (rule.minValue !== undefined || rule.maxValue !== undefined) &&
                              rule.sourceDepartment !== undefined
                            ) && (
                              <tr>
                                <td colSpan={3} className="pt-2">
                                  <AddConstraintDropdown rule={rule} updateBusinessRule={updateBusinessRule} />
                                </td>
                              </tr>
                            )}
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
  placeholder?: string;
}
function Input({ value, placeholder, onChange }: InputProps) {
  return (
    <input
      type="text"
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full m-1 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder={placeholder ?? ''}
      value={value}
      onChange={onChange}
    />
  );
}
