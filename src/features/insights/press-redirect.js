
        (() => {
            const releaseDates = {
                "press/workspace-studio-27-milioane-2024.html": "2025-02-01",
                "press/workspace-studio-2024-anul-amenajarilor-design-centrat-pe-buget.html": "2024-06-01",
                "press/grupul-workspace-studio-afaceri-225-milioane-2023.html": "2024-02-01",
                "press/workspace-studio-extinde-showroom-design-birouri-moderne.html": "2023-10-01",
                "press/workspace-studio-afaceri-85-milioane-primele-6-luni-2023.html": "2023-07-01",
                "press/workspace-studio-afaceri-225-milioane-2022.html": "2023-02-01",
                "press/companii-investesc-spatii-verzi-terase-2022.html": "2022-10-01",
                "press/workspace-studio-certified-dealer-millerknoll.html": "2022-06-01",
                "press/grupul-workspace-studio-afaceri-10-milioane-2021.html": "2022-02-01",
                "press/mihaela-petrescu-business-development-director.html": "2021-11-01",
                "press/workspace-studio-open-office-ergonomic-trends-2021.html": "2021-02-15",
                "press/workspace-studio-afaceri-9-milioane-2020.html": "2021-02-01",
                "press/workspace-studio-shop-online-ergonomie.html": "2020-10-01",
                "press/extindere-portofoliu-retail-hay.html": "2020-06-01",
                "press/recomandari-revenire-in-siguranta-la-birou.html": "2020-05-01",
                "press/allspace-interiors-divizie-fitout.html": "2020-03-01",
                "press/workspace-studio-afaceri-107-milioane-2019.html": "2020-01-01",
                "press/cosm-red-dot-best-of-the-best.html": "2019-08-01",
                "press/orientarea-catre-ergonomie-afaceri-35-milioane-2019.html": "2019-07-01",
                "press/workspace-studio-lanseaza-cosm-herman-miller.html": "2019-04-01",
                "press/workspace-studio-afaceri-53-milioane-2018.html": "2019-01-01",
                "press/workspace-studio-afaceri-235-milioane-primele-6-luni-2018.html": "2018-08-01",
                "press/workspace-studio-afaceri-4-milioane-2017.html": "2018-05-01"
            };

            const grid = document.querySelector(".press-grid");
            const loadMoreButton = document.querySelector("[data-press-load-more]");
            if (!grid || !loadMoreButton) return;

            const visibleStep = 9;
            let visibleCount = visibleStep;
            const cards = Array.from(grid.querySelectorAll(".press-card"));

            cards
                .sort((a, b) => {
                    const dateA = releaseDates[a.getAttribute("href")] || "1900-01-01";
                    const dateB = releaseDates[b.getAttribute("href")] || "1900-01-01";
                    return dateB.localeCompare(dateA);
                })
                .forEach(card => grid.appendChild(card));

            const updateVisibleCards = () => {
                cards.forEach((card, index) => {
                    card.hidden = index >= visibleCount;
                });

                loadMoreButton.hidden = visibleCount >= cards.length;
            };

            loadMoreButton.addEventListener("click", () => {
                visibleCount += visibleStep;
                updateVisibleCards();
            });

            updateVisibleCards();
        })();
    