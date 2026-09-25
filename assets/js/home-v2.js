/* ==========================================================================
   DIGIFUND home v2 (preview-index.html)
   --------------------------------------------------------------------------
   One particle field tells the process story as you scroll:
     0 sand → 1 polished wafer (hero) → 2 patterned dies (statement / product 1)
     → 3 sputtering target → 4 tube furnace with a wafer boat → 5 silicon
     diamond-cubic lattice (products 2–4) → 6 radial burst (contact)
   Everything else is progressive: content is visible without JS, the pinned
   product stage is only enabled on wide screens with motion allowed, and the
   particles load after the page is idle and never block reading.
   ========================================================================== */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const wide = () => window.matchMedia("(min-width: 901px)").matches;
const gsap = window.gsap;
const ST = window.ScrollTrigger;
if (gsap && ST) gsap.registerPlugin(ST);

/* ------------------------------------------------------------------------ */
/* Header: mobile menu                                                       */
/* ------------------------------------------------------------------------ */
{
    const btn = document.querySelector(".hdr__menu");
    const nav = document.getElementById("mnav");
    if (btn && nav) {
        const set = (open) => {
            btn.setAttribute("aria-expanded", String(open));
            btn.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
            nav.hidden = !open;
        };
        btn.addEventListener("click", () => set(nav.hidden));
        nav.addEventListener("click", (e) => { if (e.target.closest("a")) set(false); });
        document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !nav.hidden) { set(false); btn.focus(); } });
    }
}

/* ------------------------------------------------------------------------ */
/* Theme: dark by default, light on request; remembered per browser          */
/* ------------------------------------------------------------------------ */
const isLight = () => document.documentElement.getAttribute("data-theme") === "light";
{
    const btn = document.querySelector(".theme-toggle");
    const meta = document.querySelector('meta[name="theme-color"]');
    const apply = (light) => {
        document.documentElement.setAttribute("data-theme", light ? "light" : "dark");
        if (meta) meta.setAttribute("content", light ? "#f7faff" : "#0e0d0c");
        if (btn) btn.setAttribute("aria-label", light ? "Chuyển sang giao diện tối" : "Chuyển sang giao diện sáng");
        try { localStorage.setItem("digifund-v2-theme", light ? "light" : "dark"); } catch (e) {}
        window.dispatchEvent(new CustomEvent("themechange", { detail: { light } }));
    };
    if (meta) meta.setAttribute("content", isLight() ? "#f7faff" : "#0e0d0c");
    if (btn) {
        btn.setAttribute("aria-label", isLight() ? "Chuyển sang giao diện tối" : "Chuyển sang giao diện sáng");
        btn.addEventListener("click", () => apply(!isLight()));
    }
}

/* ------------------------------------------------------------------------ */
/* Smooth scroll (Lenis) wired to ScrollTrigger; anchors respect the header */
/* ------------------------------------------------------------------------ */
let lenis = null;
if (!reduceMotion && window.Lenis && gsap && ST) {
    lenis = new window.Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    lenis.on("scroll", ST.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
}
document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    const target = id.length > 1 && document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const hdr = document.querySelector(".hdr").offsetHeight;
    if (lenis) lenis.scrollTo(target, { offset: -hdr + 1 });
    else window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - hdr + 1, behavior: reduceMotion ? "auto" : "smooth" });
    history.replaceState(null, "", id);
});

/* ------------------------------------------------------------------------ */
/* Partner marquee: duplicate the set once so the -50% loop is seamless     */
/* ------------------------------------------------------------------------ */
{
    document.querySelectorAll(".marquee__track").forEach((track) => {
        if (reduceMotion) return;
        [...track.children].forEach((li) => {
            const c = li.cloneNode(true);
            c.setAttribute("aria-hidden", "true");
            c.querySelectorAll("img").forEach((img) => (img.alt = ""));
            track.appendChild(c);
        });
    });
}

/* ------------------------------------------------------------------------ */
/* Text: focus-pull reveals and scroll-scrubbed statements                  */
/* ------------------------------------------------------------------------ */
function splitWords(el, cls) {
    const walk = (node) => {
        [...node.childNodes].forEach((n) => {
            if (n.nodeType === 3) {
                const frag = document.createDocumentFragment();
                n.textContent.split(/(\s+)/).forEach((part) => {
                    if (!part) return;
                    if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
                    const s = document.createElement("span");
                    s.className = cls;
                    s.textContent = part;
                    frag.appendChild(s);
                });
                n.replaceWith(frag);
            } else if (n.nodeType === 1) walk(n);
        });
    };
    walk(el);
    return [...el.querySelectorAll("." + cls)];
}

if (gsap && ST && !reduceMotion) {
    // Headings arrive word by word, pulled into focus.
    document.querySelectorAll('[data-reveal="lines"]').forEach((el) => {
        const words = splitWords(el, "rw");
        words.forEach((w) => (w.style.display = "inline-block"));
        gsap.from(words, {
            opacity: 0, y: 28, filter: "blur(12px)", duration: 1.1, ease: "expo.out", stagger: 0.045,
            clearProps: "filter,transform",
            scrollTrigger: el.closest(".hero") ? undefined : { trigger: el, start: "top 85%", once: true },
            delay: el.closest(".hero") ? 0.15 : 0,
        });
    });
    // Supporting blocks: a quieter version of the same focus pull.
    document.querySelectorAll("[data-reveal]:not([data-reveal=lines])").forEach((el) => {
        const inHero = !!el.closest(".hero");
        gsap.from(el, {
            opacity: 0, y: 14, filter: "blur(8px)", duration: 1, ease: "expo.out",
            delay: inHero ? 0.55 : 0, clearProps: "filter,transform",
            scrollTrigger: inHero ? undefined : { trigger: el, start: "top 88%", once: true },
        });
    });
}

