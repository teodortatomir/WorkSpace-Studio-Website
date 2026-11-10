                    const isMobileImageViewport = () => window.matchMedia('(max-width: 768px)').matches;

                    const getResponsiveImageSrc = (img, fallbackSrc) => {
                        if (isMobileImageViewport() && img?.dataset.mobileSrc) {
                            return img.dataset.mobileSrc;
                        }
                        return fallbackSrc;
                    };

                    const loadDeferredImage = (img) => {
                        if (!img?.dataset.deferSrc) return;
                        img.src = getResponsiveImageSrc(img, img.dataset.deferSrc);
                        img.removeAttribute('data-defer-src');
                    };

                    const observeDeferredImages = (root = document) => {
                        const images = Array.from(root.querySelectorAll('img[data-defer-src]'));
                        if (!images.length) return;

                        if (!('IntersectionObserver' in window)) {
                            images.forEach(loadDeferredImage);
                            return;
                        }

                        const observer = new IntersectionObserver((entries, imageObserver) => {
                            entries.forEach(entry => {
                                if (!entry.isIntersecting) return;
                                const targets = entry.target.matches('img[data-defer-src]')
                                    ? [entry.target]
                                    : Array.from(entry.target.querySelectorAll('img[data-defer-src]'));
                                targets.forEach(loadDeferredImage);
                                imageObserver.unobserve(entry.target);
                            });
                        }, {
                            rootMargin: '80px 0px',
                            threshold: 0.01
                        });

                        images.forEach(img => {
                            if (isMobileImageViewport() && img.closest('.project-slider-card, .projects-equal-grid, .split-row')) {
                                return;
                            }
                            const target = isMobileImageViewport() && img.closest('.project-slider-card')
                                ? img.closest('.project-slider-card')
                                : img.closest('.projects-slider')
                                || img.closest('.home-partners-section')
                                || img.closest('.services-gallery-grid')
                                || img.closest('.project-slider-card, .service-gallery-card, .why-us-feature-media, .about-feature-media, .insights-feature-media, .home-shop-media, .home-partner-logo, .split-image')
                                || img;
                            observer.observe(target);
                        });
                    };
