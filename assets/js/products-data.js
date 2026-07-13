/* Dữ liệu sản phẩm dùng chung cho index.html & product-detail.html.
   Cấu trúc: group -> items -> variants.
   - item.section : tiêu đề mục lớn (vd "1. Silicon wafer"). Render header khi đổi section.
   - item.code    : nhãn chữ cái (A, B, C...).
   - item.summary : bảng Specifications Summary (rows: [{k, v}]).
   - variant      : { name, img, desc(=caption), specs(=Technical Properties), sku, link, longDesc }
   Mỗi value có thể là chuỗi (dùng chung) hoặc {vi, en}. */

var WAFER_IMG = './assets/images/siliconwafer.png';
var SIC_IMG = './assets/images/wafercarbide.png';

window.PD_DATA = {
    '1': {
        accent: '#2563eb',
        badge: { vi: 'Nhóm 1', en: 'Group 1' },
        title: { vi: 'Silicon Wafer & Substrate cho ngành công nghiệp bán dẫn', en: 'Silicon Wafer & Substrate for the Semiconductor Industry' },
        items: [

            /* ============ 1. SILICON WAFER ============ */

            /* --- A. Silicon (Si) --- */
            {
                section: { vi: '1. Silicon wafer', en: '1. Silicon wafer' },
                code: 'A',
                name: { vi: 'Silicon (Si)', en: 'Silicon (Si)' },
                subtitle: { vi: 'N-Type or P-Type Silicon Wafer – CZ Si / FZ Si', en: 'N-Type or P-Type Silicon Wafer – CZ Si / FZ Si' },
                apps: { vi: 'Vi mạch & IC, MEMS, cảm biến, linh kiện công suất, nghiên cứu R&D', en: 'ICs & microchips, MEMS, sensors, power devices, R&D' },
                summary: {
                    title: { vi: 'Tổng hợp thông số Silicon Wafer', en: 'Specifications Summary of Silicon Wafers' },
                    rows: [
                        { k: { vi: 'Phương pháp nuôi', en: 'Growth method' }, v: 'CZ (Czochralski), FZ (Float Zone)' },
                        { k: { vi: 'Kích thước (inch)', en: 'Size (inch)' }, v: '2", 4", 6", 8" (option 12")' },
                        { k: { vi: 'Phân hạng (Grade)', en: 'Grade' }, v: 'Prime – Test – Dummy' },
                        { k: { vi: 'Định hướng', en: 'Orientation' }, v: '⟨100⟩ ; ⟨110⟩ ; ⟨111⟩' },
                        { k: { vi: 'Pha tạp (Doped)', en: 'Doped' }, v: { vi: 'N-type (Phosphorus, P) ; P-type (Boron, B)', en: 'N-type (Phosphorus, P) ; P-type (Boron, B)' } },
                        { k: { vi: 'Điện trở suất (Ω·cm)', en: 'Resistivity (Ω·cm)' }, v: '0.001–0.005 ; 0.01–0.02 ; 1–10 ; 1–100' },
                        { k: { vi: 'Đánh bóng (Polished)', en: 'Polished' }, v: '1-side (SSP) ; 2-side (DSP)' },
                        { k: { vi: 'Độ dày (µm)', en: 'Thickness (µm)' }, v: '275 ; 300 ; 365 ; 500 ; 525 ; 725' }
                    ]
                },
                variants: [
                    {
                        name: { vi: 'Prime CZ-Si 2" P-type', en: 'Prime CZ-Si 2" P-type' }, img: WAFER_IMG,
                        desc: { vi: 'Prime CZ-Si Wafer, Size: 2", Orientation: (100), P-type (Boron), Resistivity: 0.01–0.02 Ω·cm, 2-Side Polished, Thickness: 525 ± 25 µm', en: 'Prime CZ-Si Wafer, Size: 2", Orientation: (100), P-type (Boron), Resistivity: 0.01–0.02 Ω·cm, 2-Side Polished, Thickness: 525 ± 25 µm' },
                        sku: 'DG-SW-020001',
                        link: 'https://shop.nanografi.com/silicon-wafers-semiconductor-wafers/cz-si-wafers/',
                        longDesc: { vi: 'Silicon là một trong những nguyên tố phổ biến nhất trong vỏ Trái Đất. Wafer CZ-Si có bề mặt cực phẳng, nhẵn như gương, sản xuất bằng phương pháp Czochralski để đạt độ tinh khiết cao. Tùy ứng dụng, wafer được pha tạp Boron/Phosphorus để điều chỉnh tính chất điện. Đây là nền tảng cho chất bán dẫn, vi mạch, IC.', en: 'Silicon is one of the most common elements in Earth’s crust. CZ-Si wafers have very flat, mirror-like surfaces, produced by the Czochralski method for the highest purity. Depending on usage, wafers are doped with Boron/Phosphorus to tailor electrical properties. They are the key platform for semiconductors, microchips and ICs.' },
                        specs: [
                            { k: { vi: 'Chất lượng', en: 'Quality' }, v: 'Prime' },
                            { k: { vi: 'Vật liệu', en: 'Material' }, v: 'CZ-Si' },
                            { k: { vi: 'Kích thước', en: 'Size (inch)' }, v: '2"' },
                            { k: { vi: 'Định hướng', en: 'Orientation' }, v: '(100)' },
                            { k: { vi: 'Pha tạp', en: 'Doping' }, v: 'Boron (P-type)' },
                            { k: { vi: 'Điện trở suất', en: 'Resistivity' }, v: '0.01–0.02 Ω·cm' },
                            { k: { vi: 'Đánh bóng', en: 'Polished' }, v: { vi: '2 mặt (DSP)', en: 'Double Side (DSP)' } },
                            { k: { vi: 'Độ dày', en: 'Thickness' }, v: '525 ± 25 µm' }
                        ]
                    },
                    {
                        name: { vi: 'Prime CZ-Si 2" N-type', en: 'Prime CZ-Si 2" N-type' }, img: WAFER_IMG,
                        desc: { vi: 'Prime CZ-Si Wafer, Size: 2", Orientation: (100), N-type (Phosphorus), Resistivity: 0.01–0.02 Ω·cm, 2-Side Polished, Thickness: 525 ± 25 µm', en: 'Prime CZ-Si Wafer, Size: 2", Orientation: (100), N-type (Phosphorus), Resistivity: 0.01–0.02 Ω·cm, 2-Side Polished, Thickness: 525 ± 25 µm' },
                        sku: 'DG-SW-020002',
                        specs: [
                            { k: { vi: 'Chất lượng', en: 'Quality' }, v: 'Prime' },
                            { k: { vi: 'Vật liệu', en: 'Material' }, v: 'CZ-Si' },
                            { k: { vi: 'Kích thước', en: 'Size (inch)' }, v: '2"' },
                            { k: { vi: 'Định hướng', en: 'Orientation' }, v: '(100)' },
                            { k: { vi: 'Pha tạp', en: 'Doping' }, v: 'Phosphorus (N-type)' },
                            { k: { vi: 'Điện trở suất', en: 'Resistivity' }, v: '0.01–0.02 Ω·cm' },
                            { k: { vi: 'Đánh bóng', en: 'Polished' }, v: { vi: '2 mặt (DSP)', en: 'Double Side (DSP)' } },
                            { k: { vi: 'Độ dày', en: 'Thickness' }, v: '525 ± 25 µm' }
                        ]
                    },
                    {
                        name: { vi: 'Prime CZ-Si 4" N-type', en: 'Prime CZ-Si 4" N-type' }, img: WAFER_IMG,
                        desc: { vi: 'Prime CZ-Si Wafer, Size: 4", Orientation: (100), N-type (Phosphorus), Resistivity: 1–10 Ω·cm, 2-Side Polished, Thickness: 525 ± 25 µm', en: 'Prime CZ-Si Wafer, Size: 4", Orientation: (100), N-type (Phosphorus), Resistivity: 1–10 Ω·cm, 2-Side Polished, Thickness: 525 ± 25 µm' },
                        sku: 'DG-SW-040001',
                        specs: [
                            { k: { vi: 'Chất lượng', en: 'Quality' }, v: 'Prime' },
                            { k: { vi: 'Vật liệu', en: 'Material' }, v: 'CZ-Si' },
                            { k: { vi: 'Kích thước', en: 'Size (inch)' }, v: '4"' },
                            { k: { vi: 'Định hướng', en: 'Orientation' }, v: '(100)' },
                            { k: { vi: 'Pha tạp', en: 'Doping' }, v: 'Phosphorus (N-type)' },
                            { k: { vi: 'Điện trở suất', en: 'Resistivity' }, v: '1–10 Ω·cm' },
                            { k: { vi: 'Đánh bóng', en: 'Polished' }, v: { vi: '2 mặt (DSP)', en: 'Double Side (DSP)' } },
                            { k: { vi: 'Độ dày', en: 'Thickness' }, v: '525 ± 25 µm' }
                        ]
                    },
                    {
                        name: { vi: 'Prime CZ-Si 4" P-type', en: 'Prime CZ-Si 4" P-type' }, img: WAFER_IMG,
                        desc: { vi: 'Prime CZ-Si Wafer, Size: 4", Orientation: (100), P-type (Boron), Resistivity: 1–10 Ω·cm, 1-Side Polished, Thickness: 525 ± 25 µm', en: 'Prime CZ-Si Wafer, Size: 4", Orientation: (100), P-type (Boron), Resistivity: 1–10 Ω·cm, 1-Side Polished, Thickness: 525 ± 25 µm' },
                        sku: 'DG-SW-040002',
                        specs: [
                            { k: { vi: 'Chất lượng', en: 'Quality' }, v: 'Prime' },
                            { k: { vi: 'Vật liệu', en: 'Material' }, v: 'CZ-Si' },
                            { k: { vi: 'Kích thước', en: 'Size (inch)' }, v: '4"' },
                            { k: { vi: 'Định hướng', en: 'Orientation' }, v: '(100)' },
                            { k: { vi: 'Pha tạp', en: 'Doping' }, v: 'Boron (P-type)' },
                            { k: { vi: 'Điện trở suất', en: 'Resistivity' }, v: '1–10 Ω·cm' },
                            { k: { vi: 'Đánh bóng', en: 'Polished' }, v: { vi: '1 mặt (SSP)', en: 'Single Side (SSP)' } },
                            { k: { vi: 'Độ dày', en: 'Thickness' }, v: '525 ± 25 µm' }
                        ]
                    },
                    {
                        name: { vi: 'Prime CZ-Si 6" P-type', en: 'Prime CZ-Si 6" P-type' }, img: WAFER_IMG,
                        desc: { vi: 'Prime CZ-Si Wafer, Size: 6", Orientation: (100), P-type (Boron), Resistivity: 1–100 Ω·cm, 1-Side Polished, Thickness: 675 ± 25 µm', en: 'Prime CZ-Si Wafer, Size: 6", Orientation: (100), P-type (Boron), Resistivity: 1–100 Ω·cm, 1-Side Polished, Thickness: 675 ± 25 µm' },
                        sku: 'DG-SW-060001',
                        specs: [
                            { k: { vi: 'Chất lượng', en: 'Quality' }, v: 'Prime' },
                            { k: { vi: 'Vật liệu', en: 'Material' }, v: 'CZ-Si' },
                            { k: { vi: 'Kích thước', en: 'Size (inch)' }, v: '6"' },
                            { k: { vi: 'Định hướng', en: 'Orientation' }, v: '(100)' },
                            { k: { vi: 'Pha tạp', en: 'Doping' }, v: 'Boron (P-type)' },
                            { k: { vi: 'Điện trở suất', en: 'Resistivity' }, v: '1–100 Ω·cm' },
                            { k: { vi: 'Đánh bóng', en: 'Polished' }, v: { vi: '1 mặt (SSP)', en: 'Single Side (SSP)' } },
                            { k: { vi: 'Độ dày', en: 'Thickness' }, v: '675 ± 25 µm' }
                        ]
                    },
                    {
                        name: { vi: 'Prime CZ-Si 6" N-type (111)', en: 'Prime CZ-Si 6" N-type (111)' }, img: WAFER_IMG,
                        desc: { vi: 'Prime CZ-Si Wafer, Size: 6", Orientation: (111), N-type (Phosphorus), Resistivity: 1–10 Ω·cm, 2-Side Polished, Thickness: 675 ± 25 µm', en: 'Prime CZ-Si Wafer, Size: 6", Orientation: (111), N-type (Phosphorus), Resistivity: 1–10 Ω·cm, 2-Side Polished, Thickness: 675 ± 25 µm' },
                        sku: 'DG-SW-060002',
                        specs: [
                            { k: { vi: 'Chất lượng', en: 'Quality' }, v: 'Prime' },
                            { k: { vi: 'Vật liệu', en: 'Material' }, v: 'CZ-Si' },
                            { k: { vi: 'Kích thước', en: 'Size (inch)' }, v: '6"' },
                            { k: { vi: 'Định hướng', en: 'Orientation' }, v: '(111)' },
                            { k: { vi: 'Pha tạp', en: 'Doping' }, v: 'Phosphorus (N-type)' },
                            { k: { vi: 'Điện trở suất', en: 'Resistivity' }, v: '1–10 Ω·cm' },
                            { k: { vi: 'Đánh bóng', en: 'Polished' }, v: { vi: '2 mặt (DSP)', en: 'Double Side (DSP)' } },
                            { k: { vi: 'Độ dày', en: 'Thickness' }, v: '675 ± 25 µm' }
                        ]
                    },
                    {
                        name: { vi: 'Prime CZ-Si 8" P-type', en: 'Prime CZ-Si 8" P-type' }, img: WAFER_IMG,
                        desc: { vi: 'Prime CZ-Si Wafer, Size: 8", Orientation: (100), P-type (Boron), Resistivity: 1–10 Ω·cm, 2-Side Polished, Thickness: 725 ± 25 µm', en: 'Prime CZ-Si Wafer, Size: 8", Orientation: (100), P-type (Boron), Resistivity: 1–10 Ω·cm, 2-Side Polished, Thickness: 725 ± 25 µm' },
                        sku: 'DG-SW-080001',
                        specs: [
                            { k: { vi: 'Chất lượng', en: 'Quality' }, v: 'Prime' },
                            { k: { vi: 'Vật liệu', en: 'Material' }, v: 'CZ-Si' },
                            { k: { vi: 'Kích thước', en: 'Size (inch)' }, v: '8"' },
                            { k: { vi: 'Định hướng', en: 'Orientation' }, v: '(100)' },
                            { k: { vi: 'Pha tạp', en: 'Doping' }, v: 'Boron (P-type)' },
                            { k: { vi: 'Điện trở suất', en: 'Resistivity' }, v: '1–10 Ω·cm' },
                            { k: { vi: 'Đánh bóng', en: 'Polished' }, v: { vi: '2 mặt (DSP)', en: 'Double Side (DSP)' } },
                            { k: { vi: 'Độ dày', en: 'Thickness' }, v: '725 ± 25 µm' }
                        ]
                    },
                    {
                        name: { vi: 'Prime CZ-Si 8" N-type', en: 'Prime CZ-Si 8" N-type' }, img: WAFER_IMG,
                        desc: { vi: 'Prime CZ-Si Wafer, Size: 8", Orientation: (100), N-type (Phosphorus), Resistivity: 8–12 Ω·cm, 2-Side Polished, Thickness: 725 ± 25 µm', en: 'Prime CZ-Si Wafer, Size: 8", Orientation: (100), N-type (Phosphorus), Resistivity: 8–12 Ω·cm, 2-Side Polished, Thickness: 725 ± 25 µm' },
                        sku: 'DG-SW-080002',
                        specs: [
                            { k: { vi: 'Chất lượng', en: 'Quality' }, v: 'Prime' },
                            { k: { vi: 'Vật liệu', en: 'Material' }, v: 'CZ-Si' },
                            { k: { vi: 'Kích thước', en: 'Size (inch)' }, v: '8"' },
                            { k: { vi: 'Định hướng', en: 'Orientation' }, v: '(100)' },
                            { k: { vi: 'Pha tạp', en: 'Doping' }, v: 'Phosphorus (N-type)' },
                            { k: { vi: 'Điện trở suất', en: 'Resistivity' }, v: '8–12 Ω·cm' },
                            { k: { vi: 'Đánh bóng', en: 'Polished' }, v: { vi: '2 mặt (DSP)', en: 'Double Side (DSP)' } },
                            { k: { vi: 'Độ dày', en: 'Thickness' }, v: '725 ± 25 µm' }
                        ]
                    },
                    {
                        name: { vi: 'Low-resistivity CZ-Si 4"', en: 'Low-resistivity CZ-Si 4"' }, img: WAFER_IMG,
                        desc: { vi: 'Low-resistivity CZ-Si Wafer, Size: 4", Orientation: (100), N-type, Resistivity: 0.001–0.005 Ω·cm, 1-Side Polished, Thickness: 525 ± 25 µm', en: 'Low-resistivity CZ-Si Wafer, Size: 4", Orientation: (100), N-type, Resistivity: 0.001–0.005 Ω·cm, 1-Side Polished, Thickness: 525 ± 25 µm' },
                        sku: 'DG-SW-040003',
                        specs: [
                            { k: { vi: 'Chất lượng', en: 'Quality' }, v: 'Prime' },
                            { k: { vi: 'Vật liệu', en: 'Material' }, v: 'CZ-Si' },
                            { k: { vi: 'Kích thước', en: 'Size (inch)' }, v: '4"' },
                            { k: { vi: 'Định hướng', en: 'Orientation' }, v: '(100)' },
                            { k: { vi: 'Pha tạp', en: 'Doping' }, v: 'Phosphorus (N-type)' },
                            { k: { vi: 'Điện trở suất', en: 'Resistivity' }, v: '0.001–0.005 Ω·cm' },
                            { k: { vi: 'Đánh bóng', en: 'Polished' }, v: { vi: '1 mặt (SSP)', en: 'Single Side (SSP)' } },
                            { k: { vi: 'Độ dày', en: 'Thickness' }, v: '525 ± 25 µm' }
                        ]
                    },
                    {
                        name: { vi: 'FZ-Si 4" (High purity)', en: 'FZ-Si 4" (High purity)' }, img: WAFER_IMG,
                        desc: { vi: 'FZ-Si Wafer (High purity), Size: 4", Orientation: (100), N-type, Resistivity: 1–100 Ω·cm, 2-Side Polished, Thickness: 500 ± 25 µm', en: 'FZ-Si Wafer (High purity), Size: 4", Orientation: (100), N-type, Resistivity: 1–100 Ω·cm, 2-Side Polished, Thickness: 500 ± 25 µm' },
                        sku: 'DG-SW-040FZ1',
                        longDesc: { vi: 'Wafer FZ (Float Zone) cho độ tinh khiết và điện trở suất cao hơn CZ, phù hợp linh kiện công suất và cảm biến đòi hỏi nồng độ oxy thấp.', en: 'Float-Zone (FZ) wafers offer higher purity and resistivity than CZ, suited for power devices and detectors requiring low oxygen content.' },
                        specs: [
                            { k: { vi: 'Chất lượng', en: 'Quality' }, v: 'Prime' },
                            { k: { vi: 'Vật liệu', en: 'Material' }, v: 'FZ-Si' },
                            { k: { vi: 'Kích thước', en: 'Size (inch)' }, v: '4"' },
                            { k: { vi: 'Định hướng', en: 'Orientation' }, v: '(100)' },
                            { k: { vi: 'Pha tạp', en: 'Doping' }, v: 'Phosphorus (N-type)' },
                            { k: { vi: 'Điện trở suất', en: 'Resistivity' }, v: '1–100 Ω·cm' },
                            { k: { vi: 'Đánh bóng', en: 'Polished' }, v: { vi: '2 mặt (DSP)', en: 'Double Side (DSP)' } },
                            { k: { vi: 'Độ dày', en: 'Thickness' }, v: '500 ± 25 µm' }
                        ]
                    }
                ]
            },

            /* --- B. Silicon Carbide (SiC) --- */
            {
                section: { vi: '1. Silicon wafer', en: '1. Silicon wafer' },
                code: 'B',
                name: { vi: 'Silicon Carbide (SiC)', en: 'Silicon Carbide (SiC)' },
                subtitle: { vi: 'SiC Substrate – 4H / 6H Polytype', en: 'SiC Substrate – 4H / 6H Polytype' },
                summary: {
                    title: { vi: 'Tổng hợp thông số SiC', en: 'Specifications Summary of SiC Substrates' },
                    rows: [
                        { k: { vi: 'Polytype', en: 'Polytype' }, v: '4H-SiC ; 6H-SiC' },
                        { k: { vi: 'Kích thước (inch)', en: 'Size (inch)' }, v: '2" ; 3" ; 4" ; 6" (option 8")' },
                        { k: { vi: 'Loại', en: 'Type' }, v: { vi: 'N-type (Nitrogen) ; Bán cách điện – HPSI ; P-type', en: 'N-type (Nitrogen) ; Semi-Insulating – HPSI ; P-type' } },
                        { k: { vi: 'Phân hạng', en: 'Grade' }, v: 'Prime – Research/Dummy' },
                        { k: { vi: 'Định hướng', en: 'Orientation' }, v: '(0001) on-axis ; 4° off-axis' },
                        { k: { vi: 'Độ dày (µm)', en: 'Thickness (µm)' }, v: '350 ; 500' },
                        { k: { vi: 'Ứng dụng', en: 'Applications' }, v: { vi: 'Điện tử công suất, RF/MMIC, GaN-on-SiC, xe điện (EV)', en: 'Power electronics, RF/MMIC, GaN-on-SiC, EV' } }
                    ]
                },
                variants: [
                    {
                        name: { vi: 'SiC 3" HPSI Prime', en: 'SiC 3" HPSI Prime' }, img: SIC_IMG,
                        desc: { vi: 'SiC substrate 3 inch, 350 µm thickness, HPSI (Semi-Insulating) type, Prime Grade', en: 'SiC substrate 3 inch, 350 µm thickness, HPSI (Semi-Insulating) type, Prime Grade' },
                        sku: 'DG-SiC-030001',
                        specs: [
                            { k: { vi: 'Polytype', en: 'Polytype' }, v: '4H-SiC' },
                            { k: { vi: 'Loại', en: 'Type' }, v: { vi: 'Bán cách điện (HPSI)', en: 'Semi-Insulating (HPSI)' } },
                            { k: { vi: 'Kích thước', en: 'Size' }, v: '3"' },
                            { k: { vi: 'Độ dày', en: 'Thickness' }, v: '350 µm' },
                            { k: { vi: 'Phân hạng', en: 'Grade' }, v: 'Prime' }
                        ]
                    },
                    {
                        name: { vi: 'SiC 3" N-type', en: 'SiC 3" N-type' }, img: SIC_IMG,
                        desc: { vi: 'SiC substrate, 4H-SiC, N-type (Nitrogen), Size: 3", Thickness: 350 µm, Prime Grade, 1-Side Polished', en: 'SiC substrate, 4H-SiC, N-type (Nitrogen), Size: 3", Thickness: 350 µm, Prime Grade, 1-Side Polished' },
                        sku: 'DG-SiC-030002',
                        specs: [
                            { k: { vi: 'Polytype', en: 'Polytype' }, v: '4H-SiC' },
                            { k: { vi: 'Loại', en: 'Type' }, v: 'N-type (Nitrogen)' },
                            { k: { vi: 'Kích thước', en: 'Size' }, v: '3"' },
                            { k: { vi: 'Độ dày', en: 'Thickness' }, v: '350 µm' },
                            { k: { vi: 'Đánh bóng', en: 'Polished' }, v: { vi: '1 mặt', en: 'Single Side' } }
                        ]
                    },
                    {
                        name: { vi: 'SiC 4" N-type', en: 'SiC 4" N-type' }, img: SIC_IMG,
                        desc: { vi: 'SiC substrate, 4H-SiC, N-type, Off-axis 4°, Size: 4", Thickness: 500 µm, Prime Grade, 2-Side Polished', en: 'SiC substrate, 4H-SiC, N-type, Off-axis 4°, Size: 4", Thickness: 500 µm, Prime Grade, 2-Side Polished' },
                        sku: 'DG-SiC-040001',
                        specs: [
                            { k: { vi: 'Polytype', en: 'Polytype' }, v: '4H-SiC' },
                            { k: { vi: 'Loại', en: 'Type' }, v: 'N-type (Nitrogen)' },
                            { k: { vi: 'Định hướng', en: 'Orientation' }, v: 'Off-axis 4°' },
                            { k: { vi: 'Kích thước', en: 'Size' }, v: '4"' },
                            { k: { vi: 'Độ dày', en: 'Thickness' }, v: '500 µm' },
                            { k: { vi: 'Đánh bóng', en: 'Polished' }, v: { vi: '2 mặt', en: 'Double Side' } }
                        ]
                    },
                    {
                        name: { vi: 'SiC 6" N-type', en: 'SiC 6" N-type' }, img: SIC_IMG,
                        desc: { vi: 'SiC substrate, 4H-SiC, N-type, Size: 6", Thickness: 500 µm, Prime Grade', en: 'SiC substrate, 4H-SiC, N-type, Size: 6", Thickness: 500 µm, Prime Grade' },
                        sku: 'DG-SiC-060001',
                        specs: [
                            { k: { vi: 'Polytype', en: 'Polytype' }, v: '4H-SiC' },
                            { k: { vi: 'Loại', en: 'Type' }, v: 'N-type (Nitrogen)' },
                            { k: { vi: 'Kích thước', en: 'Size' }, v: '6"' },
                            { k: { vi: 'Độ dày', en: 'Thickness' }, v: '500 µm' },
                            { k: { vi: 'Phân hạng', en: 'Grade' }, v: 'Prime' }
                        ]
                    }
                ]
            },

            /* --- C. Silicon-on-Insulator (SOI) --- */
            {
                section: { vi: '1. Silicon wafer', en: '1. Silicon wafer' },
                code: 'C',
                name: { vi: 'Silicon-on-Insulator (SOI)', en: 'Silicon-on-Insulator (SOI)' },
                subtitle: { vi: 'SOI Wafer – 3 lớp (Device Si / BOX / Handle)', en: 'SOI Wafer – 3 layers (Device Si / BOX / Handle)' },
                summary: {
                    title: { vi: 'Tổng hợp thông số SOI', en: 'Specifications Summary of SOI Wafers' },
                    rows: [
                        { k: { vi: 'Cấu trúc', en: 'Structure' }, v: { vi: 'Device layer (Si) / BOX (SiO₂) / Handle wafer (Si)', en: 'Device layer (Si) / BOX (SiO₂) / Handle wafer (Si)' } },
                        { k: { vi: 'Kích thước (inch)', en: 'Size (inch)' }, v: '4" ; 6" ; 8"' },
                        { k: { vi: 'Lớp Device (µm)', en: 'Device layer (µm)' }, v: '0.05 – 10' },
                        { k: { vi: 'Lớp BOX (µm)', en: 'BOX layer (µm)' }, v: '0.1 – 3' },
                        { k: { vi: 'Công nghệ', en: 'Technology' }, v: 'SmartCut / BSOI (Bonded)' },
                        { k: { vi: 'Ứng dụng', en: 'Applications' }, v: 'RF-SOI, FD-SOI, MEMS, Photonics' }
                    ]
                },
                variants: [
                    {
                        name: { vi: 'SOI 6" – RF', en: 'SOI 6" – RF' }, img: WAFER_IMG,
                        desc: { vi: 'Silicon-On-Insulator (SOI) wafer 3 lớp cho Microelectronics & Radio Frequency. Size: 6", Device: 2 µm / BOX: 1 µm, (100), P-type', en: 'Silicon-On-Insulator (SOI) wafer, three layers for Microelectronics & Radio Frequency. Size: 6", Device: 2 µm / BOX: 1 µm, (100), P-type' },
                        sku: 'DG-SOI-060001',
                        specs: [
                            { k: { vi: 'Kích thước', en: 'Size' }, v: '6"' },
                            { k: { vi: 'Lớp Device', en: 'Device layer' }, v: '2 µm' },
                            { k: { vi: 'Lớp BOX', en: 'BOX layer' }, v: '1 µm' },
                            { k: { vi: 'Định hướng', en: 'Orientation' }, v: '(100)' },
                            { k: { vi: 'Loại', en: 'Type' }, v: 'P-type' }
                        ]
                    },
                    {
                        name: { vi: 'SOI 8" – FD-SOI', en: 'SOI 8" – FD-SOI' }, img: WAFER_IMG,
                        desc: { vi: 'SOI wafer 8-inch, FD-SOI grade, Device: 0.2 µm / BOX: 0.4 µm', en: 'SOI wafer 8-inch, FD-SOI grade, Device: 0.2 µm / BOX: 0.4 µm' },
                        sku: 'DG-SOI-080001',
                        specs: [
                            { k: { vi: 'Kích thước', en: 'Size' }, v: '8"' },
                            { k: { vi: 'Lớp Device', en: 'Device layer' }, v: '0.2 µm' },
                            { k: { vi: 'Lớp BOX', en: 'BOX layer' }, v: '0.4 µm' },
                            { k: { vi: 'Loại', en: 'Type' }, v: 'FD-SOI' }
                        ]
                    },
                    {
                        name: { vi: 'SOI 6" – MEMS', en: 'SOI 6" – MEMS' }, img: WAFER_IMG,
                        desc: { vi: 'SOI wafer 6", Device: 10 µm / BOX: 2 µm — cho MEMS / Sensors', en: 'SOI wafer 6", Device: 10 µm / BOX: 2 µm — for MEMS / Sensors' },
                        sku: 'DG-SOI-060002',
                        specs: [
                            { k: { vi: 'Kích thước', en: 'Size' }, v: '6"' },
                            { k: { vi: 'Lớp Device', en: 'Device layer' }, v: '10 µm' },
                            { k: { vi: 'Lớp BOX', en: 'BOX layer' }, v: '2 µm' },
                            { k: { vi: 'Ứng dụng', en: 'Application' }, v: 'MEMS / Sensors' }
                        ]
                    }
                ]
            },

            /* ============ 2. SAPPHIRE, AlN, GaAs, InP & OTHER SUBSTRATES ============ */

            /* --- A. Sapphire (Al2O3) --- */
            {
                section: { vi: '2. Sapphire, AlN, GaAs, InP & other substrates', en: '2. Sapphire, AlN, GaAs, InP & other substrates' },
                code: 'A',
                name: { vi: 'Sapphire (Al₂O₃)', en: 'Sapphire (Al₂O₃)' },
                summary: {
                    title: { vi: 'Tổng hợp thông số Sapphire', en: 'Specifications Summary of Sapphire' },
                    rows: [
                        { k: { vi: 'Vật liệu', en: 'Material' }, v: { vi: 'Đơn tinh thể Al₂O₃, độ tinh khiết 99.999%', en: 'Single-crystal Al₂O₃, purity 99.999%' } },
                        { k: { vi: 'Định hướng (plane)', en: 'Orientation (plane)' }, v: 'C-plane (0001) ; A-plane ; R-plane ; M-plane' },
                        { k: { vi: 'Kích thước', en: 'Size' }, v: '2" ; 4" ; 6" ; 8" (& tấm 310×310 mm)' },
                        { k: { vi: 'Độ dày (mm)', en: 'Thickness (mm)' }, v: '0.43 ; 0.65 ; 0.75 ; 1.0' },
                        { k: { vi: 'Đánh bóng', en: 'Polished' }, v: 'SSP ; DSP (epi-ready)' },
                        { k: { vi: 'Ứng dụng', en: 'Applications' }, v: { vi: 'LED, GaN epitaxy, quang học, tản nhiệt', en: 'LED, GaN epitaxy, optics, heat dissipation' } }
                    ]
                },
                variants: [
                    {
                        name: { vi: 'Sapphire wafer Ø200mm', en: 'Sapphire wafer Ø200mm' }, img: WAFER_IMG,
                        desc: { vi: 'Single crystal Al₂O₃ 99.999%, Dia 200 mm sapphire wafer, 1.0 mm / 0.75 mm thickness', en: 'Single crystal Al₂O₃ 99.999%, Dia 200 mm sapphire wafer, 1.0 mm / 0.75 mm thickness' },
                        sku: 'DG-SAP-200001',
                        specs: [
                            { k: { vi: 'Vật liệu', en: 'Material' }, v: 'Al₂O₃ 99.999%' },
                            { k: { vi: 'Đường kính', en: 'Diameter' }, v: '200 mm' },
                            { k: { vi: 'Độ dày', en: 'Thickness' }, v: '0.75 / 1.0 mm' }
                        ]
                    },
                    {
                        name: { vi: 'Sapphire Heat Dissipation 310×310', en: 'Sapphire Heat Dissipation 310×310' }, img: WAFER_IMG,
                        desc: { vi: '310 × 310 mm Sapphire Heat Dissipation Substrate', en: '310 × 310 mm Sapphire Heat Dissipation Substrate' },
                        sku: 'DG-SAP-310001',
                        specs: [
                            { k: { vi: 'Vật liệu', en: 'Material' }, v: 'Al₂O₃' },
                            { k: { vi: 'Kích thước', en: 'Size' }, v: '310 × 310 mm' },
                            { k: { vi: 'Ứng dụng', en: 'Application' }, v: { vi: 'Tản nhiệt', en: 'Heat dissipation' } }
                        ]
                    },
                    {
                        name: { vi: 'Sapphire 4" C-plane', en: 'Sapphire 4" C-plane' }, img: WAFER_IMG,
                        desc: { vi: 'Sapphire Wafer C-plane (0001), Size: 4", DSP, Thickness: 0.65 mm — for LED/GaN epi', en: 'Sapphire Wafer C-plane (0001), Size: 4", DSP, Thickness: 0.65 mm — for LED/GaN epi' },
                        sku: 'DG-SAP-040001',
                        specs: [
                            { k: { vi: 'Định hướng', en: 'Orientation' }, v: 'C-plane (0001)' },
                            { k: { vi: 'Kích thước', en: 'Size' }, v: '4"' },
                            { k: { vi: 'Đánh bóng', en: 'Polished' }, v: 'DSP' },
                            { k: { vi: 'Độ dày', en: 'Thickness' }, v: '0.65 mm' }
                        ]
                    }
                ]
            },

            /* --- B. AlN --- */
            {
                section: { vi: '2. Sapphire, AlN, GaAs, InP & other substrates', en: '2. Sapphire, AlN, GaAs, InP & other substrates' },
                code: 'B',
                name: { vi: 'AlN (Aluminum Nitride)', en: 'AlN (Aluminum Nitride)' },
                summary: {
                    title: { vi: 'Tổng hợp thông số AlN', en: 'Specifications Summary of AlN' },
                    rows: [
                        { k: { vi: 'Loại', en: 'Type' }, v: { vi: 'Đơn tinh thể AlN ; AlN ceramic', en: 'Single-crystal AlN ; AlN ceramic substrate' } },
                        { k: { vi: 'Kích thước', en: 'Size' }, v: { vi: '2" (đơn tinh thể) ; tấm ceramic theo yêu cầu', en: '2" (single crystal) ; ceramic plate on request' } },
                        { k: { vi: 'Đặc điểm', en: 'Features' }, v: { vi: 'Dẫn nhiệt cao, band gap rộng (~6.2 eV)', en: 'High thermal conductivity, wide band gap (~6.2 eV)' } },
                        { k: { vi: 'Ứng dụng', en: 'Applications' }, v: { vi: 'UV-C LED, RF/SAW, công suất, tản nhiệt', en: 'UV-C LED, RF/SAW, power, heat dissipation' } }
                    ]
                },
                variants: [
                    {
                        name: { vi: 'AlN Single Crystal 2"', en: 'AlN Single Crystal 2"' }, img: WAFER_IMG,
                        desc: { vi: 'AlN Single Crystal Substrate, Size: 2", C-plane, Epi-ready — for UV-C LED', en: 'AlN Single Crystal Substrate, Size: 2", C-plane, Epi-ready — for UV-C LED' },
                        sku: 'DG-AlN-020001',
                        specs: [
                            { k: { vi: 'Loại', en: 'Type' }, v: { vi: 'Đơn tinh thể', en: 'Single crystal' } },
                            { k: { vi: 'Kích thước', en: 'Size' }, v: '2"' },
                            { k: { vi: 'Định hướng', en: 'Orientation' }, v: 'C-plane' }
                        ]
                    },
                    {
                        name: { vi: 'AlN Ceramic Substrate', en: 'AlN Ceramic Substrate' }, img: WAFER_IMG,
                        desc: { vi: 'AlN Ceramic Substrate — tản nhiệt & đóng gói linh kiện công suất', en: 'AlN Ceramic Substrate — heat dissipation & power device packaging' },
                        sku: 'DG-AlN-CER001',
                        specs: [
                            { k: { vi: 'Loại', en: 'Type' }, v: 'Ceramic' },
                            { k: { vi: 'Ứng dụng', en: 'Application' }, v: { vi: 'Tản nhiệt / đóng gói', en: 'Heat sink / packaging' } }
                        ]
                    }
                ]
            },

            /* --- C. GaAs --- */
            {
                section: { vi: '2. Sapphire, AlN, GaAs, InP & other substrates', en: '2. Sapphire, AlN, GaAs, InP & other substrates' },
                code: 'C',
                name: { vi: 'GaAs (Gallium Arsenide)', en: 'GaAs (Gallium Arsenide)' },
                filters: ['type'],
                summary: {
                    title: { vi: 'Tổng hợp thông số GaAs', en: 'Specifications Summary of GaAs' },
                    rows: [
                        { k: { vi: 'Loại', en: 'Type' }, v: { vi: 'Bán cách điện (SI) ; Bán dẫn (N-type / P-type)', en: 'Semi-Insulating (SI) ; Semi-Conducting (N-type / P-type)' } },
                        { k: { vi: 'Định hướng', en: 'Orientation' }, v: '(100) ; (111)' },
                        { k: { vi: 'Kích thước', en: 'Size' }, v: '2" ; 3" ; 4" ; 6"' },
                        { k: { vi: 'Pha tạp', en: 'Doping' }, v: 'Undoped (SI) ; Si (N-type) ; Zn (P-type)' },
                        { k: { vi: 'Ứng dụng', en: 'Applications' }, v: { vi: 'RF/MMIC, pin mặt trời, LED, laser diode', en: 'RF/MMIC, solar cells, LED, laser diode' } }
                    ]
                },
                variants: [
                    {
                        name: { vi: 'GaAs 4" Semi-Insulating', en: 'GaAs 4" Semi-Insulating' }, img: WAFER_IMG,
                        desc: { vi: 'GaAs Wafer, Semi-Insulating, Size: 4", Orientation (100), DSP — for RF devices', en: 'GaAs Wafer, Semi-Insulating, Size: 4", Orientation (100), DSP — for RF devices' },
                        sku: 'DG-GaAs-040001',
                        specs: [
                            { k: { vi: 'Loại', en: 'Type' }, v: { vi: 'Bán cách điện (SI)', en: 'Semi-Insulating (SI)' } },
                            { k: { vi: 'Kích thước', en: 'Size' }, v: '4"' },
                            { k: { vi: 'Định hướng', en: 'Orientation' }, v: '(100)' },
                            { k: { vi: 'Đánh bóng', en: 'Polished' }, v: 'DSP' }
                        ]
                    },
                    {
                        name: { vi: 'GaAs 4" N-type', en: 'GaAs 4" N-type' }, img: WAFER_IMG,
                        desc: { vi: 'GaAs Wafer, N-type (Si-doped), Size: 4", (100) — for solar / LED', en: 'GaAs Wafer, N-type (Si-doped), Size: 4", (100) — for solar / LED' },
                        sku: 'DG-GaAs-040002',
                        specs: [
                            { k: { vi: 'Loại', en: 'Type' }, v: 'N-type (Si)' },
                            { k: { vi: 'Kích thước', en: 'Size' }, v: '4"' },
                            { k: { vi: 'Định hướng', en: 'Orientation' }, v: '(100)' }
                        ]
                    },
                    {
                        name: { vi: 'GaAs 3" P-type', en: 'GaAs 3" P-type' }, img: WAFER_IMG,
                        desc: { vi: 'GaAs Wafer, P-type (Zn-doped), Size: 3", (100)', en: 'GaAs Wafer, P-type (Zn-doped), Size: 3", (100)' },
                        sku: 'DG-GaAs-030001',
                        specs: [
                            { k: { vi: 'Loại', en: 'Type' }, v: 'P-type (Zn)' },
                            { k: { vi: 'Kích thước', en: 'Size' }, v: '3"' },
                            { k: { vi: 'Định hướng', en: 'Orientation' }, v: '(100)' }
                        ]
                    }
                ]
            },

            /* --- D. InP --- */
            {
                section: { vi: '2. Sapphire, AlN, GaAs, InP & other substrates', en: '2. Sapphire, AlN, GaAs, InP & other substrates' },
                code: 'D',
                name: { vi: 'InP (Indium Phosphide)', en: 'InP (Indium Phosphide)' },
                filters: ['type'],
                summary: {
                    title: { vi: 'Tổng hợp thông số InP', en: 'Specifications Summary of InP' },
                    rows: [
                        { k: { vi: 'Loại', en: 'Type' }, v: { vi: 'Bán cách điện (Fe-doped) ; N-type (S-doped) ; P-type (Zn-doped)', en: 'Semi-Insulating (Fe-doped) ; N-type (S-doped) ; P-type (Zn-doped)' } },
                        { k: { vi: 'Định hướng', en: 'Orientation' }, v: '(100)' },
                        { k: { vi: 'Kích thước', en: 'Size' }, v: '2" ; 3" ; 4"' },
                        { k: { vi: 'Ứng dụng', en: 'Applications' }, v: { vi: 'Photonics, laser viễn thông 1310/1550 nm, HBT/HEMT', en: 'Photonics, telecom lasers 1310/1550 nm, HBT/HEMT' } }
                    ]
                },
                variants: [
                    {
                        name: { vi: 'InP 3" Semi-Insulating', en: 'InP 3" Semi-Insulating' }, img: WAFER_IMG,
                        desc: { vi: 'InP Wafer, Semi-Insulating (Fe-doped), Size: 3", (100), epi-ready — for photonics', en: 'InP Wafer, Semi-Insulating (Fe-doped), Size: 3", (100), epi-ready — for photonics' },
                        sku: 'DG-InP-030001',
                        specs: [
                            { k: { vi: 'Loại', en: 'Type' }, v: { vi: 'Bán cách điện (Fe)', en: 'Semi-Insulating (Fe)' } },
                            { k: { vi: 'Kích thước', en: 'Size' }, v: '3"' },
                            { k: { vi: 'Định hướng', en: 'Orientation' }, v: '(100)' }
                        ]
                    },
                    {
                        name: { vi: 'InP 2" N-type', en: 'InP 2" N-type' }, img: WAFER_IMG,
                        desc: { vi: 'InP Wafer, N-type (S-doped), Size: 2", (100)', en: 'InP Wafer, N-type (S-doped), Size: 2", (100)' },
                        sku: 'DG-InP-020001',
                        specs: [
                            { k: { vi: 'Loại', en: 'Type' }, v: 'N-type (S)' },
                            { k: { vi: 'Kích thước', en: 'Size' }, v: '2"' },
                            { k: { vi: 'Định hướng', en: 'Orientation' }, v: '(100)' }
                        ]
                    },
                    {
                        name: { vi: 'InP 2" P-type', en: 'InP 2" P-type' }, img: WAFER_IMG,
                        desc: { vi: 'InP Wafer, P-type (Zn-doped), Size: 2", (100)', en: 'InP Wafer, P-type (Zn-doped), Size: 2", (100)' },
                        sku: 'DG-InP-020002',
                        specs: [
                            { k: { vi: 'Loại', en: 'Type' }, v: 'P-type (Zn)' },
                            { k: { vi: 'Kích thước', en: 'Size' }, v: '2"' },
                            { k: { vi: 'Định hướng', en: 'Orientation' }, v: '(100)' }
                        ]
                    }
                ]
            },

            /* --- E. ITO / Glass --- */
            {
                section: { vi: '2. Sapphire, AlN, GaAs, InP & other substrates', en: '2. Sapphire, AlN, GaAs, InP & other substrates' },
                code: 'E',
                name: { vi: 'ITO / Glass', en: 'ITO / Glass' },
                summary: {
                    title: { vi: 'Tổng hợp thông số ITO / Glass', en: 'Specifications Summary of ITO / Glass' },
                    rows: [
                        { k: { vi: 'Loại', en: 'Type' }, v: { vi: 'Kính phủ ITO ; kính FTO ; Quartz / Soda-lime', en: 'ITO-coated glass ; FTO glass ; Quartz / Soda-lime' } },
                        { k: { vi: 'Điện trở bề mặt (Ω/sq)', en: 'Sheet resistance (Ω/sq)' }, v: '7 ; 10 ; 15 ; 100' },
                        { k: { vi: 'Kích thước', en: 'Size' }, v: { vi: '25×25 ; 50×50 ; 100×100 mm ; theo yêu cầu', en: '25×25 ; 50×50 ; 100×100 mm ; on request' } },
                        { k: { vi: 'Độ dày kính (mm)', en: 'Glass thickness (mm)' }, v: '0.7 ; 1.1' },
                        { k: { vi: 'Ứng dụng', en: 'Applications' }, v: { vi: 'OLED, màn hình cảm ứng, pin mặt trời, quang điện', en: 'OLED, touch panel, solar cells, optoelectronics' } }
                    ]
                },
                variants: [
                    {
                        name: { vi: 'ITO Glass 10 Ω/sq', en: 'ITO Glass 10 Ω/sq' }, img: WAFER_IMG,
                        desc: { vi: 'ITO Glass, Sheet resistance 10 Ω/sq, 25×25 mm, thickness 1.1 mm', en: 'ITO Glass, Sheet resistance 10 Ω/sq, 25×25 mm, thickness 1.1 mm' },
                        sku: 'DG-ITO-250001',
                        specs: [
                            { k: { vi: 'Điện trở bề mặt', en: 'Sheet resistance' }, v: '10 Ω/sq' },
                            { k: { vi: 'Kích thước', en: 'Size' }, v: '25×25 mm' },
                            { k: { vi: 'Độ dày', en: 'Thickness' }, v: '1.1 mm' }
                        ]
                    },
                    {
                        name: { vi: 'ITO Glass 7 Ω/sq', en: 'ITO Glass 7 Ω/sq' }, img: WAFER_IMG,
                        desc: { vi: 'ITO Glass, 7 Ω/sq, 50×50 mm — for OLED / touch panel', en: 'ITO Glass, 7 Ω/sq, 50×50 mm — for OLED / touch panel' },
                        sku: 'DG-ITO-500001',
                        specs: [
                            { k: { vi: 'Điện trở bề mặt', en: 'Sheet resistance' }, v: '7 Ω/sq' },
                            { k: { vi: 'Kích thước', en: 'Size' }, v: '50×50 mm' }
                        ]
                    },
                    {
                        name: { vi: 'FTO Glass 15 Ω/sq', en: 'FTO Glass 15 Ω/sq' }, img: WAFER_IMG,
                        desc: { vi: 'FTO Glass, 15 Ω/sq — for solar cells', en: 'FTO Glass, 15 Ω/sq — for solar cells' },
                        sku: 'DG-FTO-150001',
                        specs: [
                            { k: { vi: 'Loại', en: 'Type' }, v: 'FTO' },
                            { k: { vi: 'Điện trở bề mặt', en: 'Sheet resistance' }, v: '15 Ω/sq' },
                            { k: { vi: 'Ứng dụng', en: 'Application' }, v: { vi: 'Pin mặt trời', en: 'Solar cells' } }
                        ]
                    }
                ]
            }
        ]
    },

    '2': {
        accent: '#16a34a',
        badge: { vi: 'Nhóm 2', en: 'Group 2' },
        title: { vi: 'Vật liệu & thiết bị cho năng lượng tái tạo', en: 'Materials & Equipment for Renewable Energy' },
        items: [

            /* --- A. Bia phún xạ (cấu hình theo vật liệu/kích thước/độ tinh khiết) --- */
            {
                code: 'A',
                img: './assets/images/biaphongxa.png',
                name: { vi: 'Bia phún xạ (Sputtering targets)', en: 'Sputtering Targets' },
                subtitle: { vi: 'Bia PVD cho lắng đọng màng mỏng – kim loại, oxide, hợp kim', en: 'PVD targets for thin-film deposition – metals, oxides, alloys' },
                apps: { vi: 'Lắng đọng màng mỏng PVD, pin mặt trời, lớp dẫn điện, lớp phủ quang học', en: 'PVD thin-film deposition, solar cells, conductive layers, optical coatings' },
                filters: ['material', 'size', 'purity'],
                layout: 'config',
                summary: {
                    title: { vi: 'Tổng hợp thông số Bia phún xạ', en: 'Specifications Summary of Sputtering Targets' },
                    rows: [
                        { k: { vi: 'Vật liệu', en: 'Material' }, v: 'Ti, Cu, Al, Au, Ag, Cr, Ni, Mo, W, Zn, ITO, ZnO, TiO₂, SiO₂…' },
                        { k: { vi: 'Độ tinh khiết', en: 'Purity' }, v: '99.5% ; 99.9% ; 99.99% ; 99.999%' },
                        { k: { vi: 'Đường kính', en: 'Diameter (Size)' }, v: '2" ; 3" ; 4" ; 6" (& bia chữ nhật)' },
                        { k: { vi: 'Độ dày', en: 'Thickness' }, v: '3 mm ; 5 mm ; 6 mm' },
                        { k: { vi: 'Hình dạng', en: 'Shape' }, v: { vi: 'Tròn / Chữ nhật', en: 'Round / Rectangular' } },
                        { k: { vi: 'Đế gắn (Backing)', en: 'Backing plate' }, v: { vi: 'Cu / In (tuỳ chọn)', en: 'Cu / In (optional)' } }
                    ]
                },
                variants: [
                    { name: 'Ti target Ø2" 99.99%', img: './assets/images/biaphongxa_sanpham.png', sku: 'DG-ST-TI2099', desc: { vi: 'Bia Titanium (Ti), Ø2", 99.99%, dày 3 mm, dạng tròn', en: 'Titanium (Ti) target, Ø2", 99.99%, 3 mm, round' },
                      specs: [ { k:{vi:'Vật liệu',en:'Material'},v:'Ti (Titanium)'}, { k:{vi:'Độ tinh khiết',en:'Purity'},v:'99.99%'}, { k:{vi:'Kích thước',en:'Size'},v:'2"'}, { k:{vi:'Độ dày',en:'Thickness'},v:'3 mm'}, { k:{vi:'Hình dạng',en:'Shape'},v:{vi:'Tròn',en:'Round'}} ] },
                    { name: 'Ti target Ø3" 99.99%', img: './assets/images/biaphongxa_sanpham.png', sku: 'DG-ST-TI3099', desc: { vi: 'Bia Titanium (Ti), Ø3", 99.99%, dày 5 mm', en: 'Titanium (Ti) target, Ø3", 99.99%, 5 mm' },
                      specs: [ { k:{vi:'Vật liệu',en:'Material'},v:'Ti (Titanium)'}, { k:{vi:'Độ tinh khiết',en:'Purity'},v:'99.99%'}, { k:{vi:'Kích thước',en:'Size'},v:'3"'}, { k:{vi:'Độ dày',en:'Thickness'},v:'5 mm'}, { k:{vi:'Hình dạng',en:'Shape'},v:{vi:'Tròn',en:'Round'}} ] },
                    { name: 'Cu target Ø2" 99.99%', img: './assets/images/biaphongxa_sanpham.png', sku: 'DG-ST-CU2099', desc: { vi: 'Bia Đồng (Cu), Ø2", 99.99%, dày 3 mm', en: 'Copper (Cu) target, Ø2", 99.99%, 3 mm' },
                      specs: [ { k:{vi:'Vật liệu',en:'Material'},v:'Cu (Copper)'}, { k:{vi:'Độ tinh khiết',en:'Purity'},v:'99.99%'}, { k:{vi:'Kích thước',en:'Size'},v:'2"'}, { k:{vi:'Độ dày',en:'Thickness'},v:'3 mm'}, { k:{vi:'Hình dạng',en:'Shape'},v:{vi:'Tròn',en:'Round'}} ] },
                    { name: 'Cu target Ø3" 99.99%', img: './assets/images/biaphongxa_sanpham.png', sku: 'DG-ST-CU3099', desc: { vi: 'Bia Đồng (Cu), Ø3", 99.99%, dày 5 mm', en: 'Copper (Cu) target, Ø3", 99.99%, 5 mm' },
                      specs: [ { k:{vi:'Vật liệu',en:'Material'},v:'Cu (Copper)'}, { k:{vi:'Độ tinh khiết',en:'Purity'},v:'99.99%'}, { k:{vi:'Kích thước',en:'Size'},v:'3"'}, { k:{vi:'Độ dày',en:'Thickness'},v:'5 mm'}, { k:{vi:'Hình dạng',en:'Shape'},v:{vi:'Tròn',en:'Round'}} ] },
                    { name: 'Al target Ø2" 99.999%', img: './assets/images/biaphongxa_sanpham.png', sku: 'DG-ST-AL2059', desc: { vi: 'Bia Nhôm (Al), Ø2", 99.999%, dày 3 mm', en: 'Aluminum (Al) target, Ø2", 99.999%, 3 mm' },
                      specs: [ { k:{vi:'Vật liệu',en:'Material'},v:'Al (Aluminum)'}, { k:{vi:'Độ tinh khiết',en:'Purity'},v:'99.999%'}, { k:{vi:'Kích thước',en:'Size'},v:'2"'}, { k:{vi:'Độ dày',en:'Thickness'},v:'3 mm'}, { k:{vi:'Hình dạng',en:'Shape'},v:{vi:'Tròn',en:'Round'}} ] },
                    { name: 'Au target Ø2" 99.99%', img: './assets/images/biaphongxa_sanpham.png', sku: 'DG-ST-AU2099', desc: { vi: 'Bia Vàng (Au), Ø2", 99.99%, dày 1 mm', en: 'Gold (Au) target, Ø2", 99.99%, 1 mm' },
                      specs: [ { k:{vi:'Vật liệu',en:'Material'},v:'Au (Gold)'}, { k:{vi:'Độ tinh khiết',en:'Purity'},v:'99.99%'}, { k:{vi:'Kích thước',en:'Size'},v:'2"'}, { k:{vi:'Độ dày',en:'Thickness'},v:'1 mm'}, { k:{vi:'Hình dạng',en:'Shape'},v:{vi:'Tròn',en:'Round'}} ] },
                    { name: 'Ag target Ø2" 99.99%', img: './assets/images/biaphongxa_sanpham.png', sku: 'DG-ST-AG2099', desc: { vi: 'Bia Bạc (Ag), Ø2", 99.99%, dày 3 mm', en: 'Silver (Ag) target, Ø2", 99.99%, 3 mm' },
                      specs: [ { k:{vi:'Vật liệu',en:'Material'},v:'Ag (Silver)'}, { k:{vi:'Độ tinh khiết',en:'Purity'},v:'99.99%'}, { k:{vi:'Kích thước',en:'Size'},v:'2"'}, { k:{vi:'Độ dày',en:'Thickness'},v:'3 mm'}, { k:{vi:'Hình dạng',en:'Shape'},v:{vi:'Tròn',en:'Round'}} ] },
                    { name: 'Cr target Ø2" 99.95%', img: './assets/images/biaphongxa_sanpham.png', sku: 'DG-ST-CR2095', desc: { vi: 'Bia Crom (Cr), Ø2", 99.95%, dày 3 mm', en: 'Chromium (Cr) target, Ø2", 99.95%, 3 mm' },
                      specs: [ { k:{vi:'Vật liệu',en:'Material'},v:'Cr (Chromium)'}, { k:{vi:'Độ tinh khiết',en:'Purity'},v:'99.95%'}, { k:{vi:'Kích thước',en:'Size'},v:'2"'}, { k:{vi:'Độ dày',en:'Thickness'},v:'3 mm'}, { k:{vi:'Hình dạng',en:'Shape'},v:{vi:'Tròn',en:'Round'}} ] },
                    { name: 'Mo target Ø2" 99.95%', img: './assets/images/biaphongxa_sanpham.png', sku: 'DG-ST-MO2095', desc: { vi: 'Bia Molypden (Mo), Ø2", 99.95%, dày 3 mm', en: 'Molybdenum (Mo) target, Ø2", 99.95%, 3 mm' },
                      specs: [ { k:{vi:'Vật liệu',en:'Material'},v:'Mo (Molybdenum)'}, { k:{vi:'Độ tinh khiết',en:'Purity'},v:'99.95%'}, { k:{vi:'Kích thước',en:'Size'},v:'2"'}, { k:{vi:'Độ dày',en:'Thickness'},v:'3 mm'}, { k:{vi:'Hình dạng',en:'Shape'},v:{vi:'Tròn',en:'Round'}} ] },
                    { name: 'ITO target Ø3" 99.99%', img: './assets/images/biaphongxa_sanpham.png', sku: 'DG-ST-ITO3099', desc: { vi: 'Bia ITO (In₂O₃:SnO₂ 90:10), Ø3", 99.99%, dày 5 mm', en: 'ITO target (In₂O₃:SnO₂ 90:10), Ø3", 99.99%, 5 mm' },
                      specs: [ { k:{vi:'Vật liệu',en:'Material'},v:'ITO'}, { k:{vi:'Độ tinh khiết',en:'Purity'},v:'99.99%'}, { k:{vi:'Kích thước',en:'Size'},v:'3"'}, { k:{vi:'Độ dày',en:'Thickness'},v:'5 mm'}, { k:{vi:'Hình dạng',en:'Shape'},v:{vi:'Tròn',en:'Round'}} ] },
                    { name: 'ZnO target Ø2" 99.99%', img: './assets/images/biaphongxa_sanpham.png', sku: 'DG-ST-ZNO2099', desc: { vi: 'Bia ZnO, Ø2", 99.99%, dày 3 mm', en: 'ZnO target, Ø2", 99.99%, 3 mm' },
                      specs: [ { k:{vi:'Vật liệu',en:'Material'},v:'ZnO'}, { k:{vi:'Độ tinh khiết',en:'Purity'},v:'99.99%'}, { k:{vi:'Kích thước',en:'Size'},v:'2"'}, { k:{vi:'Độ dày',en:'Thickness'},v:'3 mm'}, { k:{vi:'Hình dạng',en:'Shape'},v:{vi:'Tròn',en:'Round'}} ] }
                ]
            },

            /* --- B. Bình phản ứng xúc tác (card) --- */
            {
                code: 'B',
                img: './assets/images/anhdaidien_binhphanung.png',
                name: { vi: 'Bình phản ứng xúc tác chuyển hóa năng lượng', en: 'Reactors for Catalytic Energy Conversion' },
                apps: { vi: 'Chuyển hóa năng lượng, xúc tác, CH₄ oxidation, khử CO₂, tách nước', en: 'Energy conversion, catalysis, CH₄ oxidation, CO₂ reduction, water splitting' },
                layout: 'cards',
                summary: {
                    title: { vi: 'Tổng hợp thông số Bình phản ứng', en: 'Specifications Summary of Reactors' },
                    rows: [
                        { k: { vi: 'Loại', en: 'Type' }, v: { vi: 'Tầng cố định / Tầng sôi / Quang xúc tác / Điện hoá', en: 'Fixed-bed / Fluidized-bed / Photocatalytic / Electrochemical' } },
                        { k: { vi: 'Thể tích', en: 'Volume' }, v: '50 – 500 mL' },
                        { k: { vi: 'Nhiệt độ tối đa', en: 'Max temperature' }, v: '≤ 600 °C' },
                        { k: { vi: 'Áp suất tối đa', en: 'Max pressure' }, v: '≤ 50 bar' },
                        { k: { vi: 'Vật liệu', en: 'Material' }, v: 'SS316 / Thạch anh' }
                    ]
                },
                variants: [
                    { name: { vi: 'Bình phản ứng tầng cố định', en: 'Fixed-bed reactor' }, img: './assets/images/binhphanungtangcodinh.png', sku: 'DG-RX-FB100', desc: { vi: 'Bình phản ứng tầng cố định cho xúc tác dị thể.', en: 'Fixed-bed reactor for heterogeneous catalysis.' },
                      specs: [ { k:{vi:'Loại',en:'Type'},v:{vi:'Tầng cố định',en:'Fixed-bed'}}, { k:{vi:'Thể tích',en:'Volume'},v:'100 mL'}, { k:{vi:'Nhiệt độ',en:'Max temp'},v:'600 °C'}, { k:{vi:'Áp suất',en:'Max pressure'},v:'50 bar'}, { k:{vi:'Vật liệu',en:'Material'},v:'SS316'} ] },
                    { name: { vi: 'Bình phản ứng quang xúc tác', en: 'Photocatalytic reactor' }, img: './assets/images/binhphanungquangxuctac.png', sku: 'DG-RX-PH250', desc: { vi: 'Bình thạch anh có nguồn UV cho phản ứng quang xúc tác.', en: 'Quartz reactor with UV source for photocatalysis.' },
                      specs: [ { k:{vi:'Loại',en:'Type'},v:{vi:'Quang xúc tác',en:'Photocatalytic'}}, { k:{vi:'Thể tích',en:'Volume'},v:'250 mL'}, { k:{vi:'Nguồn sáng',en:'Light source'},v:'UV 365 nm'}, { k:{vi:'Vật liệu',en:'Material'},v:{vi:'Thạch anh',en:'Quartz'}} ] },
                    { name: { vi: 'Tế bào điện hoá khử CO₂', en: 'Electrochemical CO₂ cell' }, img: './assets/images/tebaodienhoakhuco2.png', sku: 'DG-RX-EC050', desc: { vi: 'H-cell 3 điện cực cho khử CO₂ / tách nước.', en: 'Three-electrode H-cell for CO₂ reduction / water splitting.' },
                      specs: [ { k:{vi:'Loại',en:'Type'},v:{vi:'Điện hoá (H-cell)',en:'Electrochemical (H-cell)'}}, { k:{vi:'Thể tích',en:'Volume'},v:'50 mL'}, { k:{vi:'Điện cực',en:'Electrodes'},v:'3-electrode'}, { k:{vi:'Vật liệu',en:'Material'},v:{vi:'Thuỷ tinh',en:'Glass'}} ] }
                ]
            }
        ]
    },
    '3': {
        accent: '#0891b2',
        badge: { vi: 'Nhóm 3', en: 'Group 3' },
        title: { vi: 'Thiết bị phòng sạch & phòng thí nghiệm công nghệ cao', en: 'Cleanroom & Hi-Tech Laboratory Equipment' },
        items: [

            /* --- A. Thiết bị gia nhiệt / tổng hợp nano (card) --- */
            {
                code: 'A',
                img: './assets/images/banner_thietbigianhiet.png',
                name: { vi: 'Thiết bị gia nhiệt & tổng hợp vật liệu nano', en: 'Heating Equipment & Nanomaterial Synthesis' },
                apps: { vi: 'Nung kết, xử lý nhiệt, tổng hợp graphene/CNT, vật liệu nano, ủ wafer', en: 'Sintering, heat treatment, graphene/CNT growth, nanomaterials, wafer annealing' },
                layout: 'cards',
                summary: {
                    title: { vi: 'Tổng hợp thông số thiết bị gia nhiệt', en: 'Specifications Summary' },
                    rows: [
                        { k: { vi: 'Loại', en: 'Type' }, v: { vi: 'Máy khuấy từ / Lò nung / Hệ CVD / Autoclave thuỷ nhiệt', en: 'Magnetic stirrer / Muffle furnace / CVD / Hydrothermal autoclave' } },
                        { k: { vi: 'Nhiệt độ tối đa', en: 'Max temperature' }, v: '200 – 1400 °C' },
                        { k: { vi: 'Buồng / Ống', en: 'Chamber / Tube' }, v: { vi: 'Theo model', en: 'Model dependent' } }
                    ]
                },
                variants: [
                    { name: { vi: 'Máy khuấy từ gia nhiệt', en: 'Magnetic hotplate stirrer' }, img: './assets/images/maykhuaytugianhiet.png', sku: 'DG-HT-MS340', desc: { vi: 'Máy khuấy từ có gia nhiệt cho phòng thí nghiệm.', en: 'Laboratory magnetic hotplate stirrer.' },
                      specs: [ { k:{vi:'Loại',en:'Type'},v:{vi:'Máy khuấy từ gia nhiệt',en:'Magnetic hotplate stirrer'}}, { k:{vi:'Nhiệt độ',en:'Max temp'},v:'340 °C'}, { k:{vi:'Tốc độ khuấy',en:'Stir speed'},v:'100–1500 rpm'}, { k:{vi:'Dung tích',en:'Capacity'},v:'≤ 20 L'} ] },
                    { name: { vi: 'Lò nung 1400 °C', en: 'Muffle furnace 1400 °C' }, img: './assets/images/lonung1400.png', sku: 'DG-HT-MF1400', desc: { vi: 'Lò nung buồng cho nung kết / xử lý nhiệt.', en: 'Box muffle furnace for sintering / heat treatment.' },
                      specs: [ { k:{vi:'Loại',en:'Type'},v:{vi:'Lò nung',en:'Muffle furnace'}}, { k:{vi:'Nhiệt độ',en:'Max temp'},v:'1400 °C'}, { k:{vi:'Buồng',en:'Chamber'},v:'7.2 L'} ] },
                    { name: { vi: 'Hệ thống CVD', en: 'CVD system' }, img: './assets/images/hethongCVD.png', sku: 'DG-HT-CVD01', desc: { vi: 'Hệ CVD tổng hợp graphene / CNT.', en: 'CVD system for graphene / CNT synthesis.' },
                      specs: [ { k:{vi:'Loại',en:'Type'},v:'CVD'}, { k:{vi:'Nhiệt độ',en:'Max temp'},v:'1100 °C'}, { k:{vi:'Khí',en:'Gas lines'},v:'CH₄ / H₂ / Ar'} ] },
                    { name: { vi: 'Autoclave thuỷ nhiệt 100 mL', en: 'Hydrothermal autoclave 100 mL' }, img: './assets/images/autoclave.png', sku: 'DG-HT-AC100', desc: { vi: 'Bình thuỷ nhiệt lót PTFE cho tổng hợp nano.', en: 'PTFE-lined hydrothermal autoclave for nano synthesis.' },
                      specs: [ { k:{vi:'Loại',en:'Type'},v:{vi:'Autoclave thuỷ nhiệt',en:'Hydrothermal autoclave'}}, { k:{vi:'Thể tích',en:'Volume'},v:'100 mL'}, { k:{vi:'Nhiệt độ',en:'Max temp'},v:'200 °C'}, { k:{vi:'Lót',en:'Lining'},v:'PTFE'} ] }
                ]
            },

            /* --- B. Dụng cụ thuỷ tinh (cấu hình theo loại/thể tích) --- */
            {
                code: 'B',
                img: './assets/images/banner_dungcuthuytinhphongthinghiem.png',
                name: { vi: 'Dụng cụ thuỷ tinh phòng thí nghiệm', en: 'Laboratory Glassware' },
                subtitle: { vi: 'Borosilicate 3.3 – chịu nhiệt, kháng hoá chất', en: 'Borosilicate 3.3 – heat & chemical resistant' },
                apps: { vi: 'Thí nghiệm hoá học, pha chế, đo lường, tổng hợp vật liệu', en: 'Chemistry experiments, preparation, measurement, material synthesis' },
                filters: ['type', 'volume'],
                layout: 'config',
                summary: {
                    title: { vi: 'Tổng hợp thông số Dụng cụ thuỷ tinh', en: 'Specifications Summary of Glassware' },
                    rows: [
                        { k: { vi: 'Loại', en: 'Type' }, v: { vi: 'Cốc / Bình tam giác / Bình định mức / Bình cầu / Ống đong', en: 'Beaker / Erlenmeyer / Volumetric / Round-bottom / Cylinder' } },
                        { k: { vi: 'Thể tích', en: 'Volume' }, v: '50 – 2000 mL' },
                        { k: { vi: 'Vật liệu', en: 'Material' }, v: 'Borosilicate 3.3' }
                    ]
                },
                variants: [
                    { name: { vi: 'Cốc 250 mL', en: 'Beaker 250 mL' }, img: './assets/images/coc250ml.png', sku: 'DG-GL-BK250', desc: { vi: 'Cốc thuỷ tinh borosilicate có mỏ, 250 mL', en: 'Borosilicate beaker, 250 mL' },
                      specs: [ { k:{vi:'Loại',en:'Type'},v:{vi:'Cốc',en:'Beaker'}}, { k:{vi:'Thể tích',en:'Volume'},v:'250 mL'}, { k:{vi:'Vật liệu',en:'Material'},v:'Borosilicate 3.3'} ] },
                    { name: { vi: 'Cốc 500 mL', en: 'Beaker 500 mL' }, img: './assets/images/coc500ml.png', sku: 'DG-GL-BK500', desc: { vi: 'Cốc thuỷ tinh borosilicate có mỏ, 500 mL', en: 'Borosilicate beaker, 500 mL' },
                      specs: [ { k:{vi:'Loại',en:'Type'},v:{vi:'Cốc',en:'Beaker'}}, { k:{vi:'Thể tích',en:'Volume'},v:'500 mL'}, { k:{vi:'Vật liệu',en:'Material'},v:'Borosilicate 3.3'} ] },
                    { name: { vi: 'Cốc 1000 mL', en: 'Beaker 1000 mL' }, img: './assets/images/coc1000ml.png', sku: 'DG-GL-BK1000', desc: { vi: 'Cốc thuỷ tinh borosilicate có mỏ, 1000 mL', en: 'Borosilicate beaker, 1000 mL' },
                      specs: [ { k:{vi:'Loại',en:'Type'},v:{vi:'Cốc',en:'Beaker'}}, { k:{vi:'Thể tích',en:'Volume'},v:'1000 mL'}, { k:{vi:'Vật liệu',en:'Material'},v:'Borosilicate 3.3'} ] },
                    { name: { vi: 'Bình tam giác 250 mL', en: 'Erlenmeyer 250 mL' }, img: './assets/images/binhtamgiac250ml.png', sku: 'DG-GL-EF250', desc: { vi: 'Bình tam giác (Erlenmeyer) 250 mL', en: 'Erlenmeyer flask 250 mL' },
                      specs: [ { k:{vi:'Loại',en:'Type'},v:{vi:'Bình tam giác',en:'Erlenmeyer'}}, { k:{vi:'Thể tích',en:'Volume'},v:'250 mL'}, { k:{vi:'Vật liệu',en:'Material'},v:'Borosilicate 3.3'} ] },
                    { name: { vi: 'Bình tam giác 500 mL', en: 'Erlenmeyer 500 mL' }, img: './assets/images/binhtamgiac500ml.png', sku: 'DG-GL-EF500', desc: { vi: 'Bình tam giác (Erlenmeyer) 500 mL', en: 'Erlenmeyer flask 500 mL' },
                      specs: [ { k:{vi:'Loại',en:'Type'},v:{vi:'Bình tam giác',en:'Erlenmeyer'}}, { k:{vi:'Thể tích',en:'Volume'},v:'500 mL'}, { k:{vi:'Vật liệu',en:'Material'},v:'Borosilicate 3.3'} ] },
                    { name: { vi: 'Bình định mức 100 mL', en: 'Volumetric flask 100 mL' }, img: './assets/images/binhdinhmuc100ml.png', sku: 'DG-GL-VF100', desc: { vi: 'Bình định mức class A, 100 mL', en: 'Class A volumetric flask, 100 mL' },
                      specs: [ { k:{vi:'Loại',en:'Type'},v:{vi:'Bình định mức',en:'Volumetric'}}, { k:{vi:'Thể tích',en:'Volume'},v:'100 mL'}, { k:{vi:'Cấp',en:'Class'},v:'A'} ] },
                    { name: { vi: 'Bình cầu đáy tròn 250 mL', en: 'Round-bottom flask 250 mL' }, img: './assets/images/binhcaudaytron250ml.png', sku: 'DG-GL-RB250', desc: { vi: 'Bình cầu đáy tròn cổ nhám 24/29, 250 mL', en: 'Round-bottom flask 24/29 joint, 250 mL' },
                      specs: [ { k:{vi:'Loại',en:'Type'},v:{vi:'Bình cầu',en:'Round-bottom'}}, { k:{vi:'Thể tích',en:'Volume'},v:'250 mL'}, { k:{vi:'Cổ nhám',en:'Joint'},v:'24/29'} ] },
                    { name: { vi: 'Ống đong 100 mL', en: 'Graduated cylinder 100 mL' }, img: './assets/images/ongdong100ml.png', sku: 'DG-GL-CY100', desc: { vi: 'Ống đong chia vạch, 100 mL', en: 'Graduated cylinder, 100 mL' },
                      specs: [ { k:{vi:'Loại',en:'Type'},v:{vi:'Ống đong',en:'Cylinder'}}, { k:{vi:'Thể tích',en:'Volume'},v:'100 mL'}, { k:{vi:'Cấp',en:'Class'},v:'B'} ] }
                ]
            },

            /* --- C. Trang thiết bị phòng sạch (card) --- */
            {
                code: 'C',
                name: { vi: 'Trang thiết bị phòng sạch', en: 'Cleanroom Consumables & Gear' },
                apps: { vi: 'Phòng sạch bán dẫn, lab vi điện tử, kiểm soát nhiễm bẩn', en: 'Semiconductor cleanrooms, microelectronics labs, contamination control' },
                layout: 'cards',
                summary: {
                    title: { vi: 'Tổng hợp vật tư phòng sạch', en: 'Cleanroom Consumables Summary' },
                    rows: [
                        { k: { vi: 'Sản phẩm', en: 'Items' }, v: { vi: 'Găng tay, bộ áo liền (bunny suit), khẩu trang, khăn lau, bao giày', en: 'Gloves, bunny suits, face masks, wipes, shoe covers' } },
                        { k: { vi: 'Cấp độ sạch', en: 'Cleanliness class' }, v: 'ISO 4 – ISO 7 (Class 10 – 10,000)' }
                    ]
                },
                variants: [
                    { name: { vi: 'Găng tay nitrile phòng sạch', en: 'Cleanroom nitrile gloves' }, img: './assets/images/gangtaynitrile.png', sku: 'DG-CR-GL100', desc: { vi: 'Găng tay nitrile không bột, Class 100.', en: 'Powder-free nitrile gloves, Class 100.' },
                      specs: [ { k:{vi:'Loại',en:'Type'},v:{vi:'Găng tay nitrile',en:'Nitrile gloves'}}, { k:{vi:'Cấp',en:'Class'},v:'ISO 5 (Class 100)'}, { k:{vi:'Cỡ',en:'Size'},v:'S / M / L'} ] },
                    { name: { vi: 'Bộ áo liền thân (bunny suit)', en: 'Bunny suit (coverall)' }, img: './assets/images/bunnysuit.png', sku: 'DG-CR-BS001', desc: { vi: 'Bộ áo liền thân chống tĩnh điện cho phòng sạch.', en: 'Anti-static cleanroom coverall.' },
                      specs: [ { k:{vi:'Loại',en:'Type'},v:{vi:'Áo liền thân',en:'Coverall'}}, { k:{vi:'Cấp',en:'Class'},v:'ISO 4'}, { k:{vi:'Cỡ',en:'Size'},v:'M / L / XL'} ] },
                    { name: { vi: 'Khẩu trang phòng sạch', en: 'Cleanroom face mask' }, img: './assets/images/khautrangphongsach.png', sku: 'DG-CR-FM001', desc: { vi: 'Khẩu trang ít xơ sợi cho phòng sạch.', en: 'Low-lint cleanroom face mask.' },
                      specs: [ { k:{vi:'Loại',en:'Type'},v:{vi:'Khẩu trang',en:'Face mask'}}, { k:{vi:'Cấp',en:'Class'},v:'ISO 6'} ] },
                    { name: { vi: 'Khăn lau phòng sạch', en: 'Cleanroom wipes' }, img: './assets/images/khanlauphongsach.png', sku: 'DG-CR-WP009', desc: { vi: 'Khăn lau polyester 9"×9" ít xơ sợi.', en: 'Low-lint polyester wipes 9"×9".' },
                      specs: [ { k:{vi:'Loại',en:'Type'},v:{vi:'Khăn lau',en:'Wipes'}}, { k:{vi:'Kích thước',en:'Size'},v:'9"×9"'}, { k:{vi:'Vật liệu',en:'Material'},v:'Polyester'} ] }
                ]
            }
        ]
    },
    '4': {
        accent: '#9333ea',
        badge: { vi: 'Nhóm 4', en: 'Group 4' },
        title: { vi: 'Hóa chất & vật tư cho ngành công nghệ tiên tiến', en: 'Chemicals & Supplies for Advanced Technology' },
        items: [

            /* --- A. Hoá chất tổng hợp nano & bán dẫn (card) --- */
            {
                code: 'A',
                name: { vi: 'Hoá chất tổng hợp vật liệu nano & bán dẫn', en: 'Chemicals for Nano & Semiconductor Synthesis' },
                apps: { vi: 'Tổng hợp vật liệu nano, mực in điện tử, pin, cảm biến, R&D', en: 'Nanomaterial synthesis, electronic inks, batteries, sensors, R&D' },
                layout: 'cards',
                summary: {
                    title: { vi: 'Tổng hợp danh mục hoá chất nano', en: 'Nano Materials Summary' },
                    rows: [
                        { k: { vi: 'Danh mục', en: 'Categories' }, v: { vi: 'Tiền chất, nano kim loại, vật liệu carbon, chấm lượng tử', en: 'Precursors, metal nanomaterials, carbon materials, quantum dots' } },
                        { k: { vi: 'Độ tinh khiết', en: 'Purity' }, v: '99% – 99.999%' },
                        { k: { vi: 'Quy cách', en: 'Packaging' }, v: { vi: 'Theo gram / mL', en: 'By gram / mL' } }
                    ]
                },
                variants: [
                    { name: { vi: 'Graphene oxide (phân tán)', en: 'Graphene oxide dispersion' }, img: './assets/images/prod-g4.jpg', sku: 'DG-CH-GO001', desc: { vi: 'Dung dịch graphene oxide 4 mg/mL trong nước.', en: 'Graphene oxide dispersion 4 mg/mL in water.' },
                      specs: [ { k:{vi:'Loại',en:'Type'},v:'Graphene oxide'}, { k:{vi:'Nồng độ',en:'Concentration'},v:'4 mg/mL'}, { k:{vi:'Quy cách',en:'Packaging'},v:'100 mL'} ] },
                    { name: { vi: 'Ống nano carbon đa lớp (MWCNT)', en: 'MWCNT' }, img: './assets/images/prod-g4.jpg', sku: 'DG-CH-CNT01', desc: { vi: 'Ống nano carbon đa lớp, >95%.', en: 'Multi-wall carbon nanotubes, >95%.' },
                      specs: [ { k:{vi:'Loại',en:'Type'},v:'MWCNT'}, { k:{vi:'Độ tinh khiết',en:'Purity'},v:'>95%'}, { k:{vi:'Đường kính',en:'Diameter'},v:'10–20 nm'} ] },
                    { name: { vi: 'Nano vàng 20 nm', en: 'Gold nanoparticles 20 nm' }, img: './assets/images/prod-g4.jpg', sku: 'DG-CH-AUNP20', desc: { vi: 'Keo nano vàng 20 nm trong nước.', en: 'Gold nanoparticle colloid, 20 nm in water.' },
                      specs: [ { k:{vi:'Loại',en:'Type'},v:{vi:'Nano vàng',en:'Au nanoparticles'}}, { k:{vi:'Kích thước',en:'Size'},v:'20 nm'}, { k:{vi:'Quy cách',en:'Packaging'},v:'25 mL'} ] },
                    { name: { vi: 'Bột nano TiO₂', en: 'TiO₂ nanopowder' }, img: './assets/images/prod-g4.jpg', sku: 'DG-CH-TIO2NP', desc: { vi: 'Bột nano TiO₂ anatase 20 nm, 99.9%.', en: 'TiO₂ anatase nanopowder 20 nm, 99.9%.' },
                      specs: [ { k:{vi:'Loại',en:'Type'},v:'TiO₂ (anatase)'}, { k:{vi:'Độ tinh khiết',en:'Purity'},v:'99.9%'}, { k:{vi:'Kích thước',en:'Size'},v:'20 nm'} ] }
                ]
            },

            /* --- B. Hoá chất sản xuất chip (card) --- */
            {
                code: 'B',
                name: { vi: 'Hoá chất sản xuất chip', en: 'Chip Fabrication Chemicals' },
                subtitle: { vi: 'Photoresist, developer, etchant, CMP slurry, dung môi', en: 'Photoresist, developer, etchant, CMP slurry, solvents' },
                apps: { vi: 'Quang khắc, ăn mòn, đánh bóng CMP, làm sạch wafer trong sản xuất chip', en: 'Lithography, etching, CMP polishing, wafer cleaning in chip fabrication' },
                layout: 'cards',
                summary: {
                    title: { vi: 'Tổng hợp hoá chất fab', en: 'Fab Chemicals Summary' },
                    rows: [
                        { k: { vi: 'Danh mục', en: 'Categories' }, v: { vi: 'Photoresist, developer, etchant, CMP slurry, dung môi', en: 'Photoresist, developer, etchant, CMP slurry, solvents' } },
                        { k: { vi: 'Cấp', en: 'Grade' }, v: { vi: 'Cấp bán dẫn / điện tử (EL)', en: 'Semiconductor / Electronic grade (EL)' } }
                    ]
                },
                variants: [
                    { name: { vi: 'Photoresist dương', en: 'Positive photoresist' }, img: './assets/images/prod-g4.jpg', sku: 'DG-FB-PRP01', desc: { vi: 'Photoresist dương cho quang khắc UV.', en: 'Positive-tone photoresist for UV lithography.' },
                      specs: [ { k:{vi:'Loại',en:'Type'},v:{vi:'Photoresist (dương)',en:'Photoresist (positive)'}}, { k:{vi:'Cấp',en:'Grade'},v:{vi:'Bán dẫn',en:'Semiconductor'}}, { k:{vi:'Quy cách',en:'Packaging'},v:'500 mL'} ] },
                    { name: { vi: 'Developer (TMAH 2.38%)', en: 'Developer (TMAH 2.38%)' }, img: './assets/images/prod-g4.jpg', sku: 'DG-FB-DEV01', desc: { vi: 'Dung dịch hiện hình TMAH 2.38%.', en: 'TMAH 2.38% developer solution.' },
                      specs: [ { k:{vi:'Loại',en:'Type'},v:'Developer (TMAH)'}, { k:{vi:'Nồng độ',en:'Concentration'},v:'2.38%'}, { k:{vi:'Cấp',en:'Grade'},v:'EL'} ] },
                    { name: { vi: 'Etchant oxide đệm (BOE)', en: 'Buffered oxide etch (BOE)' }, img: './assets/images/prod-g4.jpg', sku: 'DG-FB-BOE71', desc: { vi: 'BOE 7:1 ăn mòn SiO₂.', en: 'BOE 7:1 for SiO₂ etching.' },
                      specs: [ { k:{vi:'Loại',en:'Type'},v:'BOE 7:1'}, { k:{vi:'Cấp',en:'Grade'},v:{vi:'Bán dẫn',en:'Semiconductor'}}, { k:{vi:'Quy cách',en:'Packaging'},v:'1 L'} ] },
                    { name: { vi: 'Dung dịch CMP (silica)', en: 'CMP slurry (silica)' }, img: './assets/images/prod-g4.jpg', sku: 'DG-FB-CMP01', desc: { vi: 'Slurry silica cho đánh bóng cơ-hoá (CMP).', en: 'Colloidal silica slurry for CMP.' },
                      specs: [ { k:{vi:'Loại',en:'Type'},v:'CMP slurry'}, { k:{vi:'Hạt mài',en:'Abrasive'},v:{vi:'Silica keo',en:'Colloidal silica'}}, { k:{vi:'Quy cách',en:'Packaging'},v:'1 L'} ] },
                    { name: { vi: 'Acetone (cấp bán dẫn)', en: 'Acetone (semiconductor grade)' }, img: './assets/images/prod-g4.jpg', sku: 'DG-FB-ACE01', desc: { vi: 'Acetone tinh khiết cao cho làm sạch wafer.', en: 'High-purity acetone for wafer cleaning.' },
                      specs: [ { k:{vi:'Loại',en:'Type'},v:'Acetone'}, { k:{vi:'Cấp',en:'Grade'},v:{vi:'Bán dẫn (EL)',en:'Semiconductor (EL)'}}, { k:{vi:'Quy cách',en:'Packaging'},v:'1 L'} ] }
                ]
            }
        ]
    }
};

