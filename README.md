# 하나마루 일본어

히라가나부터 JLPT N2까지 85주(하루 30~60분) 일본어 학습지 웹앱입니다.
매일 단어(그림), 문형, 회화·청해·독해, 한자 쓰기(획순), 말하기 연습, 퀴즈, 간격 반복 복습으로 구성됩니다.

## Streamlit으로 실행

```bash
pip install -r requirements.txt
streamlit run streamlit_app.py
```

Streamlit Community Cloud에서는 이 저장소를 연결하고 메인 파일을 `streamlit_app.py`로 지정하면 됩니다.
학습 데이터는 `static/data/`에 있고 `.streamlit/config.toml`의 정적 파일 서빙으로 불러옵니다.
진도는 브라우저(localStorage)에 저장됩니다.

## 구조

- `index.html` — 앱 (HTML/JS 한 파일)
- `src/wNN.js` — 주차별 학습 내용 원본, `src/AUTHORING.md` — 작성 규칙
- `tools/build.js` — `src/` → `data/`, `dist/`, `static/data/` 생성
  (`node tools/build.js <kanjivg/dist/main 경로>`, KanjiVG 필요)
- `static/data/` — 빌드된 학습 데이터

## 라이선스 표기

한자 획순 데이터는 [KanjiVG](https://kanjivg.tagaini.net/) (© Ulrich Apel, CC BY-SA 3.0)에서 가져왔습니다.
