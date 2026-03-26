const menuOpen = document.getElementById('menuOpen');
const menuClose = document.getElementById('menuClose');
const menuOverlay = document.getElementById('menuOverlay');
const menuItems = document.querySelectorAll('.menu-nav-item');
const menuLinks = document.querySelectorAll('.menu-nav-item a');
const allImages = document.querySelectorAll('.menu-img-item');

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

const revealElements = document.querySelectorAll('.reveal');

revealElements.forEach((element, index) => {
    const groupParent = element.closest('.about-stats, .about-capabilities-grid, .about-editorial-grid, .about-hero-gallery, .about-story-visuals');

    if (groupParent) {
        element.style.transitionDelay = `${Math.min(index % 4, 3) * 0.08}s`;
    }
});

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

revealElements.forEach(el => revealObserver.observe(el));
