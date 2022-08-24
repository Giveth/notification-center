import Joi, { ObjectSchema } from 'joi';
import { errorMessages } from '../errorMessages';
import { GIVETH_IO_EVENTS, NETWORK_IDS } from '../utils';

// Microservice should send the requested json, the notification service
// does not care about calculating values, only validating fields
const filterDateRegex = new RegExp('^[0-9]{8} [0-9]{2}:[0-9]{2}:[0-9]{2}$');
const ethereumWalletAddressRegex = /^0x[a-fA-F0-9]{40}$/;
const txHashRegex = /^0x[a-fA-F0-9]{64}$/;
const tokenSymbolRegex = /^[a-zA-Z0-9]{3,10}$/;

export const validateWithJoiSchema = (data: any, schema: ObjectSchema) => {
  const validationResult = schema.validate(data);
  throwHttpErrorIfJoiValidatorFails(validationResult);
};

// Using Analytics structure for all notifications

// Define all joi schemas here
const projectSchema = {
  // seems we have to different schemas, not good TODO CHANGE ON IMPACT GRAPH
  email: Joi.string().required(),
  title: Joi.string().required(),
  FirstName: Joi.string().required(),
  LastName: Joi.string().required(),
  OwnerId: Joi.string().required(),
  slug: Joi.string().required(),
};

const draftedProjectValidator = Joi.object({
  event: Joi.string()
    .required()
    .valid(GIVETH_IO_EVENTS.DRAFTED_PROJECT_ACTIVATED),
  analyticsUserId: Joi.string().required(),
  properties: projectSchema,
  anonymousId: Joi.string(),
});

const projectTrackerSchema = {
  email: Joi.string().required(),
  title: Joi.string().required(),
  lastName: Joi.string().required(),
  firstName: Joi.string().required(),
  OwnerId: Joi.string().required(),
  slug: Joi.string().required(),
  walletAddress: Joi.string().required().pattern(ethereumWalletAddressRegex),
};

const projectListed = Joi.object({
  event: Joi.string()
    .required()
    .valid(GIVETH_IO_EVENTS.DRAFTED_PROJECT_ACTIVATED),
  analyticsUserId: Joi.string().required(),
  properties: projectTrackerSchema,
  anonymousId: Joi.string(),
});

const projectUnlisted = Joi.object({
  event: Joi.string()
    .required()
    .valid(GIVETH_IO_EVENTS.DRAFTED_PROJECT_ACTIVATED),
  analyticsUserId: Joi.string().required(),
  properties: projectTrackerSchema,
  anonymousId: Joi.string(),
});

const projectEdited = Joi.object({
  event: Joi.string().required().valid(GIVETH_IO_EVENTS.PROJECT_EDITED),
  analyticsUserId: Joi.string().required(),
  properties: projectTrackerSchema,
  anonymousId: Joi.string(),
});

const projectBadgeRevoked = Joi.object({
  event: Joi.string().required().valid(GIVETH_IO_EVENTS.PROJECT_BADGE_REVOKED),
  analyticsUserId: Joi.string().required(),
  properties: projectTrackerSchema,
  anonymousId: Joi.string(),
});

const projectVerified = Joi.object({
  event: Joi.string().required().valid(GIVETH_IO_EVENTS.PROJECT_VERIFIED),
  analyticsUserId: Joi.string().required(),
  properties: projectTrackerSchema,
  anonymousId: Joi.string(),
});

const projectRejected = Joi.object({
  event: Joi.string().required().valid(GIVETH_IO_EVENTS.PROJECT_REJECTED),
  analyticsUserId: Joi.string().required(),
  properties: projectTrackerSchema,
  anonymousId: Joi.string(),
});

const projectUnverified = Joi.object({
  event: Joi.string().required().valid(GIVETH_IO_EVENTS.PROJECT_UNVERIFIED),
  analyticsUserId: Joi.string().required(),
  properties: projectTrackerSchema,
  anonymousId: Joi.string(),
});

const projectActivated = Joi.object({
  event: Joi.string().required().valid(GIVETH_IO_EVENTS.PROJECT_ACTIVATED),
  analyticsUserId: Joi.string().required(),
  properties: projectTrackerSchema,
  anonymousId: Joi.string(),
});

const projectDeactivated = Joi.object({
  event: Joi.string().required().valid(GIVETH_IO_EVENTS.PROJECT_DEACTIVATED),
  analyticsUserId: Joi.string().required(),
  properties: projectTrackerSchema,
  anonymousId: Joi.string(),
});

const projectCancelled = Joi.object({
  event: Joi.string().required().valid(GIVETH_IO_EVENTS.PROJECT_CANCELLED),
  analyticsUserId: Joi.string().required(),
  properties: projectTrackerSchema,
  anonymousId: Joi.string(),
});

const sendVerificationEmailSchema = Joi.object({
  email: Joi.string().required(),
  projectSlug: Joi.string().required(),
  confirmationToken: Joi.string().required(),
});

const sendEmailConfirmation = Joi.object({
  event: Joi.string()
    .required()
    .valid(GIVETH_IO_EVENTS.SEND_EMAIL_CONFIRMATION),
  properties: sendVerificationEmailSchema,
});

