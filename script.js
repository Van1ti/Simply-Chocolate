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
const orderModal = document.getElementById("orderModal");
const successModal = document.getElementById("successModal");

document.getElementById("openOrder").onclick = () => {
  orderModal.classList.add("active");
  document.body.style.overflow = "hidden";
};

document.getElementById("closeOrder").onclick = () => {
  orderModal.classList.remove("active");
  document.body.style.overflow = "";
};

document.getElementById("submitOrder").onclick = () => {
  orderModal.classList.remove("active");
  successModal.classList.add("active");
};

document.getElementById("closeSuccess").onclick = () => {
  successModal.classList.remove("active");
  document.body.style.overflow = "";
};

const track = document.getElementById('slider-track');
const container = document.getElementById('slider-container');
const dots = document.querySelectorAll('.dot');
let cards = Array.from(track.children);

let currentIndex = 0; // Текущий индекс (0-5)
let isDragging = false;
let startX, currentTranslate, prevTranslate;
let animationID;
let autoPlayTimer;

// --- INFINITE LOGIC (Клонирование) ---
// Клонируем первые 3 и последние 3 для бесшовного перехода
const cloneFirst = cards.slice(0, 3).map(card => card.cloneNode(true));
const cloneLast = cards.slice(-3).map(card => card.cloneNode(true));

cloneFirst.forEach(clone => track.appendChild(clone));
cloneLast.reverse().forEach(clone => track.prepend(clone));

// Обновляем список после клонирования для расчетов
const allCards = document.querySelectorAll('.reviews__card');

// --- ФУНКЦИИ УПРАВЛЕНИЯ ---
function getCardWidth() {
  return allCards[0].offsetWidth + 28; // Ширина + gap
}

function updateSlider(withAnimation = true) {
  const width = getCardWidth();
  track.style.transition = withAnimation ? 'transform 0.5s ease-out' : 'none';
  // Сдвиг на индекс + 3 (так как в начале 3 клона)
  track.style.transform = `translateX(${- (currentIndex + 3) * width}px)`;
  updateDots();
}

function updateDots() {
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === (currentIndex % 4));
  });
}

function nextSlide() {
  currentIndex++;
  updateSlider();
  checkBoundary();
}

function prevSlide() {
  currentIndex--;
  updateSlider();
  checkBoundary();
}

function checkBoundary() {
  track.addEventListener('transitionend', () => {
    const width = getCardWidth();
    if (currentIndex >= cards.length) {
      currentIndex = 0;
      updateSlider(false);
    }
    if (currentIndex < 0) {
      currentIndex = cards.length - 1;
      updateSlider(false);
    }
  }, { once: true });
}

// --- СОБЫТИЯ ---

// 1. Пагинация (4 кнопки)
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    currentIndex = i;
    updateSlider();
    stopAutoPlay();
    startAutoPlay();
  });
});

// 2. Autoplay
const startAutoPlay = () => autoPlayTimer = setInterval(nextSlide, 4000);
const stopAutoPlay = () => clearInterval(autoPlayTimer);

// 3. Wheel Scroll
container.addEventListener('wheel', (e) => {
  e.preventDefault();
  stopAutoPlay();
  e.deltaY > 0 ? nextSlide() : prevSlide();
  startAutoPlay();
}, { passive: false });

// 4. Drag & Swipe
container.addEventListener('mousedown', dragStart);
container.addEventListener('touchstart', dragStart);
container.addEventListener('mousemove', dragMove);
container.addEventListener('touchmove', dragMove);
window.addEventListener('mouseup', dragEnd);
window.addEventListener('touchend', dragEnd);

function dragStart(e) {
  isDragging = true;
  startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  stopAutoPlay();
  track.style.transition = 'none';
}

function dragMove(e) {
  if (!isDragging) return;
  const x = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  const walk = x - startX;
  const width = getCardWidth();
  track.style.transform = `translateX(${- (currentIndex + 3) * width + walk}px)`;
}

function dragEnd(e) {
  if (!isDragging) return;
  isDragging = false;
  const width = getCardWidth();
  const currentPos = parseInt(track.style.transform.replace('translateX(', ''));
  const movedBy = currentPos + (currentIndex + 3) * width;

  if (movedBy < -100) nextSlide();
  else if (movedBy > 100) prevSlide();
  else updateSlider();

  startAutoPlay();
}

// Инициализация
window.addEventListener('resize', () => updateSlider(false));
updateSlider(false);
startAutoPlay();


document.addEventListener('DOMContentLoaded', () => {

  const layer = document.getElementById('reviewLayer');
  const openBtn = document.getElementById('reviewLaunch');
  const formCard = document.getElementById('reviewCardForm');
  const doneCard = document.getElementById('reviewCardDone');
  const form = document.getElementById('reviewForm');
  const exitForm = document.getElementById('reviewExitForm');
  const exitDone = document.getElementById('reviewExitDone');

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

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formCard.style.display = 'none';
    doneCard.style.display = 'block';
  });

  exitForm.addEventListener('click', closeReview);
  exitDone.addEventListener('click', closeReview);

  layer.addEventListener('click', (e) => {
    if (e.target === layer) {
      closeReview();
    }
  });

});
