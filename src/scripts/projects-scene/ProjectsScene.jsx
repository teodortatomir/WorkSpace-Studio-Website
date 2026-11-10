const { motion, AnimatePresence, useScroll, useTransform } = window.Motion;
const { useState, useEffect, useMemo, useRef } = React;

<!--@include {"file":"content/projects/catalog.js"} -->

const customProjectsData = (window.WorkspaceCMS?.getEntriesByType("project") || []).map((entry, index) => ({
    id: `cms-${index}-${entry.slug}`,
    title: entry.title,
    cat: entry.category || "Custom Project",
    type: entry.projectType || "Corporate",
    img: entry.coverImage || "../projects-pictures/skytower-hero.jpg",
    link: entry.sourceLink || `../cms/entry.html?type=project&slug=${encodeURIComponent(entry.slug)}`
}));

const allProjectsData = [...customProjectsData, ...projectsData];

function ProjectsScene() {
    const [filter, setFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCount, setVisibleCount] = useState(9);
    const projectsRef = useRef(null);
    const caseStudyRef = useRef(null);
    const isMobile = window.innerWidth < 768;
    const testimonials = [
        {
            brand: "Edenred",
            text: "Besides the final result, their high level of professionalism, flexibility and friendly approach determined us to recommend them to other business with no hesitation, especially to those seeking products and solutions adjusted to their individual needs and requirements – performed at the higher standards."
        },
        {
            brand: "Qualitest",
            text: "Workspaces’ team showed a lot of flexibility and ingenuity in updating the design and implementation of the project in accordance with the Romanian laws and always keeping in check with the time table."
        },
        {
            brand: "Coca Cola",
            text: "They proved to be a hardworking partner that contributed significantly in achieving the excellent standards for the completed project."
        },
        {
            brand: "Playtika",
            text: "We were pleased with the ability of Workspace to provide a balanced solution of high quality products, keeping in line with the legislation, schedule and budget."
        }
    ];
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveTab((prev) => (prev + 1) % testimonials.length);
        }, 8000);

        return () => clearInterval(timer);
    }, [testimonials.length]);

    // EFECT PARALAX FIXED WINDOW (RHINO STYLE)
    const { scrollYProgress } = useScroll({
        target: caseStudyRef,
        offset: ["start end", "end start"]
    });
    
    const yBackground = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    const scrollToProjects = () => {
        const offset = 0; // Match your navbar height
        const element = projectsRef.current;
        const headerOffset = offset;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    };

    const handleViewMore = () => {
        setVisibleCount(prev => prev + 9);
    };

    const filteredProjects = useMemo(() => {
        const filtered = allProjectsData.filter(p => {
            const matchesFilter = filter === "All" || p.type === filter;
            const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        });
        return filtered.slice(0, visibleCount);
    }, [filter, searchQuery, visibleCount]);

    const getCount = (cat) => cat === "All" ? allProjectsData.length : allProjectsData.filter(p => p.type === cat).length;
    const categories = ["All", "Corporate", "Tech", "Exclusive", "Beauty"];

    return (
        <div className="page-wrapper bg-white">
            {/* HERO SECTION */}
            <section className="hero-abstract">
                <motion.figure
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="projects-hero-visual"
                >
                    <img src="../index-photos/team.jpg" alt="Workspace Studio workplace project with collaborative office zones" />
                </motion.figure>
            </section>

            <section className="projects-intro">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.08 }}
                    className="projects-intro-copy"
                >
                    <span>Projects</span>
                    <h1>Modern workspaces shaped with clarity, precision, and presence.</h1>
                    <p>Explore commercial interiors, headquarters, hospitality spaces, and workplace environments delivered across different industries.</p>
                </motion.div>
            </section>

            {/* PROJECTS SECTION */}
            <main ref={projectsRef} className="projects-container">
                <div className="toolbar-visual">
                    <div className="filter-bar-editorial">
                        {categories.map(cat => (
                            <button key={cat} onClick={() => { setFilter(cat); setVisibleCount(9); }} className={`filter-link ${filter === cat ? 'active' : ''}`}>
                                {cat} <span className="count-sup">{getCount(cat)}</span>
                            </button>
                        ))}
                    </div>
                    <div className="search-container-visual">
                        <div className="search-glass">
                            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input type="text" placeholder="Search by name..." className="search-input-visual" onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                    </div>
                </div>

                <motion.div layout className="dynamic-grid-editorial">
                    <AnimatePresence mode='popLayout'>
                        {filteredProjects.map((p, i) => ( // Adăugăm 'i' pentru index
                            <motion.div 
                                key={p.id} 
                                layout
                                initial={{ opacity: 0, y: 40 }} // Pornim de puțin mai de jos pentru un "lift" mai lung
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }} // Apare când e 100px în interiorul ecranului
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ 
                                    duration: 0.9,          // S-a mărit de la 0.6 la 0.9 secunde pentru o apariție mai lentă
                                    ease: [0.16, 1, 0.3, 1], // Curbă "Cubic Bezier" pentru o mișcare mai fluidă, arhitecturală
                                    delay: (i % 3) * 0.15    // Stagger: decalează cardurile din același rând cu 0.15s
                                }}
                                className="project-card-editorial group"
                            >
                                <a href={p.link} className="block no-underline">
                                    <div className="img-container-editorial">
                                        <div className={`discover-badge-editorial${/uipath\s*2018|agentic\s*automation|uipath|adobe|honeywell|hbo|data\s*core|datacore|b\s*braun|bbraun|tchibo|intero\s*property\s*development|inte?ro|legrand|loreal\s*academy|l['’]?\s*oreal\s*academy|urban\s*bistro,\s*isho|isho|aj\s*brand|mindspace|grupo\s*bimbo|bimbo|diversinst|ams\s*accelerate\s*it|\bams\b|unilever|naos|rphi|rbi\s*group|vectra\s*international|vectra|the\s*business\s*factory|h\s*private\s*arghezi|arghezi|h\s*private|anvelope\.?\s*ro|anvelope|skytower|qualitest|united\s*media\s*services|axpo|evolution|laguna\s*technology|laguna|novo\s*nordisk|thought\s*works|thoughtworks|euroins|nestle|jgv|asociatii|\bvgp\b|edenred|adswizz|konecta|benefit\s*by\s*edenred|workspace\s*studio|millerknoll\s*certified\s*dealer|engie|xperi|exiger|esky|coca[\s-]?cola|panasonic|signivis|axway|crisp|west\s*gate|metro\s*systems|timken|gmv|playtika|w\.?\s*a\.?\s*g\.?|eurowag|bayer|impact\s*hub|tmf\s*group|profi|alfasigma|swixx|l['’]?\s*oreal\s*romania|loreal\s*romania|tiriac\s*collection|omv\s*petrom|petrom\s*city|uber/i.test(p.title) ? " logo-badge-editorial" : ""}${/tiriac\s*collection/i.test(p.title) ? " logo-badge-editorial-tiriac" : ""}`}>
                                            {/uipath\s*2018|agentic\s*automation/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/uipath-agentic-automationlogo.png"
                                                    alt="UiPath Agentic Automation"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /uipath/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/uipath-latest-logo.png"
                                                    alt="UiPath"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /adobe/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/adobe-seeklogo.png"
                                                    alt="Adobe"
                                                    className="discover-logo-editorial discover-logo-editorial-adobe"
                                                />
                                            ) : /honeywell/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/honeywell-seeklogo.png"
                                                    alt="Honeywell"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /hbo/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/hbo-seeklogo.png"
                                                    alt="HBO Romania"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /data\s*core|datacore/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/data_core_logo.png"
                                                    alt="DataCore"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /b\s*braun|bbraun/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/bbraun-logo.png"
                                                    alt="BBraun"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /tchibo/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/tchibo_logo.png"
                                                    alt="Tchibo"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /intero\s*property\s*development|inte?ro/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/intero-logo-black.png"
                                                    alt="InteRo Property Development"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /legrand/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/legrand_logo.png"
                                                    alt="Legrand"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /loreal\s*academy|l['’]?\s*oreal\s*academy/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/logo-loreal-academy.png"
                                                    alt="Loreal Academy"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /urban\s*bistro,\s*isho|isho/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/logo-isho.png"
                                                    alt="Urban Bistro, ISHO"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /aj\s*brand/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/aj-brand-logo.jpg"
                                                    alt="AJ Brand"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /mindspace/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/mindspace_logo.png"
                                                    alt="Mindspace"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /grupo\s*bimbo|bimbo/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/grupo_bimbo-logo.png"
                                                    alt="Grupo Bimbo"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /diversinst/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/logo-diversinst.png"
                                                    alt="Diversinst"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /ams\s*accelerate\s*it|\bams\b/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/ams-logo.png"
                                                    alt="AMS Accelerate IT"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /unilever/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/unilever-logo.png"
                                                    alt="Unilever"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /naos/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/naos-logo.png"
                                                    alt="Naos Skin Care Romania"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /rphi|rbi\s*group/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/rphi-logo.png"
                                                    alt="RPHI member of RBI Group"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /vectra\s*international|vectra/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/vectra-international-logo.jpg"
                                                    alt="Vectra International"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /the\s*business\s*factory/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/the-business-factory-logo.png"
                                                    alt="The Business Factory"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /h\s*private\s*arghezi|arghezi|h\s*private/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/logo_targhezi_hprivate.png"
                                                    alt="H Private Arghezi"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /anvelope\.?\s*ro|anvelope/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/anvelope-ro-logo.png"
                                                    alt="Anvelope.ro"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /skytower/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/logo-skytower.png"
                                                    alt="Skytower"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /qualitest/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/qualitest.jpg"
                                                    alt="QualiTest DC RO"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /united\s*media\s*services/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/united-media-services-logo.png"
                                                    alt="United Media Services"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /axpo/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/axpo-logo.png"
                                                    alt="AXPO ROMANIA"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /evolution/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/evolution-logo.png"
                                                    alt="Evolution"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /laguna\s*technology|laguna/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/logo_laguna_technology.png"
                                                    alt="Laguna Technology"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /novo\s*nordisk/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/novonordisk_logo.png"
                                                    alt="Novo Nordisk Farma"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /thought\s*works|thoughtworks/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/thoughtworks-logo.png"
                                                    alt="ThoughtWorks Romania"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /euroins/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/logo-euroins.png"
                                                    alt="Euroins"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /nestle/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/nestle-logo.png"
                                                    alt="Nestle Romania"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /jgv|asociatii/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/jgv-asociatii-logo.jpg"
                                                    alt="SCPA JGV & Asociatii"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /\bvgp\b/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/vgp_logo-building-tomorrow-today.jpg"
                                                    alt="VGP Building"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /edenred\s*benefit|benefit\s*by\s*edenred|benefit/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/logo-benefit-edenred.jpg"
                                                    alt="Benefit by Edenred"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /edenred/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/edenred-logo.png"
                                                    alt="Edenred"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /adswizz/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/adswizz-logo.png"
                                                    alt="Adswizz Ro"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /konecta/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/konecta-logo.jpg"
                                                    alt="Konecta Global"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /workspace\s*studio|millerknoll\s*certified\s*dealer/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/logo-workspace-studio-mk_certifieddealer.jpg"
                                                    alt="Workspace Studio MillerKnoll Certified Dealer"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /engie/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/engie_romania-logo.png"
                                                    alt="ENGIE Romania"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /xperi/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/xperi-logo.jpg"
                                                    alt="Xperi"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /exiger/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/exiger-logo.jpg"
                                                    alt="Exiger Diligence Tech"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /esky/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/esky-logo.jpg"
                                                    alt="eSky Travel Search"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /coca[\s-]?cola/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/cocacola-logo.png"
                                                    alt="Coca Cola Romania"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /panasonic/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/panasonic-logo.jpg"
                                                    alt="Panasonic"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /signivis/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/signivis-logo.jpg"
                                                    alt="Signivis"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /axway/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/axway-logo.jpg"
                                                    alt="AXWAY"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /crisp/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/crisp-logo.jpg"
                                                    alt="CRISP Payments"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /west\s*gate/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/west_gate_logo.jpg"
                                                    alt="West Gate"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /metro\s*systems/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/metrosystems-logo.jpg"
                                                    alt="METRO SYSTEMS"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /timken/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/timken-logo.png"
                                                    alt="TIMKEN"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /gmv/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/gmv-logo.png"
                                                    alt="GMV"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /playtika/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/playtika-logo.jpg"
                                                    alt="Playtika"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /w\.?\s*a\.?\s*g\.?|eurowag/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/eurowag-logo.png"
                                                    alt="Eurowag"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /bayer/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/bayer-logo.jpg"
                                                    alt="Bayer"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /impact\s*hub/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/impact_hub-logo.png"
                                                    alt="Impact Hub"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /tmf\s*group/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/logo-tmf.jpg"
                                                    alt="TMF Group"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /profi/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/profi-logo.jpg"
                                                    alt="Profi"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /alfasigma/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/logo-alfasigma.png"
                                                    alt="Alfasigma Romania"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /swixx/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/swixx-biopharma.jpg"
                                                    alt="Swixx BioPharma"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /l['’]?\s*oreal\s*romania|loreal\s*romania/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/logo-loreal-romania.png"
                                                    alt="L'Oreal Romania"
                                                    className="discover-logo-editorial"
                                                />
                                            ) : /tiriac\s*collection/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/logo-tiriac-collection.jpg"
                                                    alt="Tiriac Collection"
                                                    className="discover-logo-editorial discover-logo-editorial-tiriac"
                                                />
                                            ) : /omv\s*petrom|petrom\s*city/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/petrom-seeklogo.svg"
                                                    alt="OMV Petrom"
                                                    className="discover-logo-editorial discover-logo-editorial-omv"
                                                />
                                            ) : /uber/i.test(p.title) ? (
                                                <img
                                                    src="../logos-projects/uber-seeklogo.svg"
                                                    alt="UBER Romania"
                                                    className="discover-logo-editorial discover-logo-editorial-uber"
                                                />
                                            ) : (
                                                <span>View Project</span>
                                            )}
                                        </div>
                                        <img src={p.img} alt={p.title} className="img-editorial" loading="lazy" />
                                    </div>
                                    <div className="content-editorial">
                                        <span className="cat-tag-editorial">{p.cat}</span>
                                        <h3 className="title-editorial">{p.title}</h3>
                                        <div className="hover-line-zen"></div>
                                    </div>
                                </a>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
                
                {/* BUTTON DISAPPEARS LOGIC */}
                {visibleCount < projectsData.filter(p => {
                    const matchesFilter = filter === "All" || p.type === filter;
                    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
                    return matchesFilter && matchesSearch;
                }).length && (
                    <div className="view-more-container">
                        <button onClick={handleViewMore} className="view-more-btn">
                            Load More Projects
                            <span className="btn-line"></span>
                        </button>
                    </div>
                )}
            </main>

            <section className="testimonial-slider-section">
                <div className="testimonial-container">
                    {/* Container cu înălțime minimă pentru a preveni jumping-ul layout-ului */}
                    <div className="testimonial-fixed-height-wrapper" style={{ position: 'relative', width: '100%', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                                className="testimonial-content"
                                style={{ position: 'absolute', width: '100%' }}
                            >
                                <span className="testimonial-brand">{testimonials[activeTab].brand}</span>
                                <p className="testimonial-quote">"{testimonials[activeTab].text}"</p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            <section className="projects-cta-section">
                <motion.div
                    className="projects-cta"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <span>Have a workplace project in mind?</span>
                    <h2>It all starts with a "hello".</h2>
                    <a href="../contact/contact.html">Get in touch</a>
                </motion.div>
            </section>

            

            {/* FOOTER */}
            <footer className="site-footer main-footer">
                <div className="site-footer-inner">
                    <div className="site-footer-top">
                        <nav className="site-footer-nav" aria-label="Footer navigation">
                            <a className="site-footer-link" href="../projects-scene/proiecte.html">Projects</a>
                            <a className="site-footer-link" href="../index.html#services">Services</a>
                            <a className="site-footer-link" href="../partners/partners.html">Brands &amp; Partners</a>
                            <a className="site-footer-link" href="../about/about.html">About</a>
                            <a className="site-footer-link" href="../insights/insights.html">Insights</a>
                            <a className="site-footer-link" href="https://shop.workspaces.ro/en/catalog" target="_blank" rel="noopener noreferrer">Shop</a>
                            <a className="site-footer-link" href="../contact/contact.html">Contact / Start a Project</a>
                        </nav>
                        <a className="site-footer-link site-footer-action" href="../index.html">Back to Home</a>
                    </div>
                    <div className="site-footer-bottom">
                        <p className="site-footer-copy">&copy; 2026 Workspace Studio. All rights reserved.</p>
                        <div className="site-footer-socials">
                            <a className="site-footer-link" href="https://www.instagram.com/workspace__studio/" target="_blank" rel="noopener noreferrer">Instagram</a>
                            <a className="site-footer-link" href="https://www.facebook.com/WorkspaceStudio.ro/" target="_blank" rel="noopener noreferrer">Facebook</a>
                            <a className="site-footer-link" href="https://www.linkedin.com/company/workspace-studio/posts/?feedView=all" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('projects-root'));
root.render(<ProjectsScene />);