// Statements: words light up as you read down the page.
document.querySelectorAll("[data-scrub-words]").forEach((el) => {
    const words = splitWords(el, "w");
    if (!gsap || !ST || reduceMotion) { words.forEach((w) => w.classList.add("is-on")); return; }
    ST.create({
        trigger: el, start: "top 78%", end: "bottom 42%", scrub: true,
        onUpdate(self) {
            const n = Math.round(self.progress * words.length);
            words.forEach((w, i) => w.classList.toggle("is-on", i < n));
        },
    });
});

/* ------------------------------------------------------------------------ */
/* Numbers count up once                                                    */
/* ------------------------------------------------------------------------ */
if (gsap && ST && !reduceMotion) {
    document.querySelectorAll("[data-count]").forEach((b) => {
        const to = Number(b.dataset.count), o = { v: 0 };
        ST.create({
            trigger: b, start: "top 90%", once: true,
            onEnter: () => gsap.to(o, { v: to, duration: 1.6, ease: "expo.out", onUpdate: () => (b.textContent = Math.round(o.v)) }),
        });
    });
}

/* ------------------------------------------------------------------------ */
/* Particle state, driven by scroll (read by the renderer once it loads)    */
/* ------------------------------------------------------------------------ */
const fx = { morph: 0, x: 0.27, y: 0.02, scale: 1, opacity: 1, spin: 1 };
// x/y are fractions of the visible world width/height at the focal plane.

/* ------------------------------------------------------------------------ */
/* Products: four tabs in one screen; autoplay, and the particles follow    */
/* ------------------------------------------------------------------------ */
const products = document.getElementById("products");
const panels = products ? [...products.querySelectorAll(".pp")] : [];
const tabs = products ? [...products.querySelectorAll(".tab")] : [];
let activePanel = 0;
let productsInView = false;
const morphTo = (m) => { if (gsap) gsap.to(fx, { morph: m, duration: reduceMotion ? 0 : 1.6, ease: "power2.inOut", overwrite: "auto" }); else fx.morph = m; };

function showPanel(i) {
    if (i === activePanel) return;
    const prev = panels[activePanel], next = panels[i];
    activePanel = i;
    panels.forEach((p, k) => p.classList.toggle("is-active", k === i));
    tabs.forEach((t, k) => { t.setAttribute("aria-selected", String(k === i)); t.tabIndex = k === i ? 0 : -1; });
    if (productsInView) morphTo(2 + i);
    if (!gsap || reduceMotion) return;
    const parts = (p) => [p.querySelector(".pp__copy"), p.querySelector(".pp__side")];
    gsap.killTweensOf([...parts(prev), ...parts(next)]);
    gsap.to(parts(prev), { opacity: 0, y: -12, filter: "blur(8px)", duration: 0.35, ease: "power2.in" });
    gsap.fromTo(parts(next), { opacity: 0, y: 18, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "expo.out", stagger: 0.08, delay: 0.12 });
}

if (gsap && products && panels.length && tabs.length) {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
        products.classList.add("is-tabbed");
        panels.forEach((p, k) => gsap.set([p.querySelector(".pp__copy"), p.querySelector(".pp__side")], { opacity: k === activePanel ? 1 : 0 }));

        // Autoplay: the active tab's bar fills over DWELL seconds, then the next tab takes over.
        const DWELL = 6;
        let timer = null, hover = false;
        const bar = (i) => tabs[i].querySelector(".tab__bar");
        const run = () => {
            if (timer) timer.kill();
            tabs.forEach((t, k) => gsap.set(bar(k), { scaleX: 0 }));
            if (reduceMotion) return;
            timer = gsap.fromTo(bar(activePanel), { scaleX: 0 }, {
                scaleX: 1, duration: DWELL, ease: "none",
                onComplete: () => { showPanel((activePanel + 1) % panels.length); run(); },
            });
            sync();
        };
        const sync = () => { if (timer) (productsInView && !hover && !document.hidden) ? timer.resume() : timer.pause(); };
        const select = (i, focus) => { showPanel(i); run(); if (focus) tabs[i].focus(); };

        tabs.forEach((t, i) => {
            t.addEventListener("click", () => select(i));
            t.addEventListener("keydown", (e) => {
                const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
                if (k) { e.preventDefault(); select((i + k + tabs.length) % tabs.length, true); }
                if (e.key === "Home") { e.preventDefault(); select(0, true); }
                if (e.key === "End") { e.preventDefault(); select(tabs.length - 1, true); }
            });
        });
        const stage = products.querySelector(".products__stage");
        const enter = () => (hover = true, sync()), leave = () => (hover = false, sync());
        stage.addEventListener("pointerenter", enter); stage.addEventListener("pointerleave", leave);
        stage.addEventListener("focusin", enter); stage.addEventListener("focusout", leave);
        document.addEventListener("visibilitychange", sync);
        const st = ST && ST.create({
            trigger: products, start: "top 60%", end: "bottom 40%",
            onToggle: (self) => { productsInView = self.isActive; if (self.isActive) morphTo(2 + activePanel); sync(); },
        });
        run();

        return () => {
            if (timer) timer.kill();
            if (st) st.kill();
            products.classList.remove("is-tabbed");
            panels.forEach((p) => gsap.set([p.querySelector(".pp__copy"), p.querySelector(".pp__side")], { clearProps: "all" }));
        };
    });
}

