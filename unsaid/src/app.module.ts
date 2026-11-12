import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AiModule } from './ai/ai.module.js';
import { CaseModule } from './case/case.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AiModule, CaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}