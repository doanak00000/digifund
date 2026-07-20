/* Digifund blog - chuyển ngôn ngữ VI/EN (dùng chung localStorage với web chính) */
(function () {
  var KEY = 'digifund-lang';
  function getLang() { try { return localStorage.getItem(KEY) === 'en' ? 'en' : 'vi'; } catch (e) { return 'vi'; } }
  function setLang(l) { try { localStorage.setItem(KEY, l); } catch (e) {} }
  function apply(l) {
    var root = document.documentElement;
    root.setAttribute('data-lang', l);
    root.setAttribute('lang', l);
    // đổi <title> + meta description nếu có bản dịch
    var t = document.querySelector('title');
    if (t) {
      var tv = t.getAttribute('data-vi'), te = t.getAttribute('data-en');
      if (l === 'en' && te) document.title = te; else if (tv) document.title = tv;
    }
    var md = document.querySelector('meta[name="description"]');
    if (md) {
      var dv = md.getAttribute('data-vi'), de = md.getAttribute('data-en');
      if (l === 'en' && de) md.setAttribute('content', de); else if (dv) md.setAttribute('content', dv);
    }
    var btns = document.querySelectorAll('.bl-lang-btn');
    for (var i = 0; i < btns.length; i++) btns[i].textContent = (l === 'vi' ? 'VI' : 'EN');
  }
  // ===== Theme sáng/tối (dùng chung localStorage 'digifund-theme' với web chính) =====
  var TKEY = 'digifund-theme';
  function getTheme() { try { return localStorage.getItem(TKEY) === 'dark' ? 'dark' : 'light'; } catch (e) { return 'light'; } }
  function setTheme(t) { try { localStorage.setItem(TKEY, t); } catch (e) {} }
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    var tb = document.querySelectorAll('.bl-theme-btn');
    for (var i = 0; i < tb.length; i++) tb[i].innerHTML = (t === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>');
  }

  // set sớm để tránh nháy (ngôn ngữ + theme)
  try { document.documentElement.setAttribute('data-lang', getLang()); } catch (e) {}
  try { document.documentElement.setAttribute('data-theme', getTheme()); } catch (e) {}
  function init() {
    apply(getLang());
    applyTheme(getTheme());
    var btns = document.querySelectorAll('.bl-lang-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function (e) {
        e.preventDefault();
        var next = getLang() === 'vi' ? 'en' : 'vi';
        setLang(next); apply(next);
      });
    }
    var tbtns = document.querySelectorAll('.bl-theme-btn');
    for (var j = 0; j < tbtns.length; j++) {
      tbtns[j].addEventListener('click', function (e) {
        e.preventDefault();
        var next = getTheme() === 'dark' ? 'light' : 'dark';
        setTheme(next); applyTheme(next);
      });
    }
  }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
