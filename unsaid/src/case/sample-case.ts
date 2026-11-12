export const sampleCase = {
  title: '폭풍설의 밤, 멈춰 버린 체스 시계',
  setting:
    '눈보라로 길이 끊긴 외딴 저택 설송관. 전화선마저 끊긴 겨울밤, 저택 안에는 주인을 포함해 단 네 사람뿐이다.',
  victim: {
    name: '한도영',
    age: 62,
    occupation: '무역회사 대표',
    description:
      '골동품 수집이 취미인 저택 주인. 2층 서재에서 뒤통수를 맞고 숨진 채 발견되었다.',
  },
  crime: {
    type: '살인',
    time: '밤 11시 20분경',
    location: '2층 서재',
    method: '책상 위의 청동 문진으로 뒤통수를 가격했다.',
    motive: '회사 자금 횡령이 폭로되는 것을 막으려는 목적이었다.',
  },
  culpritId: 's2',
  suspects: [
    {
      id: 's1',
      name: '서윤재',
      age: 58,
      occupation: '저택 집사',
      relationToVictim: '20년째 한도영을 모셔 온 집사',
      personality: '정중하고 말수가 적으며, 곤란한 질문에는 잠시 뜸을 들인다.',
      claimedAlibi: '밤 10시부터 11시 반까지 주방에서 일하고 있었다.',
      truthAboutNight:
        '주방에서 일하다 11시 40분경 야식을 들고 서재에 갔다가 시신을 발견했다.',
      secret: '주인 몰래 장식장의 도자기를 팔아 도박 빚을 갚았다.',
      statements: [
        {
          id: 's1-1',
          text: '저는 밤 10시부터 11시 반까지 주방에서 내일 아침 준비와 설거지를 하고 있었습니다.',
          isTrue: true,
        },
        {
          id: 's1-2',
          text: '11시 40분쯤 주인님께 야식을 가져다드리려고 서재 문을 열었다가 쓰러져 계신 모습을 봤습니다.',
          isTrue: true,
        },
        {
          id: 's1-3',
          text: '그날 밤 서재 문은 잠겨 있지 않았습니다. 열쇠는 주인님과 저만 가지고 있지만요.',
          isTrue: true,
        },
        {
          id: 's1-4',
          text: '요즘 주인님은 서재에서 회사 장부를 자주 들여다보시며 한숨을 쉬셨습니다.',
          isTrue: true,
        },
      ],
    },
    {
      id: 's2',
      name: '강미란',
      age: 45,
      occupation: '무역회사 공동 대표',
      relationToVictim: '20년 된 사업 동업자',
      personality:
        '차분하고 말이 조리 있으며, 불리한 질문에는 질문으로 되받아치는 버릇이 있다.',
      claimedAlibi: '11시 무렵 거실에서 오태성과 체스를 두고 있었다.',
      truthAboutNight:
        '10시 40분경 서재로 올라가 장부 문제로 한도영과 다투다 11시 20분경 청동 문진으로 그를 쳤다. 이후 거실로 돌아와 앉아 있다가 비명이 들리자 합류했다.',
      secret: '회사 자금 일부를 몰래 빼돌렸고, 한도영이 이를 알아냈다.',
      statements: [
        {
          id: 's2-1',
          text: '11시 괘종시계가 울릴 때 저는 거실에서 오태성 씨와 체스를 두고 있었어요.',
          isTrue: false,
        },
        {
          id: 's2-2',
          text: '한 대표님과 회사 일로 의견이 갈린 적은 있지만, 오래된 동업자 사이라 크게 다툴 일은 없었어요.',
          isTrue: true,
        },
        {
          id: 's2-3',
          text: '저녁 식사가 끝난 9시 반쯤 한 대표님은 서재로 올라가셨고, 저는 거실로 갔어요.',
          isTrue: true,
        },
        {
          id: 's2-4',
          text: '눈보라 때문에 전화도 불통이어서, 비명을 듣고서야 무슨 일이 생긴 걸 알았어요.',
          isTrue: true,
        },
      ],
    },
    {
      id: 's3',
      name: '오태성',
      age: 29,
      occupation: '대학원생',
      relationToVictim: '한도영의 조카',
      personality: '말이 빠르고 쉽게 흥분하며, 의심받으면 방어적으로 변한다.',
      claimedAlibi: '10시 반 이후로는 방에 혼자 있었다.',
      truthAboutNight:
        '저녁 식사 전에 유언장 내용을 확인하려고 서재를 몰래 뒤졌고, 체스를 둔 뒤 10시 반에 방으로 올라갔다가 11시 40분 비명을 듣고 내려왔다.',
      secret: '삼촌의 유언장 내용을 몰래 확인하려고 서재 서랍을 뒤졌다.',
      statements: [
        {
          id: 's3-1',
          text: '저녁 식사 후에 강미란 씨와 거실에서 체스를 한 판 뒀습니다.',
          isTrue: true,
        },
        {
          id: 's3-2',
          text: '체스는 10시 반쯤 끝났고, 제가 먼저 일어나 방으로 올라갔어요. 11시 넘어서까지 혼자 있었습니다.',
          isTrue: true,
        },
        {
          id: 's3-3',
          text: '얼마 전 삼촌에게 생활비를 올려 달라고 했다가 거절당한 적이 있어요.',
          isTrue: true,
        },
        {
          id: 's3-4',
          text: '11시 40분쯤 집사님의 비명을 듣고 방에서 뛰어 내려왔습니다.',
          isTrue: true,
        },
      ],
    },
  ],
  clues: [
    {
      id: 'c1',
      description: '서재 책상 위 회사 장부의 마지막 몇 장이 찢겨 나가 있다.',
      pointsTo: 's2',
      isRedHerring: false,
      innocentExplanation: '',
    },
    {
      id: 'c2',
      description: '검시 결과 사망 추정 시각은 밤 11시에서 11시 30분 사이이다.',
      pointsTo: 's2',
      isRedHerring: false,
      innocentExplanation: '',
    },
    {
      id: 'c3',
      description:
        '거실 체스판 옆의 체스 시계가 10시 32분에서 멈춰 있고, 말들은 한 판이 끝난 상태로 놓여 있다.',
      pointsTo: 's2',
      isRedHerring: false,
      innocentExplanation: '',
    },
    {
      id: 'c4',
      description: '서재 장식장에서 값비싼 도자기 하나가 사라져 있다.',
      pointsTo: 's1',
      isRedHerring: true,
      innocentExplanation:
        '집사가 도박 빚을 갚으려고 오래전에 몰래 판 것이며, 살인과는 무관하다.',
    },
    {
      id: 'c5',
      description: '서재 서랍이 열려 있고 서류가 흐트러져 있다.',
      pointsTo: 's3',
      isRedHerring: true,
      innocentExplanation:
        '오태성이 저녁 식사 전에 유언장을 찾으려고 뒤진 흔적일 뿐, 범행 시각과는 무관하다.',
    },
  ],
  contradictions: [
    {
      id: 'k1',
      suspectId: 's2',
      statementId: 's2-1',
      refutedBy: ['s3-2', 'c3'],
      explanation:
        '강미란은 11시에 오태성과 체스를 두고 있었다고 했지만, 오태성은 체스가 10시 반쯤 끝났다고 말했고(s3-2) 멈춘 체스 시계가 10시 32분을 가리키고 있어(c3) 그 말이 사실로 뒷받침된다. 따라서 강미란에게는 범행 시각의 알리바이가 없다.',
    },
  ],
  solution:
    '범인은 강미란이다. 횡령을 알아챈 한도영과 서재에서 다투다 11시 20분경 청동 문진으로 그를 쳤고, 체스를 두고 있었다는 거짓 알리바이를 댔다. 체스 시계와 오태성의 진술이 그 알리바이를 무너뜨린다.',
};