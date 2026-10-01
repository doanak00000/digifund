/* ==========================================================================
   DIGIFUND home v2 · value chain in 3D (preview-index.html)
   --------------------------------------------------------------------------
   A small fab line on a blueprint floor: seven stations (wafer → lithography
   → etch → deposition → CMP → packaging → device), each a procedural model on
   a hex pedestal. A wafer carrier rides the rail from station to station; the
   station it sits on lights up, and so do its HTML label and product sign,
   which are positioned over the canvas every frame.
   Loaded on demand by home-v2.js (wide screens with WebGL only); the CSS
   version of the section stays as the fallback.
   ========================================================================== */

import * as THREE from "three";

const BG = 0x0f2150;
const BLUE = 0x60a5fa, ICE = 0xbfdbfe, CYAN = 0x22d3ee, VIOLET = 0xa78bfa, AMBER = 0xf59e0b;
const N = 7, SP = 2.45;
const X = (i) => (i - 3) * SP;
// captions alternate: even steps float above their model, odd steps sit on the floor in front
const HIGH_Y = 2.5, LOW_Z = 1.55;
const TOP = [1.5, 2.2, 1.7, 1.8, 1.85, 1.25, 1.65];   // rough top of each model, where the upper leader starts

/* ---------------------------------------------------------------- textures */
let seed = 7;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

function canvasTex(w, h, draw) {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    draw(c.getContext("2d"), w, h);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
}

// patterned wafer: rainbow dies on a dark ground, with a specular sweep
const waferTex = () => canvasTex(512, 512, (g, s) => {
    const r = s / 2;
    g.fillStyle = "#0a1330"; g.fillRect(0, 0, s, s);
    g.save(); g.beginPath(); g.arc(r, r, r - 3, 0, Math.PI * 2); g.clip();
    const rain = g.createLinearGradient(0, 0, s, s);
    ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#84cc16", "#22d3ee", "#6366f1"].forEach((c, i, a) => rain.addColorStop(i / (a.length - 1), c));
    const step = s / 17, gap = 2.2;
    for (let y = 0; y < s; y += step) for (let x = 0; x < s; x += step) {
        g.globalAlpha = 0.55 + rnd() * 0.35;
        g.fillStyle = rain;
        g.fillRect(x + gap, y + gap, step - gap * 2, step - gap * 2);
    }
    g.globalAlpha = 1;
    const hl = g.createRadialGradient(r * 0.62, r * 0.5, 0, r, r, r);
    hl.addColorStop(0, "rgba(255,255,255,0.45)"); hl.addColorStop(0.45, "rgba(255,255,255,0.05)"); hl.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = hl; g.fillRect(0, 0, s, s);
    g.restore();
    g.strokeStyle = "rgba(200,220,255,0.8)"; g.lineWidth = 4;
    g.beginPath(); g.arc(r, r, r - 4, 0, Math.PI * 2); g.stroke();
});

// die / screen: orthogonal traces and pads
const circuitTex = (bg = "#0a1a46", ink = "#60a5fa", n = 46) => canvasTex(256, 256, (g, s) => {
    g.fillStyle = bg; g.fillRect(0, 0, s, s);
    g.strokeStyle = ink; g.fillStyle = ink; g.lineWidth = 2;
    const q = s / 16;
    for (let k = 0; k < n; k++) {
        let x = Math.floor(rnd() * 16) * q + q / 2, y = Math.floor(rnd() * 16) * q + q / 2;
        g.globalAlpha = 0.35 + rnd() * 0.6;
        g.beginPath(); g.moveTo(x, y);
        for (let j = 0; j < 3; j++) {
            if (rnd() < 0.5) x += (Math.floor(rnd() * 7) - 3) * q; else y += (Math.floor(rnd() * 7) - 3) * q;
            g.lineTo(x, y);
        }
        g.stroke();
        g.fillRect(x - 3, y - 3, 6, 6);
    }
    g.globalAlpha = 0.9; g.lineWidth = 3; g.strokeRect(4, 4, s - 8, s - 8);
});

// photomask: bright apertures in chrome
const maskTex = () => canvasTex(256, 256, (g, s) => {
    g.fillStyle = "#101a33"; g.fillRect(0, 0, s, s);
    const q = s / 8;
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
        g.fillStyle = `rgba(190, 215, 255, ${0.35 + rnd() * 0.55})`;
        g.fillRect(x * q + 6, y * q + 6, q - 12, q - 12);
        g.fillStyle = "#101a33";
        g.fillRect(x * q + q * 0.35, y * q + 6, q * 0.12, q - 12);
    }
});

// CMP pad: concentric grooves
const padTex = () => canvasTex(512, 512, (g, s) => {
    const r = s / 2;
    g.fillStyle = "#1b3a7a"; g.fillRect(0, 0, s, s);
    g.strokeStyle = "rgba(160, 200, 255, 0.35)"; g.lineWidth = 2;
    for (let k = 12; k < r; k += 14) { g.beginPath(); g.arc(r, r, k, 0, Math.PI * 2); g.stroke(); }
    g.strokeStyle = "rgba(160, 200, 255, 0.2)";
    for (let a = 0; a < 12; a++) {
        g.beginPath(); g.moveTo(r, r); g.lineTo(r + Math.cos(a * Math.PI / 6) * r, r + Math.sin(a * Math.PI / 6) * r); g.stroke();
    }
});

