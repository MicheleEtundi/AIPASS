import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { LearnerProfilesService } from './learner-profiles.service';
import { UpdateLearnerProfileDto } from './dto/update-learner-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('learner-profiles')
export class LearnerProfilesController {
  constructor(private readonly learnerProfilesService: LearnerProfilesService) {}

  // Student gets their own profile
  @Get('me')
  getMyProfile(@Request() req) {
    return this.learnerProfilesService.getOrCreate(req.user.email);
  }

  // Teacher updates a student's profile
  @Patch('me')
  update(@Request() req, @Body() dto: UpdateLearnerProfileDto) {
    return this.learnerProfilesService.update(req.user.email, dto);
  }

  // Teacher sees all profiles
  @Get()
  findAll() {
    return this.learnerProfilesService.findAll();
  }

  // Teacher sees level distribution for analytics
  @Get('distribution')
  distribution() {
    return this.learnerProfilesService.getLevelDistribution();
  }
}