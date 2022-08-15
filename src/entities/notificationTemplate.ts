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

// Schema designed based on https://github.com/Giveth/giveth-dapps-v2/issues/475
@Entity()
export class NotificationTemplate extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;
  @Column('text')
  title?: string;

  // replaceable text
  @Column('text')
  description: string;

  @Index()
  @ManyToOne(type => NotificationType, { eager: true })
  notificationType: NotificationType;
  @RelationId(
    (notificationTemplate: NotificationTemplate) =>
      notificationTemplate.notificationType,
  )
  typeId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
