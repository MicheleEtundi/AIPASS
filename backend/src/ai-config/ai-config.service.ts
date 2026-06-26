import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiConfig, ResponseLanguage, ResponseLength, ResponseTone } from './entities/ai-config.entity';
import { UpdateAiConfigDto } from './dto/update-ai-config.dto';

@Injectable()
export class AiConfigService {
  constructor(
    @InjectRepository(AiConfig)
    private aiConfigRepo: Repository<AiConfig>,
  ) {}

  async getOrCreate(experimentId: string): Promise<AiConfig> {
    let config = await this.aiConfigRepo.findOne({
      where: { experiment: { id: experimentId } },
      relations: { experiment: true },
    });

    if (!config) {
      config = this.aiConfigRepo.create({
        experiment: { id: experimentId } as any,
        language: ResponseLanguage.ENGLISH,
        responseLength: ResponseLength.MEDIUM,
        tone: ResponseTone.FRIENDLY,
        allowDirectAnswers: true,
      });
      await this.aiConfigRepo.save(config);
    }

    return config;
  }

  async update(experimentId: string, dto: UpdateAiConfigDto): Promise<AiConfig> {
    const config = await this.getOrCreate(experimentId);
    Object.assign(config, dto);
    return this.aiConfigRepo.save(config);
  }
}