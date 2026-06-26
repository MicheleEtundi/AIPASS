import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Query } from '../../queries/entities/query.entity';
import { User } from '../../users/entities/user.entity';

export enum ResponseStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  EDITED = 'EDITED',
  REJECTED = 'REJECTED',
}

@Entity()
export class AiResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Query)
  query: Query;

  @Column('text')
  draftResponse: string;

  @Column('text', { nullable: true })
  validatedResponse?: string;

  @Column({ type: 'enum', enum: ResponseStatus, default: ResponseStatus.PENDING })
  status: ResponseStatus;

  @ManyToOne(() => User, { nullable: true })
  teacher?: User;

  @CreateDateColumn()
  createdAt: Date;
}