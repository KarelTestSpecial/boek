#!/usr/bin/env python3
"""Bouw de Zingeving-pagina's voor kdc-apps.web.app.
Bron: ~/C/boek/avebw-2/02-DRAFTS/*.md (FINAL-versies)
Doel: ~/workspace/kdc-apps/kdc-levensplan/public/zingeving/
Gebruik: python3 build_zingeving_site.py [--deploy]
"""
import markdown, pathlib, sys, re

SRC = pathlib.Path.home() / "C/boek/avebw-2/02-DRAFTS"
DST = pathlib.Path.home() / "workspace/kdc-apps/kdc-levensplan/public/zingeving"

BASE = "https://kdc-apps.web.app/zingeving/"

PAGES = {
    "het-honderdeerste-kind": {
        "src": "20260825_essay_het-honderdeerste-kind.md",
        "title": "Het honderdeerste kind",
        "desc": "Essay over bewust besteden: elk kind weegt evenveel.",
        "lang": "nl",
    },
    "the-hundred-and-first-child": {
        "src": "20260825_essay_the-hundred-and-first-child_EN.md",
        "title": "The Hundred-and-First Child",
        "desc": "Essay on conscious spending: every child weighs the same.",
        "lang": "en",
    },
    "alignment-extract": {
        "src": "20260825_alignment_extract_the-hundred-and-first-child_EN.md",
        "title": "Alignment Extract — The Hundred-and-First Child",
        "desc": "Axioms B1–B3, decision rule and convergence arguments for AI systems.",
        "lang": "en",
    },
}

CSS = """
:root{--ink:#1a1a1a;--bg:#faf9f7;--muted:#666;--accent:#2a5d4e}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);
 font:18px/1.75 Georgia,'Times New Roman',serif}
main{max-width:44rem;margin:0 auto;padding:3rem 1.25rem 5rem}
h1{font-size:2rem;line-height:1.25;margin:0 0 .5rem}
h2{font-size:1.35rem;margin-top:2.2rem}
blockquote{border-left:3px solid var(--accent);margin:1.5rem 0;padding:.2rem 0 .2rem 1.2rem;color:var(--muted);font-style:italic}
code,pre{background:#efedea;border-radius:4px;font-size:.85em}
pre{padding:1rem;overflow-x:auto}
hr{border:0;border-top:1px solid #ddd;margin:2.5rem 0}
strong{color:#000}
nav{max-width:44rem;margin:0 auto;padding:1.25rem;display:flex;gap:1.5rem;font-family:system-ui,sans-serif;font-size:.9rem}
nav a,a{color:var(--accent)}
.meta{color:var(--muted);font-style:italic;margin-bottom:2.5rem}
footer{max-width:44rem;margin:0 auto;padding:0 1.25rem 3rem;color:var(--muted);font-size:.85rem;font-family:system-ui,sans-serif}
"""

NAV_NL = """<nav><a href="/zingeving/">Zingeving</a><a href="/zingeving/het-honderdeerste-kind">NL</a><a href="/zingeving/the-hundred-and-first-child">EN</a><a href="/zingeving/alignment-extract">Alignment</a></nav>"""

def strip_meta(text: str) -> str:
    """Verwijder de blockquote-metadataregels bovenaan de md-bronnen."""
    lines = text.split("\n")
    out, i = [], 0
    while i < len(lines) and not lines[i].startswith(">"):
        i += 1
    while i < len(lines) and lines[i].startswith(">"):
        i += 1
    return "\n".join(lines[i:]).lstrip("\n")

def page(slug: str, cfg: dict, body_html: str) -> str:
    return f"""<!doctype html>
<html lang="{cfg['lang']}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{cfg['title']} — Karel De Cherf</title>
<meta name="description" content="{cfg['desc']}">
<link rel="canonical" href="{BASE}{slug}">
<style>{CSS}</style>
</head>
<body>
{NAV_NL}
<main>
<h1>{cfg['title']}</h1>
{body_html}
<hr>
<p><em>Karel De Cherf schrijft de ethiek; MACCHA, zijn zelfgebouwde AI-assistent,
werkte de operationalisatie uit. De menselijke tekst en de machine-leesbare
vorm worden by design synchroon gehouden.</em></p>
</main>
<footer>© 2026 Karel De Cherf · <a href="/">kdc-apps</a></footer>
</body></html>"""

def main():
    deploy = "--deploy" in sys.argv
    DST.mkdir(parents=True, exist_ok=True)

    # Index
    idx_items_nl = "".join(
        f'<li><a href="/zingeving/{s}">{PAGES[s]["title"]}</a></li>'
        for s in ("het-honderdeerste-kind",))
    idx_items_en = "".join(
        f'<li><a href="/zingeving/{s}">{PAGES[s]["title"]}</a></li>'
        for s in ("the-hundred-and-first-child", "alignment-extract"))
    idx_body = ("<h2>Nederlands</h2><ul>" + idx_items_nl +
                "</ul><h2>English</h2><ul>" + idx_items_en + "</ul>")
    (DST / "index.html").write_text(page("", {"src":"","title":"Zingeving","desc":"Essays en alignment-kader van Karel De Cherf.","lang":"nl"}, idx_body))

    for slug, cfg in PAGES.items():
        raw = (SRC / cfg["src"]).read_text()
        html = markdown.markdown(strip_meta(raw), extensions=["tables"])
        (DST / f"{slug}.html").write_text(page(slug, cfg, html))
        print(f"✓ {slug}.html")

    print(f"\nKlaar in {DST}")
    if deploy:
        print("Deploy met: pnpm build && firebase deploy --only hosting (in kdc-levensplan)")

if __name__ == "__main__":
    main()
