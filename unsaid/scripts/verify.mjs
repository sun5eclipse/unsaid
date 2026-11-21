import fs from 'node:fs';
import Anthropic from '@anthropic-ai/sdk';

const file = process.argv[2];
if (!file) {
  console.error('사용법: node --env-file=.env scripts/verify.mjs <사건.json>');
  process.exit(1);
}

const d = JSON.parse(fs.readFileSync(file, 'utf8'));
if (!d.title) {
  console.error('사건 JSON이 아닙니다. (실패 응답일 수 있어요)');
  process.exit(1);
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// id를 사람이 읽는 문장으로 바꾸는 표
const texts = {};
for (const s of d.suspects) {
  for (const st of s.statements) {
    texts[st.id] = `(${s.name}의 진술) ${st.text}`;
  }
}
for (const c of d.clues) {
  texts[c.id] = `(단서) ${c.description}`;
}

const SYSTEM = [
  '당신은 추리 게임의 논리 검수자입니다.',
  "주어진 '진술'과 '근거들'만 읽고, 그 근거들만으로 진술이 거짓임을 논리적으로 확정할 수 있는지 판단합니다.",
  '',
  '[판단 규칙]',
  '1. 근거에 적혀 있지 않은 사건 고유의 사실(장소의 위치 관계, 인물의 습관, 시각 계산에 필요한 추가 정보 등)을 추측해서 보충하지 않습니다. 그런 보충이 필요하면 숨은 전제로 적습니다.',
  '2. 일반 상식(사람은 동시에 두 곳에 있을 수 없다 등)은 사용해도 됩니다.',
  '3. 근거가 있어도 진술이 참일 수 있으면(근거와 진술이 양립하면) 부족입니다.',
  '4. 근거 문장에 쓰인 정보만으로 진술과 충돌하는 지점을 짚을 수 있어야 충분입니다.',
  '5. 출력은 JSON 객체 하나만, 이 순서로 작성합니다: analysis(한두 문단의 분석), hiddenPremises(숨은 전제 목록, 없으면 빈 배열), verdict("충분" 또는 "부족").',
].join('\n');

for (const k of d.contradictions) {
  const user = [
    '[진술]',
    texts[k.statementId] ?? '(존재하지 않는 id)',
    ...k.refutedBy.map(
      (id, i) => `[근거 ${i + 1}]\n${texts[id] ?? '(존재하지 않는 id)'}`,
    ),
    '',
    '위 근거만으로 이 진술이 거짓이라고 확정할 수 있습니까?',
  ].join('\n');

  const response = await client.messages.create({
    model: process.env.AI_MODEL,
    max_tokens: 1500,
    system: SYSTEM,
    messages: [{ role: 'user', content: user }],
    ...(process.env.AI_DISABLE_THINKING === 'true'
      ? { thinking: { type: 'disabled' } }
      : {}),
  });

  const text = response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('');

  console.log(`\n=== ${k.id} [${k.type ?? '-'}] ===`);
  console.log(text);
}
