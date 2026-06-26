import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Experiment } from '../../experiments/entities/experiment.entity';

export enum QueryCategory {
  PROCEDURE = 'Procedure Guidance',
  CONCEPT = 'Concept Explanation',
  CALCULATION = 'Calculation Assistance',
  RESULT = 'Result Interpretation',
  REPORT = 'Laboratory Report Writing',
}

@Entity()
export class Query {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  student: User;

  @ManyToOne(() => Experiment)
  experiment: Experiment;

  @Column('text')
  question: string;

  @Column({ type: 'enum', enum: QueryCategory })
  category: QueryCategory;

  @CreateDateColumn()
  createdAt: Date;
}