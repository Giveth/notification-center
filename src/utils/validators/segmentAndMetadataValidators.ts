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

const draftedProjectPublishedSegmentValidator = Joi.object({
  event: Joi.string()
    .required()
    .valid(GIVETH_IO_EVENTS.DRAFTED_PROJECT_ACTIVATED),
  analyticsUserId: Joi.string().required(),
  properties: projectSchema,
  anonymousId: Joi.string(),
});

const draftedProjectSavedSegmentValidator = Joi.object({
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

const projectListedSegmentValidator = Joi.object({
  event: Joi.string()
    .required()
    .valid(GIVETH_IO_EVENTS.DRAFTED_PROJECT_ACTIVATED),
  analyticsUserId: Joi.string().required(),
  properties: projectTrackerSchema,
  anonymousId: Joi.string(),
});

const projectUnlistedSegmentValidator = Joi.object({
  event: Joi.string()
    .required()
    .valid(GIVETH_IO_EVENTS.DRAFTED_PROJECT_ACTIVATED),
  analyticsUserId: Joi.string().required(),
  properties: projectTrackerSchema,
  anonymousId: Joi.string(),
});

const projectEditedSegmentValidator = Joi.object({
  event: Joi.string().required().valid(GIVETH_IO_EVENTS.PROJECT_EDITED),
  analyticsUserId: Joi.string().required(),
  properties: projectTrackerSchema,
  anonymousId: Joi.string(),
});

const projectBadgeRevokedSegmentValidator = Joi.object({
  event: Joi.string().required().valid(GIVETH_IO_EVENTS.PROJECT_BADGE_REVOKED),
  analyticsUserId: Joi.string().required(),
  properties: projectTrackerSchema,
  anonymousId: Joi.string(),
});

const projectVerifiedSegmentValidator = Joi.object({
  event: Joi.string().required().valid(GIVETH_IO_EVENTS.PROJECT_VERIFIED),
  analyticsUserId: Joi.string().required(),
  properties: projectTrackerSchema,
  anonymousId: Joi.string(),
});

const projectRejectedSegmentValidator = Joi.object({
  event: Joi.string().required().valid(GIVETH_IO_EVENTS.PROJECT_REJECTED),
  analyticsUserId: Joi.string().required(),
  properties: projectTrackerSchema,
  anonymousId: Joi.string(),
});

const projectUnverifiedSegmentValidator = Joi.object({
  event: Joi.string().required().valid(GIVETH_IO_EVENTS.PROJECT_UNVERIFIED),
  analyticsUserId: Joi.string().required(),
  properties: projectTrackerSchema,
  anonymousId: Joi.string(),
});

const projectActivatedSegmentValidator = Joi.object({
  event: Joi.string().required().valid(GIVETH_IO_EVENTS.PROJECT_ACTIVATED),
  analyticsUserId: Joi.string().required(),
  properties: projectTrackerSchema,
  anonymousId: Joi.string(),
});

const projectDeactivatedSegmentValidator = Joi.object({
  event: Joi.string().required().valid(GIVETH_IO_EVENTS.PROJECT_DEACTIVATED),
  analyticsUserId: Joi.string().required(),
  properties: projectTrackerSchema,
  anonymousId: Joi.string(),
});

const projectCancelledSegmentValidator = Joi.object({
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

const sendEmailConfirmationSegmentValidator = Joi.object({
  event: Joi.string()
    .required()
    .valid(GIVETH_IO_EVENTS.SEND_EMAIL_CONFIRMATION),
  properties: sendVerificationEmailSchema,
});

const donationTrackerSchema = Joi.object({
  email: Joi.string().allow(null, ''), // if anonymous
  title: Joi.string().required(),
  firstName: Joi.string().allow(null, ''),
  projectOwnerId: Joi.string().allow(null, ''),
  slug: Joi.string().allow(null, ''),
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
  donationValueUsd: Joi.number().greater(0).allow(null), // incase it fails
  donationValueEth: Joi.number().greater(0).allow(null),
  verified: Joi.boolean().allow(null),
  transakStatus: Joi.string().allow(null),
});

const madeDonationSegmentValidator = Joi.object({
  event: Joi.string().required().valid(GIVETH_IO_EVENTS.MADE_DONATION),
  analyticsUserId: Joi.string().required(),
  properties: donationTrackerSchema,
  anonymousId: Joi.string(),
});

const donationReceivedSegmentValidator = Joi.object({
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

const projectUpdatedDonorSegmentValidator = Joi.object({
  event: Joi.string().required().valid(GIVETH_IO_EVENTS.PROJECT_UPDATED_DONOR),
  analyticsUserId: Joi.string().required(),
  properties: projectUpdatesForDonorSchema,
  anonymousId: Joi.string(),
});

const projectUpdatedOwnerSegmentValidator = Joi.object({
  event: Joi.string().required().valid(GIVETH_IO_EVENTS.PROJECT_UPDATED_OWNER),
  analyticsUserId: Joi.string().required(),
  properties: projectUpdatesForOwnerSchema,
  anonymousId: Joi.string(),
});

const projectCreatedSegmentValidator = Joi.object({
  event: Joi.string().required().valid(GIVETH_IO_EVENTS.PROJECT_CREATED),
  analyticsUserId: Joi.string().required(),
  properties: projectTrackerSchema,
  anonymousId: Joi.string(),
});

const getDonationPriceFailedSegmentValidator = Joi.object({
  event: Joi.string()
    .required()
    .valid(GIVETH_IO_EVENTS.GET_DONATION_PRICE_FAILED),
  analyticsUserId: Joi.string().required(),
  properties: donationTrackerSchema,
  anonymousId: Joi.string(),
});

const verificationFormDraftedSegmentValidator = Joi.object({
  event: Joi.string()
    .required()
    .valid(GIVETH_IO_EVENTS.VERIFICATION_FORM_GOT_DRAFT_BY_ADMIN),
  analyticsUserId: Joi.string().required(),
  properties: projectTrackerSchema,
  anonymousId: Joi.string(),
});

const projectTitleProjectLinkSchema = Joi.object({
  projectTitle: Joi.string().required(),
  projectLink: Joi.string().required(),
});
const projectTitleProjectLinkReasonSchema = Joi.object({
  projectTitle: Joi.string().required(),
  projectLink: Joi.string().required(),
  reason: Joi.string(),
});
const verificationFormReapplyReminderSchema = Joi.object({
  projectTitle: Joi.string().required(),
  projectLink: Joi.string().required(),
  href: Joi.string(),
});
const getDonationPriceFailedMetadataSchema = Joi.object({
  projectTitle: Joi.string().required(),
  projectLink: Joi.string().required(),
  reason: Joi.string().required(),
  txLink: Joi.string().required(),
});
const stakeUnStakeSchema = Joi.object({
  poolName: Joi.string().required(),
  amount: Joi.number().required(),
});
const claimSchema = Joi.object({
  round: Joi.number().required(),
});

const adminMessageSchema = Joi.object({
  linkTitle: Joi.string().required(),
  content: Joi.string().required(),
  instruction: Joi.string().required(),
  href: Joi.string().required(),
});

export const SEGMENT_METADATA_SCHEMA_VALIDATOR: {
  [key: string]: {
    segment: ObjectSchema | null;
    metadata: ObjectSchema | null;
  };
} = {
  draftedProjectSavedValidator: {
    metadata: projectTitleProjectLinkSchema,
    segment: draftedProjectSavedSegmentValidator,
  },
  draftedProjectPublishedValidator: {
    metadata: projectTitleProjectLinkSchema,
    segment: draftedProjectPublishedSegmentValidator,
  },
  projectListed: {
    metadata: projectTitleProjectLinkSchema,
    segment: projectListedSegmentValidator,
  },
  projectUnlisted: {
    metadata: projectTitleProjectLinkSchema,
    segment: projectUnlistedSegmentValidator,
  },
  projectEdited: {
    metadata: projectTitleProjectLinkSchema,
    segment: projectEditedSegmentValidator,
  },
  projectBadgeRevoked: {
    metadata: projectTitleProjectLinkSchema,
    segment: projectBadgeRevokedSegmentValidator,
  },
  projectVerified: {
    metadata: projectTitleProjectLinkSchema,
    segment: projectVerifiedSegmentValidator,
  },
  projectUnverified: {
    metadata: projectTitleProjectLinkSchema,
    segment: projectUnverifiedSegmentValidator,
  },
  projectActivated: {
    metadata: projectTitleProjectLinkSchema,
    segment: projectActivatedSegmentValidator,
  },
  projectDeactivated: {
    metadata: projectTitleProjectLinkReasonSchema,
    segment: projectDeactivatedSegmentValidator,
  },
  projectCancelled: {
    metadata: projectTitleProjectLinkSchema,
    segment: projectCancelledSegmentValidator,
  },
  sendEmailConfirmation: {
    metadata: null,
    segment: sendEmailConfirmationSegmentValidator,
  },
  madeDonation: {
    metadata: projectTitleProjectLinkSchema,
    segment: madeDonationSegmentValidator,
  },
  donationReceived: {
    metadata: projectTitleProjectLinkSchema,
    segment: donationReceivedSegmentValidator,
  },
  projectUpdatedDonor: {
    metadata: projectTitleProjectLinkSchema,
    segment: projectUpdatedDonorSegmentValidator,
  },
  projectUpdatedOwner: {
    metadata: projectTitleProjectLinkSchema,
    segment: projectUpdatedOwnerSegmentValidator,
  },
  projectCreated: {
    metadata: projectTitleProjectLinkSchema,
    segment: projectCreatedSegmentValidator,
  },
  getDonationPriceFailed: {
    metadata: getDonationPriceFailedMetadataSchema,
    segment: getDonationPriceFailedSegmentValidator,
  },
  verificationFormDrafted: {
    metadata: projectTitleProjectLinkSchema,
    segment: verificationFormDraftedSegmentValidator,
  },
  verificationFormSent: {
    metadata: projectTitleProjectLinkSchema,
    segment: null,
  },
  verificationFormRejected: {
    metadata: projectTitleProjectLinkReasonSchema,
    segment: null,
  },
  verificationFormReapplyReminder: {
    metadata: verificationFormReapplyReminderSchema,
    segment: null,
  },
  givFarmClaim: { metadata: null, segment: null },
  givFarmRewardHarvest: { metadata: null, segment: null },
  givFarmStake: { metadata: stakeUnStakeSchema, segment: null },
  givFarmUnStake: { metadata: stakeUnStakeSchema, segment: null },
  givFarmReadyToClaim: { metadata: claimSchema, segment: null },
  adminMessage: { metadata: adminMessageSchema, segment: null },
};

function throwHttpErrorIfJoiValidatorFails(
  validationResult: Joi.ValidationResult<any>,
) {
  throw new Error('Function not implemented.');
}