// device screen: a glowing gradient with a chip glyph
const screenTex = () => canvasTex(256, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, "#1d4ed8"); gr.addColorStop(0.55, "#7c3aed"); gr.addColorStop(1, "#0891b2");
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.strokeStyle = "rgba(255,255,255,0.85)"; g.lineWidth = 6;
    g.strokeRect(w / 2 - 44, h / 2 - 44, 88, 88);
    g.lineWidth = 4;
    for (let k = -30; k <= 30; k += 20) {
        g.beginPath(); g.moveTo(w / 2 + k, h / 2 - 44); g.lineTo(w / 2 + k, h / 2 - 64); g.stroke();
        g.beginPath(); g.moveTo(w / 2 + k, h / 2 + 44); g.lineTo(w / 2 + k, h / 2 + 64); g.stroke();
        g.beginPath(); g.moveTo(w / 2 - 44, h / 2 + k); g.lineTo(w / 2 - 64, h / 2 + k); g.stroke();
        g.beginPath(); g.moveTo(w / 2 + 44, h / 2 + k); g.lineTo(w / 2 + 64, h / 2 + k); g.stroke();
    }
    g.fillStyle = "rgba(255,255,255,0.18)"; g.fillRect(24, 40, w - 48, 10); g.fillRect(24, h - 70, w * 0.5, 10);
});

// round soft sprite for point clouds
const dotTex = () => canvasTex(64, 64, (g, s) => {
    const r = s / 2, gr = g.createRadialGradient(r, r, 0, r, r, r);
    gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.35, "rgba(255,255,255,0.55)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr; g.fillRect(0, 0, s, s);
});

/* --------------------------------------------------------------- materials */
function makeMaterials() {
    return {
        metal: new THREE.MeshStandardMaterial({ color: 0x1a2f66, metalness: 0.75, roughness: 0.32 }),
        steel: new THREE.MeshStandardMaterial({ color: 0xaebfe0, metalness: 0.95, roughness: 0.22 }),
        dark: new THREE.MeshStandardMaterial({ color: 0x0c1838, metalness: 0.6, roughness: 0.45 }),
        edge: new THREE.LineBasicMaterial({ color: 0x8fb8ff, transparent: true, opacity: 0.6 }),
        edgeDim: new THREE.LineBasicMaterial({ color: 0x5b8cff, transparent: true, opacity: 0.35 }),
        glass: new THREE.MeshStandardMaterial({ color: 0x9cc3ff, metalness: 0.1, roughness: 0.05, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false }),
    };
}
const glow = (color, opacity = 0.5) => new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
function edges(mesh, mat, angle = 25) {
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, angle), mat));
    return mesh;
}

/* ------------------------------------------------------------------ models */
// every model: { group, update(t, dt, act) }, act = 0..1 how "active" the station is
function waferDisc(M, tex, r = 0.62) {
    const top = new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: 0.45, metalness: 0.55, roughness: 0.28 });
    return new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.03, 72), [M.steel, top, M.dark]);
}

function mWafer(M, T) {
    const group = new THREE.Group();
    const tilt = new THREE.Group(); tilt.rotation.x = 0.55; tilt.position.y = 1.0;
    const spin = new THREE.Group();
    spin.add(waferDisc(M, T.wafer, 0.7));
    tilt.add(spin); group.add(tilt);
    const halo = new THREE.Mesh(new THREE.RingGeometry(0.78, 0.82, 96), glow(ICE, 0.5));
    halo.rotation.x = -Math.PI / 2 + 0.55; halo.position.y = 1.0;
    group.add(halo);
    return { group, update(t, dt, act) {
        spin.rotation.y = t * 0.35;
        tilt.position.y = halo.position.y = 1.0 + Math.sin(t * 1.4) * 0.05;
        halo.material.opacity = 0.25 + act * 0.5;
    } };
}

function mLitho(M, T) {
    const group = new THREE.Group();
    for (const x of [-0.62, 0.62]) {
        const post = edges(new THREE.Mesh(new THREE.BoxGeometry(0.09, 1.95, 0.09), M.metal), M.edgeDim);
        post.position.set(x, 1.17, -0.28); group.add(post);
    }
    const beam = edges(new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.14, 0.5), M.metal), M.edge);
    beam.position.set(0, 2.1, -0.1); group.add(beam);
    [[0.34, 0.14, 1.92], [0.27, 0.1, 1.8], [0.2, 0.08, 1.7]].forEach(([r, h, y]) => {
        const lens = edges(new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 48), M.steel), M.edgeDim, 40);
        lens.position.y = y; group.add(lens);
    });
    const mask = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 0.78), new THREE.MeshBasicMaterial({ map: T.mask, transparent: true, opacity: 0.9, side: THREE.DoubleSide }));
    mask.rotation.x = -Math.PI / 2; mask.position.y = 1.32; group.add(mask);
    const outer = new THREE.Mesh(new THREE.ConeGeometry(0.46, 1.36, 48, 1, true), glow(VIOLET, 0.16));
    outer.position.y = 0.3 + 0.68; group.add(outer);
    const inner = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1.36, 32, 1, true), glow(0xc4b5fd, 0.3));
    inner.position.y = outer.position.y; group.add(inner);
    const w = waferDisc(M, T.wafer, 0.5); w.position.y = 0.3; group.add(w);
    const spot = new THREE.Mesh(new THREE.CircleGeometry(0.44, 48), glow(VIOLET, 0.5));
    spot.rotation.x = -Math.PI / 2; spot.position.y = 0.32; group.add(spot);
    return { group, update(t, dt, act) {
        const flash = 0.55 + 0.45 * Math.max(0, Math.sin(t * 3.2));
        outer.material.opacity = (0.08 + act * 0.14) * flash;
        inner.material.opacity = (0.14 + act * 0.3) * flash;
        spot.material.opacity = (0.2 + act * 0.45) * flash;
        mask.position.x = Math.sin(t * 0.9) * 0.06;
    } };
}

