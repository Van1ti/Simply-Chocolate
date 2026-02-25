/* ======= Плавный скролл к секции ======= */
const scrollButton = document.getElementById('scrollButton');
const targetSection = document.getElementById('targetSection');

if (scrollButton && targetSection) {
  scrollButton.addEventListener('click', () => {
    targetSection.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ======= BURGER ======= */
const burger = document.querySelector('.burger');
const overlay = document.querySelector('.menu-overlay');
const closeBtn = document.querySelector('.close');
const links = overlay ? overlay.querySelectorAll('.menu a') : [];

if (burger && overlay && closeBtn) {

  burger.addEventListener('click', () => {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Закрытие при клике вне меню
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ======= PRODUCTS SLIDER ======= */
document.addEventListener('DOMContentLoaded', function () {

  const track = document.querySelector('.products__track');
  const slider = document.querySelector('.products__slider');
  const dotsContainer = document.querySelector('.products__dots');

  if (!track || !slider || !dotsContainer) return;

  const originalCards = Array.from(document.querySelectorAll('.product-card'));
  const originalCount = originalCards.length;

  let currentIndex = 0;
  let visibleCount = getVisibleCount();
  let autoplay;

  function getVisibleCount() {
    if (window.innerWidth <= 480) return 1;
    if (window.innerWidth <= 768) return 2;
    if (window.innerWidth <= 1024) return 3;
    return 4;
  }

  function buildSlider() {

    visibleCount = getVisibleCount();
    track.innerHTML = '';

    const clonesBefore = originalCards.slice(-visibleCount).map(card => card.cloneNode(true));
    const clonesAfter = originalCards.slice(0, visibleCount).map(card => card.cloneNode(true));

    clonesBefore.forEach(card => track.appendChild(card));
    originalCards.forEach(card => track.appendChild(card));
    clonesAfter.forEach(card => track.appendChild(card));

    currentIndex = visibleCount;
    updateSlider(false);
  }

  function getCardWidth() {
    const card = track.querySelector('.product-card');
    const gap = parseInt(getComputedStyle(track).gap);
    return card.getBoundingClientRect().width + gap;
  }

  function updateSlider(animate = true) {
    const width = getCardWidth();
    track.style.transition = animate ? 'transform 0.6s ease' : 'none';
    track.style.transform = `translateX(-${width * currentIndex}px)`;
    updateDots();
  }

  function next() { currentIndex++; updateSlider(); }
  function prev() { currentIndex--; updateSlider(); }

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
    const real = (currentIndex - visibleCount + originalCount) % originalCount;
    const dots = dotsContainer.querySelectorAll('button');
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[real]) dots[real].classList.add('active');
  }

  slider.addEventListener('wheel', (e) => {
    e.preventDefault();
    e.deltaY > 0 ? next() : prev();
    resetAutoplay();
  });

  function startAutoplay() { autoplay = setInterval(next, 3000); }
  function resetAutoplay() { clearInterval(autoplay); startAutoplay(); }

  window.addEventListener('resize', buildSlider);

  buildSlider();
  createDots();
  startAutoplay();
});

/* ======= TOP SELLERS MODALS ======= */
const orderModal = document.getElementById("orderModal");
const successModal = document.getElementById("successModal");

if (orderModal && successModal) {

  document.getElementById("openOrder")?.addEventListener('click', () => {
    orderModal.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  document.getElementById("closeOrder")?.addEventListener('click', () => {
    orderModal.classList.remove("active");
    document.body.style.overflow = "";
  });

  document.getElementById("submitOrder")?.addEventListener('click', () => {
    orderModal.classList.remove("active");
    successModal.classList.add("active");
  });

  document.getElementById("closeSuccess")?.addEventListener('click', () => {
    successModal.classList.remove("active");
    document.body.style.overflow = "";
  });

  // Закрытие при клике вне модалки
  orderModal.addEventListener('click', (e) => {
    if (e.target === orderModal) {
      orderModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
      successModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
}

/* ======= REVIEW MODAL ======= */
document.addEventListener('DOMContentLoaded', () => {

  const layer = document.getElementById('reviewLayer');
  const openBtn = document.getElementById('reviewLaunch');
  const formCard = document.getElementById('reviewCardForm');
  const doneCard = document.getElementById('reviewCardDone');
  const form = document.getElementById('reviewForm');
  const exitForm = document.getElementById('reviewExitForm');
  const exitDone = document.getElementById('reviewExitDone');

  if (!layer || !openBtn) return;

  function openReview() {
    layer.classList.add('is-visible');
    formCard.style.display = 'block';
    doneCard.style.display = 'none';
    document.body.style.overflow = 'hidden';
  }

  function closeReview() {
    layer.classList.remove('is-visible');
    document.body.style.overflow = '';
    form.reset();
  }

  openBtn.addEventListener('click', openReview);

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    formCard.style.display = 'none';
    doneCard.style.display = 'block';
  });

  exitForm?.addEventListener('click', closeReview);
  exitDone?.addEventListener('click', closeReview);

  // Закрытие по клику вне карточки
  layer.addEventListener('click', (e) => {
    if (e.target === layer) {
      closeReview();
    }
  });
});