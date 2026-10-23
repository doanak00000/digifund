# Run from the repo root: python tools/preview-details/build.py  (regenerates the 5 group pages in VI and EN)
# Builds the group pages from template.html / template-en.html (the classic product page: hero, sidebar, specs,
# modal, engine) with the top header and hero swapped for the new-style ones. Data: products-data-v2.js (5 groups).
import html, json, re, subprocess

V = "20261023a"
DATA = json.loads(subprocess.run(["node", "tools/preview-details/dump-data.js"], capture_output=True, check=True, encoding="utf-8").stdout)
TPL = {"vi": open("tools/preview-details/template.html", encoding="utf-8").read(),
       "en": open("tools/preview-details/template-en.html", encoding="utf-8").read()}
OUT = {
    "vi": {"1": "san-pham-silicon-wafer-substrate.html", "2": "san-pham-hoa-chat-vat-tu.html", "3": "san-pham-vat-lieu-dong-goi.html",
           "4": "san-pham-thiet-bi-phong-sach.html", "5": "san-pham-nang-luong-tai-tao.html"},
    "en": {"1": "silicon-wafer-substrate-products.html", "2": "chemicals-and-supplies.html", "3": "advanced-packaging-materials.html",
           "4": "cleanroom-lab-equipment.html", "5": "renewable-energy-materials.html"},
}
FOOT = {
    "vi": {
        "1": ["./silicon-wafer-viet-nam.html|Nhà cung cấp Silicon Wafer tại Việt Nam", "./silicon-wafer-la-gi.html|Silicon Wafer là gì?", "./phan-loai-silicon-wafer.html|Phân loại Silicon Wafer", "./ung-dung-silicon-wafer.html|Ứng dụng Silicon Wafer"],
        "2": ["./quy-trinh-quang-khac-photolithography.html|Quy trình quang khắc", "./bia-phun-xa-sputtering-target.html|Bia phún xạ (Sputtering target)", "./lam-sach-wafer-quy-trinh-rca.html|Làm sạch wafer – quy trình RCA"],
        "3": ["./ung-dung-silicon-wafer.html|Ứng dụng Silicon Wafer", "./silicon-wafer-viet-nam.html|Nhà cung cấp Silicon Wafer tại Việt Nam"],
        "4": ["./phong-sach-cap-do-iso.html|Phòng sạch & cấp độ ISO", "./quy-trinh-quang-khac-photolithography.html|Quy trình quang khắc"],
        "5": ["./vat-lieu-nano-graphene-cnt.html|Vật liệu nano Graphene & CNT", "./ung-dung-silicon-wafer.html|Ứng dụng Silicon Wafer"],
    },
    "en": {
        "1": ["./silicon-wafer-supplier-vietnam.html|Silicon wafer supplier in Vietnam", "./what-is-a-silicon-wafer.html|What is a silicon wafer?", "./types-of-silicon-wafer.html|Types of silicon wafer", "./silicon-wafer-applications.html|Silicon wafer applications"],
        "2": ["./photolithography-process.html|Photolithography process", "./sputtering-target-thin-film.html|Sputtering targets", "./silicon-wafer-cleaning-rca.html|Wafer cleaning – RCA process"],
        "3": ["./silicon-wafer-applications.html|Silicon wafer applications", "./silicon-wafer-supplier-vietnam.html|Silicon wafer supplier in Vietnam"],
        "4": ["./cleanroom-iso-classes.html|Cleanrooms & ISO classes", "./photolithography-process.html|Photolithography process"],
        "5": ["./nanomaterials-graphene-cnt.html|Graphene & CNT nanomaterials", "./silicon-wafer-applications.html|Silicon wafer applications"],
    },
}
PAGES = [  # group, title, description vi, description en
    ("1", "Silicon Wafers & Substrates",
     "Silicon wafer, SiC, SOI, SiN, Sapphire, AlN, GaAs, GaN, InP, ITO/Glass và carrier wafer — thông số kỹ thuật và báo giá theo yêu cầu.",
     "Silicon, SiC, SOI, SiN, sapphire, AlN, GaAs, GaN, InP, ITO/glass and carrier wafers — full specifications, quoted on request."),
    ("2", "Semiconductor Fabrication Materials",
     "Photoresist, developer, HMDS, stripper, ARC, CMP slurry & pad, sputtering target, vật liệu bốc bay và hoá chất quy trình ướt.",
     "Photoresists, developers, HMDS, strippers, ARC, CMP slurries & pads, sputtering targets, evaporation materials and wet-process chemicals."),
    ("3", "Advanced Packaging Materials",
     "Temporary bonding, carrier wafer, dicing tape & blade, hoá chất mạ, underfill, die attach film, keo dẫn điện và mold compound.",
     "Temporary bonding, carrier wafers, dicing tape & blades, plating chemistry, underfill, die attach film, conductive adhesives and mold compound."),
    ("4", "Cleanroom & Hi-Tech Equipment",
     "Tủ hút, wet bench, dụng cụ thuỷ tinh, đồ phòng sạch, spin coater, mask aligner, CVD, RIE, phún xạ, đo lường và thiết bị phòng thí nghiệm.",
     "Fume hoods, wet benches, glassware, cleanroom garments, spin coaters, mask aligners, CVD, RIE, sputtering, metrology and lab equipment."),
    ("5", "Renewable Energy Materials & Equipment",
     "Bình phản ứng quang–nhiệt–điện xúc tác, trạm thử pin nhiên liệu, thiết bị nghiên cứu pin và vật liệu nano.",
     "Photo-thermal-electrocatalytic reactors, fuel cell test stations, battery research equipment and nanomaterials."),
]
HERO = {   # model kind for mountModel(), Vietnamese group name, category chips
    "1": ("wafer", "Silicon wafer & đế bán dẫn", ["Silicon wafer", "Sapphire · AlN · GaAs · GaN · InP", "Carrier wafers"]),
    "2": ("litho", "Vật liệu chế tạo bán dẫn", ["Lithography", "CMP", "Thin film", "Wet process"]),
    "3": ("pack", "Vật liệu đóng gói tiên tiến", ["Temporary bonding", "Carrier", "Dicing", "Plating", "Assembly", "Encapsulation"]),
    "4": ("depo", "Phòng sạch & thiết bị công nghệ cao", ["Cleanroom", "Process equipment", "Metrology", "Laboratory"]),
    "5": ("solar", "Vật liệu & thiết bị năng lượng tái tạo", ["Solar & fuel cell", "Energy storage", "Nanomaterials"]),
}
# UI strings of the new header/hero; the engine re-translates the hero ids on render
UI = {
    "vi": dict(home="./index.html", blog="./kien-thuc.html", products="Sản phẩm", nav=["Ứng dụng", "Đội ngũ", "Nghiên cứu", "Giới thiệu"],
               quote="Nhận báo giá", homeLbl="Trang chủ", allProd="Tất cả sản phẩm", group="Nhóm", brand="Digifund – trang chủ",
               mainNav="Điều hướng chính", mobNav="Menu di động", openMenu="Mở menu", closeMenu="Đóng menu", theme="Sáng/Tối",
               intro="Thông số kỹ thuật chi tiết cho từng sản phẩm. Liên hệ để nhận báo giá và tư vấn.", switch="EN", switchTitle="English"),
    "en": dict(home="./index-en.html", blog="./semiconductor-knowledge.html", products="Products", nav=["Applications", "Team", "Research", "About"],
               quote="Get a quote", homeLbl="Home", allProd="All products", group="Group", brand="Digifund – home",
               mainNav="Main navigation", mobNav="Mobile menu", openMenu="Open menu", closeMenu="Close menu", theme="Light/Dark",
               intro="Detailed technical specifications for every product. Contact us for a quote and technical advice.", switch="VI", switchTitle="Tiếng Việt"),
}


