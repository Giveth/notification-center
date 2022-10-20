import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  NotificationType,
  SCHEMA_VALIDATORS_NAMES,
} from '../src/entities/notificationType';
import { MICRO_SERVICES, THIRD_PARTY_EMAIL_SERVICES } from '../src/utils/utils';
import { SegmentEvents } from '../src/services/segment/analytics';
import { NOTIFICATION_CATEGORY } from '../src/types/general';

// https://github.com/Giveth/notification-center/issues/6 , https://gist.github.com/MohammadPCh/24434d50bc9ccd9b74905c271ee05482
export const GivethNotificationTypes = {
  EMAIL_NOTIFICATIONS: {
    name: 'Email notifications',
    description: 'Turn on/off all email notifications',
    microService: MICRO_SERVICES.givethio,
    category: 'general',
    schemaValidator: null,
    emailNotifierService: null,
    emailNotificationId: null, // doesn't sent
    pushNotifierService: null,
    title: 'Email notifications',
    content: 'Turn on/off all email notifications', // Missing copy
  },
  DAPP_NOTIFICATIONS: {
    name: 'Dapp notifications',
    description: 'Turn on/off all Dapp notifications',
    microService: MICRO_SERVICES.givethio,
    category: 'general',
    schemaValidator: null,
    emailNotifierService: null,
    emailNotificationId: null, // doesn't sent
    pushNotifierService: null,
    title: 'Dapp notifications',
    content: 'Turn on/off all Dapp notifications', // Missing copy
  },
  // SEGMENT
  INCOMPLETE_PROFILE: {
    name: 'Incomplete profile',
    description: 'Please complete your profile',
    microService: MICRO_SERVICES.givethio,
    category: 'general',
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
  COMPLETE_PROFILE: {
    name: 'The profile has been completed',
    description: 'Thanks for completing your profile',
    microService: MICRO_SERVICES.givethio,
    category: 'general',
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
    microService: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.DRAFTED_PROJECT_SAVED,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
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
    microService: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_LISTED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_LISTED,
    pushNotifierService: null,
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
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UNLISTED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_UNLISTED,
    pushNotifierService: null,
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
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_CANCELLED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_CANCELLED,
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
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_ACTIVATED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_ACTIVATED,
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
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_DEACTIVATED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_DEACTIVATED,
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
    schemaValidator: SCHEMA_VALIDATORS_NAMES.GIV_FARM_CLAIM,
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
    schemaValidator: SCHEMA_VALIDATORS_NAMES.GIV_FARM_REWARD_HARVEST,
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
    schemaValidator: SCHEMA_VALIDATORS_NAMES.GIV_FARM_STAKE,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
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
    schemaValidator: SCHEMA_VALIDATORS_NAMES.GIV_FARM_UN_STAKE,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
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
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_EDITED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project edited',
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
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_BADGE_REVOKED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project badge revoked',
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
  PROJECT_UNVERIFIED: {
    name: 'Project unverified',
    description: 'Project has been unverified',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UNVERIFIED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project unverified',
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

  // DAPP MAILER
  SEND_EMAIL_CONFIRMATION: {
    name: 'Send email confirmation',
    description: 'Project Verification form email confirmation has been sent!',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.SEND_EMAIL_CONFIRMATION,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.DAPP_MAILER,
    emailNotificationId: 'Send email confirmation',
    pushNotifierService: null,
    title: 'Project verification email confirmation',
    content: '', // Missing copy
  },

  MADE_DONATION: {
    name: 'Made donation',
    description: 'User made a donation to a project',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.MADE_DONATION,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Made donation',
    pushNotifierService: null,
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
    schemaValidator: SCHEMA_VALIDATORS_NAMES.DONATION_RECEIVED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Donation received',
    pushNotifierService: null,
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
    name: 'Failed donation',
    description: 'Project has received a donation',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.GET_DONATION_PRICE_FAILED,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
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
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UPDATED_WHO_LIKED,
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
    description:
      'Send notification to owner that the project has added an update',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_EDITED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project updated - owner',
    pushNotifierService: null,
    title: 'Project posted an update',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Your project update was successful.',
      },
    ],
    content: '', // Missing copy
  },
  PROJECT_UPDATED_DONOR: {
    name: 'Project updated - donor',
    description:
      'Send notification to donors that the project has added an updated',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_EDITED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project updated - donor',
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
    schemaValidator:
      SCHEMA_VALIDATORS_NAMES.VERIFICATION_FORM_GOT_DRAFT_BY_ADMIN,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Verification form got draft by admin',
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
