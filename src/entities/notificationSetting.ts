import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { NotificationType } from './notificationType';
import { UserAddress } from './userAddress';

export const NOTIFICATION_CATEGORY_GROUPS = {
  GIVPOWER_ALLOCATIONS: 'givPowerAllocations',
  PROJECT_BOOSTING_STATUS: 'projectBoostStatus',
  SELF_BOOSTING_STATUS: 'yourBoostStatus',
  SUPPORTED_BY_YOU_PROJECT_STATUS_CHANGE_GROUP:
    'supportedByYouProjectsStatusChange',
  SUPPORTED_BY_YOU_PROJECT_HAS_NEW_UPDATE_GROUP:
    'supportedByYouProjectsHasNewUpdate',
  PROJECT_STATUS: 'projectStatus',
  DONATIONS_MADE: 'donationsMade',
  DONATIONS_RECEIVED: 'donationsReceived',
  REWARDS: 'rewards',
  GIVBACKS: 'givBacks',
};

// Schema designed based on https://github.com/Giveth/giveth-dapps-v2/issues/475
@Entity()
export class NotificationSetting extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  // has more importance over the other two.
  @Column('boolean', { default: true, nullable: false })
  allowNotifications: boolean;

  @Column('boolean', { default: true, nullable: false })
  allowEmailNotification: boolean;

  @Column('boolean', { default: true, nullable: false })
  allowDappPushNotification: boolean;

  @Index()
  @ManyToOne(type => NotificationType, { eager: true })
  notificationType: NotificationType;
  @RelationId(
    (notificationSetting: NotificationSetting) =>
      notificationSetting.notificationType,
  )
  notificationTypeId: number;

  @Index()
  @ManyToOne(type => UserAddress, { eager: true, nullable: false })
  userAddress: UserAddress;
  @RelationId(
    (notificationSetting: NotificationSetting) =>
      notificationSetting.userAddress,
  )
  userAddressId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
