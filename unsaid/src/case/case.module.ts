import { Module } from '@nestjs/common';
import { CaseController } from './case.controller.js';

@Module({
  controllers: [CaseController]
})
export class CaseModule {}
