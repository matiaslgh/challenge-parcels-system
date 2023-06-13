import { BusinessRule } from '@/app/types';
import { useEffect, useState } from 'react';
import { OnDragEndResponder } from 'react-beautiful-dnd';

export default function useBusinessRules() {
  const [businessRules, setBusinessRules] = useState<BusinessRule[]>([]);
  useEffect(() => {
    setBusinessRules([
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
  }, []);

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

  return { businessRules, addRule, handleOnDragEnd };
}
