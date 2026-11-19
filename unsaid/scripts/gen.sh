#!/usr/bin/env bash
# 사용법: bash scripts/gen.sh [용의자수] [난이도] [사건유형] [분위기]
# 값을 생략하면 기본값(3, easy, murder, classic)을 씁니다.
COUNT="${1:-3}"
DIFFICULTY="${2:-easy}"
CASE_TYPE="${3:-murder}"
MOOD="${4:-classic}"

curl -s --max-time 180 -X POST http://localhost:3000/case/generate \
  -H "Content-Type: application/json" \
  -d "{\"caseType\":\"$CASE_TYPE\",\"mood\":\"$MOOD\",\"suspectCount\":$COUNT,\"difficulty\":\"$DIFFICULTY\"}" \
  -o /tmp/case.json

if [ ! -s /tmp/case.json ]; then
  echo "응답이 비어 있어요. 서버가 켜져 있는지, 3분 안에 끝났는지 확인하세요."
  exit 1
fi

python3 "$(dirname "$0")/show.py"
