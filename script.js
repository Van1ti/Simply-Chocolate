const burger = document.querySelector('.burger');
const overlay = document.querySelector('.menu-overlay');
const closeBtn = document.querySelector('.close');

burger.addEventListener('click', () => {
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
});

closeBtn.addEventListener('click', () => {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
});

function nextSlide(btn) {
  const container = btn.closest('.taste_text-slider-container');
  const slidesWrapper = container.querySelector('.slides-wrapper');
  const slides = container.querySelectorAll('.slide-text');
  let currentSlide = container.dataset.current ? parseInt(container.dataset.current) : 0;

  currentSlide = (currentSlide + 1) % slides.length;
  container.dataset.current = currentSlide;
  slidesWrapper.style.transform = `translateY(-${currentSlide * slides[0].offsetHeight}px)`;
}

function prevSlide(btn) {
  const container = btn.closest('.taste_text-slider-container');
  const slidesWrapper = container.querySelector('.slides-wrapper');
  const slides = container.querySelectorAll('.slide-text');
  let currentSlide = container.dataset.current ? parseInt(container.dataset.current) : 0;

  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  container.dataset.current = currentSlide;
  slidesWrapper.style.transform = `translateY(-${currentSlide * slides[0].offsetHeight}px)`;
}



document.addEventListener('DOMContentLoaded', function () {

  const track = document.querySelector('.products__track');
  const slider = document.querySelector('.products__slider');
  const dotsContainer = document.querySelector('.products__dots');

  let cards = Array.from(document.querySelectorAll('.product-card'));
  const visibleCount = 4;
  const originalCount = cards.length;

  const cardWidth = 270;
  const gap = 18;
  const step = cardWidth + gap;

  let currentIndex = 0;
  let autoplay;

  /* ===== INFINITE CLONE ===== */
  function setupInfinite() {
    const clonesBefore = cards.slice(-visibleCount).map(card => card.cloneNode(true));
    const clonesAfter = cards.slice(0, visibleCount).map(card => card.cloneNode(true));

    clonesBefore.forEach(clone => track.prepend(clone));
    clonesAfter.forEach(clone => track.appendChild(clone));

    cards = Array.from(document.querySelectorAll('.product-card'));
    currentIndex = visibleCount;

    updateSlider(false);
  }

  /* ===== CREATE DOTS ===== */
  function createDots() {
    for (let i = 0; i < originalCount; i++) {
      const dot = document.createElement('button');

      dot.addEventListener('click', function () {
        currentIndex = i + visibleCount;
        updateSlider();
        resetAutoplay();
      });

      dotsContainer.appendChild(dot);
    }
  }

  /* ===== UPDATE DOTS ===== */
  function updateDots() {
    const realIndex = (currentIndex - visibleCount + originalCount) % originalCount;
    const dots = dotsContainer.querySelectorAll('button');

    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[realIndex]) dots[realIndex].classList.add('active');
  }

  /* ===== MOVE ===== */
  function updateSlider(animate = true) {
    track.style.transition = animate ? 'transform 0.5s ease' : 'none';
    track.style.transform = `translateX(-${step * currentIndex}px)`;
    updateDots();
  }

  function nextSlide() {
    currentIndex++;
    updateSlider();
  }

  function prevSlide() {
    currentIndex--;
    updateSlider();
  }

  /* ===== FIX LOOP ===== */
  track.addEventListener('transitionend', function () {
    if (currentIndex >= cards.length - visibleCount) {
      currentIndex = visibleCount;
      updateSlider(false);
    }

    if (currentIndex < visibleCount) {
      currentIndex = cards.length - visibleCount * 2;
      updateSlider(false);
    }
  });

  /* ===== WHEEL ===== */
  slider.addEventListener('wheel', function (e) {
    e.preventDefault();
    if (e.deltaY > 0) nextSlide();
    else prevSlide();
    resetAutoplay();
  });

  /* ===== AUTOPLAY ===== */
  function startAutoplay() {
    autoplay = setInterval(nextSlide, 3000);
  }

  function resetAutoplay() {
    clearInterval(autoplay);
    startAutoplay();
  }

  /* ===== INIT ===== */
  setupInfinite();
  createDots();
  startAutoplay();

});

/* =====плавная прокруткa===== */
const button = document.getElementById('scrollButton');
const target = document.getElementById('targetSection');

button.addEventListener('click', () => {
  target.scrollIntoView({ behavior: 'smooth' });
});