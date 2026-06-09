const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const overlay = document.querySelector(".menu-overlay");
const closeTargets = document.querySelectorAll("[data-menu-close]");

if (header && toggle && mobileMenu && overlay) {
  const openMenu = () => {
    header.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    overlay.hidden = false;
    mobileMenu.hidden = false;

    const firstLink = mobileMenu.querySelector("a, button");
    firstLink?.focus();
  };

  const closeMenu = () => {
    header.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    overlay.hidden = true;
    mobileMenu.hidden = true;
    toggle.focus();
  };

  const isOpen = () => header.classList.contains("is-open");

  // Toggle botón hamburguesa
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    isOpen() ? closeMenu() : openMenu();
  });

  // Click en overlay
  overlay.addEventListener("click", closeMenu);

  // Click en links del menú
  closeTargets.forEach((el) => el.addEventListener("click", closeMenu));

  // ⬅️ CLICK AFUERA REAL
  document.addEventListener("click", (e) => {
    if (!isOpen()) return;

    const clickedInsideMenu =
      mobileMenu.contains(e.target) || toggle.contains(e.target);

    if (!clickedInsideMenu) {
      closeMenu();
    }
  });

  // Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) closeMenu();
  });

  // Resize → cierra si pasa a desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && isOpen()) closeMenu();
  });
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const revealTargets = document.querySelectorAll(
  "main > .section:not(.hero), .services-page .sp-service"
);

if (!prefersReducedMotion.matches && revealTargets.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealTargets.forEach((target) => {
    target.classList.add("js-reveal");
    revealObserver.observe(target);
  });
}

const carousels = document.querySelectorAll("[data-carousel]");

carousels.forEach((carousel) => {
  const slides = carousel.querySelectorAll(".sp-carousel-slide");
  const dots = carousel.querySelectorAll("[data-carousel-dot]");
  const prevButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");

  if (!slides.length || !prevButton || !nextButton) return;

  let currentIndex = 0;
  let autoplayId = null;

  const renderSlide = (index) => {
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === index);
    });

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === index;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-pressed", String(isActive));
    });
  };

  const goToSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    renderSlide(currentIndex);
  };

  const stopAutoplay = () => {
    if (!autoplayId) return;
    window.clearInterval(autoplayId);
    autoplayId = null;
  };

  const startAutoplay = () => {
    if (prefersReducedMotion.matches) return;
    stopAutoplay();
    autoplayId = window.setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 4500);
  };

  prevButton.addEventListener("click", () => {
    goToSlide(currentIndex - 1);
    startAutoplay();
  });

  nextButton.addEventListener("click", () => {
    goToSlide(currentIndex + 1);
    startAutoplay();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      goToSlide(Number(dot.dataset.carouselDot));
      startAutoplay();
    });
  });

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);

  renderSlide(currentIndex);
  startAutoplay();
});