/* ------------------------------------------------------------------------ */
/* Scroll choreography for the particle field                                */
/* ------------------------------------------------------------------------ */
if (gsap && ST) {
    const statement = document.querySelector(".statement");
    const research = document.getElementById("featured") || document.getElementById("research");
    const contactHero = document.querySelector(".contact__hero");
    const mm = gsap.matchMedia();

    mm.add({ isWide: "(min-width: 901px)", isNarrow: "(max-width: 900px)" }, (ctx) => {
        const { isWide } = ctx.conditions;
        fx.x = isWide ? 0.27 : 0; fx.y = isWide ? 0.02 : 0.33; fx.scale = isWide ? 1.18 : 0.5;
        // phones: centre the wafer in the free band between the header and the headline
        const centreOnPhone = () => {
            const hdr = document.querySelector(".hdr"), title = document.querySelector(".hero__title");
            if (!hdr || !title || window.scrollY > 10) return;
            const top = hdr.offsetHeight, bottom = title.getBoundingClientRect().top;
            fx.x = 0;
            fx.y = 0.5 - (top + bottom) / 2 / window.innerHeight;
        };
        if (!isWide) {
            centreOnPhone();
            window.addEventListener("resize", centreOnPhone);
            document.fonts && document.fonts.ready.then(centreOnPhone);
        }

        // statement: the wafer's surface gets patterned into dies
        if (statement) ST.create({
            trigger: statement, start: "top 85%", end: "bottom 40%", scrub: true,
            onUpdate: (s) => { if (fx.morph < 2.001) fx.morph = 1 + s.progress; },
        });
        if (isWide) {
            // leaving the products: the field fades out behind the reading sections
            if (research) gsap.fromTo(fx, { opacity: 1 }, {
                opacity: 0, ease: "none", immediateRender: false,
                scrollTrigger: { trigger: research, start: "top 85%", end: "top 25%", scrub: true },
            });
        } else {
            // phones: the particles only frame the hero, then step aside
            gsap.fromTo(fx, { opacity: 1 }, {
                opacity: 0, ease: "none", immediateRender: false,
                scrollTrigger: { trigger: ".hero", start: "40% top", end: "bottom top", scrub: true },
            });
        }
        // contact: the lattice re-forms as a chip whose traces fan out behind the headline
        if (contactHero) gsap.fromTo(fx, { opacity: 0, morph: 5, x: isWide ? 0.27 : 0, y: 0, scale: isWide ? 1.18 : 0.6 }, {
            opacity: 1, morph: 6, x: 0, y: isWide ? 0.15 : 0.2, scale: isWide ? 1.35 : 0.85, ease: "none", immediateRender: false,
            scrollTrigger: { trigger: contactHero, start: "top 95%", end: "center 55%", scrub: true },
        });
        return () => window.removeEventListener("resize", centreOnPhone);
    });
}

/* ------------------------------------------------------------------------ */
/* Forms → EmailJS (same service/template as the live site): the quote      */
/* form and the floating quick-chat share one handler                       */
/* ------------------------------------------------------------------------ */
document.querySelectorAll("form[data-emailjs]").forEach((form) => {
    const status = form.querySelector(".form__status");
    const btn = form.querySelector('button[type="submit"]');
    const label = btn.textContent;
    const say = (msg, kind) => { status.textContent = msg; status.className = "form__status" + (kind ? " is-" + kind : ""); };
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = form.name.value.trim(), email = form.email.value.trim();
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        form.name.setAttribute("aria-invalid", String(!name));
        form.email.setAttribute("aria-invalid", String(!emailOk));
        if (!name || !emailOk) {
            say(!name ? "Vui lòng nhập họ và tên." : "Email chưa đúng định dạng, ví dụ ten@congty.vn.", "error");
            (!name ? form.name : form.email).focus();
            return;
        }
        const cfg = window.DIGIFUND_EMAILJS;
        if (!window.emailjs || !cfg) { say("Chưa gửi được. Vui lòng email semiconductor@digifund.vn hoặc gọi +84 979 324 567.", "error"); return; }
        btn.disabled = true; btn.textContent = "Đang gửi…"; say("");
        window.emailjs.init({ publicKey: cfg.publicKey });
        window.emailjs.send(cfg.serviceID, cfg.templateID, {
            from_name: name, email, from_email: email, to_email: "semiconductor@digifund.vn",
            message: form.message.value.trim(),
            product_type: form.product_type ? form.product_type.value : form.dataset.type || "Liên hệ website",
            page_url: location.href,
        }).then(() => {
            say("Đã gửi. Chúng tôi sẽ phản hồi trong 24 giờ.", "ok");
            form.reset();
        }, () => {
            say("Gửi thất bại. Vui lòng thử lại, hoặc email semiconductor@digifund.vn.", "error");
        }).finally(() => { btn.disabled = false; btn.textContent = label; });
    });
});

/* ------------------------------------------------------------------------ */
/* Hero background: the live site's five banners, cross-fading             */
/* ------------------------------------------------------------------------ */
{
    const slides = [...document.querySelectorAll(".sbg--hero img")];
    if (slides.length > 1 && !reduceMotion) {
        let i = 0;
        setInterval(() => {
            if (document.hidden || window.scrollY > window.innerHeight) return;   // no work while unseen
            slides[i].classList.remove("is-on");
            i = (i + 1) % slides.length;
            slides[i].classList.add("is-on");
        }, 6000);
    }
}

/* ------------------------------------------------------------------------ */
/* Floating contact: quick-chat panel; on phones hidden while in the hero   */
/* ------------------------------------------------------------------------ */
{
    const fab = document.getElementById("fab");
    const toggle = fab && fab.querySelector(".fab__chat");
    const panel = document.getElementById("chatPanel");
    if (fab && toggle && panel) {
        const set = (open) => {
            panel.hidden = !open;
            toggle.setAttribute("aria-expanded", String(open));
            toggle.setAttribute("aria-label", open ? "Đóng khung nhắn tin" : "Mở khung nhắn tin");
            if (open) panel.querySelector("input").focus();
        };
        toggle.addEventListener("click", () => set(panel.hidden));
        document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) { set(false); toggle.focus(); } });
        document.addEventListener("click", (e) => { if (!panel.hidden && !fab.contains(e.target)) set(false); });
        const hero = document.querySelector(".hero");
        if (hero) new IntersectionObserver(([en]) => fab.classList.toggle("is-hidden", en.intersectionRatio > 0.35 && panel.hidden),
            { threshold: [0, 0.35, 1] }).observe(hero);
    }
}

/* ------------------------------------------------------------------------ */
/* Particle field (Three.js), loaded when the page is idle                   */
/* ------------------------------------------------------------------------ */
function webgl() {
    try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); }
    catch (e) { return false; }
}

