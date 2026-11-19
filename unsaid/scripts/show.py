import json
d = json.load(open('/tmp/case.json'))
if 'statusCode' in d:
    print('실패 응답:', json.dumps(d, ensure_ascii=False, indent=2))
    raise SystemExit
print('제목:', d['title'])
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
    print('\n모순', k['id'])
    print('  거짓 진술:', texts.get(k['statementId']))
    for r in k['refutedBy']:
        print('  근거:', texts.get(r))
    print('  설명:', k['explanation'])
