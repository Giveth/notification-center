import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { NOTIFICATION_CATEGORY } from '../types/general';
import { NotificationSetting } from './notificationSetting';
import { NotificationType } from './notificationType';

export const NOTIFICATION_CATEGORY_GROUPS = {
  GIVPOWER_ALLOCATIONS: 'givPowerAllocations',
  PROJECT_BOOSTING_STATUS: 'projectBoostStatus',
  SELF_BOOSTING_STATUS: 'yourBoostStatus',
  PROJECT_STATUS: 'projectStatus',
  DONATIONS: 'donations',
  STAKING: 'stakes',
  REWARDS: 'rewards',
  GIVBACKS: 'givBacks',
}

// This table needs to be prefilled with all notifications in the design
// Schema designed based on https://github.com/Giveth/giveth-dapps-v2/issues/475
@Entity()
export class NotificationGroup extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  // Notification group title
  @Column('text', { nullable: true })
  title?: string;

  @Column('text', { nullable: true })
  description: string;

  // GivEconomy, Project, Trace, General, Donations
  @Index()
  @Column('text')
  categoryGroup: string;

  @Index()
  @Column('text')
  category: string;

  @OneToMany(
    type => NotificationType,
    notificationType => notificationType.notificationGroup,
  )
  notificationTypes?: NotificationType[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
