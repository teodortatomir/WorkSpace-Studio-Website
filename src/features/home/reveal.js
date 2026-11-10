                    window.__workspaceHomeSnapV2 = false;

                            const revealElements = document.querySelectorAll('.reveal, .split-row, .nt-card');
                            if (window.matchMedia('(max-width: 768px)').matches) {
                                revealElements.forEach(el => el.classList.add('visible'));
                            } else {
                                const revealObserver = new IntersectionObserver((entries) => {
                                    entries.forEach(entry => {
                                        if (entry.isIntersecting) entry.target.classList.add('visible');
                                    });
                                }, { threshold: 0.15 });
                                revealElements.forEach(el => revealObserver.observe(el));
                            }