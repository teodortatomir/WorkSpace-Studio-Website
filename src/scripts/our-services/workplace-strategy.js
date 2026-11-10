<!--@include {"file":"shared/scripts/navigation/service-overlay.js","values":{"gap":"\n","itemArgs":"item"}} -->document.querySelectorAll(".strategy-text-grid, .strategy-process-list, .strategy-contract-grid").forEach((group) => {
  group.querySelectorAll(":scope > article").forEach((item, index) => {
    item.style.setProperty("--strategy-reveal-delay", `${Math.min(index, 5) * 70}ms`);
  });
});

document.querySelectorAll(".strategy-section-heading, .strategy-centered, .strategy-cta").forEach((block) => {
  block.querySelectorAll(":scope > .strategy-eyebrow, :scope > h1, :scope > h2, :scope > p, :scope > a").forEach((item, index) => {
    item.classList.add("reveal");
    item.style.setProperty("--strategy-reveal-delay", `${Math.min(index, 5) * 70}ms`);
  });
});

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
);

revealElements.forEach((element) => revealObserver.observe(element));

const scrollImages = document.querySelectorAll("[data-scroll-image]");
const scrollPanels = document.querySelectorAll("[data-scroll-panel]");
const canAnimateScroll = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ((scrollImages.length || scrollPanels.length) && canAnimateScroll) {
  let ticking = false;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const updateScrollEffects = () => {
    scrollImages.forEach((image) => {
      const rect = image.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const imageCenter = rect.top + rect.height / 2;
      const distance = (imageCenter - viewportCenter) / window.innerHeight;
      const shift = clamp(distance * -44, -28, 28);
      image.style.setProperty("--strategy-scroll-shift", `${shift.toFixed(2)}px`);
    });

    scrollPanels.forEach((panel) => {
      const rect = panel.getBoundingClientRect();
      const progress = clamp((window.innerHeight * 0.72 - rect.top) / (rect.height || 1), 0, 1);
      panel.style.setProperty("--method-progress", progress.toFixed(3));

      const steps = panel.querySelectorAll("[data-scroll-step]");
      steps.forEach((step, index) => {
        const threshold = steps.length <= 1 ? 0 : index / (steps.length - 1);
        step.classList.toggle("is-active", progress >= threshold - 0.08);
      });
    });

    ticking = false;
  };

  const requestScrollUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateScrollEffects);
  };

  updateScrollEffects();
  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);
}
