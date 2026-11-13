// 학습지 작성용 도우미. 구분자는 '|' (내용 안에 '|' 를 쓰지 말 것).
// 일본어 표기: 한자 뒤에 [읽기] 를 붙이면 후리가나가 된다. 예) 学生[がくせい]  /  **굵게**
const sp = s => s.split('|').map(x => x.trim());
exports.intro = (title, ...body) => ({ t: 'intro', title, body });            // 읽을거리
exports.tip = (title, ...body) => ({ t: 'tip', title, body });                // 요령
exports.chars = (title, rows) => ({ t: 'chars', title, items: rows.map(r => { const [c, rr, ko, mn, pic] = sp(r); const o = { c, r: rr, ko, mn: mn || '' }; if (pic) o.pic = pic; return o; }) }); // "글자|로마자|한글발음|연상법|그림 이모지(선택)"
exports.write = (chars, title) => ({ t: 'write', title, chars: Array.isArray(chars) ? chars : [...chars] }); // 쓰기 연습할 글자들
exports.vocab = (title, rows) => ({ t: 'vocab', title, items: rows.map(r => { const [jp, ko, note, pic] = sp(r); const o = { jp, ko }; if (note) o.note = note; if (pic) o.pic = pic; return o; }) }); // "일본어|뜻|메모(선택)|그림 이모지(선택)"
exports.grammar = (title, body, ex) => ({ t: 'grammar', title, body, ex: ex.map(r => { const [jp, ko] = sp(r); return { jp, ko }; }) }); // body: 설명 문단 배열, ex: "일본어|뜻"
exports.dialog = (title, scene, lines) => ({ t: 'dialog', title, scene, lines: lines.map(r => { const [who, jp, ko] = sp(r); return { who, jp, ko }; }) }); // "A|일본어|뜻"
exports.quiz = (rows = []) => ({ t: 'quiz', items: rows.map(r => { const [q, opts, a, ex, ask] = sp(r); const o = { q, opts: opts.split('/').map(x => x.trim()), a: +a, ex: ex || '' }; if (ask) o.ask = ask; return o; }) }); // "문제|보기1/보기2/보기3|정답번호(0부터)|해설|질문 문구(선택, 기본: 빈칸에 들어갈 말은?)"
exports.day = (title, goal, steps, opt) => ({ title, goal, steps, opt: opt || [] }); // opt: 시간이 더 있는 날의 보너스 단계
exports.read = (title, jp, ko) => ({ t: 'read', title, jp, ko });           // 독해 지문: jp 문단 배열(후리가나 포함), ko 해석 문단 배열
exports.listen = (title, scene, lines) => ({ t: 'listen', title, scene, lines: lines.map(r => { const [who, jp, ko] = sp(r); return { who, jp, ko }; }) }); // 청해: 대본을 가리고 먼저 듣는 회화. 형식은 dialog 와 같음
