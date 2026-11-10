const menuOpen = document.getElementById('menuOpen');
const menuClose = document.getElementById('menuClose');
const menuOverlay = document.getElementById('menuOverlay');
const menuItems = document.querySelectorAll('.menu-nav-item');
const menuLinks = document.querySelectorAll('.menu-nav-item a');
const allImages = document.querySelectorAll('.menu-img-item');
const articleRoot = document.getElementById('articleRoot');
const articleSlug = document.body.dataset.article;

if (menuOpen && menuClose && menuOverlay) {
    document.querySelectorAll('.menu-img-item').forEach(img => {
        const loader = new Image();
        loader.src = img.src;
    });

    menuOpen.addEventListener('click', () => {
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    menuClose.addEventListener('click', () => {
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    function closeMenuOverlay() {
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const targetId = item.getAttribute('data-target');
            allImages.forEach(img => img.classList.remove('active'));
            const targetImg = document.getElementById(targetId);
            if (targetImg) targetImg.classList.add('active');
        });
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenuOverlay();
        });
    });
}

if (articleRoot && articleSlug && window.INSIGHTS_ARTICLES?.[articleSlug]) {
    const article = window.INSIGHTS_ARTICLES[articleSlug];
    const nextArticle = window.INSIGHTS_ARTICLES[article.next];

    articleRoot.innerHTML = `
        <section class="article-hero">
            <div class="article-hero-copy reveal reveal-left">
                <span class="article-kicker">${article.category}</span>
                <h1>${article.title}</h1>
                <p>${article.intro}</p>
                <div class="article-meta">
                    <span>Publication</span>
                    <span>Workspace Studio Insights</span>
                    <span>Reading time: ${article.readingTime}</span>
                </div>
            </div>
            <figure class="article-hero-media reveal reveal-right">
                <img src="${article.heroImage}" alt="${article.heroAlt}">
            </figure>
        </section>
        <section class="article-body">
            <aside class="article-sidebar reveal reveal-left">
                <h3>In this story</h3>
                <ul>
                    ${article.sidebar.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </aside>
            <div class="article-content">
                ${article.sections.map(section => `
                    <div class="article-section reveal reveal-up">
                        <h2>${section.heading}</h2>
                        ${section.paragraphs.map(paragraph => `<p>${paragraph}</p>`).join('')}
                    </div>
                `).join('')}
            </div>
        </section>
        <section class="article-gallery">
            ${article.gallery.map((image, index) => `
                <figure class="reveal ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}">
                    <img src="${image.src}" alt="${image.alt}">
                </figure>
            `).join('')}
        </section>
        <section class="article-next">
            <h2 class="reveal reveal-left">Continue Reading</h2>
            <a class="article-next-card reveal reveal-up" href="${article.next}.html">
                <img src="${nextArticle.heroImage}" alt="${nextArticle.heroAlt}">
                <div class="article-next-copy">
                    <span class="article-kicker">Next Publication</span>
                    <h3>${nextArticle.title}</h3>
                    <p>${nextArticle.intro}</p>
                    <span class="article-link">Open Article</span>
                </div>
            </a>
        </section>
    `;
}

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
