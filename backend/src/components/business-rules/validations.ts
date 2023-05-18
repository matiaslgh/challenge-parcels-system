import Joi from 'joi';

import { BusinessRule } from './types';
import { InvalidInputError } from '../../common/app-error';
import { getDuplicateKeys, validate } from '../../common/validation';

const businessRuleSchema = Joi.object({
  name: Joi.string().required(),
  sourceDepartment: Joi.string(),
  targetDepartment: Joi.string().required(),
  minWeight: Joi.number().positive(),
  maxWeight: Joi.number().when('minWeight', {
    is: Joi.exist(),
    then: Joi.number().greater(Joi.ref('minWeight')).allow(null),
    otherwise: Joi.allow(null),
  }),
  minValue: Joi.number().positive(),
  maxValue: Joi.number().when('minValue', {
    is: Joi.exist(),
    then: Joi.number().greater(Joi.ref('minValue')).allow(null),
    otherwise: Joi.allow(null),
  }),
});

export function throwIfInvalidBusinessRules(businessRulesInput: unknown): asserts businessRulesInput is BusinessRule[] {
  const schema = Joi.array().items(businessRuleSchema).min(0).required();
  validate<BusinessRule[]>(schema, businessRulesInput);
  const duplicateNames = getDuplicateKeys<BusinessRule>('name', businessRulesInput);
  if (duplicateNames.length > 0) {
    throw new InvalidInputError(`Duplicate names: ${duplicateNames.join(', ')}`);
  }
}
