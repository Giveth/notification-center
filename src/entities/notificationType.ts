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
  DRAFTED_PROJECT_ACTIVATED: 'draftedProjectValidator',
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
  SEND_EMAIL_CONFIRMATION: 'sendEmailConfirmation', // verificationForm,
  MADE_DONATION: 'madeDonation',
  DONATION_RECEIVED: 'donationReceived',
  PROJECT_UPDATED_DONOR: 'projectUpdatedDonor',
  PROJECT_UPDATED_OWNER: 'projectUpdatedOwner',
  PROJECT_CREATED: 'projectCreated',
  GET_DONATION_PRICE_FAILED: 'getDonationPriceFailed',
  VERIFICATION_FORM_GOT_DRAFT_BY_ADMIN: 'verificationFormDrafted',
};

export class HtmlTemplate {
  /**
   * sample
   * {
    "icon": "",
    "content": [
        {
            "type": "p",
            "content" : "you staked"
        },
        {
            "type": "b",
            "content": "$amount"
        },
        {
            "type": "p",
            "content" : "on"
        },
        {
            "type": "a",
            "content" : "$farm",
            "href": "$href1"
        }
    ],
    "qutoe": "hey bro, how are you?"
    }
   */
  icon?: string;
  content: { type: string; content: string; href?: string }[];
  quote: string;
}

// This table needs to be prefilled with all notifications in the design
// Schema designed based on https://github.com/Giveth/giveth-dapps-v2/issues/475
@Entity()
export class NotificationType extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  // trace, giveth.io, ...
  @Index()
  @Column('text', { nullable: true })
  microService?: string;

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
  @Column('text', {
    nullable: true,
    default: NOTIFICATION_CATEGORY.PROJECT_RELATED,
  })
  category?: string | null;

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
  htmlTemplate: HtmlTemplate | null;

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
