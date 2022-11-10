import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  NotificationType,
  SCHEMA_VALIDATORS_NAMES,
} from '../src/entities/notificationType';
import { MICRO_SERVICES, THIRD_PARTY_EMAIL_SERVICES } from '../src/utils/utils';
import { NOTIFICATION_CATEGORY } from '../src/types/general';
import { NOTIFICATION_CATEGORY_GROUPS } from '../src/entities/notificationSetting';
import {SegmentEvents} from "../src/services/segment/segmentAnalyticsSingleton";

// https://github.com/Giveth/notification-center/issues/6 , https://gist.github.com/MohammadPCh/24434d50bc9ccd9b74905c271ee05482
// icons https://gist.github.com/MohammadPCh/31e2b750dd9aa54edb21dcc6e7332efb
export const GivethNotificationTypes = {
  EMAIL_NOTIFICATIONS: {
    name: 'Email notifications',
    description: 'Turn on/off all email notifications',
    microService: MICRO_SERVICES.givethio,
    category: 'general',
    icon:'',
    schemaValidator: null,
    emailNotifierService: null,
    emailNotificationId: null, // doesn't sent
    pushNotifierService: null,
    title: 'Email notifications',
    content: 'Turn on/off all email notifications', // Missing copy
    isGlobal: true,
  },
  DAPP_NOTIFICATIONS: {
    name: 'Dapp notifications',
    description: 'Turn on/off all Dapp notifications',
    microService: MICRO_SERVICES.givethio,
    category: 'general',
    icon:'',
    schemaValidator: null,
    emailNotifierService: null,
    emailNotificationId: null, // doesn't sent
    pushNotifierService: null,
    title: 'Dapp notifications',
    content: 'Turn on/off all Dapp notifications', // Missing copy
    isGlobal: true,
  },
  // SEGMENT
  INCOMPLETE_PROFILE: {
    name: 'Incomplete profile',
    description: 'Please complete your profile',
    microService: MICRO_SERVICES.givethio,
    category: 'general',
    icon:'IconProfile',
    schemaValidator: null,
    emailNotifierService: null,
    emailNotificationId: null, // doesn't sent
    pushNotifierService: null,
    title: 'You need to complete your profile.',
    content: "Don't forget to complete your profile!",
    htmlTemplate: [
      {
        type: 'p',
        content: "Don't forget to complete your profile!",
      },
    ],
  },
  WELCOME: {
    name: 'Welcome',
    description: "Welcome to Giveth! ❤️ So happy you're here.",
    microService: MICRO_SERVICES.givethio,
    category: 'general',
    icon:'',
    schemaValidator: null,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'Welcome!',
    htmlTemplate: [
      {
        type: 'p',
        content: "Welcome to Giveth! ❤️ So happy you're here.",
      },
    ],
    content: "Welcome to Giveth! ❤️ So happy you're here.",
  },
  COMPLETE_PROFILE: {
    name: 'The profile has been completed',
    description: 'Thanks for completing your profile',
    microService: MICRO_SERVICES.givethio,
    category: 'general',
    icon:'IconProfileCompleted',
    schemaValidator: null,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'Profile Completed',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Done! Your profile is complete 🙂',
      },
    ],
    content: 'Done! Your profile is complete 🙂',
  },
  ADMIN_MESSAGE: {
    name: 'Admin message',
    description: 'Admin message',
    microService: MICRO_SERVICES.givethio,
    category: 'general',
    icon:'IconAdminNotif',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.ADMIN_MESSAGE,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'Admin message',
    htmlTemplate: [
      {
        type: 'b',
        content: '$content',
      },
      {
        type: 'p',
        content: '$instruction',
      },
      {
        type: 'a',
        content: '$linkTitle',
        href: '$href',
      },
    ],
    Content: {
      content: '',
      instruction: '',
      linkTitle: '',
      href: '',
    },
  },
  DRAFTED_PROJECT_SAVED: {
    name: 'The project saved as draft',
    description: 'The project saved as draft',
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'IconFile',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.DRAFTED_PROJECT_SAVED,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.PROJECT_STATUS,
    title: 'The project saved as draft',
    content: 'Hurray! Your {project name} project is live 🥳',
    htmlTemplate: [
      {
        type: 'p',
        content: 'The ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' project draft was successfully saved.',
      },
    ],
  },
  DRAFTED_PROJECT_ACTIVATED: {
    name: 'Draft published',
    description: 'Project draft has been published',
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'IconPublish',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.DRAFTED_PROJECT_ACTIVATED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.DRAFTED_PROJECT_ACTIVATED,
    pushNotifierService: null,
    title: 'Project is published',
    content: 'Hurray! Your {project name} project is live 🥳',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Hurray! Your ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' project is live 🥳',
      },
    ],
  },
  PROJECT_LISTED: {
    name: 'Project listed',
    description: 'Project has been listed!',
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'IconListed',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_LISTED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_LISTED,
    pushNotifierService: null,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.PROJECT_STATUS,
    title: 'Project is listed',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Nice! Your ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' project is listed.',
      },
    ],
    content: 'Nice! Your {project name} project is listed.',
  },
  PROJECT_UNLISTED: {
    name: 'Project unlisted',
    description: 'Project has been unlisted!',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'IconUnlisted',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UNLISTED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_UNLISTED,
    pushNotifierService: null,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.PROJECT_STATUS,
    title: 'Project is unlisted',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Your ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' project is no longer visible.',
      },
    ],
    content: 'Your {project name} project is no longer visible.',
  },
  PROJECT_UNLISTED_FOR_DONORS: {
    name: 'Project unlisted - Donors',
    description: 'Project has been unlisted!',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'IconUnlisted',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UNLISTED,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'Project is unlisted',
    htmlTemplate: [
      {
        type: 'p',
        content: 'The ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' that you donated before is no longer visible.',
      },
      {
        type: 'br',
      },
      {
        type: 'p',
        content: '$reason',
      },
    ],
    content:
      'The {project name} that you donated before is no longer visible.\n{reason}',
  },
  PROJECT_UNLISTED_FOR_USERS_WHO_LIKED: {
    name: 'Project unlisted - Users Who Liked',
    description: 'Project has been unlisted!',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'IconUnlisted',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UNLISTED,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.LIKED_BY_YOU_PROJECT_GROUP,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'Project is unlisted',
    htmlTemplate: [
      {
        type: 'p',
        content: 'The ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' that you liked is no longer visible.',
      },
      {
        type: 'br',
      },
      {
        type: 'p',
        content: '$reason',
      },
    ],
    content:
      'The {project name} that you donated before is no longer visible.\n{reason}',
  },
  PROJECT_CANCELLED: {
    name: 'Project cancelled',
    description: 'Project has been cancelled',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'IconDeactivated',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_CANCELLED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_CANCELLED,
    pushNotifierService: null,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.PROJECT_STATUS,
    title: 'Project is cancelled by admin',
    htmlTemplate: [
      {
        type: 'p',
        content: 'The ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' project has been cancelled by admin action.',
      },
      {
        type: 'br',
      },
      {
        type: 'p',
        content: '$reason',
      },
    ],
    content:
      'The {project name} project has been cancelled by admin action.\n{reason}',
  },
  PROJECT_CANCELLED_FOR_DONORS: {
    name: 'Project cancelled - Donors',
    description: 'Project has been cancelled',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'IconDeactivated',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_CANCELLED,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'Project is cancelled by admin',
    htmlTemplate: [
      {
        type: 'p',
        content: 'The ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' project that you donated before has been cancelled',
      },
      {
        type: 'br',
      },
      {
        type: 'p',
        content: '$reason',
      },
    ],
    content:
      'The {project name} project that you donated before has been cancelled.\n{reason}',
  },
  PROJECT_CANCELLED_FOR_USERS_WHO_LIKED: {
    name: 'Project cancelled - Users Who Liked',
    description: 'Project has been cancelled',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'IconDeactivated',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_CANCELLED,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.LIKED_BY_YOU_PROJECT_GROUP,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'Project is cancelled by admin',
    htmlTemplate: [
      {
        type: 'p',
        content: 'The ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' project that you liked has been cancelled.',
      },
      {
        type: 'br',
      },
      {
        type: 'p',
        content: '$reason',
      },
    ],
    content:
      'The {project name} project that you liked has been cancelled.\n{reason}',
  },

  PROJECT_ACTIVATED: {
    name: 'Project activated',
    description: 'Project has been activated!',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'IconActivated',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_ACTIVATED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_ACTIVATED,
    pushNotifierService: null,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.PROJECT_STATUS,
    title: 'Project is activated',
    htmlTemplate: [
      {
        type: 'p',
        content: 'The ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' project is active now.',
      },
    ],
    content: 'The {project name} project is active now.',
  },

  PROJECT_ACTIVATED_FOR_DONORS: {
    name: 'Project activated - Donors',
    description: 'Project has been activated!',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'IconActivated',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_ACTIVATED,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'Project is activated',
    htmlTemplate: [
      {
        type: 'p',
        content: 'The ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' project that you donated before is active now.',
      },
    ],
    content:
      'The {project name} project that you donated before is active now.',
  },
  PROJECT_ACTIVATED_FOR_USERS_WHO_LIKED: {
    name: 'Project activated - Users Who Liked',
    description: 'Project has been activated!',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'IconActivated',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_ACTIVATED,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.LIKED_BY_YOU_PROJECT_GROUP,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'Project is activated',
    htmlTemplate: [
      {
        type: 'p',
        content: 'The ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: '  project that you liked is active now.',
      },
    ],
    content: 'The {project name} project that you liked is active now.',
  },

  PROJECT_DEACTIVATED: {
    name: 'Project deactivated',
    description: 'Project has been deactivated',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'IconDeactivated',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_DEACTIVATED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_DEACTIVATED,
    pushNotifierService: null,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.PROJECT_STATUS,
    title: 'Project is deactivated',
    htmlTemplate: [
      {
        type: 'p',
        content: 'The ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' project is de-actived.',
      },
    ],
    content: 'The {project name} project is de-actived.',
  },
  PROJECT_DEACTIVATED_DONORS: {
    name: 'Project deactivated - Donors',
    description: 'Project has been deactivated',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'IconDeactivated',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_DEACTIVATED,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'Project is deactivated',
    htmlTemplate: [
      {
        type: 'p',
        content: 'The ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' project that you donated before is de-actived.',
      },
      {
        type: 'br',
      },
      {
        type: 'p',
        content: '$reason',
      },
    ],
    content:
      'The {project name} project that you donated before is de-actived.\n{reason}',
  },
  PROJECT_DEACTIVATED_USERS_WHO_LIKED: {
    name: 'Project deactivated - Users Who Liked',
    description: 'Project has been deactivated',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'IconDeactivated',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_DEACTIVATED,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.LIKED_BY_YOU_PROJECT_GROUP,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'Project is deactivated',
    htmlTemplate: [
      {
        type: 'p',
        content: 'The ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' project that you liked is de-actived',
      },
      {
        type: 'br',
      },
      {
        type: 'p',
        content: '$reason',
      },
    ],
    content:
      'The {project name} project that you liked is de-actived.\n{reason}',
  },
  PROJECT_VERIFIED: {
    name: 'Project verified',
    description: 'Project has been verified!',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'IconVerifiedBadge',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_VERIFIED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_VERIFIED,
    pushNotifierService: null,
    title: 'Project verified',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Well done! ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' project is officially verified! 🎉',
      },
    ],
    content: 'Well done! {project name} project is officially verified! 🎉',
  },
  PROJECT_VERIFIED_DONORS: {
    name: 'Project verified - Donors',
    description: 'Project has been verified!',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'IconVerifiedBadge',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_VERIFIED,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'Project verified',
    htmlTemplate: [
      {
        type: 'p',
        content: 'The ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' that you donated before has received verified badge!',
      },
    ],
    content:
      'The {project name} that you donated before has received verified badge!',
  },
  PROJECT_VERIFIED_USERS_WHO_LIKED: {
    name: 'Project verified - Users Who Liked',
    description: 'Project has been verified!',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'IconVerifiedBadge',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_VERIFIED,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.LIKED_BY_YOU_PROJECT_GROUP,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'Project verified',
    htmlTemplate: [
      {
        type: 'p',
        content: 'The ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' that you liked has received verified badge!',
      },
    ],
    content: 'The {project name} that you liked has received verified badge!',
  },
  VERIFICATION_FORM_SENT: {
    name: 'Form sent (Under review)',
    description: 'Form sent (Under review)',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'IconFormSubmit',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.VERIFICATION_FORM_SENT,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'Form sent (Under review)',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Hang tight! The ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' project is currently under review.',
      },
    ],
    content:
      'Hang tight! The {project name} project is currently under review.',
  },
  VERIFICATION_FORM_REJECTED: {
    name: 'Form rejected',
    description: 'Form rejected',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'IconRejected',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.VERIFICATION_FORM_REJECTED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_REJECTED,
    pushNotifierService: null,
    title: 'Form rejected',
    htmlTemplate: [
      {
        type: 'p',
        content: "We can't verify the ",
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: '.',
      },
      {
        type: 'br',
      },
      {
        type: 'p',
        content: '$reason',
      },
    ],
    content: "We can't verify the {project name}. {reason}.\n{instruction}",
  },
  REAPPLY_VERIFICATION_FORM_REMINDER: {
    name: 'Re-apply for verification reminder',
    description: 'Re-apply for verification reminder',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'IconRejected',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.VERIFICATION_FORM_Reapply_Reminder,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'Re-apply for verification reminder',
    htmlTemplate: [
      {
        type: 'p',
        content: 'The verification process for ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' project is still pending.',
      },
      {
        type: 'br',
      },
      {
        type: 'a',
        content: 'click here',
        href: '$href',
      },
      {
        type: 'p',
        content: ' to continue.',
      },
    ],
    content:
      'The verification process for {project name} project is still pending. \n[Click here] to continue.}',
  },
  CLAIM_REWARD: {
    name: 'Claim',
    description: 'Claim reward',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.GIV_ECONOMY,
    icon:'IconClaim',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.GIV_FARM_CLAIM,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.REWARDS,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'Claim',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Pssst! your rewards are ready to claim',
      },
      {
        type: 'br',
      },
      {
        type: 'p',
        content: 'Checkout GIVeconomy to claim your rewards.',
      },
    ],
    content:
      'Pssst! your rewards are ready to claim 😉\nCheckout GIVeconomy to claim your rewards.',
  },
  REWARDS_HARVESTED: {
    name: 'Rewards harvested',
    description: 'Rewards harvested',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.GIV_ECONOMY,
    icon:'IconEmptyCircle',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.GIV_FARM_REWARD_HARVEST,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.REWARDS,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'Rewards harvested',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Rewards harvest complete.',
      },
    ],
    content: 'Rewards harvest complete.',
  },
  STAKE: {
    name: 'Stake',
    description: 'Stake',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.GIV_ECONOMY,
    icon:'IconStake',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.GIV_FARM_STAKE,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.STAKING,
    title: 'Stake',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Staking ',
      },
      {
        type: 'b',
        content: '$amount',
      },
      {
        type: 'p',
        content: ' of ',
      },
      {
        type: 'a',
        content: '$poolName',
        href: '/givfarm',
      },
      {
        type: 'p',
        content: ' was successful.',
      },
    ],
    content: 'Staking {amount} of {poolName} was successful.',
  },
  UN_STAKE: {
    name: 'UnStake',
    description: 'UnStake',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.GIV_ECONOMY,
    icon:'IconUnstake',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.GIV_FARM_UN_STAKE,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.STAKING,
    title: 'UnStake',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Unstaking ',
      },
      {
        type: 'b',
        content: '$amount',
      },
      {
        type: 'p',
        content: ' of ',
      },
      {
        type: 'a',
        content: '$poolName',
        href: '/givfarm',
      },
      {
        type: 'p',
        content: ' was successful.',
      },
    ],
    content: 'Unstaking {amount} of {poolname} was successful.',
  },
  GIV_BACKS_ARE_READY_TO_CLAIM: {
    name: 'GIVbacks are ready to claim',
    description: 'GIVbacks are ready to claim',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.GIV_ECONOMY,
    icon:'IconUnstake',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.GIV_FARM_READY_TO_CLAIM,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_REJECTED,
    pushNotifierService: null,
    title: 'GIVbacks are ready to claim',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Your GIVbacks for round ',
      },
      {
        type: 'b',
        content: '$round',
      },
      {
        type: 'p',
        content: ' are ready to claim! ',
      },
      { type: 'br' },
      {
        type: 'a',
        content: 'Click here',
        href: '/givbacks',
      },
      {
        type: 'p',
        content: ' to take a shortcut.',
      },
    ],
    content:
      'Your GIVbacks for round {round number} are ready to claim! \n{Click here} to take a shortcut.',
  },
  PROJECT_EDITED: {
    name: 'Project edited',
    description: 'Project has been edited',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_EDITED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_EDITED,
    pushNotifierService: null,
    title: 'Project edited',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Your Project ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' has been edited',
      },
    ],
    content: 'You project {project name} has been edited',
  },
  PROJECT_BADGE_REVOKED: {
    name: 'Project badge revoked',
    description: 'Project verified badge revoked',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_BADGE_REVOKED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_BADGE_REVOKED,
    pushNotifierService: null,
    title: 'Project verification revoked',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Your Project ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' is not verified anymore',
      },
    ],
    content: 'You project {project name} is not verified anymore',
  },
  PROJECT_BADGE_REVOKE_REMINDER: {
    name: 'Project badge revoke reminder',
    description: 'Project verified badge revoke reminder',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_BADGE_REVOKE_REMINDER,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_BADGE_REVOKE_REMINDER,
    pushNotifierService: null,
    title: 'Project verification revoke reminder',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Your Project ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        //TODO Carlos please check this copy with existing autopilot emails
        content: ' would lose verification badge soon',
      },
    ],
    content: 'You project {project name} would lose verification badge soon',
  },
  PROJECT_BADGE_REVOKE_WARNING: {
    name: 'Project badge revoke warning',
    description: 'Project badge revoke warning',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_BADGE_REVOKE_WARNING,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_BADGE_REVOKE_WARNING,
    pushNotifierService: null,
    title: 'Project verification revoke warning',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Your Project ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        //TODO Carlos please check this copy with existing autopilot emails
        content: ' would lose verification badge soon',
      },
    ],
    content: 'You project {project name} would lose verification badge soon',
  },
  PROJECT_BADGE_REVOKE_LAST_WARNING: {
    name: 'Project badge revoke last warning',
    description: 'Project badge revoke last warning',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_BADGE_REVOKE_LAST_WARNING,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_BADGE_REVOKE_LAST_WARNING,
    pushNotifierService: null,
    title: 'Project badge revoke last warning',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Your Project ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        //TODO Carlos please check this copy with existing autopilot emails
        content: ' would lose verification badge soon. this is last warning',
      },
    ],
    content: 'You project {project name} would lose verification badge soon, this is last warning.',
  },
  PROJECT_BADGE_UP_FOR_REVOKING: {
    name: 'Project badge up for revoking',
    description: 'Project badge up for revoking',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_BADGE_UP_FOR_REVOKING,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_BADGE_UP_FOR_REVOKING,
    pushNotifierService: null,
    title: 'Project badge up for revoking',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Your Project ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        //TODO Carlos please check this copy with existing autopilot emails
        content: ' would lose verification badge soon',
      },
    ],
    content: 'You project {project name} would lose verification badge soon',
  },
  PROJECT_UNVERIFIED: {
    name: 'Project unverified',
    description: 'Project has been unverified',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UNVERIFIED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_UNVERIFIED,
    pushNotifierService: null,
    title: 'Project verification removed',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Your Project ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' is not verified anymore',
      },
    ],
    content: 'You project {project name} is not verified anymore',
  },
  MADE_DONATION: {
    name: 'Made donation',
    description: 'User made a donation to a project',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'IconDonation',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.MADE_DONATION,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.MADE_DONATION,
    pushNotifierService: null,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.DONATIONS,
    title: 'Donations is successfull',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Congrats! Your donation to ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' was successful',
      },
      { type: 'br' },
      {
        type: 'p',
        content: "You're a Giveth Donor now :)",
      },
    ],
    content:
      "congrats! Your donation to {project name} was successful.\nYou're a Giveth Donor now :)",
  },
  DONATION_RECEIVED: {
    name: 'Donation received',
    description: 'Project has received a donation',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'IconDonation',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.DONATION_RECEIVED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.DONATION_RECEIVED,
    pushNotifierService: null,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.DONATIONS,
    title: 'Project received a donation',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Hurray! Your project ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' received a donation 🥳',
      },
    ],
    content: 'Hurray! Your project {project name} received a donation 🥳',
  },
  DONATION_FAILED: {
    name: 'Donation get price failed',
    description: 'Project has received a donation',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.GET_DONATION_PRICE_FAILED,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.DONATIONS,
    title: 'Failed donation',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Your donation to ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' was not successful.',
      },
      {
        type: 'p',
        content: '$reason',
      },
      { type: 'br' },
      {
        type: 'a',
        content: 'transaction link',
        href: '$txLink',
      },
    ],
    content:
      'Your donation to {project name} was not successful. {reason} \n{tx link}',
  },
  NEW_PROJECT_UPDATE: {
    name: 'Project update',
    description: 'Project update',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.DISCUSSION,
    icon:'IconFile',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UPDATED_OWNER,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'Project update',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Your project update was successful.',
      },
    ],
    content: 'Your project update was successful.',
  },
  NEW_PROJECT_UPDATE_DONORS: {
    name: 'Project update - Donors',
    description: 'Project update - Donors',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.DISCUSSION,
    icon:'IconFile',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UPDATED_DONOR,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'Project update - Donors',
    htmlTemplate: [
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' that you donated before posted an update.',
      },
    ],
    content: '{Project name} that you donated before posted an update.',
  },
  NEW_PROJECT_UPDATE_USERS_WHO_LIKED: {
    name: 'Project update - Users Who Liked',
    description: 'Project update - Users Who Liked',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.DISCUSSION,
    icon:'IconFile',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UPDATED_WHO_LIKED,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.LIKED_BY_YOU_PROJECT_GROUP,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'Project update - Users Who Liked',
    htmlTemplate: [
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: 'that you liked before posted an update.',
      },
    ],
    content: '{Project name} that you liked before posted an update.',
  },

  PROJECT_UPDATED_OWNER: {
    name: 'Project updated - owner',
    description: 'You Posted an update on your project',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_EDITED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_UPDATED_OWNER,
    pushNotifierService: null,
    title: 'Project posted an update',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Your project update was successful.',
      },
    ],
    content: 'Your project update was successful.', // Missing copy
  },
  PROJECT_UPDATED_DONOR: {
    name: 'Project updated - donor',
    description:
      'Send notification to donors that the project has added an updated',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_EDITED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_UPDATED_DONOR,
    pushNotifierService: null,
    title: 'Project posted an update',
    htmlTemplate: [
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' that you donated before posted an update.',
      },
    ],
    content: '{Project name} that you donated before posted an update.',
  },

  VERIFICATION_FORM_GOT_DRAFT_BY_ADMIN: {
    name: 'Verification form got draft by admin',
    description: 'Verification form got drafted by admin',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'',
    schemaValidator:
      SCHEMA_VALIDATORS_NAMES.VERIFICATION_FORM_GOT_DRAFT_BY_ADMIN,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.VERIFICATION_FORM_GOT_DRAFT_BY_ADMIN,
    pushNotifierService: null,
    title: 'Project verification under review',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Your project ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' got draft by admin',
      },
    ],
    content: 'Your project {project name} got draft by admin',
  },
  PROJECT_RECEIVED_LIKE: {
    name: 'project liked',
    description: 'project liked',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'IconHeartFilled',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_RECEIVED_LIKE,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'project liked',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Nice! Your project ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' received a like',
      },
    ],
    content: 'Nice! Your project {project name} received a like',
  },
  NEW_PROJECT_UPDATE_FOR_USERS_WHO_LIKED: {
    name: 'Project updates',
    description: 'When your liked project has an update',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UPDATED_WHO_LIKED,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.LIKED_BY_YOU_PROJECT_GROUP,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project updated - Users who liked',
    pushNotifierService: null,
    title: 'Project updated - Users Who Liked',
    htmlTemplate: [
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: 'that you liked before posted an update.',
      },
    ],
    content: '{Project name} that you liked before posted an update.',
  },
  YOU_BOOSTED: {
    name: 'You boosted',
    description: 'User boosted a project',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.GIV_POWER,
    icon:'',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.USER_BOOSTED,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.SELF_BOOSTING_STATUS,
    title: 'You boosted',
    htmlTemplate: [
      {
        type: 'p',
        content: 'You boosted ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' with ',
      },
      {
        type: 'p',
        content: '$boostedAmount',
      },
      {
        type: 'p',
        content: ' of GIVpower.',
      },
    ],
    content: 'You boosted {project name} with {boosted amount} of GIVpower.',
  },
  YOU_CHANGED_BOOSTED_ALLOCATION: {
    name: 'You changed the allocation',
    description: 'User changed boosted allocation',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.GIV_POWER,
    icon:'',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.USER_CHANGED_BOOSTED_ALLOCATION,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.SELF_BOOSTING_STATUS,
    title: 'You changed the allocation',
    htmlTemplate: [
      {
        type: 'p',
        content: 'You successfully changed your boosting allocation.',
      },
    ],
    content: 'You successfully changed your boosting allocation.',
  },
  YOUR_PROJECT_HAS_BEEN_BOOSTED: {
    name: 'Your project has been boosted.',
    description: 'Project has received a boosting',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.GIV_POWER,
    icon:'',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_HAS_BEEN_BOOSTED,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.PROJECT_BOOSTING_STATUS,
    title: 'Your project has been boosted.',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Your project ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' has been boosted by ',
      },
      {
        type: 'p',
        content: '$userName',
      },
    ],
    content: 'Your project {project name} has been boosted by {user name}',
  },
  YOU_LOCKED_GIVPOWER: {
    name: 'You locked {amount} & recieved {amount} GIVpower',
    description: 'User locked GIVpower',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.GIV_POWER,
    icon:'',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.USER_LOCKED_GIVPOWER,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.GIVPOWER_ALLOCATIONS,
    title: 'You locked {amount} & recieved {amount} GIVpower',
    htmlTemplate: [
      {
        type: 'p',
        content: 'You locked ',
      },
      {
        type: 'p',
        content: '$amount',
      },
      {
        type: 'p',
        content: ' & recieved ',
      },
      {
        type: 'p',
        content: '$amount',
      },
      {
        type: 'p',
        content: ' GIVpower',
      },
    ],
    content: 'You locked {amount} & recieved {amount} GIVpower',
  },
  YOU_UNLOCKED_GIVPOWER: {
    name: '{amount} unlocked.',
    description: 'User unlocked GIVpower',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.GIV_POWER,
    icon:'',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.USER_UNLOCKED_GIVPOWER,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.GIVPOWER_ALLOCATIONS,
    title: '{amount} unlocked.',
    htmlTemplate: [
      {
        type: 'p',
        content: '$amount',
      },
      {
        type: 'p',
        content: ' unlocked.',
      },
    ],
    content: '{amount} unlocked.',
  },
  RE_LOCKED_AUTOMATICALLY: {
    name: '{amount} re-locked automatically',
    description: 'User unlocked GIVpower',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.GIV_POWER,
    icon:'',
    schemaValidator:
      SCHEMA_VALIDATORS_NAMES.USER_GIVPOWER_RELOCKED_AUTOMATICALLY,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.GIVPOWER_ALLOCATIONS,
    title: '{amount} re-locked automatically',
    htmlTemplate: [
      {
        type: 'p',
        content: '$amount',
      },
      {
        type: 'p',
        content: ' re-locked automatically.',
      },
    ],
    content: '{amount} re-locked automatically',
  },
  GIVPOWER_ALLOCATIONS_GROUP: {
    name: 'GIVpower Allocations',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: null,
    emailNotifierService: null,
    emailNotificationId: null, // doesn't sent
    pushNotifierService: null,
    isGroupParent: true,
    content:
      'Shows your locked, unlocked, received amount of GIVpower and the amount automatically relocked.',
    htmlTemplate: [
      {
        type: 'p',
        content:
          'Shows your locked, unlocked, received amount of GIVpower and the amount automatically relocked.',
      },
    ],
    category: NOTIFICATION_CATEGORY.GIV_POWER,
    icon:'',
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.GIVPOWER_ALLOCATIONS,
    title: 'GIVpower Allocations',
    description:
      'Shows your locked, unlocked, received amount of GIVpower and the amount automatically relocked.',
  },
  GIVPOWER_SELF_BOOSTING_GROUP: {
    name: 'Your boost status',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: null,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    isGroupParent: true,
    content:
      'Shows when you boost a project, change the allocation of GIVpower.',
    htmlTemplate: [
      {
        type: 'p',
        content:
          'Shows when you boost a project, change the allocation of GIVpower.',
      },
    ],
    category: NOTIFICATION_CATEGORY.GIV_POWER,
    icon:'',
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.SELF_BOOSTING_STATUS,
    title: 'Your boost status',
    description:
      'Shows when you boost a project, change the allocation of GIVpower.',
  },
  GIVPOWER_PROJECT_BOOSTING_GROUP: {
    name: 'Project boost status',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: null,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    isGroupParent: true,
    content: 'Show when your project receives a boost',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Show when your project receives a boost',
      },
    ],
    category: NOTIFICATION_CATEGORY.GIV_POWER,
    icon:'',
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.PROJECT_BOOSTING_STATUS,
    title: 'Project boost status',
    description: 'Show when your project receives a boost',
  },
  PROJECT_STATUS_GROUP: {
    name: 'Project status',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: null,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    isGroupParent: true,
    content:
      'When Project has been listed, unlisted, cancelled, activated or deactivated.',
    htmlTemplate: [
      {
        type: 'p',
        content:
          'When Project has been listed, unlisted, cancelled, activated or deactivated.',
      },
    ],
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'',
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.PROJECT_STATUS,
    title: 'Project status',
    description:
      'When Project has been listed, unlisted, cancelled, activated or deactivated.',
  },
  DONATIONS_GROUP: {
    name: 'Donations',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: null,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    isGroupParent: true,
    content:
      'When someone donates to your project, when you donate to a project, donation success and failure.',
    htmlTemplate: [
      {
        type: 'p',
        content:
          'When someone donates to your project, when you donate to a project, donation success and failure.',
      },
    ],
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'',
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.DONATIONS,
    title: 'Donations',
    description:
      'When someone donates to your project, when you donate to a project, donation success and failure.',
  },
  STAKES_GROUP: {
    name: 'Stakes',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: null,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    isGroupParent: true,
    content: 'Show when you stake or unstake on the GIVfarm',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Show when you stake or unstake on the GIVfarm',
      },
    ],
    category: NOTIFICATION_CATEGORY.GIV_ECONOMY,
    icon:'',
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.STAKING,
    title: 'Stakes',
    description: 'Show when you stake or unstake on the GIVfarm',
  },
  REWARDS_GROUP: {
    name: 'Rewards',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: null,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    isGroupParent: true,
    content: 'Shows when you have claimable rewards and you harvested rewards.',
    htmlTemplate: [
      {
        type: 'p',
        content:
          'Shows when you have claimable rewards and you harvested rewards.',
      },
    ],
    category: NOTIFICATION_CATEGORY.GIV_ECONOMY,
    icon:'',
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.REWARDS,
    title: 'Rewards',
    description:
      'Shows when you have claimable rewards and you harvested rewards.',
  },
  LIKED_BY_YOU_PROJECT_GROUP: {
    name: 'Project status',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: null,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    isGroupParent: true,
    content:
      'When your liked Project has been listed, unlisted, cancelled, activated or deactivated',
    htmlTemplate: [
      {
        type: 'p',
        content:
          'When your liked Project has been listed, unlisted, cancelled, activated or deactivated',
      },
    ],
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon:'',
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.LIKED_BY_YOU_PROJECT_GROUP,
    title: 'Project Liked',
    description:
      'When your liked Project has been listed, unlisted, cancelled, activated or deactivated',
  },
};

export class seedNotificationType1660716115917 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Giveth IO Notifications
    await queryRunner.manager.save(
      NotificationType,
      Object.values(GivethNotificationTypes),
    );

    // Trace notifications

    // Other notifications
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM notification`);
    await queryRunner.query(`DELETE FROM notification_type`);
  }
}