def esc(s):
    return s.replace("&", "&amp;")


def tr(x, lang):
    return (x.get(lang) or x.get("vi") or "") if isinstance(x, dict) else (x or "")


def catalogue(gid, lang):
    # static copy of what the engine renders into #pdpContent, so crawlers without JS still see every product
    out, sec = [], None
    for it in DATA[gid]["items"]:
        if tr(it["section"], lang) != sec:
            sec = tr(it["section"], lang)
            out.append(f"<h2>{html.escape(sec)}</h2>")
        name = html.escape(tr(it["name"], lang))
        sub = f"<p>{html.escape(tr(it['subtitle'], lang))}</p>" if it.get("subtitle") else ""
        vs = "".join(f"<li>{html.escape(tr(v['name'], lang))}</li>" for v in it.get("variants", []))
        out.append(f"<section><h3>{name}</h3>{sub}<ul>{vs}</ul></section>")
    return "".join(out)


def seo_head(gid, title, stitle, desc, lang, url):
    u = UI[lang]
    items = DATA[gid]["items"]
    img = next((it.get("img") or (it.get("variants") or [{}])[0].get("img") for it in items
                if "logo-2" not in (it.get("img") or (it.get("variants") or [{}])[0].get("img") or "logo-2")), "./assets/images/logo-2.png")
    img = "https://digifund.vn/" + img.lstrip("./")
    home = "https://digifund.vn/" + ("index-en.html" if lang == "en" else "")
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": u["homeLbl"], "item": home},
            {"@type": "ListItem", "position": 2, "name": u["products"], "item": home + "#products"},
            {"@type": "ListItem", "position": 3, "name": title, "item": url}]},
        {"@type": "CollectionPage", "name": title, "description": desc, "url": url, "inLanguage": lang,
         "isPartOf": {"@type": "WebSite", "name": "Digifund", "url": "https://digifund.vn/"},
         "mainEntity": {"@type": "ItemList", "numberOfItems": len(items), "itemListElement": [
             {"@type": "ListItem", "position": i + 1, "name": tr(it["name"], lang)} for i, it in enumerate(items)]}}]}
    a = lambda s: html.escape(s, quote=True)
    return ('\n    <meta property="og:type" content="website">\n    <meta property="og:site_name" content="Digifund">\n'
            f'    <meta property="og:locale" content="{"en_US" if lang == "en" else "vi_VN"}">\n'
            f'    <meta property="og:title" content="{a(stitle)}">\n    <meta property="og:description" content="{a(desc)}">\n'
            f'    <meta property="og:image" content="{img}">\n    <meta property="og:url" content="{url}">\n'
            '    <meta name="twitter:card" content="summary_large_image">\n'
            f'    <script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>')


