import Joi, { ObjectSchema } from 'joi';
import { errorMessages } from '../errorMessages';
import { GIVETH_IO_EVENTS, NETWORK_IDS } from '../utils';

// Microservice should send the requested json, the notification service
// does not care about calculating values, only validating fields
const filterDateRegex = new RegExp('^[0-9]{8} [0-9]{2}:[0-9]{2}:[0-9]{2}$');
const ethereumWalletAddressRegex = /^0x[a-fA-F0-9]{40}$/;
const solanaTxRegex = /^[A-Za-z0-9]{86,88}$/;
const solanaWalletAddressRegex = /^[A-Za-z0-9]{43,44}$/;
const txHashRegex = /^0x[a-fA-F0-9]{64}$/;
const tokenSymbolRegex = /^[a-zA-Z0-9]{3,10}$/;

export const validateWithJoiSchema = (data: any, schema: ObjectSchema) => {
  const validationResult = schema.validate(data);
  throwHttpErrorIfJoiValidatorFails(validationResult);
};

// Using Analytics structure for all notifications

// Define all joi schemas here
const projectRelatedTrackerSchema = Joi.object({
  // seems we have to different schemas, not good TODO CHANGE ON IMPACT GRAPH
  email: Joi.string().allow(null).allow(''),
  title: Joi.string().required(),
  firstName: Joi.string().allow(null, ''),
  lastName: Joi.string().allow(null, ''),
  userId: Joi.number(),
  OwnerId: Joi.number(),
  slug: Joi.string().required(),
  projectLink: Joi.string().allow(null).allow(''),

  // it's for project updates
  update: Joi.string().allow(null, ''),
});

const boostedSchema = Joi.object({
  projectTitle: Joi.string().required(),
  projectLink: Joi.string().required(),
  boostedAmount: Joi.number()?.greater(0).required(),
});

const projectBoostedSchema = Joi.object({
  projectTitle: Joi.string().required(),
  projectLink: Joi.string().required(),
  userName: Joi.string().required(),
});

const givPowerLockedSchema = Joi.object({
  contractName: Joi.string().required(),
  amount: Joi.string().required(),
  round: Joi.number()?.greater(0).required(),
  transactionHash: Joi.string().required(),
  network: Joi.number().required(),
});
const givPowerUnLockedSchema = Joi.object({
  contractName: Joi.string().required(),
  amount: Joi.string().required(),
  round: Joi.number()?.greater(0).required(),
  transactionHash: Joi.string().required(),
  network: Joi.number().required(),
});

const donationTrackerSchema = Joi.object({
  email: Joi.string().allow(null).allow(''), // if anonymous
  title: Joi.string().required(),
  firstName: Joi.string().allow(null, ''),
  lastName: Joi.string().allow(null, ''),
  userId: Joi.number(),
  projectOwnerId: Joi.string().allow(null, ''),
  slug: Joi.string().allow(null, ''),
  projectLink: Joi.string().allow(null, ''),
  amount: Joi.number()?.greater(0).required(),
  token: Joi.string().allow(null, ''),
  transactionId: Joi.alternatives().try(
    Joi.string().required().pattern(txHashRegex, 'EVM transaction IDs'),
    Joi.string().required().pattern(solanaTxRegex, 'Solana Transaction ID'),
  ),
  transactionNetworkId: Joi.number().required(),
  transactionLink: Joi.string().allow(null, ''),
  currency: Joi.string().required(),
  createdAt: Joi.string(),
  toWalletAddress: Joi.alternatives().try(
    Joi.string().required().pattern(ethereumWalletAddressRegex),
    Joi.string().required().pattern(solanaWalletAddressRegex),
  ),
  fromWalletAddress: Joi.alternatives().try(
    Joi.string().required().pattern(ethereumWalletAddressRegex),
    Joi.string().required().pattern(solanaWalletAddressRegex),
  ),
  donationValueUsd: Joi.number().greater(0).allow(null), // in case it fails
  donationValueEth: Joi.number().greater(0).allow(null),
  verified: Joi.boolean().allow(null),
  transakStatus: Joi.string().allow(null),
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
  contractName: Joi.string().required(),
  transactionHash: Joi.string().required(),
  network: Joi.number().required(),
  amount: Joi.string().required(),
});
const claimSchema = Joi.object({
  round: Joi.number().required(),
});

const adminMessageSchema = Joi.object({
  linkTitle: Joi.string().required(),
  content: Joi.string().required(),
  instruction: Joi.string(),
  href: Joi.string(),
});

const rawHtmlBroadcastSchema = Joi.object({
  html: Joi.string().required(),
});
const givBackReadyClaimSchema = Joi.object({
  contractName: Joi.string().required(),
  transactionHash: Joi.string().required(),
  network: Joi.number().required(),
  amount: Joi.string().required(),
});

