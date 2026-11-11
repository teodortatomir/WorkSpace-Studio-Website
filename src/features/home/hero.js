                    observeDeferredImages();
                    window.__workspaceDeferredImagesHandled = true;

                    const video = document.getElementById('heroVideo');
                            const container = document.getElementById('heroTextContainer');
                            const subtitle = document.getElementById('dynamicSubtitle');
                            const title = document.getElementById('dynamicTitle');
                            const desc = document.getElementById('dynamicDesc');
                            const badgesContainer = document.getElementById('heroBadges');
                            const nav = document.querySelector('.navbar');
                            const heroNav = document.getElementById('heroNav');
                            const heroScrollButton = document.getElementById('heroScrollButton');
                            const heroMetricsBand = document.getElementById('heroMetricsBand');
                        const heroSection = document.getElementById('hero');

                        const markHeroVideoReady = () => {
                            if (!video) return;
                            video.classList.add('is-playing');
                        };

                        const canPlayHeroVideo = () => {
                            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
                            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                            const prefersReducedData = window.matchMedia('(prefers-reduced-data: reduce)').matches;
                            if (prefersReducedMotion || prefersReducedData || connection?.saveData) {
                                return false;
                            }
                            return true;
                        };

                        const startHeroVideo = ({ reload = false } = {}) => {
                            if (!video) return;
                            if (!canPlayHeroVideo()) {
                                video.removeAttribute('autoplay');
                                video.preload = 'none';
                                return;
                            }
                            if (reload || video.readyState === 0) {
                                video.load();
                            }
                            video.play().then(markHeroVideoReady).catch(() => {});
                        };

                        ['loadedmetadata', 'loadeddata', 'canplay', 'playing'].forEach(eventName => {
                            video?.addEventListener(eventName, markHeroVideoReady, { once: true });
                        });
                        window.setTimeout(() => {
                            if (video?.currentTime > 0 || video?.readyState >= 2) {
                                markHeroVideoReady();
                            }
                        }, 700);

                        const mobileHeroMedia = window.matchMedia('(max-width: 768px)');
                        const isMobileExperience = () => mobileHeroMedia.matches;
                        let heroIsInView = true;

                        const syncHeroVideoVisibility = () => {
                            if (!video) return;
                            if (!isMobileExperience()) {
                                startHeroVideo();
                                return;
                            }
                            if (document.visibilityState !== 'visible' || !heroIsInView) {
                                video.pause();
                                return;
                            }
                            startHeroVideo();
                        };

                        startHeroVideo();

                        if ('IntersectionObserver' in window && heroSection) {
                            const heroVideoObserver = new IntersectionObserver((entries) => {
                                heroIsInView = entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.45);
                                syncHeroVideoVisibility();
                            }, {
                                threshold: [0, 0.2, 0.45, 0.7]
                            });
                            heroVideoObserver.observe(heroSection);
                        }

                        window.addEventListener('pageshow', () => {
                            syncHeroVideoVisibility();
                        });

                        document.addEventListener('visibilitychange', () => {
                            if (document.visibilityState === 'visible') {
                                syncHeroVideoVisibility();
                            } else {
                                video?.pause();
                            }
                        });

                        const syncNavStates = () => {
                            if (window.scrollY >= 100) {
                                nav.classList.remove('hidden-nav');
                                nav.classList.add('visible-nav');
                                heroNav?.classList.add('is-hidden');
                            } else {
                                nav.classList.remove('visible-nav');
                                nav.classList.add('hidden-nav');
                                heroNav?.classList.remove('is-hidden');
                            }
                        };

                        // 1. TEXT MILESTONES (Sincronizare cu momentele din video)
                        const heroTextCueTimes = isMobileExperience()
                            ? [0, 16.25, 34.833333, 50.541667, 69.375]
                            : [0, 16.28, 34.8, 50.52, 69.36];
                        const textMilestones = [
                            {
                                time: heroTextCueTimes[0],
                                subtitle: "Fully integrated Design&Build provider.",
                                title: "One Partner. One Process. <em>One Team.</em>",
                                desc: "Workspace Studio brings workplace strategy, design, fit-out, furniture and logistics together in one coordinated process. One schedule, one budget and one accountable team holding quality across every phase of the project.",
                                wideDesc: true
                            },
                            {
                                time: heroTextCueTimes[1],
                                subtitle: "Senior Leadership, Start to Finish",
                                title: "The People You Meet Are the People Who <em>Build It</em>",
                                desc: "Continuity isn't a promise we make — it's how we staff every project. Decisions stay aligned because the same senior team carries them from proposal to completion.",
                                wideDesc: true,
                                titleStyle: "long"
                            },
                            {
                                time: heroTextCueTimes[2],
                                subtitle: "Cost certainty before the first commitment.",
                                title: "Budget <em>Centricity</em>",
                                desc: "We translate concepts into technically correct, cost-aligned plans before procurement begins. No surprises on site. No revisions under cost pressure. Budget discipline shapes our design process from day one.",
                                wideDesc: true
                            },
                            {
                                time: heroTextCueTimes[3],
                                subtitle: "Sole MillerKnoll Certified Dealer in Romania.",
                                title: "500+ premium brands, <em>sourced directly</em>",
                                desc: "Direct supply from the world's major workplace brands. Controlled pricing and original product warranty, with faster lead times to Romania.",
                                wideDesc: true,
                                titleStyle: "compact"
                            },
                            {
                                time: heroTextCueTimes[4],
                                subtitle: "Premium quality with a lower carbon footprint",
                                title: "Less Waste. <em>More Value.</em>",
                                desc: "Designed well, built to last. We specify durable, repairable and adaptable products, backed by warranties of up to 12 years and aligned with C2C® principles. All our manufacturers are ISO, FSC® or EcoVadis certified. From recycled materials to modular furniture, every choice is made to reduce waste and support long-term performance.",
                                wideDesc: true
                            }
                        ];
                        const renderHeroMilestone = (data) => {
                            container.classList.toggle('copy-hidden', Boolean(data.hidden));
                            container.setAttribute('aria-hidden', data.hidden ? 'true' : 'false');
                            if (data.hidden) return;

                            subtitle.innerText = data.subtitle;
                            title.innerHTML = data.title;
                            if (data.descHtml) {
                                desc.innerHTML = data.descHtml;
                            } else {
                                desc.innerText = data.desc;
                            }
                            container.classList.toggle('wide-desc', Boolean(data.wideDesc));
                            container.classList.toggle('optical-center', Boolean(data.opticalCenter));
                            container.classList.toggle('desc-offset', Boolean(data.descOffset));
                            container.classList.toggle('long-title', data.titleStyle === 'long');
                            container.classList.toggle('compact-title', data.titleStyle === 'compact');
                            if (data.showBadges) {
                                badgesContainer.classList.add('visible');
                                badgesContainer.style.display = 'flex';
                            } else {
                                badgesContainer.classList.remove('visible');
                                badgesContainer.style.display = 'none';
                            }
                            heroMetricsBand?.classList.add('visible');
                            heroMetricsBand?.setAttribute('aria-hidden', 'false');
                            heroScrollButton?.classList.remove('is-hidden');
                        };

                        let lastIndex = -1;
                        let exitingForIndex = -1;
                        renderHeroMilestone(textMilestones[0]);
                        const syncHeroText = ({ immediate = false } = {}) => {
                            if (!video) return;
                            const currentIndex = textMilestones.reduce((acc, milestone, idx) => (video.currentTime >= milestone.time ? idx : acc), 0);
                            const indexChanged = currentIndex !== lastIndex;

                            if (indexChanged) {
                                lastIndex = currentIndex;
                                exitingForIndex = -1;
                                container.classList.remove('is-entering', 'is-exiting');
                                renderHeroMilestone(textMilestones[currentIndex]);
                                if (!immediate && !textMilestones[currentIndex].hidden) {
                                    void container.offsetWidth;
                                    container.classList.add('is-entering');
                                }
                            }

                            const nextIndex = currentIndex + 1;
                            const nextMilestone = textMilestones[nextIndex];
                            const exitLeadTime = 0.95;
                            if (
                                nextMilestone &&
                                !textMilestones[currentIndex].hidden &&
                                video.currentTime >= nextMilestone.time - exitLeadTime &&
                                video.currentTime < nextMilestone.time &&
                                exitingForIndex !== nextIndex
                            ) {
                                exitingForIndex = nextIndex;
                                container.classList.remove('is-entering');
                                void container.offsetWidth;
                                container.classList.add('is-exiting');
                            }
                        };

                        let heroTextFrameCallback = null;
                        const syncHeroTextToVideoFrame = () => {
                            heroTextFrameCallback = null;
                            syncHeroText();
                            if (video && !video.paused && !video.ended) {
                                heroTextFrameCallback = video.requestVideoFrameCallback(syncHeroTextToVideoFrame);
                            }
                        };

                        if (video && 'requestVideoFrameCallback' in HTMLVideoElement.prototype) {
                            video.addEventListener('play', () => {
                                if (heroTextFrameCallback === null) {
                                    heroTextFrameCallback = video.requestVideoFrameCallback(syncHeroTextToVideoFrame);
                                }
                            });
                            if (!video.paused) {
                                heroTextFrameCallback = video.requestVideoFrameCallback(syncHeroTextToVideoFrame);
                            }
                        } else {
                            video?.addEventListener('timeupdate', () => syncHeroText());
                        }
                        video?.addEventListener('seeked', () => syncHeroText({ immediate: true }));
                        video?.addEventListener('loadedmetadata', () => syncHeroText({ immediate: true }));
                        syncHeroText({ immediate: true });

                            // 2. NAVBAR SCROLL LOGIC
                            let navScrollFrame = null;
                            const scheduleNavStateSync = () => {
                                if (navScrollFrame) return;
                                navScrollFrame = window.requestAnimationFrame(() => {
                                    navScrollFrame = null;
                                    syncNavStates();
                                });
                            };
                            window.addEventListener('scroll', scheduleNavStateSync, { passive: true });
                            syncNavStates();

                            heroScrollButton?.addEventListener('click', () => {
                                const projectsTop = document.getElementById('projects')?.offsetTop ?? 0;
                                performSnap(Math.max(0, projectsTop - 56));
                            });
