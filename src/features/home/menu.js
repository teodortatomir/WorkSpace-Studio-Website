                        // --- LOGICA MENIU OVERLAY (STRICT PERFORMANCE) ---
        const heroMenuOpen = document.getElementById('heroMenuOpen');
        const menuOpen = document.getElementById('menuOpen');
        const menuClose = document.getElementById('menuClose');
        const menuOverlay = document.getElementById('menuOverlay');
        const menuItems = document.querySelectorAll('.menu-nav-item');
        const menuLinks = document.querySelectorAll('.menu-nav-item a');
        const allImages = document.querySelectorAll('.menu-img-item');
        const allVisuals = document.querySelectorAll('.menu-visual-item');
        let menuImagesLoaded = false;

        function loadMenuImages() {
            if (menuImagesLoaded) return;
            allImages.forEach(img => {
                if (img.dataset.src && !img.src) {
                    img.src = img.dataset.src;
                }
            });
            menuImagesLoaded = true;
        }

        function openMenuOverlay() {
            loadMenuImages();
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        menuOpen.addEventListener('click', openMenuOverlay);
        heroMenuOpen?.addEventListener('click', openMenuOverlay);

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
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                closeMenuOverlay();
            });
        });
        