import Joi, { number, ObjectSchema, ValidationResult } from 'joi';
import { StandardError } from '../types/StandardError';
import { errorMessagesEnum } from '../utils/errorMessages';

const ethereumWalletAddressRegex = /^0x[a-fA-F0-9]{40}$/;
const txHashRegex = /^0x[a-fA-F0-9]{64}$/;

export const validateWithJoiSchema = (data: any, schema: ObjectSchema) => {
  const validationResult = schema.validate(data);
  throwHttpErrorIfJoiValidatorFails(validationResult);
};

const throwHttpErrorIfJoiValidatorFails = (
  validationResult: ValidationResult,
) => {
  if (validationResult.error) {
    const error = new StandardError(
      errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR,
    );
    error.description = validationResult.error.details[0].message;
    throw error;
  }
};

export const sendNotificationValidator = Joi.object({
  projectId: Joi.string(),
  eventName: Joi.string().required(),
  sendEmail: Joi.boolean(),
  sendSegment: Joi.boolean(),
  email: Joi.string(),
  userWalletAddress: Joi.string()
    .pattern(ethereumWalletAddressRegex)
    .required(),

  // We have a different validator for each notification type and validate it later in notification controller
  metadata: Joi.object(),
});

export const getNotificationsValidator = Joi.object({
  // TODO should fill it
});

export const readSingleNotificationsValidator = Joi.object({
  // TODO should fill it
});

// need to define a schema validator for each segment event