const donationTrackerSchema = Joi.object({
  email: Joi.string().allow(null, undefined, ''), // if anonymous
  title: Joi.string().required(),
  firstName: Joi.string().allow(null, undefined, ''),
  projectOwnerId: Joi.string().allow(null, undefined, ''),
  slug: Joi.string().allow(null, undefined, ''),
  amount: Joi.number()?.greater(0).required(),
  transactionId: Joi.string().required().pattern(txHashRegex).messages({
    'string.pattern.base': errorMessages.INVALID_TRANSACTION_ID,
  }),
  transactionNetworkId: Joi.number()
    .required()
    .valid(...Object.values(NETWORK_IDS)),
  currency: Joi.string().required().pattern(tokenSymbolRegex).messages({
    'string.pattern.base': errorMessages.CURRENCY_IS_INVALID,
    'string.base': errorMessages.CURRENCY_IS_INVALID,
  }),
  createdAt: Joi.string().pattern(filterDateRegex).messages({
    'string.pattern.base': errorMessages.INVALID_DATE_FORMAT,
  }),
  toWalletAddress: Joi.string().required().pattern(ethereumWalletAddressRegex),
  fromWalletAddress: Joi.string()
    .required()
    .pattern(ethereumWalletAddressRegex),
  donationValueUsd: Joi.number().greater(0).allow(null, undefined), // incase it fails
  donationValueEth: Joi.number().greater(0).allow(null, undefined),
  verified: Joi.boolean().allow(null, undefined),
  transakStatus: Joi.string().allow(null, undefined),
});

const madeDonation = Joi.object({
  event: Joi.string().required().valid(GIVETH_IO_EVENTS.MADE_DONATION),
  analyticsUserId: Joi.string().required(),
  properties: donationTrackerSchema,
  anonymousId: Joi.string(),
});

const donationReceived = Joi.object({
  event: Joi.string().required().valid(GIVETH_IO_EVENTS.DONATION_RECEIVED),
  analyticsUserId: Joi.string().required(),
  properties: donationTrackerSchema,
  anonymousId: Joi.string(),
});

const projectUpdatesForDonorSchema = Joi.object({
  title: Joi.string().required(),
  projectId: Joi.number().required(),
  projectOwnerId: Joi.string().required(),
  slug: Joi.string().required(),
  update: Joi.string().required(),
  email: Joi.string().required(),
  firstName: Joi.string().required(),
});

const projectUpdatesForOwnerSchema = Joi.object({
  title: Joi.string().required(),
  email: Joi.string().required(),
  slug: Joi.string().required(),
  update: Joi.string().required(),
  projectId: Joi.number().required(),
  firstName: Joi.string().required(),
});

const projectUpdatedDonor = Joi.object({
  event: Joi.string().required().valid(GIVETH_IO_EVENTS.PROJECT_UPDATED_DONOR),
  analyticsUserId: Joi.string().required(),
  properties: projectUpdatesForDonorSchema,
  anonymousId: Joi.string(),
});

const projectUpdatedOwner = Joi.object({
  event: Joi.string().required().valid(GIVETH_IO_EVENTS.PROJECT_UPDATED_OWNER),
  analyticsUserId: Joi.string().required(),
  properties: projectUpdatesForOwnerSchema,
  anonymousId: Joi.string(),
});

const projectCreated = Joi.object({
  event: Joi.string().required().valid(GIVETH_IO_EVENTS.PROJECT_CREATED),
  analyticsUserId: Joi.string().required(),
  properties: projectTrackerSchema,
  anonymousId: Joi.string(),
});

const getDonationPriceFailed = Joi.object({
  event: Joi.string()
    .required()
    .valid(GIVETH_IO_EVENTS.GET_DONATION_PRICE_FAILED),
  analyticsUserId: Joi.string().required(),
  properties: donationTrackerSchema,
  anonymousId: Joi.string(),
});

const verificationFormDrafted = Joi.object({
  event: Joi.string()
    .required()
    .valid(GIVETH_IO_EVENTS.VERIFICATION_FORM_GOT_DRAFT_BY_ADMIN),
  analyticsUserId: Joi.string().required(),
  properties: projectTrackerSchema,
  anonymousId: Joi.string(),
});

export const SCHEMA_VALIDATORS = {
  draftedProjectValidator: draftedProjectValidator,
  projectListed: projectListed,
  projectUnlisted: projectUnlisted,
  projectEdited: projectEdited,
  projectBadgeRevoked: projectBadgeRevoked,
  projectVerified: projectVerified,
  projectRejected: projectRejected,
  projectUnverified: projectUnverified,
  projectActivated: projectActivated,
  projectDeactivated: projectDeactivated,
  projectCancelled: projectCancelled,
  sendEmailConfirmation: sendEmailConfirmation,
  madeDonation: madeDonation,
  donationReceived: donationReceived,
  projectUpdatedDonor: projectUpdatedDonor,
  projectUpdatedOwner: projectUpdatedOwner,
  projectCreated: projectCreated,
  getDonationPriceFailed: getDonationPriceFailed,
  verificationFormDrafted: verificationFormDrafted,
};
function throwHttpErrorIfJoiValidatorFails(
  validationResult: Joi.ValidationResult<any>,
) {
  throw new Error('Function not implemented.');
}
