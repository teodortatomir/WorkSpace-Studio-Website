const { motion } = window.Motion;

const projects = [
    { id: 1, title: "UiPath", cat: "Global Headquarters", img: "../images/uipath-header.jpg", link: "../projects/UiPath/uipath.html" },
    { id: 2, title: "Adobe", cat: "Romania Hub", img: "../images/adobe-header.jpg", link: "#" },
    { id: 3, title: "Tiriac Collection", cat: "Exclusive Automotive Gallery", img: "../projects-pictures/tiriac-collection.jpg", link: "#" },
    { id: 4, title: "Honeywell", cat: "Research & Ops", img: "../images/honeywell-header.jpg", link: "#" },
    { id: 5, title: "OMV Petrom", cat: "Corporate Campus", img: "../images/omvpetrom-header.jpg", link: "#" },
    { id: 6, title: "Unilever", cat: "Sustainability Office", img: "../images/unilever-header.jpg", link: "#" },
    { id: 7, title: "BBraun", cat: "Innovation Center", img: "../projects-pictures/bbraun.jpg", link: "#" },
    { id: 8, title: "DataCore", cat: "Tech Hub", img: "../projects-pictures/datacore.jpg", link: "#" },
    { id: 9, title: "InteRo Property Development", cat: "High-End Residential & Office", img: "../projects-pictures/intero.jpg", link: "#" }
];

function ProjectsScene() {
    return (
        <main className="pt-48 pb-40">
            <div className="projects-container">
                {/* Header Section */}
                <header className="mb-32">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }} 
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-4xl"
                    >
                        <span className="text-[11px] uppercase tracking-[0.6em] text-[#c5a37d] font-bold mb-6 block">
                            Our Portfolio
                        </span>
                        <h1 className="text-6xl md:text-8xl font-light tracking-tight text-[#2d2a26] leading-[0.9]">
                            Offices people love to <br />
                            <span className="font-serif italic text-[#c5a37d]">work in.</span>
                        </h1>
                    </motion.div>
                </header>

                {/* Editorial Grid */}
                <div className="editorial-grid">
                    {projects.map((p, index) => (
                        <motion.div 
                            key={p.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ 
                                duration: 1, 
                                delay: (index % 3) * 0.1, // Delay optimizat pentru 3 coloane
                                ease: [0.16, 1, 0.3, 1] 
                            }}
                            viewport={{ once: true, margin: "-50px" }}
                        >
                            <a href={p.link} className="project-card group">
                                <div className="image-container">
                                    {/* Overlay-ul fin */}
                                    <div className="image-overlay">
                                        <span className="view-text">View Project</span>
                                    </div>
                                    
                                    <img src={p.img} alt={p.title} loading="lazy" />
                                </div>
                                
                                <div className="project-info-box">
                                    <span className="cat-label">{p.cat}</span>
                                    <h3 className="title-display">{p.title}</h3>
                                    <div className="hover-line"></div>
                                </div>
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}

const root = ReactDOM.createRoot(document.getElementById('projects-root'));
root.render(<ProjectsScene />);