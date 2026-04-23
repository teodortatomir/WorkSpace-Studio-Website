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

  menuItems.forEach((item, index) => {
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

const animatedSections = document.querySelectorAll(
  ".consult-hero-copy, .consult-hero-image, .consult-gallery-card, .consult-intro-copy, .consult-benefit-card, .consult-section-head, .consult-approach-card, .consult-steps-copy, .consult-step-card, .consult-strip-image, .consult-strip-copy"
);

animatedSections.forEach((element, index) => {
  const direction = index % 3;
  const initialTransform =
    direction === 0
      ? "translate3d(-28px, 42px, 0) scale(0.985)"
      : direction === 1
        ? "translate3d(0, 42px, 0) scale(0.985)"
        : "translate3d(28px, 42px, 0) scale(0.985)";

  element.style.opacity = "0";
  element.style.transform = initialTransform;
  element.style.transition = `opacity 760ms cubic-bezier(0.22, 1, 0.36, 1) ${index * 35}ms, transform 760ms cubic-bezier(0.22, 1, 0.36, 1) ${index * 35}ms, box-shadow 260ms ease`;
});

if (animatedSections.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translate3d(0, 0, 0) scale(1)";
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  animatedSections.forEach((element) => revealObserver.observe(element));
}

const hoverCards = document.querySelectorAll(
  ".consult-benefit-card, .consult-approach-card, .consult-step-card, .consult-strip-copy"
);

hoverCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-6px)";
    card.style.boxShadow = "0 24px 56px rgba(42, 28, 20, 0.14)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0)";
    card.style.boxShadow = "";
  });
});

const tiltCards = document.querySelectorAll(".consult-gallery-card, .consult-hero-image, .consult-strip-image");

tiltCards.forEach((card) => {
  card.style.transition = "transform 220ms ease, box-shadow 220ms ease";

  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-4px)`;
    card.style.boxShadow = "0 28px 60px rgba(42, 28, 20, 0.16)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
    card.style.boxShadow = "";
  });
});

const parallaxImages = document.querySelectorAll(
  ".consult-hero-image img, .consult-gallery-card img, .consult-strip-image img"
);

parallaxImages.forEach((image) => {
  image.style.transition = "transform 260ms ease";
  image.style.willChange = "transform";
});

const updateParallax = () => {
  const viewportHeight = window.innerHeight;

  parallaxImages.forEach((image) => {
    const rect = image.getBoundingClientRect();
    const distanceFromCenter = rect.top + rect.height / 2 - viewportHeight / 2;
    const offset = distanceFromCenter * -0.04;
    image.style.transform = `scale(1.05) translateY(${offset}px)`;
  });
};

updateParallax();
window.addEventListener("scroll", updateParallax, { passive: true });
window.addEventListener("resize", updateParallax);
