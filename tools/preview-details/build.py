# Run from the repo root: python tools/preview-details/build.py  (regenerates preview-details-*.html)
# Builds preview-details-*.html: the classic product page (hero, sidebar, specs, modal, engine)
# with only the top header swapped for the new-style one. Data: products-data-v2.js (5 groups per the PDF).
import re

V = "20261003a"
old = open("san-pham-silicon-wafer-substrate.html", encoding="utf-8").read()
FOOT = {
    "1": ["./silicon-wafer-viet-nam.html|Nhà cung cấp Silicon Wafer tại Việt Nam", "./silicon-wafer-la-gi.html|Silicon Wafer là gì?", "./phan-loai-silicon-wafer.html|Phân loại Silicon Wafer", "./ung-dung-silicon-wafer.html|Ứng dụng Silicon Wafer"],
    "2": ["./quy-trinh-quang-khac-photolithography.html|Quy trình quang khắc", "./bia-phun-xa-sputtering-target.html|Bia phún xạ (Sputtering target)", "./lam-sach-wafer-quy-trinh-rca.html|Làm sạch wafer – quy trình RCA"],
    "3": ["./ung-dung-silicon-wafer.html|Ứng dụng Silicon Wafer", "./silicon-wafer-viet-nam.html|Nhà cung cấp Silicon Wafer tại Việt Nam"],
    "4": ["./phong-sach-cap-do-iso.html|Phòng sạch & cấp độ ISO", "./quy-trinh-quang-khac-photolithography.html|Quy trình quang khắc"],
    "5": ["./vat-lieu-nano-graphene-cnt.html|Vật liệu nano Graphene & CNT", "./ung-dung-silicon-wafer.html|Ứng dụng Silicon Wafer"],
}
PAGES = [
    ("1", "silicon-wafer", "Silicon Wafers & Substrates", "Silicon wafer, SiC, SOI, SiN, Sapphire, AlN, GaAs, GaN, InP, ITO/Glass và carrier wafer — thông số kỹ thuật và báo giá theo yêu cầu."),
    ("2", "fab-materials", "Semiconductor Fabrication Materials", "Photoresist, developer, HMDS, stripper, ARC, CMP slurry & pad, sputtering target, vật liệu bốc bay và hoá chất quy trình ướt."),
    ("3", "packaging", "Advanced Packaging Materials", "Temporary bonding, carrier wafer, dicing tape & blade, hoá chất mạ, underfill, die attach film, keo dẫn điện và mold compound."),
    ("4", "cleanroom", "Cleanroom & Hi-Tech Equipment", "Tủ hút, wet bench, dụng cụ thuỷ tinh, đồ phòng sạch, spin coater, mask aligner, CVD, RIE, phún xạ, đo lường và thiết bị phòng thí nghiệm."),
    ("5", "renewable", "Renewable Energy Materials & Equipment", "Bình phản ứng quang–nhiệt–điện xúc tác, trạm thử pin nhiên liệu, thiết bị nghiên cứu pin và vật liệu nano."),
]


HERO = {   # model kind for mountModel(), Vietnamese group name, category chips
    "1": ("wafer", "Silicon wafer & đế bán dẫn", ["Silicon wafer", "Sapphire · AlN · GaAs · GaN · InP", "Carrier wafers"]),
    "2": ("litho", "Vật liệu chế tạo bán dẫn", ["Lithography", "CMP", "Thin film", "Wet process"]),
    "3": ("pack", "Vật liệu đóng gói tiên tiến", ["Temporary bonding", "Carrier", "Dicing", "Plating", "Assembly", "Encapsulation"]),
    "4": ("depo", "Phòng sạch & thiết bị công nghệ cao", ["Cleanroom", "Process equipment", "Metrology", "Laboratory"]),
    "5": ("solar", "Vật liệu & thiết bị năng lượng tái tạo", ["Solar & fuel cell", "Energy storage", "Nanomaterials"]),
}


def esc(s):
    return s.replace("&", "&amp;")


