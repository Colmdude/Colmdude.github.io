// ════════════════════════════════════════════════
//  ADD YOUR PHOTOS HERE
//  1. Drop the image file into the Photos/ folder
//  2. Add the filename to the list below
// ════════════════════════════════════════════════

const photos = [
  'Photos/BRDWY.JPG',
  'Photos/BRDWY2.JPG',
  'Photos/BUS1.JPG',
  'Photos/CAVE1.JPG',
  'Photos/CAVE2.JPG',
  'Photos/CLMNCAMCORDER.JPG',
  'Photos/HOUSE.JPG',
  'Photos/IMG_0337.JPG',
  'Photos/IMG_4436.jpeg',
  'Photos/IMG_4991.JPG',
  'Photos/IMG_4994.JPG',
  'Photos/IMG_5220.jpeg',
  'Photos/IMG_5223.JPG',
  'Photos/IMG_5275.jpeg',
  'Photos/IMG_8823.jpeg',
  'Photos/IMG_8826.jpeg',
  'Photos/IMG_8828.jpeg',
  'Photos/IMG_8843.jpeg',
  'Photos/IMG_9813.JPG',
  'Photos/PWRLN.JPG',
  'Photos/QUARRY2.JPG',
  'Photos/RIVER1.JPG',
  'Photos/SPIDER.JPG',
  'Photos/TODD.JPG',
  'Photos/photo1.jpg',
];

// ════════════════════════════════════════════════

// ── Desktop: masonry grid ──
const photoGrid = document.getElementById('photo-grid');
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lightbox-img');

photos.forEach(src => {
  const img = document.createElement('img');
  img.src = src;
  img.className = 'grid-photo';
  img.alt = '';
  img.addEventListener('click', () => openLightbox(src));
  photoGrid.appendChild(img);
});

// ── Mobile: infinite carousel ──
const track = document.getElementById('carousel-track');

// Build: [clone of last, ...all photos, clone of first]
const srcs = [photos[photos.length - 1], ...photos, photos[0]];
srcs.forEach(src => {
  const slide = document.createElement('div');
  slide.className = 'carousel-slide';
  const img = document.createElement('img');
  img.src = src;
  img.alt = '';
  slide.appendChild(img);
  track.appendChild(slide);
});

let current = 1; // start at first real photo
let startX = 0;
let dragDelta = 0;
let dragging = false;
const carousel = document.getElementById('photo-carousel');

function slideWidth() {
  return carousel.offsetWidth * 0.75 + 16;
}

function trackOffset(index, extra = 0) {
  const sw = slideWidth();
  const center = (carousel.offsetWidth - carousel.offsetWidth * 0.75) / 2;
  return center - index * sw + extra;
}

function updateTrack(animated = true, extra = 0) {
  track.style.transition = animated ? 'transform 0.4s ease' : 'none';
  track.style.transform = `translateX(${trackOffset(current, extra)}px)`;
  Array.from(track.children).forEach((slide, i) => {
    slide.classList.toggle('active', i === current);
  });
}

// Set initial position instantly
updateTrack(false);

// After animation ends, jump silently for infinite loop
track.addEventListener('transitionend', () => {
  if (current === 0) {
    current = photos.length;
    updateTrack(false);
  } else if (current === photos.length + 1) {
    current = 1;
    updateTrack(false);
  }
});

// Touch handling
carousel.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
  dragging = true;
  track.style.transition = 'none';
}, { passive: true });

carousel.addEventListener('touchmove', e => {
  if (!dragging) return;
  dragDelta = e.touches[0].clientX - startX;
  updateTrack(false, dragDelta);
}, { passive: true });

carousel.addEventListener('touchend', e => {
  dragging = false;
  const diff = e.changedTouches[0].clientX - startX;
  dragDelta = 0;
  if (Math.abs(diff) > 40) {
    current += diff < 0 ? 1 : -1;
  }
  updateTrack(true);
});

// Lightbox
function openLightbox(src) {
  lbImg.src = src;
  lightbox.classList.add('open');
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lbImg.src = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});
