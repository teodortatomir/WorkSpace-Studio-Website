const menuOpen = document.getElementById("menuOpen");
const menuClose = document.getElementById("menuClose");
const menuOverlay = document.getElementById("menuOverlay");
const menuItems = document.querySelectorAll(".menu-nav-item");
const menuLinks = document.querySelectorAll(".menu-nav-item a");
const allVisuals = document.querySelectorAll(".menu-visual-item");
const revealItems = document.querySelectorAll(".reveal");
const designModes = document.querySelectorAll(".design-mode");
const designSystemStage = document.getElementById("designSystemStage");
const designCanvasImage = document.getElementById("designCanvasImage");
const designCanvasLabel = document.getElementById("designCanvasLabel");
const designCanvasTitle = document.getElementById("designCanvasTitle");
const designCanvasText = document.getElementById("designCanvasText");
const teamCards = Array.from(document.querySelectorAll(".design-team-card"));
const teamDots = document.getElementById("teamDots");
const teamPrev = document.getElementById("teamPrev");
const teamNext = document.getElementById("teamNext");
const teamCaptionRole = document.getElementById("teamCaptionRole");
const teamCaptionName = document.getElementById("teamCaptionName");
const teamCaptionText = document.getElementById("teamCaptionText");

const designModesContent = {
    planning: {
        label: "Planning",
        title: "The layout becomes the invisible discipline behind everything that follows.",
        text: "We begin with flow, zoning, adjacency, and how teams actually move through the office over time.",
        image: "design-pictures/planing.jpg",
        alt: "Space planning and circulation"
    },
    architecture: {
        label: "Architecture",
        title: "Walls, thresholds, systems, and transparency are used to give the office structure and rhythm.",
        text: "The architectural layer is where clarity appears: what is open, what is quiet, what is visible, and what is protected.",
        image: "design-pictures/architecture.jpg",
        alt: "Architectural office systems"
    },
    interior: {
        label: "Interior",
        title: "Material tone, light, contrast, and furniture language shape the emotional temperature of the office.",
        text: "Interiors are not styling at the end. They are the atmosphere, softness, tactility, and confidence of the whole experience.",
        image: "../projects-pictures/skytower-block.jpg",
        alt: "Interior atmosphere and materiality"
    },
    branding: {
        label: "Branding",
        title: "Identity works best when it feels embedded in the space rather than placed on top of it.",
        text: "We prefer spatial branding that feels architectural, restrained, and deeply connected to how the company wants to be seen.",
        image: "../projects-pictures/omvpetrom.jpg",
        alt: "Brand identity in workspace design"
    },
    technical: {
        label: "Technical",
        title: "The final quality of a design often depends on the invisible discipline of the technical layer.",
        text: "MEP coordination, detailing, tolerances, and implementation logic are where design is either protected or compromised.",
        image: "../projects-pictures/kraftanlagen.jpg",
        alt: "Technical coordination and detailing"
    }
};

const teamContent = [
    {
        key: "horatiu",
        role: "Managing Partner",
        name: "Horatiu Didea",
        text: "Connects creative ambition with business clarity and keeps the overall design direction aligned with client goals and studio standards."
    },
    {
        key: "delia",
        role: "Architect",
        name: "Delia Didea",
        text: "Shapes the studio's architectural precision and the spatial clarity that makes a project feel composed rather than merely decorated."
    },
    {
        key: "mihai",
        role: "Workspace Studio",
        name: "Mihai Dumitrescu",
        text: "Helps translate the studio's thinking into a clear outward narrative, keeping the design language legible for clients and collaborators."
    }
];

let currentTeamSlide = 0;
let teamAutoplay;

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

function setDesignMode(mode) {
    const content = designModesContent[mode];
    if (!content || !designSystemStage || !designCanvasImage || !designCanvasLabel || !designCanvasTitle || !designCanvasText) {
        return;
    }

    designModes.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.mode === mode);
    });

    designSystemStage.dataset.mode = mode;
    designCanvasImage.src = content.image;
    designCanvasImage.alt = content.alt;
    designCanvasLabel.textContent = content.label;
    designCanvasTitle.textContent = content.title;
    designCanvasText.textContent = content.text;
}

designModes.forEach((button) => {
    const activate = () => setDesignMode(button.dataset.mode);
    button.addEventListener("mouseenter", activate);
    button.addEventListener("focus", activate);
    button.addEventListener("click", activate);
});

function renderTeamDots() {
    if (!teamDots) {
        return;
    }

    teamDots.innerHTML = "";
    teamContent.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.className = "design-team-dot";
        dot.type = "button";
        dot.setAttribute("aria-label", `Go to person ${index + 1}`);
        dot.addEventListener("click", () => {
            showTeamSlide(index);
            restartTeamAutoplay();
        });
        teamDots.appendChild(dot);
    });
}

function showTeamSlide(index) {
    if (!teamCards.length || !teamCaptionRole || !teamCaptionName || !teamCaptionText) {
        return;
    }

    currentTeamSlide = (index + teamCards.length) % teamCards.length;
    const dots = teamDots?.querySelectorAll(".design-team-dot") || [];
    const centerData = teamContent[currentTeamSlide];
    const leftIndex = (currentTeamSlide + 1) % teamCards.length;
    const rightIndex = (currentTeamSlide + 2) % teamCards.length;

    teamCards.forEach((card, cardIndex) => {
        card.classList.remove("is-left", "is-center", "is-right");

        if (cardIndex === currentTeamSlide) {
            card.classList.add("is-center");
            card.style.left = "25%";
            card.style.right = "auto";
        } else if (cardIndex === leftIndex) {
            card.classList.add("is-left");
            card.style.left = "-6%";
            card.style.right = "auto";
        } else {
            card.classList.add("is-right");
            card.style.left = "auto";
            card.style.right = "-6%";
        }
    });

    dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === currentTeamSlide);
    });

    teamCaptionRole.textContent = centerData.role;
    teamCaptionName.textContent = centerData.name;
    teamCaptionText.textContent = centerData.text;
}

function nextTeamSlide() {
    showTeamSlide(currentTeamSlide + 1);
}

function prevTeamSlide() {
    showTeamSlide(currentTeamSlide - 1);
}

function startTeamAutoplay() {
    if (!teamCards.length) {
        return;
    }

    teamAutoplay = window.setInterval(() => {
        nextTeamSlide();
    }, 9000);
}

function restartTeamAutoplay() {
    if (teamAutoplay) {
        window.clearInterval(teamAutoplay);
    }
    startTeamAutoplay();
}

teamPrev?.addEventListener("click", () => {
    prevTeamSlide();
    restartTeamAutoplay();
});

teamNext?.addEventListener("click", () => {
    nextTeamSlide();
    restartTeamAutoplay();
});

teamCards.forEach((card, index) => {
    const activate = () => {
        showTeamSlide(index);
        restartTeamAutoplay();
    };

    card.addEventListener("click", activate);
    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            activate();
        }
    });
});

document.querySelector(".design-team-slider")?.addEventListener("mouseenter", () => {
    if (teamAutoplay) {
        window.clearInterval(teamAutoplay);
    }
});

document.querySelector(".design-team-slider")?.addEventListener("mouseleave", () => {
    startTeamAutoplay();
});

setDesignMode("planning");
renderTeamDots();
showTeamSlide(0);
startTeamAutoplay();
