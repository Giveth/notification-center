import Joi, { number, ObjectSchema, ValidationResult } from 'joi';
import { StandardError } from '../types/StandardError';
import { errorMessagesEnum } from '../utils/errorMessages';

const ethereumWalletAddressRegex = /^0x[a-fA-F0-9]{40}$/;
const solanaWalletAddressRegex = /^[A-Za-z0-9]{43,44}$/;
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

export const countUnreadValidator = Joi.object({
  walletAddress: Joi.alternatives().try(
    Joi.string().required().pattern(ethereumWalletAddressRegex),
    Joi.string().required().pattern(solanaWalletAddressRegex),
  ),
});

export const sendNotificationValidator = Joi.object({
  trackId: Joi.string(),
  projectId: Joi.string(),
  analyticsUserId: Joi.string(),
  anonymousId: Joi.string(),
  eventName: Joi.string().required(),
  sendDappNotification: Joi.boolean(),
  sendEmail: Joi.boolean(),
  sendSegment: Joi.boolean(),
  email: Joi.string().allow(null).allow(''),
  creationTime: Joi.number(),
  userWalletAddress: Joi.alternatives().try(
    Joi.string().required().pattern(ethereumWalletAddressRegex),
    Joi.string().required().pattern(solanaWalletAddressRegex),
  ),

  // We have a different validator for each notification type and validate it later in notification controller
  metadata: Joi.object(),
  segment: Joi.object({
    anonymousId: Joi.string(),
    analyticsUserId: Joi.string(),
    payload: Joi.object({
      // Common attributes
      email: Joi.string().allow(null).allow(''),
      title: Joi.string(),
      slug: Joi.string(),
      firstName: Joi.string().allow(null).allow(''),
      userId: Joi.number(),
      projectLink: Joi.string().allow(null).allow(''),

      // Email confirmation
      verificationLink: Joi.string().allow(null).allow(''),

      // Verification form
      verificationRejectedReason: Joi.string().allow(null, ''),

      // Donation related attributes
      amount: Joi.number(),
      token: Joi.string().allow(null, ''),
      transactionId: Joi.string(),
      transactionNetworkId: Joi.number(),
      transactionLink: Joi.string().allow(null, ''),
      currency: Joi.string(),
      createdAt: Joi.string(),
      toWalletAddress: Joi.string(),
      fromWalletAddress: Joi.string().allow(null).allow(''),
      donationValueUsd: Joi.number(),
      donationValueEth: Joi.number().allow(null),
      verified: Joi.boolean(),
      transakStatus: Joi.string().allow(null).allow(''),
      isRecurringDonation: Joi.boolean().allow(null),

      //Super token critical attributes
      isEnded: Joi.boolean(),
      tokenSymbol: Joi.string(),

      //Project related attributes
      lastName: Joi.string().allow(null).allow(''),
      OwnerId: Joi.number().allow(null).allow(''),

      // Project update
      update: Joi.string(),

      // Notify reward attributes
      contractAddress: Joi.string(),
      farm: Joi.string(),
    }),
  }),
});

export const sendBulkNotificationValidator = Joi.object({
  notifications: Joi.array()
    .required()
    .min(1)
    .max(100)
    .items(
      sendNotificationValidator.concat(
        Joi.object({
          trackId: Joi.string().required(),
        }),
      ),
    ),
});

export const updateNotificationSettings = Joi.object({
  settings: Joi.array()
    .required()
    .items(
      Joi.object({
        id: Joi.number().required(),
        allowEmailNotification: Joi.boolean().required(),
        allowDappPushNotification: Joi.boolean().required(),
      }),
    ),
});

export const updateOneNotificationSetting = Joi.object({
  id: Joi.number().required(),
  allowEmailNotification: Joi.boolean().required(),
  allowDappPushNotification: Joi.boolean().required(),
});

export const getNotificationsValidator = Joi.object({
  // TODO should fill it
});

export const readSingleNotificationsValidator = Joi.object({
  // TODO should fill it
});

// need to define a schema validator for each segment event
