// node tools/used.js <주차>  →  그 주차보다 앞선 주차에서 이미 다룬 한자(쓰기 연습), 문형 제목, 단어 수를 출력
const fs = require('fs'), path = require('path');
const upto = +process.argv[2] || 99, kan = [], gram = []; let words = 0;
for (let n = 1; n < upto; n++) { const f = path.join(__dirname, '..', 'src', 'w' + String(n).padStart(2, '0') + '.js'); if (!fs.existsSync(f)) continue; const w = require(f);
  w.days.forEach(d => [...d.steps, ...d.opt].forEach(st => { if (st.t === 'write') st.chars.forEach(c => { if (/[一-龯]/.test(c) && !kan.includes(c)) kan.push(c); }); if (st.t === 'grammar') gram.push('w' + n + ': ' + st.title); if (st.t === 'vocab') words += st.items.length; })); }
console.log('쓰기 연습을 마친 한자 (' + kan.length + '자): ' + kan.join(''));
console.log('단어 수: ' + words);
console.log('다룬 문형:\n' + gram.join('\n'));