function buildShapes(N) {
    // Deterministic RNG so every load draws the same forms.
    let seed = 20231109;
    const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-9)) * Math.cos(2 * Math.PI * rnd());
    const mk = () => new Float32Array(N * 3);
    const put = (arr, i, x, y, z) => { arr[i * 3] = x; arr[i * 3 + 1] = y; arr[i * 3 + 2] = z; };
    const rot = (x, y, z, ax, ay, az) => {
        let c = Math.cos(ax), s = Math.sin(ax); [y, z] = [y * c - z * s, y * s + z * c];
        c = Math.cos(ay); s = Math.sin(ay); [x, z] = [x * c + z * s, -x * s + z * c];
        c = Math.cos(az); s = Math.sin(az); [x, y] = [x * c - y * s, x * s + y * c];
        return [x, y, z];
    };
    const FLAT = -0.955;
    const discPoint = (R) => {       // uniform over a disc with the primary flat
        for (;;) {
            const r = R * Math.sqrt(rnd()), a = rnd() * Math.PI * 2;
            const x = r * Math.cos(a), y = r * Math.sin(a);
            if (y > FLAT * R) return [x, y];
        }
    };
    const rimPoint = (R) => {
        const a = rnd() * Math.PI * 2;
        let x = R * Math.cos(a), y = R * Math.sin(a);
        if (y < FLAT * R) { y = FLAT * R; x = Math.max(-0.3 * R, Math.min(0.3 * R, x)); }
        return [x, y];
    };
    const WT = [-1.02, 0.18, 0.12];  // wafer tilt

    // 0 · sand: a loose drifting cloud
    const sand = mk();
    for (let i = 0; i < N; i++) put(sand, i, gauss() * 1.9, gauss() * 1.2, gauss() * 1.4);

    // 1 · polished wafer
    const wafer = mk();
    for (let i = 0; i < N; i++) {
        const [x, y] = rnd() < 0.86 ? discPoint(1.15) : rimPoint(1.15);
        put(wafer, i, ...rot(x, y, (rnd() - 0.5) * 0.02, ...WT));
    }

    // 2 · patterned wafer: scribe lines of a die grid, plus the rim
    const dies = mk();
    const pitch = 2.3 / 13;
    for (let i = 0; i < N; i++) {
        let x, y;
        const u = rnd();
        if (u < 0.12) [x, y] = rimPoint(1.15);
        else if (u < 0.2) [x, y] = discPoint(1.1);
        else {
            for (;;) {
                const along = (rnd() * 2 - 1) * 1.15;
                const line = (Math.floor(rnd() * 13) - 6) * pitch + pitch / 2;
                [x, y] = rnd() < 0.5 ? [line, along] : [along, line];
                if (x * x + y * y < 1.1 * 1.1 && y > FLAT * 1.15 + 0.06) break;
            }
        }
        put(dies, i, ...rot(x, y, 0, ...WT));
    }

    // 3 · sputtering target: thick disc with the racetrack erosion groove
    const target = mk();
    for (let i = 0; i < N; i++) {
        const u = rnd(), a = rnd() * Math.PI * 2;
        let r, z;
        if (u < 0.42) { r = 0.62 + gauss() * 0.07; z = 0.18 - Math.exp(-((r - 0.62) ** 2) / 0.01) * 0.08; }
        else if (u < 0.66) { r = Math.round(Math.sqrt(rnd()) * 14) / 14; z = 0.18; }
        else if (u < 0.92) { r = 1.0; z = (rnd() - 0.5) * 0.36; }
        else { r = Math.sqrt(rnd()) * 1.0; z = -0.18; }
        put(target, i, ...rot(r * Math.cos(a), r * Math.sin(a), z, -1.0, 0.25, 0));
    }

    // 4 · tube furnace, with a boat of wafers standing inside
    const furnace = mk();
    for (let i = 0; i < N; i++) {
        const u = rnd(), a = rnd() * Math.PI * 2;
        let x, y, z;
        if (u < 0.55) { x = (Math.round(rnd() * 28) / 28 * 2 - 1) * 1.45 + gauss() * 0.006; y = 0.52 * Math.cos(a); z = 0.52 * Math.sin(a); }
        else if (u < 0.72) { const r = 0.52 + rnd() * 0.18; x = (rnd() < 0.5 ? -1 : 1) * 1.45; y = r * Math.cos(a); z = r * Math.sin(a); }
        else { const k = Math.floor(rnd() * 11); const [dy, dz] = discPoint(0.3); x = -0.9 + k * 0.18; y = dy - 0.08; z = dz; }
        put(furnace, i, ...rot(x, y, z, 0.32, -0.55, 0.06));
    }

    // 5 · silicon: diamond-cubic lattice, atoms and bonds
    const lattice = mk();
    const atoms = [];
    const basis = [[0, 0, 0], [0, .5, .5], [.5, 0, .5], [.5, .5, 0]];
    const C = 2;
    for (let cx = 0; cx <= C; cx++) for (let cy = 0; cy <= C; cy++) for (let cz = 0; cz <= C; cz++)
        for (const b of basis) for (const off of [[0, 0, 0], [.25, .25, .25]]) {
            const p = [cx + b[0] + off[0], cy + b[1] + off[1], cz + b[2] + off[2]];
            if (p.every((v) => v <= C + 1e-6)) atoms.push(p);
        }
    const bonds = [];
    for (let a = 0; a < atoms.length; a++) for (let b = a + 1; b < atoms.length; b++) {
        const d = Math.hypot(atoms[a][0] - atoms[b][0], atoms[a][1] - atoms[b][1], atoms[a][2] - atoms[b][2]);
        if (Math.abs(d - Math.sqrt(3) / 4) < 0.01) bonds.push([a, b]);
    }
    const S = 1.25 / C;
    const P = (p) => [(p[0] - C / 2) * S, (p[1] - C / 2) * S, (p[2] - C / 2) * S];
    for (let i = 0; i < N; i++) {
        let x, y, z;
        if (rnd() < 0.45) {
            const at = P(atoms[Math.floor(rnd() * atoms.length)]);
            x = at[0] + gauss() * 0.022; y = at[1] + gauss() * 0.022; z = at[2] + gauss() * 0.022;
        } else {
            const [a, b] = bonds[Math.floor(rnd() * bonds.length)];
            const A = P(atoms[a]), B = P(atoms[b]), t = rnd();
            x = A[0] + (B[0] - A[0]) * t; y = A[1] + (B[1] - A[1]) * t; z = A[2] + (B[2] - A[2]) * t;
        }
        put(lattice, i, ...rot(x, y, z, 0.55, 0.62, 0));
    }

    // 6 · chip: a packaged die with pins, fanning out PCB traces that end in vias.
    //     flow = distance along a trace (0 at the pin → 1 at the via), -1 on the package,
    //     so the shader can run signal pulses outward.
    const chip = mk();
    const flow = new Float32Array(N).fill(-1);
    const seedOf = new Float32Array(N);
    const PK = 0.42, DIE = 0.25, PIN_N = 10, PIN_OUT = 0.52;
    const traces = [];
    for (let side = 0; side < 4; side++) {
        for (let k = 0; k < PIN_N; k++) {
            const u0 = -0.34 + (0.68 * k) / (PIN_N - 1);          // position along the side
            const off = u0 >= 0 ? 1 : -1;
            const L1 = 0.12 + rnd() * 0.55;                          // straight out of the pin
            const D = Math.abs(u0) * (0.4 + rnd() * 1.1);            // 45° fan-out
            const L2 = 0.9 + rnd() * 1.9;                            // long run to the edge
            // path in local "side" coords: x = outward, y = along the side
            const pts = [[PIN_OUT, u0], [PIN_OUT + L1, u0], [PIN_OUT + L1 + D, u0 + off * D], [PIN_OUT + L1 + D + L2, u0 + off * D]];
            const segs = [];
            let len = 0;
            for (let s = 0; s < 3; s++) {
                const [x0, y0] = pts[s], [x1, y1] = pts[s + 1];
                const l = Math.hypot(x1 - x0, y1 - y0);
                segs.push([x0, y0, x1, y1, len, l]); len += l;
            }
            traces.push({ side, segs, len, end: pts[3], seed: rnd() });
        }
    }
    const totalLen = traces.reduce((s, t) => s + t.len, 0);
    const toWorld = (side, x, y) => [[x, y], [-y, x], [-x, -y], [y, -x]][side];
    for (let i = 0; i < N; i++) {
        const u = rnd();
        let x, y, z = 0;
        if (u < 0.1) {                                              // package outline + die outline
            const inner = rnd() < 0.45, h = inner ? DIE : PK, e = (rnd() * 2 - 1) * h;
            [x, y] = [[e, h], [e, -h], [h, e], [-h, e]][Math.floor(rnd() * 4)];
            z = inner ? 0.05 : 0.04;
        } else if (u < 0.2) {                                       // package top surface
            x = (rnd() * 2 - 1) * PK; y = (rnd() * 2 - 1) * PK; z = 0.04;
        } else if (u < 0.28) {                                      // die: a fine grid of circuitry
            const g = 7, line = (Math.floor(rnd() * g) + 0.5) / g * 2 * DIE - DIE, along = (rnd() * 2 - 1) * DIE;
            [x, y] = rnd() < 0.5 ? [line, along] : [along, line]; z = 0.05;
        } else if (u < 0.36) {                                      // pins
            const side = Math.floor(rnd() * 4), k = Math.floor(rnd() * PIN_N);
            const u0 = -0.34 + (0.68 * k) / (PIN_N - 1), o = PK + rnd() * (PIN_OUT - PK);
            [x, y] = toWorld(side, o, u0 + (rnd() - 0.5) * 0.015); z = 0.02;
        } else {                                                    // traces (+ a via ring at each end)
            let r = rnd() * totalLen, tr = traces[0];
            for (const t of traces) { if (r < t.len) { tr = t; break; } r -= t.len; }
            let lx, ly;
            if (rnd() < 0.1) {
                const a = rnd() * Math.PI * 2;
                lx = tr.end[0] + Math.cos(a) * 0.035; ly = tr.end[1] + Math.sin(a) * 0.035;
                flow[i] = 1;
            } else {
                const s = r;                                      // position along the chosen trace
                const sg = tr.segs.find((q) => s <= q[4] + q[5]) || tr.segs[2];
                const f = (s - sg[4]) / sg[5];
                lx = sg[0] + (sg[2] - sg[0]) * f; ly = sg[1] + (sg[3] - sg[1]) * f;
                flow[i] = s / tr.len;
            }
            [x, y] = toWorld(tr.side, lx, ly);
            seedOf[i] = tr.seed;
        }
        put(chip, i, ...rot(x, y, z, -0.62, 0.0, 0.18));
    }

    return { shapes: [sand, wafer, dies, target, furnace, lattice, chip], flow, seed: seedOf };
}

