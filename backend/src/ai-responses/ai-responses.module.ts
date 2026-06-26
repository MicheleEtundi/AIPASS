import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiResponse } from './entities/ai-response.entity';
import { AiResponsesService } from './ai-responses.service';
import { AiResponsesController } from './ai-responses.controller';
import { GroqService } from './groq.service';
import { Query } from '../queries/entities/query.entity';
import { LearnerProfile } from '../learner-profiles/entities/learner-profile.entity';
import { User } from '../users/entities/user.entity';
import { AiConfigModule } from '../ai-config/ai-config.module';
import { GatewayModule } from '../gateway/gateway.module';



@Module({
  imports: [TypeOrmModule.forFeature([AiResponse, Query, LearnerProfile, User]), AiConfigModule, GatewayModule],
  controllers: [AiResponsesController],
  providers: [AiResponsesService, GroqService],
  exports: [AiResponsesService],
})
export class AiResponsesModule {}