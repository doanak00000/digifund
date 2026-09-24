/**
 * DIGIFUND — Lưu báo giá online (Google Apps Script)
 *
 * Mỗi báo giá được lưu thành 1 file JSON trong thư mục Google Drive "DIGIFUND - Bao gia",
 * kèm 1 file _index.json chứa danh sách tóm tắt để tải danh sách nhanh.
 *
 * Mã bí mật KHÔNG đặt trong code: vào Project Settings → Script properties,
 * thêm property tên SECRET với giá trị tùy chọn (xem BAOGIA_ONLINE_SETUP.md).
 */

var FOLDER_NAME = 'DIGIFUND - Bao gia';
var INDEX_NAME = '_index.json';
var LIST_LIMIT = 100;

function doGet(e) {
  return handle_(e.parameter || {});
}

function doPost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return out_({ ok: false, error: 'Dữ liệu gửi lên không hợp lệ' });
  }
  return handle_(body);
}

// Chống dò mật khẩu: sai quá MAX_FAILS lần thì khóa mọi truy cập trong LOCK_SECONDS (tính từ lần sai gần nhất).
var MAX_FAILS = 10;
var LOCK_SECONDS = 15 * 60;

function handle_(p) {
  var secret = PropertiesService.getScriptProperties().getProperty('SECRET');
  if (!secret) return out_({ ok: false, error: 'Chưa cài SECRET trong Script properties' });
  var cache = CacheService.getScriptCache();
  var fails = Number(cache.get('fails') || 0);
  if (fails >= MAX_FAILS) return out_({ ok: false, error: 'Tạm khóa do nhập sai mật khẩu nhiều lần, thử lại sau 15 phút' });
  if (!p.key || p.key !== secret) {
    cache.put('fails', String(fails + 1), LOCK_SECONDS);
    return out_({ ok: false, error: 'Sai mật khẩu' });
  }
  try {
    switch (p.action) {
      case 'ping':   return out_({ ok: true });
      case 'list':   return out_({ ok: true, items: readIndex_().slice(0, LIST_LIMIT) });
      case 'get':    return out_({ ok: true, data: get_(p.id) });
      case 'save':   save_(p.id, p.meta, p.data); return out_({ ok: true });
      case 'delete': del_(p.id); return out_({ ok: true });
    }
    return out_({ ok: false, error: 'Hành động không hợp lệ' });
  } catch (err) {
    return out_({ ok: false, error: String((err && err.message) || err) });
  }
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function checkId_(id) {
  if (!/^[a-z0-9]{6,40}$/i.test(String(id || ''))) throw new Error('Mã báo giá không hợp lệ');
  return String(id);
}

function folder_() {
  var it = DriveApp.getFoldersByName(FOLDER_NAME);
  return it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER_NAME);
}

function findFile_(folder, name) {
  var it = folder.getFilesByName(name);
  return it.hasNext() ? it.next() : null;
}

function withLock_(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try { return fn(); } finally { lock.releaseLock(); }
}

function readIndex_() {
  var f = findFile_(folder_(), INDEX_NAME);
  if (!f) return [];
  try { return JSON.parse(f.getBlob().getDataAsString()) || []; } catch (e) { return []; }
}

function writeIndex_(items) {
  var folder = folder_();
  var content = JSON.stringify(items);
  var f = findFile_(folder, INDEX_NAME);
  if (f) f.setContent(content);
  else folder.createFile(INDEX_NAME, content, 'application/json');
}

function get_(id) {
  var f = findFile_(folder_(), checkId_(id) + '.json');
  if (!f) throw new Error('Không tìm thấy báo giá');
  return JSON.parse(f.getBlob().getDataAsString());
}

function save_(id, meta, data) {
  id = checkId_(id);
  if (!data || typeof data !== 'object') throw new Error('Thiếu dữ liệu báo giá');
  withLock_(function () {
    var folder = folder_();
    var content = JSON.stringify(data);
    var f = findFile_(folder, id + '.json');
    if (f) f.setContent(content);
    else folder.createFile(id + '.json', content, 'application/json');

    var m = meta && typeof meta === 'object' ? meta : {};
    m.id = id;
    var items = readIndex_().filter(function (x) { return x.id !== id; });
    items.unshift(m);
    items.sort(function (a, b) { return String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')); });
    writeIndex_(items);
  });
}

function del_(id) {
  id = checkId_(id);
  withLock_(function () {
    var folder = folder_();
    var f = findFile_(folder, id + '.json');
    if (f) f.setTrashed(true);
    writeIndex_(readIndex_().filter(function (x) { return x.id !== id; }));
  });
}
