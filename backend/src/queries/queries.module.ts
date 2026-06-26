import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Query } from './entities/query.entity';
import { User } from '../users/entities/user.entity';
import { QueriesService } from './queries.service';
import { QueriesController } from './queries.controller';
import { LearnerProfilesModule } from '../learner-profiles/learner-profiles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Query, User]),
    LearnerProfilesModule,
  ],
  controllers: [QueriesController],
  providers: [QueriesService],
  exports: [QueriesService],
})
export class QueriesModule {}