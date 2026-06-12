const menuOpen = document.getElementById('menuOpen');
const menuClose = document.getElementById('menuClose');
const menuOverlay = document.getElementById('menuOverlay');
const menuItems = document.querySelectorAll('.menu-nav-item');
const menuLinks = document.querySelectorAll('.menu-nav-item a');
const allImages = document.querySelectorAll('.menu-img-item');
const allVisuals = document.querySelectorAll('.menu-visual-item');

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
        allVisuals.forEach(visual => visual.classList.remove('active'));
        document.querySelectorAll(`[data-visual-target="${targetId}"]`).forEach(visual => visual.classList.add('active'));
    });
});

menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMenuOverlay();
    });
});

const approachModule = document.querySelector('.about-approach-system');

if (approachModule) {
    const approachImage = approachModule.querySelector('.about-approach-image img');
    const approachCaptionTitle = approachModule.querySelector('.about-approach-image figcaption span');
    const approachCaptionText = approachModule.querySelector('.about-approach-image figcaption p');
    const approachButtons = approachModule.querySelectorAll('.about-approach-principles button');

    const activateApproach = button => {
        approachButtons.forEach(item => {
            item.classList.toggle('active', item === button);
            item.setAttribute('aria-pressed', item === button ? 'true' : 'false');
        });

        if (approachImage) {
            approachImage.style.objectPosition = button.dataset.focus || '50% 50%';
        }

        if (approachCaptionTitle) {
            approachCaptionTitle.textContent = button.textContent.replace(/\s+/g, ' ').replace(/^\d+\s*/, '').trim();
        }

        if (approachCaptionText) {
            approachCaptionText.textContent = button.dataset.caption || '';
        }
    };

    approachButtons.forEach(button => {
        button.addEventListener('mouseenter', () => activateApproach(button));
        button.addEventListener('focus', () => activateApproach(button));
        button.addEventListener('click', () => activateApproach(button));
    });
}

const ecosystemModule = document.querySelector('.about-showroom-knowledge');

if (ecosystemModule) {
    const ecosystemImage = ecosystemModule.querySelector('.about-showroom-panel img');
    const ecosystemTitle = ecosystemModule.querySelector('.about-showroom-panel-copy h3');
    const ecosystemText = ecosystemModule.querySelector('.about-showroom-panel-copy p');
    const ecosystemButtons = ecosystemModule.querySelectorAll('.about-certification-grid button');

    const focusPoints = ['48% 50%', '58% 50%', '68% 50%', '78% 50%'];

    const activateEcosystem = button => {
        ecosystemButtons.forEach((item, index) => {
            const isActive = item === button;
            item.classList.toggle('active', isActive);
            item.setAttribute('aria-pressed', isActive ? 'true' : 'false');

            if (isActive && ecosystemImage) {
                ecosystemImage.style.objectPosition = focusPoints[index] || '50% 50%';
            }
        });

        if (ecosystemTitle) {
            ecosystemTitle.textContent = button.dataset.title || '';
        }

        if (ecosystemText) {
            ecosystemText.textContent = button.dataset.description || '';
        }
    };

    ecosystemButtons.forEach(button => {
        button.addEventListener('mouseenter', () => activateEcosystem(button));
        button.addEventListener('focus', () => activateEcosystem(button));
        button.addEventListener('click', () => activateEcosystem(button));
    });
}

document.querySelectorAll('.about-block, .about-cta').forEach(block => {
    const revealChildren = block.querySelectorAll(':scope > .about-eyebrow, :scope > h1, :scope > h2, :scope > .about-copy, :scope > .about-philosophy-layout, :scope > .about-approach-image, :scope > .about-principles, :scope > .about-people-grid, :scope > .about-millerknoll-badge, :scope > .about-cert-image, :scope > .about-cert-list, :scope > a');

    revealChildren.forEach((child, index) => {
        child.classList.add('reveal', 'reveal-up');
        child.style.transitionDelay = `${Math.min(index, 5) * 0.07}s`;
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
