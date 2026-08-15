/* Digifund blog — menu mobile cho header .bl-header
   Trước đây CSS ẩn hẳn các link điều hướng dưới 860px mà không có gì thay thế,
   nên trên điện thoại không còn đường vào Giới Thiệu / Sản Phẩm / Liên Hệ.
   Script này bật/tắt panel .bl-nav__links bằng nút hamburger. */
(function () {
  function init() {
    var burger = document.querySelector('.bl-burger');
    var panel = document.querySelector('.bl-nav__links');
    if (!burger || !panel) return;

    function setOpen(open) {
      panel.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.innerHTML = open
        ? '<i class="fas fa-xmark" aria-hidden="true"></i>'
        : '<i class="fas fa-bars" aria-hidden="true"></i>';
    }

    burger.addEventListener('click', function (e) {
      e.preventDefault();
      setOpen(!panel.classList.contains('is-open'));
    });

    // đóng khi bấm vào một mục trong menu
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    // đóng khi bấm ra ngoài header
    document.addEventListener('click', function (e) {
      if (!panel.classList.contains('is-open')) return;
      if (e.target.closest('.bl-header')) return;
      setOpen(false);
    });

    // đóng bằng phím Esc
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });

    // quay lại desktop thì bỏ trạng thái mở để không kẹt panel
    var mq = window.matchMedia('(min-width:861px)');
    var onChange = function (ev) { if (ev.matches) setOpen(false); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
