import {
  CASE_TYPE_PROMPTS,
  CONTRADICTION_TYPE_PROMPTS,
  DIFFICULTY_RULES,
  MOOD_PROMPTS,
} from './case.constants.js';
import { deriveCaseNumbers } from './case.rules.js';
import type { GenerateCaseRequest } from './generate-case.schema.js';
import type { CaseSeed } from './case.seed.js';
export const CASE_SYSTEM_PROMPT = [
  '당신은 추리 게임 "unsaid"의 사건 설계자입니다.',
  '플레이어가 용의자들을 심문하여 범인을 찾는 게임의 사건을 만듭니다.',
  '',
  '[출력 규칙]',
  '1. 출력은 JSON 객체 하나만 출력합니다. 설명, 인사, 마크다운 코드블록을 붙이지 않습니다.',
  '2. JSON의 키는 영어, 값은 한국어로 작성합니다.',
  '3. id는 용의자 s1~sN, 단서 c1~cM, 진술 s1-1 형식(용의자id-번호), 모순 k1~kN 형식을 따릅니다.',
  '',
  '[사건 설계 규칙]',
  '4. 범인은 정확히 한 명이며, culpritId는 suspects 안에 실제로 존재하는 id여야 합니다.',
  '5. 용의자 수, 단서 수, 가짜 단서 수, 모순 수는 사용자 요청에 적힌 숫자를 정확히 따릅니다.',
  '6. 모든 용의자는 피해자와 연결된 동기나 비밀이 하나씩 있어야 합니다. 범인이 아니어도 수상해 보여야 합니다.',
  '7. 각 용의자는 진술(statements)을 정확히 4개씩 가집니다. 진술은 그 사람이 심문에서 실제로 말할 내용입니다.',
  '8. 모순(contradictions)은 범인의 진술에 대해서만 만듭니다.',
  '   - 모순의 대상 진술은 isTrue: false 여야 합니다.',
  '   - refutedBy에는 그 진술을 실제로 깨뜨리는 단서 id 또는 다른 용의자의 진술 id를 적습니다.',
  '   - refutedBy에는 대상 진술(statementId) 자신을 넣지 않습니다.',
  '   - 적힌 근거가 논리적으로 정말 그 진술과 충돌해야 합니다. 충돌하지 않는 것을 모순이라고 적지 않습니다.',
  '9. 범인이 아닌 용의자의 진술에는 진짜 모순이 없어야 합니다. 그들이 의심스러워 보이는 이유는 가짜 단서(isRedHerring: true)나 비밀로만 만들고, 가짜 단서에는 반드시 innocentExplanation을 적습니다.',
  '   - 단서의 pointsTo는 그 단서 때문에 의심받게 되는 용의자의 id입니다.',
  '   - 가짜 단서의 pointsTo는 반드시 범인이 아닌 용의자의 id여야 합니다. 범인을 가리키는 단서는 가짜 단서가 될 수 없습니다.',
  '10. 사건은 논리적으로 해결 가능해야 합니다. 진술과 단서만으로 범인과 그 근거를 추리할 수 있어야 합니다.',
  '11. 실존 인물, 실제 사건, 잔인한 묘사는 사용하지 않습니다.',
].join('\n');

const CASE_JSON_FORMAT = `{
  "title": "사건 제목",
  "setting": "배경 (장소, 시간대, 분위기)",
  "victim": { "name": "", "age": 0, "occupation": "", "description": "" },
  "crime": { "type": "", "time": "", "location": "", "method": "", "motive": "" },
  "culpritId": "위에서 지정한 범인 id",
  "suspects": [
    {
      "id": "s1", "name": "", "age": 0, "occupation": "",
      "relationToVictim": "", "personality": "",
      "claimedAlibi": "", "truthAboutNight": "", "secret": "",
      "statements": [ { "id": "s1-1", "text": "", "isTrue": true } ]
    }
  ],
  "clues": [
    { "id": "c1", "description": "", "pointsTo": "의심받게 되는 용의자 id (가짜 단서는 범인이 아닌 id)", "isRedHerring": false, "innocentExplanation": "" }
  ],
  "contradictions": [
    { "id": "k1", "type": "위에서 지정한 유형 값", "suspectId": "범인 id", "statementId": "위에서 지정한 대상 진술 id", "refutedBy": ["이 진술을 깨뜨리는 단서 id 또는 다른 진술 id"], "explanation": "" }
  ],
  "solution": "진상 요약"
}`;


export function buildCaseUserPrompt(
  settings: GenerateCaseRequest,  
  seed: CaseSeed,
): string {
  const { clueCount, redHerringCount } = deriveCaseNumbers(
    settings.suspectCount,
  );
  const difficulty = DIFFICULTY_RULES[settings.difficulty];
  const realClueCount = clueCount - redHerringCount;

  const contradictionLines = seed.contradictionTypes.map(
    (type, index) =>
      `  - k${index + 1}: 대상 진술은 ${seed.lieStatementIds[index]} (isTrue: false), type 값은 "${type}". ${CONTRADICTION_TYPE_PROMPTS[type]}`,
  );

  return [
    '다음 조건으로 새로운 사건을 만들어 주세요.',
    `- 사건 유형: ${CASE_TYPE_PROMPTS[settings.caseType]}`,
    `- 분위기: ${MOOD_PROMPTS[settings.mood]}`,
    `- 사건 배경: ${seed.setting}`,
    `- 범행 동기: ${seed.motive}`,
    `- 용의자 수: ${settings.suspectCount}명`,
    `- 범인: ${seed.culpritId} (culpritId는 반드시 이 값으로 한다)`,
    `- 단서 수: ${clueCount}개`,
    `- 단서 역할: c1~c${realClueCount}는 진짜 단서(isRedHerring: false), c${realClueCount + 1}~c${clueCount}는 가짜 단서(isRedHerring: true)`,
    `- 난이도: ${difficulty.prompt}`,
    `- 범인의 모순 수: ${difficulty.contradictions}개`,
    '- 모순 지정 (모순 id, 대상 진술, 유형을 아래대로 만든다):',
    ...contradictionLines,
    `- 범인(${seed.culpritId})의 진술 중 위에서 지정한 진술만 isTrue: false로 하고, 범인의 나머지 진술은 isTrue: true로 한다.`,
    '아래 JSON 구조를 정확히 따르세요. 가짜 단서가 아닌 단서의 innocentExplanation은 빈 문자열("")로 둡니다.',
    CASE_JSON_FORMAT,
  ].join('\n');
}