import json, sys
d = json.load(open(sys.argv[1] if len(sys.argv) > 1 else '/tmp/case.json'))
if 'title' not in d:
    print('실패 응답:', json.dumps(d, ensure_ascii=False, indent=2))
    raise SystemExit
print('제목:', d['title'])
print('배경:', d['setting'])
print('용의자', len(d['suspects']), '명 / 단서', len(d['clues']), '개 (가짜',
      sum(c['isRedHerring'] for c in d['clues']), '개) / 모순', len(d['contradictions']), '개')
print('범인:', d['culpritId'])
texts = {}
for s in d['suspects']:
    for st in s['statements']:
        texts[st['id']] = f"[{s['name']}] {st['text']}"
for c in d['clues']:
    texts[c['id']] = f"[단서] {c['description']}"
for k in d['contradictions']:
    print('\n모순', k['id'], '[' + k.get('type', '?') + ']')
    print('  거짓 진술:', texts.get(k['statementId']))
    for r in k['refutedBy']:
        print('  근거:', texts.get(r))
    print('  설명:', k['explanation'])
culprit = next(s for s in d['suspects'] if s['id'] == d['culpritId'])
print('\n[판정용] 범행 시각/장소:', d['crime']['time'], '/', d['crime']['location'])
print('[판정용] 범인 실제 행적:', culprit['truthAboutNight'])
