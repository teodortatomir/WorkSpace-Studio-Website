                    const projectsSlider = document.querySelector('[data-projects-slider]');

                    if (projectsSlider) {
                        const track = projectsSlider.querySelector('[data-projects-track]');
                        const viewport = projectsSlider.querySelector('.projects-slider-viewport');
                        const prevBtn = projectsSlider.querySelector('[data-projects-prev]');
                        const nextBtn = projectsSlider.querySelector('[data-projects-next]');
                        const originalCards = Array.from(track.children).map(card => card.cloneNode(true));
                        if (!track || !viewport || !prevBtn || !nextBtn || originalCards.length === 0) return;
                        const mobileSliderQuery = window.matchMedia('(max-width: 768px)');
                        let isMobileSlider = mobileSliderQuery.matches;

                        let isSlidingProjects = false;
                        let sliderIndex = originalCards.length;
                        let pointerStartX = 0;
                        let pointerStartY = 0;
                        let pointerDeltaX = 0;
                        let isPointerDragging = false;
                        let isHorizontalGesture = false;
                        let activePointerId = null;
                        let slideResetTimer = null;
                        let mobileScrollResetTimer = null;
                        let mobileImageLoadFrame = null;
                        let suppressClickTimer = null;
                        let resizeFrame = null;
                        let cardStep = 0;
                        let sliderPeek = 0;
                        let suppressCardClick = false;
                        let pointerStartCard = null;

                        const getProjectCardStep = () => {
                            const firstCard = track.querySelector('.project-slider-card');
                            if (!firstCard) return viewport.clientWidth || 0;
                            const gap = parseFloat(getComputedStyle(track).gap) || 0;
                            return firstCard.getBoundingClientRect().width + gap;
                        };

                        const getMobileCardInset = () => {
                            const firstCard = track.querySelector('.project-slider-card');
                            if (!firstCard) return 0;
                            return Math.max((viewport.clientWidth - firstCard.getBoundingClientRect().width) / 2, 0);
                        };

                        const setupMobileProjectsSlider = () => {
                            clearSlideResetTimer();
                            clearMobileScrollResetTimer();
                            clearSuppressClickTimer();
                            track.innerHTML = '';
                            [
                                ...originalCards.map(card => card.cloneNode(true)),
                                ...originalCards.map(card => card.cloneNode(true)),
                                ...originalCards.map(card => card.cloneNode(true))
                            ].forEach(card => track.appendChild(card));
                            observeDeferredImages(track);
                            viewport.scrollLeft = 0;
                            track.style.transition = 'none';
                            track.style.transform = 'none';
                            sliderIndex = originalCards.length;
                            cardStep = 0;
                            sliderPeek = 0;
                            isSlidingProjects = false;
                            resetPointerState();
                            requestAnimationFrame(() => {
                                cardStep = getProjectCardStep();
                                viewport.scrollLeft = getMobileLoopOffset();
                                loadMobileProjectImagesNearViewport();
                            });
                        };

                        const loadMobileProjectImagesNearViewport = () => {
                            if (!isMobileSlider) return;
                            const cards = track.children;
                            const step = cardStep || getProjectCardStep();
                            if (!cards.length || !step) return;

                            const firstVisibleIndex = Math.max(Math.floor(viewport.scrollLeft / step) - 2, 0);
                            const lastVisibleIndex = Math.min(
                                Math.ceil((viewport.scrollLeft + viewport.clientWidth) / step) + 3,
                                cards.length - 1
                            );

                            for (let index = firstVisibleIndex; index <= lastVisibleIndex; index += 1) {
                                cards[index]?.querySelectorAll('img[data-defer-src]').forEach(loadDeferredImage);
                            }
                        };

                        const scheduleMobileProjectImageLoad = () => {
                            if (!isMobileSlider || mobileImageLoadFrame) return;
                            mobileImageLoadFrame = window.requestAnimationFrame(() => {
                                mobileImageLoadFrame = null;
                                loadMobileProjectImagesNearViewport();
                            });
                        };

                        const getMobileLoopOffset = () => (originalCards.length * getProjectCardStep()) - getMobileCardInset();

                        const normalizeMobileProjectsScroll = () => {
                            if (!isMobileSlider || originalCards.length === 0) return;
                            const step = getProjectCardStep();
                            if (!step) return;

                            const loopWidth = originalCards.length * step;
                            if (viewport.scrollLeft < loopWidth * 0.5) {
                                viewport.scrollLeft += loopWidth;
                            } else if (viewport.scrollLeft >= loopWidth * 1.5) {
                                viewport.scrollLeft -= loopWidth;
                            }
                            scheduleMobileProjectImageLoad();
                        };

                        const clearMobileScrollResetTimer = () => {
                            if (!mobileScrollResetTimer) return;
                            window.clearTimeout(mobileScrollResetTimer);
                            mobileScrollResetTimer = null;
                        };

                        const scheduleMobileScrollNormalize = () => {
                            clearMobileScrollResetTimer();
                            mobileScrollResetTimer = window.setTimeout(() => {
                                normalizeMobileProjectsScroll();
                                mobileScrollResetTimer = null;
                            }, 260);
                        };

                        const scrollMobileProjects = (direction) => {
                            const step = getProjectCardStep();
                            if (!step) return;
                            normalizeMobileProjectsScroll();
                            viewport.scrollTo({
                                left: viewport.scrollLeft + (step * direction),
                                behavior: 'smooth'
                            });
                            scheduleMobileScrollNormalize();
                            scheduleMobileProjectImageLoad();
                        };

                        const getMainVisibleCards = () => {
                            if (window.innerWidth <= 768) return 1;
                            if (window.innerWidth <= 1024) return 2;
                            return 3;
                        };

                        const clearSlideResetTimer = () => {
                            if (!slideResetTimer) return;
                            window.clearTimeout(slideResetTimer);
                            slideResetTimer = null;
                        };

                        const clearSuppressClickTimer = () => {
                            if (!suppressClickTimer) return;
                            window.clearTimeout(suppressClickTimer);
                            suppressClickTimer = null;
                        };

                        const suppressCardClickTemporarily = () => {
                            suppressCardClick = true;
                            clearSuppressClickTimer();
                            suppressClickTimer = window.setTimeout(() => {
                                suppressCardClick = false;
                                suppressClickTimer = null;
                            }, 380);
                        };

                        const scheduleSlideReset = () => {
                            clearSlideResetTimer();
                            slideResetTimer = window.setTimeout(() => {
                                if (!isSlidingProjects) return;
                                if (sliderIndex < originalCards.length) {
                                    sliderIndex += originalCards.length;
                                } else if (sliderIndex >= originalCards.length * 2) {
                                    sliderIndex -= originalCards.length;
                                }
                                updateProjectsSlider(false);
                                isSlidingProjects = false;
                            }, 520);
                        };

                        const measureProjectsSlider = () => {
                            const firstCard = track.children[0];
                            if (!firstCard) return false;

                            const gap = parseFloat(getComputedStyle(track).gap) || 0;
                            const cardWidth = firstCard.getBoundingClientRect().width;
                            sliderPeek = parseFloat(getComputedStyle(projectsSlider).getPropertyValue('--projects-peek')) || 0;
                            cardStep = cardWidth + gap;
                            return cardStep > 0;
                        };

                        const getBaseOffset = () => (sliderIndex * cardStep) - sliderPeek;

                        const setProjectsTransform = (offset, animate = true) => {
                            track.style.transition = animate ? 'transform 0.38s cubic-bezier(0.22, 1, 0.36, 1)' : 'none';
                            track.style.transform = `translate3d(-${offset}px, 0, 0)`;
                        };

                        const rebuildProjectsSlider = () => {
                            track.innerHTML = '';
                            viewport.scrollLeft = 0;
                            const cardsForLoop = [
                                ...originalCards.map(card => card.cloneNode(true)),
                                ...originalCards.map(card => card.cloneNode(true)),
                                ...originalCards.map(card => card.cloneNode(true))
                            ];

                            cardsForLoop.forEach(card => track.appendChild(card));
                            sliderIndex = originalCards.length;
                            clearSlideResetTimer();
                            isSlidingProjects = false;
                            requestAnimationFrame(() => {
                                if (!measureProjectsSlider()) return;
                                updateProjectsSlider(false);
                            });
                        };

                        const paintProjectsState = () => {
                            const cards = track.children;
                            const mainVisible = getMainVisibleCards();
                            const focusStart = sliderIndex;
                            const focusEnd = focusStart + mainVisible - 1;

                            Array.from(cards).forEach((card, index) => {
                                card.classList.remove('is-focus', 'is-peek');

                                if (index >= focusStart && index <= focusEnd) {
                                    card.classList.add('is-focus');
                                } else if (index === focusStart - 1 || index === focusEnd + 1) {
                                    card.classList.add('is-peek');
                                }
                            });
                        };

                        const updateProjectsSlider = (animate = true) => {
                            if (isMobileSlider) return;
                            if (!cardStep && !measureProjectsSlider()) return;
                            setProjectsTransform(getBaseOffset(), animate);
                            paintProjectsState();
                        };

                        const slideProjects = (direction) => {
                            if (isMobileSlider) {
                                scrollMobileProjects(direction);
                                return;
                            }
                            if (isSlidingProjects || !cardStep && !measureProjectsSlider()) return;
                            isSlidingProjects = true;
                            sliderIndex += direction;
                            updateProjectsSlider(true);
                            scheduleSlideReset();
                        };

                        prevBtn.addEventListener('click', () => slideProjects(-1));
                        nextBtn.addEventListener('click', () => slideProjects(1));

                        track.addEventListener('click', (event) => {
                            if (suppressCardClick) {
                                event.preventDefault();
                                event.stopPropagation();
                                suppressCardClick = false;
                                return;
                            }
                            if (event.target.closest('.pivot-link')) return;

                            const card = event.target.closest('.project-slider-card[data-project-link]');
                            if (!card) return;

                            window.location.href = card.dataset.projectLink;
                        });

                        const onPointerStart = (event) => {
                            if (isMobileSlider) return;
                            if (isSlidingProjects) return;
                            const { clientX, clientY } = event;
                            pointerStartX = clientX;
                            pointerStartY = clientY;
                            pointerDeltaX = 0;
                            isPointerDragging = true;
                            isHorizontalGesture = false;
                            suppressCardClick = false;
                            pointerStartCard = event.target?.closest?.('.project-slider-card[data-project-link]') || null;
                        };

                        const onPointerMove = (event) => {
                            if (isMobileSlider) return false;
                            if (!isPointerDragging) return false;
                            const { clientX, clientY } = event;

                            const deltaX = clientX - pointerStartX;
                            const deltaY = clientY - pointerStartY;

                            if (!isHorizontalGesture) {
                                if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) return false;
                                isHorizontalGesture = Math.abs(deltaX) > Math.abs(deltaY);
                            }

                            if (isHorizontalGesture) {
                                pointerDeltaX = deltaX;
                                if (!cardStep && !measureProjectsSlider()) return true;
                                setProjectsTransform(getBaseOffset() - (deltaX * 0.18), false);
                            }

                            return isHorizontalGesture;
                        };

                        const resetPointerState = () => {
                            isPointerDragging = false;
                            isHorizontalGesture = false;
                            pointerDeltaX = 0;
                            activePointerId = null;
                            pointerStartCard = null;
                        };

                        const onPointerEnd = (event) => {
                            if (isMobileSlider) return;
                            if (!isPointerDragging) return;
                            const clientX = typeof event?.clientX === 'number' ? event.clientX : pointerStartX;
                            const clientY = typeof event?.clientY === 'number' ? event.clientY : pointerStartY;

                            const deltaX = clientX - pointerStartX;
                            const deltaY = clientY - pointerStartY;
                            const swipeThreshold = 45;
                            const tapThreshold = 10;

                            if (Math.abs(deltaX) >= swipeThreshold) {
                                suppressCardClickTemporarily();
                                resetPointerState();
                                slideProjects(deltaX < 0 ? 1 : -1);
                                return;
                            }

                            if (Math.abs(deltaX) <= tapThreshold && Math.abs(deltaY) <= tapThreshold) {
                                const target = event?.target;
                                if (!target?.closest?.('.pivot-link')) {
                                    const card = target?.closest?.('.project-slider-card[data-project-link]') || pointerStartCard;
                                    const destination = card?.dataset?.projectLink;
                                    if (destination) {
                                        resetPointerState();
                                        window.location.href = destination;
                                        return;
                                    }
                                }
                            }

                            if (pointerDeltaX !== 0) {
                                updateProjectsSlider(true);
                            }

                            resetPointerState();
                        };

                        viewport.addEventListener('pointerdown', (event) => {
                            if (isMobileSlider) return;
                            if (event.pointerType === 'mouse' && event.button !== 0) return;
                            activePointerId = event.pointerId;
                            viewport.setPointerCapture?.(event.pointerId);
                            onPointerStart(event);
                        });

                        viewport.addEventListener('pointermove', (event) => {
                            if (isMobileSlider) return;
                            if (activePointerId !== null && event.pointerId !== activePointerId) return;
                            if (onPointerMove(event)) {
                                event.preventDefault();
                            }
                        });

                        viewport.addEventListener('pointerup', (event) => {
                            if (isMobileSlider) return;
                            if (activePointerId !== null && event.pointerId !== activePointerId) return;
                            viewport.releasePointerCapture?.(event.pointerId);
                            onPointerEnd(event);
                        });

                        viewport.addEventListener('pointercancel', (event) => {
                            if (isMobileSlider) return;
                            if (activePointerId !== null && event.pointerId !== activePointerId) return;
                            viewport.releasePointerCapture?.(event.pointerId);
                            if (pointerDeltaX !== 0) {
                                updateProjectsSlider(true);
                            }
                            resetPointerState();
                        });

                        viewport.addEventListener('mouseleave', () => {
                            if (isMobileSlider) return;
                            if (!isPointerDragging) return;
                            if (pointerDeltaX !== 0) {
                                updateProjectsSlider(true);
                            }
                            resetPointerState();
                        });

                        viewport.addEventListener('scroll', () => {
                            if (!isMobileSlider) return;
                            scheduleMobileScrollNormalize();
                            scheduleMobileProjectImageLoad();
                        }, { passive: true });

                        track.addEventListener('transitionend', () => {
                            if (isMobileSlider) return;
                            if (track.style.transition === 'none') return;
                            clearSlideResetTimer();

                            if (sliderIndex < originalCards.length) {
                                sliderIndex += originalCards.length;
                                updateProjectsSlider(false);
                            } else if (sliderIndex >= originalCards.length * 2) {
                                sliderIndex -= originalCards.length;
                                updateProjectsSlider(false);
                            }

                            isSlidingProjects = false;
                            suppressCardClick = false;
                        });

                        window.addEventListener('resize', () => {
                            if (resizeFrame) {
                                window.cancelAnimationFrame(resizeFrame);
                            }
                            resizeFrame = window.requestAnimationFrame(() => {
                                resizeFrame = null;
                                const nextIsMobileSlider = mobileSliderQuery.matches;
                                if (nextIsMobileSlider !== isMobileSlider) {
                                    isMobileSlider = nextIsMobileSlider;
                                    if (isMobileSlider) {
                                        setupMobileProjectsSlider();
                                    } else {
                                        rebuildProjectsSlider();
                                    }
                                    return;
                                }
                                if (isMobileSlider) return;
                                measureProjectsSlider();
                                rebuildProjectsSlider();
                            });
                        });

                        if (isMobileSlider) {
                            setupMobileProjectsSlider();
                        } else {
                            measureProjectsSlider();
                            rebuildProjectsSlider();
                        }
                    }
