const { motion, AnimatePresence, useScroll, useTransform } = window.Motion;
const { useState, useEffect, useMemo, useRef } = React;

const projectsData = [
    { id: 1, title: "OMV Petrom", cat: "Corporate Campus", type: "Corporate", img: "../projects-pictures/omvpetrom.jpg", link: "#" },
    { id: 2, title: "Tiriac Collection", cat: "Exclusive Automotive Gallery", type: "Exclusive", img: "../projects-pictures/tiriac-collection.jpg", link: "#" },
    { id: 3, title: "L'Oreal Romania", cat: "Beauty & Lifestyle", type: "Beauty", img: "../projects-pictures/loreal-romania.jpg", link: "#" },
    { id: 4, title: "Tchibo", cat: "Coffee HQ", type: "Corporate", img: "../projects-pictures/tchibo.jpg", link: "#" },
    { id: 5, title: "BBraun", cat: "Innovation Center", type: "Tech", img: "../projects-pictures/bbraun.jpg", link: "#" },
    { id: 6, title: "DataCore", cat: "Tech Hub", type: "Tech", img: "../projects-pictures/datacore.jpg", link: "#" },
    { id: 7, title: "InteRo Property Development", cat: "High-End Office", type: "Corporate", img: "../projects-pictures/intero.jpg", link: "#" },
    { id: 8, title: "Legrand", cat: "Electrical Solutions HQ", type: "Tech", img: "../projects-pictures/legrand.jpg", link: "#" },
    { id: 9, title: "Loreal Academy", cat: "Professional Training", type: "Beauty", img: "../projects-pictures/loreal.jpg", link: "#" },
    { id: 10, title: "Honeywell", cat: "Research & Ops", type: "Tech", img: "../projects-pictures/honeywell.jpg", link: "#" },
    { id: 11, title: "Urban Bistro, ISHO", cat: "Social Space", type: "Exclusive", img: "../projects-pictures/urbanbistro-isho.jpeg", link: "#" },
    { id: 12, title: "AJ Brand", cat: "Creative Office", type: "Corporate", img: "../projects-pictures/aj.jpg", link: "#" },
    { id: 13, title: "Mindspace", cat: "Co-working Space", type: "Corporate", img: "../projects-pictures/mindspaces.jpg", link: "#" },
    { id: 14, title: "Grupo Bimbo", cat: "FMCG HQ", type: "Corporate", img: "../projects-pictures/bimbo.jpg", link: "#" },
    { id: 15, title: "Diversinst", cat: "Engineering Office", type: "Tech", img: "../projects-pictures/diversinst.jpg", link: "#" },
    { id: 16, title: "TMF Group", cat: "Professional Services", type: "Corporate", img: "../projects-pictures/tmf-group.jpg", link: "#" },
    { id: 17, title: "Profi", cat: "Retail Management", type: "Corporate", img: "../projects-pictures/profi.jpg", link: "#" },
    { id: 18, title: "UiPath", cat: "Global Headquarters", type: "Tech", img: "../projects-pictures/uipath.jpg", link: "../projects/UiPath/uipath.html" },
    { id: 19, title: "Adobe", cat: "Romania Hub", type: "Tech", img: "../projects-pictures/adobe.jpg", link: "#" },
    { id: 20, title: "Unilever", cat: "Sustainability Office", type: "Corporate", img: "../projects-pictures/unilever.jpg", link: "#" },
    { id: 21, title: "Alfasigma Romania", cat: "Pharmaceutical HQ", type: "Corporate", img: "../projects-pictures/alfasigma.jpg", link: "#" },
    { id: 22, title: "Swixx BioPharma", cat: "Healthcare Solutions", type: "Corporate", img: "../projects-pictures/swixx.jpg", link: "#" },
    { id: 23, title: "AMS Accelerate IT", cat: "IT Performance Center", type: "Tech", img: "../projects-pictures/ams.jpg", link: "#" },
    { id: 24, title: "Live Dealer Gaming", cat: "Gaming Infrastructure", type: "Tech", img: "../projects-pictures/dealer-gaming.jpg", link: "#" },
    { id: 25, title: "Technology Company", cat: "Innovation Lab", type: "Tech", img: "../projects-pictures/technology-company.jpg", link: "#" },
    { id: 26, title: "Naos Skin Care Romania", cat: "Dermocosmetics HQ", type: "Beauty", img: "../projects-pictures/naos.jpg", link: "#" },
    { id: 27, title: "RIRBRO Estate Management", cat: "Property Services", type: "Corporate", img: "../projects-pictures/rirbro.jpg", link: "#" },
    { id: 28, title: "Vectra International", cat: "Supply Chain Excellence", type: "Corporate", img: "../projects-pictures/vectra.jpg", link: "#" },
    { id: 29, title: "The Business Factory by Ceetrus", cat: "Collaborative Hub", type: "Corporate", img: "../projects-pictures/the-business-factory.jpg", link: "#" },
    { id: 30, title: "HAGAG Development Europe", cat: "Real Estate HQ", type: "Exclusive", img: "../projects-pictures/hagag.jpg", link: "#" },
    { id: 31, title: "Anvelope.Ro", cat: "E-commerce Logistics", type: "Corporate", img: "../projects-pictures/anvelope.jpg", link: "#" },
    { id: 32, title: "Technology Company", cat: "Digital Solutions", type: "Tech", img: "../projects-pictures/tech-company.jpg", link: "#" },
    { id: 33, title: "Skytower", cat: "High-Rise Office Space", type: "Exclusive", img: "../projects-pictures/skytower.jpg", link: "#" },
    { id: 34, title: "QualiTest DC RO", cat: "Quality Assurance Hub", type: "Tech", img: "../projects-pictures/qualitest.jpg", link: "#" },
    { id: 35, title: "United Media Services", cat: "Media & Advertising", type: "Exclusive", img: "../projects-pictures/united-media-services.jpg", link: "#" },
    { id: 36, title: "AXPO ROMANIA", cat: "Energy Trading HQ", type: "Corporate", img: "../projects-pictures/axpo.jpg", link: "#" },
    { id: 37, title: "EVOLUTION GAMING", cat: "Live Casino Studio", type: "Tech", img: "../projects-pictures/evolution-gaming.jpg", link: "#" },
    { id: 38, title: "Laguna Technology", cat: "IT Development", type: "Tech", img: "../projects-pictures/laguna.jpg", link: "#" },
    { id: 39, title: "Kraftanlagen & IPIP", cat: "Industrial Engineering", type: "Corporate", img: "../projects-pictures/kraftanlagen.jpg", link: "#" },
    { id: 40, title: "HBO Romania", cat: "Media & Entertainment", type: "Exclusive", img: "../projects-pictures/hbo.jpg", link: "#" },
    { id: 41, title: "Novo Nordisk Farma", cat: "Healthcare Excellence", type: "Corporate", img: "../projects-pictures/novonordisk.jpg", link: "#" },
    { id: 42, title: "ThoughtWorks Romania", cat: "Software Excellence", type: "Tech", img: "../projects-pictures/thoughtworks.jpg", link: "#" },
    { id: 44, title: "Skytower Block", cat: "Vertical Campus", type: "Exclusive", img: "../projects-pictures/skytower-block.jpg", link: "#" },
    { id: 45, title: "Nestle Romania", cat: "FMCG Leader HQ", type: "Corporate", img: "../projects-pictures/nestle.jpg", link: "#" },
    { id: 46, title: "Leading Pharma Company", cat: "Biotech Innovation", type: "Corporate", img: "../projects-pictures/pharma-company.jpg", link: "#" },
    { id: 47, title: "SCPA JGV & Asociatii", cat: "Legal Chambers", type: "Corporate", img: "../projects-pictures/jgv-asociatii.jpg", link: "#" },
    { id: 48, title: "CCP.RO", cat: "Financial Infrastructure", type: "Tech", img: "../projects-pictures/ccpro.jpg", link: "#" },
    { id: 49, title: "VGP Building", cat: "Logistics Excellence", type: "Corporate", img: "../projects-pictures/vgp.jpg", link: "#" },
    { id: 50, title: "Edenred Digital Center", cat: "Digital Benefits Hub", type: "Tech", img: "../projects-pictures/edenred.jpg", link: "#" },
    { id: 51, title: "Adswizz Ro", cat: "Audio Ad Tech", type: "Tech", img: "../projects-pictures/adswizz.jpg", link: "#" },
    { id: 52, title: "Konecta Global", cat: "Customer Experience", type: "Corporate", img: "../projects-pictures/konecta.jpg", link: "#" },
    { id: 53, title: "Edenred Benefit", cat: "Employee Experience", type: "Corporate", img: "../projects-pictures/edenred-benefit.jpg", link: "#" },
    { id: 54, title: "WorkSpace Studio", cat: "Design Showroom", type: "Exclusive", img: "../projects-pictures/workspace-studio.jpg", link: "#" },
    { id: 55, title: "Leading IT Company", cat: "Global Tech Hub", type: "Tech", img: "../projects-pictures/leading-it-company.jpg", link: "#" },
    { id: 56, title: "Leading Gaming Company P1", cat: "Game Dev Studio", type: "Tech", img: "../projects-pictures/leading-game-company.jpg", link: "#" },
    { id: 57, title: "Leading Gaming Company P2", cat: "Gaming Campus", type: "Tech", img: "../projects-pictures/leading-game-company-p2.jpg", link: "#" },
    { id: 58, title: "PTC Riverview", cat: "Engineering Hub", type: "Tech", img: "../projects-pictures/ptc.jpg", link: "#" },
    { id: 59, title: "PTC Bruxelles", cat: "Tech Campus", type: "Tech", img: "../projects-pictures/ptc-bruxelles.jpg", link: "#" },
    { id: 60, title: "Leading IT Company", cat: "Digital Ops", type: "Tech", img: "../projects-pictures/leading-it.jpg", link: "#" },
    { id: 61, title: "Qualitest DC 2019", cat: "Tech Verification", type: "Tech", img: "../projects-pictures/qualitest-2019.jpg", link: "#" },
    { id: 62, title: "ENGIE Romania", cat: "Energy Solutions HQ", type: "Corporate", img: "../projects-pictures/engie.jpg", link: "#" },
    { id: 63, title: "UBER Romania", cat: "Mobility Hub", type: "Tech", img: "../projects-pictures/uber.jpg", link: "#" },
    { id: 64, title: "Xperi", cat: "Audio/Imaging Tech", type: "Tech", img: "../projects-pictures/xperi.jpg", link: "#" },
    { id: 65, title: "Exiger Diligence Tech", cat: "Risk Management Hub", type: "Tech", img: "../projects-pictures/exiger.jgp", link: "#" },
    { id: 66, title: "eSky Travel Search", cat: "Travel Tech HQ", type: "Tech", img: "../projects-pictures/eSky.jpg", link: "#" },
    { id: 67, title: "COCA COLA ROMANIA", cat: "Beverage Leader HQ", type: "Corporate", img: "../projects-pictures/coca-cola.jpg", link: "#" },
    { id: 68, title: "Panasonic", cat: "Electronics HQ", type: "Tech", img: "../projects-pictures/panasonic.jpg", link: "#" },
    { id: 69, title: "UiPath 2018", cat: "RPA Pioneer Hub", type: "Tech", img: "../projects-pictures/uipath-2018.jpg", link: "#" },
    { id: 70, title: "Leading Logistic Company", cat: "Global Supply Chain", type: "Corporate", img: "../projects-pictures/leading-logistic-company.jpg", link: "#" },
    { id: 71, title: "Leading Tech Company", cat: "Innovation Hub", type: "Tech", img: "../projects-pictures/leading-tech-company.jpg", link: "#" },
    { id: 72, title: "Signivis", cat: "Visual Identity HQ", type: "Exclusive", img: "../projects-pictures/Signivis.jpg", link: "#" },
    { id: 73, title: "Edenred Romania", cat: "Benefit Solutions", type: "Corporate", img: "../projects-pictures/edenred-romania.jpg", link: "#" },
    { id: 74, title: "Adobe 2018", cat: "Cloud Tech Hub", type: "Tech", img: "../projects-pictures/adobe-2018.jpg", link: "#" },
    { id: 75, title: "AXWAY Central P1", cat: "Digital Transformation", type: "Tech", img: "../projects-pictures/axway.jpg", link: "#" },
    { id: 76, title: "AXWAY Central P2", cat: "Enterprise Tech", type: "Tech", img: "../projects-pictures/axway2.jpg", link: "#" },
    { id: 77, title: "UAUIM Ion Mincu", cat: "Educational Design", type: "Exclusive", img: "../projects-pictures/amenajare-interioara-facultatea-arhitectura-urbanism.jpg", link: "#" },
    { id: 78, title: "CRISP Payments", cat: "Financial Services", type: "Tech", img: "../projects-pictures/crisp.jpg", link: "#" },
    { id: 79, title: "West Gate Pool", cat: "Leisure Design", type: "Exclusive", img: "../projects-pictures/westgate.jpg", link: "#" },
    { id: 80, title: "West Gate Reception", cat: "Hospitality Design", type: "Exclusive", img: "../projects-pictures/westgate-reception.jpg", link: "#" },
    { id: 81, title: "West Gate Hotel", cat: "Premium Hospitality", type: "Exclusive", img: "../projects-pictures/westgate-hotel.jpg", link: "#" },
    { id: 82, title: "METRO SYSTEMS", cat: "Retail Tech Solutions", type: "Tech", img: "../projects-pictures/metro-systems.jpg", link: "#" },
    { id: 83, title: "TIMKEN Romania", cat: "Bearing Innovation HQ", type: "Corporate", img: "../projects-pictures/timken.jpg", link: "#" },
    { id: 84, title: "GMV INNOVATING", cat: "Aerospace & Defence", type: "Tech", img: "../projects-pictures/gmv.jpg", link: "#" },
    { id: 85, title: "PlayTika HOMERUN", cat: "Gaming HQ", type: "Tech", img: "../projects-pictures/ciero.jpg", link: "#" },
    { id: 86, title: "W.A.G. Payment Solutions", cat: "Fintech HQ", type: "Tech", img: "../projects-pictures/eurowag.jpg", link: "#" },
    { id: 87, title: "Bayer", cat: "Agro-Pharma HQ", type: "Corporate", img: "../projects-pictures/bayer.jpg", link: "#" },
    { id: 88, title: "Impact Hub Equilibrium", cat: "Community Hub", type: "Exclusive", img: "../projects-pictures/impact-hub.jpg", link: "#" },
    { id: 89, title: "Impact Hub Timpuri Noi", cat: "Creative Workspace", type: "Exclusive", img: "../projects-pictures/impact-hub-timpuri-noi.jpg", link: "#" },
    { id: 90, title: "Impact Hub Bucuresti", cat: "Startup Ecosystem", type: "Exclusive", img: "../projects-pictures/impact-hub-bucuresti.jpg", link: "#" },
    { id: 91, title: "Impact Hub Cluj", cat: "Tech Community Center", type: "Exclusive", img: "../projects-pictures/impact_hub_cluj-napoca.jpg", link: "#" }
];

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
                <div className="hero-container">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.8 }} 
                        className="hero-text-side"
                    >
                        <span className="hero-tag">Workspace Studio</span>
                        <h1 className="hero-title-main">
                            Modern 
                            <span className="font-serif">Workspaces.</span>
                        </h1>
                        <p className="hero-desc">
                            Elevating commercial environments through high-performance design and architectural precision.
                        </p>
                        <button onClick={scrollToProjects} className="hero-discover-btn">
                            Explore Projects 
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
                        </button>
                    </motion.div>
                    <div className="hero-gallery-abstract">
                        <motion.div animate={{ y: [0, -25, 0] }} transition={{ duration: 7, repeat: Infinity }} className="abs-img-1"><img src="../projects-pictures/leading-it.jpg" alt="" /></motion.div>
                        <motion.div animate={{ y: [0, 25, 0] }} transition={{ duration: 9, repeat: Infinity }} className="abs-img-2"><img src="../projects-pictures/loreal-romania.jpg" alt="" /></motion.div>
                        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 1 }} className="abs-img-main"><img src="../projects-pictures/omvpetrom.jpg" alt="" /></motion.div>
                    </div>
                </div>
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
                                        <div className={`discover-badge-editorial${p.title === "UiPath" ? " logo-badge-editorial" : ""}`}>
                                            {p.title === "UiPath" ? (
                                                <img
                                                    src="../logos-projects/uipath-seeklogo.svg"
                                                    alt="UiPath"
                                                    className="discover-logo-editorial"
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

            {/* ACUM ADAUGATA: CONTACT SECTION */}
            <section className="contact-section-editorial">
                <div className="contact-grid">
                    <div className="contact-image-side">
                        <div className="contact-image-wrapper">
                            <img src="../projects-pictures/Horatiu-Didea.jpg" alt="Contact Us" className="contact-img" />
                        </div>
                    </div>
                    <div className="contact-form-side">
                        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                            <span className="contact-label">Get in touch</span>
                            <h2 className="contact-title">It all starts with <br /><span className="font-serif italic text-[#3c4a57]">"hello".</span></h2>
                            <p className="contact-desc">Fill out the form below and one of our specialists will be in touch shortly to discuss your workspace needs.</p>
                            
                            <form className="minimal-form">
                                <div className="form-group">
                                    <input type="text" placeholder="Full Name" required />
                                </div>
                                <div className="form-group">
                                    <input type="email" placeholder="Business Email" required />
                                </div>
                                <div className="form-group">
                                    <textarea placeholder="Tell us about your project" rows="4"></textarea>
                                </div>
                                <button type="submit" className="form-submit-btn">
                                    Send Message
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
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
