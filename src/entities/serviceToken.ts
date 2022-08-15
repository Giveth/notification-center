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
export class ServiceToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Index()
  @Column('text', { nullable: false })
  microService: string;

  @Index({ unique: true })
  @Column('text', { nullable: false })
  token: string;

  @Column('boolean', { default: true, nullable: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