function mEtch(M, T) {
    const group = new THREE.Group();
    const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.56, 1.24, 48, 1, true), M.glass);
    glass.position.y = 0.9; group.add(glass);
    for (const y of [0.28, 1.52]) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.57, 0.022, 8, 72), M.steel);
        ring.rotation.x = Math.PI / 2; ring.position.y = y; group.add(ring);
    }
    const lid = edges(new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.1, 48), M.metal), M.edge, 40);
    lid.position.y = 1.6; group.add(lid);
    const pts = [];
    for (let a = 0; a <= Math.PI * 8; a += 0.08) pts.push(new THREE.Vector3(Math.cos(a) * 0.66, 1.05 + a / (Math.PI * 2) * 0.1, Math.sin(a) * 0.66));
    const coil = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 400, 0.022, 8),
        new THREE.MeshStandardMaterial({ color: AMBER, emissive: 0xb45309, emissiveIntensity: 0.9, metalness: 0.8, roughness: 0.3 }));
    group.add(coil);
    const n = 320, pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
    const cA = new THREE.Color(VIOLET), cB = new THREE.Color(0xf472b6), tmp = new THREE.Color();
    for (let i = 0; i < n; i++) {
        const r = Math.sqrt(rnd()) * 0.46, a = rnd() * Math.PI * 2;
        pos.set([Math.cos(a) * r, 0.42 + rnd() * 0.95, Math.sin(a) * r], i * 3);
        tmp.copy(cA).lerp(cB, rnd()); col.set([tmp.r, tmp.g, tmp.b], i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const plasma = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.09, map: T.dot, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }));
    group.add(plasma);
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 16), glow(VIOLET, 0.25));
    core.position.y = 0.9; group.add(core);
    const w = waferDisc(M, T.wafer, 0.46); w.position.y = 0.3; group.add(w);
    return { group, update(t, dt, act) {
        plasma.rotation.y = t * 1.1;
        plasma.material.opacity = 0.45 + act * 0.5;
        core.scale.setScalar(1 + Math.sin(t * 5) * 0.08 + act * 0.25);
        core.material.opacity = 0.12 + act * 0.25;
        coil.material.emissiveIntensity = 0.5 + act * 1.2;
    } };
}

function mDepo(M, T) {
    const group = new THREE.Group();
    const frame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.2, 1.5, 1.1)), M.edge);
    frame.position.y = 1.0; group.add(frame);
    const walls = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.5, 1.1), M.glass);
    walls.position.y = 1.0; group.add(walls);
    const target = edges(new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.1, 56), M.steel), M.edgeDim, 40);
    target.position.y = 1.62; group.add(target);
    const track = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.028, 10, 72), glow(0xf0abfc, 0.8));
    track.rotation.x = Math.PI / 2; track.position.y = 1.55; group.add(track);
    const n = 220, pos = new Float32Array(n * 3), speed = new Float32Array(n);
    for (let i = 0; i < n; i++) {
        const r = Math.sqrt(rnd()) * 0.4, a = rnd() * Math.PI * 2;
        pos.set([Math.cos(a) * r, 0.35 + rnd() * 1.15, Math.sin(a) * r], i * 3);
        speed[i] = 0.35 + rnd() * 0.5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const flux = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.06, map: T.dot, color: 0xa5f3fc, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }));
    group.add(flux);
    const w = waferDisc(M, T.wafer, 0.46); w.position.y = 0.3; group.add(w);
    const film = new THREE.Mesh(new THREE.CircleGeometry(0.46, 48), glow(CYAN, 0.3));
    film.rotation.x = -Math.PI / 2; film.position.y = 0.32; group.add(film);
    return { group, update(t, dt, act) {
        const p = geo.attributes.position.array;
        for (let i = 0; i < n; i++) {
            p[i * 3 + 1] -= speed[i] * dt * (0.6 + act);
            if (p[i * 3 + 1] < 0.33) p[i * 3 + 1] = 1.5;
        }
        geo.attributes.position.needsUpdate = true;
        flux.material.opacity = 0.35 + act * 0.55;
        track.material.opacity = 0.35 + act * 0.6;
        film.material.opacity = 0.12 + act * 0.3;
    } };
}

