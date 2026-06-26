import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, UpdateDateColumn } from 'typeorm';
import { Experiment } from '../../experiments/entities/experiment.entity';

export enum ResponseLength {
  SHORT = 'SHORT',
  MEDIUM = 'MEDIUM',
  DETAILED = 'DETAILED',
}

export enum ResponseTone {
  FORMAL = 'FORMAL',
  FRIENDLY = 'FRIENDLY',
  SOCRATIC = 'SOCRATIC',
}

export enum ResponseLanguage {
  ENGLISH = 'ENGLISH',
  FRENCH = 'FRENCH',
}

@Entity()
export class AiConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Experiment)
  @JoinColumn()
  experiment: Experiment;

  @Column({ type: 'enum', enum: ResponseLanguage, default: ResponseLanguage.ENGLISH })
  language: ResponseLanguage;

  @Column({ type: 'enum', enum: ResponseLength, default: ResponseLength.MEDIUM })
  responseLength: ResponseLength;

  @Column({ type: 'enum', enum: ResponseTone, default: ResponseTone.FRIENDLY })
  tone: ResponseTone;

  @Column({ type: 'text', nullable: true })
  customInstructions: string;

  @Column({ default: true })
  allowDirectAnswers: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}