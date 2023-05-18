import Joi from 'joi';

import { CompanyInput } from './types';
import { validate } from '../../common/validation';

const companyInputSchema = Joi.object({
  name: Joi.string().required(),
});

export function throwIfInvalidCompanyInput(companyInput: unknown): asserts companyInput is CompanyInput {
  validate(companyInputSchema.required(), companyInput);
}
