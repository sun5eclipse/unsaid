import { Controller, Get } from '@nestjs/common';
import { AiService } from './ai.service.js';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('ping')
  async ping() {
    const text = await this.aiService.generateText(
      '당신은 짧게 대답하는 도우미입니다.',
      '한 문장으로 인사해 주세요.',
      100,
    );
    return { text };
  }
}