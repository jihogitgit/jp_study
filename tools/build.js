// node tools/build.js <kanjivg dist/main 경로>  →  data/*.json 생성
const fs = require('fs'), path = require('path');
const KVG = process.argv[2];
const root = path.join(__dirname, '..');
const strokeOf = ch => { const f = path.join(KVG, ch.codePointAt(0).toString(16).padStart(5, '0') + '.svg'); if (!fs.existsSync(f)) return null; return [...fs.readFileSync(f, 'utf8').matchAll(/ d="([^"]+)"/g)].map(m => m[1]); };
const kana = require('../src/kana.js');
const kstrokes = {}; Object.keys(kana.read).forEach(ch => { if ([...ch].length === 1) { const s = strokeOf(ch); if (s) kstrokes[ch] = s; } });
fs.writeFileSync(path.join(root, 'data/kana.json'), JSON.stringify({ hira: kana.hira, kata: kana.kata, read: kana.read, strokes: kstrokes }));
const road = require('../src/roadmap.js');
const pics = require('../src/pics.js'); const strip = x => x.replace(/\[[^\]]+\]/g, ''), kanaOf = x => x.replace(/[一-龯々]+\[([^\]]+)\]/g, '$1');
let built = 0, contiguous = true; const problems = [];
for (let n = 1; n <= 99; n++) {
  const f = path.join(root, 'src', 'w' + String(n).padStart(2, '0') + '.js'); if (!fs.existsSync(f)) { contiguous = false; continue; }
  const w = require(f); if (contiguous) built = n; const strokes = {};
  if (w.days.length !== 7) problems.push(`w${n}: days=${w.days.length}`);
  w.days.forEach((d, i) => { d.id = 'w' + String(n).padStart(2, '0') + 'd' + (i + 1);
    [...d.steps, ...d.opt].forEach(st => {
      if (st.t === 'chars') st.items.forEach(it => { if (!it.pic && pics[it.c]) it.pic = pics[it.c]; });
      if (st.t === 'vocab') st.items.forEach(it => { const p = pics[strip(it.jp)] || pics[kanaOf(it.jp)]; if (!it.pic && p) it.pic = p; });
      if (st.t === 'read' && (!Array.isArray(st.jp) || !Array.isArray(st.ko))) problems.push(`${d.id}: read needs jp[] and ko[]`);
      if (st.t === 'write') st.chars.forEach(c => { if ([...c].length === 1 && !kstrokes[c]) { const s = strokeOf(c); if (s) strokes[c] = s; else problems.push(`${d.id}: no strokes for ${c}`); } });
      if (st.t === 'quiz') st.items.forEach(q => { if (!(q.a >= 0 && q.a < q.opts.length)) problems.push(`${d.id}: bad quiz answer: ${q.q}`); });
      const rows = st.items || st.ex || st.lines || []; rows.forEach(r => Object.entries(r).forEach(([k, v]) => { if (v === undefined || v === '') { if (!(k === 'mn' || k === 'ex')) problems.push(`${d.id}: empty ${k} in ${st.t} ${JSON.stringify(r)}`); } }));
      const walk = (v, k) => { if (typeof v === 'string') { if (k !== 'c' && /[一-龯々](?![一-龯々\[])/.test(v.replace(/\{[^}]*\}/g, ''))) problems.push(`${d.id}: kanji without furigana in ${st.t}: ${v}`); } else if (v && typeof v === 'object') Object.entries(v).forEach(([kk, vv]) => { if (!(st.t === 'write' && kk === 'chars')) walk(vv, kk); }); }; walk(st);
    });
    if (!d.steps.some(s => s.t === 'quiz')) problems.push(`${d.id}: no quiz step`);
  });
  fs.writeFileSync(path.join(root, 'data', 'w' + String(n).padStart(2, '0') + '.json'), JSON.stringify({ n, title: w.title, days: w.days, strokes }));
}
road.built = built; road.total = road.weeks.length;
fs.writeFileSync(path.join(root, 'data/roadmap.json'), JSON.stringify(road));
// 어디에나 올릴 수 있는 독립 실행판 (dist/)
const dist = path.join(root, 'dist'); fs.mkdirSync(path.join(dist, 'data'), { recursive: true });
fs.writeFileSync(path.join(dist, 'index.html'), '<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style></head><body>' + fs.readFileSync(path.join(root, 'index.html'), 'utf8') + '</body></html>');
fs.readdirSync(path.join(root, 'data')).forEach(f => fs.copyFileSync(path.join(root, 'data', f), path.join(dist, 'data', f)));
console.log('built weeks:', built, 'roadmap weeks:', road.weeks.length, 'kana strokes:', Object.keys(kstrokes).length);
if (problems.length) { console.log('PROBLEMS:\n' + [...new Set(problems)].join('\n')); process.exitCode = 1; }

// Streamlit 정적 파일 (static/data/)
const st = path.join(root, 'static', 'data'); fs.mkdirSync(st, { recursive: true });
fs.readdirSync(path.join(root, 'data')).forEach(f => fs.copyFileSync(path.join(root, 'data', f), path.join(st, f)));
