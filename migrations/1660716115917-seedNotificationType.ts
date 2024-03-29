import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  NotificationType,
  SCHEMA_VALIDATORS_NAMES,
} from '../src/entities/notificationType';
import { MICRO_SERVICES, THIRD_PARTY_EMAIL_SERVICES } from '../src/utils/utils';
import {
  NOTIFICATION_CATEGORY,
  NOTIFICATION_TYPE_NAMES,
} from '../src/types/general';
import { NOTIFICATION_CATEGORY_GROUPS } from '../src/entities/notificationSetting';
import { SegmentEvents } from '../src/services/segment/segmentAnalyticsSingleton';

// https://github.com/Giveth/notification-center/issues/6 , https://gist.github.com/MohammadPCh/24434d50bc9ccd9b74905c271ee05482
// icons https://gist.github.com/MohammadPCh/31e2b750dd9aa54edb21dcc6e7332efb
export const GivethNotificationTypes = {
  EMAIL_NOTIFICATIONS: {
    name: NOTIFICATION_TYPE_NAMES.EMAIL_NOTIFICATION,
    description: 'Turn on/off all email notifications',
    microService: MICRO_SERVICES.givethio,
    category: 'general',
    icon: '',
    schemaValidator: null,
    emailNotifierService: null,
    emailNotificationId: null, // doesn't sent
    pushNotifierService: null,
    title: 'Email notifications',
    content: 'Turn on/off all email notifications', // Missing copy
    isGlobal: true,
  },
  DAPP_NOTIFICATIONS: {
    name: NOTIFICATION_TYPE_NAMES.DAPP_NOTIFICATIONS,
    description: 'Turn on/off all Dapp notifications',
    microService: MICRO_SERVICES.givethio,
    category: 'general',
    icon: '',
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
    name: NOTIFICATION_TYPE_NAMES.INCOMPLETE_PROFILE,
    description: 'Please complete your profile',
    microService: MICRO_SERVICES.givethio,
    category: 'general',
    icon: 'IconProfile',
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
    name: NOTIFICATION_TYPE_NAMES.WELCOME,
    description: "Welcome to Giveth! ❤️ So happy you're here.",
    microService: MICRO_SERVICES.givethio,
    category: 'general',
    icon: '',
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
    name: NOTIFICATION_TYPE_NAMES.PROFILE_HAS_BEEN_COMPLETED,
    description: 'Thanks for completing your profile',
    microService: MICRO_SERVICES.givethio,
    category: 'general',
    icon: 'IconProfileCompleted',
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
    name: NOTIFICATION_TYPE_NAMES.ADMIN_MESSAGE,
    description: 'Admin message',
    microService: MICRO_SERVICES.givethio,
    category: 'general',
    icon: 'IconAdminNotif',
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
    name: NOTIFICATION_TYPE_NAMES.DRAFT_PROJECT_HAS_BEEN_SAVED_OWNER,
    description: 'The project saved as draft',
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: 'IconFile',
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
    name: NOTIFICATION_TYPE_NAMES.DRAFT_PUBLISHED_OWNER,
    title: 'Project published',
    description: 'Notify me when my project has been published.',
    showOnSettingPage: true,
    isEmailEditable: true,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: 'IconPublish',
    microService: MICRO_SERVICES.givethio,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.DRAFTED_PROJECT_ACTIVATED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.DRAFTED_PROJECT_ACTIVATED,
    pushNotifierService: null,
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
    name: NOTIFICATION_TYPE_NAMES.PROJECT_LISTED_OWNER,
    description: 'Project has been listed!',
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: 'IconListed',
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
        content: 'Congrats! ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' is now listed on the Giveth projects page.',
      },
    ],
    content:
      'Congrats! {project name} is now listed on the Giveth projects page',
  },
  PROJECT_LISTED_FOR_SUPPORTERS: {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_LISTED_SUPPORTED,
    description: 'Project has been listed!',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.SUPPORTED_PROJECTS,
    icon: 'Iconlisted',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_LISTED,
    categoryGroup:
      NOTIFICATION_CATEGORY_GROUPS.SUPPORTED_BY_YOU_PROJECT_STATUS_CHANGE_GROUP,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'Project is listed',
    htmlTemplate: [
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' is now listed on the Giveth projects page.',
      },
    ],
    content: '{project name} is now listed on the Giveth projects page',
  },
  PROJECT_UNLISTED: {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_UNLISTED_OWNER,
    description: 'Project has been unlisted!',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: 'IconUnlisted',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UNLISTED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_UNLISTED,
    pushNotifierService: null,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.PROJECT_STATUS,
    title: 'Project is unlisted',
    htmlTemplate: [
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' did not meet our ',
      },
      {
        type: 'a',
        content: 'guidelines for listed projects',
        href: 'https://docs.giveth.io/dapps/listedUnlisted/#listed-projects',
      },
      {
        type: 'p',
        content:
          ' and has been hidden from the projects page. You can still share your project directly via the project URL.',
      },
    ],
    content:
      '{project name} did not meet our guidelines for listed projects and has been hidden from the projects page. You can still share your project directly via the project URL.',
  },
  PROJECT_UNLISTED_FOR_SUPPORTERS: {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_UNLISTED_SUPPORTED,
    description: 'Project has been unlisted!',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.SUPPORTED_PROJECTS,
    icon: 'IconUnlisted',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UNLISTED,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'Project is unlisted',
    categoryGroup:
      NOTIFICATION_CATEGORY_GROUPS.SUPPORTED_BY_YOU_PROJECT_STATUS_CHANGE_GROUP,
    htmlTemplate: [
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' did not meet our ',
      },
      {
        type: 'a',
        content: 'guidelines for listed projects',
        href: 'https://docs.giveth.io/dapps/listedUnlisted/#listed-projects',
      },
      {
        type: 'p',
        content: ' and has been hidden from the projects page.',
      },
    ],
    content:
      'The {project name} that you are supporting is no longer visible.\n{reason}',
  },
  PROJECT_BOOSTED: {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_BOOSTED_OWNER,
    description: 'Project has been boosted',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: '',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_BOOSTED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: null,
    pushNotifierService: null,
    htmlTemplate: [
      {
        type: 'p',
        content: 'Someone boosted your project ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
    ],
    content: 'Someone boosted your project {projectName}!',
  },
  PROJECT_BOOSTED_BY_PROJECT_OWNER: {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_BOOSTED_BY_PROJECT_OWNER,
    description: 'Project has been boosted',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: '',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_BOOSTED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: null,
    pushNotifierService: null,
    htmlTemplate: [
      {
        type: 'p',
        content: 'You boosted your project ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
    ],
    content: 'You boosted your project {projectName}!',
  },
  PROJECT_CANCELLED: {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_CANCELLED_OWNER,
    description: 'Project has been cancelled',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: 'IconDeactivated',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_CANCELLED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_CANCELLED,
    pushNotifierService: null,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.PROJECT_STATUS,
    title: 'Project is cancelled by admin',
    htmlTemplate: [
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content:
          ' has been canceled by an admin because it failed to adhere to our ',
      },
      {
        type: 'a',
        content: 'terms of use',
        href: 'https://giveth.io/tos',
      },
      {
        type: 'p',
        content: '.',
      },
    ],
    content:
      '{project name} has been canceled by an admin because it failed to adhere to our terms of use',
  },
  PROJECT_CANCELLED_FOR_SUPPORTERS: {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_CANCELLED_SUPPORTED,
    description: 'Project has been cancelled',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.SUPPORTED_PROJECTS,
    icon: 'IconDeactivated',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_CANCELLED,
    categoryGroup:
      NOTIFICATION_CATEGORY_GROUPS.SUPPORTED_BY_YOU_PROJECT_STATUS_CHANGE_GROUP,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'Project is cancelled by admin',
    htmlTemplate: [
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content:
          ' has been canceled by an admin because it failed to adhere to our ',
      },
      {
        type: 'a',
        content: 'terms of use',
        href: 'https://giveth.io/tos',
      },
      {
        type: 'p',
        content: '.',
      },
    ],
    content:
      'The {project name} project that you are supporting has been cancelled.\n{reason}',
  },

  PROJECT_ACTIVATED: {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_ACTIVATED_OWNER,
    description: 'Project has been activated!',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: 'IconActivated',
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
  PROJECT_ACTIVATED_FOR_SUPPORTERS: {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_ACTIVATED_SUPPORTED,
    description: 'Project has been activated!',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.SUPPORTED_PROJECTS,
    icon: 'IconActivated',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_ACTIVATED,
    categoryGroup:
      NOTIFICATION_CATEGORY_GROUPS.SUPPORTED_BY_YOU_PROJECT_STATUS_CHANGE_GROUP,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'Project is activated',
    htmlTemplate: [
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' has been reactivated.',
      },
    ],
    content: '{project name} has been reactivated',
  },

  PROJECT_DEACTIVATED: {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_DEACTIVATED_OWNER,
    description: 'Project has been deactivated',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: 'IconDeactivated',
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
        content: ' project is deactive now.',
      },
    ],
    content: 'The {project name} project is deactive now',
  },
  PROJECT_DEACTIVATED_SUPPORTERS: {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_DEACTIVATED_SUPPORTED,
    description: 'Project has been deactivated',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.SUPPORTED_PROJECTS,
    icon: 'IconDeactivated',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_DEACTIVATED,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    categoryGroup:
      NOTIFICATION_CATEGORY_GROUPS.SUPPORTED_BY_YOU_PROJECT_STATUS_CHANGE_GROUP,
    title: 'Project is deactivated',
    htmlTemplate: [
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' has been deactivated.',
      },
    ],
    content: '{project name} has been deactivated.',
  },
  PROJECT_VERIFIED: {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_VERIFIED_OWNER,
    description: 'Project has been verified!',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: 'IconVerifiedBadge',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_VERIFIED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_VERIFIED,
    pushNotifierService: null,
    title: 'Project verified',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Congrats! ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' is now verified. Your community can now take advantage of ',
      },
      {
        type: 'a',
        content: 'GIVbacks',
        href: 'https://docs.giveth.io/giveconomy/givbacks',
      },
      {
        type: 'p',
        content: ' and ',
      },
      {
        type: 'a',
        content: 'GIVpower',
        href: 'https://docs.giveth.io/giveconomy/givpower',
      },

      {
        type: 'p',
        content: '.',
      },
    ],
    content:
      'Congrats! {project name} is now verified. Your community can now take advantage of GIVbacks and GIVpower.',
  },
  PROJECT_VERIFIED_SUPPORTERS: {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_VERIFIED_SUPPORTED,
    description: 'Project has been verified!',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.SUPPORTED_PROJECTS,
    icon: 'IconVerifiedBadge',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_VERIFIED,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'Project verified',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Amazing! ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' is now verified. You can now donate and receive ',
      },
      {
        type: 'a',
        content: 'GIVbacks',
        href: 'https://docs.giveth.io/giveconomy/givbacks',
      },
      {
        type: 'p',
        content: ' and or boost it with ',
      },
      {
        type: 'a',
        content: 'GIVpower',
        href: 'https://docs.giveth.io/giveconomy/givpower',
      },
      {
        type: 'p',
        content: '.',
      },
    ],
    content:
      'The {project name} that you are supporting has received verified badge!',
  },
  VERIFICATION_FORM_SENT: {
    name: 'Form sent (Under review)',
    description: 'Form sent (Under review)',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: 'IconFormSubmit',
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
    icon: 'IconRejected',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.VERIFICATION_FORM_REJECTED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_REJECTED,
    pushNotifierService: null,
    title: 'Form rejected',
    htmlTemplate: [
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content:
          ' has not been approved for verification. Learn more about our verification requirements ',
      },
      {
        type: 'a',
        content: 'here',
        href: 'https://docs.giveth.io/dapps/projectVerification',
      },
      {
        type: 'p',
        content: '.',
      },
    ],
    content:
      '{project name} has not been approved for verification. Learn more about our verification requirements here.',
  },
  REAPPLY_VERIFICATION_FORM_REMINDER: {
    name: 'Re-apply for verification reminder',
    description: 'Re-apply for verification reminder',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: 'IconRejected',
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
  GIV_BACK_IS_READY_TO_CLAIM: {
    name: 'GIVback is ready to claim',
    title: 'GIVbacks',
    description: 'Notify me when my GIV from GIVbacks is ready to claim.',
    showOnSettingPage: true,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.GIVBACKS,
    isGroupParent: true,
    emailDefaultValue: false,
    isEmailEditable: false,
    microService: MICRO_SERVICES.givEconomyNotificationMicroService,
    category: NOTIFICATION_CATEGORY.GIV_ECONOMY,
    icon: 'IconGIVBack',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.GIV_BACK_IS_READY_TO_CLAIM,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    htmlTemplate: [
      {
        type: 'p',
        content: 'Your GIVback ',
      },
      {
        type: 'b',
        content: '$amount',
      },
      {
        type: 'p',
        content: ' GIV is ready to claim! ',
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
      'Your GIVback {amount} GIV is ready to claim! \n[Click here] to take a shortcut.',
  },
  PROJECT_EDITED: {
    name: 'Project edited',
    description: 'Project has been edited',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: '',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_EDITED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_EDITED,
    pushNotifierService: null,
    title: 'Project edited',
    htmlTemplate: [
      {
        type: 'p',
        content: 'You edited your project ',
      },
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content:
          " and our team is reviewing it, you'll get notified when it will be listed again.",
      },
    ],
    content:
      "You edited your project {project name} and our team is reviewing it, you'll get notified when it will be listed again.",
  },
  PROJECT_BADGE_REVOKED: {
    name: 'Project badge revoked',
    description: 'Project verified badge revoked',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: '',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_BADGE_REVOKED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_BADGE_REVOKED,
    pushNotifierService: null,
    title: 'Project verification revoked',
    htmlTemplate: [
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content:
          ' has lost its verification status. Learn more about our verification requirements ',
      },
      {
        type: 'a',
        content: 'here',
        href: 'https://docs.giveth.io/dapps/projectVerification',
      },
      {
        type: 'p',
        content: '.',
      },
    ],
    content:
      '{project name} has lost its verification status. Learn more about our verification requirements here.',
  },
  PROJECT_BADGE_REVOKE_REMINDER: {
    name: 'Project badge revoke reminder',
    description: 'Project verified badge revoke reminder',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: '',
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
        content: ' will lose its verification badge soon',
      },
    ],
    content:
      'Your project {project name} will lose its verification badge soon',
  },
  PROJECT_BADGE_REVOKE_WARNING: {
    name: 'Project badge revoke warning',
    description: 'Project badge revoke warning',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: '',
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
        content: ' will lose its verification badge soon.',
      },
    ],
    content:
      'Your project {project name} will lose its verification badge soon.',
  },
  PROJECT_BADGE_REVOKE_LAST_WARNING: {
    name: 'Project badge revoke last warning',
    description: 'Project badge revoke last warning',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: '',
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
        content:
          ' will lose its verification badge soon. this is the last warning.',
      },
    ],
    content:
      'Your project {project name} will lose its verification badge soon, this is the last warning.',
  },
  PROJECT_BADGE_UP_FOR_REVOKING: {
    name: 'Project badge up for revoking',
    description: 'Project badge up for revoking',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: '',
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
        content: ' will lose its verification badge soon.',
      },
    ],
    content:
      'Your project {project name} will lose its verification badge soon.',
  },
  PROJECT_UNVERIFIED: {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_UNVERIFIED_OWNER,
    description: 'Project has been unverified',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: '',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UNVERIFIED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_UNVERIFIED,
    pushNotifierService: null,
    title: 'Project verification removed',
    htmlTemplate: [
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content:
          ' has lost its verification status. Learn more about our verification requirements ',
      },
      {
        type: 'a',
        content: 'here',
        href: 'https://docs.giveth.io/dapps/projectVerification',
      },
      {
        type: 'p',
        content: '.',
      },
    ],
    content:
      '{project name} has lost its verification status. Learn more about our verification requirements here.',
  },
  PROJECT_UNVERIFIED_SUPPORTERS: {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_UNVERIFIED_SUPPORTED,
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.SUPPORTED_PROJECTS,
    icon: '',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UNVERIFIED_WHO_SUPPORTED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_UNVERIFIED_USERS_WHO_SUPPORTED,
    pushNotifierService: null,
    title: 'Project unverified - Users Who Boosted',
    description: 'Project unverified - Users Who Boosted',
    htmlTemplate: [
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },

      {
        type: 'p',
        content:
          ' has lost its verification status. Learn more about our verification requirements',
      },
      {
        type: 'a',
        content: 'here',
        href: 'https://docs.giveth.io/dapps/projectVerification',
      },

      {
        type: 'p',
        content: '.',
      },
    ],
    content:
      '{project name} has lost its verification status. Learn more about our verification requirements here.',
  },
  MADE_DONATION: {
    name: 'Made donation',
    description: 'User made a donation to a project',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: 'IconDonation',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.MADE_DONATION,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.MADE_DONATION,
    pushNotifierService: null,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.DONATIONS_MADE,
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
    icon: 'IconDonation',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.DONATION_RECEIVED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.DONATION_RECEIVED,
    pushNotifierService: null,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.DONATIONS_RECEIVED,
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
    icon: '',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.GET_DONATION_PRICE_FAILED,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.DONATIONS_MADE,
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
      {
        type: 'p',
        content: '.',
      },
    ],
    content:
      'Your donation to {project name} was not successful. {reason} \n{tx link}.',
  },
  NEW_PROJECT_UPDATE: {
    name: 'Project update',
    description: 'Project update',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.DISCUSSION,
    icon: 'IconFile',
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
  PROJECT_UPDATE_ADDED_OWNER: {
    name: 'Project update added - owner',
    title: 'Your project update',
    description:
      'Notify me when my project has been edited, or an update has been published.',
    showOnSettingPage: true,
    emailDefaultValue: false,
    webDefaultValue: false,
    isEmailEditable: false,
    isGroupParent: true,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.YOUR_PROJECT_UPDATE,
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: '',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_EDITED,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: SegmentEvents.PROJECT_UPDATE_ADDED_OWNER,
    pushNotifierService: null,
    htmlTemplate: [
      {
        type: 'p',
        content: 'Your project update was successful.',
      },
    ],
    content: 'Your project update was successful.', // Missing copy
  },

  VERIFICATION_FORM_GOT_DRAFT_BY_ADMIN: {
    name: NOTIFICATION_TYPE_NAMES.VERIFICATION_FORM_GOT_DRAFT_BY_ADMIN,
    description: 'Verification form was drafted by an admin',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: '',
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
        content: ' was drafted by an admin.',
      },
    ],
    content: 'Your project {project name} was drafted by an admin.',
  },
  PROJECT_RECEIVED_LIKE: {
    name: 'project liked',
    title: 'Project likes',
    description: 'Notify me when someone likes my project.',
    showOnSettingPage: true,
    emailDefaultValue: false,
    isEmailEditable: false,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.PROJECT_LIKES,
    isGroupParent: true,
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: 'IconHeartFilled',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_RECEIVED_LIKE,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: null,
    pushNotifierService: null,
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
        content: ' received a like.',
      },
    ],
    content: 'Nice! Your project {project name} received a like.',
  },
  NEW_PROJECT_UPDATE_FOR_USERS_WHO_SUPPORTED: {
    name: 'Project update added - Users who supported',
    title: 'Supported project updated',
    description: 'When your supported project has an update',
    showOnSettingPage: true,
    emailDefaultValue: false,
    isEmailEditable: false,
    categoryGroup:
      NOTIFICATION_CATEGORY_GROUPS.SUPPORTED_BY_YOU_PROJECT_HAS_NEW_UPDATE_GROUP,
    isGroupParent: true,
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.SUPPORTED_PROJECTS,
    icon: '',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_UPDATED_ADDED_WHO_SUPPORTS,
    emailNotifierService: THIRD_PARTY_EMAIL_SERVICES.SEGMENT,
    emailNotificationId: 'Project update added - Users who supported',
    pushNotifierService: null,
    htmlTemplate: [
      {
        type: 'a',
        content: '$projectTitle',
        href: '$projectLink',
      },
      {
        type: 'p',
        content: ' has a new update!',
      },
    ],
    content: '{Project name}  has a new update!',
  },
  YOU_BOOSTED: {
    name: 'You boosted',
    description: 'User boosted a project',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.GIV_ECONOMY,
    icon: '',
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
    category: NOTIFICATION_CATEGORY.GIV_ECONOMY,
    icon: '',
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
    category: NOTIFICATION_CATEGORY.GIV_ECONOMY,
    icon: '',
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
      {
        type: 'p',
        content: '.',
      },
    ],
    content: 'Your project {project name} has been boosted by {user name}.',
  },
  YOU_UNLOCKED_GIVPOWER: {
    name: 'givPower unlocked',
    description: 'GIVpower unlocked automatically',
    microService: MICRO_SERVICES.givEconomyNotificationMicroService,
    category: NOTIFICATION_CATEGORY.GIV_ECONOMY,
    icon: '',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.USER_UNLOCKED_GIVPOWER,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.GIVPOWER_ALLOCATIONS,
    title: 'givPower unlocked',
    htmlTemplate: [
      {
        type: 'p',
        content:
          'Some of the GIV that you locked for GIVpower has become unlocked.',
      },
    ],
    content:
      'Some of the GIV that you locked for GIVpower has become unlocked.',
  },
  RE_LOCKED_AUTOMATICALLY: {
    name: '{amount} re-locked automatically',
    description: 'User unlocked GIVpower',
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.GIV_ECONOMY,
    icon: '',
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
    name: 'GIV lockups',
    microService: MICRO_SERVICES.givethio,
    showOnSettingPage: true,
    emailDefaultValue: false,
    isEmailEditable: false,
    title: 'GIVpower Allocations',
    description:
      'Notify me when GIV I locked in GIVpower staking gets unlocked.',
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
    category: NOTIFICATION_CATEGORY.GIV_ECONOMY,
    icon: '',
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.GIVPOWER_ALLOCATIONS,
  },
  GIVPOWER_SELF_BOOSTING_GROUP: {
    name: 'Your boost status',
    title: 'Your boost status',
    description:
      'Shows when you boost a project, change the allocation of GIVpower.',
    showOnSettingPage: false,
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
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: '',
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.SELF_BOOSTING_STATUS,
  },
  GIVPOWER_PROJECT_BOOSTING_GROUP: {
    name: 'Project boost status',
    title: 'Project boost status',
    description: 'Shows when your project receives a boost',
    showOnSettingPage: true,
    emailDefaultValue: false,
    isEmailEditable: false,
    microService: MICRO_SERVICES.givethio,
    schemaValidator: null,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    isGroupParent: true,
    content: 'Notify me when a new address boosts my project with GIVpower.',
    htmlTemplate: [
      {
        type: 'p',
        content:
          'Notify me when a new address boosts my project with GIVpower.',
      },
    ],
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: '',
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.PROJECT_BOOSTING_STATUS,
  },
  PROJECT_STATUS_GROUP: {
    name: 'Project status',
    title: 'Your project status',
    description:
      'Notify me when a project I own has been listed, unlisted, cancelled, activated or deactivated.',
    showOnSettingPage: true,
    isEmailEditable: true,
    emailDefaultValue: true,
    isWebEditable: true,
    microService: MICRO_SERVICES.givethio,
    schemaValidator: null,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    isGroupParent: true,
    content: 'Your project status',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Your project status',
      },
    ],
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: '',
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.PROJECT_STATUS,
  },
  DONATIONS_MADE_GROUP: {
    name: 'Donations',
    title: 'Donations',
    description: 'Notify me when my donation to a project succeeds or fails.',
    showOnSettingPage: true,
    isEmailEditable: true,
    emailDefaultValue: true,
    webDefaultValue: true,
    microService: MICRO_SERVICES.givethio,
    schemaValidator: null,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    isGroupParent: true,
    content: 'Notify me when my project receives a donation.',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Notify me when my project receives a donation.',
      },
    ],
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: '',
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.DONATIONS_MADE,
  },
  DONATIONS_RECEIVED_GROUP: {
    name: 'Donations received',
    title: 'Donation received',
    description: 'Notify me when my project receives a donation.',
    showOnSettingPage: true,
    isEmailEditable: true,
    webDefaultValue: true,
    emailDefaultValue: true,
    microService: MICRO_SERVICES.givethio,
    schemaValidator: null,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    isGroupParent: true,
    content: 'Notify me when my project receives a donation.',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Notify me when my project receives a donation.',
      },
    ],
    category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
    icon: '',
    categoryGroup: NOTIFICATION_CATEGORY_GROUPS.DONATIONS_RECEIVED,
  },
  SUPPORT_BY_YOU_PROJECT_STATUS_CHANGE_GROUP: {
    name: 'Project status - Users Who Supported',
    title: 'Supported projects status',
    description:
      'Notify me when a project I liked, boosted or donated to has been listed, unlisted, cancelled, activated or deactivated',
    showOnSettingPage: true,
    emailDefaultValue: false,
    isEmailEditable: false,
    microService: MICRO_SERVICES.givethio,
    schemaValidator: null,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    isGroupParent: true,
    content: 'Supported projects status',
    htmlTemplate: [
      {
        type: 'p',
        content: 'Supported projects status',
      },
    ],
    category: NOTIFICATION_CATEGORY.SUPPORTED_PROJECTS,
    icon: '',
    categoryGroup:
      NOTIFICATION_CATEGORY_GROUPS.SUPPORTED_BY_YOU_PROJECT_STATUS_CHANGE_GROUP,
  },
  RAW_HTML: {
    name: 'Raw HTML Broadcast',
    description: 'Raw HTML Broadcast',
    microService: MICRO_SERVICES.givethio,
    category: 'general',
    icon: 'IconAdminNotif',
    schemaValidator: SCHEMA_VALIDATORS_NAMES.RAW_HTML_BROADCAST,
    emailNotifierService: null,
    emailNotificationId: null,
    pushNotifierService: null,
    title: 'Raw HTML Broadcast',
    htmlTemplate: [
      {
        type: 'html',
        content: '$html',
      },
    ],
    Content: {
      html: '',
    },
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
