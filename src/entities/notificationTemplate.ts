import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import {NOTIFICATION_CATEGORY} from "../types/general";

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
  content : {type:string, content:string, href?:string}[];
  quote: string;
}


// Schema designed based on https://github.com/Giveth/giveth-dapps-v2/issues/475
@Entity()
export class NotificationTemplate extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;
  @Column()
  userId: number;
  @Column('text')
  walletAddress: string;
  // Giveth.io project have integer id (Postgres), Trace projects have string id (Mongo)
  // So use string here to support both of them
  @Column('text')
  projectId: string;
  @Column('text')
  title?: string;
  @Column('text')
  type: string;
  @Column('text')
  description: string;

  @Column('jsonb')
  htmlTemplate:HtmlTemplate


  @Column({
    type: 'enum',
    enum: NOTIFICATION_CATEGORY,
    default: NOTIFICATION_CATEGORY.PROJECT_RELATED
  })
  category: NOTIFICATION_CATEGORY;
}
