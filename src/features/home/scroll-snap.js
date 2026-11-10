                            let isAnimating = false;

                    function performSnap(target) {
                        if (isAnimating) return;
                        isAnimating = true;
                        window.scrollTo({ top: target, behavior: 'smooth' });
                        setTimeout(() => { isAnimating = false; }, 1000);
                    }
