const revealItems = document.querySelectorAll(".reveal-on-scroll");

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealItems.forEach((item) => revealObserver.observe(item));

const menuOpen = document.getElementById("menuOpen");
const menuClose = document.getElementById("menuClose");
const menuOverlay = document.getElementById("menuOverlay");
const menuItems = document.querySelectorAll(".menu-nav-item");
const menuLinks = document.querySelectorAll(".menu-nav-item a");
const allVisuals = document.querySelectorAll(".menu-visual-item");

function closeMenuOverlay() {
    menuOverlay.classList.remove("active");
    document.body.style.overflow = "";
}

menuOpen?.addEventListener("click", () => {
    menuOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
});

menuClose?.addEventListener("click", closeMenuOverlay);

menuItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
        const targetId = item.getAttribute("data-target");
        allVisuals.forEach((visual) => visual.classList.remove("active"));
        document.querySelectorAll(`[data-visual-target="${targetId}"]`).forEach((visual) => {
            visual.classList.add("active");
        });
    });
});

menuLinks.forEach((link) => {
    link.addEventListener("click", closeMenuOverlay);
});

const lightbox = document.getElementById("adobeLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

document.querySelectorAll(".gallery-item img").forEach((image) => {
    image.addEventListener("click", () => {
        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        document.body.classList.add("adobe-lightbox-open");
    });
});

function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    document.body.classList.remove("adobe-lightbox-open");
}

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

document.querySelectorAll(".story-lens").forEach((storyLens) => {
    const problemTrigger = storyLens.querySelector(".story-lens-problem-trigger");
    const solutionTrigger = storyLens.querySelector(".story-lens-solution-trigger");

    const setActiveStory = (story) => {
        storyLens.dataset.active = story;
    };

    problemTrigger?.addEventListener("mouseenter", () => setActiveStory("problem"));
    problemTrigger?.addEventListener("focus", () => setActiveStory("problem"));
    problemTrigger?.addEventListener("click", () => setActiveStory("problem"));

    solutionTrigger?.addEventListener("mouseenter", () => setActiveStory("solution"));
    solutionTrigger?.addEventListener("focus", () => setActiveStory("solution"));
    solutionTrigger?.addEventListener("click", () => setActiveStory("solution"));
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenuOverlay();
        if (lightbox.classList.contains("active")) {
            closeLightbox();
        }
    }
});
