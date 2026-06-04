(() => {
    const loadDeferredImage = (img) => {
        if (!img?.dataset.deferSrc) return;
        img.src = img.dataset.deferSrc;
        img.removeAttribute("data-defer-src");
    };

    const observeDeferredImages = (root = document) => {
        const images = Array.from(root.querySelectorAll("img[data-defer-src]"));
        if (!images.length) return;

        const getLoadTarget = (img) => img.closest(".projects-slider")
            || img.closest(".home-partners-section")
            || img.closest(".services-gallery-grid")
            || img.closest(".gallery-grid")
            || img.closest(".bento-grid")
            || img.closest(".services-grid")
            || img.closest(".reveal, .reveal-on-scroll, section, article, figure")
            || img;

        const loadImagesNearViewport = () => {
            const threshold = window.innerHeight + 240;
            images.forEach((img) => {
                if (!img.dataset.deferSrc) return;
                const rect = getLoadTarget(img).getBoundingClientRect();
                if (rect.top < threshold && rect.bottom > -240) {
                    loadDeferredImage(img);
                }
            });
        };

        if (!("IntersectionObserver" in window)) {
            images.forEach(loadDeferredImage);
            return;
        }

        const observer = new IntersectionObserver((entries, imageObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const targets = entry.target.matches("img[data-defer-src]")
                    ? [entry.target]
                    : Array.from(entry.target.querySelectorAll("img[data-defer-src]"));
                targets.forEach(loadDeferredImage);
                imageObserver.unobserve(entry.target);
            });
        }, {
            rootMargin: "160px 0px",
            threshold: 0.01
        });

        images.forEach((img) => {
            observer.observe(getLoadTarget(img));
        });

        loadImagesNearViewport();
        window.addEventListener("scroll", loadImagesNearViewport, { passive: true });
        window.addEventListener("resize", loadImagesNearViewport);
        document.querySelectorAll(".snap-container, .gallery-snap-section").forEach((container) => {
            container.addEventListener("scroll", loadImagesNearViewport, { passive: true });
        });
    };

    const loadMenuImages = () => {
        document.querySelectorAll(".menu-img-item[data-src]").forEach((img) => {
            if (!img.src) img.src = img.dataset.src;
        });
    };

    document.querySelectorAll("#menuOpen, .menu-toggle, #heroMenuOpen").forEach((button) => {
        button.addEventListener("click", loadMenuImages);
    });

    observeDeferredImages();

    const menus = document.querySelectorAll(".menu-right-links");

    menus.forEach((menu) => {
        const items = Array.from(menu.querySelectorAll(".menu-nav-item"));
        const submenuItems = items.filter((item) => item.querySelector(".menu-subnav"));
        const panel = document.createElement("div");
        const mobileQuery = window.matchMedia("(max-width: 768px), (hover: none) and (pointer: coarse)");

        panel.className = "menu-subnav-panel";
        panel.setAttribute("aria-live", "polite");
        menu.appendChild(panel);
        menu.classList.add("has-state-panel");

        submenuItems.forEach((item) => {
            const submenu = item.querySelector(".menu-subnav");
            const label = item.querySelector(":scope > a")?.textContent?.trim() || "submenu";
            const toggle = document.createElement("button");
            const submenuId = `submenu-${Math.random().toString(36).slice(2, 9)}`;

            submenu.id = submenu.id || submenuId;
            toggle.className = "menu-subnav-toggle";
            toggle.type = "button";
            toggle.setAttribute("aria-label", `Toggle ${label} submenu`);
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-controls", submenu.id);

            item.insertBefore(toggle, submenu);
        });

        const closeMobileSiblings = (activeItem) => {
            submenuItems.forEach((item) => {
                if (item === activeItem) return;
                item.classList.remove("is-mobile-open");
                item.querySelector(".menu-subnav-toggle")?.setAttribute("aria-expanded", "false");
            });
        };

        const activateItem = (item) => {
            if (!item) return;
            const submenu = item.querySelector(".menu-subnav");
            items.forEach((entry) => entry.classList.remove("is-active"));
            item.classList.add("is-active");
            if (!submenu) {
                panel.innerHTML = "";
                panel.classList.remove("is-visible");
                panel.style.opacity = "0";
                panel.style.pointerEvents = "none";
                panel.style.transform = "translateX(14px)";
                return;
            }
            panel.innerHTML = submenu.innerHTML;
            panel.classList.add("is-visible");
            panel.style.opacity = "1";
            panel.style.pointerEvents = "auto";
            panel.style.transform = "translateX(0)";
        };

        menu.addEventListener("pointerover", (event) => {
            if (mobileQuery.matches) return;
            const item = event.target.closest(".menu-nav-item");
            if (!item || !menu.contains(item)) return;
            activateItem(item);
        });

        menu.addEventListener("focusin", (event) => {
            if (mobileQuery.matches) return;
            const item = event.target.closest(".menu-nav-item");
            if (!item || !menu.contains(item)) return;
            activateItem(item);
        });

        const toggleMobileSubmenu = (item) => {
            const willOpen = !item.classList.contains("is-mobile-open");
            closeMobileSiblings(item);
            item.classList.toggle("is-mobile-open", willOpen);
            item.querySelector(".menu-subnav-toggle")?.setAttribute("aria-expanded", String(willOpen));
        };

        menu.addEventListener("click", (event) => {
            const toggle = event.target.closest(".menu-subnav-toggle");
            const parentLink = event.target.closest(".menu-nav-item.has-submenu > a");

            if (toggle && menu.contains(toggle)) {
                event.preventDefault();
                event.stopPropagation();
                toggleMobileSubmenu(toggle.closest(".menu-nav-item"));
                return;
            }

            if (parentLink && menu.contains(parentLink) && mobileQuery.matches) {
                event.preventDefault();
                event.stopPropagation();
                toggleMobileSubmenu(parentLink.closest(".menu-nav-item"));
            }
        });

        if (!submenuItems.some((item) => item.classList.contains("is-active"))) {
            activateItem(submenuItems[0]);
        }

        panel.addEventListener("click", (event) => {
            const link = event.target.closest("a");
            if (!link) return;
            const overlay = menu.closest(".menu-overlay");
            overlay?.classList.remove("active");
            document.body.style.overflow = "";
        });
    });
})();
