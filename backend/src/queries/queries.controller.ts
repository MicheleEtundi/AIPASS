import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { QueriesService } from './queries.service';
import { CreateQueryDto } from './dto/create-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('queries')
export class QueriesController {
  constructor(private readonly queriesService: QueriesService) {}

  @Post()
  create(@Body() dto: CreateQueryDto, @Request() req) {
    return this.queriesService.create(dto, req.user.email);
  }

  @Get('my-queries')
  myQueries(@Request() req) {
    return this.queriesService.findByStudent(req.user.email);
  }

  @Get()
  findAll() {
    return this.queriesService.findAll();
  }
}