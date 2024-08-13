import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NotificationSetting } from './notificationSetting';

// Export Object with Schemas to N1 lookup
export const SCHEMA_VALIDATORS_NAMES = {
  SEND_EMAIL_CONFIRMATION: 'sendEmailConfirmation',
  CREATE_ORTTO_PROFILE: 'createOrttoProfile',
  SUBSCRIBE_ONBOARDING: 'subscribeOnboarding',
  SUPERFLUID: 'userSuperTokensCritical',
  ADMIN_MESSAGE: 'adminMessage',
  RAW_HTML_BROADCAST: 'rawHtmlBroadcast',
  DRAFTED_PROJECT_SAVED: 'draftedProjectSavedValidator',
  DRAFTED_PROJECT_ACTIVATED: 'draftedProjectPublishedValidator',
  PROJECT_LISTED: 'projectListed',
  PROJECT_UNLISTED: 'projectUnlisted',
  PROJECT_EDITED: 'projectEdited',
  PROJECT_UPDATE_ADDED_OWNER: 'projectUpdateAddedOwner',
  PROJECT_BADGE_REVOKED: 'projectBadgeRevoked',
  PROJECT_BADGE_REVOKE_REMINDER: 'projectBadgeRevokeReminder',
  PROJECT_BADGE_REVOKE_WARNING: 'projectBadgeRevokeWarning',
  PROJECT_BADGE_REVOKE_LAST_WARNING: 'projectBadgeRevokeLastWarning',
  PROJECT_BADGE_UP_FOR_REVOKING: 'projectBadgeUpForRevoking',
  PROJECT_VERIFIED: 'projectVerified',
  PROJECT_UNVERIFIED: 'projectUnverified',
  PROJECT_UNVERIFIED_WHO_SUPPORTED: 'projectUnverifiedWhoSupported',
  PROJECT_ACTIVATED: 'projectActivated',
  PROJECT_DEACTIVATED: 'projectDeactivated',
  PROJECT_CANCELLED: 'projectCancelled',
  PROJECT_BOOSTED: 'projectBoosted',
  VERIFICATION_FORM_SENT: 'verificationFormSent',
  VERIFICATION_FORM_Reapply_Reminder: 'verificationFormReapplyReminder',
  VERIFICATION_FORM_REJECTED: 'verificationFormRejected',

  GIV_FARM_CLAIM: 'givFarmClaim',
  GIV_FARM_STAKE: 'givFarmStake',
  GIV_FARM_UN_STAKE: 'givFarmUnStake',
  GIV_FARM_READY_TO_CLAIM: 'givFarmReadyToClaim',
  GIV_FARM_REWARD_HARVEST: 'givFarmRewardHarvest',

  MADE_DONATION: 'madeDonation',
  DONATION_RECEIVED: 'donationReceived',
  PROJECT_UPDATED_DONOR: 'projectUpdatedDonor',
  PROJECT_UPDATED_OWNER: 'projectUpdatedOwner',
  PROJECT_UPDATED_ADDED_WHO_SUPPORTS: 'projectUpdateAddedWhoSupported',
  PROJECT_CREATED: 'projectCreated',
  GET_DONATION_PRICE_FAILED: 'getDonationPriceFailed',
  VERIFICATION_FORM_GOT_DRAFT_BY_ADMIN: 'verificationFormDrafted',
  PROJECT_RECEIVED_LIKE: 'projectReceivedLike',
  USER_BOOSTED: 'givPowerUserBoosted',
  USER_CHANGED_BOOSTED_ALLOCATION: 'givPowerUserChangedBoostedAllocation',
  PROJECT_HAS_BEEN_BOOSTED: 'givPowerProjectHasBeenBoosted',
  USER_LOCKED_GIVPOWER: 'givPowerUserLockedGivPower',
  USER_UNLOCKED_GIVPOWER: 'givPowerUserUnlockedGivPower',
  USER_GIVPOWER_RELOCKED_AUTOMATICALLY:
    'givPowerUserGivPowerRelockedAutoMatically',
  GIV_BACK_IS_READY_TO_CLAIM: 'givBackReadyToClaim',
  PROJECT_HAS_A_NEW_RANK: 'projectHasANewRank',
  PROJECT_HAS_RISEN_IN_THE_RANK: 'projectHasRisenInTheRank',
  YOUR_PROJECT_GOT_A_RANK: 'yourProjectGotARank',

  NOTIFY_REWARD_AMOUNT: 'notifyRewardAmount',
};
export type HtmlTemplate = { type: string; content: string; href?: string }[];

// This table needs to be prefilled with all notifications in the design
// Schema designed based on https://github.com/Giveth/giveth-dapps-v2/issues/475
@Entity()
export class NotificationType extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  // trace, giveth.io, ...
  @Index()
  @Column('text', { nullable: true })
  microService: string;

  @Column('boolean', { default: false })
  isGlobal?: boolean;

  @Column('boolean', { default: false })
  isGroupParent?: boolean;

  @Column('boolean', { default: false })
  showOnSettingPage?: boolean;

  // https://github.com/Giveth/impact-graph/issues/746
  @Column('boolean', { nullable: true, default: false })
  isEmailEditable: boolean;

  @Column('boolean', { nullable: true, default: true })
  isWebEditable: boolean;

  @Column('boolean', { nullable: true, default: false })
  emailDefaultValue: boolean;

  @Column('boolean', { nullable: true, default: false })
  webDefaultValue: boolean;

  @Index()
  @Column('text', { nullable: true })
  categoryGroup?: string;

  @Index()
  @Column('text', { nullable: false })
  name: string;

  @Column('text', { nullable: false })
  description: string;

  // PROJECT_SAVED, PROJECT_DELETED, etc
  // If no validator present it's a default message like WELCOME notification
  @Column('text', { nullable: true })
  schemaValidator?: string | null;

  // GivEconomy, Project, Trace, General, Donations
  @Index()
  @Column('text')
  category: string;

  // Segment or other service, our own
  @Column('text', { nullable: true })
  emailNotifierService?: string | null;

  // for segment or any related event
  @Column('text', { nullable: true })
  emailNotificationId?: string | null;

  // any push notification service
  @Column('text', { nullable: true })
  pushNotifierService?: string | null;

  @Column('boolean', { nullable: true, default: true })
  requiresTemplate: boolean;

  @Column('jsonb', { nullable: true })
  htmlTemplate?: HtmlTemplate | null;

  // Notification title
  @Column('text', { nullable: true })
  title?: string;

  @Column('text', { nullable: true })
  icon?: string;

  // Notification text
  @Column('text', { nullable: true })
  content?: string;

  @OneToMany(
    _type => NotificationSetting,
    notificationSetting => notificationSetting.notificationType,
  )
  notificationSettings?: NotificationSetting[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
