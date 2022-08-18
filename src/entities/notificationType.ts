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
import { NotificationSetting } from './notificationSetting';
import { NotificationTemplate } from './notificationTemplate';

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
  @Column('text', { nullable: true })
  resourceType?: string | null;

  // Segment or other service
  @Column('text', { nullable: true })
  emailNotifierService?: string | null;

  // for segment or any related event
  @Column('text', { nullable: true })
  emailNotificationId?: string | null;

  // any push notification service
  @Column('text', { nullable: true })
  pushNotifierService?: string | null;

  @Column('boolean', { nullable: false, default: false })
  requiresTemplate: boolean;

  @OneToMany(
    type => NotificationSetting,
    notificationSetting => notificationSetting.notificationType,
  )
  notificationSettings?: NotificationSetting[];

  @OneToMany(
    type => NotificationTemplate,
    notificationTemplate => notificationTemplate.notificationType,
  )
  notificationTemplate?: NotificationTemplate[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