def hero(gid, title, lang):
    kind, vi, chips = HERO[gid]
    u = UI[lang]
    li = "".join(f"<li>{esc(c)}</li>" for c in chips)
    sub = f'\n                <p class="ph2__vi">{esc(vi)}</p>' if lang == "vi" else ""
    return f'''<section class="pdp-hero ph2" aria-labelledby="heroTitle">
        <div class="ph2__in">
            <div class="ph2__copy">
                <p class="pdp-hero__crumb">
                    <a href="{u['home']}" id="tHome">{u['homeLbl']}</a> ›
                    <a href="{u['home']}#products" id="tAllProd">{u['allProd']}</a> ›
                    <span id="heroCrumb">{u['group']} {gid}</span>
                </p>
                <span class="ph2__badge" id="heroBadge">{u['group']} {gid}</span>
                <h1 class="ph2__title" id="heroTitle">{html.escape(title, quote=False)}</h1>{sub}
                <p class="ph2__intro" id="heroIntro">{u['intro']}</p>
                <ul class="ph2__chips" role="list">{li}</ul>
            </div>
            <div class="ph2__model" data-model="{kind}" aria-hidden="true"></div>
        </div>
    </section>'''


CHEV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>'


def menu_js(u):
    # mobile menu; the VI/EN button opens the other language's page (the engine re-renders first, then we navigate)
    return ("(function(){var b=document.querySelector('.nh__menu'),m=document.getElementById('nhMenu');if(!b||!m)return;"
            f"function s(o){{b.setAttribute('aria-expanded',String(o));b.setAttribute('aria-label',o?'{u['closeMenu']}':'{u['openMenu']}');m.hidden=!o;"
            "document.documentElement.classList.toggle('nh-open',o);}"
            "b.addEventListener('click',function(){s(m.hidden);});"
            "m.addEventListener('click',function(e){if(e.target.closest('a'))s(false);});"
            "document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!m.hidden){s(false);b.focus();}});})();"
            "(function(){var t=document.getElementById('langToggle');if(t)t.addEventListener('click',function(){location.href=t.getAttribute('data-href');});})();")