function mCmp(M, T) {
    const group = new THREE.Group();
    const platen = new THREE.Group(); platen.position.y = 0.32;
    const padTop = new THREE.MeshStandardMaterial({ map: T.pad, emissiveMap: T.pad, emissive: 0xffffff, emissiveIntensity: 0.35, metalness: 0.3, roughness: 0.6 });
    platen.add(new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.86, 0.09, 72), [M.steel, padTop, M.dark]));
    group.add(platen);
    const head = new THREE.Group(); head.position.set(0.3, 0.45, -0.12);
    head.add(edges(new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.16, 40), M.steel), M.edgeDim, 40));
    group.add(head);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.1, 16), M.steel);
    shaft.position.set(0.3, 1.05, -0.12); group.add(shaft);
    const housing = edges(new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.28, 0.34), M.metal), M.edge);
    housing.position.set(0.3, 1.66, -0.12); group.add(housing);
    const armPivot = new THREE.Group(); armPivot.position.set(-0.85, 0.56, 0.5);
    const arm = edges(new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.05, 0.07), M.metal), M.edgeDim);
    arm.position.x = 0.36; armPivot.add(arm);
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.06, 32), M.steel);
    disc.position.set(0.7, -0.1, 0); armPivot.add(disc);
    group.add(armPivot);
    const drop = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 8), glow(0xe0f2fe, 0.9));
    group.add(drop);
    const sheen = new THREE.Mesh(new THREE.RingGeometry(0.2, 0.84, 64), glow(BLUE, 0.2));
    sheen.rotation.x = -Math.PI / 2; sheen.position.y = 0.375; group.add(sheen);
    return { group, update(t, dt, act) {
        platen.rotation.y = t * 0.9;
        head.rotation.y = -t * 2.2;
        armPivot.rotation.y = Math.sin(t * 0.8) * 0.45;
        const u = (t * 0.9) % 1;
        drop.position.set(-0.1, 1.05 - u * 0.68, 0.1);
        sheen.material.opacity = 0.08 + act * 0.25;
    } };
}

function mPack(M, T) {
    const group = new THREE.Group();
    const sub = edges(new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.08, 1.15), new THREE.MeshStandardMaterial({ color: 0x0f766e, metalness: 0.3, roughness: 0.55 })), M.edge);
    sub.position.y = 0.34; group.add(sub);
    const balls = new THREE.InstancedMesh(new THREE.SphereGeometry(0.035, 10, 6), M.steel, 100);
    const m4 = new THREE.Matrix4();
    for (let i = 0; i < 100; i++) { m4.makeTranslation(((i % 10) - 4.5) * 0.11, 0.28, (Math.floor(i / 10) - 4.5) * 0.11); balls.setMatrixAt(i, m4); }
    group.add(balls);
    const inter = edges(new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.05, 0.88), new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7, roughness: 0.3 })), M.edgeDim);
    group.add(inter);
    const dieMat = new THREE.MeshStandardMaterial({ color: 0x0b1a44, emissive: 0xffffff, emissiveMap: T.circuit, emissiveIntensity: 0.9, metalness: 0.5, roughness: 0.35 });
    const logic = edges(new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.07, 0.46), [M.dark, M.dark, dieMat, M.dark, M.dark, M.dark]), M.edge);
    logic.position.x = -0.16; group.add(logic);
    const hbm = [];
    for (const z of [-0.15, 0.15]) for (let k = 0; k < 4; k++) {
        const sl = edges(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.035, 0.24), k === 3 ? [M.metal, M.metal, dieMat, M.metal, M.metal, M.metal] : M.metal), M.edgeDim);
        sl.position.set(0.22, 0, z); group.add(sl); hbm.push([sl, k]);
    }
    const halo = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.3), glow(CYAN, 0.15));
    halo.rotation.x = -Math.PI / 2; halo.position.y = 0.39; group.add(halo);
    return { group, update(t, dt, act) {
        const e = (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.9))) * (0.5 + act * 0.5);
        inter.position.y = 0.42 + e * 0.18;
        logic.position.y = 0.5 + e * 0.42;
        hbm.forEach(([sl, k]) => (sl.position.y = 0.5 + e * 0.42 + k * (0.045 + e * 0.07)));
        dieMat.emissiveIntensity = 0.5 + act * 0.9;
        halo.material.opacity = 0.05 + act * 0.2;
    } };
}

function mDevice(M, T) {
    const group = new THREE.Group();
    const dev = new THREE.Group(); dev.position.y = 1.05;
    dev.add(edges(new THREE.Mesh(new THREE.BoxGeometry(0.62, 1.12, 0.06), M.metal), M.edge));
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 1.04), new THREE.MeshBasicMaterial({ map: T.screen, toneMapped: false }));
    scr.position.z = 0.032; dev.add(scr);
    group.add(dev);
    const chip = edges(new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.05, 0.34), new THREE.MeshStandardMaterial({ color: 0x0b1a44, emissive: 0xffffff, emissiveMap: T.circuit, emissiveIntensity: 0.8 })), M.edge);
    chip.position.set(0, 0.36, 0.45); group.add(chip);
    return { group, update(t, dt, act) {
        dev.rotation.y = Math.sin(t * 0.6) * 0.35;
        dev.position.y = 1.05 + Math.sin(t * 1.2) * 0.04;
        scr.material.color.setScalar(0.55 + act * 0.45);
        chip.rotation.y = t * 0.8;
    } };
}

