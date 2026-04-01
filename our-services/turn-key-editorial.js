const menuOpen = document.getElementById("menuOpen");
const menuClose = document.getElementById("menuClose");
const menuOverlay = document.getElementById("menuOverlay");
const menuItems = document.querySelectorAll(".menu-nav-item");
const menuLinks = document.querySelectorAll(".menu-nav-item a");
const allVisuals = document.querySelectorAll(".menu-visual-item");
const revealItems = document.querySelectorAll(".reveal");
const stageButtons = document.querySelectorAll(".tk-route-switch");
const stageImage = document.getElementById("tkRouteImage");
const stageLabel = document.getElementById("tkRouteLabel");
const stageTitle = document.getElementById("tkRouteTitle");
const stageText = document.getElementById("tkRouteText");
const galleryButtons = document.querySelectorAll(".tk-gallery-thumb");
const galleryImage = document.getElementById("tkGalleryImage");
const galleryCaptionTitle = document.getElementById("tkGalleryCaptionTitle");
const galleryCaptionText = document.getElementById("tkGalleryCaptionText");

const stageContent = {
    brief: {
        label: "Phase 01",
        title: "We align ambition, budget, timelines, and what success should look like on day one.",
        text: "This is the moment where complexity is reduced before it grows. Scope, procurement logic, technical needs, and the visual direction all move into one readable route.",
        image: "design_and_build.jpg",
        alt: "Project briefing and coordination"
    },
    build: {
        label: "Phase 02",
        title: "Technical information, contractors, suppliers, and sequencing start moving as one system.",
        text: "Instead of fragmented site decisions, turn-key delivery keeps construction, MEP coordination, partitions, finishes, and furniture integration connected while the project is still evolving.",
        image: "turn-key-pictures/build.jpg",
        alt: "Site works and technical coordination"
    },
    finish: {
        label: "Phase 03",
        title: "The office is styled, installed, and handed over as a space with atmosphere, not just completion.",
        text: "The last phase is where everything needs to feel settled. Furniture, accessories, branding touchpoints, and final visual adjustments turn a finished site into a finished workplace.",
        image: "../projects-pictures/intero.jpg",
        alt: "Completed office handover"
    }
};

const galleryContent = {
    atmosphere: {
        image: "../projects-pictures/aj.jpg",
        alt: "Finished workplace atmosphere",
        title: "Finished atmosphere",
        text: "The last layer is what makes the office feel intentional instead of merely completed."
    },
    detail: {
        image: "../images/omvpetrom-header.jpg",
        alt: "Completed workplace details",
        title: "Material detail",
        text: "Turn-key quality shows up in joins, finishes, furniture lines, and all the small visual decisions clients notice first."
    },
    integration: {
        image: "../projects-pictures/laguna.jpg",
        alt: "Integrated workplace planning",
        title: "Integrated planning",
        text: "Architecture, furniture, and circulation read better when they are solved together rather than in separate packages."
    },
    delivery: {
        image: "../projects-pictures/loreal-romania.jpg",
        alt: "Project delivery coordination",
        title: "Delivery control",
        text: "A strong turn-key process reduces guesswork on site and gives the client a clearer, more confident path to handover."
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

function setStage(stageKey) {
    const content = stageContent[stageKey];
    if (!content || !stageImage || !stageLabel || !stageTitle || !stageText) {
        return;
    }

    stageButtons.forEach((button) => {
        const isActive = button.dataset.stage === stageKey;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    stageImage.src = content.image;
    stageImage.alt = content.alt;
    stageLabel.textContent = content.label;
    stageTitle.textContent = content.title;
    stageText.textContent = content.text;
}

function setGallery(galleryKey) {
    const content = galleryContent[galleryKey];
    if (!content || !galleryImage || !galleryCaptionTitle || !galleryCaptionText) {
        return;
    }

    galleryButtons.forEach((button) => {
        const isActive = button.dataset.gallery === galleryKey;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    galleryImage.src = content.image;
    galleryImage.alt = content.alt;
    galleryCaptionTitle.textContent = content.title;
    galleryCaptionText.textContent = content.text;
}

stageButtons.forEach((button) => {
    button.addEventListener("click", () => {
        setStage(button.dataset.stage);
    });
});

galleryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        setGallery(button.dataset.gallery);
    });
});

setStage("brief");
setGallery("atmosphere");
