
        const menuOpen = document.getElementById('menuOpen');
        const menuClose = document.getElementById('menuClose');
        const menuOverlay = document.getElementById('menuOverlay');
        const menuItems = document.querySelectorAll('.menu-nav-item');
        const menuLinks = document.querySelectorAll('.menu-nav-item a');
        const allVisuals = document.querySelectorAll('.menu-visual-item');

        function openMenuOverlay() {
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeMenuOverlay() {
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        menuOpen?.addEventListener('click', openMenuOverlay);
        menuClose?.addEventListener('click', closeMenuOverlay);

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

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    