/* ------------------------------------------------------------------- scene */
export function mountValueChain(root, { reduceMotion = false } = {}) {
    const steps = [...root.querySelectorAll(".vc__step")];
    const cards = steps.map((s) => s.querySelector(".vc__card"));

    const canvas = document.createElement("canvas");
    canvas.className = "vc__gl";
    canvas.setAttribute("aria-hidden", "true");
    canvas.addEventListener("mousedown", (e) => e.preventDefault());   // no selection tint on click
    root.prepend(canvas);

    // preserveDrawingBuffer: Chrome on Windows re-composites the page when anything above the canvas
    // changes (label hovers); without it that can show the already-cleared buffer as a black flash.
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    const light = document.documentElement.getAttribute("data-theme") === "light";
    const band = getComputedStyle(root.closest(".chain") || root).getPropertyValue("--bg").trim();
    const bg = new THREE.Color(band || BG);
    renderer.setClearColor(bg, 1);
    const scene = new THREE.Scene();
    scene.background = bg;
    scene.fog = new THREE.Fog(bg, 16, 32);
    const camera = new THREE.PerspectiveCamera(28, 2, 0.1, 80);
    const target = new THREE.Vector3(0, 1.48, 0.35);   // aimed a little high so the line sits low in a shorter stage

    scene.add(new THREE.HemisphereLight(0xb7d0ff, 0x0b1430, 1.1));
    const sun = new THREE.DirectionalLight(0xffffff, 1.6); sun.position.set(4, 9, 7); scene.add(sun);
    const rim = new THREE.DirectionalLight(0x7c3aed, 0.8); rim.position.set(-6, 3, -6); scene.add(rim);
    const spot = new THREE.PointLight(0x7fb0ff, 14, 6, 1.6); scene.add(spot);

    const T = { wafer: waferTex(), circuit: circuitTex(), mask: maskTex(), pad: padTex(), screen: screenTex(), dot: dotTex() };
    const M = makeMaterials();

    // blueprint floor
    const floorU = { uTime: { value: 0 }, uActive: { value: new THREE.Vector2() }, uLight: { value: light ? 1 : 0 } };
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(46, 26), new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, uniforms: floorU,
        vertexShader: /* glsl */`varying vec2 vP; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vP = w.xz; gl_Position = projectionMatrix * viewMatrix * w; }`,
        fragmentShader: /* glsl */`
            uniform float uTime, uLight; uniform vec2 uActive; varying vec2 vP;
            float grid(vec2 p, float s, float w){ vec2 q = p / s; vec2 g = abs(fract(q - 0.5) - 0.5) / max(fwidth(q), vec2(1e-4)); return 1.0 - min(min(g.x, g.y) / w, 1.0); }
            void main(){
                float minor = grid(vP, 0.49, 1.0);
                float major = grid(vP + vec2(${(SP / 2).toFixed(3)}, 0.0), ${SP.toFixed(3)}, 1.3);
                float fade = smoothstep(11.0, 2.5, length((vP - vec2(0.0, -0.6)) * vec2(0.55, 1.35)));
                vec2 d = vP - uActive;
                float spot = exp(-dot(d, d) * 0.8);
                float ph = fract(uTime * 0.45);
                float r = length(d) - ph * 3.2;
                float wave = exp(-r * r * 10.0) * (1.0 - ph);
                vec3 blue = mix(vec3(0.24, 0.51, 0.96), vec3(0.16, 0.38, 0.9), uLight);
                vec3 hi = mix(vec3(0.75, 0.86, 1.0), vec3(0.08, 0.26, 0.78), uLight);
                float a = (minor * mix(0.13, 0.16, uLight) + major * 0.42) * fade + spot * mix(0.32, 0.14, uLight) + wave * 0.35;
                gl_FragColor = vec4(mix(blue, hi, wave + spot * 0.4), clamp(a, 0.0, 1.0));
            }`,
    }));
    floor.rotation.x = -Math.PI / 2; scene.add(floor);

    // the rail, with pulses running downstream
    const railLen = X(N - 1) - X(0);
    const railU = { uTime: { value: 0 }, uLight: { value: light ? 1 : 0 } };
    const rail = new THREE.Mesh(new THREE.PlaneGeometry(railLen, 0.14), new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: railU,
        vertexShader: /* glsl */`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: /* glsl */`
            uniform float uTime, uLight; varying vec2 vUv;
            void main(){
                float p = 0.0;
                for (int k = 0; k < 3; k++) { float c = fract(uTime * 0.11 + float(k) / 3.0); float e = (vUv.x - c) * 38.0; p += exp(-e * e); }
                float edge = smoothstep(0.5, 0.15, abs(vUv.y - 0.5));
                vec3 col = mix(vec3(0.2, 0.45, 1.0), mix(vec3(0.85, 0.93, 1.0), vec3(0.04, 0.2, 0.66), uLight), clamp(p, 0.0, 1.0));
                gl_FragColor = vec4(col * mix(0.55 + p * 1.8, 1.0, uLight), (0.45 + p) * edge);
            }`,
    }));
    rail.rotation.x = -Math.PI / 2; rail.position.set((X(0) + X(N - 1)) / 2, 0.02, 0); scene.add(rail);
    for (const z of [-0.3, 0.3]) {
        const r = new THREE.Mesh(new THREE.BoxGeometry(railLen + 0.8, 0.025, 0.025), M.steel);
        r.position.set(rail.position.x, 0.03, z); scene.add(r);
    }

    // stations
    const builders = [mWafer, mLitho, mEtch, mDepo, mCmp, mPack, mDevice];
    const beamGeo = new THREE.CylinderGeometry(0.88, 0.88, 2.8, 48, 1, true);
    const stations = builders.map((build, i) => {
        const g = new THREE.Group(); g.position.x = X(i); scene.add(g);
        const base = edges(new THREE.Mesh(new THREE.CylinderGeometry(0.98, 1.08, 0.22, 6), M.metal), M.edge);
        base.rotation.y = Math.PI / 6; base.position.y = 0.11; g.add(base);
        const ring = new THREE.Mesh(new THREE.RingGeometry(0.8, 0.88, 6, 1), glow(ICE, 0.35));
        ring.rotation.set(-Math.PI / 2, 0, Math.PI / 6); ring.position.y = 0.225; g.add(ring);
        const beam = new THREE.Mesh(beamGeo, new THREE.ShaderMaterial({
            transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
            uniforms: { uO: { value: 0 }, uLight: { value: light ? 1 : 0 } },
            vertexShader: /* glsl */`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
            fragmentShader: /* glsl */`uniform float uO, uLight; varying vec2 vUv; void main(){ float a = pow(clamp(1.0 - vUv.y, 0.0, 1.0), 2.2) * uO; gl_FragColor = uLight > 0.5 ? vec4(0.23, 0.45, 0.95, a * 0.55) : vec4(vec3(0.45, 0.66, 1.0) * a, a); }`,
        }));
        beam.position.y = 1.62; g.add(beam);
        const model = build(M, T); g.add(model.group);
        // dashed leader to the caption: up from the model, or along the floor to the front
        const ends = i % 2 === 0
            ? [new THREE.Vector3(0, TOP[i] + 0.08, 0), new THREE.Vector3(0, HIGH_Y - 0.06, 0)]
            : [new THREE.Vector3(0, 0.02, 1.08), new THREE.Vector3(0, 0.02, LOW_Z - 0.04)];
        const lead = new THREE.Line(new THREE.BufferGeometry().setFromPoints(ends),
            new THREE.LineDashedMaterial({ color: 0x8fb8ff, dashSize: 0.07, gapSize: 0.05, transparent: true, opacity: 0.75 }));
        lead.computeLineDistances(); g.add(lead);
        return { g, ring, beam, model, act: 0 };
    });

    // the wafer carrier riding the rail
    const carrier = new THREE.Group();
    const cw = waferDisc(M, T.wafer, 0.22); carrier.add(cw);
    const cglow = new THREE.Mesh(new THREE.CircleGeometry(0.34, 40), glow(ICE, 0.55));
    cglow.rotation.x = -Math.PI / 2; cglow.position.y = -0.02; carrier.add(cglow);
    scene.add(carrier);

    // drifting motes for depth
    {
        const n = 260, pos = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) pos.set([(rnd() - 0.5) * 24, rnd() * 4.5, (rnd() - 0.5) * 9 - 1.5], i * 3);
        const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        const motes = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.05, map: T.dot, color: 0x93c5fd, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }));
        motes.userData.tick = (t) => { motes.position.y = (t * 0.06) % 0.5; };
        scene.add(motes);
        stations.motes = motes;
    }

    // No post-processing on purpose: a bloom pass smears any bad pixel into a large black
    // blotch on some Windows GPUs (Intel D3D11). The glows are additive materials instead.

    // sizing: keep the whole line in frame at any width
    let W = 1, H = 1, dist = 14;
    const baseDir = new THREE.Vector3(-2.6, 6.6, 11.4).normalize();   // a three-quarter view from the left, above
    const resize = () => {
        W = Math.max(1, root.clientWidth); H = Math.max(1, root.clientHeight);
        renderer.setSize(W, H, false);
        camera.aspect = W / H; camera.updateProjectionMatrix();
        const tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        dist = Math.max((railLen + 3.2) / 2 / (tanH * camera.aspect), 5.2 / tanH);
        // setSize clears the (opaque) canvas; draw straight away so no black frame is ever shown
        if (camera.position.lengthSq() === 0) { camera.position.copy(target).addScaledVector(baseDir, dist * 1.35); camera.lookAt(target); }
        renderer.render(scene, camera);
    };
    const ro = new ResizeObserver(resize); ro.observe(root); resize();

    // pointer sway + a one-off dolly when the section first comes into view
    const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e) => {
        const r = root.getBoundingClientRect();
        ptr.tx = (e.clientX - r.left) / r.width - 0.5; ptr.ty = (e.clientY - r.top) / r.height - 0.5;
    };
    const onLeave = () => { ptr.tx = 0; ptr.ty = 0; };
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    let intro = reduceMotion ? 1 : 0;

    // label projection
    const v = new THREE.Vector3();
    const place = (el, x, y, z, anchorBottom) => {
        v.set(x, y, z).project(camera);
        const px = (v.x * 0.5 + 0.5) * W, py = (-v.y * 0.5 + 0.5) * H;
        el.style.transform = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px) translate(-50%, ${anchorBottom ? "-100%" : "0"})`;
    };

    // the carrier's schedule: dwell on a station, then glide to the next
    const DWELL = 2.4, MOVE = 1.1, CYCLE = DWELL + MOVE;
    let active = -1;
    const setActive = (i) => {
        if (i === active) return;
        active = i;
        steps.forEach((s, k) => s.classList.toggle("is-active", k === i));
    };
    const ease = (u) => u * u * (3 - 2 * u);

    let running = false, visible = false, raf = 0, last = performance.now(), clock = 0;
    // while the stage is on screen, the page drops backdrop-filter on the fixed header and
    // contact dock (see .vc-onscreen in home-v2.css): blurring over a live WebGL canvas flickers on Intel GPUs
    const html = document.documentElement;
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; html.classList.toggle("vc-onscreen", visible); toggle(); }, { threshold: 0 });
    io.observe(root);
    const onVis = () => toggle();
    document.addEventListener("visibilitychange", onVis);
    function toggle() {
        const on = visible && !document.hidden;
        if (on && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(tick); }
        else if (!on) { running = false; cancelAnimationFrame(raf); }
    }

    function tick(now) {
        if (!running) return;
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        if (root.clientWidth === 0) { raf = requestAnimationFrame(tick); return; }   // hidden (narrow layout)
        clock += reduceMotion ? 0 : dt;
        const t = reduceMotion ? 2 : clock;
        intro = Math.min(1, intro + dt / 2.4);

        // carrier
        const leg = Math.floor(t / CYCLE) % N, u = (t % CYCLE) - DWELL;
        let cx = X(leg), cur = leg;
        if (u > 0 && leg < N - 1) { cx = X(leg) + (X(leg + 1) - X(leg)) * ease(u / MOVE); if (u / MOVE > 0.5) cur = leg + 1; }
        carrier.visible = !(leg === N - 1 && u > 0);
        carrier.position.set(cx, 0.26 + Math.sin(t * 3) * 0.015, 0);
        cw.rotation.y = t * 1.5;
        setActive(cur);

        stations.forEach((s, i) => {
            s.act += ((i === cur ? 1 : 0) - s.act) * (1 - Math.exp(-dt * 5));
            s.ring.material.opacity = 0.28 + s.act * 0.7;
            s.beam.material.uniforms.uO.value = s.act * 0.32;
            s.model.group.scale.setScalar(1 + s.act * 0.06);
            s.model.update(t, reduceMotion ? 0 : dt, s.act);
        });
        stations.motes.userData.tick(t);
        spot.position.set(cx, 1.5, 0.6);
        floorU.uTime.value = t; railU.uTime.value = t;
        floorU.uActive.value.set(X(cur), 0);

        // camera
        ptr.x += (ptr.tx - ptr.x) * (1 - Math.exp(-dt * 3));
        ptr.y += (ptr.ty - ptr.y) * (1 - Math.exp(-dt * 3));
        const k = 1 - Math.pow(1 - intro, 3);
        const d = dist * (1.35 - 0.35 * k);
        const dir = baseDir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), ptr.x * 0.22 + (1 - k) * -0.35);
        dir.y += -ptr.y * 0.08 + (1 - k) * 0.25;
        camera.position.copy(target).addScaledVector(dir.normalize(), d);
        camera.lookAt(target);
        camera.updateMatrixWorld();

        // labels follow their stations
        stations.forEach((s, i) => {
            if (!cards[i]) return;
            if (i % 2 === 0) place(cards[i], X(i), HIGH_Y, 0, true);
            else place(cards[i], X(i), 0, LOW_Z, false);
        });

        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
    }

    if (light) {
        const ink = new THREE.Color(0x1d4ed8);
        scene.traverse((o) => {
            (Array.isArray(o.material) ? o.material : o.material ? [o.material] : []).forEach((m) => {
                if (m.blending === THREE.AdditiveBlending) {
                    m.blending = THREE.NormalBlending;
                    if (m.color && !m.isShaderMaterial) m.color.lerp(ink, 0.55);
                    m.needsUpdate = true;
                } else if (m.isLineBasicMaterial || m.isLineDashedMaterial) {
                    m.color.lerp(ink, 0.6);
                }
            });
        });
    }

    root.classList.add("vc--gl");
    toggle();

    return {
        destroy() {
            running = false; cancelAnimationFrame(raf);
            io.disconnect(); ro.disconnect();
            document.removeEventListener("visibilitychange", onVis);
            root.removeEventListener("pointermove", onMove);
            root.removeEventListener("pointerleave", onLeave);
            root.classList.remove("vc--gl");
            html.classList.remove("vc-onscreen");
            cards.forEach((el) => el && (el.style.transform = ""));
            steps.forEach((s) => s.classList.remove("is-active"));
            renderer.dispose();
            canvas.remove();
        },
    };
}

/* ------------------------------------------------- single model (product pages)
   One station model on a hex pedestal, slowly turning, on a transparent canvas:
   used by the hero of preview-details-*.html. kind: wafer | litho | etch | depo | cmp | pack | device | solar */
function mSolar(M) {
    const group = new THREE.Group();
    const tex = canvasTex(512, 320, (g, w, h) => {
        g.fillStyle = "#0b1f4d"; g.fillRect(0, 0, w, h);
        const cw = w / 6, ch = h / 4;
        for (let y = 0; y < 4; y++) for (let x = 0; x < 6; x++) {
            const gr = g.createLinearGradient(x * cw, y * ch, (x + 1) * cw, (y + 1) * ch);
            gr.addColorStop(0, "#1e40af"); gr.addColorStop(1, "#0e2a6b");
            g.fillStyle = gr; g.fillRect(x * cw + 3, y * ch + 3, cw - 6, ch - 6);
            g.strokeStyle = "rgba(191,219,254,0.35)"; g.lineWidth = 1;
            for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(x * cw + (cw * k) / 4, y * ch + 3); g.lineTo(x * cw + (cw * k) / 4, (y + 1) * ch - 3); g.stroke(); }
        }
    });
    const top = new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: 0.35, metalness: 0.6, roughness: 0.25 });
    const panel = edges(new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 1.0), [M.steel, M.steel, top, M.dark, M.steel, M.steel]), M.edge);
    const tilt = new THREE.Group(); tilt.position.y = 0.95; tilt.rotation.x = -0.5; tilt.add(panel); group.add(tilt);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.7, 16), M.steel); post.position.y = 0.6; group.add(post);
    const sun = new THREE.Mesh(new THREE.SphereGeometry(0.16, 32, 16), glow(AMBER, 0.85)); sun.position.set(0.7, 2.0, -0.4); group.add(sun);
    const halo = new THREE.Mesh(new THREE.SphereGeometry(0.32, 32, 16), glow(0xfbbf24, 0.2)); halo.position.copy(sun.position); group.add(halo);
    return { group, update(t) {
        top.emissiveIntensity = 0.3 + 0.2 * (0.5 + 0.5 * Math.sin(t * 1.6));
        halo.scale.setScalar(1 + Math.sin(t * 2) * 0.12);
        tilt.position.y = 0.95 + Math.sin(t * 1.2) * 0.03;
    } };
}

export function mountModel(el, kind = "wafer", { reduceMotion = false } = {}) {
    const build = { wafer: mWafer, litho: mLitho, etch: mEtch, depo: mDepo, cmp: mCmp, pack: mPack, device: mDevice, solar: mSolar }[kind] || mWafer;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "display:block;width:100%;height:100%";
    el.appendChild(canvas);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    scene.add(new THREE.HemisphereLight(0xb7d0ff, 0x0b1430, 1.2));
    const sun = new THREE.DirectionalLight(0xffffff, 1.7); sun.position.set(4, 9, 7); scene.add(sun);
    const rim = new THREE.DirectionalLight(0x7c3aed, 0.8); rim.position.set(-6, 3, -6); scene.add(rim);
    const spot = new THREE.PointLight(0x7fb0ff, 10, 6, 1.6); spot.position.set(0, 2.6, 1.2); scene.add(spot);

    const T = { wafer: waferTex(), circuit: circuitTex(), mask: maskTex(), pad: padTex(), screen: screenTex(), dot: dotTex() };
    const M = makeMaterials();
    const stage = new THREE.Group(); scene.add(stage);
    const base = edges(new THREE.Mesh(new THREE.CylinderGeometry(0.98, 1.08, 0.22, 6), M.metal), M.edge);
    base.rotation.y = Math.PI / 6; base.position.y = 0.11; stage.add(base);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.8, 0.88, 6, 1), glow(ICE, 0.55));
    ring.rotation.set(-Math.PI / 2, 0, Math.PI / 6); ring.position.y = 0.225; stage.add(ring);
    const model = build(M, T); stage.add(model.group);

    const box = new THREE.Box3().setFromObject(stage);
    const c = box.getCenter(new THREE.Vector3()), size = box.getSize(new THREE.Vector3());
    const dist = Math.max(size.y, size.x * 0.9) * 1.55 + 0.9;
    camera.position.set(0, c.y + dist * 0.42, dist);
    camera.lookAt(c.x, c.y, c.z);

    const resize = () => {
        const w = el.clientWidth, h = el.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(el);

    let visible = true, raf = 0, last = performance.now(), t = 0;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(tick); });
    io.observe(el);
    function tick(now) {
        raf = 0;
        const dt = Math.min((now - last) / 1000, 0.05); last = now;
        if (!reduceMotion) { t += dt; stage.rotation.y = t * 0.25; }
        model.update(t, dt, 1);
        renderer.render(scene, camera);
        if (visible && !reduceMotion) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); renderer.dispose(); canvas.remove(); };
}
