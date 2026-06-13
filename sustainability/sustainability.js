const menuOpen = document.getElementById("menuOpen");
const menuClose = document.getElementById("menuClose");
const menuOverlay = document.getElementById("menuOverlay");
const menuItems = document.querySelectorAll(".menu-nav-item");
const menuLinks = document.querySelectorAll(".menu-nav-item a");
const allVisuals = document.querySelectorAll(".menu-visual-item");

menuOpen?.addEventListener("click", () => {
    menuOverlay?.classList.add("active");
    document.body.style.overflow = "hidden";
});

menuClose?.addEventListener("click", () => {
    menuOverlay?.classList.remove("active");
    document.body.style.overflow = "";
});

menuItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
        const targetId = item.getAttribute("data-target");
        allVisuals.forEach((visual) => visual.classList.remove("active"));
        document.querySelectorAll(`[data-visual-target="${targetId}"]`).forEach((visual) => visual.classList.add("active"));
    });
});

menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
        menuOverlay?.classList.remove("active");
        document.body.style.overflow = "";
    });
});

document.querySelectorAll(".sustainability-hero-copy, .sustainability-section, .sustainability-cta").forEach((block) => {
    const revealChildren = block.querySelectorAll(":scope > .sustainability-eyebrow, :scope > h1, :scope > h2, :scope > .sustainability-hero-lead, :scope > .sustainability-section-heading, :scope > .sustainability-copy-stack, :scope > a");

    revealChildren.forEach((child, index) => {
        child.classList.add("reveal", "reveal-up");
        child.style.setProperty("--sustainability-reveal-delay", `${Math.min(index, 5) * 70}ms`);
    });
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");

function revealPassedItems() {
    revealItems.forEach((item) => {
        if (item.classList.contains("visible")) return;

        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.88 || rect.bottom < 0) {
            item.classList.add("visible");
        }
    });
}

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });

if (reducedMotion) {
    revealItems.forEach((item) => item.classList.add("visible"));
} else {
    revealItems.forEach((item, index) => {
        if (!item.style.getPropertyValue("--sustainability-reveal-delay")) {
            item.style.setProperty("--sustainability-reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
        }

        revealObserver.observe(item);
    });

    revealPassedItems();
    window.addEventListener("scroll", revealPassedItems, { passive: true });
    window.addEventListener("resize", revealPassedItems);
}
