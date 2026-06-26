import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Query } from '../queries/entities/query.entity';
import { AiResponse, ResponseStatus } from '../ai-responses/entities/ai-response.entity';
import { LearnerProfile, ProficiencyLevel } from '../learner-profiles/entities/learner-profile.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Query)
    private queriesRepo: Repository<Query>,
    @InjectRepository(AiResponse)
    private aiResponseRepo: Repository<AiResponse>,
    @InjectRepository(LearnerProfile)
    private profileRepo: Repository<LearnerProfile>,
  ) {}

  async getQueryCategoryDistribution() {
    const queries = await this.queriesRepo.find();
    const distribution: Record<string, number> = {};
    queries.forEach(q => {
      distribution[q.category] = (distribution[q.category] || 0) + 1;
    });
    return distribution;
  }

  async getApprovalRates() {
    const responses = await this.aiResponseRepo.find();
    return {
      PENDING: responses.filter(r => r.status === ResponseStatus.PENDING).length,
      APPROVED: responses.filter(r => r.status === ResponseStatus.APPROVED).length,
      EDITED: responses.filter(r => r.status === ResponseStatus.EDITED).length,
      REJECTED: responses.filter(r => r.status === ResponseStatus.REJECTED).length,
      total: responses.length,
    };
  }

  async getLevelDistribution() {
    const profiles = await this.profileRepo.find();
    return {
      BEGINNER: profiles.filter(p => p.level === ProficiencyLevel.BEGINNER).length,
      INTERMEDIATE: profiles.filter(p => p.level === ProficiencyLevel.INTERMEDIATE).length,
      ADVANCED: profiles.filter(p => p.level === ProficiencyLevel.ADVANCED).length,
    };
  }

  async getActivityByHour() {
    const queries = await this.queriesRepo.find();
    const hourCounts: Record<number, number> = {};

    for (let i = 0; i < 24; i++) hourCounts[i] = 0;
    queries.forEach(q => {
      const hour = new Date(q.createdAt).getHours();
      hourCounts[hour] += 1;
    });

    return Object.entries(hourCounts).map(([hour, count]) => ({
      hour: parseInt(hour),
      count,
    }));
  }

  async getDashboardSummary() {
    const [categories, approvalRates, levelDist, activityByHour] = await Promise.all([
      this.getQueryCategoryDistribution(),
      this.getApprovalRates(),
      this.getLevelDistribution(),
      this.getActivityByHour(),
    ]);

    return {
      categoryDistribution: categories,
      approvalRates,
      learnerLevelDistribution: levelDist,
      activityByHour,
    };
  }
}