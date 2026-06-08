const menuOpen = document.querySelector(".menu-open");
const menuClose = document.querySelector(".menu-close");
const menuOverlay = document.querySelector(".menu-overlay");
const menuItems = document.querySelectorAll(".menu-nav-item");
const menuLinks = document.querySelectorAll(".menu-nav-item a");
const allVisuals = document.querySelectorAll(".menu-visual-item");

if (menuOpen && menuClose && menuOverlay) {
  const openMenu = () => {
    menuOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    menuOverlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  menuOpen.addEventListener("click", openMenu);
  menuClose.addEventListener("click", closeMenu);
  menuOverlay.addEventListener("click", (event) => {
    if (event.target === menuOverlay) closeMenu();
  });

  menuItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      allVisuals.forEach((visual) => visual.classList.remove("active"));
      const target = item.getAttribute("data-target");
      document.querySelectorAll(`.menu-visual-item[data-visual-target="${target}"]`).forEach((visual) => {
        visual.classList.add("active");
      });
    });
  });

  menuLinks.forEach((link) => link.addEventListener("click", closeMenu));
}

const revealItems = document.querySelectorAll(".furniture-reveal");

if (revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 45, 220)}ms`;
    observer.observe(item);
  });
}

const workspaceSlider = document.querySelector("[data-workspace-slider]");

if (workspaceSlider) {
  const slides = workspaceSlider.querySelectorAll("[data-workspace-slide]");
  const previousButton = workspaceSlider.querySelector("[data-workspace-prev]");
  const nextButton = workspaceSlider.querySelector("[data-workspace-next]");
  const dots = workspaceSlider.querySelectorAll(".furniture-slider-dots span");
  let activeIndex = 0;
  let autoplayId;

  const activateSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
    });
  };

  const startAutoplay = () => {
    window.clearInterval(autoplayId);
    autoplayId = window.setInterval(() => activateSlide(activeIndex + 1), 7000);
  };

  const goToSlide = (index) => {
    activateSlide(index);
    startAutoplay();
  };

  previousButton?.addEventListener("click", () => goToSlide(activeIndex - 1));
  nextButton?.addEventListener("click", () => goToSlide(activeIndex + 1));
  startAutoplay();
}
