// node tools/words.js            → 모든 주차 단어(src/wNN.js vocab) + 보충 단어(src/extra/eNN.js) 수와 중복 목록
// node tools/words.js NN         → 보충 단어 eNN 의 행 수와, 다른 곳과 겹치는 단어 목록
// node tools/words.js --list     → 이미 쓰인 단어를 읽기(가나) 기준으로 한 줄씩 출력 (작성 전 확인용)
const fs = require('fs'), path = require('path');
const src = path.join(__dirname, '..', 'src');
const key = jp => jp.replace(/[一-龯々ヶ]+\[([^\]]+)\]/g, '$1').replace(/[\s〜~・]/g, '');   // 가나 읽기
const surf = jp => jp.replace(/\[[^\]]+\]/g, '').replace(/[\s〜~]/g, '');                 // 표기
const seen = new Map(); // key -> [where...]
const add = (jp, where) => { const k = surf(jp) + '|' + key(jp); if (!seen.has(k)) seen.set(k, []); seen.get(k).push(where); };
for (let n = 1; n <= 99; n++) {
  const f = path.join(src, 'w' + String(n).padStart(2, '0') + '.js'); if (!fs.existsSync(f)) continue;
  const w = require(f); w.days.forEach((d, i) => [...d.steps, ...d.opt].forEach(st => { if (st.t === 'vocab') st.items.forEach(it => add(it.jp, 'w' + n + 'd' + (i + 1))); }));
}
const extras = {};
for (let n = 1; n <= 99; n++) {
  const f = path.join(src, 'extra', 'e' + String(n).padStart(2, '0') + '.js'); if (!fs.existsSync(f)) continue;
  delete require.cache[require.resolve(f)]; const e = require(f); extras[n] = e;
  e.days.forEach((rows, i) => (rows || []).forEach(r => add(r.split('|')[0].trim(), 'e' + n + 'd' + (i + 1))));
}
const arg = process.argv[2];
if (arg === '--list') { console.log([...seen.keys()].map(k => k.split('|')[0] + '（' + k.split('|')[1] + '）').join('\n')); }
else if (arg) {
  const n = +arg, e = extras[n]; if (!e) { console.log('src/extra/e' + String(n).padStart(2, '0') + '.js 없음'); process.exit(1); }
  const rows = e.days.flat().filter(Boolean); console.log('행 수:', rows.length, '(요일별 ' + e.days.map(d => (d || []).length).join(',') + ')');
  const dup = rows.map(r => r.split('|')[0].trim()).filter(jp => seen.get(surf(jp) + '|' + key(jp)).length > 1);
  console.log(dup.length ? '겹치는 단어:\n' + dup.map(jp => jp + ' ← ' + seen.get(surf(jp) + '|' + key(jp)).join(', ')).join('\n') : '겹치는 단어 없음');
} else {
  const dups = [...seen.entries()].filter(([k, v]) => v.length > 1 && v.some(x => x[0] === 'e'));
  console.log('전체 단어(표기+읽기 기준):', seen.size, ' 보충 단어가 낀 중복:', dups.length);
  dups.forEach(([k, v]) => console.log(k.split('|')[0] + ' ← ' + v.join(', ')));
}
