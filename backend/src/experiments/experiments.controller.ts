import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ExperimentsService } from './experiments.service';
import { CreateExperimentDto } from './dto/create-experiment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('experiments')
export class ExperimentsController {
  constructor(private readonly experimentsService: ExperimentsService) {}

  @Post()
  create(@Body() dto: CreateExperimentDto) {
    return this.experimentsService.create(dto);
  }

  @Get()
  findAll() {
    return this.experimentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.experimentsService.findOne(id);
  }
}