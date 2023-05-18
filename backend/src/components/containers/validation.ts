import Joi from 'joi';

import { ContainerInput } from './types';
import { validate } from '../../common/validation';
import { parcelInputSchema } from '../parcels/validation';

const containerInputSchema = Joi.object({
  id: Joi.string().required(),
  shippingDate: Joi.date().required(),
  parcels: Joi.array().items(parcelInputSchema).required(),
});

export function throwIfInvalidContainerInput(containerInput: unknown): asserts containerInput is ContainerInput {
  validate(containerInputSchema.required(), containerInput);
}
