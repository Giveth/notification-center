import { randomBytes } from 'crypto';

export const generateRandomString = (len: number): string => {
  return randomBytes(len).toString('hex');
};

export const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const NETWORK_IDS = {
  MAIN_NET: 1,
  ROPSTEN: 3,
  XDAI: 100,
  BSC: 56,
};

export const MICRO_SERVICES = {
  givethio: 'givethio',
  givEconomyNotificationMicroService: 'giveconomy-notification-service',
  trace: 'trace',
  notifyReward: 'notifyreward',
  qacc: 'qacc',
};

// Need to define trace, blockchain and miscellaneos events
// Segment handles titles as keys
export const GIVETH_IO_EVENTS = {
  WELCOME: 'Welcome',
  INCOMPLETE_PROFILE: 'Profile completion required',
  COMPLETE_PROFILE: 'Profile completed',
  DRAFTED_PROJECT_ACTIVATED: 'Draft published',
  PROJECT_LISTED: 'Project listed',
  PROJECT_UNLISTED: 'Project unlisted',
  PROJECT_EDITED: 'Project edited',
  PROJECT_BADGE_REVOKED: 'Project badge revoked',
  PROJECT_VERIFIED: 'Project verified',
  PROJECT_REJECTED: 'Project rejected',
  PROJECT_UNVERIFIED: 'Project unverified',
  PROJECT_ACTIVATED: 'Project activated',
  PROJECT_DEACTIVATED: 'Project deactivated',
  PROJECT_CANCELLED: 'Project cancelled',
  SEND_EMAIL_CONFIRMATION: 'Send email confirmation',
  MADE_DONATION: 'Made donation',
  DONATION_RECEIVED: 'Donation received',
  PROJECT_UPDATED_DONOR: 'Project updated - donor',
  PROJECT_UPDATED_OWNER: 'Project updated - owner',
  PROJECT_CREATED: 'Project created',
  UPDATED_PROFILE: 'Updated profile',
  GET_DONATION_PRICE_FAILED: 'Get Donation Price Failed',
  VERIFICATION_FORM_GOT_DRAFT_BY_ADMIN: 'Verification form got draft by admin',
};

export const THIRD_PARTY_EMAIL_SERVICES = {
  SEGMENT: 'Segment',
  DAPP_MAILER: 'Giveth Dapp mailer',
};
