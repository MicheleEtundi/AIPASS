import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiResponse, ResponseStatus } from './entities/ai-response.entity';
import { GroqService } from './groq.service';
import { ValidateResponseDto } from './dto/validate-response.dto';
import { Query } from '../queries/entities/query.entity';
import { LearnerProfile } from '../learner-profiles/entities/learner-profile.entity';
import { User } from '../users/entities/user.entity';
import { AiConfigService } from '../ai-config/ai-config.service';
import { NotificationsGateway } from '../gateway/notifications.gateway';

@Injectable()
export class AiResponsesService {
  constructor(
    @InjectRepository(AiResponse)
    private aiResponseRepo: Repository<AiResponse>,
    @InjectRepository(Query)
    private queriesRepo: Repository<Query>,
    @InjectRepository(LearnerProfile)
    private profileRepo: Repository<LearnerProfile>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private groqService: GroqService,
    private aiConfigService: AiConfigService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async generateForQuery(queryId: string, userEmail: string): Promise<AiResponse> {
    const student = await this.usersRepo.findOne({ where: { email: userEmail } });
    if (!student) throw new NotFoundException('User not found. Please sync first.');

    const query = await this.queriesRepo.findOne({
      where: { id: queryId },
      relations: { experiment: true, student: true },
    });
    if (!query) throw new NotFoundException('Query not found');

    const profile = await this.profileRepo.findOne({
      where: { student: { id: student.id } },
    });
    const level = profile?.level || 'BEGINNER';

    const aiConfig = await this.aiConfigService.getOrCreate(query.experiment?.id);

    const draft = await this.groqService.generateResponse(
      query.question,
      query.category,
      query.experiment?.title || 'General Lab',
      query.experiment?.currentStep || 'General',
      level,
      aiConfig,
    );

    const aiResponse = this.aiResponseRepo.create({
      query: { id: queryId } as any,
      draftResponse: draft,
      status: ResponseStatus.PENDING,
    });

    const saved = await this.aiResponseRepo.save(aiResponse);

    this.notificationsGateway.notifyTeachers({
      studentName: student.name,
      question: query.question,
      category: query.category,
    });

    return saved;
  }

  async validateResponse(id: string, dto: ValidateResponseDto, userEmail: string): Promise<AiResponse> {
    const teacher = await this.usersRepo.findOne({ where: { email: userEmail } });
    if (!teacher) throw new NotFoundException('Teacher not found.');

    const response = await this.aiResponseRepo.findOne({
      where: { id },
      relations: { query: { student: true } },
    });
    if (!response) throw new NotFoundException('Response not found');

    response.status = dto.status;
    response.teacher = { id: teacher.id } as any;
    if (dto.validatedResponse) {
      response.validatedResponse = dto.validatedResponse;
    } else if (dto.status === ResponseStatus.APPROVED) {
      response.validatedResponse = response.draftResponse;
    }

    const saved = await this.aiResponseRepo.save(response);

    const studentEmail = response.query?.student?.email;
    if (studentEmail) {
      this.notificationsGateway.notifyStudent(studentEmail, {
        status: dto.status,
        question: response.query.question,
      });
    }

    return saved;
  }

  async consultTeacher(
    id: string,
    teacherQuestion: string,
    conversationHistory: { role: 'user' | 'assistant'; content: string }[],
  ): Promise<{ reply: string }> {
    const response = await this.aiResponseRepo.findOne({
      where: { id },
      relations: { query: { student: true, experiment: true } },
    });
    if (!response) throw new NotFoundException('Response not found');

    const profile = await this.profileRepo.findOne({
      where: { student: { id: response.query?.student?.id } },
    });
    const level = profile?.level || 'BEGINNER';

    const reply = await this.groqService.consultTeacher(
      teacherQuestion,
      response.query?.question || '',
      response.draftResponse || '',
      level,
      response.query?.experiment?.title || 'General Lab',
      conversationHistory,
    );

    return { reply };
  }

  async getPendingResponses(): Promise<AiResponse[]> {
    return this.aiResponseRepo.find({
      where: { status: ResponseStatus.PENDING },
      relations: { query: { student: true, experiment: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async getAllForStudent(userEmail: string): Promise<AiResponse[]> {
    const student = await this.usersRepo.findOne({ where: { email: userEmail } });
    if (!student) return [];

    return this.aiResponseRepo.find({
      where: { query: { student: { id: student.id } } },
      relations: { query: { experiment: true } },
      order: { createdAt: 'ASC' },
    });
  }
}