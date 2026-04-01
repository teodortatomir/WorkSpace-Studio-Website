const menuOpen = document.getElementById('menuOpen');
const menuClose = document.getElementById('menuClose');
const menuOverlay = document.getElementById('menuOverlay');
const menuItems = document.querySelectorAll('.menu-nav-item');
const menuLinks = document.querySelectorAll('.menu-nav-item a');
const allVisuals = document.querySelectorAll('.menu-visual-item');
const hubCards = document.querySelectorAll('.hub-story-card');
const filterButtons = document.querySelectorAll('.hub-chip');
const previewTitle = document.getElementById('hubPreviewTitle');
const previewText = document.getElementById('hubPreviewText');
const previewLink = document.getElementById('hubPreviewLink');
const previewImage = document.getElementById('hubPreviewImage');

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

function setPreview(card) {
    const title = card.querySelector('h3')?.textContent || '';
    const text = card.querySelector('p')?.textContent || '';
    const image = card.querySelector('img');

    if (previewTitle) previewTitle.textContent = title;
    if (previewText) previewText.textContent = text;
    if (previewLink) previewLink.href = card.href;
    if (image && previewImage) {
        previewImage.src = image.src;
        previewImage.alt = image.alt;
    }
}

hubCards.forEach((card, index) => {
    card.dataset.index = String(index);
    card.addEventListener('mouseenter', () => setPreview(card));
    card.addEventListener('focus', () => setPreview(card));
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter || 'all';

        filterButtons.forEach(entry => entry.classList.remove('is-active'));
        button.classList.add('is-active');

        let firstVisibleCard = null;

        hubCards.forEach(card => {
            const tags = card.dataset.tags || '';
            const match = filter === 'all' || tags.includes(filter);
            card.classList.toggle('is-hidden', !match);
            if (match && !firstVisibleCard) firstVisibleCard = card;
        });

        if (firstVisibleCard) setPreview(firstVisibleCard);
    });
});
