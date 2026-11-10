
        const menuOpen = document.getElementById("menuOpen");
        const menuClose = document.getElementById("menuClose");
        const menuOverlay = document.getElementById("menuOverlay");
        const menuItems = document.querySelectorAll(".menu-nav-item");
        const menuLinks = document.querySelectorAll(".menu-nav-item a");

        menuOpen?.addEventListener("click", () => menuOverlay?.classList.add("active"));
        menuClose?.addEventListener("click", () => menuOverlay?.classList.remove("active"));
        menuItems.forEach((item) => {
            item.addEventListener("mouseenter", () => {
                const targetId = item.getAttribute("data-target");
                document.querySelectorAll(".menu-visual-item, .menu-img-item").forEach((visual) => visual.classList.remove("active"));
                document.querySelectorAll(`[data-visual-target="${targetId}"], #${targetId}`).forEach((visual) => visual.classList.add("active"));
            });
        });
        menuLinks.forEach((link) => link.addEventListener("click", () => menuOverlay?.classList.remove("active")));

        document.querySelectorAll(".why-block, .why-lifecycle-feature, .why-focus-card, .why-cta, .why-centered").forEach((block) => {
            const revealChildren = block.querySelectorAll(":scope > .why-eyebrow, :scope > h1, :scope > h2, :scope > p, :scope > figure, :scope > .why-copy, :scope > .why-scale-header, :scope > .why-scale-body, :scope > .why-partner-header, :scope > .why-partner-grid, :scope > .why-lifecycle-copy, :scope > .why-lifecycle-image, :scope > .why-lifecycle-proof, :scope > .why-focus-copy, :scope > a");

            revealChildren.forEach((child, index) => {
                child.classList.add("why-reveal");
                child.style.setProperty("--why-reveal-delay", `${Math.min(index, 5) * 70}ms`);
            });
        });

        const revealTargets = [".why-reveal"];

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const revealItems = document.querySelectorAll(revealTargets.join(","));

        if (!reducedMotion && revealItems.length) {
            document.body.classList.add("why-scroll-ready");

            revealItems.forEach((item, index) => {
                item.classList.add("why-reveal");
                if (!item.style.getPropertyValue("--why-reveal-delay")) {
                    item.style.setProperty("--why-reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
                }
            });

            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: "0px 0px -12% 0px",
                threshold: 0.16
            });

            revealItems.forEach((item) => revealObserver.observe(item));
        }
    