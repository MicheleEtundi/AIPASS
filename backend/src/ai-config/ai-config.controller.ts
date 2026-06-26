import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { AiConfigService } from './ai-config.service';
import { UpdateAiConfigDto } from './dto/update-ai-config.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ai-config')
export class AiConfigController {
  constructor(private readonly aiConfigService: AiConfigService) {}

  @Get(':experimentId')
  getConfig(@Param('experimentId') experimentId: string) {
    return this.aiConfigService.getOrCreate(experimentId);
  }

  @Patch(':experimentId')
  updateConfig(
    @Param('experimentId') experimentId: string,
    @Body() dto: UpdateAiConfigDto,
  ) {
    return this.aiConfigService.update(experimentId, dto);
  }
}