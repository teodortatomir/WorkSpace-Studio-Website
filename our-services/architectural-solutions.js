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

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function revealPassedItems() {
  revealElements.forEach((item) => {
    if (item.classList.contains("visible")) return;

    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.88 || rect.bottom < 0) {
      item.classList.add("visible");
    }
  });
}

if (reducedMotion) {
  revealElements.forEach((item) => item.classList.add("visible"));
} else {
  revealElements.forEach((element, index) => {
    if (!element.style.getPropertyValue("--arch-reveal-delay")) {
      element.style.setProperty("--arch-reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
    }

    revealObserver.observe(element);
  });

  revealPassedItems();
  window.addEventListener("scroll", revealPassedItems, { passive: true });
  window.addEventListener("resize", revealPassedItems);
}
