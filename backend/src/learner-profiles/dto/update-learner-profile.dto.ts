import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ProficiencyLevel } from '../entities/learner-profile.entity';

export class UpdateLearnerProfileDto {
  @IsOptional()
  @IsEnum(ProficiencyLevel)
  level?: ProficiencyLevel;

  @IsOptional()
  @IsNumber()
  performanceScore?: number;
}