export const SEGMENT_METADATA_SCHEMA_VALIDATOR: {
  [key: string]: {
    segment: ObjectSchema | null;
    metadata: ObjectSchema | null;
  };
} = {
  draftedProjectSavedValidator: {
    metadata: projectTitleProjectLinkSchema,
    segment: projectRelatedTrackerSchema,
  },
  draftedProjectPublishedValidator: {
    metadata: projectTitleProjectLinkSchema,
    segment: projectRelatedTrackerSchema,
  },
  projectListed: {
    metadata: projectTitleProjectLinkSchema,
    segment: projectRelatedTrackerSchema,
  },
  projectUnlisted: {
    metadata: projectTitleProjectLinkSchema,
    segment: projectRelatedTrackerSchema,
  },
  projectEdited: {
    metadata: projectTitleProjectLinkSchema,
    segment: projectRelatedTrackerSchema,
  },
  projectBadgeRevoked: {
    metadata: projectTitleProjectLinkSchema,
    segment: projectRelatedTrackerSchema,
  },
  projectBadgeRevokeReminder: {
    metadata: projectTitleProjectLinkSchema,
    segment: projectRelatedTrackerSchema,
  },
  projectBadgeRevokeWarning: {
    metadata: projectTitleProjectLinkSchema,
    segment: projectRelatedTrackerSchema,
  },
  projectBadgeRevokeLastWarning: {
    metadata: projectTitleProjectLinkSchema,
    segment: projectRelatedTrackerSchema,
  },
  projectBadgeUpForRevoking: {
    metadata: projectTitleProjectLinkSchema,
    segment: projectRelatedTrackerSchema,
  },
  projectVerified: {
    metadata: projectTitleProjectLinkSchema,
    segment: projectRelatedTrackerSchema,
  },
  projectUnverified: {
    metadata: projectTitleProjectLinkSchema,
    segment: projectRelatedTrackerSchema,
  },
  projectUnverifiedWhoSupported: {
    metadata: projectTitleProjectLinkSchema,
    segment: null,
  },
  projectActivated: {
    metadata: projectTitleProjectLinkSchema,
    segment: projectRelatedTrackerSchema,
  },
  projectDeactivated: {
    metadata: projectTitleProjectLinkReasonSchema,
    segment: projectRelatedTrackerSchema,
  },
  projectCancelled: {
    metadata: projectTitleProjectLinkSchema,
    segment: projectRelatedTrackerSchema,
  },
  projectBoosted: {
    metadata: projectTitleProjectLinkSchema,
    segment: null,
  },
  sendEmailConfirmation: {
    metadata: null,
    segment: projectRelatedTrackerSchema,
  },
  madeDonation: {
    metadata: projectTitleProjectLinkSchema,
    segment: donationTrackerSchema,
  },
  donationReceived: {
    metadata: projectTitleProjectLinkSchema,
    segment: donationTrackerSchema,
  },
  projectUpdatedOwner: {
    metadata: projectTitleProjectLinkSchema,
    segment: projectRelatedTrackerSchema,
  },
  projectCreated: {
    metadata: projectTitleProjectLinkSchema,
    segment: null,
  },
  getDonationPriceFailed: {
    metadata: getDonationPriceFailedMetadataSchema,
    segment: projectRelatedTrackerSchema,
  },
  verificationFormDrafted: {
    metadata: projectTitleProjectLinkSchema,
    segment: projectRelatedTrackerSchema,
  },
  verificationFormSent: {
    metadata: projectTitleProjectLinkSchema,
    segment: null,
  },
  projectReceivedLike: {
    metadata: projectTitleProjectLinkSchema,
    segment: null,
  },
  projectUpdateAddedWhoSupported: {
    metadata: projectTitleProjectLinkSchema,
    segment: null,
  },
  projectUpdateAddedOwner: {
    metadata: projectTitleProjectLinkSchema,
    segment: null,
  },
  verificationFormRejected: {
    metadata: projectTitleProjectLinkReasonSchema,
    segment: projectRelatedTrackerSchema,
  },
  verificationFormReapplyReminder: {
    metadata: verificationFormReapplyReminderSchema,
    segment: null,
  },
  givFarmClaim: { metadata: null, segment: null },
  givFarmReadyToClaim: { metadata: claimSchema, segment: null },
  adminMessage: { metadata: adminMessageSchema, segment: null },
  rawHtmlBroadcast: { metadata: rawHtmlBroadcastSchema, segment: null },
  givPowerUserBoosted: { metadata: boostedSchema, segment: null },
  givPowerUserChangedBoostedAllocation: { metadata: null, segment: null },
  givPowerProjectHasBeenBoosted: {
    metadata: projectBoostedSchema,
    segment: null,
  },
  givPowerUserLockedGivPower: { metadata: givPowerLockedSchema, segment: null },
  givPowerUserUnlockedGivPower: {
    metadata: givPowerUnLockedSchema,
    segment: null,
  },
  givPowerUserGivPowerRelockedAutoMatically: {
    metadata: givPowerLockedSchema,
    segment: null,
  },
  givBackReadyToClaim: {
    metadata: givBackReadyClaimSchema,
    segment: null,
  },
  projectHasRisenInTheRank: {
    metadata: projectTitleProjectLinkSchema,
    segment: null,
  },
  projectHasANewRank: {
    metadata: projectTitleProjectLinkSchema,
    segment: null,
  },
  yourProjectGotARank: {
    metadata: projectTitleProjectLinkSchema,
    segment: null,
  },
};

function throwHttpErrorIfJoiValidatorFails(
  validationResult: Joi.ValidationResult<any>,
) {
  throw new Error('Function not implemented.');
}
