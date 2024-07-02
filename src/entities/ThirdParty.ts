import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Schema designed based on https://github.com/Giveth/giveth-dapps-v2/issues/475
@Entity()
export class ThirdParty extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Index()
  @Column('text', { unique: true })
  microService: string;

  @Index()
  @Column('text')
  secret: string;

  @Column('boolean', { default: true, nullable: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
