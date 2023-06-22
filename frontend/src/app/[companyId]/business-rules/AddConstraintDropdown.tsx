import { BusinessRule } from '@/app/types';
import { useState } from 'react';

interface AddConstraintDropdownProps {
  rule: BusinessRule;
  updateBusinessRule: (ruleName: string, rule: BusinessRule) => void;
}
export default function AddConstraintDropdown({ rule, updateBusinessRule }: AddConstraintDropdownProps) {
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
              <Item
                text="by source department"
                onClick={() => updateBusinessRule(rule.id, { ...rule, sourceDepartment: '' })}
              />
            </li>
          )}
          {rule.maxValue === undefined && rule.minValue === undefined && (
            <li>
              <Item text="by value" onClick={() => updateBusinessRule(rule.id, { ...rule, minValue: '' })} />
            </li>
          )}
          {rule.maxWeight === undefined && rule.minWeight === undefined && (
            <li>
              <Item text="by weight" onClick={() => updateBusinessRule(rule.id, { ...rule, minWeight: '' })} />
            </li>
          )}
        </ul>
      </div>
    </>
  );
}

interface ItemProps {
  text: string;
  onClick: () => void;
}
function Item({ text, onClick }: ItemProps) {
  return (
    <a
      onClick={onClick}
      className="block px-4 py-2 w-full hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
    >
      {text}
    </a>
  );
}
