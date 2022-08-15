import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { NotificationSetting } from './notificationSetting';
import { Notification } from './notification';

// Schema designed based on https://github.com/Giveth/giveth-dapps-v2/issues/475
@Entity()
export class UserAddress extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Index({ unique: true })
  @Column('text', { nullable: false })
  walletAddress: string;

  // General Notification Settings see design: https://www.figma.com/file/nVoinu0tgJ565enN5R4WDE/Giveth.io-%26-GIVeconomy?node-id=9820%3A181611
  @Column('boolean', { default: true, nullable: false })
  allowEmailNotifications: boolean;

  @Column('boolean', { default: true, nullable: false })
  allowDappPushNotifications: boolean;

  @OneToMany(type => Notification, notification => notification.userAddress)
  notifications?: Notification[];

  @OneToMany(
    type => NotificationSetting,
    notificationSetting => notificationSetting.userAddress,
  )
  settings?: NotificationSetting[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
