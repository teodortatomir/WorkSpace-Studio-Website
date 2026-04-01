const menuOpen = document.getElementById('menuOpen');
const menuClose = document.getElementById('menuClose');
const menuOverlay = document.getElementById('menuOverlay');
const menuItems = document.querySelectorAll('.menu-nav-item');
const menuLinks = document.querySelectorAll('.menu-nav-item a');
const allVisuals = document.querySelectorAll('.menu-visual-item');
const articleRoot = document.getElementById('articleRoot');
const articleSlug = document.body.dataset.article;
const articleProgressBar = document.getElementById('articleProgressBar');
const lightbox = document.getElementById('ergoLightbox');
const lightboxImage = document.getElementById('ergoLightboxImage');
const lightboxClose = document.getElementById('ergoLightboxClose');

document.querySelectorAll('.menu-img-item').forEach((img) => {
    const loader = new Image();
    loader.src = img.src;
});

menuOpen?.addEventListener('click', () => {
    menuOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
});

menuClose?.addEventListener('click', () => {
    menuOverlay?.classList.remove('active');
    document.body.style.overflow = '';
});

menuItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
        const targetId = item.getAttribute('data-target');
        allVisuals.forEach((visual) => visual.classList.remove('active'));
        document.querySelectorAll(`[data-visual-target="${targetId}"]`).forEach((visual) => visual.classList.add('active'));
    });
});

menuLinks.forEach((link) => {
    link.addEventListener('click', () => {
        menuOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    });
});

function renderSectionContent(section) {
    const blocks = section.blocks || (section.paragraphs || []).map((paragraph) => ({
        type: 'paragraph',
        text: paragraph
    }));

    return blocks.map((block) => {
        if (block.type === 'quote') {
            return `
                <blockquote class="ergo-article-quote">
                    <p>${block.text}</p>
                    ${block.author ? `<cite>${block.author}</cite>` : ''}
                </blockquote>
            `;
        }

        if (block.type === 'note') {
            return `
                <div class="ergo-article-note">
                    ${block.label ? `<span class="ergo-article-note-label">${block.label}</span>` : ''}
                    <p>${block.text}</p>
                </div>
            `;
        }

        if (block.type === 'list') {
            const tag = block.ordered ? 'ol' : 'ul';
            return `
                <div class="ergo-article-list-block">
                    ${block.title ? `<h3>${block.title}</h3>` : ''}
                    <${tag}>
                        ${(block.items || []).map((item) => `<li>${item}</li>`).join('')}
                    </${tag}>
                </div>
            `;
        }

        if (block.type === 'image') {
            return `
                <figure class="ergo-inline-figure">
                    <img src="${block.src}" alt="${block.alt || ''}">
                    ${block.caption ? `<figcaption>${block.caption}</figcaption>` : ''}
                </figure>
            `;
        }

        if (block.type === 'imageRow') {
            return `
                <div class="ergo-inline-image-row">
                    ${(block.images || []).map((image) => `
                        <figure class="ergo-inline-figure">
                            <img src="${image.src}" alt="${image.alt || ''}">
                            ${image.caption ? `<figcaption>${image.caption}</figcaption>` : ''}
                        </figure>
                    `).join('')}
                </div>
            `;
        }

        return `<p>${block.text}</p>`;
    }).join('');
}