window.PD_STR = {
    crumb:     { vi: 'Sản phẩm', en: 'Products' },
    updating:  { vi: 'Thông số kỹ thuật & hình ảnh đang được cập nhật.', en: 'Specifications & images are being updated.' },
    quote:     { vi: 'Yêu cầu báo giá', en: 'Request a quote' },
    home:      { vi: 'Trang chủ', en: 'Home' },
    back:      { vi: 'Về trang chủ', en: 'Back to home' },
    allprod:   { vi: 'Tất cả sản phẩm', en: 'All products' },
    intro:     { vi: 'Thông số kỹ thuật chi tiết cho từng sản phẩm. Liên hệ để nhận báo giá và tư vấn.', en: 'Detailed specifications for each product. Contact us for a quote and consultation.' },
    notfound:  { vi: 'Không tìm thấy nhóm sản phẩm.', en: 'Product group not found.' },
    summaryT:  { vi: 'Bảng tổng hợp thông số', en: 'Specifications Summary' },
    bestsell:  { vi: 'Sản phẩm chủ đạo / Best selling', en: 'Best selling products' },
    viewdetail:{ vi: 'Xem chi tiết', en: 'View details' },
    techprop:  { vi: 'Thông số kỹ thuật', en: 'Technical Properties' },
    sku:       { vi: 'Mã SKU', en: 'SKU' },
    contact:   { vi: 'Liên hệ', en: 'Contact us' },
    reflink:   { vi: 'Link tham khảo', en: 'Reference link' },
    close:     { vi: 'Đóng', en: 'Close' },
    all:       { vi: 'Tất cả', en: 'All' },
    product:   { vi: 'Sản phẩm', en: 'Product' },
    results:   { vi: 'sản phẩm', en: 'products' },
    descsec:   { vi: 'Mô tả', en: 'Description' },
    filterhint:{ vi: 'Lọc nhanh:', en: 'Filter:' },
    choosecfg: { vi: 'Chọn cấu hình bạn cần', en: 'Configure what you need' },
    chooseprod:{ vi: 'Chọn sản phẩm bạn cần', en: 'Choose the product you need' },
    apps:      { vi: 'Ứng dụng', en: 'Applications' },
    quotecat:  { vi: 'Yêu cầu báo giá nhóm này', en: 'Request a quote for this category' },
    matched:   { vi: 'Sản phẩm phù hợp', en: 'Matching product' },
    custom:    { vi: 'Đặt theo yêu cầu', en: 'Custom order' },
    customdesc:{ vi: 'Cấu hình này chưa có sẵn trong kho — liên hệ để đặt sản xuất theo yêu cầu.', en: 'This configuration is not in stock — contact us for a custom order.' }
};

// Gán ảnh theo từng mục Nhóm 1:
//  - Sapphire: dùng sapphire.png (cả card lẫn popup)
//  - Wafer Si khác: card = siliconwafer.png, popup = digifundwaferdetail.png
var WAFER_DETAIL_IMG = './assets/images/digifundwaferdetail.png';
var SAPPHIRE_IMG = './assets/images/sapphire.png';
(window.PD_DATA['1'].items || []).forEach(function (it) {
    var isSapphire = it.name && it.name.en && it.name.en.indexOf('Sapphire') === 0;
    (it.variants || []).forEach(function (v) {
        if (isSapphire) { v.img = SAPPHIRE_IMG; v.detailImg = SAPPHIRE_IMG; }
        else if (v.img === WAFER_IMG || v.img === SIC_IMG) { v.detailImg = WAFER_DETAIL_IMG; }
    });
});
