import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { NOTIFICATION_CATEGORY } from '../types/general';
import { NotificationSetting } from './notificationSetting';

// Export Object with Schemas to N1 lookup
export const SCHEMA_VALIDATORS_NAMES = {
  DRAFTED_PROJECT_SAVED: 'draftedProjectSavedValidator',
  DRAFTED_PROJECT_ACTIVATED: 'draftedProjectPublishedValidator',
  PROJECT_LISTED: 'projectListed',
  PROJECT_UNLISTED: 'projectUnlisted',
  PROJECT_EDITED: 'projectEdited',
  PROJECT_BADGE_REVOKED: 'projectBadgeRevoked',
  PROJECT_VERIFIED: 'projectVerified',
  PROJECT_REJECTED: 'projectRejected',
  PROJECT_UNVERIFIED: 'projectUnverified',
  PROJECT_ACTIVATED: 'projectActivated',
  PROJECT_DEACTIVATED: 'projectDeactivated',
  PROJECT_CANCELLED: 'projectCancelled',
  VERIFICATION_FORM_SENT: 'verificationFormSent',
  VERIFICATION_FORM_Reapply_Reminder: 'verificationFormReapplyReminder',
  VERIFICATION_FORM_REJECTED: 'verificationFormRejected',

  GIV_FARM_CLAIM: 'givFarmClaim',
  GIV_FARM_STAKE: 'givFarmStake',
  GIV_FARM_UN_STAKE: 'givFarmUnStake',
  GIV_FARM_READY_TO_CLAIM: 'givFarmReadyToClaim',
  GIV_FARM_REWARD_HARVEST: 'givFarmRewardHarvest',

  SEND_EMAIL_CONFIRMATION: 'sendEmailConfirmation', // verificationForm,
  MADE_DONATION: 'madeDonation',
  DONATION_RECEIVED: 'donationReceived',
  PROJECT_UPDATED_DONOR: 'projectUpdatedDonor',
  PROJECT_UPDATED_OWNER: 'projectUpdatedOwner',
  PROJECT_UPDATED_WHO_LIKED: 'projectUpdatedWhoLiked',
  PROJECT_CREATED: 'projectCreated',
  GET_DONATION_PRICE_FAILED: 'getDonationPriceFailed',
  VERIFICATION_FORM_GOT_DRAFT_BY_ADMIN: 'verificationFormDrafted',
  PROJECT_RECEIVED_LIKE: 'projectReceivedLike',
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

  // Notification text
  @Column('text', { nullable: true })
  content?: string;

  @OneToMany(
    type => NotificationSetting,
    notificationSetting => notificationSetting.notificationType,
  )
  notificationSettings?: NotificationSetting[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
