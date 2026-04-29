(() => {
    const menus = document.querySelectorAll(".menu-right-links");

    menus.forEach((menu) => {
        const items = Array.from(menu.querySelectorAll(".menu-nav-item"));
        const submenuItems = items.filter((item) => item.querySelector(".menu-subnav"));
        const panel = document.createElement("div");

        panel.className = "menu-subnav-panel";
        panel.setAttribute("aria-live", "polite");
        menu.appendChild(panel);
        menu.classList.add("has-state-panel");

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
            const item = event.target.closest(".menu-nav-item");
            if (!item || !menu.contains(item)) return;
            activateItem(item);
        });

        menu.addEventListener("focusin", (event) => {
            const item = event.target.closest(".menu-nav-item");
            if (!item || !menu.contains(item)) return;
            activateItem(item);
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
