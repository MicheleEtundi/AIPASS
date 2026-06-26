import { Controller, Post, Patch, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { AiResponsesService } from './ai-responses.service';
import { ValidateResponseDto } from './dto/validate-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ai-responses')
export class AiResponsesController {
  constructor(private readonly aiResponsesService: AiResponsesService) {}

  @Post('generate/:queryId')
  generate(@Param('queryId') queryId: string, @Request() req) {
    return this.aiResponsesService.generateForQuery(queryId, req.user.email);
  }

  @Get('pending')
  getPending() {
    return this.aiResponsesService.getPendingResponses();
  }

  @Patch('validate/:id')
  validate(
    @Param('id') id: string,
    @Body() dto: ValidateResponseDto,
    @Request() req,
  ) {
    return this.aiResponsesService.validateResponse(id, dto, req.user.email);
  }

  @Get('my-responses')
  myResponses(@Request() req) {
    return this.aiResponsesService.getAllForStudent(req.user.email);
  }

  @Post('consult/:id')
  consult(
    @Param('id') id: string,
    @Body() body: {
      teacherQuestion: string;
      conversationHistory: { role: 'user' | 'assistant'; content: string }[];
    },
  ) {
    return this.aiResponsesService.consultTeacher(
      id,
      body.teacherQuestion,
      body.conversationHistory || [],
    );
  }
}