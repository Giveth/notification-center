import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { NotificationTemplate } from './notificationTemplate';
import {NOTIFICATION_CATEGORY} from "../types/general";

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
  userId: string;

  @Column('text')
  // trace, giveth.io, ...
  microService: string;

  @Column('text')
  walletAddress: string;

  // Giveth.io project have integer id (Postgres), Trace projects have string id (Mongo)
  // So use string here to support both of them
  @Column('text')
  projectId ?: string;

  // waitingForSend | sent | noNeedToSend
  @Column('text')
  emailStatus: string;

  @Column('text')
  email?: string;

  @Column('text')
  emailContent?: string;

  @Column('text')
  content: string;

  @Column({ default: false })
  isRead?: boolean;

  @Column('jsonb', { nullable: true })
  metadata: NotificationMetadata;

  @Column({
    type: 'enum',
    enum: NOTIFICATION_CATEGORY,
    default: NOTIFICATION_CATEGORY.PROJECT_RELATED

  })
  category: NOTIFICATION_CATEGORY;

  @Index()
  @ManyToOne(() => NotificationTemplate)
  template: NotificationTemplate;
  @RelationId((notification: Notification) => notification.template)
  templateId: number;
}
