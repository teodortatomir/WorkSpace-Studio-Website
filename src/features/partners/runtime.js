
<!--@include {"file":"shared/scripts/navigation/eager-overlay.js","values":{"indent":"        "}} -->        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        const brandSearch = document.getElementById('brandSearch');
        const brandItems = Array.from(document.querySelectorAll('.brand-chip'));
        const brandsEmpty = document.getElementById('brandsEmpty');
        const brandFilters = Array.from(document.querySelectorAll('.brand-filter'));
        const brandsCount = document.getElementById('brandsCount');
        const brandCategoryDescription = document.getElementById('brandCategoryDescription');
        const categoryDescriptions = {
            furniture: 'Chairs, tables, desks, sofas and storage.',
            acoustics: 'Acoustic panels, booths, dividers and other products specifically designed for acoustics.',
            'architectural-products': 'Walls, doors, ceilings and architectural systems.',
            'flooring-surfaces': 'Carpeting, rugs, flooring, wallpaper and surface finishes.',
            lighting: 'Own-brand lighting collections.',
            'accessories-technology': 'Accessories, monitor arms, power supply, cable management, signage and recycling solutions.',
            outdoor: 'Dedicated outdoor collections.'
        };
        let activeCategory = 'all';

        function filterBrands() {
            const query = brandSearch.value.trim().toLowerCase();
            let visibleCount = 0;

            brandItems.forEach(item => {
                const name = (item.dataset.name || item.textContent || '').toLowerCase();
                const categories = item.dataset.categories.split(' ');
                const matches = name.includes(query) &&
                    (activeCategory === 'all' || categories.includes(activeCategory));
                item.hidden = !matches;
                if (matches) visibleCount += 1;
            });

            brandsEmpty.hidden = visibleCount !== 0;
            brandCategoryDescription.textContent = categoryDescriptions[activeCategory] || '';
            brandCategoryDescription.hidden = activeCategory === 'all';
            brandsCount.textContent = `${visibleCount} ${visibleCount === 1 ? 'brand' : 'brands'}`;
        }

        brandFilters.forEach(button => {
            button.addEventListener('click', () => {
                activeCategory = button.dataset.category;
                brandFilters.forEach(filter => {
                    filter.setAttribute('aria-pressed', String(filter === button));
                });
                filterBrands();
            });
        });

        brandSearch.addEventListener('input', filterBrands);
        brandSearch.addEventListener('search', filterBrands);
        filterBrands();
    