def hero(gid, title):
    kind, vi, chips = HERO[gid]
    li = "".join(f"<li>{esc(c)}</li>" for c in chips)
    return f'''<section class="pdp-hero ph2" aria-labelledby="heroTitle">
        <div class="ph2__in">
            <div class="ph2__copy">
                <p class="pdp-hero__crumb">
                    <a href="./preview-index.html" id="tHome">Trang chủ</a> ›
                    <a href="./preview-index.html#products" id="tAllProd">Tất cả sản phẩm</a> ›
                    <span id="heroCrumb">Nhóm {gid}</span>
                </p>
                <span class="ph2__badge" id="heroBadge">Nhóm {gid}</span>
                <h1 class="ph2__title" id="heroTitle">{esc(title)}</h1>
                <p class="ph2__vi">{esc(vi)}</p>
                <p class="ph2__intro" id="heroIntro">Thông số kỹ thuật chi tiết cho từng sản phẩm. Liên hệ để nhận báo giá và tư vấn.</p>
                <ul class="ph2__chips" role="list">{li}</ul>
            </div>
            <div class="ph2__model" data-model="{kind}" aria-hidden="true"></div>
        </div>
    </section>'''


CHEV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>'
MENU_JS = ("(function(){var b=document.querySelector('.nh__menu'),m=document.getElementById('nhMenu');if(!b||!m)return;"
           "function s(o){b.setAttribute('aria-expanded',String(o));b.setAttribute('aria-label',o?'Đóng menu':'Mở menu');m.hidden=!o;"
           "document.documentElement.classList.toggle('nh-open',o);}"
           "b.addEventListener('click',function(){s(m.hidden);});"
           "m.addEventListener('click',function(e){if(e.target.closest('a'))s(false);});"
           "document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!m.hidden){s(false);b.focus();}});})();"
           "document.addEventListener('click',function(e){var a=e.target.closest('a[href^=\"./preview-index.html\"]');"
           "try{if(a&&localStorage.getItem('digifund-lang')==='en')a.setAttribute('href',a.getAttribute('href').replace('preview-index.html','preview-index-en.html'));}catch(x){}},true);")


def header(gid):
    cur = lambda g: ' aria-current="page"' if g == gid else ""
    groups = "".join(f'<a href="./preview-details-{slug}.html"{cur(g)}><span>0{g}</span>{esc(t)}</a>' for g, slug, t, _ in PAGES)
    mgroups = "".join(f'<a href="./preview-details-{slug}.html"{cur(g)}>0{g}. {esc(t)}</a>' for g, slug, t, _ in PAGES)
    nav = "".join(f'<a href="./preview-index.html{h}">{n}</a>' for h, n in
                  [("#applications", "Ứng dụng"), ("#team", "Đội ngũ"), ("#research", "Nghiên cứu"), ("#about", "Giới thiệu")])
    nav += '<a href="./kien-thuc.html">Blog</a>'
    return f'''<header class="nh" id="top">
        <div class="nh__in">
            <a class="nh__brand" href="./preview-index.html" aria-label="Digifund – trang chủ"><img src="./assets/images/logo-2.png" alt="" width="28" height="28"><span>DIGIFUND</span></a>
            <nav class="nh__nav" aria-label="Điều hướng chính">
                <div class="nh__drop"><button type="button" aria-haspopup="true">Sản phẩm {CHEV}</button><div class="nh__panel">{groups}</div></div>
                {nav}
            </nav>
            <div class="nh__right">
                <button class="nh__icon" id="langToggle" type="button" title="EN/VI">VI</button>
                <button class="nh__icon" id="themeToggle" type="button" title="Sáng/Tối"><i class="fas fa-moon"></i></button>
                <a class="nh__cta" href="./preview-index.html#contact">Nhận báo giá</a>
                <button class="nh__menu" type="button" aria-expanded="false" aria-controls="nhMenu" aria-label="Mở menu"><span></span><span></span></button>
            </div>
            <span id="tBack" hidden>Trang chủ</span>
        </div>
        <nav class="nh__mnav" id="nhMenu" aria-label="Menu di động" hidden>
            <p>Sản phẩm</p>{mgroups}
            <p>Digifund</p>{nav}
            <a class="nh__cta" href="./preview-index.html#contact">Nhận báo giá</a>
        </nav>
    </header>
    <script>{MENU_JS}</script>'''


