import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Query } from '../queries/entities/query.entity';
import { AiResponse } from '../ai-responses/entities/ai-response.entity';
import { LearnerProfile } from '../learner-profiles/entities/learner-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Query, AiResponse, LearnerProfile])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}