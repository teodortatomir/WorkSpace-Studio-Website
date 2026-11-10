const menuOpen = document.getElementById('menuOpen');
const menuClose = document.getElementById('menuClose');
const menuOverlay = document.getElementById('menuOverlay');
const menuItems = document.querySelectorAll('.menu-nav-item');
const menuLinks = document.querySelectorAll('.menu-nav-item a');
const allImages = document.querySelectorAll('.menu-img-item');
const allVisuals = document.querySelectorAll('.menu-visual-item');
const publicationsSearch = document.getElementById('publicationsSearch');
const newsSearch = document.getElementById('newsSearch');
const publicationsGrid = document.getElementById('publicationsGrid');
const newsGrid = document.getElementById('newsGrid');

if (menuOpen && menuClose && menuOverlay) {
    document.querySelectorAll('.menu-img-item').forEach(img => {
        const loader = new Image();
        loader.src = img.src;
    });

    menuOpen.addEventListener('click', () => {
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    menuClose.addEventListener('click', () => {
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    function closeMenuOverlay() {
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const targetId = item.getAttribute('data-target');
            allVisuals.forEach(visual => visual.classList.remove('active'));
            document.querySelectorAll(`[data-visual-target="${targetId}"]`).forEach(visual => visual.classList.add('active'));
        });
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenuOverlay();
        });
    });
}

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

function attachSearch(input, selector) {
    if (!input) return;

    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        const items = Array.from(document.querySelectorAll(selector));

        items.forEach(item => {
            const haystack = (item.dataset.search || item.textContent || '').toLowerCase();
            item.style.display = haystack.includes(query) ? '' : 'none';
        });
    });
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderCustomPublications() {
    if (!publicationsGrid || !window.WorkspaceCMS) return;

    const entries = window.WorkspaceCMS.getEntriesByType('publication');
    const markup = entries.map(entry => `
        <a class="publication-card reveal reveal-up" href="../cms/entry.html?type=publication&slug=${encodeURIComponent(entry.slug)}" data-search="${escapeHtml(`${entry.title} ${entry.category} ${entry.summary}`)}">
            <img src="${escapeHtml(entry.coverImage || '../projects-pictures/skytower-hero.jpg')}" alt="${escapeHtml(entry.title)}">
            <div class="publication-card-copy">
                <span class="publication-tag">${escapeHtml(entry.category || 'Publication')}</span>
                <h3>${escapeHtml(entry.title)}</h3>
                <p>${escapeHtml(entry.summary || 'Open this story to read the full publication.')}</p>
            </div>
        </a>
    `).join('');

    publicationsGrid.insertAdjacentHTML('beforeend', markup);
}

function renderCustomNews() {
    if (!newsGrid || !window.WorkspaceCMS) return;

    const entries = window.WorkspaceCMS.getEntriesByType('news');
    const markup = entries.map(entry => {
        const href = entry.sourceLink || `../cms/entry.html?type=news&slug=${encodeURIComponent(entry.slug)}`;
        const target = entry.sourceLink ? ` target="_blank" rel="noopener noreferrer"` : '';
        const cta = entry.sourceLink ? 'Read Source' : 'Open Story';

        return `
            <a class="news-grid-card reveal reveal-up" href="${escapeHtml(href)}"${target} data-search="${escapeHtml(`${entry.title} ${entry.category} ${entry.summary}`)}">
                <img src="${escapeHtml(entry.coverImage || '../projects-pictures/skytower-hero.jpg')}" alt="${escapeHtml(entry.title)}">
                <div class="news-grid-copy">
                    <span class="publication-tag">${escapeHtml(entry.category || 'News')}</span>
                    <h3>${escapeHtml(entry.title)}</h3>
                    <p>${escapeHtml(entry.summary || 'Open this story to read more.')}</p>
                    <span class="news-source-link">${cta}</span>
                </div>
            </a>
        `;
    }).join('');

    newsGrid.insertAdjacentHTML('beforeend', markup);
}

renderCustomPublications();
renderCustomNews();

document.querySelectorAll('.reveal').forEach(el => {
    if (!el.classList.contains('visible')) {
        revealObserver.observe(el);
    }
});

attachSearch(publicationsSearch, '#publicationsGrid .publication-card');
attachSearch(newsSearch, '#newsGrid .news-grid-card');

