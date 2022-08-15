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
import { NotificationTemplate } from './notificationTemplate';
import { NotificationType } from './notificationType';
import { UserAddress } from './userAddress';

export class NotificationMetadata {
  // name of recipient
  name?: string;

  // For donation emails it's needed
  amount?: string;
  currency?: string;
}

// Schema designed based on https://github.com/Giveth/giveth-dapps-v2/issues/475
@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  // Giveth.io users have integer id (Postgres), Trace users have string id (Mongo)
  // So use string here to support both of them
  @Column('text')
  userId?: string;

  @Column('text')
  walletAddress?: string;

  // Giveth.io project have integer id (Postgres), Trace projects have string id (Mongo)
  // So use string here to support both of them
  @Column('text')
  projectId?: string;

  // waitingForSend | sent | noNeedToSend
  @Column('text')
  emailStatus?: string;

  @Column('text')
  email?: string;

  @Column('text')
  emailContent?: string;

  @Column('text')
  content: string;

  @Column({ default: false })
  isRead?: boolean;

  // dynamic data considering segment structures, and validate with joi schema
  @Column('jsonb', { nullable: true, default: {} })
  data: string;

  @Column('jsonb', { nullable: true, default: {} })
  metadata: NotificationMetadata;

  @Index()
  @ManyToOne(() => NotificationTemplate)
  template: NotificationTemplate;
  @RelationId((notification: Notification) => notification.template)
  templateId: number;

  @Index()
  @ManyToOne(() => NotificationType)
  notificationType: NotificationType;
  @RelationId((notification: Notification) => notification.notificationType)
  typeId: number;

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
