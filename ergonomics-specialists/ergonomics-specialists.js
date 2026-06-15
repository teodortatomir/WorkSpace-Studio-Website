const menuOpen = document.getElementById('menuOpen');
const menuClose = document.getElementById('menuClose');
const menuOverlay = document.getElementById('menuOverlay');
const menuItems = document.querySelectorAll('.menu-nav-item');
const menuLinks = document.querySelectorAll('.menu-nav-item a');
const allVisuals = document.querySelectorAll('.menu-visual-item');
const hubCards = Array.from(document.querySelectorAll('.hub-story-card'));
const filterButtons = document.querySelectorAll('.hub-chip');
const loadMoreButton = document.getElementById('hubLoadMore');
const scrollRevealItems = document.querySelectorAll(
    '.hub-intro-copy, .ergo-editorial-centered, .ergo-proof-grid article, .hub-chip-row'
);
const pageSize = 8;
let activeFilter = 'physical';
let visibleLimit = pageSize;

document.querySelectorAll('.menu-img-item').forEach(img => {
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

menuItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        const targetId = item.getAttribute('data-target');
        allVisuals.forEach(visual => visual.classList.remove('active'));
        document.querySelectorAll(`[data-visual-target="${targetId}"]`).forEach(visual => visual.classList.add('active'));
    });
});

menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    });
});

document.querySelectorAll('.ergo-editorial-block, .ergo-domain-card').forEach(block => {
    const revealChildren = block.querySelectorAll(':scope > h2, :scope > .ergo-editorial-copy, :scope > figure, :scope > .ergo-domain-copy, :scope > .ergo-domain-link');

    if (!revealChildren.length) {
        return;
    }

    block.classList.remove('reveal');
    revealChildren.forEach((child, index) => {
        child.classList.add('reveal');
        child.style.setProperty('--design-reveal-delay', `${Math.min(index, 5) * 70}ms`);
    });
});

document.querySelectorAll('.ergo-proof-grid article').forEach((item, index) => {
    item.classList.add('reveal');
    item.style.setProperty('--design-reveal-delay', `${Math.min(index, 5) * 70}ms`);
});

document.querySelectorAll('.ergo-domain-grid .ergo-domain-card').forEach((card, index) => {
    card.style.setProperty('--design-reveal-delay', `${Math.min(index, 3) * 70}ms`);
});

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

scrollRevealItems.forEach((item, index) => {
    item.classList.add('scroll-reveal');
    item.style.setProperty('--reveal-order', index % 6);
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');
const allRevealItems = document.querySelectorAll('.reveal, .scroll-reveal');

function revealPassedItems() {
    allRevealItems.forEach(item => {
        if (item.classList.contains('visible')) return;

        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.88 || rect.bottom < 0) {
            item.classList.add('visible');
        }
    });
}

if (reducedMotion) {
    allRevealItems.forEach(item => item.classList.add('visible'));
} else {
    revealItems.forEach((item, index) => {
        if (!item.style.getPropertyValue('--design-reveal-delay')) {
            item.style.setProperty('--design-reveal-delay', `${Math.min(index % 4, 3) * 70}ms`);
        }

        revealObserver.observe(item);
    });

    scrollRevealItems.forEach(item => revealObserver.observe(item));

    revealPassedItems();
    window.addEventListener('scroll', revealPassedItems, { passive: true });
    window.addEventListener('resize', revealPassedItems);
}

hubCards.forEach((card, index) => {
    card.dataset.index = String(index);
});

function getMatchingCards() {
    return hubCards.filter(card => {
        const tags = card.dataset.tags || '';
        return tags.split(/\s+/).includes(activeFilter);
    });
}

function renderHubCards() {
    const matchingCards = getMatchingCards();

    hubCards.forEach(card => {
        const match = matchingCards.includes(card);
        const visibleIndex = matchingCards.indexOf(card);
        card.classList.toggle('is-hidden', !match || visibleIndex >= visibleLimit);
    });

    loadMoreButton?.classList.toggle('is-hidden', matchingCards.length <= visibleLimit);
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        activeFilter = button.dataset.filter || 'physical';
        visibleLimit = pageSize;

        filterButtons.forEach(entry => entry.classList.remove('is-active'));
        button.classList.add('is-active');

        renderHubCards();
    });
});

loadMoreButton?.addEventListener('click', () => {
    visibleLimit += pageSize;
    renderHubCards();
});

renderHubCards();
