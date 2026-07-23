/* Engine render trang chi tiết sản phẩm. Nhóm lấy từ window.PD_GROUP (fallback ?group=). */
(function () {
        var PD = window.PD_DATA || {};
        var STR = window.PD_STR || {};

        function getLang() { return localStorage.getItem('digifund-lang') || 'vi'; }
        function T(x) { return (x && typeof x === 'object') ? (x[getLang()] || x.vi || '') : (x || ''); }
        function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

        function param(name) {
            var m = new RegExp('[?&]' + name + '=([^&]*)').exec(location.search);
            return m ? decodeURIComponent(m[1]) : null;
        }
        var groupId = (window.PD_GROUP != null ? String(window.PD_GROUP) : null) || param('group') || '1';
        var STATIC_URLS = {
            '1': 'https://digifund.vn/san-pham-silicon-wafer-substrate.html',
            '2': 'https://digifund.vn/san-pham-nang-luong-tai-tao.html',
            '3': 'https://digifund.vn/san-pham-thiet-bi-phong-sach.html',
            '4': 'https://digifund.vn/san-pham-hoa-chat-vat-tu.html'
        };
        var _canUrl = window.PD_CANONICAL || STATIC_URLS[groupId] || ('https://digifund.vn/product-detail.html?group=' + groupId);
        var REG = {};     // registry variant để mở modal: key -> variant
        var CFG = {};     // (giữ cho engine cũ) trạng thái configurator
        var FSTATE = {};  // trạng thái filter theo item: itemKey -> {dim: value}
        var FILTER_KEYS = ['size', 'type', 'doping', 'orientation', 'polytype', 'resistivity'];

        function escA(s) { return esc(s).replace(/"/g, '&quot;'); }
        function slug(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ')[0]; }
        function keyId(spec) { var e = (spec.k && typeof spec.k === 'object') ? spec.k.en : spec.k; return slug(e); }
        function specVal(v, id) {
            var f = (v.specs || []).filter(function (s) { return keyId(s) === id; })[0];
            return f ? T(f.v) : '';
        }

        // Card đơn giản (fallback cho item chưa có specs, vd nhóm 2–4)
        function renderCard(v, key) {
            REG[key] = v;
            var desc = T(v.desc);
            return '' +
                '<div class="pd-variant" data-key="' + key + '">' +
                    '<div class="pd-variant__img" style="background-image:url(\'' + v.img + '\')"></div>' +
                    '<div class="pd-variant__body">' +
                        '<h3 class="pd-variant__name">' + esc(T(v.name)) + '</h3>' +
                        (desc ? '<p class="pd-variant__desc">' + esc(desc) + '</p>' : '') +
                        '<button type="button" class="pd-variant__btn" data-key="' + key + '"><i class="fas fa-circle-info"></i> ' + esc(T(STR.viewdetail)) + '</button>' +
                    '</div>' +
                '</div>';
        }

        // Nội dung danh mục: 1 bên ảnh đại diện | 1 bên bảng tổng hợp thông số cung cấp.
        // Kèm danh sách "sản phẩm tiêu biểu" thu gọn (native <details>, click -> popup).
        // Bảng tổng hợp dạng 2 cột (thấp lại, ngang chiều cao ảnh)
        function renderSummary2(sum) {
            if (!sum || !sum.rows || !sum.rows.length) return '';
            var cap = sum.title ? T(sum.title) : T(STR.summaryT);
            var cells = sum.rows.map(function (r) {
                return '<div class="pd-sum__cell"><span class="pd-sum__k">' + esc(T(r.k)) + '</span><span class="pd-sum__v">' + esc(T(r.v)) + '</span></div>';
            }).join('');
            return '<div class="pd-sum"><div class="pd-sum__cap">' + esc(cap) + '</div><div class="pd-sum__grid">' + cells + '</div></div>';
        }

        function renderSpec(it, itemKey, baseIdx) {
            var variants = it.variants || [];
            var famImg = it.img || (variants[0] && variants[0].img) || '';
            var summaryHtml = renderSummary2(it.summary);
            var split = '<div class="pd-spec">' +
                (famImg ? '<div class="pd-spec__media"><img src="' + famImg + '" alt=""></div>' : '') +
                '<div class="pd-spec__info">' + (summaryHtml || '<div class="pd-empty-note">' + esc(T(STR.updating)) + '</div>') + '</div>' +
            '</div>';

            var bsHtml = '';
            if (variants.length) {
                var rows = variants.map(function (v, vi) {
                    var key = baseIdx + '-' + vi; REG[key] = v;
                    var pills = (v.specs || []).filter(function (s) { var x = T(s.v); return x && x.length <= 20; }).slice(0, 4)
                        .map(function (s) { return '<span class="pd-pill">' + esc(T(s.v)) + '</span>'; }).join('');
                    return '<li class="pd-bs__item" data-key="' + key + '">' +
                        '<span class="pd-bs__name">' + esc(T(v.name)) + '</span>' +
                        '<span class="pd-bs__pills">' + pills + '</span>' +
                        '<span class="pd-bs__go"><i class="fas fa-arrow-right"></i></span>' +
                    '</li>';
                }).join('');
                bsHtml = '<details class="pd-bs" open><summary class="pd-bs__sum"><i class="fas fa-list-ul"></i> ' +
                    esc(T(STR.bestsell)) + ' (' + variants.length + ')</summary><ul class="pd-bs__list">' + rows + '</ul></details>';
            }
            return split + bsHtml;
        }

        // Bảng thông số + filter (specs là trung tâm; ảnh đại diện hiện 1 lần ở header)
        function renderTable(it, itemKey, baseIdx) {
            var variants = it.variants || [];
            var cd = configDims(it);
            var dims = cd.dims, colLabel = cd.colLabel;
            var showFilter = dims.length >= 1 && variants.length > 6;
            FSTATE[itemKey] = {};
            var list = variants.map(function (v, vi) { var key = baseIdx + '-' + vi; REG[key] = v; return { key: key, v: v }; });

            // cột = hợp các spec id (giữ thứ tự xuất hiện)
            var colIds = [];
            variants.forEach(function (v) {
                (v.specs || []).forEach(function (s) { var id = keyId(s); if (!colLabel[id]) { colLabel[id] = s.k; } if (colIds.indexOf(id) < 0) colIds.push(id); });
            });

            // thanh filter (chỉ danh mục nhiều SP)
            var filterHtml = '';
            if (showFilter) {
                filterHtml = '<div class="pdf-bar"><span class="pdf-hint"><i class="fas fa-filter"></i> ' + esc(T(STR.filterhint)) + '</span>' +
                    dims.map(function (d) {
                        var vals = [];
                        variants.forEach(function (v) { var x = specVal(v, d); if (x && vals.indexOf(x) < 0) vals.push(x); });
                        var chips = '<button type="button" class="pdf-chip active" data-item="' + itemKey + '" data-dim="' + d + '" data-val="">' + esc(T(STR.all)) + '</button>' +
                            vals.map(function (x) { return '<button type="button" class="pdf-chip" data-item="' + itemKey + '" data-dim="' + d + '" data-val="' + escA(x) + '">' + esc(x) + '</button>'; }).join('');
                        return '<div class="pdf-group"><span class="pdf-label">' + esc(T(colLabel[d])) + '</span><div class="pdf-chips">' + chips + '</div></div>';
                    }).join('') + '</div>';
            }

            // bảng
            var head = colIds.map(function (id) { return '<th>' + esc(T(colLabel[id])) + '</th>'; }).join('') + '<th class="pdt-act"></th>';
            var rows = list.map(function (e) {
                var v = e.v;
                var dataAttr = showFilter ? dims.map(function (d) { return 'data-f-' + d + '="' + escA(specVal(v, d)) + '"'; }).join(' ') : '';
                var cells = colIds.map(function (id) {
                    var val = specVal(v, id);
                    return '<td' + (val ? '' : ' class="pdt-empty"') + '>' + esc(val || '—') + '</td>';
                }).join('');
                return '<tr class="pdt-row" data-key="' + e.key + '" data-item="' + itemKey + '" ' + dataAttr + '>' +
                    cells + '<td class="pdt-act"><span class="pdt-go"><i class="fas fa-arrow-right"></i></span></td></tr>';
            }).join('');
            var table = '<div class="pdt-wrap"><table class="pdt"><thead><tr>' + head + '</tr></thead><tbody>' + rows + '</tbody></table></div>';

            var countHtml = showFilter ? '<div class="pdf-count" id="pdfCount-' + itemKey + '"></div>' : '';
            return filterHtml + table + countHtml;
        }

        function applyFilter(itemKey) {
            var st = FSTATE[itemKey] || {};
            var rows = document.querySelectorAll('tr[data-item="' + itemKey + '"]');
            var shown = 0;
            Array.prototype.forEach.call(rows, function (r) {
                var ok = true;
                Object.keys(st).forEach(function (dim) { if (st[dim] && r.getAttribute('data-f-' + dim) !== st[dim]) ok = false; });
                r.style.display = ok ? '' : 'none';
                if (ok) shown++;
            });
            var el = document.getElementById('pdfCount-' + itemKey);
            if (el) el.textContent = shown + ' ' + T(STR.results);
        }

        // Card ảnh + pill (cho item ít biến thể: ảnh là chính, vài thẻ thông số ngắn)
        function renderPillCard(v, key) {
            REG[key] = v;
            var pills = (v.specs || []).filter(function (s) { var val = T(s.v); return val && val.length <= 18; })
                .slice(0, 4).map(function (s) { return '<span class="pd-pill">' + esc(T(s.v)) + '</span>'; }).join('');
            return '' +
                '<div class="pd-variant" data-key="' + key + '">' +
                    '<div class="pd-variant__img" style="background-image:url(\'' + v.img + '\')"></div>' +
                    '<div class="pd-variant__body">' +
                        '<h3 class="pd-variant__name">' + esc(T(v.name)) + '</h3>' +
                        (pills ? '<div class="pd-pills">' + pills + '</div>' : '') +
                        '<button type="button" class="pd-variant__btn" data-key="' + key + '"><i class="fas fa-circle-info"></i> ' + esc(T(STR.viewdetail)) + '</button>' +
                    '</div>' +
                '</div>';
        }

        /* ====== Configurator (bộ chọn cấu hình) ====== */
        function matchVariants(cfg) {
            return cfg.list.filter(function (e) {
                return cfg.dims.every(function (d) {
                    var sv = cfg.sel[d], vv = specVal(e.v, d);
                    return !sv || !vv || sv === vv; // trống = wildcard
                });
            });
        }

        // Tính các chiều lọc của 1 item. Chỉ dùng chế độ "chọn theo thông số" khi:
        //  - dùng it.filters (nếu có) hoặc auto theo FILTER_KEYS
        //  - MỌI biến thể đều có giá trị cho chiều đó (không ẩn sản phẩm thiếu spec)
        //  - bộ chiều phân biệt được TẤT CẢ biến thể (mỗi tổ hợp = đúng 1 sản phẩm)
        // Nếu không thoả -> trả [] để dùng chế độ "chọn sản phẩm" (theo tên).
        function configDims(it) {
            var variants = it.variants || [];
            var colIds = [], colLabel = {};
            variants.forEach(function (v) {
                (v.specs || []).forEach(function (s) {
                    var id = keyId(s);
                    if (!colLabel[id]) { colLabel[id] = s.k; colIds.push(id); }
                });
            });
            var cand = (it.filters && it.filters.length) ? it.filters : colIds.filter(function (id) { return FILTER_KEYS.indexOf(id) >= 0; });
            var dims = cand.filter(function (id) {
                if (colIds.indexOf(id) < 0) return false;
                var vals = {}, allHave = true;
                variants.forEach(function (v) { var x = specVal(v, id); if (x) vals[x] = 1; else allHave = false; });
                return allHave && Object.keys(vals).length >= 2;
            });
            // kiểm tra phân biệt duy nhất
            if (dims.length) {
                var tuples = {};
                variants.forEach(function (v) { tuples[dims.map(function (d) { return specVal(v, d); }).join('|')] = 1; });
                if (Object.keys(tuples).length !== variants.length) dims = [];
            }
            return { dims: dims, colLabel: colLabel };
        }

        function setupConfig(it, itemKey, baseIdx) {
            var variants = it.variants || [];
            var cd = configDims(it);
            var dims = cd.dims, colLabel = cd.colLabel;
            var list = variants.map(function (v, vi) { var key = baseIdx + '-' + vi; REG[key] = v; return { key: key, v: v }; });
            // Chọn chế độ: ≤ 6 SP -> card nở ngang; > 6 -> configurator (theo thông số) hoặc chọn theo tên
            var mode, head, icon, wrap = 'pd-config';
            if (variants.length <= 6) {
                CFG[itemKey] = { mode: 'cards', list: list, expanded: 0 };
                head = T(STR.bestsell); icon = 'fa-star'; wrap = 'pd-cardrow';
            } else if (dims.length >= 1) {
                var opts = {};
                dims.forEach(function (d) {
                    var arr = [];
                    variants.forEach(function (v) { var x = specVal(v, d); if (x && arr.indexOf(x) < 0) arr.push(x); });
                    opts[d] = arr;
                });
                var sel = {};
                dims.forEach(function (d) { sel[d] = specVal(list[0].v, d) || ''; });
                CFG[itemKey] = { mode: 'dims', dims: dims, labels: colLabel, opts: opts, sel: sel, list: list };
                head = T(STR.choosecfg); icon = 'fa-sliders';
            } else {
                CFG[itemKey] = { mode: 'pick', dims: [], labels: colLabel, list: list, picked: 0 };
                head = T(STR.chooseprod); icon = 'fa-grip';
            }
            return '<p class="pd-bestsell"><i class="fas ' + icon + '"></i> ' + esc(head) + '</p>' +
                   '<div class="' + wrap + '" id="cfgbox-' + itemKey + '">' + buildConfig(itemKey) + '</div>';
        }

        function buildConfig(itemKey) {
            var cfg = CFG[itemKey];
            var picked, selHtml;

            // Chế độ card nở ngang (horizontal accordion)
            if (cfg.mode === 'cards') {
                return '<div class="pcards">' + cfg.list.map(function (e, i) {
                    var v = e.v, open = (i === cfg.expanded);
                    var pills = (v.specs || []).filter(function (s) { var val = T(s.v); return val && val.length <= 18; })
                        .slice(0, 3).map(function (s) { return '<span class="pd-pill">' + esc(T(s.v)) + '</span>'; }).join('');
                    var lines = (v.specs || []).slice(0, 6).map(function (s) {
                        return '<li><span>' + esc(T(s.k)) + '</span><b>' + esc(T(s.v)) + '</b></li>';
                    }).join('');
                    return '<div class="pcard' + (open ? ' is-open' : '') + '" data-item="' + itemKey + '" data-idx="' + i + '">' +
                        '<div class="pcard__img" style="background-image:url(\'' + v.img + '\')"></div>' +
                        '<div class="pcard__body">' +
                            '<h4 class="pcard__name">' + esc(T(v.name)) + '</h4>' +
                            (pills ? '<div class="pcard__basic">' + pills + '</div>' : '') +
                            '<div class="pcard__detail">' +
                                (v.sku ? '<p class="cfg-result__sku">' + esc(T(STR.sku)) + ': <b>' + esc(v.sku) + '</b></p>' : '') +
                                '<ul class="cfg-result__specs">' + lines + '</ul>' +
                                '<div class="cfg-result__actions">' +
                                    '<button type="button" class="pdt-btn" data-key="' + e.key + '"><i class="fas fa-circle-info"></i> ' + esc(T(STR.viewdetail)) + '</button>' +
                                    '<a href="./#contact" class="pd-variant__btn"><i class="fas fa-paper-plane"></i> ' + esc(T(STR.quote)) + '</a>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
                }).join('') + '</div>';
            }

            if (cfg.mode === 'dims') {
                picked = matchVariants(cfg)[0] || null;
                selHtml = cfg.dims.map(function (d) {
                    var opts = cfg.opts[d].map(function (x) {
                        var ok = cfg.list.some(function (e) {
                            return cfg.dims.every(function (k) {
                                var sv = (k === d) ? x : cfg.sel[k], vv = specVal(e.v, k);
                                return !sv || !vv || sv === vv;
                            });
                        });
                        var active = cfg.sel[d] === x;
                        return '<button type="button" class="cfg-opt' + (active ? ' active' : '') + (ok ? '' : ' is-disabled') + '" ' +
                            'data-item="' + itemKey + '" data-dim="' + d + '" data-val="' + escA(x) + '"' + (ok ? '' : ' disabled') + '>' + esc(x) + '</button>';
                    }).join('');
                    return '<div class="cfg-row"><span class="cfg-label">' + esc(T(cfg.labels[d])) + '</span><div class="cfg-opts">' + opts + '</div></div>';
                }).join('');
            } else {
                picked = cfg.list[cfg.picked] || null;
                var opts = cfg.list.map(function (e, i) {
                    var active = i === cfg.picked;
                    return '<button type="button" class="cfg-opt' + (active ? ' active' : '') + '" data-item="' + itemKey + '" data-dim="__pick__" data-val="' + i + '">' + esc(T(e.v.name)) + '</button>';
                }).join('');
                selHtml = '<div class="cfg-row"><span class="cfg-label">' + esc(T(STR.product)) + '</span><div class="cfg-opts cfg-opts--pick">' + opts + '</div></div>';
            }

            var resHtml, img = (picked && picked.v.img) || (cfg.list[0] && cfg.list[0].v.img) || '';
            if (picked) {
                var v = picked.v;
                var lines = (v.specs || []).slice(0, 6).map(function (s) {
                    return '<li><span>' + esc(T(s.k)) + '</span><b>' + esc(T(s.v)) + '</b></li>';
                }).join('');
                resHtml = '<div class="cfg-result">' +
                    '<div class="cfg-result__tag"><i class="fas fa-check-circle"></i> ' + esc(T(STR.matched)) + '</div>' +
                    '<h4 class="cfg-result__name">' + esc(T(v.name)) + '</h4>' +
                    (v.sku ? '<p class="cfg-result__sku">' + esc(T(STR.sku)) + ': <b>' + esc(v.sku) + '</b></p>' : '') +
                    '<ul class="cfg-result__specs">' + lines + '</ul>' +
                    '<div class="cfg-result__actions">' +
                        '<button type="button" class="pdt-btn" data-key="' + picked.key + '"><i class="fas fa-circle-info"></i> ' + esc(T(STR.viewdetail)) + '</button>' +
                        '<a href="./#contact" class="pd-variant__btn"><i class="fas fa-paper-plane"></i> ' + esc(T(STR.quote)) + '</a>' +
                    '</div>' +
                '</div>';
            } else {
                resHtml = '<div class="cfg-result cfg-result--none">' +
                    '<div class="cfg-result__tag cfg-result__tag--none"><i class="fas fa-wrench"></i> ' + esc(T(STR.custom)) + '</div>' +
                    '<p class="cfg-result__cdesc">' + esc(T(STR.customdesc)) + '</p>' +
                    '<div class="cfg-result__actions"><a href="./#contact" class="pd-variant__btn"><i class="fas fa-paper-plane"></i> ' + esc(T(STR.quote)) + '</a></div>' +
                '</div>';
            }

            return '<div class="cfg-media"><img src="' + img + '" alt=""><span class="cfg-media__badge">' + esc(cfg.list.length) + ' ' + esc(T(STR.results)) + '</span></div>' +
                   '<div class="cfg-panel"><div class="cfg-selectors">' + selHtml + '</div>' + resHtml + '</div>';
        }

        function renderSummary(sum) {
            if (!sum || !sum.rows || !sum.rows.length) return '';
            var rows = sum.rows.map(function (r) {
                return '<tr><th>' + esc(T(r.k)) + '</th><td>' + esc(T(r.v)) + '</td></tr>';
            }).join('');
            var cap = sum.title ? T(sum.title) : T(STR.summaryT);
            return '<div class="pd-summary"><div class="pd-summary__cap">' + esc(cap) + '</div>' +
                   '<table><tbody>' + rows + '</tbody></table></div>';
        }

        function openModal(key) {
            var v = REG[key];
            if (!v) return;
            var specsHtml;
            if (v.specs && v.specs.length) {
                specsHtml = '<div class="pdm-sec">' + esc(T(STR.techprop)) + '</div>' +
                    '<table class="pdm-table"><tbody>' + v.specs.map(function (s) {
                        return '<tr><th>' + esc(T(s.k)) + '</th><td>' + esc(T(s.v)) + '</td></tr>';
                    }).join('') + '</tbody></table>';
            } else {
                specsHtml = '<p class="pdm-desc">' + esc(T(STR.updating)) + '</p>';
            }
            var grid = '' +
                '<div class="pdm-media">' +
                    '<img src="' + (v.detailImg || v.img) + '" alt="' + esc(T(v.name)) + '">' +
                    '<p class="pdm-media__cap">' + esc(T(v.desc)) + '</p>' +
                '</div>' +
                '<div class="pdm-content">' +
                    '<h2 class="pdm-title">' + esc(T(v.desc) || T(v.name)) + '</h2>' +
                    (v.sku ? '<p class="pdm-meta"><b>' + esc(T(STR.sku)) + ':</b> ' + esc(v.sku) + '</p>' : '') +
                    '<p class="pdm-meta"><b>' + esc(T(STR.contact)) + ':</b> sales@digifund.vn</p>' +
                    specsHtml +
                    '<div class="pdm-actions">' +
                        '<a href="./#contact" class="pd-variant__btn"><i class="fas fa-paper-plane"></i> ' + esc(T(STR.quote)) + '</a>' +
                    '</div>' +
                '</div>';
            document.getElementById('pdmGrid').innerHTML = grid;
            document.getElementById('pdmOverlay').classList.add('open');
            document.body.style.overflow = 'hidden';
        }
        function closeModal() {
            document.getElementById('pdmOverlay').classList.remove('open');
            document.body.style.overflow = '';
        }

        function render() {
            var lang = getLang();
            document.documentElement.lang = lang;
            document.getElementById('langToggle').textContent = lang === 'vi' ? 'VI' : 'EN';
            // static labels
            document.getElementById('tHome').textContent = T(STR.home);
            document.getElementById('tAllProd').textContent = T(STR.allprod);
            document.getElementById('tBack').textContent = T(STR.back);
            document.getElementById('tFootBack').textContent = T(STR.back);

            var g = PD[groupId];
            var body = document.getElementById('pdpBody');
            if (!g) {
                document.getElementById('heroTitle').textContent = T(STR.notfound);
                document.getElementById('heroIntro').textContent = '';
                document.getElementById('heroBadge').textContent = '';
                document.getElementById('heroCrumb').textContent = '—';
                body.innerHTML = '';
                return;
            }
            document.documentElement.style.setProperty('--accent', g.accent);
            document.getElementById('heroBadge').textContent = T(g.badge);
            document.getElementById('heroTitle').textContent = T(g.title);
            document.getElementById('heroIntro').textContent = T(STR.intro);
            document.getElementById('heroCrumb').textContent = T(g.badge);
            document.title = T(g.title) + ' - Digifund';
            // SEO: cập nhật meta description + canonical theo nhóm
            try {
                var _desc = document.querySelector('meta[name="description"]');
                if (_desc) _desc.setAttribute('content', T(g.title) + ' — Digifund: thông số kỹ thuật chi tiết, báo giá theo yêu cầu cho ngành bán dẫn.');
                var _can = document.querySelector('link[rel="canonical"]');
                if (_can) _can.setAttribute('href', _canUrl);
                var _ogt = document.querySelector('meta[property="og:title"]');
                if (_ogt) _ogt.setAttribute('content', T(g.title) + ' | Digifund');
            } catch (e) {}

            // SEO: structured data (Breadcrumb + ItemList sản phẩm + FAQ) theo nhóm
            try {
                var _pgUrl = _canUrl;
                var _items = [];
                (g.items || []).forEach(function (it) {
                    (it.variants || []).forEach(function (v) {
                        if (v && v.name) _items.push(T(v.name));
                    });
                    if ((!it.variants || !it.variants.length) && it.name) _items.push(T(it.name));
                });
                _items = _items.slice(0, 25);
                var _listEl = _items.map(function (nm, i) {
                    return { "@type": "ListItem", "position": i + 1, "name": nm };
                });
                var _ld = {
                    "@context": "https://schema.org",
                    "@graph": [
                        {
                            "@type": "BreadcrumbList",
                            "itemListElement": [
                                { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "https://digifund.vn/" },
                                { "@type": "ListItem", "position": 2, "name": "Sản phẩm", "item": "https://digifund.vn/#products" },
                                { "@type": "ListItem", "position": 3, "name": T(g.title), "item": _pgUrl }
                            ]
                        },
                        {
                            "@type": "ItemList",
                            "name": T(g.title),
                            "url": _pgUrl,
                            "numberOfItems": _listEl.length,
                            "itemListElement": _listEl
                        },
                        {
                            "@type": "FAQPage",
                            "mainEntity": [
                                { "@type": "Question", "name": "Làm sao để đặt mua " + T(g.title).toLowerCase() + " tại Digifund?", "acceptedAnswer": { "@type": "Answer", "text": "Bạn có thể liên hệ Digifund qua hotline +84 979 324 567 hoặc email digifundvietnam@gmail.com để được tư vấn thông số và nhận báo giá theo yêu cầu." } },
                                { "@type": "Question", "name": "Digifund có cung cấp silicon wafer và vật liệu bán dẫn theo thông số riêng không?", "acceptedAnswer": { "@type": "Answer", "text": "Có. Digifund cung cấp silicon wafer, substrate và vật liệu bán dẫn với nhiều kích thước, độ tinh khiết và thông số kỹ thuật khác nhau, đáp ứng yêu cầu riêng của từng dự án nghiên cứu và sản xuất." } },
                                { "@type": "Question", "name": "Digifund giao hàng ở đâu?", "acceptedAnswer": { "@type": "Answer", "text": "Digifund có trụ sở tại TP. Hồ Chí Minh và cung cấp sản phẩm trên toàn quốc." } }
                            ]
                        }
                    ]
                };
                var _s = document.createElement('script');
                _s.type = 'application/ld+json';
                _s.id = 'pd-jsonld';
                _s.textContent = JSON.stringify(_ld);
                var _old = document.getElementById('pd-jsonld');
                if (_old) _old.remove();
                document.head.appendChild(_s);
            } catch (e) {}

            REG = {};
            CFG = {};
            var lastSection = null, navHtml = '', contentHtml = '';
            g.items.forEach(function (it, idx) {
                var itemKey = 'i' + idx;
                var variants = it.variants || [];
                var hasSpecs = variants.some(function (v) { return v.specs && v.specs.length; });
                var active = idx === 0;
                // nhãn: "1. Silicon wafer" + "A" -> "1A"
                var secNum = '';
                if (it.section) { var mm = T(it.section).match(/^\s*(\d+)/); secNum = mm ? mm[1] : ''; }
                var label = it.code ? (secNum + it.code) : ('' + (idx + 1));

                // --- menu trái ---
                var sec = it.section ? T(it.section) : null;
                if (sec && sec !== lastSection) { navHtml += '<div class="pdp-navsec">' + esc(sec) + '</div>'; lastSection = sec; }
                navHtml += '<button type="button" class="pdp-navitem' + (active ? ' is-active' : '') + '" data-cat="' + itemKey + '">' +
                    '<span class="pdp-navitem__code">' + esc(label) + '</span>' +
                    '<span class="pdp-navitem__name">' + esc(T(it.name)) + '</span>' +
                    '<span class="pdp-navitem__count">' + variants.length + '</span>' +
                '</button>';

                // --- nội dung danh mục: 1 bên ảnh | 1 bên bảng tổng hợp thông số ---
                var prod;
                if (hasSpecs) {
                    prod = renderSpec(it, itemKey, idx);
                } else {
                    var cards = variants.map(function (v, vi) { return renderCard(v, idx + '-' + vi); }).join('');
                    prod = cards ? '<div class="pd-variants">' + cards + '</div>' : '<div class="pd-empty-note">' + esc(T(STR.updating)) + '</div>';
                }
                var apps = appsOf(it);
                contentHtml += '<section class="pdp-cat' + (active ? ' is-active' : '') + '" id="cat-' + itemKey + '">' +
                    '<div class="pdp-cat__head">' +
                        '<div class="pdp-cat__headtext">' +
                            '<div class="pdp-cat__titlerow"><span class="pd-item__no">' + esc(label) + '</span><h2 class="pd-item__name">' + esc(T(it.name)) + '</h2></div>' +
                            (it.subtitle ? '<p class="pd-item__sub">' + esc(T(it.subtitle)) + '</p>' : '') +
                            (apps ? '<p class="pdp-cat__apps"><i class="fas fa-lightbulb"></i> <b>' + esc(T(STR.apps)) + ':</b> ' + esc(T(apps)) + '</p>' : '') +
                        '</div>' +
                    '</div>' +
                    prod +
                    '<div class="pdp-cat__cta"><a href="./#contact" class="pd-variant__btn"><i class="fas fa-paper-plane"></i> ' + esc(T(STR.quotecat)) + '</a></div>' +
                '</section>';
            });
            document.getElementById('pdpNav').innerHTML = navHtml;
            document.getElementById('pdpContent').innerHTML = contentHtml;
        }

        // Ứng dụng của 1 mục: ưu tiên it.apps, không thì lấy từ dòng "Applications" trong summary
        function appsOf(it) {
            if (it.apps) return it.apps;
            var rows = it.summary && it.summary.rows;
            if (rows) { for (var i = 0; i < rows.length; i++) { if (keyId(rows[i]) === 'applications') return rows[i].v; } }
            return null;
        }

        // Event delegation (gắn 1 lần): mở modal + chọn cấu hình
        function wireBody() {
            var body = document.getElementById('pdpBody');
            body.addEventListener('click', function (e) {
                var navit = e.target.closest ? e.target.closest('.pdp-navitem') : null;
                if (navit) {
                    var cat = navit.getAttribute('data-cat');
                    Array.prototype.forEach.call(document.querySelectorAll('.pdp-navitem'), function (n) { n.classList.toggle('is-active', n === navit); });
                    Array.prototype.forEach.call(document.querySelectorAll('.pdp-cat'), function (p) { p.classList.toggle('is-active', p.id === 'cat-' + cat); });
                    return;
                }
                var chip = e.target.closest ? e.target.closest('.pdf-chip') : null;
                if (chip) {
                    var fitem = chip.getAttribute('data-item'), fdim = chip.getAttribute('data-dim'), fval = chip.getAttribute('data-val');
                    var grp = chip.parentNode;
                    Array.prototype.forEach.call(grp.querySelectorAll('.pdf-chip'), function (c) { c.classList.remove('active'); });
                    chip.classList.add('active');
                    FSTATE[fitem] = FSTATE[fitem] || {};
                    FSTATE[fitem][fdim] = fval;
                    applyFilter(fitem);
                    return;
                }
                var opt = e.target.closest ? e.target.closest('.cfg-opt') : null;
                if (opt && !opt.classList.contains('is-disabled')) {
                    var item = opt.getAttribute('data-item'), dim = opt.getAttribute('data-dim'), val = opt.getAttribute('data-val');
                    if (CFG[item]) {
                        if (dim === '__pick__') CFG[item].picked = parseInt(val, 10);
                        else CFG[item].sel[dim] = val;
                        var box = document.getElementById('cfgbox-' + item);
                        if (box) box.innerHTML = buildConfig(item);
                    }
                    return;
                }
                var keyEl = e.target.closest ? e.target.closest('[data-key]') : null;
                if (keyEl) { e.preventDefault(); openModal(keyEl.getAttribute('data-key')); return; }
                var card = e.target.closest ? e.target.closest('.pcard') : null;
                if (card) {
                    var it2 = card.getAttribute('data-item'), ix = parseInt(card.getAttribute('data-idx'), 10);
                    if (CFG[it2]) {
                        CFG[it2].expanded = ix;
                        var b = document.getElementById('cfgbox-' + it2);
                        if (b) b.innerHTML = buildConfig(it2);
                    }
                }
            });
        }

        // Theme
        function applyTheme(t) {
            document.documentElement.setAttribute('data-theme', t);
            document.getElementById('themeToggle').innerHTML = t === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
            localStorage.setItem('digifund-theme', t);
        }
        var theme = localStorage.getItem('digifund-theme') || 'light';
        applyTheme(theme);

        document.getElementById('langToggle').addEventListener('click', function () {
            var l = getLang() === 'vi' ? 'en' : 'vi';
            localStorage.setItem('digifund-lang', l);
            render();
        });
        document.getElementById('themeToggle').addEventListener('click', function () {
            theme = theme === 'dark' ? 'light' : 'dark';
            applyTheme(theme);
        });

        // Modal close: nút X, click ra nền, phím ESC
        document.getElementById('pdmClose').addEventListener('click', closeModal);
        document.getElementById('pdmOverlay').addEventListener('click', function (e) {
            if (e.target === this) closeModal();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeModal();
        });

        wireBody();
        render();
    })();
