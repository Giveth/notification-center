import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';


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
  projectId: string
  @Column('text')
  title ?: string
  @Column('text')
  type : string
  @Column('text')
  description : string

}
