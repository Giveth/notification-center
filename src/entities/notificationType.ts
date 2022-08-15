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
  @Column('text')
  microService: string;

  @Index()
  @Column('text', { nullable: false })
  name: string;

  @Column('text', { nullable: false })
  description: string;

  // PROJECT_SAVED, PROJECT_DELETED, etc
  @Column('text', { nullable: false })
  schemaValidator: string;

  // GivEconomy, Project, Trace
  @Index()
  @Column('text', { nullable: false })
  resourceType: string;

  // Segment or other service
  @Column('text', { nullable: true })
  thirdPartyEmailNotifier: string;

  // any push notification service
  @Column('text', { nullable: true })
  thirdPartyPushNotifier: string;

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
