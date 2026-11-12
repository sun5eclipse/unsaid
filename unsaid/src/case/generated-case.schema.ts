import { z } from 'zod';
import { MAX_SUSPECTS, MIN_SUSPECTS } from './case.constants.js';

const statementSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  isTrue: z.boolean(),
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
  statements: z.array(statementSchema).length(4),
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
  suspectId: z.string().min(1),
  statementId: z.string().min(1),
  refutedBy: z.array(z.string().min(1)).min(1),
  explanation: z.string().min(1),
});

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