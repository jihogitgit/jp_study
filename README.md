# 하나마루 일본어

히라가나부터 JLPT N2까지 85주(하루 30~60분) 일본어 학습지 웹앱입니다.
매일 단어(그림), 문형, 회화·청해·독해, 한자 쓰기(획순), 말하기 연습, 퀴즈, 간격 반복 복습으로 구성됩니다.

## 주요 기능

- 매일 학습지: 단어(그림), 보충 단어, 문형, 회화·청해·독해, 한자 쓰기(획순), 말하기, 응답 말하기, 확인 문제
- 간격 복습 카드(1·3·7·14·30일…)와 오답 카드: 처음 틀린 문제는 오답 노트에 쌓여 다시 나옵니다
- 영역별 정답률(글자, 단어·어휘, 한자 읽기·표기, 문법, 독해, 청해, 회화 표현)과 약한 영역 안내
- 모의고사·총정리 주간의 실전 모드: 4지선다를 시간을 재며 한 번에 풀고 마지막에 채점
- 주마다 앱 밖에서 할 과제 체크리스트(공식 문제집 청해, 원어민 회화 등)
- 듣기 속도 조절(0.8/1/1.2배), 화자별 다른 목소리, 섀도잉 모드
- 기록 옮기기: 백업 코드로 다른 기기에 진도를 옮깁니다

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