function renderArticle() {
    if (!articleRoot || !articleSlug || !window.ERGO_ARTICLES?.[articleSlug]) return;

    const article = window.ERGO_ARTICLES[articleSlug];
    const nextArticle = window.ERGO_ARTICLES[article.next];

    articleRoot.innerHTML = `
        <section class="ergo-article-shell ergo-article-hero">
            <div class="ergo-article-copy reveal reveal-left">
                <span class="ergo-article-kicker">${article.category}</span>
                <h1>${article.title}</h1>
                <p class="ergo-article-intro">${article.intro}</p>
                <div class="ergo-article-meta">
                    <span>${article.theme}</span>
                    <span>${article.readingTime}</span>
                    <span>Workspace Studio Ergonomics</span>
                </div>
                <div class="ergo-keypoints">
                    <span class="ergo-keypoint-label">Key points</span>
                    <ul>
                        ${article.keyPoints.map((point) => `<li>${point}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <figure class="ergo-article-media reveal reveal-right">
                <img src="${article.heroImage}" alt="${article.heroAlt}">
            </figure>
        </section>

        <section class="ergo-article-shell ergo-article-grid">
            <aside class="ergo-article-sidebar reveal reveal-left">
                <div>
                    <span class="ergo-keypoint-label">In this article</span>
                    <nav class="ergo-sidebar-nav" id="ergoSidebarNav">
                        ${article.sections.map((section, index) => `<a class="ergo-sidebar-link" href="#section-${index}">${section.heading}</a>`).join('')}
                    </nav>
                </div>
                <div class="ergo-article-quickfacts">
                    <span class="ergo-quickfact-label">Quick facts</span>
                    ${article.facts.map((fact) => `
                        <div class="ergo-quickfact">
                            <span class="ergo-quickfact-value">${fact.value}</span>
                            <span class="ergo-quickfact-copy">${fact.label}</span>
                        </div>
                    `).join('')}
                </div>
            </aside>

            <div class="ergo-article-content">
                ${article.sections.map((section, index) => `
                    <section class="ergo-article-section reveal reveal-up" id="section-${index}">
                        <h2>${section.heading}</h2>
                        ${renderSectionContent(section)}
                    </section>
                `).join('')}
            </div>
        </section>

        ${article.gallery?.length ? `
        <section class="ergo-article-shell ergo-article-gallery">
            ${article.gallery.map((image, index) => `
                <figure class="reveal ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}" data-image="${image.src}" data-alt="${image.alt}">
                    <img src="${image.src}" alt="${image.alt}">
                    <figcaption>${image.caption}</figcaption>
                </figure>
            `).join('')}
        </section>
        ` : ''}

        ${article.credits?.length ? `
        <section class="ergo-article-shell ergo-article-credits">
            <div class="ergo-article-credits-head reveal reveal-left">
                <span class="ergo-keypoint-label">Credits</span>
                <h2>People Behind The Research</h2>
            </div>
            <div class="ergo-credits-grid">
                ${article.credits.map((credit, index) => `
                    <article class="ergo-credit-card reveal ${index % 2 === 0 ? 'reveal-up' : 'reveal-right'}">
                        <h3>${credit.name}</h3>
                        ${credit.role ? `<p class="ergo-credit-role">${credit.role}</p>` : ''}
                        <p>${credit.bio}</p>
                    </article>
                `).join('')}
            </div>
        </section>
        ` : ''}

        <section class="ergo-article-shell ergo-next">
            <h2 class="reveal reveal-left">Continue with</h2>
            <a class="ergo-next-card reveal reveal-up" href="${article.next}.html">
                <img src="${nextArticle.heroImage}" alt="${nextArticle.heroAlt}">
                <div class="ergo-next-copy">
                    <span class="ergo-article-kicker">${nextArticle.category}</span>
                    <h3>${nextArticle.title}</h3>
                    <p>${nextArticle.intro}</p>
                    <span class="ergo-next-link">Open article</span>
                </div>
            </a>
        </section>
    `;
}

renderArticle();

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const id = entry.target.id;
        const link = document.querySelector(`.ergo-sidebar-link[href="#${id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
            document.querySelectorAll('.ergo-sidebar-link').forEach((item) => item.classList.remove('is-active'));
            link.classList.add('is-active');
        }
    });
}, { threshold: 0.45 });

document.querySelectorAll('.ergo-article-section').forEach((section) => sectionObserver.observe(section));

window.addEventListener('scroll', () => {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = height > 0 ? (window.scrollY / height) * 100 : 0;
    if (articleProgressBar) articleProgressBar.style.width = `${Math.min(progress, 100)}%`;
});

document.querySelectorAll('.ergo-article-gallery figure').forEach((figure) => {
    figure.addEventListener('click', () => {
        if (!lightbox || !lightboxImage) return;
        lightbox.classList.add('is-open');
        lightboxImage.src = figure.dataset.image || '';
        lightboxImage.alt = figure.dataset.alt || '';
        document.body.style.overflow = 'hidden';
    });
});

function closeLightbox() {
    lightbox?.classList.remove('is-open');
    document.body.style.overflow = '';
}

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
});