for gid, slug, title, desc in PAGES:
    s = old
    s = re.sub(r"<title>.*?</title>", f"<title>{esc(title)} | Digifund (Preview)</title>", s, count=1)
    s = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{esc(desc)}">', s, count=1)
    s = s.replace('<meta name="robots" content="index, follow, max-image-preview:large">', '<meta name="robots" content="noindex, nofollow">')
    s = re.sub(r'\s*<link rel="(canonical|alternate)"[^>]*>', "", s)
    s = re.sub(r'\s*<meta property="og:[^>]*>', "", s)
    s = re.sub(r'\s*<script type="application/ld\+json">.*?</script>', "", s, count=1, flags=re.S)
    s = s.replace('<link rel="stylesheet" href="./assets/css/product-detail.css">',
                  '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
                  '    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
                  '    <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@700&family=Geist:wght@400;500;600&family=Geist+Mono:wght@500;600&display=swap" rel="stylesheet">\n'
                  '    <link rel="stylesheet" href="./assets/css/product-detail.css">\n'
                  f'    <link rel="stylesheet" href="./assets/css/hdr-v2.css?v={V}">')
    s = re.sub(r'<header class="pdp-top">.*?</header>', lambda m: header(gid), s, count=1, flags=re.S)
    s = re.sub(r'<section class="pdp-hero">.*?</section>', lambda m: hero(gid, title), s, count=1, flags=re.S)
    s = s.replace(f'<link rel="stylesheet" href="./assets/css/hdr-v2.css?v={V}">',
                  f'<link rel="stylesheet" href="./assets/css/hdr-v2.css?v={V}">\n    <link rel="stylesheet" href="./assets/css/pdp-v2.css?v={V}">\n'
                  '    <script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.min.js"}}</script>')
    model_js = ("<script type=\"module\">\n"
                f"        import {{ mountModel }} from './assets/js/value-chain-3d.js?v={V}';\n"
                "        const el = document.querySelector('.ph2__model');\n"
                "        const gl = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } })();\n"
                "        if (el && gl) mountModel(el, el.dataset.model, { reduceMotion: matchMedia('(prefers-reduced-motion: reduce)').matches });\n"
                "    </script>\n</body>")
    s = s.replace("</body>", model_js, 1)
    # empty the pre-rendered catalogue: the engine fills #pdpNav / #pdpContent
    s = re.sub(r'<aside class="pdp-nav" id="pdpNav">.*?</aside>', '<aside class="pdp-nav" id="pdpNav"></aside>', s, count=1, flags=re.S)
    s = re.sub(r'<div class="pdp-content" id="pdpContent">.*?</section></div>', '<div class="pdp-content" id="pdpContent"></div>', s, count=1, flags=re.S)
    links = "\n".join(f'            <a href="{h}">{esc(t)}</a>' for h, t in (x.split("|") for x in FOOT[gid]))
    s = re.sub(r'(<nav class="pdp-foot__links"[^>]*>).*?(</nav>)', lambda m: m.group(1) + "\n" + links + "\n        " + m.group(2), s, count=1, flags=re.S)
    s = s.replace('<a href="./" id="tFootBack">', '<a href="./preview-index.html" id="tFootBack">')
    s = re.sub(r"<script>window\.PD_GROUP='1';window\.PD_CANONICAL='[^']*';</script>\s*<script src=\"\./assets/js/products-data\.js\"></script>",
               lambda m: f"<script>window.PD_GROUP='{gid}';</script>\n    <script src=\"./assets/js/products-data.js\"></script>\n"
                         f"    <script src=\"./assets/js/products-data-v2.js?v={V}\"></script>\n    <script>window.PD_DATA = window.PD_DATA_V2;</script>",
               s, count=1)
    assert "PD_DATA_V2" in s and 'class="nh"' in s and 'id="pdpContent"></div>' in s, slug
    fn = f"preview-details-{slug}.html"
    open(fn, "w", encoding="utf-8", newline="").write(s)
    print(fn, len(s))
