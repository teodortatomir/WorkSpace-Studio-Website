const menuOpen = document.getElementById('menuOpen');
const menuClose = document.getElementById('menuClose');
const menuOverlay = document.getElementById('menuOverlay');
const menuItems = document.querySelectorAll('.menu-nav-item');
const menuLinks = document.querySelectorAll('.menu-nav-item a');
const allVisuals = document.querySelectorAll('.menu-visual-item');
const hubCards = Array.from(document.querySelectorAll('.hub-story-card'));
const filterButtons = document.querySelectorAll('.hub-chip');
const loadMoreButton = document.getElementById('hubLoadMore');
const pageSize = 8;
let activeFilter = 'all';
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

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

hubCards.forEach((card, index) => {
    card.dataset.index = String(index);
});

function getMatchingCards() {
    return hubCards.filter(card => {
        const tags = card.dataset.tags || '';
        return activeFilter === 'all' || tags.includes(activeFilter);
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
        activeFilter = button.dataset.filter || 'all';
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
