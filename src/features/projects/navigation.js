
            const menuOpen = document.getElementById('menuOpen');
            const menuClose = document.getElementById('menuClose');
            const menuOverlay = document.getElementById('menuOverlay');
            const menuItems = document.querySelectorAll('.menu-nav-item');
            const menuLinks = document.querySelectorAll('.menu-nav-item a');
            const allImages = document.querySelectorAll('.menu-img-item');
            const allVisuals = document.querySelectorAll('.menu-visual-item');
            const nav = document.querySelector(".navbar");

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

            const handleNavScroll = () => {
                // CÄƒutÄƒm Hero-ul de fiecare datÄƒ Ã®n caz cÄƒ React l-a randat mai tÃ¢rziu
                const heroSection = document.querySelector(".hero-abstract");
                
                if (!heroSection) {
                    // DacÄƒ Ã®ncÄƒ nu a apÄƒrut Hero-ul, dar am scrollat puÈ›in, Ã®l arÄƒtÄƒm oricum
                    if (window.scrollY > 300) nav.classList.add("visible-nav");
                    return;
                }

                const heroHeight = heroSection.offsetHeight;
                
                if (window.scrollY >= heroHeight - 100) {
                    nav.classList.add("visible-nav");
                    nav.classList.remove("hidden-nav");
                } else {
                    nav.classList.remove("visible-nav");
                    nav.classList.add("hidden-nav");
                }
            };

            window.addEventListener("scroll", handleNavScroll);
            
            // VerificÄƒm la intervale mici la Ã®nceput (fix pentru React)
            const retryInterval = setInterval(() => {
                handleNavScroll();
                if (document.querySelector(".hero-abstract")) clearInterval(retryInterval);
            }, 100);

            // Oprirea intervalului dupÄƒ 3 secunde oricum
            setTimeout(() => clearInterval(retryInterval), 3000);
        