const pressTranslations = {
    'workspace-studio-afaceri-4-milioane-2017.html': {
        meta: 'Press release / Bucharest, May 2018',
        title: 'Workspace Studio reached EUR 4 million in revenue in 2017, up 60% compared with 2016',
        lead: 'The first quarter of 2018 continued the positive momentum.',
        body: `
            <p>Workspace Studio, an office fit-out solutions integrator and Herman Miller Authorized Dealer Partner in Romania, recorded EUR 4 million in revenue in 2017, a 60% increase compared with the previous year. The positive trend continued in 2018, with first-quarter revenue up 10% year-on-year to EUR 1.1 million.</p>
            <p>The main growth drivers were the accelerated development of the IT market, the interest of companies in high-quality ergonomic solutions such as chairs, electric desks and acoustic products, and rising demand for Herman Miller, the brand behind Aeron, the world’s best-selling office chair.</p>
            <blockquote>IT companies account for approximately 80% of Workspace Studio clients. They are highly connected to global trends and, in a competitive market for specialized talent, were among the first to understand the importance of ergonomic and design-led workplaces. Today’s offices need to attract, encourage, support and retain talent, and IT clients invest in ergonomics to create a personalized solution for each employee. The investment in one workstation can vary from EUR 300 to EUR 3,000, depending on the furniture, says Alexandru-Horațiu Didea, Managing Partner of Workspace Studio.</blockquote>
            <p>Since 2015, when Workspace Studio became Herman Miller’s authorized dealer partner in Romania, the team has sold more than 7,000 Herman Miller chairs. Herman Miller chairs have been recognized worldwide since the 1970s for ergonomics and futuristic design, while the Aeron chair, created in 1994 and remastered in 2016, became the best-selling office chair of all time.</p>
            <p>In 2017, Herman Miller furniture sales represented 35% of Workspace Studio’s total revenue and remained an important factor in the company’s development.</p>
            <blockquote>Most companies we work with continue to look at price-quality ratio, delivery speed and, most importantly, ergonomics and the long-term potential of the investment. Herman Miller chairs are a global benchmark for ergonomics and have a 12-year, 24/7 warranty, ensuring efficient long-term use, adds Alexandru Horațiu Didea.</blockquote>
            <h2>The workplace impacts productivity. The cities investing in ergonomics</h2>
            <p>An international study covering more than 2,000 offices and over 250,000 employees worldwide shows that only 57% of employees feel their workplace allows them to work productively. Productivity is influenced by mobility, adaptability for different activities, background noise and ergonomics.</p>
            <p>Following Workspace Studio projects delivered in 2017, more than 12,000 employees in Romania benefit from workplaces designed to support productivity and ergonomics.</p>
            <blockquote>IT companies in Romania are investing more and more in ergonomics, through height-adjustable electric workstations, high-quality chairs and acoustic solutions for open-space offices. In the rest of the market, the tendency to save costs remains, with a preference for low- and mid-cost solutions. Ergonomic chairs are an exception. To the extent that budgets exist, companies invest in them. For the same company or the same number of employees, budgets remain lower in Romania than in other European countries, including some in Eastern Europe, such as the Czech Republic or Poland, adds Alexandru Horațiu Didea, Managing Partner of Workspace Studio.</blockquote>
            <p>In 2017, 90% of Workspace Studio projects were office design and fit-out projects for companies in Bucharest, while 10% were split between Iași and Cluj.</p>
            <h2>About Workspace Studio</h2>
            <p>Workspace Studio is an integrator of personalized office design and fit-out solutions, tailored to workforce needs and client organizational goals. Since 2015, Workspace Studio has been Herman Miller’s Authorized Dealer Partner in Romania.</p>
            <p>Herman Miller, the world’s most prestigious office furniture manufacturer, creates innovative solutions to help people do extraordinary things in their work. Herman Miller concepts and the designers working with Herman Miller solve real problems for people and organizations around the world.</p>
            <p>This design approach has made Herman Miller recognized as a global innovation leader in office furniture, accessories and strategic services. Dozens of Herman Miller products are displayed in the permanent collections of major museums around the world.</p>
            <p>Since 2008, the Workspace Studio group has supported more than 350 corporate clients with ergonomics, furniture and integrated office fit-out solutions.</p>
            <p class="press-contact"><strong>More details:</strong><br>Anca Popa | Zacke PR | PR Consultant | anca.popa@zackepr.com | 0724.202.474</p>
        `
    },
    'workspace-studio-afaceri-235-milioane-primele-6-luni-2018.html': {
        meta: 'Press release / Bucharest, August 2018',
        title: 'Workspace Studio reached EUR 2.35 million in the first six months of the year',
        body: `
            <p>Workspace Studio, one of the few players in the office furniture market focused on human-centric design and ergonomics and Herman Miller Authorized Dealer Partner in Romania, delivered projects worth EUR 2.35 million in the first six months of the year, 17% above the same period of the previous year.</p>
            <p>The positive momentum was driven by growing interest in ergonomics and quality acoustic solutions, alongside stronger competition on the labor market, which encourages employers to invest in attractive workplace design.</p>
            <blockquote>Ergonomics and financial sustainability are among the most sought-after features in office furniture. Our portfolio is built around high-quality ergonomic products. Clients are increasingly interested in wellbeing, health and productivity through integrated, turnkey, human-centric office design, says Horațiu-Alexandru Didea, Managing Partner of Workspace Studio.</blockquote>
            <h2>Herman Miller products are the best sellers</h2>
            <p>Herman Miller furniture represented 30% of first-half sales. Herman Miller chairs, mainly Aeron and Sayl, were Workspace Studio’s best-selling products in the period.</p>
            <blockquote>Herman Miller is the ergonomic furniture brand selected in 30-35% of the projects delivered in the first half of the year. The chair is probably the most important piece of office furniture, and Herman Miller is the global leader, with continuous investment in research and development, adds Horațiu-Alexandru Didea.</blockquote>
            <h2>Timișoara stands out in the first half of the year</h2>
            <p>While more than 90% of Workspace Studio ergonomic furniture projects continue to be developed in Bucharest, Timișoara showed the most dynamic evolution during the year.</p>
            <blockquote>Companies in Timișoara are showing growing interest in ergonomic office fit-out solutions, driven by the development of commercial and office space stock in recent years. Cluj, which stood out last year, has slowed down from this perspective, says Horațiu-Alexandru Didea.</blockquote>
            <h2>15-20% growth expected in 2018</h2>
            <p>For 2018, Workspace Studio forecasts revenue above EUR 4.5 million, at least 15% higher than in 2017.</p>
            <p>In the previous year, the company recorded EUR 4 million in revenue, 60% higher than in 2016, supported by positive evolution in the IT segment and the orientation of companies in this sector toward high-quality ergonomic solutions such as chairs, electric desks and acoustic products.</p>
            <h2>About Workspace Studio</h2>
            <p>Workspace Studio distributes high-quality ergonomic office furniture and is Herman Miller’s Authorized Dealer Partner in Romania. Its integrated turnkey solutions focus on ergonomics, financial sustainability and human-centric design.</p>
            <p>As one of the few players in the market oriented toward human-centric design, Workspace Studio is Herman Miller’s Authorized Dealer Partner in Romania. Herman Miller creates innovative solutions that help people do extraordinary things in their work. Its concepts and designers solve real problems for people and organizations around the world.</p>
            <p>This design approach has made Herman Miller recognized as a global innovation leader in office furniture, accessories and strategic ergonomic services. Herman Miller products are displayed in the permanent collections of major museums around the world.</p>
            <p class="press-contact"><strong>More details:</strong><br>Anca Popa | Zacke PR | PR Consultant | anca.popa@zackepr.com | 0724.202.474</p>
        `
    },
    'workspace-studio-afaceri-53-milioane-2018.html': {
        meta: 'Press release / Bucharest, January 2018',
        title: 'Workspace Studio reached EUR 5.3 million in revenue in 2018, up 30%',
        body: `
            <p>Workspace Studio, a company specialized in fit-out solutions and human-centric ergonomic office furniture and Herman Miller’s accredited partner in Romania, delivered office fit-out projects worth EUR 5.3 million in 2018, up 30% year-on-year.</p>
            <p>The growth was supported by strong interest in Herman Miller chairs, rising demand for construction and interior fit-out works, the need for efficient use of space and employers’ focus on office design and ergonomics as differentiators on the labor market.</p>
            <blockquote>Integrated fit-out projects generate approximately 65% of Workspace Studio’s business and are the most challenging. They require fit-out, installations, decoration and furniture works to be delivered very quickly and at high performance standards, says Horațiu Didea, Managing Partner Workspace Studio.</blockquote>
            <p>More than 80% of 2018 projects were delivered for clients in IT and industrial sectors, where ergonomics and furniture sustainability are priorities. The largest Workspace Studio project in 2018 was worth EUR 850,000.</p>
            <blockquote>The premium office fit-out market in Romania is growing, and interest in ergonomic solutions and human-centric office design is developing across most sectors, especially services. IT set the tone for the evolution of offices and remains the most important segment for our business. Other sectors are following this trend and increasingly choosing workspaces that support productivity, creativity and innovation. Another signal is the growing interest in acoustic solutions and lounge furniture, says Alexandru Horațiu Didea.</blockquote>
            <p>The average investment in a workstation delivered by Workspace Studio in 2018 was EUR 1,000 per employee, including the chair, desk and the allocated share of common areas such as meeting rooms, collaboration areas, connection or relaxation zones. The most expensive workstations sold last year cost EUR 8,000 per employee.</p>
            <blockquote>Compared with other countries, Romania has paradoxical market characteristics. For example, fit-out budgets in Romania are 30-50% lower than in other countries, even when we are talking about the same multinational company. At the same time, the requested delivery speed in Romania is almost twice as fast as in countries such as the United States or France, says Horațiu Alexandru Didea.</blockquote>
            <h2>Herman Miller chairs as a growth engine</h2>
            <p>In 2018, Workspace Studio became an Authorized Accredited Partner of Herman Miller, the highest distinction granted to a partner, after being the brand’s only Dealer Partner in Romania since 2016. Herman Miller ergonomic chair sales generated 30% of Workspace Studio’s business.</p>
            <blockquote>International studies show that 85% of employees associate workplace comfort with the quality and ergonomics of the chair and desk. Herman Miller develops top competitive products, and in Romania it is the best-selling brand in our portfolio. Year after year, we see more openness among companies in Romania, which increasingly align with international standards and choose quality and sustainability, adds the Workspace Studio representative.</blockquote>
            <p>In 2018, Workspace Studio sold more than 3,600 Herman Miller chairs in Romania, with Sayl, Aeron and Mirra among the most popular models.</p>
            <p>For the following year, Workspace Studio forecast 10% growth and revenue close to EUR 6 million.</p>
            <h2>About Workspace Studio</h2>
            <p>Workspace Studio is an integrator of fit-out solutions and a distributor of high-quality ergonomic office furniture, as well as Herman Miller’s only Authorized Accredited Partner in Romania.</p>
            <p>Workspace solutions are personalized and integrated turnkey, with an emphasis on ergonomics, financial sustainability and design centered on people, their activities and interactions.</p>
            <p>Herman Miller, the world’s most prestigious office furniture manufacturer, creates innovative solutions that help people do extraordinary things in their work. Its design approach makes Herman Miller a global innovation leader in office furniture, accessories and strategic ergonomic services.</p>
            <p class="press-contact"><strong>More details:</strong><br>Anca Popa | Zacke PR | PR Consultant | anca.popa@zackepr.com | 0724.202.474</p>
        `
    },
    'workspace-studio-lanseaza-cosm-herman-miller.html': {
        meta: 'Press release / Bucharest, April 2019',
        title: 'Workspace Studio launches Cosm, Herman Miller’s newest ergonomic chair',
        body: `
            <p>Workspace Studio, a company specialized in fit-out solutions and ergonomic office furniture, launches Cosm, Herman Miller’s newest ergonomic chair. After 10 years of research, Cosm is the first self-adjusting chair able to maintain balance and support adapted to each user throughout use.</p>
            <blockquote>Considering global office fit-out trends, I believe Cosm is the innovation the market needed. As coworking, desk-sharing and flexible workspaces continue to grow, Cosm becomes an efficient solution wherever a chair is used by multiple people, says Horațiu Didea, Managing Partner Workspace Studio.</blockquote>
            <p>Cosm is designed by Carola Zwick, Roland Zwick and Burkhard Schmitz of Studio 7.5. Its Auto-Harmonic Tilt adjusts in real time to the body’s natural movement and pressure, keeping the user in continuous balance.</p>
            <blockquote>Its sophisticated design responds instantly to body and posture movements, offering natural balance and complete support. This type of chair is essential not only for back protection, but also for the arms, reducing discomfort and pain felt in the arms and shoulders after several hours at the office. The arms are specially designed to absorb tension caused by the working position, but also by related activities, adds Horațiu Didea.</blockquote>
            <p>In practice, beyond functionality related to office work, this unique chair makes other activities, such as reading a book or working on a mobile phone or tablet, natural and comfortable.</p>
            <p>The technical details and challenges are only part of the research carried out by the team that spent 10 years perfecting Cosm. The Studio 7.5 designers and Herman Miller’s development and research teams also focused on its aesthetics.</p>
            <p>Beyond technical performance, the chair was designed as a complete object, with a unified color approach and a strong architectural presence.</p>
            <blockquote>The simple chromatic approach dematerializes the object. Although it has many different components made from different raw materials, Cosm is unified in color and has the potential to become a favorite among architects in office fit-outs and beyond, says Horațiu Didea.</blockquote>
            <h2>Workspace Studio sales continue to grow</h2>
            <p>In the first quarter of the year, Workspace Studio delivered office fit-out projects worth more than EUR 1.6 million, up 2% compared with the same period in 2018. Herman Miller furniture kept a 30% share of revenue.</p>
            <blockquote>Modern offices are no longer simple workspaces. They are places that stimulate creativity, productivity and collaboration, says Horațiu Didea.</blockquote>
            <p>The average investment in a workstation fitted out by Workspace Studio in the first three months of the year remained at EUR 1,000 per employee, as in the previous year. This amount includes the chair, desk and the allocated share of common spaces such as meeting rooms, collaboration, connection and relaxation areas and acoustic furniture.</p>
            <p>In 2018, Workspace Studio revenue reached EUR 5.3 million, up 30% year-on-year. The most expensive workstations sold last year cost EUR 8,000 per employee.</p>
            <h2>About Workspace Studio</h2>
            <p>Workspace Studio is an integrator of fit-out solutions and a distributor of high-quality ergonomic office furniture, as well as Herman Miller’s only Authorized Accredited Partner in Romania. Its solutions are personalized and integrated turnkey, with an emphasis on ergonomics, financial sustainability and design centered on people, their activities and interactions.</p>
            <p class="press-contact"><strong>More details:</strong><br>Anca Popa | Zacke PR | PR Consultant | anca.popa@zackepr.com | 0724.202.474</p>
        `
    },
    'orientarea-catre-ergonomie-afaceri-35-milioane-2019.html': {
        meta: 'Press release / July 31, 2019',
        title: 'Focus on ergonomics brought Workspace Studio revenue to EUR 3.5 million in the first six months',
        lead: 'A 25% increase compared with the same period of the previous year.',
        body: `
            <p>Workspace Studio ended the first half of 2019 with revenue of EUR 3.5 million, up 25% year-on-year. The positive dynamic was driven especially by ergonomic workplace projects aimed at improving quality of life in the office.</p>
            <p>More than 60% of projects delivered by Workspace Studio in 2019 included relaxation areas, lounge areas or informal discussion spaces.</p>
            <blockquote>In 2019 we recorded a 50% increase in projects involving special cafeterias, lounge and relaxation areas that encourage creativity, idea exchange and communication, says Horațiu Didea, Managing Partner Workspace Studio.</blockquote>
            <h2>The trend: improving quality of life at work through redesign</h2>
            <p>Companies in Romania are increasingly moving beyond functionality and toward better quality of life during working hours. This trend is visible in projects that reallocate space based on physical and social ergonomics, multifunctional areas and each company’s working model.</p>
            <p>Herman Miller studies show that, while traditional office design allocated around 33% of space to circulation areas, contemporary office design shifts focus toward connection areas, where communication and information exchange are encouraged, and these can reach 47% of total surface. Meeting rooms for 8-12 people are also becoming smaller meeting areas for 5-7 people.</p>
            <p>The first companies interested in redesigning according to these new principles are multinationals, but according to Workspace Studio’s analysis, interest in physical and social ergonomics is also visible among smaller local companies, especially those involved in creative or IT activities.</p>
            <h2>Average workstation investment up 20%</h2>
            <p>In the first half of the year, average investment in a Workspace Studio workstation rose to EUR 1,200 per employee, compared with EUR 1,000 in the previous year.</p>
            <p>Herman Miller furniture rose to 35% of revenue, with Aeron, Mirra 2 and Cosm among the best-selling chairs.</p>
            <p>Herman Miller chairs are recognized worldwide for quality, ergonomics and their 12-year warranty, and are appreciated for the technological innovations they introduce. In 2018, Workspace Studio revenue reached EUR 5.3 million, up 30% year-on-year. The most expensive workstations sold last year cost EUR 8,000 per employee.</p>
            <h2>About Workspace Studio</h2>
            <p>Workspace Studio is an integrator of fit-out solutions and a distributor of high-quality ergonomic office furniture, as well as Herman Miller’s only Authorized Accredited Partner in Romania. Its solutions are personalized and integrated turnkey, with an emphasis on ergonomics, financial sustainability and human-centric design.</p>
            <p class="press-contact"><strong>More details:</strong><br>Anca Popa | Zacke PR | PR Consultant | anca.popa@zackepr.com | 0724.202.474</p>
        `
    },
    'cosm-red-dot-best-of-the-best.html': {
        meta: 'Press release / Bucharest, August 2019',
        title: 'Herman Miller’s Cosm chair received the Red Dot Best of the Best award for innovation and ergonomics',
        body: `
            <p>Cosm, Herman Miller’s first self-adjusting chair, received the prestigious Red Dot Best of the Best award for product design in the office chair category. The distinction was granted for innovation and ergonomics and is Cosm’s 11th award.</p>
            <p>Sold in Romania by Workspace Studio, Herman Miller’s only accredited partner, Cosm quickly became one of the top ergonomic products in the first half of 2019. In Romania, 22 companies invested in Cosm within only four months of launch.</p>
            <blockquote>Cosm’s Auto-Harmonic Tilt adjusts in real time to natural body movement and pressure. It keeps the body in permanent balance and supports both the back and arms, says Horațiu Didea, Managing Partner Workspace Studio.</blockquote>
            <p>Cosm reached more than 1,700 companies in 90 countries within less than a year of launch. It has also received awards including Product of the Year at Mixology, Green Product and the Orgatec Innovation Award.</p>
            <p>Cosm was officially launched in Romania by Workspace Studio in April, one year after its official presentation at the Milan Furniture Fair, one of the industry’s most important events. Through its automatic adjustment system and special arms, introduced for the first time, Cosm is preferred for coworking spaces, where work points are used by several people.</p>
            <p>In addition, the Red Dot Best of the Best Product Design distinction mentions functionality, material quality, durability, ergonomics, ease of use, finishes, symbolism and the ecological aspect of producing each chair among the criteria that differentiated Cosm from competitors.</p>
            <h2>About Workspace Studio</h2>
            <p>Workspace Studio is an integrator of fit-out solutions and a distributor of high-quality ergonomic office furniture, as well as Herman Miller’s only Authorized Accredited Partner in Romania. Its solutions are personalized and integrated turnkey, with an emphasis on ergonomics, financial sustainability and design centered on people, their activities and interactions.</p>
            <p class="press-contact"><strong>More details:</strong><br>Anca Popa | Zacke PR | PR Consultant | anca.popa@zackepr.com | 0724.202.474</p>
        `
    },
    'workspace-studio-afaceri-107-milioane-2019.html': {
        meta: 'Press release / Bucharest, January 2018',
        title: 'Workspace Studio doubled its revenue in 2019, reaching EUR 10.7 million',
        body: `
            <p>Workspace Studio doubled its turnover in 2019, delivering projects worth EUR 10.7 million compared with EUR 5.3 million in 2018.</p>
            <blockquote>The constant across all our projects was remarkable interest in ergonomics and quality solutions. Growth was supported across all project types, from large projects with higher budgets to more projects for smaller companies, says Horațiu Didea, Managing Partner Workspace Studio.</blockquote>
            <p>In 2019, Workspace Studio sold more than 4,500 Herman Miller chairs, with Aeron, Sayl, Mirra and the newly launched Cosm among the most desired models.</p>
            <h2>Average investment up 20%</h2>
            <p>The average investment in a workstation delivered by Workspace Studio in 2019 was EUR 1,300-1,500 per employee, up around 20% compared with 2018.</p>
            <p>The largest Workspace Studio project in 2019 was a redesign project in which a multinational company aimed to improve the working environment and employee comfort by creating informal relaxation, connection and cooperation spaces. The project was worth EUR 1.5 million, and the space was used by over XXXX employees of the company.</p>
            <p>Redesign projects increased their share in Workspace Studio’s business and generated 30% of turnover, compared with XX% in 2018. The trend toward reorganizing space based on physical and social ergonomics intensified, and relaxation areas, informal collaboration settings and ergonomic furniture pieces, especially Herman Miller chairs, were present in almost all discussions and projects carried out by Workspace Studio in 2019.</p>
            <h2>2020 focus: portfolio expansion</h2>
            <p>In 2020 Workspace Studio expands its portfolio with the Lino ergonomic chair from Herman Miller, HAY products and additional architectural products such as flooring, acoustic solutions and ceilings.</p>
            <blockquote>This year I believe we will see even more multifunctional spaces adapted to the different activities employees perform: individual work, idea exchange, presentations, contemplation, relaxation, creation and more. Specific furniture solutions, from automatic chairs designed for shared spaces to laptop tables or sofas with a separating role, will be increasingly present in our projects, says Horațiu Didea.</blockquote>
            <p>Considering the growth recorded last year, Workspace Studio expects 10% revenue growth in 2020, reaching almost EUR 13 million.</p>
            <h2>About Workspace Studio</h2>
            <p>Workspace Studio is an integrator of fit-out solutions and a distributor of high-quality ergonomic office furniture, as well as Herman Miller’s only Authorized Accredited Partner in Romania. Its solutions are personalized and integrated turnkey, with an emphasis on ergonomics, financial sustainability and human-centric design.</p>
            <p class="press-contact"><strong>More details:</strong><br>Anca Popa | Zacke PR | PR Consultant | anca.popa@zackepr.com | 0724.202.474</p>
        `
    },
    'allspace-interiors-divizie-fitout.html': {
        meta: 'Press release / Bucharest, March 2020',
        title: 'Workspace Studio expands in fit-out through a division specialized in construction and interior decoration',
        body: `
            <p>Workspace Studio Group expands in the fit-out segment through Allspace Interiors, a subsidiary created as Ștefan Rădulescu joins the management team. Rădulescu has extensive executive experience in the office furniture and interior fit-out market.</p>
            <p>Allspace Interiors specializes in construction and interior decoration for offices and has a 15-person team led by Ștefan Rădulescu.</p>
            <blockquote>Fit-out works represented around 30% of Workspace Studio’s total turnover, approximately EUR 3 million in 2019. Last year’s pace showed the need for specialization and focus, says Horațiu Didea, Managing Partner Workspace Studio.</blockquote>
            <blockquote>After almost 17 years in office furniture retail, I decided this was the right moment to develop an entrepreneurial project in a connected field. The partnership with Workspace Studio came naturally because of shared values and a common view of the standards required in current fit-out projects, says Ștefan Rădulescu, Managing Partner Allspace Interiors.</blockquote>
            <h2>What comes next</h2>
            <p>The group is extending its product and solution portfolio. Its newest strategic supplier is Mohawk Flooring, one of the world’s largest carpet and flooring solution manufacturers.</p>
            <blockquote>Workspace Studio Group offers integrated office fit-out solutions, and working with the best architectural product manufacturers is a strategic priority for our development. We are constantly looking to expand our partner portfolio with innovative companies that define trends and find solutions that improve people’s comfort and productivity, and Mohawk is exactly such a company, says Horațiu Didea.</blockquote>
            <p>The Workspace Studio Group includes Workspace Studio, Ergonomos and the newly established Allspace Interiors.</p>
            <p>Workspace Studio is an integrator of fit-out solutions, a distributor of high-quality ergonomic office furniture and Herman Miller’s only Authorized Accredited Partner in Romania. Ergonomos is the professional ergonomic solutions division, serving specialized fields such as industry, medical and HoReCa. The newest division of the group, Allspace Interiors, specializes in fit-out and interior works.</p>
            <h2>About Ștefan Rădulescu</h2>
            <p>Ștefan Rădulescu has more than 17 years of experience in office furniture retail, most recently as Chief Commercial Officer at Mobexpert Office.</p>
            <p>[+ additional details about his professional activity]</p>
            <p class="press-contact"><strong>More details:</strong><br>Anca Popa | Zacke PR | PR Consultant | anca.popa@zackepr.com | 0724.202.474</p>
        `
    },
    'recomandari-revenire-in-siguranta-la-birou.html': {
        meta: 'Press release / Bucharest, May 27, 2020',
        title: 'Workspace Studio: 5 recommendations for a safe return to the office',
        lead: '74% of employees want to return to the office for social interaction and meetings with colleagues. 60% want to keep a 2-meter distance from coworkers.',
        body: `
            <p>Workspace Studio created an eBook with recommendations for employees returning safely to the office. The guide supports clients, partners and anyone preparing workplace return plans after the state of emergency.</p>
            <blockquote>Physical offices continue to play a vital role, especially for collaborative creation, innovation and socialization. The office will become a more exclusive space, where relationships are created and things happen, says Horațiu Didea, Managing Partner Workspace Studio.</blockquote>
            <p>A recent Gensler Research Institute study shows that only one in eight employees would like to continue working exclusively remotely. 74% want to return to the office for socializing, while 55% say teamwork and collaboration are difficult from home.</p>
            <h2>A progressive return strategy</h2>
            <p><strong>1. Planning and analysis.</strong> Start with an analysis of work patterns and employee interactions, supported by anonymous surveys.</p>
            <p><strong>2. Sanitary measures.</strong> Adopt official measures and additional steps that support psychological comfort, including separation, signage and air quality solutions.</p>
            <p><strong>3. Rethinking the workspace.</strong> Reconfigure space for lower density and social distancing without major investment in new equipment.</p>
            <p><strong>4. Communication and adapted interactions.</strong> Leaders and HR teams must clearly communicate measures and expectations.</p>
            <p><strong>5. Integrating remote work into permanent policy.</strong> Flexible work-from-home policies can reduce office density and support employee comfort.</p>
            <blockquote>Sales of Herman Miller ergonomic chairs for home offices increased by more than 200%, while overall interest in ergonomic products for this segment tripled, says Horațiu Didea.</blockquote>
            <p>Workspace Studio is a local company specialized in office fit-out and furniture solutions oriented toward human-centric ergonomic design and Herman Miller’s only accredited partner in Romania. In 2019, Workspace Studio revenue reached EUR 10.7 million, double the 2018 level.</p>
        `
    },
    'extindere-portofoliu-retail-hay.html': {
        meta: 'Press release / Bucharest, June 2020',
        title: 'Workspace Studio expands its portfolio into retail after 200% growth in the segment driven by remote work',
        body: `
            <p>Driven by rising demand for residential furniture, Workspace Studio expands its Herman Miller portfolio toward B2C and brings products from Danish brand HAY to Romania. More than 200 HAY products entered the company portfolio.</p>
            <p>Between March 15 and May 15, 95% of new B2B office fit-out projects stagnated because of restrictions and the new labor-market reality. In contrast, demand for ergonomic furniture for the home increased, with some product sales doubling.</p>
            <blockquote>As a specialized integrator of office fit-out and wellbeing solutions, retail sales were previously a secondary objective. Active interest in home-office setups pushed this segment onto a strong upward trend. Herman Miller chairs and electric desks were in high demand, with sales up over 200%, says Horațiu Didea.</blockquote>
            <p>Workspace Studio is increasing its retail portfolio with chairs, armchairs, sofas, tables and desks adapted to residential use. HAY collections sit at the intersection of ergonomic office design and residential comfort.</p>
            <p>By the end of the year, residential sales are expected to continue growing steadily and may reach approximately 10% of Workspace Studio’s turnover.</p>
            <p>This positive dynamic may also be influenced by companies, especially those traditionally concerned with employee wellbeing, that have granted or may grant financial incentives to ensure a comfortable working space for employees who continue to work from home.</p>
            <p>Workspace Studio is a company specialized in fit-out solutions and human-centric ergonomic office furniture and Herman Miller’s only accredited partner in Romania. In 2019, Workspace Studio revenue reached EUR 10.7 million, double the 2018 level, and the initial 2020 target was to exceed EUR 12 million. In the current context, Workspace Studio estimates that stagnation in Q2 and Q3 will significantly affect dynamics. Even if the final quarter of the year may bring a recovery, it is expected to be slow, requiring a 30-50% correction to the initial turnover estimate for the year.</p>
            <h2>About Workspace Studio and HAY</h2>
            <p>Workspace Studio distributes high-quality ergonomic office furniture and integrated office design solutions. Its solutions are personalized and integrated turnkey, with an emphasis on ergonomics, financial sustainability and human-centric design.</p>
            <p>HAY is a Danish company founded in Copenhagen in 2002, whose majority stake is currently held by Herman Miller, an American company focused on ergonomic furniture and office design solutions. The majority stake was acquired in two stages, in 2018 and 2019, while 33% of the company remains held by the founders and Creative Directors, Rolf and Mette Hay.</p>
        `
    }
};

