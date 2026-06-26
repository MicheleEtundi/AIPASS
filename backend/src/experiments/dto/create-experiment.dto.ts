import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateExperimentDto {
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  currentStep?: string;
}