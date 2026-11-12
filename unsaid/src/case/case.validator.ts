import { DIFFICULTY_RULES } from './case.constants.js';
import { deriveCaseNumbers } from './case.rules.js';
import type { GenerateCaseRequest } from './generate-case.schema.js';
import type { GeneratedCase } from './generated-case.schema.js';

export function validateCaseAgainstRequest(
  generated: GeneratedCase,
  settings: GenerateCaseRequest,
): string[] {
  const problems: string[] = [];
  const { clueCount, redHerringCount } = deriveCaseNumbers(
    settings.suspectCount,
  );
  const expectedContradictions =
    DIFFICULTY_RULES[settings.difficulty].contradictions;

  // 1. 요청한 개수와 맞는지
  if (generated.suspects.length !== settings.suspectCount) {
    problems.push(
      `용의자는 ${settings.suspectCount}명이어야 하는데 ${generated.suspects.length}명입니다.`,
    );
  }
  if (generated.clues.length !== clueCount) {
    problems.push(
      `단서는 ${clueCount}개여야 하는데 ${generated.clues.length}개입니다.`,
    );
  }
  const redHerringTotal = generated.clues.filter((c) => c.isRedHerring).length;
  if (redHerringTotal !== redHerringCount) {
    problems.push(
      `가짜 단서는 ${redHerringCount}개여야 하는데 ${redHerringTotal}개입니다.`,
    );
  }
  if (generated.contradictions.length !== expectedContradictions) {
    problems.push(
      `모순은 ${expectedContradictions}개여야 하는데 ${generated.contradictions.length}개입니다.`,
    );
  }

  // 2. id 목록 만들기와 중복 검사
  const suspectIds = new Set(generated.suspects.map((s) => s.id));
  const clueIds = new Set(generated.clues.map((c) => c.id));
  const statementIds = new Set(
    generated.suspects.flatMap((s) => s.statements.map((st) => st.id)),
  );
  const statementTotal = generated.suspects.reduce(
    (sum, s) => sum + s.statements.length,
    0,
  );

  if (suspectIds.size !== generated.suspects.length) {
    problems.push('용의자 id가 중복됩니다.');
  }
  if (clueIds.size !== generated.clues.length) {
    problems.push('단서 id가 중복됩니다.');
  }
  if (statementIds.size !== statementTotal) {
    problems.push('진술 id가 중복됩니다.');
  }

  // 3. 진술 id가 소속 용의자의 형식(s1-1)인지
  for (const suspect of generated.suspects) {
    for (const statement of suspect.statements) {
      if (!statement.id.startsWith(`${suspect.id}-`)) {
        problems.push(
          `진술 ${statement.id}은 용의자 ${suspect.id}의 형식(${suspect.id}-번호)이 아닙니다.`,
        );
      }
    }
  }

  // 4. 범인 id
  if (!suspectIds.has(generated.culpritId)) {
    problems.push(
      `culpritId(${generated.culpritId})가 용의자 목록에 없습니다.`,
    );
  }

  // 5. 단서
  for (const clue of generated.clues) {
    if (!suspectIds.has(clue.pointsTo)) {
      problems.push(
        `단서 ${clue.id}의 pointsTo(${clue.pointsTo})가 용의자 목록에 없습니다.`,
      );
    }
    if (clue.isRedHerring) {
      if (clue.innocentExplanation.trim() === '') {
        problems.push(`가짜 단서 ${clue.id}에 innocentExplanation이 없습니다.`);
      }
      if (clue.pointsTo === generated.culpritId) {
        problems.push(
          `가짜 단서 ${clue.id}는 무고한 용의자를 가리켜야 하는데 범인을 가리킵니다.`,
        );
      }
    }
  }

  // 6. 모순
  const culprit = generated.suspects.find((s) => s.id === generated.culpritId);

  for (const contradiction of generated.contradictions) {
    if (contradiction.suspectId !== generated.culpritId) {
      problems.push(
        `모순 ${contradiction.id}는 범인이 아닌 ${contradiction.suspectId}를 대상으로 합니다.`,
      );
    }

    const target = culprit?.statements.find(
      (st) => st.id === contradiction.statementId,
    );
    if (!target) {
      problems.push(
        `모순 ${contradiction.id}의 statementId(${contradiction.statementId})가 범인의 진술에 없습니다.`,
      );
    } else if (target.isTrue) {
      problems.push(
        `모순 ${contradiction.id}가 대상으로 삼은 진술 ${target.id}이 isTrue: true입니다.`,
      );
    }

    for (const ref of contradiction.refutedBy) {
      if (ref === contradiction.statementId) {
        problems.push(
          `모순 ${contradiction.id}가 자기 자신(${ref})을 근거로 삼고 있습니다.`,
        );
      } else if (!clueIds.has(ref) && !statementIds.has(ref)) {
        problems.push(
          `모순 ${contradiction.id}의 근거 ${ref}가 존재하지 않는 단서/진술입니다.`,
        );
      }
    }
  }

  return problems;
}