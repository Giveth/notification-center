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

export class NotificationMetadata {
  // name of recipient
  name?: string;

  // For donation emails it's needed
  amount?: string;
  currency?: string;
}

export const EMAIL_STATUSES = {
  NO_NEED_TO_SEND: 'noNeedToSend',
  WAITING_TO_BE_SEND: 'waitingToBeSent',
  SENT: 'send',
};

// Schema designed based on https://github.com/Giveth/giveth-dapps-v2/issues/475
@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  // Giveth.io project have integer id (Postgres), Trace projects have string id (Mongo)
  // So use string here to support both of them
  @Column('text', { nullable: true })
  projectId?: string;

  // waitingForSend | sent | noNeedToSend
  @Column('text', { nullable: true })
  emailStatus?: string;

  @Column('text', { nullable: true })
  email?: string;

  @Column('text', { nullable: true })
  emailContent?: string;

  @Column({ default: false })
  isRead?: boolean;

  @Column('jsonb', { nullable: true, default: {} })
  segmentData: string;

  // dynamic data considering segment structures, and validate with joi schema
  @Column('jsonb', { nullable: true, default: {} })
  metadata: NotificationMetadata;

  @Index()
  @ManyToOne(() => NotificationType)
  notificationType: NotificationType;
  @RelationId((notification: Notification) => notification.notificationType)
  notificationTypeId: number;

  @Index()
  @ManyToOne(() => UserAddress)
  userAddress: UserAddress;
  @RelationId((notification: Notification) => notification.userAddress)
  userAddressId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
