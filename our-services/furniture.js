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

document.querySelectorAll(".furniture-hero-copy, .furniture-section-heading, .furniture-copy-stack, .furniture-brand-panel, .furniture-partners-panel, .furniture-workspace-slider, .furniture-cta").forEach((block) => {
  const revealChildren = block.querySelectorAll(":scope > .furniture-kicker, :scope > h1, :scope > h2, :scope > h3, :scope > p, :scope > figure, :scope > .furniture-copy-stack, :scope > .furniture-section-heading, :scope > .furniture-brand-grid, :scope > .furniture-partners-copy, :scope > .furniture-partners-image, :scope > .furniture-partners-proof, :scope > .furniture-workspace-slides, :scope > .furniture-slider-nav, :scope > a");

  revealChildren.forEach((child, index) => {
    child.classList.add("furniture-reveal");
    child.style.setProperty("--furniture-reveal-delay", `${Math.min(index, 5) * 70}ms`);
  });
});

const revealItems = document.querySelectorAll(".furniture-reveal");

if (revealItems.length) {
  const showRevealItem = (item) => {
    item.classList.add("is-visible");
    observer?.unobserve(item);
  };

  const revealPassedItems = () => {
    const triggerPoint = window.innerHeight * 0.92;
    revealItems.forEach((item) => {
      if (item.classList.contains("is-visible")) return;
      if (item.getBoundingClientRect().top < triggerPoint) {
        showRevealItem(item);
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        showRevealItem(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item, index) => {
    if (!item.style.getPropertyValue("--furniture-reveal-delay")) {
      item.style.setProperty("--furniture-reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
    }
    observer.observe(item);
  });

  revealPassedItems();
  window.addEventListener("scroll", revealPassedItems, { passive: true });
  window.addEventListener("resize", revealPassedItems);
}

const workspaceSlider = document.querySelector("[data-workspace-slider]");

if (workspaceSlider) {
  const slides = workspaceSlider.querySelectorAll("[data-workspace-slide]");
  const previousButton = workspaceSlider.querySelector("[data-workspace-prev]");
  const nextButton = workspaceSlider.querySelector("[data-workspace-next]");
  const dots = workspaceSlider.querySelectorAll(".furniture-slider-dots span");
  let activeIndex = 0;
  let autoplayId;
  let resizeId;

  const setSliderHeight = () => {
    const activeSlide = slides[activeIndex];
    if (!activeSlide) return;
    workspaceSlider.style.setProperty("--workspace-slider-height", `${activeSlide.scrollHeight}px`);
  };

  const activateSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
    });

    window.requestAnimationFrame(setSliderHeight);
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
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeId);
    resizeId = window.setTimeout(setSliderHeight, 120);
  });
  window.addEventListener("load", setSliderHeight);
  setSliderHeight();
  startAutoplay();
}