async function startField() {
    if (!webgl()) return;
    const THREE = await import("three");
    const small = !wide();
    const N = small ? 7000 : 16000;
    const { shapes, flow, seed } = buildShapes(N);

    const canvas = document.createElement("canvas");
    canvas.className = "fx";
    canvas.setAttribute("aria-hidden", "true");
    document.body.prepend(canvas);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const scene = new THREE.Scene();
    const FOV = 35, CZ = 6;
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 50);
    camera.position.z = CZ;

    const geo = new THREE.BufferGeometry();
    shapes.forEach((arr, k) => geo.setAttribute("aS" + k, new THREE.BufferAttribute(arr, 3)));
    geo.setAttribute("position", new THREE.BufferAttribute(shapes[1], 3));
    const rand = new Float32Array(N), jit = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
        rand[i] = Math.random();
        jit[i * 3] = Math.random() - 0.5; jit[i * 3 + 1] = Math.random() - 0.5; jit[i * 3 + 2] = Math.random() - 0.5;
    }
    geo.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    geo.setAttribute("aJit", new THREE.BufferAttribute(jit, 3));
    geo.setAttribute("aFlow", new THREE.BufferAttribute(flow, 1));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));

    const mat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        uniforms: {
            uMorph: { value: reduceMotion ? 1 : 0 },
            uTime: { value: 0 },
            uSize: { value: small ? 2.1 : 2.4 },
            uPR: { value: renderer.getPixelRatio() },
            uOpacity: { value: 1 },
            uLight: { value: isLight() ? 1 : 0 },
            // light-mode ink: base colour, accent colour, overall strength
            uLightA: { value: new THREE.Color().setHex(0x16213a, THREE.LinearSRGBColorSpace) },   // navy black
            uLightB: { value: new THREE.Color().setHex(0x2a4a86, THREE.LinearSRGBColorSpace) },   // deep navy accents
            uLightK: { value: 0.55 },
        },
        vertexShader: /* glsl */`
            attribute vec3 aS0; attribute vec3 aS1; attribute vec3 aS2; attribute vec3 aS3;
            attribute vec3 aS4; attribute vec3 aS5; attribute vec3 aS6;
            attribute float aRand; attribute vec3 aJit; attribute float aFlow; attribute float aSeed;
            uniform float uMorph, uTime, uSize, uPR;
            varying float vAlpha; varying float vBlue; varying float vPulse;
            float stage(float k) {                       // per-point staggered 0..1 for stage k→k+1
                float t = clamp((uMorph - k) * 1.7 - aRand * 0.7, 0.0, 1.0);
                return t * t * (3.0 - 2.0 * t);
            }
            void main() {
                vec3 p = aS0; float swirl = 0.0; float t;
                t = stage(0.0); p = mix(p, aS1, t); swirl += sin(t * 3.14159);
                t = stage(1.0); p = mix(p, aS2, t); swirl += sin(t * 3.14159);
                t = stage(2.0); p = mix(p, aS3, t); swirl += sin(t * 3.14159);
                t = stage(3.0); p = mix(p, aS4, t); swirl += sin(t * 3.14159);
                t = stage(4.0); p = mix(p, aS5, t); swirl += sin(t * 3.14159);
                t = stage(5.0); p = mix(p, aS6, t); swirl += sin(t * 3.14159);
                p += aJit * swirl * 0.55;                                    // scatter mid-morph
                p += aJit * 0.012 * sin(uTime * 1.3 + aRand * 40.0);         // breathing
                vec4 mv = modelViewMatrix * vec4(p, 1.0);
                gl_Position = projectionMatrix * mv;
                float tw = 0.75 + 0.25 * sin(uTime * 2.0 + aRand * 60.0);
                gl_PointSize = uSize * uPR * (6.0 / -mv.z) * (0.7 + aRand * 0.6);
                vAlpha = tw * smoothstep(9.0, 4.0, -mv.z);
                vBlue = step(0.86, aRand);
                // chip stage: pulses run from the pins out to the vias
                float fin = clamp(uMorph - 5.0, 0.0, 1.0);
                float ph = fract(aFlow * 1.1 - uTime * 0.42 + aSeed * 5.0);
                vPulse = aFlow < 0.0 ? 0.0 : fin * exp(-pow((ph - 0.12) * 11.0, 2.0));
                vAlpha *= mix(1.0, aFlow < 0.0 ? 1.25 : 0.7, fin);
                gl_PointSize *= 1.0 + vPulse * 1.3;
            }`,
        fragmentShader: /* glsl */`
            uniform float uOpacity, uLight, uLightK;
            uniform vec3 uLightA, uLightB;
            varying float vAlpha; varying float vBlue; varying float vPulse;
            void main() {
                vec2 c = gl_PointCoord - 0.5;
                float d = length(c);
                if (d > 0.5) discard;
                float a = smoothstep(0.5, 0.0, d);
                vec3 warm = vec3(0.96, 0.94, 0.90);
                vec3 blue = vec3(0.45, 0.66, 1.0);
                vec3 dark = mix(warm, blue, vBlue);
                vec3 light = mix(uLightA, uLightB, vBlue);
                vec3 col = mix(dark, light, uLight);
                vec3 signal = mix(vec3(0.62, 0.8, 1.0), vec3(0.11, 0.3, 0.85), uLight);
                col = mix(col, signal, clamp(vPulse, 0.0, 1.0));
                float k = mix(0.62, uLightK, uLight);
                gl_FragColor = vec4(col, a * vAlpha * k * uOpacity * (1.0 + vPulse * 1.8));
            }`,
    });
    // Light mode keeps the particles in navy bands (see home-v2.css), so they render
    // exactly as in dark mode: light, additive dots on a dark ground.
    const setTheme = () => {
        mat.uniforms.uLight.value = 0;
        mat.blending = THREE.AdditiveBlending;
        mat.needsUpdate = true;
    };
    setTheme(isLight());
    window.addEventListener("themechange", (e) => setTheme(e.detail.light));
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    const group = new THREE.Group();
    group.add(points);
    scene.add(group);

    let worldW = 1, worldH = 1;
    const resize = () => {
        const w = window.innerWidth, h = window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        worldH = 2 * CZ * Math.tan((FOV * Math.PI / 180) / 2);
        worldW = worldH * camera.aspect;
    };
    resize();
    window.addEventListener("resize", resize);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    window.addEventListener("pointermove", (e) => {
        pointer.tx = e.clientX / window.innerWidth - 0.5;
        pointer.ty = e.clientY / window.innerHeight - 0.5;
    }, { passive: true });

    // Intro: sand gathers into the wafer.
    if (!reduceMotion && gsap) gsap.to(fx, { morph: Math.max(fx.morph, 1), duration: 2.8, ease: "power2.inOut", delay: 0.2 });
    else fx.morph = Math.max(fx.morph, 1);

    const cur = { ...fx };
    let last = performance.now(), running = true, spinY = 0;
    document.addEventListener("visibilitychange", () => {
        running = !document.hidden;
        if (running) { last = performance.now(); requestAnimationFrame(tick); }
    });
    function tick(now) {
        if (!running) return;
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        const k = reduceMotion ? 1 : 1 - Math.exp(-dt * 6);
        for (const key of ["morph", "x", "y", "scale", "opacity"]) cur[key] += (fx[key] - cur[key]) * k;
        pointer.x += (pointer.tx - pointer.x) * (1 - Math.exp(-dt * 3));
        pointer.y += (pointer.ty - pointer.y) * (1 - Math.exp(-dt * 3));

        mat.uniforms.uMorph.value = cur.morph;
        mat.uniforms.uTime.value = now / 1000;
        mat.uniforms.uOpacity.value = cur.opacity;
        const fit = Math.min(1, camera.aspect / 1.2);            // shrink on portrait screens
        group.position.set(cur.x * worldW, cur.y * worldH, 0);
        group.scale.setScalar(cur.scale * (0.72 + 0.28 * fit) * 1.05);
        if (!reduceMotion) spinY += dt * 0.09;
        const chipMix = Math.max(0, Math.min(1, cur.morph - 5));
        const sway = Math.sin(now / 4200) * 0.18;
        group.rotation.set(pointer.y * 0.25, (spinY % (Math.PI * 2)) * (1 - chipMix) + sway * chipMix + pointer.x * 0.45, 0);

        canvas.style.visibility = cur.opacity < 0.01 ? "hidden" : "";
        if (cur.opacity >= 0.01) renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
    requestAnimationFrame((t) => { last = t; canvas.classList.add("is-ready"); tick(t); });
}

