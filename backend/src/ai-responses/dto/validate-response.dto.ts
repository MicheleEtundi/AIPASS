import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ResponseStatus } from '../entities/ai-response.entity';

export class ValidateResponseDto {
  @IsEnum(ResponseStatus)
  status: ResponseStatus;

  @IsOptional()
  @IsString()
  validatedResponse?: string;
}