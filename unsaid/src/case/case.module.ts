import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module.js';
import { CaseController } from './case.controller.js';
import { CaseService } from './case.service.js';

@Module({
  imports: [AiModule],
  controllers: [CaseController],
  providers: [CaseService],
})
export class CaseModule {}
