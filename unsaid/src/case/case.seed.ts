import {
  CONTRADICTION_TYPE_KEYS,
  DIFFICULTY_RULES,
  MOTIVE_POOL,
  SETTING_POOL_BY_MOOD,
  type ContradictionType,
} from './case.constants.js';
import type { GenerateCaseRequest } from './generate-case.schema.js';

// 서버가 요청마다 뽑아서 AI에게 지정해 줄 조건 묶음
export interface CaseSeed {
  culpritId: string; // 범인 번호 (s1 ~ sN)
  setting: string; // 사건 배경
  motive: string; // 범행 동기 유형
  contradictionTypes: ContradictionType[]; // 모순 유형 (모순 개수만큼, 서로 다름)
  lieStatementIds: string[]; // 모순 대상이 되는 범인의 진술 id (모순 k1, k2...와 같은 순서)
}

// 목록에서 하나를 무작위로 고른다.
function pickOne<T>(items: readonly T[]): T {
  const index = Math.floor(Math.random() * items.length);
  return items[index] as T;
}

// 목록에서 중복 없이 count개를 무작위로 고른다.
function pickMany<T>(items: readonly T[], count: number): T[] {
  const pool = [...items];
  const picked: T[] = [];
  while (picked.length < count && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(index, 1)[0] as T);
  }
  return picked;
}

export function createCaseSeed(settings: GenerateCaseRequest): CaseSeed {
  const culpritNumber = Math.floor(Math.random() * settings.suspectCount) + 1;
  const culpritId = `s${culpritNumber}`;
  const contradictionCount =
    DIFFICULTY_RULES[settings.difficulty].contradictions;

  return {
    culpritId,
    setting: pickOne(SETTING_POOL_BY_MOOD[settings.mood]),
    motive: pickOne(MOTIVE_POOL),
    contradictionTypes: pickMany(CONTRADICTION_TYPE_KEYS, contradictionCount),
    // 진술은 용의자마다 4개(1~4번)라서, 그중 거짓으로 만들 번호를 무작위로 뽑는다.
    lieStatementIds: pickMany([1, 2, 3, 4], contradictionCount).map(
      (n) => `${culpritId}-${n}`,
    ),
  };
}