/* Dữ liệu 5 nhóm sản phẩm theo file góp ý "DIGIFUND SLIDE EDIT 0926 -V2" (trang 6–7), cùng cấu trúc với
   products-data.js để dùng chung product-detail-engine.js. Nạp SAU products-data.js: các mục đã có được
   lấy lại nguyên vẹn (ảnh, thông số, SKU, song ngữ) rồi xếp lại section/code; mục mới chưa có dữ liệu chỉ có
   tên + bảng "Danh mục"; mỗi dòng sản phẩm con thành một mục "Báo giá theo yêu cầu" với ảnh chờ (logo).
   Trang preview-details-*.html gán window.PD_DATA = window.PD_DATA_V2 trước khi nạp engine. */
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
                fresh(S('1. Temporary bonding solutions'), 'A', S('Temporary bonding adhesive'), S('Keo dán tạm wafer lên carrier', 'Temporary wafer-to-carrier adhesive'), ['Thermal-slide', 'Laser debond', 'UV debond']),
                fresh(S('1. Temporary bonding solutions'), 'B', S('Debonding chemicals'), S('Hoá chất tách và làm sạch sau debond', 'Debond and residue removal'), ['Debond solvent', 'Residue cleaner']),
                fresh(S('2. Carrier solutions'), 'A', S('Silicon / Glass carrier wafer'), null, ['Si carrier', 'Glass carrier']),
                fresh(S('2. Carrier solutions'), 'B', S('Temporary carrier wafer'), null, ['4" – 12"']),
                fresh(S('3. Dicing consumables'), 'A', S('UV dicing / back grinding tape'), null, ['UV dicing tape', 'Back grinding tape']),
                fresh(S('3. Dicing consumables'), 'B', S('Dicing blade'), null, ['Hub blade', 'Hubless blade']),
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
})();
