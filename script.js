// ════════════════════════════════════════════════
//  ADD YOUR PHOTOS HERE
//  1. Drop the image file into the photos/ folder
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
