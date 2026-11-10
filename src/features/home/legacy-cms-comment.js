                    /*
                    if (window.WorkspaceCMS) {
                        const customProjects = window.WorkspaceCMS.getEntriesByType('project');
                        const sliderTrack = document.querySelector('[data-projects-track]');

                        if (sliderTrack && customProjects.length) {
                            const projectHoverLogos = [
                                {
                                    matcher: /uipath\s*2018|agentic\s*automation/i,
                                    src: 'logos-projects/uipath-agentic-automationlogo.png',
                                    alt: 'UiPath Agentic Automation'
                                },
                                {
                                    matcher: /uipath/i,
                                    src: 'logos-projects/uipath-latest-logo.png',
                                    alt: 'UiPath'
                                },
                                {
                                    matcher: /adobe/i,
                                    src: 'logos-projects/adobe-seeklogo.png',
                                    alt: 'Adobe'
                                },
                                {
                                    matcher: /honeywell/i,
                                    src: 'logos-projects/honeywell-seeklogo.png',
                                    alt: 'Honeywell'
                                },
                                {
                                    matcher: /hbo/i,
                                    src: 'logos-projects/hbo-seeklogo.png',
                                    alt: 'HBO Romania'
                                },
                                {
                                    matcher: /data\s*core|datacore/i,
                                    src: 'logos-projects/data_core_logo.png',
                                    alt: 'DataCore'
                                },
                                {
                                    matcher: /b\s*braun|bbraun/i,
                                    src: 'logos-projects/bbraun-logo.png',
                                    alt: 'BBraun'
                                },
                                {
                                    matcher: /tchibo/i,
                                    src: 'logos-projects/tchibo_logo.png',
                                    alt: 'Tchibo'
                                },
                                {
                                    matcher: /intero\s*property\s*development|inte?ro/i,
                                    src: 'logos-projects/intero-logo-black.png',
                                    alt: 'InteRo Property Development'
                                },
                                {
                                    matcher: /legrand/i,
                                    src: 'logos-projects/legrand_logo.png',
                                    alt: 'Legrand'
                                },
                                {
                                    matcher: /loreal\s*academy|l['’]?\s*oreal\s*academy/i,
                                    src: 'logos-projects/logo-loreal-academy.png',
                                    alt: 'Loreal Academy'
                                },
                                {
                                    matcher: /urban\s*bistro,\s*isho|isho/i,
                                    src: 'logos-projects/logo-isho.png',
                                    alt: 'Urban Bistro, ISHO'
                                },
                                {
                                    matcher: /aj\s*brand/i,
                                    src: 'logos-projects/aj-brand-logo.jpg',
                                    alt: 'AJ Brand'
                                },
                                {
                                    matcher: /mindspace/i,
                                    src: 'logos-projects/mindspace_logo.png',
                                    alt: 'Mindspace'
                                },
                                {
                                    matcher: /grupo\s*bimbo|bimbo/i,
                                    src: 'logos-projects/grupo_bimbo-logo.png',
                                    alt: 'Grupo Bimbo'
                                },
                                {
                                    matcher: /diversinst/i,
                                    src: 'logos-projects/logo-diversinst.png',
                                    alt: 'Diversinst'
                                },
                                {
                                    matcher: /ams\s*accelerate\s*it|\bams\b/i,
                                    src: 'logos-projects/ams-logo.png',
                                    alt: 'AMS Accelerate IT'
                                },
                                {
                                    matcher: /unilever/i,
                                    src: 'logos-projects/unilever-logo.png',
                                    alt: 'Unilever'
                                },
                                {
                                    matcher: /naos/i,
                                    src: 'logos-projects/naos-logo.png',
                                    alt: 'Naos Skin Care Romania'
                                },
                                {
                                    matcher: /rphi|rbi\s*group/i,
                                    src: 'logos-projects/rphi-logo.png',
                                    alt: 'RPHI member of RBI Group'
                                },
                                {
                                    matcher: /vectra\s*international|vectra/i,
                                    src: 'logos-projects/vectra-international-logo.jpg',
                                    alt: 'Vectra International'
                                },
                                {
                                    matcher: /the\s*business\s*factory/i,
                                    src: 'logos-projects/the-business-factory-logo.png',
                                    alt: 'The Business Factory'
                                },
                                {
                                    matcher: /h\s*private\s*arghezi|arghezi|h\s*private/i,
                                    src: 'logos-projects/logo_targhezi_hprivate.png',
                                    alt: 'H Private Arghezi'
                                },
                                {
                                    matcher: /anvelope\.?\s*ro|anvelope/i,
                                    src: 'logos-projects/anvelope-ro-logo.png',
                                    alt: 'Anvelope.ro'
                                },
                                {
                                    matcher: /skytower/i,
                                    src: 'logos-projects/logo-skytower.png',
                                    alt: 'Skytower'
                                },
                                {
                                    matcher: /qualitest/i,
                                    src: 'logos-projects/qualitest.jpg',
                                    alt: 'QualiTest DC RO'
                                },
                                {
                                    matcher: /united\s*media\s*services/i,
                                    src: 'logos-projects/united-media-services-logo.png',
                                    alt: 'United Media Services'
                                },
                                {
                                    matcher: /axpo/i,
                                    src: 'logos-projects/axpo-logo.png',
                                    alt: 'AXPO ROMANIA'
                                },
                                {
                                    matcher: /evolution/i,
                                    src: 'logos-projects/evolution-logo.png',
                                    alt: 'Evolution'
                                },
                                {
                                    matcher: /laguna\s*technology|laguna/i,
                                    src: 'logos-projects/logo_laguna_technology.png',
                                    alt: 'Laguna Technology'
                                },
                                {
                                    matcher: /novo\s*nordisk/i,
                                    src: 'logos-projects/novonordisk_logo.png',
                                    alt: 'Novo Nordisk Farma'
                                },
                                {
                                    matcher: /thought\s*works|thoughtworks/i,
                                    src: 'logos-projects/thoughtworks-logo.png',
                                    alt: 'ThoughtWorks Romania'
                                },
                                {
                                    matcher: /euroins/i,
                                    src: 'logos-projects/logo-euroins.png',
                                    alt: 'Euroins'
                                },
                                {
                                    matcher: /nestle/i,
                                    src: 'logos-projects/nestle-logo.png',
                                    alt: 'Nestle Romania'
                                },
                                {
                                    matcher: /jgv|asociatii/i,
                                    src: 'logos-projects/jgv-asociatii-logo.jpg',
                                    alt: 'SCPA JGV & Asociatii'
                                },
                                {
                                    matcher: /\bvgp\b/i,
                                    src: 'logos-projects/vgp_logo-building-tomorrow-today.jpg',
                                    alt: 'VGP Building'
                                },
                                {
                                    matcher: /edenred\s*benefit|benefit\s*by\s*edenred|benefit/i,
                                    src: 'logos-projects/logo-benefit-edenred.jpg',
                                    alt: 'Benefit by Edenred'
                                },
                                {
                                    matcher: /edenred/i,
                                    src: 'logos-projects/edenred-logo.png',
                                    alt: 'Edenred'
                                },
                                {
                                    matcher: /adswizz/i,
                                    src: 'logos-projects/adswizz-logo.png',
                                    alt: 'Adswizz Ro'
                                },
                                {
                                    matcher: /konecta/i,
                                    src: 'logos-projects/konecta-logo.jpg',
                                    alt: 'Konecta Global'
                                },
                                {
                                    matcher: /workspace\s*studio|millerknoll\s*certified\s*dealer/i,
                                    src: 'logos-projects/logo-workspace-studio-mk_certifieddealer.jpg',
                                    alt: 'Workspace Studio MillerKnoll Certified Dealer'
                                },
                                {
                                    matcher: /engie/i,
                                    src: 'logos-projects/engie_romania-logo.png',
                                    alt: 'ENGIE Romania'
                                },
                                {
                                    matcher: /xperi/i,
                                    src: 'logos-projects/xperi-logo.jpg',
                                    alt: 'Xperi'
                                },
                                {
                                    matcher: /exiger/i,
                                    src: 'logos-projects/exiger-logo.jpg',
                                    alt: 'Exiger Diligence Tech'
                                },
                                {
                                    matcher: /esky/i,
                                    src: 'logos-projects/esky-logo.jpg',
                                    alt: 'eSky Travel Search'
                                },
                                {
                                    matcher: /coca[\s-]?cola/i,
                                    src: 'logos-projects/coca-cola-seeklogo.png',
                                    alt: 'Coca Cola Romania'
                                },
                                {
                                    matcher: /panasonic/i,
                                    src: 'logos-projects/panasonic-logo.jpg',
                                    alt: 'Panasonic'
                                },
                                {
                                    matcher: /signivis/i,
                                    src: 'logos-projects/signivis-logo.jpg',
                                    alt: 'Signivis'
                                },
                                {
                                    matcher: /axway/i,
                                    src: 'logos-projects/axway-logo.jpg',
                                    alt: 'AXWAY'
                                },
                                {
                                    matcher: /crisp/i,
                                    src: 'logos-projects/crisp-logo.jpg',
                                    alt: 'CRISP Payments'
                                },
                                {
                                    matcher: /west\s*gate/i,
                                    src: 'logos-projects/west_gate_logo.jpg',
                                    alt: 'West Gate'
                                },
                                {
                                    matcher: /metro\s*systems/i,
                                    src: 'logos-projects/metrosystems-logo.jpg',
                                    alt: 'METRO SYSTEMS'
                                },
                                {
                                    matcher: /timken/i,
                                    src: 'logos-projects/timken-logo.png',
                                    alt: 'TIMKEN'
                                },
                                {
                                    matcher: /gmv/i,
                                    src: 'logos-projects/gmv-logo.png',
                                    alt: 'GMV'
                                },
                                {
                                    matcher: /playtika/i,
                                    src: 'logos-projects/playtika-logo.jpg',
                                    alt: 'Playtika'
                                },
                                {
                                    matcher: /w\.?\s*a\.?\s*g\.?|eurowag/i,
                                    src: 'logos-projects/eurowag-logo.png',
                                    alt: 'Eurowag'
                                },
                                {
                                    matcher: /bayer/i,
                                    src: 'logos-projects/bayer-logo.jpg',
                                    alt: 'Bayer'
                                },
                                {
                                    matcher: /impact\s*hub/i,
                                    src: 'logos-projects/impact_hub-logo.png',
                                    alt: 'Impact Hub'
                                },
                                {
                                    matcher: /tmf\s*group/i,
                                    src: 'logos-projects/logo-tmf.jpg',
                                    alt: 'TMF Group'
                                },
                                {
                                    matcher: /profi/i,
                                    src: 'logos-projects/profi-logo.jpg',
                                    alt: 'Profi'
                                },
                                {
                                    matcher: /alfasigma/i,
                                    src: 'logos-projects/logo-alfasigma.png',
                                    alt: 'Alfasigma Romania'
                                },
                                {
                                    matcher: /swixx/i,
                                    src: 'logos-projects/swixx-biopharma.jpg',
                                    alt: 'Swixx BioPharma'
                                },
                                {
                                    matcher: /l['’]?\s*oreal\s*romania|loreal\s*romania/i,
                                    src: 'logos-projects/logo-loreal-romania.png',
                                    alt: "L'Oreal Romania"
                                },
                                {
                                    matcher: /tiriac\s*collection/i,
                                    src: 'logos-projects/logo-tiriac-collection.jpg',
                                    alt: 'Tiriac Collection'
                                },
                                {
                                    matcher: /omv\s*petrom|petrom\s*city/i,
                                    src: 'logos-projects/petrom-seeklogo.svg',
                                    alt: 'OMV Petrom'
                                },
                                {
                                    matcher: /uber/i,
                                    src: 'logos-projects/uber-seeklogo.svg',
                                    alt: 'UBER Romania'
                                }
                            ];

                            customProjects.forEach(project => {
                                const hoverLogo = projectHoverLogos.find(({ matcher }) => matcher.test(project.title || ''));
                                if (!hoverLogo || !/\.(png|svg)$/i.test(hoverLogo.src)) {
                                    return;
                                }

                                const card = document.createElement('article');
                                card.className = 'project-slider-card project-slider-card-logo';
                                card.setAttribute('data-project-link', project.sourceLink || `cms/entry.html?type=project&slug=${encodeURIComponent(project.slug)}`);
                                card.innerHTML = `
                                    <img data-defer-src="${project.coverImage || 'projects-pictures/skytower-hero.jpg'}" alt="${project.title}" loading="lazy" decoding="async">
                                    <div class="project-slider-overlay">
                                        <h3>${project.title}</h3>
                                        <img data-defer-src="${hoverLogo.src}" alt="${hoverLogo.alt}" class="project-slider-hover-logo${/adobe/i.test(project.title || '') ? ' project-slider-hover-logo-adobe' : ''}${/uber/i.test(project.title || '') ? ' project-slider-hover-logo-uber' : ''}${/tiriac\\s*collection/i.test(project.title || '') ? ' project-slider-hover-logo-tiriac' : ''}" loading="lazy" decoding="async">
                                        <a href="${project.sourceLink || `cms/entry.html?type=project&slug=${encodeURIComponent(project.slug)}`}" class="pivot-link">View Project</a>
                                    </div>
                                `;
                                sliderTrack.appendChild(card);
                            });
                        }
                    }
                    */
