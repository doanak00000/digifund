/* Dữ liệu 5 nhóm sản phẩm theo file góp ý "DIGIFUND SLIDE EDIT 0926 -V2" (trang 6–7), cùng cấu trúc với
   products-data.js để dùng chung product-detail-engine.js. Nạp SAU products-data.js: các mục đã có được
   lấy lại nguyên vẹn (ảnh, thông số, SKU, song ngữ) rồi xếp lại section/code; mục mới chưa có dữ liệu chỉ có
   tên + bảng "Danh mục"; mỗi dòng sản phẩm con thành một mục "Báo giá theo yêu cầu" với ảnh chờ (logo).
   Các trang nhóm san-pham-*.html gán window.PD_DATA = window.PD_DATA_V2 trước khi nạp engine. */
(function () {
    var OLD = window.PD_DATA || {};
    var clone = function (o) { return JSON.parse(JSON.stringify(o || {})); };

    // mục cũ: nhóm g, item i; có thể chỉ giữ một số variant và đổi tên/tiêu đề
    function from(section, code, g, i, opt) {
        var it = clone(OLD[g] && OLD[g].items[i]);
        opt = opt || {};
        if (opt.keep) it.variants = (it.variants || []).filter(function (_, k) { return opt.keep.indexOf(k) >= 0; });
        if (opt.keep && it.filters) delete it.filters;
        it.section = section; it.code = code;
        ['name', 'subtitle', 'apps'].forEach(function (k) { if (opt[k]) it[k] = opt[k]; });
        if (opt.list) it.summary = listSummary(opt.list, it.summary);
        return it;
    }
    // bảng "Danh mục": các dòng sản phẩm con; giữ thêm các dòng thông số cũ nếu có
    function listSummary(list, old) {
        var rows = [{ k: { vi: 'Dòng sản phẩm', en: 'Product lines' }, v: list.join(' ; ') }];
        if (old && old.rows) rows = rows.concat(old.rows);
        return { title: (old && old.title) || { vi: 'Danh mục sản phẩm', en: 'Product range' }, rows: rows };
    }
    // mục mới, chưa có sản phẩm cụ thể
    var PH = './assets/images/logo-2.png';   // ảnh chờ: chưa có ảnh sản phẩm
    function fresh(section, code, name, sub, list, apps) {
        var lines = list && list.length ? list : [name.vi || name];
        var it = { section: section, code: code, name: name, variants: lines.map(function (l) {
            return { name: S(l), img: PH, desc: S('Liên hệ để nhận thông số và báo giá.', 'Contact us for specifications and pricing.'),
                     specs: [{ k: S('Tình trạng', 'Status'), v: S('Báo giá theo yêu cầu', 'Quote on request') }] };
        }) };
        if (sub) it.subtitle = sub;
        if (apps) it.apps = apps;
        if (list && list.length) it.summary = listSummary(list);
        return it;
    }
    var S = function (vi, en) { return { vi: vi, en: en || vi }; };
    // ảnh sản phẩm thật (tools/brand-image/brand.py) thay ảnh chờ cho cả mục lẫn các dòng con
    function img(it, src) {
        it.img = src;
        it.variants.forEach(function (v) { if (v.img === PH) v.img = src; });
        return it;
    }

    // Bộ vẽ SVG cho sơ đồ quy trình (renderFlow trong engine): wafer nhìn nghiêng, viewBox 120×84
    var C = { car: ['#d3dbe7', '#94a3b8'], dev: ['#3b6fd8', '#1e3a8a'], glue: ['#f6b54a', '#d68910'],
              tape: ['#9fd6f7', '#4aa3df'], ring: ['#4b5563', '#1f2937'], wheel: ['#cbd5e1', '#64748b'] };
    function disk(cx, cy, rx, ry, h, c) {
        return '<path d="M' + (cx - rx) + ' ' + cy + 'v' + h + 'a' + rx + ' ' + ry + ' 0 0 0 ' + 2 * rx + ' 0v' + (-h) + 'z" fill="' + c[1] + '"/>' +
            '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + c[0] + '"/>';
    }
    // các lớp xếp chồng từ dưới lên: [[màu, dày], ...], đáy tại cy
    function stack(cx, cy, rx, ry, layers) {
        return layers.map(function (l) { cy -= l[1]; return disk(cx, cy, rx, ry, l[1], l[0]); }).join('');
    }
    function heat(x, y) {
        return [0, 10, 20].map(function (d) {
            return '<path d="M' + (x + d) + ' ' + y + 'q4 -4 0 -8t0 -8" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round"/>';
        }).join('');
    }
    function arrow(x1, y1, x2, y2) {
        var a = Math.atan2(y2 - y1, x2 - x1), p = function (d) { return (x2 - 6 * Math.cos(a + d)) + ' ' + (y2 - 6 * Math.sin(a + d)); };
        return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + 'M' + p(.5) + 'L' + x2 + ' ' + y2 + 'L' + p(-.5) + '" fill="none" stroke="#475569" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>';
    }
    function nozzle(x, y, spray) {
        return '<rect x="' + (x - 4) + '" y="' + (y - 16) + '" width="8" height="12" rx="2" fill="#64748b"/><path d="M' + (x - 4) + ' ' + (y - 4) + 'h8l-2 4h-4z" fill="#475569"/>' +
            (spray ? '<path d="M' + x + ' ' + y + 'L' + (x - 16) + ' ' + (y + 26) + 'H' + (x + 16) + 'z" fill="#60a5fa" opacity=".35"/>' : '<circle cx="' + x + '" cy="' + (y + 8) + '" r="3" fill="' + C.glue[0] + '"/>');
    }
    function grid(cx, cy, rx, ry, n) {   // đường cắt die trên mặt wafer
        var d = '', k, o, h;
        for (k = 1; k < n; k++) {
            o = -rx + 2 * rx * k / n; h = ry * Math.sqrt(1 - o * o / (rx * rx)); d += 'M' + (cx + o) + ' ' + (cy - h) + 'V' + (cy + h);
            o = -ry + 2 * ry * k / n; h = rx * Math.sqrt(1 - o * o / (ry * ry)); d += 'M' + (cx - h) + ' ' + (cy + o) + 'H' + (cx + h);
        }
        return '<path d="' + d + '" stroke="#bfdbfe" stroke-width=".8" opacity=".8"/>';
    }
    function svg(body, label) { return '<svg viewBox="0 0 120 84" role="img" aria-label="' + label + '">' + body + '</svg>'; }
    function F(vi, en, body) { return { t: S(vi, en), svg: svg(body, en) }; }

    var FLOW_BOND = [
        F('Phủ quay keo bonding', 'Spin coat bonding material', stack(60, 66, 44, 12, [[C.dev, 6], [C.glue, 3]]) + nozzle(60, 30) +
            '<path d="M24 34a36 9 0 0 1 20 -7" fill="none" stroke="#475569" stroke-width="1.6"/><path d="M42 23l4 4-6 2" fill="none" stroke="#475569" stroke-width="1.6"/>'),
        F('Sấy keo', 'Bake bonding material', stack(60, 44, 44, 12, [[C.dev, 6], [C.glue, 3]]) + heat(50, 80)),
        F('Lật wafer linh kiện, căn tâm trên carrier', 'Flip device wafer and center over carrier',
            stack(60, 72, 44, 12, [[C.car, 7]]) + stack(60, 38, 44, 12, [[C.glue, 3], [C.dev, 6]]) + arrow(108, 26, 108, 52)),
        F('Bond wafer linh kiện lên carrier', 'Bond device wafer to carrier', stack(60, 64, 44, 12, [[C.car, 7], [C.glue, 3], [C.dev, 6]]))
    ];
    var FLOW_DEBOND = [
        F('Gia công mặt sau wafer linh kiện', 'Backside processing of device wafer',
            stack(60, 70, 44, 12, [[C.car, 7], [C.glue, 3], [C.dev, 3]]) + stack(60, 30, 22, 6, [[C.wheel, 8]]) + arrow(88, 22, 88, 40)),
        { alt: [
            F('Thermal slide', 'Thermal slide', stack(50, 68, 38, 10, [[C.car, 6]]) + stack(72, 48, 38, 10, [[C.glue, 2], [C.dev, 4]]) +
                arrow(30, 22, 12, 22) + arrow(90, 22, 108, 22) + heat(50, 82).replace(/stroke-width="2"/g, 'stroke-width="1.6"')),
            F('Mechanical', 'Mechanical', stack(60, 70, 44, 12, [[C.car, 7]]) +
                '<g transform="rotate(-12 16 48)">' + stack(60, 54, 44, 12, [[C.glue, 2], [C.dev, 4]]) + '</g>' + arrow(96, 34, 102, 14)),
            F('Laser', 'Laser', stack(60, 70, 44, 12, [[C.dev, 4], [C.glue, 2], [C.car, 7]]) +
                [44, 60, 76].map(function (x) { return '<path d="M' + x + ' 6V48" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 3"/>'; }).join('') +
                arrow(30, 12, 94, 12))
        ] },
        F('Làm sạch cặn keo', 'Residue clean', stack(60, 70, 44, 12, [[C.dev, 4]]) +
            '<ellipse cx="44" cy="62" rx="7" ry="2.5" fill="' + C.glue[0] + '"/><ellipse cx="74" cy="60" rx="5" ry="2" fill="' + C.glue[0] + '"/>' + nozzle(60, 30, true))
    ];
    var FLOW_DICING = [
        F('Dán băng BG', 'BG tape laminating', stack(60, 66, 44, 12, [[C.dev, 6], [C.tape, 3]]) + arrow(60, 12, 60, 38)),
        F('Mài mặt sau', 'Back grinding', stack(60, 70, 44, 12, [[C.tape, 3], [C.dev, 4]]) + stack(60, 34, 22, 6, [[C.wheel, 8]])),
        F('Bóc băng BG', 'BG tape removing', stack(60, 70, 44, 12, [[C.dev, 4]]) +
            '<g transform="rotate(-14 16 60)">' + stack(60, 58, 44, 12, [[C.tape, 3]]) + '</g>' + arrow(98, 34, 104, 12)),
        F('Gắn băng dicing', 'Dicing tape mounting', stack(60, 70, 52, 14, [[C.ring, 3]]) + stack(60, 67, 46, 12, [[C.tape, 1]]) +
            stack(60, 66, 34, 9, [[C.dev, 3]]) + arrow(60, 6, 60, 34)),
        F('Cắt die', 'Dicing', stack(60, 70, 52, 14, [[C.ring, 3]]) + stack(60, 67, 46, 12, [[C.tape, 1]]) + stack(60, 66, 34, 9, [[C.dev, 3]]) +
            grid(60, 63, 34, 9, 6) + '<ellipse cx="78" cy="44" rx="4" ry="17" fill="' + C.wheel[0] + '" stroke="#b45309" stroke-width="2"/><ellipse cx="78" cy="44" rx="1.4" ry="5" fill="#64748b"/>')
    ];

    window.PD_DATA_V2 = {
        '1': {
            accent: '#1e3a8a', badge: S('Nhóm 1', 'Group 1'),
            title: S('Silicon Wafer & Đế Substrate Bán Dẫn', 'Silicon Wafers & Substrates'),
            seo: { title: S('Silicon Wafer & Substrate: Si, SiC, SOI, Sapphire | Digifund', 'Silicon Wafers & Substrates: Si, SiC, SOI | Digifund'), desc: S('Mua silicon wafer, SiC, SOI, sapphire, GaAs, GaN, InP 2-12 inch tại Việt Nam. Prime/test/dummy grade, đặt theo thông số, báo giá theo yêu cầu.', 'Buy silicon, SiC, SOI, sapphire, GaAs, GaN and InP wafers 2-12 inch in Vietnam. Prime, test and dummy grades to your spec, quoted on request.') },
            items: [
                from(S('1. Silicon wafer'), 'A', '1', 0),
                from(S('1. Silicon wafer'), 'B', '1', 1),
                from(S('1. Silicon wafer'), 'C', '1', 2),
                fresh(S('1. Silicon wafer'), 'D', S('Silicon nitride (SiN)'), S('Wafer phủ màng SiN – LPCVD / PECVD', 'SiN-coated wafer – LPCVD / PECVD'),
                    ['SiN on Si 100 nm', 'SiN on Si 300 nm', 'Low-stress SiN', '4" / 6" / 8"'], S('MEMS, quang tử, lớp cách điện & passivation', 'MEMS, photonics, dielectric & passivation layers')),
                from(S('2. Sapphire, AlN, GaAs, GaN, InP & đế khác', '2. Sapphire, AlN, GaAs, GaN, InP & other substrates'), 'A', '1', 3),
                from(S('2. Sapphire, AlN, GaAs, GaN, InP & đế khác', '2. Sapphire, AlN, GaAs, GaN, InP & other substrates'), 'B', '1', 4),
                from(S('2. Sapphire, AlN, GaAs, GaN, InP & đế khác', '2. Sapphire, AlN, GaAs, GaN, InP & other substrates'), 'C', '1', 5),
                fresh(S('2. Sapphire, AlN, GaAs, GaN, InP & đế khác', '2. Sapphire, AlN, GaAs, GaN, InP & other substrates'), 'D', S('GaN (Gallium Nitride)'),
                    S('GaN-on-Si / GaN-on-Sapphire / GaN tự đứng', 'GaN-on-Si / GaN-on-Sapphire / free-standing GaN'),
                    ['GaN-on-Si', 'GaN-on-Sapphire', 'GaN-on-SiC', 'Free-standing GaN'], S('Linh kiện công suất, RF/5G, LED & laser', 'Power devices, RF/5G, LED & lasers')),
                from(S('2. Sapphire, AlN, GaAs, GaN, InP & đế khác', '2. Sapphire, AlN, GaAs, GaN, InP & other substrates'), 'E', '1', 6),
                from(S('2. Sapphire, AlN, GaAs, GaN, InP & đế khác', '2. Sapphire, AlN, GaAs, GaN, InP & other substrates'), 'F', '1', 7),
                fresh(S('3. Wafer mang (Carrier wafers)', '3. Carrier wafers'), 'A', S('Silicon carrier wafer'), S('Wafer mang cho mỏng hoá, bonding tạm thời', 'Carrier for thinning and temporary bonding'), ['4" / 6" / 8" / 12"', 'SSP / DSP']),
                fresh(S('3. Wafer mang (Carrier wafers)', '3. Carrier wafers'), 'B', S('Glass carrier wafer'), S('Borosilicate / Quartz cho debond bằng laser, UV', 'Borosilicate / quartz for laser and UV debond'), ['Borosilicate', 'Fused silica / Quartz'])
            ]
        },
        '2': {
            accent: '#1e3a8a', badge: S('Nhóm 2', 'Group 2'),
            title: S('Hoá Chất & Vật Liệu Chế Tạo Bán Dẫn', 'Semiconductor Fabrication Materials'),
            seo: { title: S('Hoá Chất Bán Dẫn: Photoresist, Sputtering Target | Digifund', 'Photoresist, Sputtering Targets & CMP Slurry | Digifund'), desc: S('Photoresist, developer, HMDS, CMP slurry & pad, bia phún xạ (sputtering target), vật liệu bốc bay, hoá chất ướt cho fab và lab tại Việt Nam.', 'Photoresists, developers, HMDS, CMP slurries & pads, sputtering targets, evaporation materials and wet-process chemicals for fabs and labs in Vietnam.') },
            items: [
                from(S('1. Vật liệu quang khắc (Lithography)', '1. Lithography materials'), 'A', '4', 1, { keep: [0], name: S('Photoresists'), subtitle: S('Positive PR (AZ1512, 1518, 1502), Negative PR (N1400), SU-8 PR, Thick PR'),
                    list: ['AZ1512', 'AZ1518', 'AZ1502', 'N1400', 'SU-8', 'Thick PR'] }),
                from(S('1. Vật liệu quang khắc (Lithography)', '1. Lithography materials'), 'B', '4', 1, { keep: [1], name: S('Developer'), subtitle: S('AZ300-MIF, TMAH, MF-319'), list: ['AZ300-MIF', 'TMAH 2.38%', 'MF-319'] }),
                fresh(S('1. Vật liệu quang khắc (Lithography)', '1. Lithography materials'), 'C', S('Adhesion promoters'), S('Tăng bám dính cho photoresist', 'Photoresist adhesion promoter'), ['HMDS']),
                fresh(S('1. Vật liệu quang khắc (Lithography)', '1. Lithography materials'), 'D', S('Strippers'), S('Tẩy photoresist sau quang khắc', 'Photoresist removal'), ['SVC series', 'PGMEA']),
                fresh(S('1. Vật liệu quang khắc (Lithography)', '1. Lithography materials'), 'E', S('Anti-reflective coatings'), S('Lớp chống phản xạ cho quang khắc', 'Anti-reflective layers for lithography'), ['DUV ARC', 'BARC']),
                from(S('2. Vật liệu đánh bóng CMP', '2. CMP materials'), 'A', '4', 1, { keep: [3], name: S('CMP slurries'), subtitle: S('Oxide, Copper, Tungsten CMP slurries'),
                    apps: S('Ăn mòn, đánh bóng CMP, làm sạch wafer trong sản xuất chip', 'Etching, CMP polishing, wafer cleaning in chip fabrication'), list: ['Oxide', 'Copper', 'Tungsten'] }),
                fresh(S('2. Vật liệu đánh bóng CMP', '2. CMP materials'), 'B', S('CMP pads'), S('Pad đánh bóng cứng / mềm', 'Hard / soft polishing pads'), ['Hard polishing pad', 'Soft polishing pad']),
                fresh(S('2. Vật liệu đánh bóng CMP', '2. CMP materials'), 'C', S('CMP accessories'), S('Phụ kiện cho hệ CMP', 'CMP accessories'), ['Conditioner disc', 'CMP filters']),
                from(S('3. Vật liệu màng mỏng (Thin film)', '3. Thin film materials'), 'A', '2', 0),
                fresh(S('3. Vật liệu màng mỏng (Thin film)', '3. Thin film materials'), 'B', S('Evaporation materials'), S('Vật liệu bốc bay nhiệt / e-beam', 'Thermal / e-beam evaporation'), ['Metal pellets', 'Metal wire']),
                from(S('4. Hoá chất quy trình ướt (Wet process)', '4. Wet process materials'), 'A', '4', 1, { keep: [4], name: S('Cleaning chemicals'), subtitle: S('Dung môi cấp bán dẫn', 'Semiconductor-grade solvents'), list: ['IPA', 'Acetone', 'NMP'] }),
                from(S('4. Hoá chất quy trình ướt (Wet process)', '4. Wet process materials'), 'B', '4', 1, { keep: [2], name: S('Wet etchants'), subtitle: S('Hoá chất ăn mòn ướt', 'Wet etchants'), list: ['HF', 'BOE', 'KOH', 'H₃PO₄'] })
            ]
        },
        '3': {
            accent: '#1e3a8a', badge: S('Nhóm 3', 'Group 3'),
            title: S('Vật Liệu Đóng Gói Bán Dẫn Tiên Tiến', 'Advanced Packaging Materials'),
            seo: { title: S('Vật Liệu Đóng Gói Bán Dẫn: Dicing Tape, Underfill | Digifund', 'Semiconductor Packaging: Dicing Tape, Underfill | Digifund'), desc: S('Dicing tape, dicing blade, temporary bonding, carrier wafer, underfill, die attach film, keo dẫn điện, mold compound cho đóng gói chip tại Việt Nam.', 'Dicing tape & blades, temporary bonding, carrier wafers, underfill, die attach film, conductive adhesives, mold compound for chip packaging in Vietnam.') },
            items: [
                Object.assign(img(fresh(S('1. Bonding tạm thời (Temporary bonding)', '1. Temporary bonding solutions'), 'A', S('Temporary bonding adhesive'), S('Keo dán tạm wafer lên carrier', 'Temporary wafer-to-carrier adhesive'), ['Highly adhesive bonding glue']),
                    './assets/images/pack-bonding-adhesive.jpg'), {
                    summary: { title: S('Danh mục sản phẩm', 'Product range'), rows: [
                        { k: S('Sản phẩm', 'Product'), v: 'Highly adhesive bonding glues' },
                        { k: S('Thành phần', 'Composition'), v: S('Keo polymer tiên tiến (keo nhiệt)', 'Advanced polymer adhesive (thermal)') },
                        { k: S('Độ bám dính', 'Adhesion strength'), v: S('Hiệu năng bonding cao', 'High bonding performance') },
                        { k: S('Nhiệt độ quy trình', 'Process temperature'), v: S('Tới 250 °C', 'Up to 250 °C') },
                        { k: S('Kháng hoá chất', 'Chemical resistance'), v: S('Rất tốt với các hoá chất quy trình phổ biến', 'Excellent resistance to common process chemicals') },
                        { k: S('Ứng dụng', 'Application'), v: S('Bonding wafer, bonding đế và đóng gói bán dẫn', 'Wafer bonding, substrate bonding and semiconductor packaging') }
                    ] },
                    flow: FLOW_BOND
                }),
                Object.assign(img(fresh(S('1. Bonding tạm thời (Temporary bonding)', '1. Temporary bonding solutions'), 'B', S('Debonding chemicals'), S('Hoá chất tách và làm sạch sau debond', 'Debond and residue removal'),
                    ['Debond solvent', 'Residue cleaner', 'Thermal-slide', 'Laser debond', 'UV debond']), './assets/images/pack-debond-chemicals.jpg'), { flow: FLOW_DEBOND }),
                fresh(S('2. Giải pháp carrier', '2. Carrier solutions'), 'A', S('Silicon / Glass carrier wafer'), null, ['Si carrier', 'Glass carrier']),
                fresh(S('2. Giải pháp carrier', '2. Carrier solutions'), 'B', S('Temporary carrier wafer'), null, ['4" – 12"']),
                Object.assign(img(fresh(S('3. Vật tư cắt wafer (Dicing)', '3. Dicing consumables'), 'A', S('UV dicing / back grinding tape'), null, ['UV dicing tape', 'Back grinding tape']),
                    './assets/images/pack-dicing-tape.jpg'), { flow: FLOW_DICING }),
                img(fresh(S('3. Vật tư cắt wafer (Dicing)', '3. Dicing consumables'), 'B', S('Dicing blade'), null, ['Hub blade', 'Hubless blade']), './assets/images/pack-dicing-blade.jpg'),
                fresh(S('4. Mạ & kim loại hoá (Plating)', '4. Plating & metallization'), 'A', S('Cu, Ni, Au plating chemistry'), S('Hoá chất mạ cho bump, RDL, TSV', 'Plating for bumps, RDL, TSV'), ['Cu', 'Ni', 'Au']),
                fresh(S('5. Vật liệu lắp ráp (Assembly)', '5. Assembly materials'), 'A', S('Underfill'), null, ['Capillary underfill']),
                fresh(S('5. Vật liệu lắp ráp (Assembly)', '5. Assembly materials'), 'B', S('Silver epoxy'), null, ['Silver epoxy']),
                fresh(S('5. Vật liệu lắp ráp (Assembly)', '5. Assembly materials'), 'C', S('Die attach film'), null, ['DAF']),
                fresh(S('5. Vật liệu lắp ráp (Assembly)', '5. Assembly materials'), 'D', S('Conductive adhesive'), null, ['ICA', 'ACA / ACF']),
                fresh(S('6. Vật liệu bao gói (Encapsulation)', '6. Encapsulation materials'), 'A', S('Mold compound'), null, ['Epoxy mold compound'])
            ]
        },
        '4': {
            accent: '#1e3a8a', badge: S('Nhóm 4', 'Group 4'),
            title: S('Thiết Bị Phòng Sạch & Công Nghệ Cao', 'Cleanroom & Hi-Tech Equipment'),
            seo: { title: S('Thiết Bị Phòng Sạch & Bán Dẫn: Spin Coater, CVD | Digifund', 'Cleanroom & Semiconductor Lab Equipment Vietnam | Digifund'), desc: S('Thiết bị phòng sạch, lab bán dẫn: tủ hút, wet bench, đồ phòng sạch, spin coater, mask aligner, CVD, RIE, phún xạ, đo lường. Tư vấn tại Việt Nam.', 'Cleanroom & semiconductor lab equipment in Vietnam: fume hoods, wet benches, garments, spin coaters, mask aligners, CVD, RIE, sputtering, metrology.') },
            items: [
                fresh(S('1. Thiết bị phòng sạch (Cleanroom)', '1. Cleanroom equipment'), 'A', S('Fume hoods'), S('Tủ hút khí độc', 'Fume hoods'), ['Tủ hút hoá chất', 'Tủ hút axit']),
                fresh(S('1. Thiết bị phòng sạch (Cleanroom)', '1. Cleanroom equipment'), 'B', S('Wet benches'), S('Bàn quy trình ướt', 'Wet process benches'), ['Wet bench axit', 'Wet bench dung môi']),
                from(S('1. Thiết bị phòng sạch (Cleanroom)', '1. Cleanroom equipment'), 'C', '3', 1, { name: S('Glassware') }),
                from(S('1. Thiết bị phòng sạch (Cleanroom)', '1. Cleanroom equipment'), 'D', '3', 2, { name: S('Gloves + Bunny suits') }),
                fresh(S('2. Thiết bị quy trình bán dẫn', '2. Semiconductor process equipment'), 'A', S('Spin coater')),
                fresh(S('2. Thiết bị quy trình bán dẫn', '2. Semiconductor process equipment'), 'B', S('Mask aligner')),
                fresh(S('2. Thiết bị quy trình bán dẫn', '2. Semiconductor process equipment'), 'C', S('Direct laser writer')),
                from(S('2. Thiết bị quy trình bán dẫn', '2. Semiconductor process equipment'), 'D', '3', 0, { keep: [2], name: S('CVD systems') }),
                fresh(S('2. Thiết bị quy trình bán dẫn', '2. Semiconductor process equipment'), 'E', S('RIE systems')),
                fresh(S('2. Thiết bị quy trình bán dẫn', '2. Semiconductor process equipment'), 'F', S('Sputtering systems')),
                fresh(S('3. Đo lường & phân tích', '3. Metrology & characterization'), 'A', S('Optical microscope')),
                fresh(S('3. Đo lường & phân tích', '3. Metrology & characterization'), 'B', S('Profilometer')),
                fresh(S('4. Thiết bị phòng thí nghiệm', '4. Laboratory equipment'), 'A', S('Vacuum systems')),
                fresh(S('4. Thiết bị phòng thí nghiệm', '4. Laboratory equipment'), 'B', S('Gas delivery systems')),
                fresh(S('4. Thiết bị phòng thí nghiệm', '4. Laboratory equipment'), 'C', S('Process monitoring equipment')),
                from(S('4. Thiết bị phòng thí nghiệm', '4. Laboratory equipment'), 'D', '3', 0, { keep: [0, 1, 3], name: S('Thiết bị gia nhiệt & tổng hợp', 'Heating & synthesis equipment') })
            ]
        },
        '5': {
            accent: '#1e3a8a', badge: S('Nhóm 5', 'Group 5'),
            title: S('Vật Liệu & Thiết Bị Năng Lượng Tái Tạo', 'Renewable Energy Materials & Equipment'),
            seo: { title: S('Vật Liệu Năng Lượng Tái Tạo & Thiết Bị Pin | Digifund', 'Battery & Fuel Cell Research Materials | Digifund'), desc: S('Vật liệu nano, thiết bị nghiên cứu pin, trạm thử pin nhiên liệu, bình phản ứng quang-nhiệt-điện xúc tác cho phòng thí nghiệm năng lượng tại Việt Nam.', 'Battery research equipment, fuel cell test stations, photo-electrocatalytic reactors and nanomaterials (graphene, CNT) for energy labs in Vietnam.') },
            items: [
                from(S('1. Năng lượng mặt trời & pin nhiên liệu', '1. Solar energy & fuel cell'), 'A', '2', 1, { name: S('Photo-thermal-electrocatalytic reactors') }),
                fresh(S('1. Năng lượng mặt trời & pin nhiên liệu', '1. Solar energy & fuel cell'), 'B', S('Fuel cell test station')),
                fresh(S('2. Lưu trữ năng lượng', '2. Energy storage'), 'A', S('Battery research equipment')),
                fresh(S('2. Lưu trữ năng lượng', '2. Energy storage'), 'B', S('Advanced materials')),
                from(S('3. Vật liệu nano', '3. Nanomaterials'), 'A', '4', 0, { name: S('Nanomaterials') })
            ]
        }
    };

    // ảnh sản phẩm (Muse, cùng kiểu nền lab + logo) cho các mục còn ảnh chờ; khoá: nhóm → số mục + code
    var PHOTOS = {
        '1': { '1D': 'sin-wafer', '2D': 'gan-wafer', '3A': 'si-carrier', '3B': 'glass-carrier' },
        '2': { '1C': 'hmds', '1D': 'stripper', '1E': 'arc', '2B': 'cmp-pad', '2C': 'cmp-acc', '3B': 'evap' },
        '3': { '2A': 'carrier-si-glass', '2B': 'si-carrier', '4A': 'plating', '5A': 'underfill', '5B': 'silver-epoxy',
               '5C': 'daf', '5D': 'conductive-adhesive', '6A': 'mold' },
        '4': { '1A': 'fume-hood', '1B': 'wet-bench', '2A': 'spin-coater', '2B': 'mask-aligner', '2C': 'laser-writer',
               '2E': 'rie', '2F': 'sputter', '3A': 'microscope', '3B': 'profilometer', '4A': 'vacuum', '4B': 'gas',
               '4C': 'monitoring' },
        '5': { '1B': 'fuel-cell', '2A': 'battery', '2B': 'adv-materials' }
    };
    Object.keys(PHOTOS).forEach(function (g) {
        window.PD_DATA_V2[g].items.forEach(function (it) {
            var f = PHOTOS[g][parseInt(it.section.vi, 10) + it.code];
            if (f && !it.img) img(it, './assets/images/prod-' + f + '.jpg');
        });
    });

    // thông số tiêu biểu cho các mục mới (fresh) chưa có thông số; khoá như PHOTOS; dòng: [k vi, k en, v vi, v en?]
    var SPECS = {
        '1': {
            '1D': [['Phương pháp phủ', 'Deposition', 'LPCVD / PECVD'], ['Độ dày màng', 'Film thickness', '50 nm – 1 µm'],
                   ['Ứng suất', 'Stress', 'Stoichiometric (tensile) / Low-stress (< 250 MPa)'], ['Chiết suất @633 nm', 'Refractive index @633 nm', '≈ 2.0 – 2.3'],
                   ['Đế', 'Substrate', 'Si prime / test, 4" – 8"'], ['Độ đồng đều', 'Uniformity', '≤ ±5 %']],
            '2D': [['Đường kính', 'Diameter', '2" / 4" / 6" (GaN-on-Si tới 8")', '2" / 4" / 6" (GaN-on-Si up to 8")'], ['Định hướng', 'Orientation', 'c-plane (0001)'],
                   ['Cấu trúc', 'Structure', 'Epi GaN, HEMT AlGaN/GaN, GaN tự đứng', 'Epi GaN, AlGaN/GaN HEMT, free-standing GaN'],
                   ['Pha tạp', 'Doping', 'Undoped / n-type (Si) / bán cách điện (Fe, C)', 'Undoped / n-type (Si) / semi-insulating (Fe, C)'],
                   ['Độ dày lớp GaN', 'GaN thickness', '1 – 5 µm (epi); 350 – 450 µm (tự đứng)', '1 – 5 µm (epi); 350 – 450 µm (free-standing)']],
            '3A': [['Đường kính', 'Diameter', '100 – 300 mm'], ['Độ dày', 'Thickness', '525 – 775 µm (SEMI) hoặc theo yêu cầu', '525 – 775 µm (SEMI) or custom'],
                   ['TTV', 'TTV', '≤ 2 – 5 µm'], ['Bow / Warp', 'Bow / Warp', '≤ 30 µm'], ['Bề mặt', 'Surface', 'SSP / DSP'], ['Notch / Flat', 'Notch / Flat', 'Theo SEMI', 'Per SEMI']],
            '3B': [['Vật liệu', 'Material', 'Borosilicate / Fused silica (quartz)'], ['Đường kính', 'Diameter', '100 – 300 mm'], ['Độ dày', 'Thickness', '0.5 – 1.1 mm'],
                   ['TTV', 'TTV', '≤ 2 – 5 µm'], ['CTE', 'CTE', '≈ 3.3 ppm/K (borosilicate); ≈ 0.5 ppm/K (quartz)'],
                   ['Truyền qua', 'Transmission', 'Cao ở dải UV / laser, phù hợp debond laser & UV', 'High UV / laser transmission for laser & UV debond']]
        },
        '2': {
            '1C': [['Hoá chất', 'Chemical', 'HMDS (Hexamethyldisilazane)'], ['Độ tinh khiết', 'Purity', '≥ 99 %, cấp điện tử', '≥ 99 %, electronic grade'],
                   ['Phương pháp', 'Method', 'Prime pha hơi / phủ quay', 'Vapor prime / spin coat'], ['Nhiệt độ prime', 'Prime temperature', '100 – 150 °C'],
                   ['Bề mặt áp dụng', 'Surfaces', 'Si, SiO₂, SiN, kim loại', 'Si, SiO₂, SiN, metals']],
            '1D': [['Loại', 'Type', 'Dung môi (NMP-free, PGMEA) / kiềm', 'Solvent-based (NMP-free, PGMEA) / alkaline'], ['Nhiệt độ làm việc', 'Operating temperature', 'RT – 80 °C'],
                   ['Tương thích', 'Compatibility', 'PR dương / âm; an toàn với Al, Cu', 'Positive / negative PR; Al- and Cu-safe'],
                   ['Phương pháp', 'Method', 'Ngâm, phun, single-wafer', 'Immersion, spray, single-wafer']],
            '1E': [['Loại', 'Type', 'BARC hữu cơ / TARC', 'Organic BARC / TARC'], ['Bước sóng', 'Wavelength', 'i-line 365 nm, KrF 248 nm, ArF 193 nm'],
                   ['Độ dày', 'Thickness', '≈ 30 – 100 nm'], ['Phủ & sấy', 'Coat & bake', 'Phủ quay, sấy ≈ 175 – 215 °C', 'Spin coat, bake ≈ 175 – 215 °C']],
            '2B': [['Loại', 'Type', 'Pad cứng polyurethane / pad mềm poromeric', 'Hard polyurethane / soft poromeric pads'], ['Cấu trúc', 'Construction', 'Đơn lớp / chồng sub-pad', 'Single layer / stacked with sub-pad'],
                   ['Rãnh', 'Grooving', 'XY, K-groove, đồng tâm', 'XY, K-groove, concentric'], ['Kích thước', 'Size', 'Theo máy CMP 200 / 300 mm', 'To fit 200 / 300 mm CMP tools'],
                   ['Ứng dụng', 'Application', 'Oxide, Cu, W, Si']],
            '2C': [['Pad conditioner', 'Pad conditioner', 'Đĩa kim cương (mạ / CVD)', 'Diamond disc (plated / CVD)'], ['Lọc slurry', 'Slurry filters', 'Lọc sâu 0.5 – 10 µm', 'Depth filters 0.5 – 10 µm'],
                   ['Phụ kiện khác', 'Others', 'Retaining ring, chổi PVA làm sạch sau CMP', 'Retaining rings, post-CMP PVA brushes']],
            '3B': [['Kim loại', 'Metals', 'Au, Ag, Al, Cu, Ti, Cr, Ni, Pt, Ge, …'], ['Độ tinh khiết', 'Purity', '99.99 % – 99.999 %'],
                   ['Dạng', 'Form', 'Viên, dây, hạt, khối', 'Pellets, wire, shot, slugs'], ['Kích thước viên', 'Pellet size', 'Φ3 × 3 mm, Φ6 × 6 mm hoặc theo yêu cầu', 'Φ3 × 3 mm, Φ6 × 6 mm or custom'],
                   ['Tương thích', 'Compatibility', 'Bốc bay nhiệt / e-beam; chén W, Mo, graphite, BN', 'Thermal / e-beam; W, Mo, graphite, BN crucibles']]
        },
        '3': {
            '1B': [['Phương pháp debond', 'Debond method', 'Thermal slide / Mechanical / Laser / UV'], ['Hoá chất', 'Chemicals', 'Dung môi tách keo, chất làm sạch cặn', 'Debond solvent, residue cleaner'],
                   ['Nhiệt độ làm sạch', 'Cleaning temperature', 'RT – 80 °C'], ['Tương thích', 'Compatibility', 'Keo bonding tạm thời nhiệt / UV', 'Thermal / UV temporary bonding adhesives'],
                   ['Ứng dụng', 'Application', 'Mỏng hoá wafer, TSV, fan-out', 'Wafer thinning, TSV, fan-out']],
            '2A': [['Vật liệu', 'Material', 'Si / Borosilicate / Quartz'], ['Đường kính', 'Diameter', '4" – 12"'], ['Độ dày', 'Thickness', '500 – 1100 µm'],
                   ['TTV', 'TTV', '≤ 2 – 5 µm'], ['CTE', 'CTE', 'Chọn khớp với wafer linh kiện', 'Matched to device wafer']],
            '2B': [['Vật liệu', 'Material', 'Si / Glass'], ['Đường kính', 'Diameter', '4" – 12"'], ['TTV', 'TTV', '≤ 5 µm'],
                   ['Debond', 'Debond', 'Thermal / Mechanical / Laser / UV'], ['Tái sử dụng', 'Reuse', 'Làm sạch & tái sử dụng nhiều lần', 'Cleanable, multi-reuse']],
            '3A': [['Loại', 'Type', 'UV-curable / non-UV'], ['Độ dày', 'Thickness', '≈ 80 – 200 µm'],
                   ['Độ bám dính', 'Adhesion', 'Cao khi cắt, giảm mạnh sau chiếu UV', 'High during dicing, drops sharply after UV'], ['Liều UV', 'UV dose', '≈ 200 – 500 mJ/cm²'],
                   ['Khổ', 'Size', 'Theo frame 6" / 8" / 12"', 'For 6" / 8" / 12" frames']],
            '3B': [['Loại', 'Type', 'Hub / Hubless'], ['Liên kết', 'Bond', 'Nickel mạ điện / resin / kim loại thiêu kết', 'Electroformed nickel / resin / sintered metal'],
                   ['Cỡ hạt kim cương', 'Diamond grit', '#600 – #5000'], ['Độ dày lưỡi', 'Blade thickness', '≈ 15 – 300 µm'],
                   ['Vật liệu cắt', 'Cuts', 'Si, glass, sapphire, ceramic, package']],
            '4A': [['Kim loại', 'Metals', 'Cu, Ni, Au'], ['Phương pháp', 'Process', 'Mạ điện; Au/Ni mạ hoá học (ENIG)', 'Electroplating; electroless Ni/Au (ENIG)'],
                   ['Hệ Au', 'Au chemistry', 'Cyanide-free (sulfite)'], ['Ứng dụng', 'Application', 'Bump, Cu pillar, RDL, lấp TSV', 'Bumps, Cu pillars, RDL, TSV fill']],
            '5A': [['Loại', 'Type', 'Capillary underfill (CUF), epoxy'], ['Tg', 'Tg', '≈ 110 – 160 °C'], ['CTE (α1)', 'CTE (α1)', '≈ 20 – 40 ppm/K'],
                   ['Đóng rắn', 'Cure', '≈ 150 – 165 °C'], ['Ứng dụng', 'Application', 'Flip-chip, BGA, CSP']],
            '5B': [['Thành phần', 'Composition', 'Epoxy độn bạc, 1 hoặc 2 thành phần', 'Silver-filled epoxy, 1- or 2-part'], ['Điện trở suất', 'Volume resistivity', '≈ 10⁻⁴ – 10⁻³ Ω·cm'],
                   ['Đóng rắn', 'Cure', 'RT – 150 °C'], ['Ứng dụng', 'Application', 'Die attach, gắn linh kiện, sửa mạch', 'Die attach, component bonding, circuit repair']],
            '5C': [['Dạng', 'Format', 'DAF / DDAF (kết hợp dicing tape)', 'DAF / DDAF (combined with dicing tape)'], ['Độ dày', 'Thickness', '≈ 10 – 60 µm'],
                   ['Loại', 'Type', 'Dẫn điện / không dẫn điện', 'Conductive / non-conductive'], ['Đóng rắn', 'Cure', '≈ 120 – 180 °C'],
                   ['Ứng dụng', 'Application', 'Xếp chồng die, bộ nhớ, die mỏng', 'Die stacking, memory, thin die']],
            '5D': [['Loại', 'Type', 'ICA (đẳng hướng) / ACA, ACF (dị hướng)', 'ICA (isotropic) / ACA, ACF (anisotropic)'],
                   ['Hạt dẫn', 'Conductive filler', 'Ag (ICA); hạt Ni / polymer phủ Au (ACF)', 'Ag (ICA); Ni or Au-coated polymer particles (ACF)'],
                   ['Đóng rắn', 'Cure', 'Nhiệt / UV', 'Thermal / UV'], ['Ứng dụng', 'Application', 'COG, COF, FOG, linh kiện nhạy nhiệt', 'COG, COF, FOG, heat-sensitive parts']],
            '6A': [['Loại', 'Type', 'Epoxy mold compound (EMC)'], ['Dạng', 'Form', 'Viên (transfer) / hạt (compression) / lỏng', 'Tablet (transfer) / granule (compression) / liquid'],
                   ['Độn silica', 'Silica filler', '≈ 70 – 90 wt%'], ['CTE (α1)', 'CTE (α1)', '≈ 7 – 15 ppm/K'], ['Đúc', 'Molding', '≈ 175 °C + post-mold cure'],
                   ['Chống cháy', 'Flammability', 'Halogen-free (green), UL94 V-0']]
        },
        '4': {
            '1A': [['Chiều rộng', 'Width', '1.2 / 1.5 / 1.8 m'], ['Vận tốc mặt hút', 'Face velocity', '0.4 – 0.6 m/s'],
                   ['Vật liệu', 'Material', 'Thép sơn tĩnh điện / PP chịu axit / inox', 'Powder-coated steel / acid-resistant PP / stainless steel'],
                   ['Tiêu chuẩn', 'Standards', 'EN 14175 / ASHRAE 110'], ['Phụ kiện', 'Accessories', 'Báo động lưu lượng, đèn, van gas / nước', 'Airflow alarm, lighting, gas / water valves']],
            '1B': [['Vật liệu', 'Material', 'PP / PVDF (axit, HF); inox 316 (dung môi)', 'PP / PVDF (acids, HF); SS316 (solvents)'],
                   ['Bể', 'Tanks', 'Tĩnh, tuần hoàn, gia nhiệt, siêu âm, QDR', 'Static, recirculating, heated, ultrasonic, QDR'],
                   ['Vận hành', 'Operation', 'Thủ công / bán tự động / tự động', 'Manual / semi-auto / automatic'], ['Kích thước wafer', 'Wafer size', '2" – 12"'],
                   ['An toàn', 'Safety', 'Hút khí tích hợp, EMO, cảm biến rò rỉ', 'Integrated exhaust, EMO, leak sensors']],
            '2A': [['Tốc độ quay', 'Spin speed', '100 – 10 000 rpm'], ['Gia tốc', 'Acceleration', 'Lập trình được', 'Programmable'],
                   ['Kích thước mẫu', 'Substrate size', 'Mẫu nhỏ – 8"', 'Small pieces – 8"'], ['Giữ mẫu', 'Chuck', 'Chân không', 'Vacuum'],
                   ['Chương trình', 'Recipes', 'Nhiều bước, lưu công thức', 'Multi-step, stored recipes'], ['Tuỳ chọn', 'Options', 'Hotplate, nhỏ keo tự động', 'Hotplate, auto dispense']],
            '2B': [['Kích thước wafer', 'Wafer size', 'Mẫu nhỏ – 6"', 'Small pieces – 6"'], ['Nguồn UV', 'UV source', 'Đèn Hg / UV-LED, 365 – 436 nm', 'Hg lamp / UV-LED, 365 – 436 nm'],
                   ['Chế độ tiếp xúc', 'Contact modes', 'Proximity / soft / hard / vacuum'], ['Độ phân giải', 'Resolution', '≈ 1 – 2 µm'],
                   ['Căn chỉnh', 'Alignment', 'Mặt trước; mặt sau (tuỳ chọn)', 'Top side; backside (optional)']],
            '2C': [['Bước sóng laser', 'Laser wavelength', '375 / 405 nm'], ['Kích thước nhỏ nhất', 'Min. feature', '≈ 0.6 – 1 µm'],
                   ['Vùng ghi', 'Write area', 'Tới 150 × 150 mm (theo model)', 'Up to 150 × 150 mm (model dependent)'], ['Grayscale', 'Grayscale', 'Tuỳ chọn', 'Optional'],
                   ['Định dạng dữ liệu', 'Data formats', 'GDSII, DXF, CIF, BMP'], ['Ứng dụng', 'Application', 'Quang khắc không mask, chế tạo mask, MEMS', 'Maskless lithography, mask making, MEMS']],
            '2E': [['Kích thước wafer', 'Wafer size', 'Tới 8"', 'Up to 8"'], ['Nguồn plasma', 'Plasma source', 'RF 13.56 MHz, 300 – 600 W; ICP (tuỳ chọn)', 'RF 13.56 MHz, 300 – 600 W; ICP (optional)'],
                   ['Khí', 'Gases', 'CF₄, SF₆, CHF₃, O₂, Ar, Cl₂ (theo cấu hình)', 'CF₄, SF₆, CHF₃, O₂, Ar, Cl₂ (as configured)'], ['Áp suất làm việc', 'Process pressure', '≈ 10 – 500 mTorr'],
                   ['Vật liệu khắc', 'Etches', 'SiO₂, SiN, Si, polymer, kim loại', 'SiO₂, SiN, Si, polymers, metals']],
            '2F': [['Kiểu phún xạ', 'Mode', 'DC / RF / pulsed-DC magnetron'], ['Số súng', 'Guns', '1 – 4, target 2" – 4"'], ['Áp suất nền', 'Base pressure', '≤ 5 × 10⁻⁷ Torr'],
                   ['Gia nhiệt đế', 'Substrate heating', 'Tới ≈ 500 °C', 'Up to ≈ 500 °C'], ['Tuỳ chọn', 'Options', 'Xoay đế, co-sputter, load-lock, phún xạ phản ứng', 'Substrate rotation, co-sputter, load-lock, reactive sputtering']],
            '3A': [['Loại', 'Type', 'Kính hiển vi kim tương / kiểm tra wafer', 'Metallurgical / wafer inspection'], ['Độ phóng đại', 'Magnification', '50× – 1000×'],
                   ['Chế độ quan sát', 'Modes', 'BF / DF / DIC / phân cực', 'BF / DF / DIC / polarized'], ['Bàn mẫu', 'Stage', 'Cho wafer 4" – 8"', 'For 4" – 8" wafers'],
                   ['Camera', 'Camera', 'Camera số + phần mềm đo', 'Digital camera + measurement software']],
            '3B': [['Loại', 'Type', 'Đầu dò (stylus) / quang học không tiếp xúc', 'Stylus / non-contact optical'], ['Dải đo bậc', 'Step height range', 'Vài nm – ≈ 1 mm', 'A few nm – ≈ 1 mm'],
                   ['Độ phân giải dọc', 'Vertical resolution', 'Tới ≈ 0.1 nm', 'Down to ≈ 0.1 nm'], ['Lực đầu dò', 'Stylus force', '≈ 1 – 15 mg, điều chỉnh được', '≈ 1 – 15 mg, adjustable'],
                   ['Ứng dụng', 'Application', 'Độ dày màng, độ nhám, cong vênh', 'Film thickness, roughness, bow']],
            '4A': [['Bơm sơ cấp', 'Roughing pumps', 'Rotary vane, scroll khô', 'Rotary vane, dry scroll'], ['Bơm cao chân không', 'High-vacuum pumps', 'Turbo, cryo, ion'],
                   ['Áp suất đạt', 'Ultimate pressure', '10⁻³ – 10⁻⁹ Torr (theo cấu hình)', '10⁻³ – 10⁻⁹ Torr (as configured)'],
                   ['Đo chân không', 'Gauges', 'Pirani, cold cathode, Bayard-Alpert, capacitance manometer'], ['Phụ kiện', 'Fittings', 'Van, mặt bích KF / CF / ISO', 'Valves, KF / CF / ISO flanges']],
            '4B': [['Thành phần', 'Components', 'Tủ khí, VMB / VMP, panel điều áp, MFC', 'Gas cabinets, VMB / VMP, regulator panels, MFCs'], ['Đường ống', 'Tubing', 'SS316L EP, hàn orbital', 'SS316L EP, orbital welded'],
                   ['Độ kín', 'Leak rate', '≤ 1 × 10⁻⁹ mbar·L/s (He)'], ['Loại khí', 'Gases', 'Trơ, độc, ăn mòn, dễ cháy', 'Inert, toxic, corrosive, flammable'],
                   ['An toàn', 'Safety', 'Cảm biến khí, ngắt khẩn cấp, purge N₂', 'Gas detection, emergency shut-off, N₂ purge']],
            '4C': [['Hạng mục', 'Parameters', 'Hạt bụi, nhiệt độ, độ ẩm, chênh áp, khí độc', 'Particles, temperature, humidity, differential pressure, toxic gas'],
                   ['Đếm hạt', 'Particle counter', '0.1 / 0.3 / 0.5 µm; 2.83 hoặc 28.3 L/phút', '0.1 / 0.3 / 0.5 µm; 2.83 or 28.3 L/min'],
                   ['Kết nối', 'Connectivity', 'Modbus, Ethernet, phần mềm FMS', 'Modbus, Ethernet, FMS software'], ['Cảnh báo', 'Alarms', 'Theo ngưỡng, ghi dữ liệu liên tục', 'Threshold alarms, continuous logging']]
        },
        '5': {
            '1B': [['Loại pin', 'Cell type', 'PEMFC, DMFC'], ['Công suất', 'Power', '≈ 50 W – 10 kW (theo model)', '≈ 50 W – 10 kW (model dependent)'],
                   ['Điều khiển', 'Control', 'Lưu lượng (MFC), nhiệt độ, độ ẩm, áp suất khí', 'Flow (MFC), temperature, humidity, gas pressure'],
                   ['Phép đo', 'Measurements', 'Đường I-V, HFR, EIS (tuỳ chọn)', 'I-V curves, HFR, EIS (optional)'], ['Phần mềm', 'Software', 'Tự động hoá & ghi dữ liệu', 'Automated testing & data logging']],
            '2A': [['Chế tạo điện cực', 'Electrode prep', 'Máy tráng màng, máy cán, máy đột', 'Film coater, calender, electrode punch'],
                   ['Lắp ráp cell', 'Cell assembly', 'Máy đóng coin cell, glovebox Ar (H₂O, O₂ < 1 ppm)', 'Coin-cell crimper, Ar glovebox (H₂O, O₂ < 1 ppm)'],
                   ['Định dạng cell', 'Cell formats', 'Coin (CR2032), pouch, trụ', 'Coin (CR2032), pouch, cylindrical'],
                   ['Thử nghiệm', 'Testing', 'Máy thử pin đa kênh, EIS', 'Multi-channel battery cycler, EIS']],
            '2B': [['Vật liệu điện cực', 'Electrode materials', 'LFP, NMC, LCO, graphite, Si-C'], ['Điện giải', 'Electrolytes', 'LiPF₆ trong EC/DMC, điện giải rắn', 'LiPF₆ in EC/DMC, solid electrolytes'],
                   ['Màng ngăn', 'Separators', 'PP / PE, phủ ceramic', 'PP / PE, ceramic-coated'], ['Phụ trợ', 'Auxiliaries', 'Binder PVDF / CMC / SBR, carbon dẫn, lá Cu / Al', 'PVDF / CMC / SBR binders, conductive carbon, Cu / Al foil']]
        }
    };
    Object.keys(SPECS).forEach(function (g) {
        window.PD_DATA_V2[g].items.forEach(function (it) {
            var r = SPECS[g][parseInt(it.section.vi, 10) + it.code];
            if (!r) return;
            var rows = r.map(function (x) { return { k: S(x[0], x[1]), v: S(x[2], x[3]) }; });
            // mục một dòng (không có danh mục con): modal cũng hiện bảng thông số
            if (!it.summary) it.variants.forEach(function (v) { v.specs = rows.concat(v.specs); });
            it.summary = it.summary ? { title: it.summary.title, rows: it.summary.rows.concat(rows) } : { title: S('Thông số kỹ thuật tiêu biểu', 'Typical specifications'), rows: rows };
        });
    });
})();
