{{indent}}const menuOpen = document.getElementById('menuOpen');
{{indent}}const menuClose = document.getElementById('menuClose');
{{indent}}const menuOverlay = document.getElementById('menuOverlay');
{{indent}}const menuItems = document.querySelectorAll('.menu-nav-item');
{{indent}}const menuLinks = document.querySelectorAll('.menu-nav-item a');
{{indent}}const allImages = document.querySelectorAll('.menu-img-item');
{{indent}}const allVisuals = document.querySelectorAll('.menu-visual-item');

{{indent}}document.querySelectorAll('.menu-img-item').forEach(img => {
{{indent}}    const loader = new Image();
{{indent}}    loader.src = img.src;
{{indent}}});

{{indent}}menuOpen.addEventListener('click', () => {
{{indent}}    menuOverlay.classList.add('active');
{{indent}}    document.body.style.overflow = 'hidden';
{{indent}}});

{{indent}}menuClose.addEventListener('click', () => {
{{indent}}    menuOverlay.classList.remove('active');
{{indent}}    document.body.style.overflow = '';
{{indent}}});

{{indent}}function closeMenuOverlay() {
{{indent}}    menuOverlay.classList.remove('active');
{{indent}}    document.body.style.overflow = '';
{{indent}}}

{{indent}}menuItems.forEach(item => {
{{indent}}    item.addEventListener('mouseenter', () => {
{{indent}}        const targetId = item.getAttribute('data-target');
{{indent}}        allVisuals.forEach(visual => visual.classList.remove('active'));
{{indent}}        document.querySelectorAll(`[data-visual-target="${targetId}"]`).forEach(visual => visual.classList.add('active'));
{{indent}}    });
{{indent}}});

{{indent}}menuLinks.forEach(link => {
{{indent}}    link.addEventListener('click', () => {
{{indent}}        closeMenuOverlay();
{{indent}}    });
{{indent}}});

