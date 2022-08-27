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

// Schema designed based on https://github.com/Giveth/giveth-dapps-v2/issues/475
@Entity()
export class ThirdParty extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Index()
  @Column('text')
  microService: string;

  @Index({ unique: true })
  @Column('text')
  secret: string;

  @Column('boolean', { default: true, nullable: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
