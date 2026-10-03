"""Build preview-index-en.html from preview-index.html.

    python tools/preview-en/build.py          (run from the repo root)

Text nodes, alt/aria-label/placeholder/title/data-tip/data-type attributes, meta content and
JSON-LD strings are swapped through translations.py; any Vietnamese left over is reported.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).parent))
from translations import T, HERO, LINKS  # noqa: E402

VI = re.compile(r"[À-ỹĐđ]")
src = (ROOT / "preview-index.html").read_text(encoding="utf-8")
s = src

for a, b in HERO.items():
    assert a in s, f"hero title not found: {a[:60]}"
    s = s.replace(a, b)

head, body = s[: s.index("<body")], s[s.index("<body"):]

# JSON-LD blocks: translate string values that match a key (keys may carry &amp;)
def ld(m):
    data = json.loads(m.group(2))
    plain = {k.replace("&amp;", "&"): v.replace("&amp;", "&") for k, v in T.items()}
    def walk(x):
        if isinstance(x, dict): return {k: walk(v) for k, v in x.items()}
        if isinstance(x, list): return [walk(v) for v in x]
        if isinstance(x, str): return plain.get(x, x)
        return x
    data = walk(data)
    if isinstance(data, dict) and data.get("inLanguage") == "vi": data["inLanguage"] = "en"
    return m.group(1) + json.dumps(data, ensure_ascii=False, indent=2) + m.group(3)
head = re.sub(r'(<script type="application/ld\+json">\s*)(.*?)(\s*</script>)', ld, head, flags=re.S)

# text nodes (scripts are left alone)
def text_nodes(part):
    out, pos = [], 0
    for m in re.finditer(r"<script\b.*?</script>", part, flags=re.S):
        out.append(swap_text(part[pos:m.start()])); out.append(m.group(0)); pos = m.end()
    out.append(swap_text(part[pos:]))
    return "".join(out)

def swap_text(chunk):
    def rep(m):
        raw = m.group(1); t = raw.strip()
        if t in T:
            lead = raw[: len(raw) - len(raw.lstrip())]; tail = raw[len(raw.rstrip()):]
            return ">" + lead + T[t] + tail + "<"
        return m.group(0)
    return re.sub(r">([^<>]+)<", rep, chunk)

body = text_nodes(body)
head = re.sub(r"<title>(.*?)</title>", lambda m: "<title>" + T.get(m.group(1), m.group(1)) + "</title>", head)

def attrs(part):
    return re.sub(r'\b(alt|aria-label|placeholder|title|data-tip|data-type|content)="([^"]*)"',
                  lambda m: f'{m.group(1)}="{T.get(m.group(2), m.group(2))}"', part)
head, body = attrs(head), attrs(body)
s = head + body

# language plumbing
s = s.replace('<html lang="vi">', '<html lang="en">', 1)
s = s.replace('<meta property="og:locale" content="vi_VN">', '<meta property="og:locale" content="en_US">')
s = s.replace('<meta property="og:locale:alternate" content="en_US">', '<meta property="og:locale:alternate" content="vi_VN">')
s = s.replace('<a class="lang-switch" href="./preview-index-en.html" hreflang="en" lang="en" aria-label="English version" title="English">EN</a>',
              '<a class="lang-switch" href="./preview-index.html" hreflang="vi" lang="vi" aria-label="Phiên bản tiếng Việt" title="Tiếng Việt">VI</a>')
for a, b in LINKS.items():
    s = s.replace(f'href="{a}"', f'href="{b}"')

(ROOT / "preview-index-en.html").write_text(s, encoding="utf-8", newline="")

left = set()
b2 = re.sub(r"<script\b.*?</script>", "", s[s.index("<body"):], flags=re.S)
for t in re.findall(r">([^<>]+)<", b2):
    if VI.search(t): left.add(t.strip())
for t in re.findall(r'(?:alt|aria-label|placeholder|title|data-tip|content)="([^"]*)"', s):
    if VI.search(t) and t != "Phiên bản tiếng Việt" and t != "Tiếng Việt": left.add(t)
print("wrote preview-index-en.html;", len(left), "Vietnamese strings left")
for t in sorted(left): print("  -", t[:120])