const idle = (fn) => ("requestIdleCallback" in window ? requestIdleCallback(fn, { timeout: 1200 }) : setTimeout(fn, 200));
if (document.readyState === "complete") idle(() => startField().catch((e) => console.warn("[fx]", e)));
else window.addEventListener("load", () => idle(() => startField().catch((e) => console.warn("[fx]", e))), { once: true });

/* ------------------------------------------------------------------------ */
/* Header search: products (from products-data.js, loaded on first use)     */
/* and the knowledge articles; accent-insensitive, keyboard driven          */
/* ------------------------------------------------------------------------ */
{
    const form = document.querySelector(".search");
    const input = document.getElementById("q");
    const box = document.getElementById("searchResults");
    const hdr = document.querySelector(".hdr");
    const mBtn = document.querySelector(".hdr__search-btn");
    if (form && input && box) {
        const norm = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
        const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
        const vi = (v) => (v == null ? "" : typeof v === "string" ? v : v.vi || v.en || "");
        const mark = (text, q) => {
            const i = norm(text).indexOf(q);
            return i < 0 || !q ? esc(text) : esc(text.slice(0, i)) + "<mark>" + esc(text.slice(i, i + q.length)) + "</mark>" + esc(text.slice(i + q.length));
        };
        const ARTICLES = [
            ["san-pham-silicon-wafer-substrate", "Silicon Wafer & Substrate", "Sản phẩm"],
            ["san-pham-nang-luong-tai-tao", "Vật liệu & thiết bị năng lượng tái tạo", "Sản phẩm"],
            ["san-pham-thiet-bi-phong-sach", "Thiết bị phòng sạch & phòng thí nghiệm", "Sản phẩm"],
            ["san-pham-hoa-chat-vat-tu", "Hóa chất & vật tư công nghệ cao", "Sản phẩm"],
            ["catalog", "Catalog sản phẩm", "Sản phẩm"],
            ["silicon-wafer-la-gi", "Silicon wafer là gì? Cấu tạo, sản xuất & ứng dụng", "Bài viết"],
            ["phan-loai-silicon-wafer", "Phân loại silicon wafer: Si, SiC, GaAs, Sapphire, SOI", "Bài viết"],
            ["ung-dung-silicon-wafer", "Ứng dụng silicon wafer trong bán dẫn, năng lượng & cảm biến", "Bài viết"],
            ["kich-thuoc-silicon-wafer", "Kích thước silicon wafer: từ 2 inch đến 12 inch", "Bài viết"],
            ["gia-silicon-wafer", "Giá silicon wafer: 8 yếu tố quyết định chi phí", "Bài viết"],
            ["silicon-wafer-viet-nam", "Silicon wafer Việt Nam – nhà cung cấp wafer bán dẫn", "Bài viết"],
            ["chon-wafer-cho-nghien-cuu", "Chọn wafer cho nghiên cứu: MEMS, photonics, GaN epitaxy", "Bài viết"],
            ["cz-vs-fz-silicon-wafer", "CZ vs FZ silicon wafer: so sánh chi tiết", "Bài viết"],
            ["lam-sach-wafer-quy-trinh-rca", "Làm sạch silicon wafer: quy trình RCA, piranha, HF dip", "Bài viết"],
            ["phong-sach-cap-do-iso", "Phòng sạch là gì? Cấp độ sạch ISO trong sản xuất bán dẫn", "Bài viết"],
            ["quy-trinh-quang-khac-photolithography", "Quy trình quang khắc (photolithography) trong sản xuất chip", "Bài viết"],
            ["bia-phun-xa-sputtering-target", "Bia phún xạ (sputtering target) & màng mỏng", "Bài viết"],
            ["vat-lieu-nano-graphene-cnt", "Vật liệu nano: graphene, CNT & nano kim loại", "Bài viết"],
        ].map(([slug, title, kind]) => ({ href: "./" + slug + ".html", title, kind, hay: norm(title + " " + slug.replace(/-/g, " ")) }));

        let products = null, loading = null;
        const loadProducts = () => loading || (loading = new Promise((res) => {
            const build = () => {
                const out = [];
                Object.entries(window.PD_DATA || {}).forEach(([g, grp]) => (grp.items || []).forEach((it) => (it.variants || []).forEach((v) => {
                    if (!v || !v.sku) return;
                    const name = vi(v.name) || vi(it.name);
                    out.push({
                        href: "./product-detail.html?group=" + encodeURIComponent(g) + "&sku=" + encodeURIComponent(v.sku),
                        title: name, meta: vi(it.name) + " · " + v.sku,
                        img: String(v.img || it.img || ""),
                        hay: norm([name, vi(it.name), vi(it.subtitle), vi(v.desc), v.sku].join(" ")),
                    });
                })));
                products = out; res();
            };
            if (window.PD_DATA) return build();
            const s = document.createElement("script");
            s.src = "./assets/js/products-data.js";
            s.onload = build; s.onerror = () => { products = []; res(); };
            document.head.appendChild(s);
        }));

        let items = [], active = -1;
        const open = (on) => { box.hidden = !on; input.setAttribute("aria-expanded", String(on)); };
        const setActive = (i) => {
            active = i;
            items.forEach((el, k) => el.setAttribute("aria-selected", String(k === i)));
            if (items[i]) { items[i].scrollIntoView({ block: "nearest" }); input.setAttribute("aria-activedescendant", items[i].id); }
            else input.removeAttribute("aria-activedescendant");
        };
        const DOC = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/></svg>';
        const render = () => {
            const raw = input.value.trim(), q = norm(raw);
            if (!q) { open(false); items = []; return; }
            const tokens = q.split(/\s+/);
            const hit = (x) => tokens.every((t) => x.hay.includes(t));
            const prods = (products || []).filter(hit).slice(0, 6);
            const docs = ARTICLES.filter(hit).slice(0, 4);
            let html = "", n = 0;
            const row = (x, thumb) => '<a class="sr__item" role="option" id="sr-' + (n++) + '" href="' + esc(x.href) + '" aria-selected="false">' + thumb +
                '<span><span class="sr__name">' + mark(x.title, tokens[0]) + '</span><span class="sr__meta">' + esc(x.meta || x.kind) + "</span></span></a>";
            if (prods.length) html += '<p class="sr__group">Sản phẩm</p>' + prods.map((x) => row(x, '<img class="sr__thumb" src="' + esc(x.img) + '" alt="" loading="lazy">')).join("");
            if (docs.length) html += '<p class="sr__group">Trang &amp; bài viết</p>' + docs.map((x) => row(x, '<span class="sr__doc">' + DOC + "</span>")).join("");
            if (!n) html = '<p class="sr__empty">' + (products
                ? "Không tìm thấy kết quả cho “" + esc(raw) + "”. Thử từ khóa khác, ví dụ “SiC” hoặc “sputtering”, hoặc <a href=\"./catalog.html\">xem toàn bộ catalog</a>."
                : "Đang tải danh mục sản phẩm…") + "</p>";
            box.innerHTML = html;
            items = [...box.querySelectorAll(".sr__item")];
            open(true);
            setActive(items.length ? 0 : -1);
        };
        input.addEventListener("focus", () => { loadProducts().then(() => { if (input.value.trim()) render(); }); if (input.value.trim()) render(); });
        input.addEventListener("input", () => { render(); if (!products) loadProducts().then(render); });
        input.addEventListener("keydown", (e) => {
            if (e.key === "ArrowDown" && items.length) { e.preventDefault(); setActive((active + 1) % items.length); }
            else if (e.key === "ArrowUp" && items.length) { e.preventDefault(); setActive((active - 1 + items.length) % items.length); }
            else if (e.key === "Escape") {
                if (!box.hidden) open(false);
                else { input.value = ""; input.blur(); hdr.classList.remove("is-searching"); }
            }
        });
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            if (items[active]) location.href = items[active].href;
            else if (input.value.trim()) location.href = "./catalog.html";
        });
        document.addEventListener("click", (e) => {
            if (form.contains(e.target) || (mBtn && mBtn.contains(e.target))) return;
            open(false);
            hdr.classList.remove("is-searching");
            if (mBtn) mBtn.setAttribute("aria-expanded", "false");
        });
        // "/" focuses the search from anywhere, except while typing in a field
        document.addEventListener("keydown", (e) => {
            if (e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); }
        });
        if (mBtn) mBtn.addEventListener("click", () => {
            const on = !hdr.classList.contains("is-searching");
            hdr.classList.toggle("is-searching", on);
            mBtn.setAttribute("aria-expanded", String(on));
            if (on) input.focus();
        });
    }
}

