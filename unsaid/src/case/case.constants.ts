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
    '고전 본격 추리 분위기. 외딴 저택처럼 폐쇄된 공간과 단서 중심의 전개.',
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
      '범인의 진술에는 모순이 정확히 1개만 있다. 그 모순은 시각, 수량, 위치 같은 작은 디테일에 숨어 있으며, 진술 2개 이상과 단서를 조합해야만 발견된다. 범인을 직접 가리키는 단서는 없다. 가짜 단서는 그럴듯하게 만든다.',
  },
};