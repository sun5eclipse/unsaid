export const CASE_TYPE_KEYS = ['murder', 'theft', 'missing', 'fraud'] as const;
export const MOOD_KEYS = ['modern', 'classic', 'horror', 'comic'] as const;
export const DIFFICULTY_KEYS = ['easy', 'normal', 'hard'] as const;

export type CaseType = (typeof CASE_TYPE_KEYS)[number];
export type Mood = (typeof MOOD_KEYS)[number];
export type Difficulty = (typeof DIFFICULTY_KEYS)[number];

export const MIN_SUSPECTS = 3;
export const MAX_SUSPECTS = 6;

export const CASE_TYPE_PROMPTS: Record<CaseType, string> = {
  murder: '살인 사건. 피해자가 사망했고 범인은 용의자 중 한 명이다.',
  theft: '절도 사건. 값비싼 물건이 사라졌고 범인은 용의자 중 한 명이다.',
  missing:
    '실종 사건. 실종자가 있고 그 실종에 관여한 사람이 용의자 중 한 명이다.',
  fraud: '횡령·사기 사건. 돈이 사라졌고 그 일을 꾸민 사람이 용의자 중 한 명이다.',
};

export const MOOD_PROMPTS: Record<Mood, string> = {
  modern:
    '현대 한국이 배경인 현실적인 분위기. 휴대폰, CCTV 같은 요소가 등장한다.',
  classic:
    '고전 본격 추리 분위기. 폐쇄된 상황과 단서 중심의 전개.',
  horror:
    '공포·스릴러 분위기. 으스스하고 긴장감 있는 묘사. 단, 잔인한 묘사는 피한다.',
  comic:
    '가볍고 유머러스한 분위기. 엉뚱한 인물들이 등장하지만 추리 논리는 진지하게 유지한다.',
};

export const DIFFICULTY_RULES: Record<
  Difficulty,
  { contradictions: number; prompt: string }
> = {
  easy: {
    contradictions: 3,
    prompt:
      '범인의 진술에는 모순이 정확히 3개 있다. 각 모순은 단서 하나만 보면 바로 알 수 있을 만큼 직접적이다. 범인을 직접 가리키는 단서가 1개 이상 있다. 가짜 단서는 허술하다.',
  },
  normal: {
    contradictions: 2,
    prompt:
      '범인의 진술에는 모순이 정확히 2개 있다. 하나는 단서와 비교해야, 다른 하나는 다른 용의자의 진술과 비교해야 알 수 있다. 범인을 직접 가리키는 단서는 약하게만 존재한다.',
  },
  hard: {
    contradictions: 1,
    prompt:
      '범인의 진술에는 모순이 정확히 1개만 있다. 그 모순은 작은 디테일에 숨어 있으며, 진술 2개 이상과 단서를 조합해야만 발견된다. 범인을 직접 가리키는 단서는 없다. 가짜 단서는 그럴듯하게 만든다.',
  },
};

// ===== 사건 다양성용 목록 (서버가 요청마다 무작위로 뽑아 AI에게 지정) =====

export const CONTRADICTION_TYPE_KEYS = [
  'alibi',
  'knowledge',
  'possession',
  'habit',
  'relationship',
  'record',
  'expertise',
] as const;

export type ContradictionType = (typeof CONTRADICTION_TYPE_KEYS)[number];

export const CONTRADICTION_TYPE_PROMPTS: Record<ContradictionType, string> = {
  alibi:
    '알리바이 모순: 범인이 말한 행적(이동 경로, 함께 있던 사람)이 다른 증거와 어긋난다. 시계의 시각을 핵심 근거로 쓰지 않는다.',
  knowledge:
    '지식 모순: 범인이 아직 공개되지 않은 사실을 이미 아는 것처럼 말한다.',
  possession:
    '소지품 모순: 범인이 없다고 하거나 만진 적 없다고 한 물건이 현장이나 다른 곳에서 나온다.',
  habit:
    '습관·신체 모순: 범인의 평소 특징(주로 쓰는 손, 체질, 시력, 키, 버릇)과 진술한 행동이 맞지 않는다.',
  relationship:
    '관계 모순: 범인이 모른다거나 친하지 않다고 한 사람과의 관계를 보여주는 흔적이 있다.',
  record:
    '기록 모순: 분위기에 맞는 기록(장부, 영수증, 방명록, 편지, 통화·출입 기록 등)이 범인의 진술과 다르다.',
  expertise:
    '전문성 모순: 범인의 직업이나 경력상 당연히 알아야 할 것을 모른다고 하거나, 알 리 없는 것을 아는 것처럼 말한다.',
};

export const SETTING_POOL: readonly string[] = [
  '눈보라로 길이 끊긴 산장',
  '폭우로 운행이 멈춘 심야 열차',
  '개교기념 행사가 한창인 사립 대학 연구동',
  '배가 하루에 한 번만 들어오는 외딴 섬마을',
  '손님이 가득 찬 한옥 호텔',
  '개관 전날 밤의 사립 미술관',
  '마지막 공연을 앞둔 작은 극단의 극장',
  '수확철의 오래된 전통 양조장',
  '항해 중인 소형 유람선',
  '폐업을 앞둔 대형 서점',
];

export const MOTIVE_POOL: readonly string[] = [
  '금전: 횡령이나 빚을 숨기려는 목적',
  '상속·유언: 재산이나 유언 내용과 관련된 목적',
  '원한·복수: 과거에 당한 일에 대한 앙갚음',
  '비밀 폭로 방지: 피해자가 알게 된 비밀을 막으려는 목적',
  '사랑·질투: 관계에서 비롯된 감정',
  '명예·경력 보호: 지위나 평판을 지키려는 목적',
  '과거 사건 은폐: 오래전 일이 드러나는 것을 막으려는 목적',
  '사업 이권: 계약이나 지분을 둘러싼 갈등',
];