function renderPressTranslation() {
    const fileName = window.location.pathname.split('/').pop();
    const entry = pressTranslations[fileName];
    if (!entry) return;

    const meta = document.querySelector('.press-hero-copy span');
    const title = document.querySelector('.press-hero-copy h1');
    const lead = document.querySelector('.press-hero-copy p');
    const content = document.querySelector('.press-content');
    const backLinks = document.querySelectorAll('.press-sidebar a');
    const nextLinks = document.querySelectorAll('.press-next a');

    document.documentElement.lang = 'en';
    document.title = `${entry.title} | Press Release | Workspace Studio`;
    if (meta) meta.textContent = entry.meta;
    if (title) title.textContent = entry.title;
    if (lead) {
        if (entry.lead) {
            lead.textContent = entry.lead;
        } else {
            lead.remove();
        }
    }
    if (content) content.innerHTML = entry.body;
    backLinks.forEach((link) => {
        link.textContent = 'Back to press releases';
    });
    nextLinks.forEach((link) => {
        const text = link.textContent.trim().toLowerCase();
        if (text.includes('anterior')) link.textContent = 'Previous release';
        if (text.includes('următor') || text.includes('urmator')) link.textContent = 'Next release';
        if (text.includes('toate')) link.textContent = 'All press releases';
    });
}

renderPressTranslation();

function renderPressBottomLink() {
    if (!document.body.classList.contains('press-release-page')) return;
    if (document.querySelector('.press-bottom-link')) return;

    const sourceLink = document.querySelector('.nav-right .press-section-label');
    const pressNext = document.querySelector('.press-next');
    if (!sourceLink || !pressNext) return;

    const bottomLink = sourceLink.cloneNode(true);
    bottomLink.className = 'press-bottom-link';
    bottomLink.textContent = 'All press releases';

    const releaseLinks = Array.from(pressNext.querySelectorAll('a')).filter((link) => {
        const href = link.getAttribute('href') || '';
        return !href.includes('press-releases.html');
    });
    const nextWrapper = document.createElement('div');
    nextWrapper.className = 'press-next-links';
    releaseLinks.forEach((link) => nextWrapper.appendChild(link));

    pressNext.replaceChildren(bottomLink, nextWrapper);
}

renderPressBottomLink();
