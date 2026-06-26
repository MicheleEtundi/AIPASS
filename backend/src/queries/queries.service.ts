import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Query } from './entities/query.entity';
import { CreateQueryDto } from './dto/create-query.dto';
import { User } from '../users/entities/user.entity';
import { LearnerProfilesService } from '../learner-profiles/learner-profiles.service';

@Injectable()
export class QueriesService {
  constructor(
    @InjectRepository(Query)
    private queriesRepo: Repository<Query>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private learnerProfilesService: LearnerProfilesService,
  ) {}

  async create(dto: CreateQueryDto, userEmail: string): Promise<Query> {
    const student = await this.usersRepo.findOne({ where: { email: userEmail } });
    if (!student) throw new NotFoundException('User not found. Please sync first via POST /users/sync');

    const query = this.queriesRepo.create({
      question: dto.question,
      category: dto.category,
      student: { id: student.id } as any,
      experiment: { id: dto.experimentId } as any,
    });
    const saved = await this.queriesRepo.save(query);

    // Auto-increment learner interaction count for adaptive profiling
    await this.learnerProfilesService.incrementInteraction(userEmail);

    return saved;
  }

  async findByStudent(userEmail: string): Promise<Query[]> {
    const student = await this.usersRepo.findOne({ where: { email: userEmail } });
    if (!student) return [];
    return this.queriesRepo.find({
      where: { student: { id: student.id } },
      relations: { experiment: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(): Promise<Query[]> {
    return this.queriesRepo.find({
      relations: { student: true, experiment: true },
      order: { createdAt: 'DESC' },
    });
  }
}