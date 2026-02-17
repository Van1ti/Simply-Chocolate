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

document.addEventListener('DOMContentLoaded', function () {

  const track = document.querySelector('.products__track');
  const slider = document.querySelector('.products__slider');

  let cards = Array.from(document.querySelectorAll('.product-card'));
  const visibleCount = 4;
  let currentIndex = 0;
  let autoplay;

  /* ===== CLONE FOR INFINITE ===== */
  function setupInfinite() {
    const clonesBefore = cards.slice(-visibleCount).map(card => card.cloneNode(true));
    const clonesAfter = cards.slice(0, visibleCount).map(card => card.cloneNode(true));

    clonesBefore.forEach(clone => track.prepend(clone));
    clonesAfter.forEach(clone => track.appendChild(clone));

    cards = Array.from(document.querySelectorAll('.product-card'));
    currentIndex = visibleCount;

    updateSlider(false);
  }

  /* ===== MOVE SLIDER ===== */
  function updateSlider(animate = true) {
    const cardWidth = cards[0].offsetWidth;

    track.style.transition = animate ? 'transform 0.5s ease' : 'none';
    track.style.transform = `translateX(-${cardWidth * currentIndex}px)`;
  }

  function nextSlide() {
    currentIndex++;
    updateSlider();
  }

  function prevSlide() {
    currentIndex--;
    updateSlider();
  }

  /* ===== FIX INFINITE ===== */
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

    if (e.deltaY > 0) {
      nextSlide();
    } else {
      prevSlide();
    }

    resetAutoplay();
  });

  /* ===== AUTOPLAY ===== */
  function startAutoplay() {
    autoplay = setInterval(function () {
      nextSlide();
    }, 3000);
  }

  function resetAutoplay() {
    clearInterval(autoplay);
    startAutoplay();
  }

  /* ===== INIT ===== */
  setupInfinite();
  startAutoplay();

});


/* =====плавная прокруткa===== */
const button = document.getElementById('scrollButton');
const target = document.getElementById('targetSection');

button.addEventListener('click', () => {
  target.scrollIntoView({ behavior: 'smooth' });
});