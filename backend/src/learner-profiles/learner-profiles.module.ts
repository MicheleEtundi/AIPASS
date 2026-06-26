import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearnerProfile } from './entities/learner-profile.entity';
import { User } from '../users/entities/user.entity';
import { LearnerProfilesService } from './learner-profiles.service';
import { LearnerProfilesController } from './learner-profiles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LearnerProfile, User])],
  controllers: [LearnerProfilesController],
  providers: [LearnerProfilesService],
  exports: [LearnerProfilesService],
})
export class LearnerProfilesModule {}