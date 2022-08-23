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

export class HtmlTemplate {
  /**
   * sample
   * {
    "icon": "",
    "content": [
        {
            "type": "p",
            "content" : "you staked"
        },
        {
            "type": "b",
            "content": "$amount"
        },
        {
            "type": "p",
            "content" : "on"
        },
        {
            "type": "a",
            "content" : "$farm",
            "href": "$href1"
        }
    ],
    "qutoe": "hey bro, how are you?"
    }
   */
  icon?: string;
  content: { type: string; content: string; href?: string }[];
  quote: string;
}

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

  @Column('jsonb', { nullable: true })
  htmlTemplate: HtmlTemplate | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
