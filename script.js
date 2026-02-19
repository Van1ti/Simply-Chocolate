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

  const originalCards = Array.from(document.querySelectorAll('.product-card'));
  const originalCount = originalCards.length;

  let currentIndex = 0;
  let visibleCount = getVisibleCount();
  let autoplay;

  /* ==== сколько видно ==== */
  function getVisibleCount() {
    if (window.innerWidth <= 480) return 1;
    if (window.innerWidth <= 768) return 2;
    if (window.innerWidth <= 1024) return 3;
    return 4;
  }

  /* ==== пересборка infinite ==== */
  function buildSlider() {

    visibleCount = getVisibleCount();
    track.innerHTML = '';

    const clonesBefore = originalCards
      .slice(-visibleCount)
      .map(card => card.cloneNode(true));

    const clonesAfter = originalCards
      .slice(0, visibleCount)
      .map(card => card.cloneNode(true));

    clonesBefore.forEach(card => track.appendChild(card));
    originalCards.forEach(card => track.appendChild(card));
    clonesAfter.forEach(card => track.appendChild(card));

    currentIndex = visibleCount;
    updateSlider(false);
  }

  /* ==== ширина карточки ==== */
  function getCardWidth() {
    const card = track.querySelector('.product-card');
    const gap = parseInt(getComputedStyle(track).gap);
    return card.getBoundingClientRect().width + gap;
  }

  /* ==== движение ==== */
  function updateSlider(animate = true) {
    const width = getCardWidth();
    track.style.transition = animate ? 'transform 0.6s ease' : 'none';
    track.style.transform = `translateX(-${width * currentIndex}px)`;
    updateDots();
  }

  function next() {
    currentIndex++;
    updateSlider();
  }

  function prev() {
    currentIndex--;
    updateSlider();
  }

  /* ==== фиксим infinite ==== */
  track.addEventListener('transitionend', () => {

    const total = track.querySelectorAll('.product-card').length;

    if (currentIndex >= total - visibleCount) {
      currentIndex = visibleCount;
      updateSlider(false);
    }

    if (currentIndex < visibleCount) {
      currentIndex = total - visibleCount * 2;
      updateSlider(false);
    }
  });

  /* ==== точки ==== */
  function createDots() {
    dotsContainer.innerHTML = '';

    for (let i = 0; i < originalCount; i++) {
      const dot = document.createElement('button');

      dot.addEventListener('click', () => {
        currentIndex = i + visibleCount;
        updateSlider();
        resetAutoplay();
      });

      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const real =
      (currentIndex - visibleCount + originalCount) % originalCount;

    const dots = dotsContainer.querySelectorAll('button');
    dots.forEach(dot => dot.classList.remove('active'));

    if (dots[real]) dots[real].classList.add('active');
  }

  /* ==== колесо ==== */
  slider.addEventListener('wheel', (e) => {
    e.preventDefault();
    e.deltaY > 0 ? next() : prev();
    resetAutoplay();
  });

  /* ==== autoplay ==== */
  function startAutoplay() {
    autoplay = setInterval(next, 3000);
  }

  function resetAutoplay() {
    clearInterval(autoplay);
    startAutoplay();
  }

  /* ==== resize фикс ==== */
  window.addEventListener('resize', () => {
    buildSlider();
  });

  /* ==== INIT ==== */
  buildSlider();
  createDots();
  startAutoplay();

});


/* =====плавная прокруткa===== */
const button = document.getElementById('scrollButton');
const target = document.getElementById('targetSection');

button.addEventListener('click', () => {
  target.scrollIntoView({ behavior: 'smooth' });
});


/* =====topSellers modal===== */
document.addEventListener("DOMContentLoaded", function () {

  const openBtn = document.getElementById("openModalBtn");
  const modal1 = document.getElementById("modal1");
  const modal2 = document.getElementById("modal2");
  const close1 = document.getElementById("close1");
  const close2 = document.getElementById("close2");
  const form = document.getElementById("buyForm");

  // Открыть модалку
  openBtn.addEventListener("click", function () {
    modal1.classList.add("active");
  });

  // Закрыть первую
  close1.addEventListener("click", function () {
    modal1.classList.remove("active");
  });

  // Закрыть вторую
  close2.addEventListener("click", function () {
    modal2.classList.remove("active");
  });

  // Submit → открыть вторую
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    modal1.classList.remove("active");
    modal2.classList.add("active");
  });

});
