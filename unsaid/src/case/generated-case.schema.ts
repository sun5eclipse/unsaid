//AI가 만든 사건이 양식대로 채워졌는지 검사
import { z } from 'zod';
import {
  CONTRADICTION_TYPE_KEYS,
  MAX_SUSPECTS,
  MIN_SUSPECTS,
} from './case.constants.js';
//statementSchema (진술) -> suspectSchema (용의자) -> generatedCaseSchema (사건 전체)

const statementSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  isTrue: z.boolean(), //진술에 대한 모순 (isTrue)
});

const suspectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  age: z.number().int(),
  occupation: z.string().min(1),
  relationToVictim: z.string().min(1),
  personality: z.string().min(1),
  claimedAlibi: z.string().min(1),
  truthAboutNight: z.string().min(1),
  secret: z.string().min(1),
  statements: z.array(statementSchema).length(4), //진술은 4개 고정
});

const clueSchema = z.object({
  id: z.string().min(1),
  description: z.string().min(1),
  pointsTo: z.string().min(1),
  isRedHerring: z.boolean(),
  innocentExplanation: z.string(),
});

const contradictionSchema = z.object({
  id: z.string().min(1),
  type: z.enum(CONTRADICTION_TYPE_KEYS),
  suspectId: z.string().min(1),
  statementId: z.string().min(1),
  refutedBy: z.array(z.string().min(1)).min(1),
  //진술이 모순임을 확인할 수 있는 근거가 하나는 있어야함 
  explanation: z.string().min(1),
});
// 정답지 : 어떤 진술/어떤 단서가 서로 모순을 이루는지 서버에한테 알려줌

export const generatedCaseSchema = z.object({
  title: z.string().min(1),
  setting: z.string().min(1),
  victim: z.object({
    name: z.string().min(1),
    age: z.number().int(),
    occupation: z.string().min(1),
    description: z.string().min(1),
  }),
  crime: z.object({
    type: z.string().min(1),
    time: z.string().min(1),
    location: z.string().min(1),
    method: z.string().min(1),
    motive: z.string().min(1),
  }),
  culpritId: z.string().min(1),
  suspects: z.array(suspectSchema).min(MIN_SUSPECTS).max(MAX_SUSPECTS),
  clues: z.array(clueSchema).min(1),
  contradictions: z.array(contradictionSchema).min(1),
  solution: z.string().min(1),
});

export type GeneratedCase = z.infer<typeof generatedCaseSchema>;