def header(gid, lang):
    u, out = UI[lang], OUT[lang]
    other = "en" if lang == "vi" else "vi"
    cur = lambda g: ' aria-current="page"' if g == gid else ""
    groups = "".join(f'<a href="./{out[g]}"{cur(g)}><span>0{g}</span>{esc(t)}</a>' for g, t, _, _ in PAGES)
    mgroups = "".join(f'<a href="./{out[g]}"{cur(g)}>0{g}. {esc(t)}</a>' for g, t, _, _ in PAGES)
    nav = "".join(f'<a href="{u["home"]}{h}">{n}</a>' for h, n in zip(["#applications", "#team", "#research", "#about"], u["nav"]))
    nav += f'<a href="{u["blog"]}">Blog</a>'
    return f'''<header class="nh" id="top">
        <div class="nh__in">
            <a class="nh__brand" href="{u['home']}" aria-label="{u['brand']}"><img src="./assets/images/logo-2.png" alt="" width="28" height="28"><span>DIGIFUND</span></a>
            <nav class="nh__nav" aria-label="{u['mainNav']}">
                <div class="nh__drop"><button type="button" aria-haspopup="true">{u['products']} {CHEV}</button><div class="nh__panel">{groups}</div></div>
                {nav}
            </nav>
            <div class="nh__right">
                <button class="nh__icon" id="langToggle" type="button" title="{u['switchTitle']}" data-href="./{OUT[other][gid]}">{lang.upper()}</button>
                <button class="nh__icon" id="themeToggle" type="button" title="{u['theme']}"><i class="fas fa-moon"></i></button>
                <a class="nh__cta" href="{u['home']}#contact">{u['quote']}</a>
                <button class="nh__menu" type="button" aria-expanded="false" aria-controls="nhMenu" aria-label="{u['openMenu']}"><span></span><span></span></button>
            </div>
            <span id="tBack" hidden>{u['homeLbl']}</span>
        </div>
        <nav class="nh__mnav" id="nhMenu" aria-label="{u['mobNav']}" hidden>
            <p>{u['products']}</p>{mgroups}
            <p>Digifund</p>{nav}
            <a class="nh__cta" href="{u['home']}#contact">{u['quote']}</a>
        </nav>
    </header>
    <script>{menu_js(u)}</script>'''


