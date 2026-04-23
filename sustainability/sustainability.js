const menuOpen = document.getElementById("menuOpen");
const menuClose = document.getElementById("menuClose");
const menuOverlay = document.getElementById("menuOverlay");
const menuItems = document.querySelectorAll(".menu-nav-item");
const menuLinks = document.querySelectorAll(".menu-nav-item a");
const allVisuals = document.querySelectorAll(".menu-visual-item");
const revealItems = document.querySelectorAll(".reveal");
const metricValues = document.querySelectorAll(".metric-value");
const materialFilters = document.querySelectorAll(".material-filter");
const faqItems = document.querySelectorAll(".faq-item");
const materialStage = document.querySelector(".material-stage");
const materialStageCopy = document.querySelector(".material-stage-copy");

const materialContent = {
    durability: {
        label: "Durability First",
        title: "A sustainable finish is one that still looks intelligent after years of real use.",
        text: "Instead of chasing novelty, we look for surfaces, textiles, and furniture systems that age well, can be cleaned, repaired, and reconfigured, and avoid the replacement cycle created by fragile trend-led choices.",
        image: "../projects-pictures/skytower-block.jpg",
        alt: "Durable materials in office"
    },
    circularity: {
        label: "Circular Thinking",
        title: "The smartest sustainable object may be the one we keep, adapt, or restore.",
        text: "Circularity is not only about recycled content. It is also about retention, refurbishment, modular systems, and planning interiors that can evolve without becoming demolition waste every time a team changes.",
        image: "../projects-pictures/tchibo.jpg",
        alt: "Circular reuse in workplace design"
    },
    wellbeing: {
        label: "Human Wellbeing",
        title: "If people do not feel good in the space, the sustainability story is incomplete.",
        text: "Lower-impact workplaces should support daylight, healthier materials, acoustics, comfort, and movement. These are sustainability decisions because they increase long-term use, satisfaction, and workplace resilience.",
        image: "../projects-pictures/naos.jpg",
        alt: "Healthy workplace with daylight"
    }
};

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

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });

revealItems.forEach((item) => revealObserver.observe(item));

const metricObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = Number(entry.target.dataset.count || "0");
        let current = 0;
        const stepTime = Math.max(18, Math.floor(1100 / Math.max(target, 1)));

        const counter = setInterval(() => {
            current += 1;
            entry.target.textContent = String(current);
            if (current >= target) {
                clearInterval(counter);
                entry.target.textContent = `${target}+`;
            }
        }, stepTime);

        observer.unobserve(entry.target);
    });
}, { threshold: 0.45 });

metricValues.forEach((metric) => metricObserver.observe(metric));

function updateMaterialStage(key) {
    const data = materialContent[key];
    if (!data) return;

    const label = document.getElementById("materialStageLabel");
    const title = document.getElementById("materialStageTitle");
    const text = document.getElementById("materialStageText");
    const image = document.getElementById("materialStageImage");

    if (label) label.textContent = data.label;
    if (title) title.textContent = data.title;
    if (text) text.textContent = data.text;
    if (image) {
        image.src = data.image;
        image.alt = data.alt;
    }

    syncMaterialStageHeight();
}

function syncMaterialStageHeight() {
    if (!materialStage || !materialStageCopy || window.matchMedia("(max-width: 1180px)").matches) {
        materialStage?.style.removeProperty("--material-stage-height");
        return;
    }

    requestAnimationFrame(() => {
        materialStage.style.setProperty("--material-stage-height", `${materialStageCopy.offsetHeight}px`);
    });
}

materialFilters.forEach((button) => {
    button.addEventListener("click", () => {
        materialFilters.forEach((entry) => entry.classList.remove("is-active"));
        button.classList.add("is-active");
        updateMaterialStage(button.dataset.material || "durability");
    });
});

syncMaterialStageHeight();
window.addEventListener("resize", syncMaterialStageHeight);
window.addEventListener("load", syncMaterialStageHeight);
document.fonts?.ready?.then(syncMaterialStageHeight);

faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");
    trigger?.addEventListener("click", () => {
        item.classList.toggle("is-open");
    });
});
