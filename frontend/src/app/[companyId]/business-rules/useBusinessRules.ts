import { getBusinessRules } from '@/api/business-rules';
import { BusinessRule } from '@/app/types';
import { useEffect, useState } from 'react';
import { OnDragEndResponder } from 'react-beautiful-dnd';

export default function useBusinessRules(companyId: string) {
  const [businessRules, setBusinessRules] = useState<BusinessRule[]>([]);
  useEffect(() => {
    getBusinessRules(companyId).then(businessRules => {
      if (businessRules !== null) {
        setBusinessRules(businessRules.rules);
      }
    });
  }, [companyId]);

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

  const updateBusinessRule = (ruleName: string, rule: BusinessRule) => {
    setBusinessRules(previous => previous.map(previousRule => (previousRule.name === ruleName ? rule : previousRule)));
  };

  return { businessRules, updateBusinessRule, addRule, handleOnDragEnd };
}
