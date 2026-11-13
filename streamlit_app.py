from pathlib import Path

import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(page_title="하나마루 일본어", page_icon="💮", layout="wide")
st.markdown(
    "<style>.block-container{padding-top:1rem;padding-bottom:0;max-width:1100px}"
    "header[data-testid='stHeader']{height:0}</style>",
    unsafe_allow_html=True,
)

ROOT = Path(__file__).parent
page = (ROOT / "index.html").read_text(encoding="utf-8")

# 학습 데이터는 .streamlit/config.toml 의 enableStaticServing 으로 /app/static/data/ 에서 읽는다.
html = (
    '<!doctype html><html lang="ko"><head><meta charset="utf-8">'
    '<meta name="viewport" content="width=device-width,initial-scale=1">'
    "<style>:root{color-scheme:light}body{margin:0}img{max-width:100%}"
    "[hidden]{display:none!important}</style>"
    '<script>window.DATA_BASE="/app/static/data/";</script>'
    "</head><body>" + page + "</body></html>"
)

components.html(html, height=1000, scrolling=True)
