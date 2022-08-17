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
