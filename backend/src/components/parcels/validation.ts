import Joi from 'joi';

const addressSchema = Joi.object({
  street: Joi.string().required(),
  houseNumber: Joi.string().required(),
  postalCode: Joi.string().required(),
  city: Joi.string().required(),
});

const recipientSchema = Joi.object({
  name: Joi.string().required(),
  address: addressSchema.required(),
});

export const parcelInputSchema = Joi.object({
  recipient: recipientSchema.required(),
  weight: Joi.number().required(),
  value: Joi.number().required(),
});
