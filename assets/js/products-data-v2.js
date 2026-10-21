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
            title: S('Silicon Wafers & Substrates', 'Silicon Wafers & Substrates'),
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
                fresh(S('3. Carrier wafers'), 'A', S('Silicon carrier wafer'), S('Wafer mang cho mỏng hoá, bonding tạm thời', 'Carrier for thinning and temporary bonding'), ['4" / 6" / 8" / 12"', 'SSP / DSP']),
                fresh(S('3. Carrier wafers'), 'B', S('Glass carrier wafer'), S('Borosilicate / Quartz cho debond bằng laser, UV', 'Borosilicate / quartz for laser and UV debond'), ['Borosilicate', 'Fused silica / Quartz'])
            ]
        },
        '2': {
            accent: '#1e3a8a', badge: S('Nhóm 2', 'Group 2'),
            title: S('Semiconductor Fabrication Materials', 'Semiconductor Fabrication Materials'),
            items: [
                from(S('1. Lithography materials'), 'A', '4', 1, { keep: [0], name: S('Photoresists'), subtitle: S('Positive PR (AZ1512, 1518, 1502), Negative PR (N1400), SU-8 PR, Thick PR'),
                    list: ['AZ1512', 'AZ1518', 'AZ1502', 'N1400', 'SU-8', 'Thick PR'] }),
                from(S('1. Lithography materials'), 'B', '4', 1, { keep: [1], name: S('Developer'), subtitle: S('AZ300-MIF, TMAH, MF-319'), list: ['AZ300-MIF', 'TMAH 2.38%', 'MF-319'] }),
                fresh(S('1. Lithography materials'), 'C', S('Adhesion promoters'), S('Tăng bám dính cho photoresist', 'Photoresist adhesion promoter'), ['HMDS']),
                fresh(S('1. Lithography materials'), 'D', S('Strippers'), S('Tẩy photoresist sau quang khắc', 'Photoresist removal'), ['SVC series', 'PGMEA']),
                fresh(S('1. Lithography materials'), 'E', S('Anti-reflective coatings'), S('Lớp chống phản xạ cho quang khắc', 'Anti-reflective layers for lithography'), ['DUV ARC', 'BARC']),
                from(S('2. CMP materials'), 'A', '4', 1, { keep: [3], name: S('CMP slurries'), subtitle: S('Oxide, Copper, Tungsten CMP slurries'), list: ['Oxide', 'Copper', 'Tungsten'] }),
                fresh(S('2. CMP materials'), 'B', S('CMP pads'), S('Pad đánh bóng cứng / mềm', 'Hard / soft polishing pads'), ['Hard polishing pad', 'Soft polishing pad']),
                fresh(S('2. CMP materials'), 'C', S('CMP accessories'), S('Phụ kiện cho hệ CMP', 'CMP accessories'), ['Conditioner disc', 'CMP filters']),
                from(S('3. Thin film materials'), 'A', '2', 0),
                fresh(S('3. Thin film materials'), 'B', S('Evaporation materials'), S('Vật liệu bốc bay nhiệt / e-beam', 'Thermal / e-beam evaporation'), ['Metal pellets', 'Metal wire']),
                from(S('4. Wet process materials'), 'A', '4', 1, { keep: [4], name: S('Cleaning chemicals'), subtitle: S('Dung môi cấp bán dẫn', 'Semiconductor-grade solvents'), list: ['IPA', 'Acetone', 'NMP'] }),
                from(S('4. Wet process materials'), 'B', '4', 1, { keep: [2], name: S('Wet etchants'), subtitle: S('Hoá chất ăn mòn ướt', 'Wet etchants'), list: ['HF', 'BOE', 'KOH', 'H₃PO₄'] })
            ]
        },
        '3': {
            accent: '#1e3a8a', badge: S('Nhóm 3', 'Group 3'),
            title: S('Advanced Packaging Materials', 'Advanced Packaging Materials'),
            items: [
                Object.assign(img(fresh(S('1. Temporary bonding solutions'), 'A', S('Temporary bonding adhesive'), S('Keo dán tạm wafer lên carrier', 'Temporary wafer-to-carrier adhesive'), ['Highly adhesive bonding glue']),
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
                Object.assign(img(fresh(S('1. Temporary bonding solutions'), 'B', S('Debonding chemicals'), S('Hoá chất tách và làm sạch sau debond', 'Debond and residue removal'),
                    ['Debond solvent', 'Residue cleaner', 'Thermal-slide', 'Laser debond', 'UV debond']), './assets/images/pack-debond-chemicals.jpg'), { flow: FLOW_DEBOND }),
                fresh(S('2. Carrier solutions'), 'A', S('Silicon / Glass carrier wafer'), null, ['Si carrier', 'Glass carrier']),
                fresh(S('2. Carrier solutions'), 'B', S('Temporary carrier wafer'), null, ['4" – 12"']),
                Object.assign(img(fresh(S('3. Dicing consumables'), 'A', S('UV dicing / back grinding tape'), null, ['UV dicing tape', 'Back grinding tape']),
                    './assets/images/pack-dicing-tape.jpg'), { flow: FLOW_DICING }),
                img(fresh(S('3. Dicing consumables'), 'B', S('Dicing blade'), null, ['Hub blade', 'Hubless blade']), './assets/images/pack-dicing-blade.jpg'),
                fresh(S('4. Plating & metallization'), 'A', S('Cu, Ni, Au plating chemistry'), S('Hoá chất mạ cho bump, RDL, TSV', 'Plating for bumps, RDL, TSV'), ['Cu', 'Ni', 'Au']),
                fresh(S('5. Assembly materials'), 'A', S('Underfill'), null, ['Capillary underfill']),
                fresh(S('5. Assembly materials'), 'B', S('Silver epoxy'), null, ['Silver epoxy']),
                fresh(S('5. Assembly materials'), 'C', S('Die attach film'), null, ['DAF']),
                fresh(S('5. Assembly materials'), 'D', S('Conductive adhesive'), null, ['ICA', 'ACA / ACF']),
                fresh(S('6. Encapsulation materials'), 'A', S('Mold compound'), null, ['Epoxy mold compound'])
            ]
        },
        '4': {
            accent: '#1e3a8a', badge: S('Nhóm 4', 'Group 4'),
            title: S('Cleanroom & Hi-Tech Equipment', 'Cleanroom & Hi-Tech Equipment'),
            items: [
                fresh(S('1. Cleanroom equipment'), 'A', S('Fume hoods'), S('Tủ hút khí độc', 'Fume hoods'), ['Tủ hút hoá chất', 'Tủ hút axit']),
                fresh(S('1. Cleanroom equipment'), 'B', S('Wet benches'), S('Bàn quy trình ướt', 'Wet process benches'), ['Wet bench axit', 'Wet bench dung môi']),
                from(S('1. Cleanroom equipment'), 'C', '3', 1, { name: S('Glassware') }),
                from(S('1. Cleanroom equipment'), 'D', '3', 2, { name: S('Gloves + Bunny suits') }),
                fresh(S('2. Semiconductor process equipment'), 'A', S('Spin coater')),
                fresh(S('2. Semiconductor process equipment'), 'B', S('Mask aligner')),
                fresh(S('2. Semiconductor process equipment'), 'C', S('Direct laser writer')),
                from(S('2. Semiconductor process equipment'), 'D', '3', 0, { keep: [2], name: S('CVD systems') }),
                fresh(S('2. Semiconductor process equipment'), 'E', S('RIE systems')),
                fresh(S('2. Semiconductor process equipment'), 'F', S('Sputtering systems')),
                fresh(S('3. Metrology & characterization'), 'A', S('Optical microscope')),
                fresh(S('3. Metrology & characterization'), 'B', S('Profilometer')),
                fresh(S('4. Laboratory equipment'), 'A', S('Vacuum systems')),
                fresh(S('4. Laboratory equipment'), 'B', S('Gas delivery systems')),
                fresh(S('4. Laboratory equipment'), 'C', S('Process monitoring equipment')),
                from(S('4. Laboratory equipment'), 'D', '3', 0, { keep: [0, 1, 3], name: S('Thiết bị gia nhiệt & tổng hợp', 'Heating & synthesis equipment') })
            ]
        },
        '5': {
            accent: '#1e3a8a', badge: S('Nhóm 5', 'Group 5'),
            title: S('Renewable Energy Materials & Equipment', 'Renewable Energy Materials & Equipment'),
            items: [
                from(S('1. Solar energy & fuel cell'), 'A', '2', 1, { name: S('Photo-thermal-electrocatalytic reactors') }),
                fresh(S('1. Solar energy & fuel cell'), 'B', S('Fuel cell test station')),
                fresh(S('2. Energy storage'), 'A', S('Battery research equipment')),
                fresh(S('2. Energy storage'), 'B', S('Advanced materials')),
                from(S('3. Nanomaterials'), 'A', '4', 0, { name: S('Nanomaterials') })
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
})();
