// Lightbox only. The gallery itself is plain HTML written by scripts/build_images.py,
// so the page still shows every photo if this file fails to load.
(function () {
  'use strict';

  // Tapping outside the contact panel only closes it; it must not also open the photo under it.
  var panel = document.getElementById('contact-panel');
  var swallow = false;
  if (panel) {
    document.addEventListener('pointerdown', function (e) {
      swallow = panel.matches(':popover-open') && !panel.contains(e.target) && !e.target.closest('.contact-btn');
    }, true);
    document.addEventListener('click', function (e) {
      if (swallow) { swallow = false; e.stopPropagation(); e.preventDefault(); }
    }, true);
  }

  // lanes split the photos up, so put them back in their original order for next/prev
  var tiles = Array.prototype.slice.call(document.querySelectorAll('.tile'))
    .sort(function (a, b) { return a.dataset.i - b.dataset.i; });
  var box = document.getElementById('lightbox');
  var img = document.getElementById('lb-img');
  var cap = document.getElementById('lb-cap');
  if (!tiles.length || !box || typeof box.showModal !== 'function') return;

  var index = 0;

  function show(i) {
    index = (i + tiles.length) % tiles.length;
    var tile = tiles[index];
    var thumb = tile.querySelector('img');
    img.src = tile.dataset.full;
    img.alt = thumb ? thumb.alt : '';
    cap.textContent = tile.dataset.caption || '';
  }

  function open(i) {
    show(i);
    if (!box.open) box.showModal();
  }

  function close() {
    if (box.open) box.close();
  }

  // one listener on the roll, so the repeated copies of the gallery work too
  (document.getElementById('reel') || document).addEventListener('click', function (e) {
    var tile = e.target.closest && e.target.closest('.tile');
    if (tile) open(+tile.dataset.i);
  });

  // turn the mouse wheel into sideways scrolling on the photo roll
  var reel = document.getElementById('reel');
  if (reel) {
    reel.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // already sideways (trackpad)
      reel.scrollLeft += e.deltaY;
      e.preventDefault();
    }, { passive: false });
  }

  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', function () { show(index - 1); });
  box.querySelector('.lb-next').addEventListener('click', function () { show(index + 1); });

  // click on the dark backdrop closes (not on the photo or buttons)
  box.addEventListener('click', function (e) {
    if (e.target === box || e.target.tagName === 'FIGURE') close();
  });

  box.addEventListener('close', function () {
    img.removeAttribute('src');
    if (tiles[index]) tiles[index].focus({ preventScroll: true });
  });

  document.addEventListener('keydown', function (e) {
    if (!box.open) return;
    if (e.key === 'ArrowLeft') show(index - 1);
    else if (e.key === 'ArrowRight') show(index + 1);
  });

  // swipe left/right on touch screens
  var startX = null, startY = null;
  box.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse') return;
    startX = e.clientX; startY = e.clientY;
  });
  box.addEventListener('pointerup', function (e) {
    if (startX === null) return;
    var dx = e.clientX - startX, dy = e.clientY - startY;
    startX = startY = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(index + (dx < 0 ? 1 : -1));
  });
  box.addEventListener('pointercancel', function () { startX = startY = null; });
})();

// Endless roll: three copies of the gallery side by side; when the scroll position passes
// into the third (or before the first) copy it jumps one copy back (or forward), unseen.
(function () {
  'use strict';
  var reel = document.getElementById('reel');
  var first = document.getElementById('gallery');
  if (!reel || !first) return;
  [1, 2].forEach(function () {
    var c = first.cloneNode(true);
    c.removeAttribute('id');
    c.setAttribute('aria-hidden', 'true');
    c.querySelectorAll('.tile').forEach(function (t) { t.tabIndex = -1; });
    reel.appendChild(c);
  });
  reel.classList.add('looping');
  var setW = 0;
  function measure() {
    setW = first.getBoundingClientRect().width + parseFloat(getComputedStyle(first).marginRight || 0);
  }
  function wrap() {
    if (!setW) return;
    if (reel.scrollLeft >= 2 * setW) reel.scrollLeft -= setW;
    else if (reel.scrollLeft <= 0) reel.scrollLeft += setW;
  }
  measure();
  reel.scrollLeft = setW;
  reel.addEventListener('scroll', wrap, { passive: true });
  if (window.ResizeObserver) {
    new ResizeObserver(function () {
      var pos = setW ? (reel.scrollLeft - setW) / setW : 0;
      measure();
      reel.scrollLeft = setW + pos * setW;
    }).observe(first);
  }
})();
