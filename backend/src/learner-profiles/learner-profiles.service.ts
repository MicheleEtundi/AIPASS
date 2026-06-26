import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearnerProfile, ProficiencyLevel } from './entities/learner-profile.entity';
import { User } from '../users/entities/user.entity';
import { UpdateLearnerProfileDto } from './dto/update-learner-profile.dto';

@Injectable()
export class LearnerProfilesService {
  constructor(
    @InjectRepository(LearnerProfile)
    private profileRepo: Repository<LearnerProfile>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async getOrCreate(userEmail: string): Promise<LearnerProfile> {
    const user = await this.usersRepo.findOne({ where: { email: userEmail } });
    if (!user) throw new NotFoundException('User not found');

    let profile = await this.profileRepo.findOne({
      where: { student: { id: user.id } },
      relations: { student: true },
    });

    if (!profile) {
      profile = this.profileRepo.create({
        student: user,
        level: ProficiencyLevel.BEGINNER,
        performanceScore: 0,
        interactionCount: 0,
      });
      await this.profileRepo.save(profile);
    }

    return profile;
  }

  async update(userEmail: string, dto: UpdateLearnerProfileDto): Promise<LearnerProfile> {
    const profile = await this.getOrCreate(userEmail);
    Object.assign(profile, dto);
    return this.profileRepo.save(profile);
  }

  async incrementInteraction(userEmail: string): Promise<void> {
    const profile = await this.getOrCreate(userEmail);
    profile.interactionCount += 1;

    // Auto-adapt level based on interaction count and performance
    if (profile.interactionCount >= 20 && profile.performanceScore >= 75) {
      profile.level = ProficiencyLevel.ADVANCED;
    } else if (profile.interactionCount >= 10 && profile.performanceScore >= 50) {
      profile.level = ProficiencyLevel.INTERMEDIATE;
    }

    await this.profileRepo.save(profile);
  }

  async findAll(): Promise<LearnerProfile[]> {
    return this.profileRepo.find({
      relations: { student: true },
      order: { interactionCount: 'DESC' },
    });
  }

  async getLevelDistribution() {
    const profiles = await this.profileRepo.find();
    return {
      BEGINNER: profiles.filter(p => p.level === ProficiencyLevel.BEGINNER).length,
      INTERMEDIATE: profiles.filter(p => p.level === ProficiencyLevel.INTERMEDIATE).length,
      ADVANCED: profiles.filter(p => p.level === ProficiencyLevel.ADVANCED).length,
    };
  }
}