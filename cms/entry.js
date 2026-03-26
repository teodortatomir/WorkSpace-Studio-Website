const menuOpen = document.getElementById("menuOpen");
const menuClose = document.getElementById("menuClose");
const menuOverlay = document.getElementById("menuOverlay");
const menuItems = document.querySelectorAll(".menu-nav-item");
const menuLinks = document.querySelectorAll(".menu-nav-item a");
const allImages = document.querySelectorAll(".menu-img-item");
const allVisuals = document.querySelectorAll(".menu-visual-item");
const cmsEntryRoot = document.getElementById("cmsEntryRoot");

if (menuOpen && menuClose && menuOverlay) {
    menuOpen.addEventListener("click", () => {
        menuOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
    });

    menuClose.addEventListener("click", () => {
        menuOverlay.classList.remove("active");
        document.body.style.overflow = "";
    });

    menuItems.forEach(item => {
        item.addEventListener("mouseenter", () => {
            const targetId = item.getAttribute("data-target");
            allVisuals.forEach(visual => visual.classList.remove("active"));
            document.querySelectorAll(`[data-visual-target="${targetId}"]`).forEach(visual => visual.classList.add("active"));
        });
    });

    menuLinks.forEach(link => {
        link.addEventListener("click", () => {
            menuOverlay.classList.remove("active");
            document.body.style.overflow = "";
        });
    });
}

function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function buildParagraphs(body) {
    return String(body || "")
        .split(/\n{2,}/)
        .map(block => block.trim())
        .filter(Boolean)
        .map(block => `<p>${escapeHtml(block)}</p>`)
        .join("");
}

if (cmsEntryRoot && window.WorkspaceCMS) {
    const type = getQueryParam("type");
    const slug = getQueryParam("slug");
    const entry = window.WorkspaceCMS.getEntry(type, slug);

    if (!entry) {
        cmsEntryRoot.innerHTML = `
            <section class="article-hero">
                <div class="article-hero-copy">
                    <span class="article-kicker">Not Found</span>
                    <h1>This entry could not be found.</h1>
                    <p>The item may have been removed or the link may be incomplete.</p>
                </div>
            </section>
        `;
    } else {
        const gallery = entry.gallery.length ? entry.gallery : [entry.coverImage, entry.coverImage].filter(Boolean);
        const typeLabel = entry.type.charAt(0).toUpperCase() + entry.type.slice(1);
        const sourceButton = entry.sourceLink
            ? `<a class="article-link" href="${entry.sourceLink}" target="_blank" rel="noopener noreferrer">Open Source</a>`
            : "";

        cmsEntryRoot.innerHTML = `
            <section class="article-hero">
                <div class="article-hero-copy reveal reveal-left">
                    <span class="article-kicker">${escapeHtml(entry.category || typeLabel)}</span>
                    <h1>${escapeHtml(entry.title)}</h1>
                    <p>${escapeHtml(entry.summary || "")}</p>
                    <div class="article-meta">
                        <span>${escapeHtml(typeLabel)}</span>
                        <span>${escapeHtml(new Date(entry.publishedAt).toLocaleDateString("en-GB"))}</span>
                    </div>
                    ${sourceButton}
                </div>
                <figure class="article-hero-media reveal reveal-right">
                    <img src="${escapeHtml(entry.coverImage || "../projects-pictures/skytower-hero.jpg")}" alt="${escapeHtml(entry.title)}">
                </figure>
            </section>
            <section class="article-body">
                <div class="article-content">
                    <div class="article-section reveal reveal-up">
                        <h2>${escapeHtml(entry.title)}</h2>
                        ${buildParagraphs(entry.body || entry.summary || "")}
                    </div>
                </div>
            </section>
            <section class="article-gallery">
                ${gallery.map((image, index) => `
                    <figure class="reveal ${index % 2 === 0 ? "reveal-left" : "reveal-right"}">
                        <img src="${escapeHtml(image)}" alt="${escapeHtml(entry.title)}">
                    </figure>
                `).join("")}
            </section>
        `;
    }
}

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
