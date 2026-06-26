import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ProficiencyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

@Entity()
export class LearnerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  student: User;

  @Column({ type: 'enum', enum: ProficiencyLevel, default: ProficiencyLevel.BEGINNER })
  level: ProficiencyLevel;

  @Column({ default: 0 })
  performanceScore: number;

  @Column({ default: 0 })
  interactionCount: number;
}