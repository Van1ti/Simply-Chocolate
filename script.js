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

/* ======= REVIEW SLIDER ======= */
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("slider-track");
  const viewport = document.querySelector(".reviews__viewport");
  const pagination = document.getElementById("pagination");
  const points = pagination.querySelectorAll(".point");

  let cards = Array.from(track.children);
  const gap = 28;
  const cardWidth = 360 + gap; // ширина карточки + gap
  const totalCards = cards.length;

  let visibleCards = getVisibleCards();
  let currentIndex = visibleCards;
  let autoSlide;

  // --- КЛОНИРУЕМ карточки для бесконечного эффекта ---
  const firstClones = cards.slice(0, visibleCards).map(card => card.cloneNode(true));
  const lastClones = cards.slice(-visibleCards).map(card => card.cloneNode(true));

  firstClones.forEach(clone => track.appendChild(clone));
  lastClones.reverse().forEach(clone => track.prepend(clone));

  cards = Array.from(track.children);

  updatePosition();

  // --- АВТОСЛАЙД ---
  function startAutoSlide() {
    autoSlide = setInterval(() => {
      moveToSlide(currentIndex + 1);
    }, 3000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlide);
  }

  viewport.addEventListener("mouseenter", stopAutoSlide);
  viewport.addEventListener("mouseleave", startAutoSlide);

  // --- ПЕРЕМЕЩЕНИЕ ---
  function moveToSlide(index) {
    currentIndex = index;
    track.style.transition = "transform 0.5s ease";
    updatePosition();
    updatePagination();
  }

  function updatePosition() {
    const offset = -currentIndex * cardWidth;
    track.style.transform = `translateX(${offset}px)`;
  }

  // --- БЕСКОНЕЧНЫЙ ЭФФЕКТ ---
  track.addEventListener("transitionend", () => {
    if (currentIndex >= totalCards + visibleCards) {
      track.style.transition = "none";
      currentIndex = visibleCards;
      updatePosition();
    }

    if (currentIndex < visibleCards) {
      track.style.transition = "none";
      currentIndex = totalCards + visibleCards - 1;
      updatePosition();
    }
  });

  // --- ПАГИНАЦИЯ ---
  function updatePagination() {
    let realIndex = (currentIndex - visibleCards) % totalCards;
    if (realIndex < 0) realIndex += totalCards;

    points.forEach(p => p.classList.remove("point--active"));
    points[realIndex].classList.add("point--active");
  }

  points.forEach(point => {
    point.addEventListener("click", () => {
      const slideIndex = parseInt(point.dataset.slide);
      moveToSlide(slideIndex + visibleCards);
    });
  });

  // --- АДАПТИВ ---
  function getVisibleCards() {
    if (window.innerWidth <= 650) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  window.addEventListener("resize", () => {
    visibleCards = getVisibleCards();
    updatePosition();
  });

  startAutoSlide();
});

/* ======= REVIEW MODAL ======= */
document.addEventListener('DOMContentLoaded', () => {

  const layer = document.getElementById('reviewLayer');
  const openBtn = document.getElementById('reviewLaunch');

  const formCard = document.getElementById('reviewCardForm');
  const doneCard = document.getElementById('feedbackSuccess');

  const form = document.getElementById('reviewForm');

  const exitForm = document.getElementById('reviewExitForm');
  const exitDone = document.getElementById('feedbackSuccessClose');

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

/* ======= subscribe modal ======= */
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const modal = document.getElementById('subscribeModal');
const submitBtn = modal.querySelector('button[type="submit"]') ||
  modal.querySelector('.subscribe-modal__box__send__btn') ||
  modal.querySelector('button:last-of-type');

openModalBtn.addEventListener('click', () => {
  modal.classList.add('active');
});

closeModalBtn.addEventListener('click', () => {
  modal.classList.remove('active');
});

submitBtn.addEventListener('click', () => {
  modal.classList.remove('active');
});

// Закрытие при клике вне окна
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
  }
});



function initSlider() {

  if (window.innerWidth > 767) return;

  const track = document.querySelector('.slider-track');
  const dotsContainer = document.querySelector('.slider-dots');

  let slides = Array.from(track.children);

  const gap = 18;
  let index = slides.length;
  let isTransitioning = false;

  const startClones = slides.map(s => s.cloneNode(true));
  const endClones = slides.map(s => s.cloneNode(true));

  startClones.forEach(clone => track.prepend(clone));
  endClones.forEach(clone => track.append(clone));

  const allSlides = track.querySelectorAll('.slide');

  slides.forEach((_, i) => {

    const dot = document.createElement('button');

    if (i === 0) dot.classList.add('active');

    dot.onclick = () => {
      if (isTransitioning) return;

      index = i + slides.length;
      move();
    };

    dotsContainer.appendChild(dot);

  });

  function move() {

    isTransitioning = true;

    const itemWidth = allSlides[0].offsetWidth + gap;

    track.style.transition = "transform 0.5s ease";
    track.style.transform = `translateX(${-index * itemWidth}px)`;

    updateDots();

  }

  function updateDots() {

    const dots = dotsContainer.querySelectorAll('button');

    dots.forEach(d => d.classList.remove('active'));

    let activeDot = (index - slides.length) % slides.length;

    if (activeDot < 0) activeDot = slides.length + activeDot;

    dots[activeDot].classList.add('active');

  }

  track.addEventListener('transitionend', () => {

    isTransitioning = false;

    const itemWidth = allSlides[0].offsetWidth + gap;

    if (index >= slides.length * 2) {

      track.style.transition = "none";

      index = slides.length;

      track.style.transform = `translateX(${-index * itemWidth}px)`;

    }

    if (index < slides.length) {

      track.style.transition = "none";

      index = slides.length * 2 - 1;

      track.style.transform = `translateX(${-index * itemWidth}px)`;

    }

  });

  let timer = setInterval(() => {
    index++;
    move();
  }, 3000);

  const itemWidth = allSlides[0].offsetWidth + gap;

  track.style.transition = "none";
  track.style.transform = `translateX(${-index * itemWidth}px)`;

}

window.addEventListener('load', () => {

  setTimeout(() => {
    initSlider();
  }, 100);

});