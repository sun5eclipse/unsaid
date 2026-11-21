#!/usr/bin/env bash
# 사용법: bash scripts/batch.sh [횟수] [용의자수] [난이도] [사건유형] [분위기]
N="${1:-5}"
COUNT="${2:-4}"
DIFFICULTY="${3:-hard}"
CASE_TYPE="${4:-murder}"
MOOD="${5:-classic}"

mkdir -p /tmp/cases

for i in $(seq 1 "$N"); do
  FILE="/tmp/cases/${MOOD}-${DIFFICULTY}-${i}.json"
  curl -s --max-time 240 -X POST http://localhost:3000/case/generate \
    -H "Content-Type: application/json" \
    -d "{\"caseType\":\"$CASE_TYPE\",\"mood\":\"$MOOD\",\"suspectCount\":$COUNT,\"difficulty\":\"$DIFFICULTY\"}" \
    -o "$FILE"

  python3 - "$FILE" "$MOOD" "$i" << 'EOF'
import json, sys
file, mood, i = sys.argv[1], sys.argv[2], sys.argv[3]
try:
    d = json.load(open(file))
except Exception:
    print(f"{mood} {i}. 응답을 읽지 못함 (서버가 꺼져 있거나 시간 초과)")
    raise SystemExit
if 'title' not in d:
    print(f"{mood} {i}. 실패:", d.get('message'), d.get('problems'))
else:
    types = ','.join(k.get('type', '?') for k in d['contradictions'])
    print(f"{mood} {i}. {d['title']} | 범인 {d['culpritId']} | {types} | {d['setting'][:25]}")
EOF
done
