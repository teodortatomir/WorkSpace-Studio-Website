const menuOpen = document.getElementById('menuOpen');
const menuClose = document.getElementById('menuClose');
const menuOverlay = document.getElementById('menuOverlay');
const menuItems = document.querySelectorAll('.menu-nav-item');
const menuLinks = document.querySelectorAll('.menu-nav-item a');
const allImages = document.querySelectorAll('.menu-img-item');
const publicationsSearch = document.getElementById('publicationsSearch');
const newsSearch = document.getElementById('newsSearch');
const publicationsGrid = document.getElementById('publicationsGrid');
const newsGrid = document.getElementById('newsGrid');

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

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

function attachSearch(input, selector) {
    if (!input) return;

    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        const items = Array.from(document.querySelectorAll(selector));

        items.forEach(item => {
            const haystack = (item.dataset.search || item.textContent || '').toLowerCase();
            item.style.display = haystack.includes(query) ? '' : 'none';
        });
    });
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderCustomPublications() {
    if (!publicationsGrid || !window.WorkspaceCMS) return;

    const entries = window.WorkspaceCMS.getEntriesByType('publication');
    const markup = entries.map(entry => `
        <a class="publication-card reveal reveal-up" href="../cms/entry.html?type=publication&slug=${encodeURIComponent(entry.slug)}" data-search="${escapeHtml(`${entry.title} ${entry.category} ${entry.summary}`)}">
            <img src="${escapeHtml(entry.coverImage || '../projects-pictures/skytower-hero.jpg')}" alt="${escapeHtml(entry.title)}">
            <div class="publication-card-copy">
                <span class="publication-tag">${escapeHtml(entry.category || 'Publication')}</span>
                <h3>${escapeHtml(entry.title)}</h3>
                <p>${escapeHtml(entry.summary || 'Open this story to read the full publication.')}</p>
            </div>
        </a>
    `).join('');

    publicationsGrid.insertAdjacentHTML('beforeend', markup);
}

function renderCustomNews() {
    if (!newsGrid || !window.WorkspaceCMS) return;

    const entries = window.WorkspaceCMS.getEntriesByType('news');
    const markup = entries.map(entry => {
        const href = entry.sourceLink || `../cms/entry.html?type=news&slug=${encodeURIComponent(entry.slug)}`;
        const target = entry.sourceLink ? ` target="_blank" rel="noopener noreferrer"` : '';
        const cta = entry.sourceLink ? 'Read Source' : 'Open Story';

        return `
            <a class="news-grid-card reveal reveal-up" href="${escapeHtml(href)}"${target} data-search="${escapeHtml(`${entry.title} ${entry.category} ${entry.summary}`)}">
                <img src="${escapeHtml(entry.coverImage || '../projects-pictures/skytower-hero.jpg')}" alt="${escapeHtml(entry.title)}">
                <div class="news-grid-copy">
                    <span class="publication-tag">${escapeHtml(entry.category || 'News')}</span>
                    <h3>${escapeHtml(entry.title)}</h3>
                    <p>${escapeHtml(entry.summary || 'Open this story to read more.')}</p>
                    <span class="news-source-link">${cta}</span>
                </div>
            </a>
        `;
    }).join('');

    newsGrid.insertAdjacentHTML('beforeend', markup);
}

renderCustomPublications();
renderCustomNews();

document.querySelectorAll('.reveal').forEach(el => {
    if (!el.classList.contains('visible')) {
        revealObserver.observe(el);
    }
});

attachSearch(publicationsSearch, '#publicationsGrid .publication-card');
attachSearch(newsSearch, '#newsGrid .news-grid-card');
