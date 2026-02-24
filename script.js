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

  const originalCards = Array.from(track.children);
  const originalCount = originalCards.length;

  let currentIndex = 0;
  let autoplay;

  /* ===== сколько видно ===== */
  function getVisibleCount() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 4;
  }

  let visibleCount = getVisibleCount();

  /* ===== создаём infinite ОДИН раз ===== */
  function createClones() {

    const before = originalCards
      .slice(-visibleCount)
      .map(card => card.cloneNode(true));

    const after = originalCards
      .slice(0, visibleCount)
      .map(card => card.cloneNode(true));

    before.forEach(card => track.prepend(card));
    after.forEach(card => track.append(card));

    currentIndex = visibleCount;
    move(false);
  }

  /* ===== ширина карточки ===== */
  function getCardWidth() {
    const card = track.querySelector('.product-card');
    const gap = parseInt(getComputedStyle(track).gap);
    return card.getBoundingClientRect().width + gap;
  }

  /* ===== движение ===== */
  function move(animate = true) {
    const width = getCardWidth();
    track.style.transition = animate ? 'transform 0.6s ease' : 'none';
    track.style.transform = `translateX(-${width * currentIndex}px)`;
    updateDots();
  }

  function next() {
    currentIndex++;
    move();
  }

  function prev() {
    currentIndex--;
    move();
  }

  /* ===== фиксим infinite ===== */
  track.addEventListener('transitionend', () => {

    const total = track.children.length;
    visibleCount = getVisibleCount();

    if (currentIndex >= total - visibleCount) {
      currentIndex = visibleCount;
      move(false);
    }

    if (currentIndex < visibleCount) {
      currentIndex = total - visibleCount * 2;
      move(false);
    }
  });

  /* ===== точки (всегда 8) ===== */
  function createDots() {
    for (let i = 0; i < originalCount; i++) {
      const dot = document.createElement('button');

      dot.addEventListener('click', () => {
        visibleCount = getVisibleCount();
        currentIndex = i + visibleCount;
        move();
        resetAutoplay();
      });

      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    visibleCount = getVisibleCount();

    const real =
      (currentIndex - visibleCount + originalCount) % originalCount;

    const dots = dotsContainer.querySelectorAll('button');
    dots.forEach(dot => dot.classList.remove('active'));

    if (dots[real]) dots[real].classList.add('active');
  }

  /* ===== autoplay ===== */
  function startAutoplay() {
    autoplay = setInterval(next, 4000);
  }

  function resetAutoplay() {
    clearInterval(autoplay);
    startAutoplay();
  }

  /* ===== колесо ===== */
  slider.addEventListener('wheel', (e) => {
    e.preventDefault();
    e.deltaY > 0 ? next() : prev();
    resetAutoplay();
  });


  /* ===== resize (только пересчёт позиции) ===== */
  window.addEventListener('resize', () => {
    visibleCount = getVisibleCount();
    move(false);
  });

  /* ===== INIT ===== */
  createClones();
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

const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

let current = 0;
const total = slides.length;

function showSlide(index) {

  slides.forEach(slide => slide.classList.remove("active"));
  dots.forEach(dot => dot.classList.remove("active"));

  slides[index].classList.add("active");
  dots[index].classList.add("active");

  current = index;
}

// Клик по точкам
dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showSlide(index);
  });
});

// Автопрокрутка
setInterval(() => {
  let next = current + 1;
  if (next >= total) next = 0;
  showSlide(next);
}, 4000);

document.addEventListener('DOMContentLoaded', function () {

  const track = document.querySelector('.slider__track');
  const viewport = document.querySelector('.slider__viewport');
  const buttonsContainer = document.querySelector('.slider__buttons');

  const originalCards = Array.from(track.children);
  const visibleCount = 3;
  const originalCount = originalCards.length; // 6
  const maxIndex = originalCount - visibleCount; // 3

  const cardWidth = 270;
  const gap = 18;
  const step = cardWidth + gap;

  let currentIndex = visibleCount;
  let autoplay;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;

  /* ===== Infinite ===== */

  const clonesBefore = originalCards
    .slice(-visibleCount)
    .map(card => card.cloneNode(true));

  const clonesAfter = originalCards
    .slice(0, visibleCount)
    .map(card => card.cloneNode(true));

  clonesBefore.forEach(card => track.prepend(card));
  clonesAfter.forEach(card => track.append(card));

  move(false);

  /* ===== Кнопки ===== */

  for (let i = 0; i <= maxIndex; i++) {

    const btn = document.createElement('button');
    if (i === 0) btn.classList.add('active');

    btn.addEventListener('click', () => {
      currentIndex = i + visibleCount;
      move();
      updateButtons();
      resetAutoplay();
    });

    buttonsContainer.appendChild(btn);
  }

  function updateButtons() {

    const realIndex =
      (currentIndex - visibleCount + originalCount) % originalCount;

    const buttons = buttonsContainer.querySelectorAll('button');
    buttons.forEach(btn => btn.classList.remove('active'));

    if (realIndex <= maxIndex) {
      buttons[realIndex].classList.add('active');
    }
  }

  /* ===== Move ===== */

  function move(animate = true) {
    track.style.transition = animate ? 'transform 0.5s ease' : 'none';
    track.style.transform = `translateX(-${step * currentIndex}px)`;
  }

  function next() {
    currentIndex++;
    move();
  }

  function prev() {
    currentIndex--;
    move();
  }

  /* ===== Infinite Fix ===== */

  track.addEventListener('transitionend', () => {

    if (currentIndex >= originalCount + visibleCount) {
      currentIndex = visibleCount;
      move(false);
    }

    if (currentIndex < visibleCount) {
      currentIndex = originalCount;
      move(false);
    }

    updateButtons();
  });

  /* ===== Autoplay ===== */

  function startAutoplay() {
    autoplay = setInterval(next, 4000);
  }

  function resetAutoplay() {
    clearInterval(autoplay);
    startAutoplay();
  }

  viewport.addEventListener('mouseenter', () => clearInterval(autoplay));
  viewport.addEventListener('mouseleave', startAutoplay);

  /* ===== Wheel ===== */

  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    e.deltaY > 0 ? next() : prev();
    resetAutoplay();
  });

  /* ===== Drag ===== */

  viewport.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX;
    currentTranslate = -step * currentIndex;
    track.style.transition = 'none';
    viewport.style.cursor = 'grabbing';
  });

  viewport.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const diff = e.pageX - startX;
    track.style.transform = `translateX(${currentTranslate + diff}px)`;
  });

  viewport.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    viewport.style.cursor = 'grab';

    const diff = e.pageX - startX;

    if (Math.abs(diff) > 50) {
      diff < 0 ? next() : prev();
    } else {
      move();
    }

    resetAutoplay();
  });

  viewport.addEventListener('mouseleave', () => {
    if (isDragging) {
      isDragging = false;
      move();
      viewport.style.cursor = 'grab';
    }
  });

  /* ===== INIT ===== */

  startAutoplay();

});
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