for lang in ("vi", "en"):
    u = UI[lang]
    for gid, title, desc_vi, desc_en in PAGES:
        s = TPL[lang]
        fn = OUT[lang][gid]
        seo = DATA[gid]["seo"]
        h1, stitle, desc = tr(DATA[gid]["title"], lang), tr(seo["title"], lang), tr(seo["desc"], lang)
        s = re.sub(r"<title>.*?</title>", lambda m: f"<title>{html.escape(stitle, quote=False)}</title>", s, count=1)
        s = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{html.escape(desc)}">', s, count=1)
        s = re.sub(r'\s*<link rel="(canonical|alternate)"[^>]*>', "", s)
        vi_url, en_url = f"https://digifund.vn/{OUT['vi'][gid]}", f"https://digifund.vn/{OUT['en'][gid]}"
        s = s.replace('<meta name="robots" content="index, follow, max-image-preview:large">',
                      '<meta name="robots" content="index, follow, max-image-preview:large">\n'
                      f'    <link rel="canonical" href="https://digifund.vn/{fn}">\n'
                      f'    <link rel="alternate" hreflang="vi" href="{vi_url}">\n'
                      f'    <link rel="alternate" hreflang="en" href="{en_url}">\n'
                      f'    <link rel="alternate" hreflang="x-default" href="{vi_url}">', 1)
        if lang == "vi":  # each page shows its own language, whatever was chosen elsewhere
            s = s.replace("<head>\n", "<head>\n    <script>try{localStorage.setItem('digifund-lang','vi');}catch(e){}</script>\n", 1)
        s = re.sub(r'\s*<meta property="og:[^>]*>', "", s)
        s = re.sub(r'\s*<script type="application/ld\+json">.*?</script>', "", s, count=1, flags=re.S)
        s = s.replace(f'<link rel="alternate" hreflang="x-default" href="{vi_url}">',
                      f'<link rel="alternate" hreflang="x-default" href="{vi_url}">' + seo_head(gid, h1, stitle, desc, lang, f"https://digifund.vn/{fn}"), 1)
        s = s.replace('<link rel="stylesheet" href="./assets/css/product-detail.css">',
                      '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
                      '    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
                      '    <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@700&family=Geist:wght@400;500;600&family=Geist+Mono:wght@500;600&display=swap" rel="stylesheet">\n'
                      f'    <link rel="stylesheet" href="./assets/css/product-detail.css?v={V}">\n'
                      f'    <link rel="stylesheet" href="./assets/css/hdr-v2.css?v={V}">\n'
                      f'    <link rel="stylesheet" href="./assets/css/pdp-v2.css?v={V}">\n'
                      '    <script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.min.js"}}</script>')
        s = re.sub(r'<header class="pdp-top">.*?</header>', lambda m: header(gid, lang), s, count=1, flags=re.S)
        s = re.sub(r'<section class="pdp-hero">.*?</section>', lambda m: hero(gid, h1, lang), s, count=1, flags=re.S)
        model_js = ("<script type=\"module\">\n"
                    f"        import {{ mountModel }} from './assets/js/value-chain-3d.js?v={V}';\n"
                    "        const el = document.querySelector('.ph2__model');\n"
                    "        const gl = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } })();\n"
                    "        if (el && gl) mountModel(el, el.dataset.model, { reduceMotion: matchMedia('(prefers-reduced-motion: reduce)').matches });\n"
                    "    </script>\n</body>")
        s = s.replace("</body>", model_js, 1)
        # empty the pre-rendered catalogue: the engine fills #pdpNav / #pdpContent
        s = re.sub(r'<aside class="pdp-nav" id="pdpNav">.*?</aside>', '<aside class="pdp-nav" id="pdpNav"></aside>', s, count=1, flags=re.S)
        s = re.sub(r'<div class="pdp-content" id="pdpContent">.*?</section></div>', lambda m: f'<div class="pdp-content" id="pdpContent">{catalogue(gid, lang)}</div>', s, count=1, flags=re.S)
        links = "\n".join(f'            <a href="{h}">{esc(t)}</a>' for h, t in (x.split("|") for x in FOOT[lang][gid]))
        s = re.sub(r'(<nav class="pdp-foot__links"[^>]*>).*?(</nav>)', lambda m: m.group(1) + "\n" + links + "\n        " + m.group(2), s, count=1, flags=re.S)
        s = s.replace('<a href="./" id="tFootBack">', f'<a href="{u["home"]}" id="tFootBack">')
        s = re.sub(r"<script>window\.PD_GROUP='1';window\.PD_CANONICAL='[^']*';</script>\s*<script src=\"\./assets/js/products-data\.js\"></script>",
                   lambda m: f"<script>window.PD_GROUP='{gid}';window.PD_CANONICAL='https://digifund.vn/{fn}';</script>\n    <script src=\"./assets/js/products-data.js\"></script>\n"
                             f"    <script src=\"./assets/js/products-data-v2.js?v={V}\"></script>\n    <script>window.PD_DATA = window.PD_DATA_V2;</script>",
                   s, count=1)
        s = s.replace('<script src="./assets/js/product-detail-engine.js"></script>', f'<script src="./assets/js/product-detail-engine.js?v={V}"></script>', 1)
        assert "PD_DATA_V2" in s and 'class="nh"' in s and 'og:image' in s and 'id="pdpContent"><h2>' in s and "engine.js?v=" in s, fn
        open(fn, "w", encoding="utf-8", newline="").write(s)
        print(fn, len(s))
