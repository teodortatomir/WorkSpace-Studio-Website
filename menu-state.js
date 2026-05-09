(() => {
    const menus = document.querySelectorAll(".menu-right-links");

    menus.forEach((menu) => {
        const items = Array.from(menu.querySelectorAll(".menu-nav-item"));
        const submenuItems = items.filter((item) => item.querySelector(".menu-subnav"));
        const panel = document.createElement("div");
        const mobileQuery = window.matchMedia("(max-width: 768px)");

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

        menu.addEventListener("click", (event) => {
            const toggle = event.target.closest(".menu-subnav-toggle");
            if (!toggle || !menu.contains(toggle)) return;

            const item = toggle.closest(".menu-nav-item");
            const willOpen = !item.classList.contains("is-mobile-open");
            event.preventDefault();
            event.stopPropagation();
            closeMobileSiblings(item);
            item.classList.toggle("is-mobile-open", willOpen);
            toggle.setAttribute("aria-expanded", String(willOpen));
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
