(function () {
    const root = document.getElementById("projects-root");
    if (!root) return;

    const escapeHtml = (value) => String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

    const customProjects = () => (window.WorkspaceCMS?.getEntriesByType("project") || []).map((entry, index) => ({
        id: `cms-${index}-${entry.slug}`,
        title: entry.title,
        cat: entry.category || "Custom Project",
        type: entry.projectType || "Corporate",
        img: entry.coverImage || "../projects-pictures/skytower-hero.jpg",
        link: entry.sourceLink || `../cms/entry.html?type=project&slug=${encodeURIComponent(entry.slug)}`
    }));

    function extractProjectsData(source) {
        const startMarker = "const projectsData = [";
        const endMarker = "];\n\nconst customProjectsData";
        const start = source.indexOf(startMarker);
        const end = source.indexOf(endMarker);

        if (start === -1 || end === -1 || end <= start) {
            throw new Error("Projects data block was not found.");
        }

        const arraySource = source.slice(start, end + 2);
        return Function(`"use strict"; ${arraySource}; return projectsData;`)();
    }

    function renderFallback(projectsData) {
        const allProjects = [...customProjects(), ...projectsData];
        const categories = ["All", "Corporate", "Tech", "Exclusive", "Beauty"];
        const state = {
            filter: "All",
            query: "",
            visibleCount: 9
        };

        root.innerHTML = `
            <div class="page-wrapper bg-white projects-fallback-page">
                <section class="hero-abstract">
                    <figure class="projects-hero-visual">
                        <img src="../projects-pictures/uipath.jpg" alt="Workspace Studio workplace project with collaborative office zones">
                    </figure>
                </section>
                <section class="projects-intro">
                    <div class="projects-intro-copy">
                        <span>Projects</span>
                        <h1>Modern workspaces shaped with clarity, precision, and presence.</h1>
                        <p>Explore commercial interiors, headquarters, hospitality spaces, and workplace environments delivered across different industries.</p>
                    </div>
                </section>
                <main class="projects-container">
                    <div class="toolbar-visual">
                        <div class="filter-bar-editorial" data-project-filters></div>
                        <div class="search-container-visual">
                            <div class="search-glass">
                                <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                <input type="text" placeholder="Search by name..." class="search-input-visual" data-project-search>
                            </div>
                        </div>
                    </div>
                    <div class="dynamic-grid-editorial" data-project-grid></div>
                    <div class="view-more-container" data-project-load-wrap>
                        <button class="view-more-btn" type="button" data-project-load>
                            Load More Projects
                            <span class="btn-line"></span>
                        </button>
                    </div>
                </main>
                <section class="testimonial-slider-section">
                    <div class="testimonial-container">
                        <div class="testimonial-content">
                            <span class="testimonial-brand">Workspace Studio</span>
                            <p class="testimonial-quote">Projects delivered with attention to design, execution, schedule, and the way each workplace supports the people inside it.</p>
                        </div>
                    </div>
                </section>
                <section class="projects-cta-section">
                    <div class="projects-cta">
                        <span>Have a workplace project in mind?</span>
                        <h2>it all starts with a "hello".</h2>
                        <a href="../contact/contact.html">Get in touch</a>
                    </div>
                </section>
                <footer class="site-footer main-footer">
                    <div class="site-footer-inner">
                        <div class="site-footer-top">
                            <nav class="site-footer-nav" aria-label="Footer navigation">
                                <a class="site-footer-link" href="../projects-scene/proiecte.html">Projects</a>
                                <a class="site-footer-link" href="../index.html#services">Services</a>
                                <a class="site-footer-link" href="../partners/partners.html">Brands &amp; Partners</a>
                                <a class="site-footer-link" href="../about/about.html">About</a>
                                <a class="site-footer-link" href="../insights/insights.html">Insights</a>
                                <a class="site-footer-link" href="https://shop.workspaces.ro/en/catalog" target="_blank" rel="noopener noreferrer">Shop</a>
                                <a class="site-footer-link" href="../contact/contact.html">Contact / Start a Project</a>
                            </nav>
                            <a class="site-footer-link site-footer-action" href="../index.html">Back to Home</a>
                        </div>
                        <div class="site-footer-bottom">
                            <p class="site-footer-copy">&copy; 2026 Workspace Studio. All rights reserved.</p>
                            <div class="site-footer-socials">
                                <a class="site-footer-link" href="https://www.instagram.com/workspace__studio/" target="_blank" rel="noopener noreferrer">Instagram</a>
                                <a class="site-footer-link" href="https://www.facebook.com/WorkspaceStudio.ro/" target="_blank" rel="noopener noreferrer">Facebook</a>
                                <a class="site-footer-link" href="https://www.linkedin.com/company/workspace-studio/posts/?feedView=all" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        `;

        const filtersEl = root.querySelector("[data-project-filters]");
        const gridEl = root.querySelector("[data-project-grid]");
        const searchEl = root.querySelector("[data-project-search]");
        const loadWrap = root.querySelector("[data-project-load-wrap]");
        const loadButton = root.querySelector("[data-project-load]");

        const filteredProjects = () => allProjects.filter((project) => {
            const matchesFilter = state.filter === "All" || project.type === state.filter;
            const matchesSearch = project.title.toLowerCase().includes(state.query.toLowerCase());
            return matchesFilter && matchesSearch;
        });

        const countFor = (category) => category === "All"
            ? allProjects.length
            : allProjects.filter((project) => project.type === category).length;

        function renderFilters() {
            filtersEl.innerHTML = categories.map((category) => `
                <button class="filter-link ${state.filter === category ? "active" : ""}" type="button" data-filter="${escapeHtml(category)}">
                    ${escapeHtml(category)} <span class="count-sup">${countFor(category)}</span>
                </button>
            `).join("");
        }

        function renderGrid() {
            const matches = filteredProjects();
            const visible = matches.slice(0, state.visibleCount);

            gridEl.innerHTML = visible.map((project) => `
                <article class="project-card-editorial">
                    <a href="${escapeHtml(project.link)}" class="block no-underline">
                        <div class="img-container-editorial">
                            <div class="discover-badge-editorial"><span>View Project</span></div>
                            <img src="${escapeHtml(project.img)}" alt="${escapeHtml(project.title)}" class="img-editorial" loading="lazy">
                        </div>
                        <div class="content-editorial">
                            <span class="cat-tag-editorial">${escapeHtml(project.cat)}</span>
                            <h3 class="title-editorial">${escapeHtml(project.title)}</h3>
                            <div class="hover-line-zen"></div>
                        </div>
                    </a>
                </article>
            `).join("");

            loadWrap.style.display = state.visibleCount < matches.length ? "block" : "none";
        }

        filtersEl.addEventListener("click", (event) => {
            const button = event.target.closest("[data-filter]");
            if (!button) return;
            state.filter = button.dataset.filter;
            state.visibleCount = 9;
            renderFilters();
            renderGrid();
        });

        searchEl.addEventListener("input", (event) => {
            state.query = event.target.value;
            state.visibleCount = 9;
            renderGrid();
        });

        loadButton.addEventListener("click", () => {
            state.visibleCount += 9;
            renderGrid();
        });

        renderFilters();
        renderGrid();
    }

    window.WorkspaceProjectsFallback = function () {
        if (root.children.length) return;

        fetch("ProjectsScene.jsx")
            .then((response) => {
                if (!response.ok) throw new Error(`Projects scene could not be loaded: ${response.status}`);
                return response.text();
            })
            .then(extractProjectsData)
            .then(renderFallback)
            .catch((error) => {
                console.error(error);
                root.innerHTML = `
                    <main class="projects-container projects-fallback-error">
                        <p>Projects could not be loaded. Please refresh the page.</p>
                    </main>
                `;
            });
    };

    window.addEventListener("DOMContentLoaded", () => {
        window.setTimeout(window.WorkspaceProjectsFallback, 1200);
    });
})();
