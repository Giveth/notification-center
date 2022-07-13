import Joi, {number, ObjectSchema, ValidationResult} from 'joi';
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
  userId:Joi.string().required(),
  projectId: Joi.string().required(),
  notificationType: Joi.string().required(),
  walletAddress :  Joi.string().pattern(ethereumWalletAddressRegex).required(),
  metadata: Joi.object({
    amount: Joi.number(),
    currency: Joi.string(),

    name: Joi.string(),
  })
});
