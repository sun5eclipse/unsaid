//플레이어가 보낸 설정값을 검사하는 입구 검사표
import { z } from 'zod';
import {
  CASE_TYPE_KEYS,
  DIFFICULTY_KEYS,
  MAX_SUSPECTS,
  MIN_SUSPECTS,
  MOOD_KEYS,
} from './case.constants.js';

export const generateCaseSchema = z.object({
  caseType: z.enum(CASE_TYPE_KEYS),
  mood: z.enum(MOOD_KEYS),
  suspectCount: z
    .number()
    .int()
    .min(MIN_SUSPECTS)
    .max(MAX_SUSPECTS)
    .default(3),
  difficulty: z.enum(DIFFICULTY_KEYS).default('normal'),
});

export type GenerateCaseRequest = z.infer<typeof generateCaseSchema>;
//검사 규칙을 통과한 데이터의 타입