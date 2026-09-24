import subprocess, sys, pathlib, tempfile, html as htmlmod
import markdown

CSS = """
@page { size: A4; margin: 18mm 16mm; }
* { box-sizing: border-box; }
body { font-family: -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
       font-size: 11pt; line-height: 1.6; color: #24292f; margin: 0; }
h1 { font-size: 20pt; border-bottom: 2px solid #1E5BFF; padding-bottom: .3em; margin: 0 0 .6em; color: #0b2a6b; }
h2 { font-size: 15pt; border-bottom: 1px solid #d8dee4; padding-bottom: .25em; margin: 1.6em 0 .6em; color: #0b2a6b;
     page-break-after: avoid; }
h3 { font-size: 12.5pt; margin: 1.2em 0 .4em; page-break-after: avoid; }
p, li { orphans: 3; widows: 3; }
code { background: #f4f4f6; padding: .12em .35em; border-radius: 4px;
       font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace; font-size: .87em; }
pre { background: #f6f8fa; padding: 12px 14px; border-radius: 6px; overflow-x: auto;
      page-break-inside: avoid; border: 1px solid #e6e8eb; }
pre code { background: none; padding: 0; font-size: .82em; line-height: 1.45; }
table { border-collapse: collapse; width: 100%; margin: 1em 0; font-size: .9em; page-break-inside: avoid; }
th, td { border: 1px solid #d8dee4; padding: 7px 10px; text-align: left; vertical-align: top; }
th { background: #f4f6fa; font-weight: 600; }
blockquote { border-left: 4px solid #1E5BFF; background: #f6f9ff; margin: 1em 0;
             padding: .6em 1em; color: #33415c; page-break-inside: avoid; }
blockquote p { margin: .3em 0; }
hr { border: 0; border-top: 1px solid #d8dee4; margin: 1.8em 0; }
a { color: #1E5BFF; text-decoration: none; word-break: break-word; }
ul, ol { padding-left: 1.4em; }
img { max-width: 100%; }
"""

def convert(md_path: pathlib.Path, pdf_path: pathlib.Path):
    text = md_path.read_text(encoding="utf-8")
    body = markdown.markdown(
        text,
        extensions=["tables", "fenced_code", "sane_lists", "attr_list", "md_in_html"],
    )
    doc = (
        "<!doctype html><html lang='es'><head><meta charset='utf-8'>"
        f"<title>{htmlmod.escape(md_path.stem)}</title><style>{CSS}</style></head>"
        f"<body>{body}</body></html>"
    )
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False, encoding="utf-8") as fh:
        fh.write(doc)
        tmp = fh.name
    subprocess.run(
        ["google-chrome", "--headless", "--disable-gpu", "--no-sandbox",
         "--no-pdf-header-footer", f"--print-to-pdf={pdf_path}", f"file://{tmp}"],
        check=True, capture_output=True,
    )
    print(f"  {pdf_path.name}  ({pdf_path.stat().st_size // 1024} KB)")

for md in sys.argv[1:]:
    md = pathlib.Path(md)
    convert(md, md.with_suffix(".pdf"))
