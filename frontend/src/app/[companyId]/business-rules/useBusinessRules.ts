import { getBusinessRules, upsertBusinessRules } from '@/api/business-rules';
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

  const addRule = () => {
    const id = `${Math.floor(Math.random() * 10000)}`;
    setBusinessRules(previous => [{ id, name: `new-rule-${id}`, targetDepartment: 'Finished' }, ...previous]);
  };

  const handleOnDragEnd: OnDragEndResponder = result => {
    if (!result.destination) return;

    setBusinessRules(previous => {
      const items = Array.from(previous);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination!.index, 0, reorderedItem);
      return items;
    });
  };

  const updateBusinessRule = (ruleId: string, rule: BusinessRule) => {
    setBusinessRules(previous => previous.map(previousRule => (previousRule.id === ruleId ? rule : previousRule)));
  };

  const saveRules = async () => {
    const response = await upsertBusinessRules(companyId, businessRules);
    if (response !== null) {
      setBusinessRules(response.rules);
    }
  };

  const removeRule = (index: number) => {
    setBusinessRules(previous => previous.filter((_, i) => i !== index));
  };

  return { businessRules, updateBusinessRule, addRule, removeRule, handleOnDragEnd, saveRules };
}
