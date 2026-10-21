// node tools/preview-details/dump-data.js  -> prints PD_DATA_V2 as JSON (read by build.py for the static, crawlable catalogue)
const fs = require('fs');
global.window = {};
global.localStorage = { getItem: () => null };
eval(fs.readFileSync('assets/js/products-data.js', 'utf8'));
eval(fs.readFileSync('assets/js/products-data-v2.js', 'utf8'));
process.stdout.write(JSON.stringify(window.PD_DATA_V2));
