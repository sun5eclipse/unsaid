import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { AiService } from '../ai/ai.service.js';
import { CASE_SYSTEM_PROMPT, buildCaseUserPrompt } from './case.prompt.js';
import { createCaseSeed, type CaseSeed } from './case.seed.js';
import { validateCaseAgainstRequest } from './case.validator.js';
import type { GenerateCaseRequest } from './generate-case.schema.js';
import {
  generatedCaseSchema,
  type GeneratedCase,
} from './generated-case.schema.js';

// 사건 생성을 최대 몇 번까지 시도할지 (첫 시도 포함)
const MAX_ATTEMPTS = 3;

// 한 번의 시도 결과: 성공(사건 데이터) 또는 실패(이유와 문제 목록). 씨앗은 항상 함께 돌려준다.
type AttemptResult =
  | { ok: true; data: GeneratedCase; seed: CaseSeed }
  | { ok: false; reason: string; problems: string[]; seed: CaseSeed };

// AI 응답 글에서 첫 '{'부터 마지막 '}'까지만 잘라 JSON 객체로 바꾼다.
function extractJson(text: string): unknown {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) {
    throw new Error('응답에서 JSON을 찾지 못했습니다.');
  }
  return JSON.parse(text.slice(start, end + 1));
}

@Injectable()
export class CaseService {
  private readonly logger = new Logger(CaseService.name);

  constructor(private readonly ai: AiService) {}

  // 최대 MAX_ATTEMPTS번까지 사건 생성을 시도한다.
  async generate(settings: GenerateCaseRequest): Promise<GeneratedCase> {
    let lastFailure: { reason: string; problems: string[] } | undefined;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const result = await this.attemptOnce(settings);

      if (result.ok) {
        this.logger.log(
          `사건 생성 성공 (시도 ${attempt}) seed=${JSON.stringify(result.seed)}`,
        );
        return result.data;
      }

      lastFailure = result;
      this.logger.warn(
        `시도 ${attempt}/${MAX_ATTEMPTS} 실패 - ${result.reason}: ${JSON.stringify(result.problems)} seed=${JSON.stringify(result.seed)}`,
      );
    }

    throw new BadGatewayException({
      message: `AI가 ${MAX_ATTEMPTS}번 시도했지만 올바른 사건을 만들지 못했습니다.`,
      reason: lastFailure?.reason,
      problems: lastFailure?.problems ?? [],
    });
  }

  // 사건 생성 1회: 씨앗 뽑기 → AI 호출 → JSON 변환 → 양식 검사 → 요청 대조 검사
  // 실패해도 예외를 던지지 않고 실패 결과를 돌려준다. (재시도 판단은 위 함수가 함)
  private async attemptOnce(
    settings: GenerateCaseRequest,
  ): Promise<AttemptResult> {
    const seed = createCaseSeed(settings);

    const text = await this.ai.generateText(
      CASE_SYSTEM_PROMPT,
      buildCaseUserPrompt(settings, seed),
      16000,
    );

    let raw: unknown;
    try {
      raw = extractJson(text);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { ok: false, reason: 'JSON 읽기 실패', problems: [message], seed };
    }

    const parsed = generatedCaseSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        ok: false,
        reason: '양식 검사 실패',
        problems: parsed.error.issues.map(
          (issue) => `${issue.path.join('.')}: ${issue.message}`,
        ),
        seed,
      };
    }

    const problems = validateCaseAgainstRequest(parsed.data, settings , seed);
    if (problems.length > 0) {
      return { ok: false, reason: '요청 대조 실패', problems, seed };
    }

    return { ok: true, data: parsed.data, seed };
  }
}