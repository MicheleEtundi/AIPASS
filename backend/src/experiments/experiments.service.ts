import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experiment } from './entities/experiment.entity';
import { CreateExperimentDto } from './dto/create-experiment.dto';

@Injectable()
export class ExperimentsService {
  constructor(
    @InjectRepository(Experiment)
    private experimentsRepo: Repository<Experiment>,
  ) {}

  async create(dto: CreateExperimentDto): Promise<Experiment> {
    const experiment = this.experimentsRepo.create(dto);
    return this.experimentsRepo.save(experiment);
  }

  async findAll(): Promise<Experiment[]> {
    return this.experimentsRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Experiment> {
    const experiment = await this.experimentsRepo.findOne({ where: { id } });
    if (!experiment) throw new NotFoundException('Experiment not found');
    return experiment;
  }
}