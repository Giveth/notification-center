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
import { Notification } from './notification';

// Schema designed based on https://github.com/Giveth/giveth-dapps-v2/issues/475
@Entity()
export class UserAddress extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Index({ unique: true })
  @Column('text', { nullable: false })
  walletAddress: string;

  @OneToMany(_type => Notification, notification => notification.userAddress)
  notifications?: Notification[];

  @OneToMany(
    _type => NotificationSetting,
    notificationSetting => notificationSetting.userAddress,
  )
  settings?: NotificationSetting[];

  // need to define push notifier logic (device address???)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
