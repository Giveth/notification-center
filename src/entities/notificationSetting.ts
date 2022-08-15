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

// Schema designed based on https://github.com/Giveth/giveth-dapps-v2/issues/475
@Entity()
export class NotificationSetting extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  // has more importance over the other two.
  @Column('boolean', { default: true, nullable: false })
  allowNotifications: string;

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
  typeId: number;

  @Index()
  @ManyToOne(type => UserAddress, { eager: true })
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
