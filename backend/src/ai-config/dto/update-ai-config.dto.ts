import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ResponseLanguage, ResponseLength, ResponseTone } from '../entities/ai-config.entity';

export class UpdateAiConfigDto {
  @IsOptional()
  @IsEnum(ResponseLanguage)
  language?: ResponseLanguage;

  @IsOptional()
  @IsEnum(ResponseLength)
  responseLength?: ResponseLength;

  @IsOptional()
  @IsEnum(ResponseTone)
  tone?: ResponseTone;

  @IsOptional()
  @IsString()
  customInstructions?: string;

  @IsOptional()
  @IsBoolean()
  allowDirectAnswers?: boolean;
}