/* ------------------------------------------------------------------------ */
/* Research applications: opening the panel changes the page height, so     */
/* scroll-driven effects re-measure; the IEMN notes open it directly.       */
/* ------------------------------------------------------------------------ */
{
    const apps = document.getElementById("applications");
    if (apps) {
        apps.addEventListener("toggle", () => { if (window.ScrollTrigger) window.ScrollTrigger.refresh(); });
        document.querySelectorAll("[data-open-apps]").forEach((a) => a.addEventListener("click", () => { apps.open = true; }));
    }
    // Lightbox: shows the photo at its own pixel size (capped to the screen), never enlarged.
    const lb = document.querySelector(".lb");
    if (lb && typeof lb.showModal === "function") {
        const cap = lb.querySelector(".lb__cap");
        const img = document.createElement("img");     // created here so the page never ships an empty <img>
        img.className = "lb__img"; lb.insertBefore(img, cap);
        document.querySelectorAll(".case__zoom").forEach((btn) => btn.addEventListener("click", () => {
            const src = btn.querySelector("img");
            img.src = btn.dataset.full; img.alt = src.alt;
            img.style.width = src.naturalWidth ? Math.min(src.naturalWidth, window.innerWidth * 0.86) + "px" : "";
            cap.textContent = btn.closest("figure").querySelector("figcaption").textContent.replace(/^\d{2}/, "").trim();
            lb.showModal();
        }));
        lb.querySelector(".lb__close").addEventListener("click", () => lb.close());
        lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
    }
}
