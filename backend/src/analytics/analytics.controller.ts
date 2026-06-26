import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboard() {
    return this.analyticsService.getDashboardSummary();
  }

  @Get('categories')
  getCategories() {
    return this.analyticsService.getQueryCategoryDistribution();
  }

  @Get('approval-rates')
  getApprovalRates() {
    return this.analyticsService.getApprovalRates();
  }

  @Get('level-distribution')
  getLevelDistribution() {
    return this.analyticsService.getLevelDistribution();
  }

  @Get('activity')
  getActivity() {
    return this.analyticsService.getActivityByHour();
  }
}