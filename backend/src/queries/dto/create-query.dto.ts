import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { QueryCategory } from '../entities/query.entity';

export class CreateQueryDto {
  @IsUUID()
  experimentId: string;

  @IsNotEmpty()
  question: string;

  @IsEnum(QueryCategory)
  category: QueryCategory;
}