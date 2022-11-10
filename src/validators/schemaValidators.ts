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
  analyticsUserId: Joi.string(),
  anonymousId: Joi.string(),
  eventName: Joi.string().required(),
  sendDappNotification: Joi.boolean(),
  sendEmail: Joi.boolean(),
  sendSegment: Joi.boolean(),
  email: Joi.string(),
  userWalletAddress: Joi.string()
    .pattern(ethereumWalletAddressRegex)
    .required(),

  // We have a different validator for each notification type and validate it later in notification controller
  metadata: Joi.object(),
  segment: Joi.object({
    anonymousId: Joi.string(),
    analyticsUserId: Joi.string(),
    payload: Joi.object({
      // Common attributes
      email: Joi.string(),
      title: Joi.string(),
      slug: Joi.string(),
      firstName: Joi.string(),

      // Donation related attributes
      projectOwnerId: Joi.string(),
      amount: Joi.number(),
      transactionId: Joi.string(),
      transactionNetworkId: Joi.number(),
      currency: Joi.string(),
      createdAt: Joi.string(),
      toWalletAddress: Joi.string(),
      fromWalletAddress: Joi.string(),
      donationValueUsd: Joi.number(),
      donationValueEth: Joi.number(),
      verified: Joi.boolean(),
      transakStatus: Joi.string(),

      //Project related attributes
      lastName: Joi.string(),
      OwnerId: Joi.number(),

      // Project update
      update: Joi.string(),
    }),
  }),
});

export const getNotificationsValidator = Joi.object({
  // TODO should fill it
});

export const readSingleNotificationsValidator = Joi.object({
  // TODO should fill it
});

// need to define a schema validator for each segment event
