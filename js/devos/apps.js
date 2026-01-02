// ===========================
// Application Content
// ===========================

const apps = {
    about: {
        title: 'About Me',
        icon: '👨‍💻',
        content: `
            <div style="max-width: 700px;">
                <h1 style="font-size: 2.5rem; margin-bottom: 1rem; color: #1a1a1a; font-weight: 700;">
                    Ryan James Indangan
                </h1>
                <p style="font-size: 1.2rem; color: #2171d6; margin-bottom: 2rem; font-weight: 500;">
                    Full-Stack Web Developer & Certified CTO
                </p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                    <div style="padding: 1rem; background: #e8f4f8; border: 1px solid #d0e8f0; border-radius: 6px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: #2171d6;"><span id="yearsExp">8</span>+</div>
                        <div style="font-size: 0.9rem; color: #1a1a1a;">Years Experience</div>
                    </div>
                    <div style="padding: 1rem; background: #e8f4f8; border: 1px solid #d0e8f0; border-radius: 6px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: #2171d6;">50+</div>
                        <div style="font-size: 0.9rem; color: #1a1a1a;">Projects Delivered</div>
                    </div>
                    <div style="padding: 1rem; background: #fff8e1; border: 1px solid #ffe082; border-radius: 6px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: #f57c00;">12</div>
                        <div style="font-size: 0.9rem; color: #1a1a1a;">Team Members Led</div>
                    </div>
                </div>

                <p style="line-height: 1.8; margin-bottom: 1rem; color: #1a1a1a;">
                    I'm a versatile <strong style="color: #2171d6;">Full-Stack Web Developer</strong> with deep expertise in the LAMP stack, 
                    PHP frameworks (CodeIgniter, Laravel), and modern frontend libraries including React, Vue, and Angular.
                </p>
                
                <p style="line-height: 1.8; margin-bottom: 1rem; color: #1a1a1a;">
                    With over <strong style="color: #2171d6;"><span id="yearsExp2">8</span> years</strong> of experience, I've led senior development teams, built scalable applications, 
                    and leveraged AWS for cloud infrastructure. My approach combines strong technical hands-on expertise 
                    with strategic thinking to deliver results in Agile environments.
                </p>
                
                <p style="line-height: 1.8; margin-bottom: 1rem; color: #1a1a1a;">
                    I specialize in <strong style="color: #2171d6;">AI-integrated development</strong>, applying cutting-edge AI tools 
                    to improve efficiency, enhance quality assurance, and scale solutions while maintaining code 
                    quality and best practices.
                </p>

                <div style="margin-top: 2rem; padding: 1.5rem; background: #e8f4f8; border-left: 3px solid #2171d6; border-radius: 6px;">
                    <h3 style="color: #2171d6; margin-bottom: 1rem; font-weight: 600;">🏆 Recent Achievement</h3>
                    <p style="color: #1a1a1a; line-height: 1.6;">
                        Led the complete redesign of database architecture for GlobalX Digital Corporation, 
                        directed 12 developers across 3 teams, and revived a stalled project by delivering a fully 
                        enhanced Version 2 within 2 months.
                    </p>
                </div>
            </div>
        `
    },

    skills: {
        title: 'Technical Skills',
        icon: '🛠️',
        content: `
            <div style="max-width: 900px;">
                <h2 style="font-size: 2rem; margin-bottom: 2rem; color: #1a1a1a; font-weight: 700;">Tech Stack & Expertise</h2>
                
                <div style="display: grid; gap: 1.5rem;">
                    ${createSkillCategory('🤖 AI & Machine Learning', ['Document Intelligence', 'OCR (Tesseract, OpenCV)', 'PDF Processing (PyMuPDF, pdfplumber)', 'Computer Vision', 'Watermark Removal (RandomForest/scikit-learn)', 'LLM Integration (Ollama, vLLM, OpenAI APIs)', 'Feature Engineering', 'End-to-end AI Pipeline Design'])}
                    
                    ${createSkillCategory('💻 Frontend', ['React', 'Next.js', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'jQuery'])}
                    
                    ${createSkillCategory('⚙️ Backend', ['PHP', 'CodeIgniter', 'Laravel', 'Node.js', 'Express', 'Python', 'FastAPI', 'Django', 'Java', 'Spring Boot', 'Socket.io', 'RESTful APIs', 'GraphQL', 'WebSockets'])}
                    
                    ${createSkillCategory('🗄️ Database & Data Management', ['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase', 'SQLite', 'Data Normalization', 'Structured Extraction', 'Excel Reporting (openpyxl)'])}
                    
                    ${createSkillCategory('🔐 Cybersecurity', ['Penetration Testing', 'Vulnerability Assessment', 'Network Security', 'Database Security', 'WiFi Security', 'Android Security', 'XSS Prevention', 'Password Security', 'Network Spying', 'Security Best Practices'])}
                    
                    ${createSkillCategory('☁️ Cloud, DevOps & Infrastructure', ['AWS (EC2, RDS, Lambda, EventBridge, S3, CloudFront)', 'DigitalOcean', 'Docker', 'Docker Compose', 'Kubernetes', 'CI/CD Pipelines (GitHub Actions, Jenkins, Bitbucket Pipelines)'])}
                    
                    ${createSkillCategory('🛠️ Tools, Testing & Project Management', ['Git', 'GitHub / GitLab', 'Postman', 'Insomnia', 'Pytest', 'Jest', 'Mocha', 'Selenium', 'Cypress', 'Jira', 'Confluence', 'Asana', 'Trello', 'Slack', 'MS Teams', 'ClickUp', 'Monday.com'])}
                </div>
            </div>
        `
    },

    experience: {
        title: 'Work Experience',
        icon: '💼',
        content: `
            <div style="max-width: 800px;">
                <h2 style="font-size: 2rem; margin-bottom: 2rem; color: #1a1a1a; font-weight: 700;">Professional Journey</h2>
                
                ${createExperienceCard(
                    'AI Developer / Machine Learning Engineer',
                    'Alliance Global Solutions BPO Intl Corp. (Alternative Funding Group)',
                    'Nov 2025 – Present',
                    'Remote',
                    [
                        'Built end-to-end bank statement extraction and validation pipelines using native PDF text and OCR fallback',
                        'Implemented advanced OCR preprocessing (OpenCV/PIL) with multi-angle scanning and quality scoring',
                        'Designed an ML-based watermark removal subsystem using RandomForest classification',
                        'Created a validation-first extraction framework for financial data integrity',
                        'Integrated local LLM workflows (Ollama) for structured underwriting summaries',
                        'Built a secure Node gateway with JWT/RSA management and FastAPI SSE for real-time processing visibility'
                    ],
                    ['Python', 'FastAPI', 'OpenCV', 'LLM', 'Ollama', 'PyMuPDF', 'pdfplumber', 'Tesseract OCR', 'RandomForest', 'scikit-learn', 'Node.js', 'JWT', 'RSA', 'Server-Sent Events']
                )}
                
                ${createExperienceCard(
                    'Support Engineer',
                    'Bada LLC',
                    'Apr 24, 2025 - Oct 24, 2025',
                    'Remote',
                    [
                        'Developed and scripted solutions for data management and client image migrations',
                        'Created custom templates for InDesign, Word, and PowerPoint',
                        'Integrated systems using REST APIs and JavaScript',
                        'Troubleshot issues across server-side, end-user, and code base environments',
                        'Managed client support tickets from start to resolution',
                        'Provided clear, concise technical guidance to clients'
                    ],
                    ['JavaScript (ES5)', 'ZenDesk', 'InDesign', 'JSON', 'REST APIs', 'Windows Server', 'Linux Server']
                )}
                
                ${createExperienceCard(
                    'Consultant',
                    'GlobalX Digital Corporation',
                    'Jan 2025 - Apr 2025',
                    'Hybrid / Unit  901,  9th  Floor  I-Land  Bay  Plaza  D-Macapagal  Blvd  Pasay  City, National  Capital  Region  (NCR),  1503',
                    [
                        'Led the redesign of database architecture, creating scalable, high-performing systems that improved data integrity and business alignment',
                        'Developed and secured API endpoints, strengthening system communication and overall reliability',
                        'Directed 12 developers across 3 teams, providing technical guidance, architectural leadership, and workflow documentation',
                        'Revived a stalled project by assuming ownership, delivering a fully enhanced Version 2 within 2 months after 9 months of failed prior leadership',
                        'Acted as Technical Lead, aligning goals among cross-functional teams and stakeholders to ensure delivery within strict timelines'
                    ],
                    ['PHP', 'MySQL', 'AWS', 'API Development', 'Laravel']
                )}
                
                 
                ${createExperienceCard(
                    'Chief Technology Officer / Co-Founder',
                    'Intermobile Solutions Corporation',
                    'Sep 2023 - Jan 2024',
                    'Hybrid / Rm. 312 National Life Insurance Building, Ayala Ave, Legazpi Village, Makati City, Metro Manila',
                    [
                        'Spearheaded product design and technical direction for early-stage startup projects under Intermobile Solutions Corporation.',
                        'Developed proof-of-concept applications and internal systems to demonstrate product viability to investors.',
                        'Established foundational infrastructure, workflows, and code standards for rapid prototyping and small-scale deployment.',
                        'Collaborated with cross-functional teams to define project goals, timelines, and feature priorities.',
                        'Provided technical mentoring and handled initial backend and API integrations for pilot products.',
                    ],
                    ['Node.js', 'PHP', 'MySQL', 'AWS', 'Git', 'REST API']
                )}
                
 
                ${createExperienceCard(
                    'IT Director / Full-Stack Software Engineer',
                    'Microbitz Solutions Inc.',
                    'Jul 2023 - Jan 2024',
                    'Hybrid / Rm. 312 National Life Insurance Building, Ayala Ave, Legazpi Village, Makati City, Metro Manila',
                    [
                        'Led the full-cycle development of an online lottery platform, from architecture planning to deployment and maintenance.',
                        'Designed and managed the system infrastructure, ensuring high availability, scalability, and data security.',
                        'Developed and optimized backend APIs for secure and efficient transaction processing.',
                        'Built and maintained the database schema, implementing reliable data integrity and backup strategies.',
                        'Oversaw technical direction, guided developers, and enforced coding standards and best practices.',
                        'Implemented CI/CD processes and server monitoring to maintain uptime and streamline updates.',
                        'Collaborated with stakeholders to align business goals with technical implementation.',
                        'Conducted code reviews, security audits, and performance tuning to ensure system reliability.',
                    ],
                    ['PHP', 'MySQL', 'AWS', 'API Development', 'CodeIgniter 3', 'CI/CD', 'System Architecture', 'Code Review', 'Security Audit', 'Performance Tuning']
                )}

                ${createExperienceCard(
                    'Back End Developer / Project Lead',
                    'Net Global Solutions Inc.',
                    'Apr 2023 - Nov 2024',
                    'Hybrid / 59 W Capitol Dr, Pasig, 1603 Metro Manila',
                    [
                        'Served as Project Lead & Lead Programmer for PAGCOR compliance system (Back Office Access), ensuring regulatory adherence',
                        'Managed PEZA Digital Marketplace (Builder.ai) as Project Manager, enabling streamlined data management for the Philippine Economic Zone Authority',
                        'Built a custom PHP framework to enhance API development and system performance',
                        'Developed a Sports Data Management System, Automated Billing System, and multiple enterprise solutions as Lead Programmer'
                    ],
                    ['PHP', 'MySQL', 'Custom Framework', 'REST APIs', 'Project Management']
                )}
                
                ${createExperienceCard(
                    'Systems Developer II',
                    'ADEC Innovations',
                    'Mar 2022 - Apr 2023',
                    'Remote',
                    [
                        'Developed the UN-Habitat SDG Cities platform as part of a United Nations initiative',
                        'Built the Disaster Risk Reduction Management Information System for the Department of Education (DepEd)',
                        'Created a database automated-remapping system ("Bucket Service") to optimize DepEd\'s database management'
                    ],
                    ['Laravel', 'Vue.js', 'PostgreSQL', 'AWS', 'Database Management']
                )}

                ${createExperienceCard(
                    'Full-Stack Developer (Top Rated)',
                    'Upwork',
                    'Apr 2021 - October 2025',
                    'Remote',
                    [
                        'Achieved Top Rated status with 100% job success score',
                        'Delivered 50+ successful projects for international clients',
                        'Specialized in LAMP stack and modern JavaScript frameworks',
                        'Maintained long-term partnerships with multiple clients'
                    ],
                    ['PHP', 'Laravel', 'React', 'Node.js', 'AWS']
                )}

                ${createExperienceCard(
                    'Full-Stack Web Developer',
                    'Freelance',
                    '2019 - Apr 2023',
                    'Remote',
                    [
                        'Designed and developed a Sports Data Management System for a private company',
                        'Built an Online Human Resource Information System for STI Muñoz EDSA',
                        'Delivered custom websites and applications for small businesses and organizations'
                    ],
                    ['PHP', 'Laravel', 'MySQL', 'JavaScript', 'React']
                )}

                ${createExperienceCard(
                    'Senior Web Developer',
                    'iAm Tech Solutions Inc.',
                    'Mar 2018 - Apr 2021',
                    'Remote',
                    [
                        'Directed large-scale web and mobile projects including Lotto Play Mobile App, Wholesale E-Commerce, and whitelabeled Learning Management Systems',
                        'Built enterprise systems: Online Inventory & Asset Tracking, Package Tracking, Broker Accreditation (Ayala Land), and Log Monitoring with Digital Signature',
                        'Delivered custom after-sales service and tracking solutions for corporate clients (Esquire Tech, Chubb Limited, Marmo Pizzara Trading)',
                        'Provided technical leadership as Lead Programmer, ensuring quality delivery and scalable architecture across projects'
                    ],
                    ['CodeIgniter', 'React', 'MySQL', 'AWS', 'Mobile Development']
                )}
            </div>
        `
    },

    projects: {
        title: 'Featured Projects',
        icon: '🚀',
        content: `
            <div style="max-width: 1200px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                    <h2 style="font-size: 2rem; color: #1a1a1a; font-weight: 700; margin: 0;">Interactive Project Showcase</h2>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <button class="project-filter-btn active" data-filter="all" style="padding: 0.5rem 1rem; background: #2171d6; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.85rem;">All</button>
                        <button class="project-filter-btn" data-filter="react" style="padding: 0.5rem 1rem; background: #f0f0f0; color: #1a1a1a; border: 1px solid #e0e0e0; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.85rem;">React</button>
                        <button class="project-filter-btn" data-filter="laravel" style="padding: 0.5rem 1rem; background: #f0f0f0; color: #1a1a1a; border: 1px solid #e0e0e0; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.85rem;">Laravel</button>
                        <button class="project-filter-btn" data-filter="node" style="padding: 0.5rem 1rem; background: #f0f0f0; color: #1a1a1a; border: 1px solid #e0e0e0; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.85rem;">Node.js</button>
                        <button class="project-filter-btn" data-filter="ai" style="padding: 0.5rem 1rem; background: #f0f0f0; color: #1a1a1a; border: 1px solid #e0e0e0; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.85rem;">AI/ML</button>
                    </div>
                </div>
                
                <div id="projectsContainer" style="display: grid; gap: 2rem;">
                    ${createEnhancedProjectCard(
                        '💳 Crypto Checkout Simulator',
                        'Full-stack cryptocurrency payment processing simulation with real-time exchange rates and transaction tracking. Features secure wallet integration, multi-currency support, and live transaction monitoring.',
                        ['React', 'Node.js', 'Express', 'MongoDB', 'WebSocket'],
                        'https://github.com/ryanjamesindangan/crypto-checkout-simulator',
                        'https://ryanjamesindangan.github.io/crypto-checkout-simulator',
                        null,
                        'react'
                    )}
                    
                    ${createEnhancedProjectCard(
                        '📦 Supplier Order Management',
                        'Enterprise-grade order management system with inventory tracking, automated workflows, and comprehensive reporting. Built for scalability with real-time updates and multi-user collaboration.',
                        ['Laravel', 'Vue.js', 'MySQL', 'Docker', 'AWS'],
                        'https://github.com/ryanjamesindangan/supplier-order-management-rjfi',
                        null,
                        null,
                        'laravel'
                    )}
                    
                    ${createEnhancedProjectCard(
                        '🏢 GlobalX Digital Platform',
                        'Complete platform redesign with enhanced database architecture, serving 10,000+ users with real-time features. Includes advanced analytics, user management, and automated reporting systems.',
                        ['Laravel', 'React', 'PostgreSQL', 'Redis', 'AWS'],
                        null,
                        null,
                        null,
                        'laravel'
                    )}
                    
                    ${createEnhancedProjectCard(
                        '🤖 N8N Automation Hub',
                        'Custom N8N workflows automating CI/CD processes, testing, and deployment across multiple environments. Includes custom nodes, error handling, and monitoring dashboards.',
                        ['N8N', 'Docker', 'GitHub Actions', 'AWS Lambda', 'Node.js'],
                        null,
                        null,
                        null,
                        'node'
                    )}
                    
                    ${createEnhancedProjectCard(
                        '📄 Document Intelligence Pipeline',
                        'End-to-end bank statement extraction with native PDF text and OCR fallback. Features ML-based watermark removal, validation framework, and LLM integration for structured summaries.',
                        ['Python', 'FastAPI', 'OpenCV', 'Tesseract', 'Ollama', 'RandomForest'],
                        null,
                        null,
                        null,
                        'ai'
                    )}
                    
                    ${createEnhancedProjectCard(
                        '💧 Watermark Removal System',
                        'ML-based watermark detection and removal using RandomForest classification. Automatically routes documents to appropriate removal strategies with quality scoring and validation.',
                        ['Python', 'scikit-learn', 'OpenCV', 'RandomForest', 'PIL'],
                        null,
                        null,
                        null,
                        'ai'
                    )}
                </div>
            </div>
        `
    },

    certifications: {
        title: 'Certifications',
        icon: '🎓',
        content: `
            <div style="max-width: 900px;">
                <h2 style="font-size: 2rem; margin-bottom: 2rem; color: #1a1a1a; font-weight: 700;">Professional Credentials</h2>
                
                <div style="display: grid; gap: 1.5rem;">
                    ${createCertCard(
                        '👨‍💼 Certified Chief Technology Officer',
                        'IMTF',
                        'Issued Jul 2023',
                        'Comprehensive CTO certification covering technology leadership, strategic planning, team management, and enterprise architecture.',
                        'assets/certificates/cto-certificate.pdf'
                    )}
                    
                    <div style="padding: 1.5rem; background: #fafafa; border: 1px solid #e0e0e0; border-left: 3px solid #2171d6; border-radius: 8px;">
                        <h3 style="color: #1a1a1a; margin-bottom: 0.5rem; font-weight: 700;">🔐 Hacker-X Ethical Hacking Course</h3>
                        <p style="color: #666; margin-bottom: 1rem; font-size: 0.9rem;">Hacker-X • Started Sep 2024 • Completed Nov 2025</p>
                        <p style="color: #1a1a1a; line-height: 1.6; margin-bottom: 1.5rem;">
                            Comprehensive cybersecurity training covering penetration testing, vulnerability assessment, network security, and ethical hacking practices. Completed the full 21-module course series.
                        </p>
                        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
                            <button class="view-cert-btn" data-cert="assets/certificates/Hacker-X/hacker-x-final-certificate.jpg" data-title="Hacker-X Final Certificate" data-type="image"
                                    style="padding: 0.75rem 1.5rem; background: #2171d6; color: #fff; border: 1px solid #1a5fb8; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s;">
                                👁️ View Certificate
                            </button>
                            <a href="assets/certificates/Hacker-X/hacker-x-final-certificate.jpg" download 
                               style="padding: 0.75rem 1.5rem; background: #4caf50; color: #fff; border: 1px solid #45a049; border-radius: 6px; text-decoration: none; font-weight: 600;">
                                📥 Download
                            </a>
                        </div>
                        
                        <h4 style="color: #1a1a1a; margin-top: 2rem; margin-bottom: 1rem; font-size: 1.1rem; font-weight: 700;">Course Modules (21 Modules)</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem;">
                            ${createCertModuleBadge('1. Know the OS', 'assets/certificates/Hacker-X/1-know-the-os.jpg')}
                            ${createCertModuleBadge('2. Hack the Mac', 'assets/certificates/Hacker-X/2-hack-the-mac.jpg')}
                            ${createCertModuleBadge('3. Gathering Information', 'assets/certificates/Hacker-X/3-gathering-information.jpg')}
                            ${createCertModuleBadge('4. Leveraging AI for Hacking', 'assets/certificates/Hacker-X/4-leveraging-ai-for-hacking.jpg')}
                            ${createCertModuleBadge('5. Prompt Guide for Hacking', 'assets/certificates/Hacker-X/5-prompt-guide-for-hacking.jpg')}
                            ${createCertModuleBadge('6. Surfing Anonymously', 'assets/certificates/Hacker-X/6-surfing-anonymously.jpg')}
                            ${createCertModuleBadge('7. Hiding Messages', 'assets/certificates/Hacker-X/7-hiding-messages.jpg')}
                            ${createCertModuleBadge('8. Social Media Hacking', 'assets/certificates/Hacker-X/8-social-media-hacking.jpg')}
                            ${createCertModuleBadge('9. Credit/Debit Card Frauds', 'assets/certificates/Hacker-X/9-credit-card-and-debit-card-frauds.jpg')}
                            ${createCertModuleBadge('10. Keyboard Spying', 'assets/certificates/Hacker-X/10-keyboard-spying.jpg')}
                            ${createCertModuleBadge('11. WiFi Hacking - WEP', 'assets/certificates/Hacker-X/11-wifi-hacking-wep-cracking.jpg')}
                            ${createCertModuleBadge('12. WiFi Hacking - WPA/WPA2', 'assets/certificates/Hacker-X/12-wifi-hacking-wpa-wpa2-cracking.jpg')}
                            ${createCertModuleBadge('13. Network Spying', 'assets/certificates/Hacker-X/13-network-spying.jpg')}
                            ${createCertModuleBadge('14. Database Hacking', 'assets/certificates/Hacker-X/14-database-hacking.jpg')}
                            ${createCertModuleBadge('15. Android Hacking', 'assets/certificates/Hacker-X/15-android-hacking.jpg')}
                            ${createCertModuleBadge('16. Bringing Down a Website', 'assets/certificates/Hacker-X/16-bringing-down-a-website.jpg')}
                            ${createCertModuleBadge('17. Cross-Site Scripting', 'assets/certificates/Hacker-X/17-cross-site-scripting.jpg')}
                            ${createCertModuleBadge('18. Make Your Data Safe', 'assets/certificates/Hacker-X/18-make-your-data-safe.jpg')}
                            ${createCertModuleBadge('19. Hacking Passwords', 'assets/certificates/Hacker-X/19-hacking-passwords.jpg')}
                            ${createCertModuleBadge('20. WordPress Scanning', 'assets/certificates/Hacker-X/20-wordpress-scanning.jpg')}
                            ${createCertModuleBadge('21. Vulnerability Scanning', 'assets/certificates/Hacker-X/21-vulnerability-scanning-and-reporting.jpg')}
                        </div>
                    </div>
                </div>
            </div>
        `
    },

    contact: {
        title: 'Get in Touch',
        icon: '📧',
        content: `
            <div style="max-width: 700px;">
                <h2 style="font-size: 2rem; margin-bottom: 1rem; color: var(--text-primary); font-weight: 700;">Let's Connect</h2>
                <p style="color: var(--text-secondary); margin-bottom: 2rem; font-size: 1.1rem;">
                    Looking for a skilled developer? Let's discuss your project!
                </p>
                
                <!-- Contact Form -->
                <div style="margin-bottom: 3rem; padding: 2rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 8px; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">
                    <h3 style="color: var(--text-primary); margin-bottom: 1.5rem; font-weight: 600; font-size: 1.3rem;">📝 Send a Message</h3>
                    <form id="contactForm" style="display: grid; gap: 1.5rem;">
                        <div>
                            <label for="contactName" style="display: block; margin-bottom: 0.5rem; color: var(--text-primary); font-weight: 500;">Name *</label>
                            <input type="text" id="contactName" name="name" required 
                                style="width: 100%; padding: 0.75rem; background: var(--bg-tertiary); border: 1px solid var(--glass-border); border-radius: 6px; color: var(--text-primary); font-size: 1rem; box-sizing: border-box;"
                                placeholder="Your name">
                        </div>
                        <div>
                            <label for="contactEmail" style="display: block; margin-bottom: 0.5rem; color: var(--text-primary); font-weight: 500;">Email *</label>
                            <input type="email" id="contactEmail" name="email" required 
                                style="width: 100%; padding: 0.75rem; background: var(--bg-tertiary); border: 1px solid var(--glass-border); border-radius: 6px; color: var(--text-primary); font-size: 1rem; box-sizing: border-box;"
                                placeholder="your.email@example.com">
                        </div>
                        <div>
                            <label for="contactSubject" style="display: block; margin-bottom: 0.5rem; color: var(--text-primary); font-weight: 500;">Subject *</label>
                            <input type="text" id="contactSubject" name="subject" required 
                                style="width: 100%; padding: 0.75rem; background: var(--bg-tertiary); border: 1px solid var(--glass-border); border-radius: 6px; color: var(--text-primary); font-size: 1rem; box-sizing: border-box;"
                                placeholder="What's this about?">
                        </div>
                        <div>
                            <label for="contactMessage" style="display: block; margin-bottom: 0.5rem; color: var(--text-primary); font-weight: 500;">Message *</label>
                            <textarea id="contactMessage" name="message" required rows="5"
                                style="width: 100%; padding: 0.75rem; background: var(--bg-tertiary); border: 1px solid var(--glass-border); border-radius: 6px; color: var(--text-primary); font-size: 1rem; box-sizing: border-box; resize: vertical; font-family: inherit;"
                                placeholder="Tell me about your project or inquiry..."></textarea>
                        </div>
                        <div id="contactFormStatus" style="display: none; padding: 1rem; border-radius: 6px; margin-top: 0.5rem;"></div>
                        <button type="submit" 
                            style="padding: 1rem 2rem; background: var(--windows-blue); color: white; border: none; border-radius: 6px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease;"
                            onmouseover="this.style.background='var(--windows-hover)'" 
                            onmouseout="this.style.background='var(--windows-blue)'">
                            Send Message 📤
                        </button>
                    </form>
                </div>
                
                <!-- Contact Information -->
                <div style="margin-bottom: 2rem;">
                    <h3 style="color: var(--text-primary); margin-bottom: 1.5rem; font-weight: 600; font-size: 1.3rem;">📞 Contact Information</h3>
                    <div style="display: grid; gap: 1.5rem;">
                        ${createContactItem('📧', 'Email', 'ryanjamesfranciscoindangan@yahoo.com', 'mailto:ryanjamesfranciscoindangan@yahoo.com')}
                        ${createContactItem('📱', 'Phone', '+63 999 333 9030', 'tel:+639993339030')}
                        ${createContactItem('📍', 'Location', 'Caloocan City, Metro Manila, Philippines', null)}
                        ${createContactItem('💼', 'LinkedIn', 'ryan-james-indangan', 'https://www.linkedin.com/in/ryan-james-indangan-63b271164/')}
                        ${createContactItem('👨‍💻', 'GitHub', 'ryanjamesindangan', 'https://github.com/ryanjamesindangan')}
                        ${createContactItem('🎯', 'Upwork', 'Top Rated Developer', 'https://www.upwork.com/freelancers/~01d452f9125d3dcdf1')}
                        ${createContactItem('👥', 'Facebook', '@0RyanSimper0', 'https://www.facebook.com/0RyanSimper0/')}
                    </div>
                </div>

                <!-- Social Sharing -->
                <div style="margin-bottom: 2rem; padding: 1.5rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 8px; text-align: center; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">
                    <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-weight: 600;">🔗 Share My Portfolio</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 1rem; font-size: 0.9rem;">Know someone who might be interested? Share this portfolio!</p>
                    <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
                        <button class="social-share-btn" onclick="window.socialSharing?.shareToPlatform('linkedin')" style="margin: 0;">
                            <span class="share-icon">💼</span>
                            <span>LinkedIn</span>
                        </button>
                        <button class="social-share-btn" onclick="window.socialSharing?.shareToPlatform('twitter')" style="margin: 0;">
                            <span class="share-icon">🐦</span>
                            <span>Twitter</span>
                        </button>
                        <button class="social-share-btn share-primary" onclick="window.socialSharing?.nativeShare()" style="margin: 0;">
                            <span class="share-icon">🔗</span>
                            <span>Share</span>
                        </button>
                    </div>
                </div>

                <!-- Social Proof -->
                <div style="padding: 2rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 8px; text-align: center; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">
                    <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-weight: 700;">🌟 Social Proof</h3>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1.5rem;">
                        <div>
                            <div style="font-size: 1.5rem; color: var(--windows-blue); font-weight: bold;">Top Rated</div>
                            <div style="font-size: 0.85rem; color: var(--text-secondary);">on Upwork</div>
                        </div>
                        <div>
                            <div style="font-size: 1.5rem; color: var(--windows-blue); font-weight: bold;">758+</div>
                            <div style="font-size: 0.85rem; color: var(--text-secondary);">LinkedIn Connections</div>
                        </div>
                        <div>
                            <div style="font-size: 1.5rem; color: var(--accent); font-weight: bold;">Certified</div>
                            <div style="font-size: 0.85rem; color: var(--text-secondary);">CTO</div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },

    analytics: {
        title: 'Analytics Dashboard',
        icon: '📊',
        content: `
            <div style="max-width: 800px;">
                <h2 style="font-size: 2rem; margin-bottom: 1rem; color: var(--text-primary); font-weight: 700;">📊 Portfolio Analytics</h2>
                <p style="color: var(--text-secondary); margin-bottom: 2rem; font-size: 1rem;">
                    Privacy-friendly analytics dashboard. All data is stored locally in your browser.
                </p>
                
                <div id="analyticsDashboard" style="display: grid; gap: 1.5rem;">
                    <div style="padding: 1.5rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 8px; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">
                        <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-weight: 600;">Loading analytics...</h3>
                    </div>
                </div>
                
                <div style="margin-top: 2rem; padding: 1.5rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 8px; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">
                    <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-weight: 600;">🔒 Privacy Notice</h3>
                    <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">
                        All analytics data is stored locally in your browser using localStorage. No data is sent to external servers. 
                        You can reset your analytics data at any time using the button below.
                    </p>
                    <button onclick="if(window.portfolioAnalytics) { window.portfolioAnalytics.reset(); location.reload(); }" 
                        style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.5); border-radius: 6px; color: #ef4444; cursor: pointer; font-size: 0.9rem; transition: all 0.2s ease;"
                        onmouseover="this.style.background='rgba(239, 68, 68, 0.3)'" 
                        onmouseout="this.style.background='rgba(239, 68, 68, 0.2)'">
                        Reset Analytics Data
                    </button>
                </div>
            </div>
        `
    },

    terminal: {
        title: 'Terminal',
        icon: '⌨️',
        content: `
            <div style="font-family: 'JetBrains Mono', monospace; background: #000; padding: 1rem; border-radius: 8px; height: 100%; min-height: 400px;">
                <div style="color: #5eb3ff; margin-bottom: 1rem;">
                    DevOS Terminal v2.0.0<br>
                    Type 'help' for available commands
                </div>
                <div id="terminalOutput" style="color: #e2e8f0; margin-bottom: 1rem; max-height: 300px; overflow-y: auto;"></div>
                <div style="display: flex; align-items: center; color: #e2e8f0;">
                    <span style="color: #5eb3ff;">ryan@devos:~$</span>
                    <input type="text" id="terminalInput" 
                           style="flex: 1; margin-left: 0.5rem; background: transparent; border: none; color: #e2e8f0; outline: none; font-family: inherit;"
                           placeholder="Enter command..." />
                </div>
            </div>
        `
    },

    snake: {
        title: 'Snake Game',
        icon: '🐍',
        content: `
            <div style="width: 100%; height: 100%; display: flex; flex-direction: column; background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);">
                <div style="padding: 1.25rem; background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2)); border-bottom: 1px solid rgba(100, 255, 218, 0.2); backdrop-filter: blur(10px);">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                        <div>
                            <h3 style="color: #64ffda; margin: 0; font-size: 1.3rem; text-shadow: 0 0 10px rgba(100, 255, 218, 0.5);">🐍 Snake Game</h3>
                            <p style="color: #94a3b8; margin: 0.25rem 0 0 0; font-size: 0.85rem;">Arrow keys / WASD • Space to pause</p>
                        </div>
                        <div style="display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap;">
                            <div style="text-align: center; padding: 0.5rem 1rem; background: rgba(100, 255, 218, 0.1); border-radius: 8px; border: 1px solid rgba(100, 255, 218, 0.2);">
                                <div style="color: #94a3b8; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px;">Score</div>
                                <div id="snakeScore" style="color: #64ffda; font-size: 1.8rem; font-weight: bold; text-shadow: 0 0 10px rgba(100, 255, 218, 0.5);">0</div>
                            </div>
                            <div style="text-align: center; padding: 0.5rem 1rem; background: rgba(245, 158, 11, 0.1); border-radius: 8px; border: 1px solid rgba(245, 158, 11, 0.2);">
                                <div style="color: #94a3b8; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px;">High</div>
                                <div id="snakeHighScore" style="color: #fbbf24; font-size: 1.8rem; font-weight: bold; text-shadow: 0 0 10px rgba(245, 158, 11, 0.5);">0</div>
                            </div>
                            <div style="display: flex; gap: 0.5rem;">
                                <button id="snakeStartBtn" style="padding: 0.6rem 1.5rem; background: linear-gradient(135deg, #64ffda, #22d3ee); color: #000; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.9rem; box-shadow: 0 4px 15px rgba(100, 255, 218, 0.3); transition: transform 0.2s;">
                                    Start
                                </button>
                                <button id="snakePauseBtn" style="padding: 0.6rem 1.5rem; background: rgba(100, 255, 218, 0.1); color: #64ffda; border: 1px solid rgba(100, 255, 218, 0.3); border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.9rem; display: none;">
                                    Pause
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="flex: 1; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; padding: 1rem;">
                    <canvas id="snakeCanvas" style="border: 3px solid #64ffda; border-radius: 12px; background: #0a0a0a; box-shadow: 0 0 30px rgba(100, 255, 218, 0.4), inset 0 0 30px rgba(100, 255, 218, 0.1);"></canvas>
                    <div id="snakeGameOver" style="position: absolute; background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(26, 26, 26, 0.95)); padding: 3rem; border-radius: 16px; text-align: center; display: none; border: 2px solid #64ffda; box-shadow: 0 0 40px rgba(100, 255, 218, 0.5); backdrop-filter: blur(10px);">
                        <h3 style="color: #64ffda; margin: 0 0 1rem 0; font-size: 2rem; text-shadow: 0 0 20px rgba(100, 255, 218, 0.8);">Game Over!</h3>
                        <p style="color: #e2e8f0; margin: 0 0 1.5rem 0; font-size: 1.1rem;">Final Score: <span id="finalScore" style="color: #64ffda; font-weight: bold; font-size: 1.5rem;">0</span></p>
                        <button id="snakeRestartBtn" style="padding: 0.75rem 2rem; background: linear-gradient(135deg, #64ffda, #22d3ee); color: #000; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 1rem; box-shadow: 0 4px 15px rgba(100, 255, 218, 0.4);">
                            Play Again
                        </button>
                    </div>
                </div>
            </div>
        `
    },

    resume: {
        title: 'Resume / CV',
        icon: '📄',
        content: `
            <div style="max-width: 800px; text-align: center;">
                <h2 style="font-size: 2.5rem; margin-bottom: 0.75rem; color: #1a1a1a; font-weight: 700; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">Resume / CV</h2>
                <p style="color: #4a5568; margin-bottom: 2.5rem; font-size: 1.1rem; font-weight: 500;">
                    Download my complete resume in your preferred format
                </p>
                
                <div style="display: grid; gap: 1.25rem; margin-bottom: 2.5rem;">
                    <div style="display: flex; gap: 1.25rem; flex-wrap: wrap; justify-content: center;">
                        <button class="view-cert-btn" data-cert="assets/certificates/Ryan James Indangan Resume 2026.pdf" data-title="Resume - Ryan James Indangan" data-type="pdf"
                                    style="flex: 1; min-width: 220px; padding: 1.5rem 2rem; background: linear-gradient(135deg, #2171d6, #1e90ff); border: none; border-radius: 12px; color: #ffffff; cursor: pointer; font-size: 1.1rem; font-weight: 600; transition: all 0.3s; box-shadow: 0 4px 15px rgba(33, 113, 214, 0.3);"
                                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(33, 113, 214, 0.4)';"
                                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(33, 113, 214, 0.3)';">
                                👁️ Preview Resume
                            </button>
                            <a href="assets/certificates/Ryan James Indangan Resume 2026.pdf" download="Ryan-James-Indangan-Resume-2026.pdf"
                           style="flex: 1; min-width: 220px; padding: 1.5rem 2rem; background: linear-gradient(135deg, #ffffff, #f7fafc); border: 2px solid #2171d6; border-radius: 12px; color: #2171d6; cursor: pointer; font-size: 1.1rem; font-weight: 600; transition: all 0.3s; text-decoration: none; text-align: center; display: flex; align-items: center; justify-content: center; gap: 0.5rem; box-shadow: 0 2px 8px rgba(33, 113, 214, 0.2);"
                           onmouseover="this.style.transform='translateY(-2px)'; this.style.background='linear-gradient(135deg, #f7fafc, #edf2f7)'; this.style.boxShadow='0 4px 12px rgba(33, 113, 214, 0.3)';"
                           onmouseout="this.style.transform='translateY(0)'; this.style.background='linear-gradient(135deg, #ffffff, #f7fafc)'; this.style.boxShadow='0 2px 8px rgba(33, 113, 214, 0.2)';">
                            📥 Download PDF Resume
                        </a>
                    </div>
                    <button onclick="window.open('https://www.linkedin.com/in/ryan-james-indangan-63b271164/', '_blank')"
                            style="padding: 1.5rem 2rem; background: linear-gradient(135deg, #0077b5, #00a0dc); border: none; border-radius: 12px; color: #ffffff; cursor: pointer; font-size: 1.1rem; font-weight: 600; transition: all 0.3s; box-shadow: 0 4px 15px rgba(0, 119, 181, 0.3);"
                            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0, 119, 181, 0.4)';"
                            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0, 119, 181, 0.3)';">
                        💼 View LinkedIn Profile
                    </button>
                </div>

                <div style="padding: 2.5rem; background: linear-gradient(135deg, #f7fafc, #edf2f7); border: 2px solid #e2e8f0; border-radius: 16px; text-align: left; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
                    <h3 style="color: #1a1a1a; margin-bottom: 1.5rem; font-size: 1.5rem; font-weight: 700; border-bottom: 2px solid #2171d6; padding-bottom: 0.75rem;">Quick Stats</h3>
                    <div style="color: #2d3748; line-height: 2.5; font-size: 1.05rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0;">
                            <span style="font-size: 1.3rem;">📅</span>
                            <div><strong style="color: #1a1a1a; font-weight: 600;">Experience:</strong> <span style="color: #2171d6; font-weight: 600;" id="yearsExp3">8</span>+ years</div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0;">
                            <span style="font-size: 1.3rem;">🎓</span>
                            <div><strong style="color: #1a1a1a; font-weight: 600;">Education:</strong> <span style="color: #4a5568;">BS Computer Science</span></div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0;">
                            <span style="font-size: 1.3rem;">🏆</span>
                            <div><strong style="color: #1a1a1a; font-weight: 600;">Certification:</strong> <span style="color: #2171d6; font-weight: 600;">Certified CTO</span></div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0;">
                            <span style="font-size: 1.3rem;">💼</span>
                            <div><strong style="color: #1a1a1a; font-weight: 600;">Role:</strong> <span style="color: #4a5568;">Full-Stack Developer & CTO</span></div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0;">
                            <span style="font-size: 1.3rem;">🌍</span>
                            <div><strong style="color: #1a1a1a; font-weight: 600;">Location:</strong> <span style="color: #4a5568;">Metro Manila, Philippines</span></div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0;">
                            <span style="font-size: 1.3rem;">✉️</span>
                            <div><strong style="color: #1a1a1a; font-weight: 600;">Email:</strong> <span style="color: #2171d6; font-weight: 500;">ryanjamesfranciscoindangan@yahoo.com</span></div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },

    'crypto-demo': {
        title: 'Crypto Checkout Demo',
        icon: '🎬',
        content: `
            <div style="width: 100%; height: 100%; display: flex; flex-direction: column; background: #000;">
                <div style="padding: 1rem; background: linear-gradient(135deg, #2d1b69, #1e2442); border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                        <div style="font-size: 2rem;">🎬</div>
                        <div>
                            <h3 style="color: #5eb3ff; margin: 0; font-size: 1.2rem;">Crypto Checkout Simulator</h3>
                            <p style="color: #94a3b8; margin: 0; font-size: 0.9rem;">Full Project Demonstration</p>
                        </div>
                    </div>
                </div>
                <div style="flex: 1; position: relative; background: #000;">
                    <iframe 
                        src="https://www.youtube.com/embed/yK9YYBwnw3M?autoplay=0&rel=0" 
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                </div>
                <div style="padding: 0.75rem; background: linear-gradient(135deg, #1e2442, #2d1b69); border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: center; gap: 1rem;">
                    <a href="https://youtu.be/yK9YYBwnw3M" target="_blank" rel="noopener noreferrer"
                       style="padding: 0.5rem 1rem; background: rgba(100, 255, 218, 0.2); border: 1px solid #64ffda; border-radius: 6px; color: #5eb3ff; text-decoration: none; font-size: 0.9rem;">
                        🔗 Open in YouTube
                    </a>
                    <a href="https://github.com/ryanjamesindangan/crypto-checkout-simulator" target="_blank" rel="noopener noreferrer"
                       style="padding: 0.5rem 1rem; background: rgba(124, 58, 237, 0.2); border: 1px solid #3399ff; border-radius: 6px; color: #5eb3ff; text-decoration: none; font-size: 0.9rem;">
                        📂 View Source Code
                    </a>
                </div>
            </div>
        `
    },

    'supplier-demo': {
        title: 'Supplier Management Demo',
        icon: '🎬',
        content: `
            <div style="width: 100%; height: 100%; display: flex; flex-direction: column; background: #000;">
                <div style="padding: 1rem; background: linear-gradient(135deg, #2d1b69, #1e2442); border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                        <div style="font-size: 2rem;">🎬</div>
                        <div>
                            <h3 style="color: #5eb3ff; margin: 0; font-size: 1.2rem;">Supplier Order Management System</h3>
                            <p style="color: #94a3b8; margin: 0; font-size: 0.9rem;">Full Project Demonstration</p>
                        </div>
                    </div>
                </div>
                <div style="flex: 1; position: relative; background: #000;">
                    <iframe 
                        src="https://www.youtube.com/embed/hEIBbsilfEI?autoplay=0&rel=0" 
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                </div>
                <div style="padding: 0.75rem; background: linear-gradient(135deg, #1e2442, #2d1b69); border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: center; gap: 1rem;">
                    <a href="https://youtu.be/hEIBbsilfEI" target="_blank" rel="noopener noreferrer"
                       style="padding: 0.5rem 1rem; background: rgba(100, 255, 218, 0.2); border: 1px solid #64ffda; border-radius: 6px; color: #5eb3ff; text-decoration: none; font-size: 0.9rem;">
                        🔗 Open in YouTube
                    </a>
                    <a href="https://github.com/ryanjamesindangan/supplier-order-management-rjfi" target="_blank" rel="noopener noreferrer"
                       style="padding: 0.5rem 1rem; background: rgba(124, 58, 237, 0.2); border: 1px solid #3399ff; border-radius: 6px; color: #5eb3ff; text-decoration: none; font-size: 0.9rem;">
                        📂 View Source Code
                    </a>
                </div>
            </div>
        `
    },

    'ai-lab': {
        title: 'AI Lab',
        icon: '🤖',
        content: `
            <div style="max-width: 1200px;">
                <h2 style="font-size: 2rem; margin-bottom: 1rem; color: #1a1a1a; font-weight: 700;">Document Intelligence Lab</h2>
                <p style="color: #666; margin-bottom: 2rem; line-height: 1.6;">
                    Interactive demos showcasing AI/ML capabilities in Document Intelligence, OCR, and Computer Vision.
                </p>
                
                <!-- Interactive Demos Section -->
                <div style="display: grid; gap: 2rem; margin-bottom: 2rem;">
                    <!-- OCR Demo -->
                    <div style="padding: 2rem; background: linear-gradient(135deg, #fafafa, #f5f5f5); border: 1px solid #e0e0e0; border-left: 4px solid #2171d6; border-radius: 12px;">
                        <h3 style="color: #1a1a1a; font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 700;">🔍 Interactive OCR Demo</h3>
                        <p style="color: #666; margin-bottom: 1.5rem; line-height: 1.6;">
                            Upload an image with text to see real-time OCR text extraction using Tesseract.js
                        </p>
                        <div id="ocrDemoContainer" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; color: #1a1a1a; font-weight: 600;">Upload Image</label>
                                <input type="file" id="ocrImageInput" accept="image/*" style="display: none;">
                                <button id="ocrUploadBtn" style="width: 100%; padding: 1rem; background: #2171d6; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.9rem;">
                                    📤 Choose Image
                                </button>
                                <div id="ocrImagePreview" style="margin-top: 1rem; min-height: 200px; background: #f0f0f0; border: 2px dashed #ccc; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #999;">
                                    <div style="text-align: center;">
                                        <div style="font-size: 3rem; margin-bottom: 0.5rem;">📷</div>
                                        <div>Image preview will appear here</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; color: #1a1a1a; font-weight: 600;">Extracted Text</label>
                                <button id="ocrProcessBtn" style="width: 100%; padding: 1rem; background: #4caf50; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.9rem; margin-bottom: 1rem;" disabled>
                                    🔍 Process OCR
                                </button>
                                <div id="ocrProgress" style="display: none; margin-bottom: 1rem; padding: 0.75rem; background: #fff8e1; border: 1px solid #ffe082; border-radius: 6px; color: #f57c00; font-size: 0.85rem;">
                                    Processing... <span id="ocrProgressText">0%</span>
                                </div>
                                <div id="ocrResult" style="min-height: 200px; padding: 1rem; background: #f0f0f0; border: 1px solid #e0e0e0; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: #1a1a1a; white-space: pre-wrap; overflow-y: auto; max-height: 300px; word-wrap: break-word; overflow-wrap: break-word;">
                                    Extracted text will appear here...
                                </div>
                            </div>
                        </div>
                        <div style="padding: 1rem; background: #e8f4f8; border-radius: 6px; font-size: 0.85rem; color: #2171d6;">
                            <strong>💡 Tip:</strong> For best results, use clear images with high contrast text. The OCR engine works best with printed text.
                        </div>
                    </div>
                    
                    <!-- Pipeline Visualization -->
                    <div style="padding: 2rem; background: linear-gradient(135deg, #fafafa, #f5f5f5); border: 1px solid #e0e0e0; border-left: 4px solid #4caf50; border-radius: 12px;">
                        <h3 style="color: #1a1a1a; font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 700;">📊 Document Intelligence Pipeline</h3>
                        <p style="color: #666; margin-bottom: 1.5rem; line-height: 1.6;">
                            Interactive visualization of the end-to-end document processing pipeline
                        </p>
                        <div id="pipelineVisualization" style="padding: 1.5rem; background: #fff; border-radius: 8px; min-height: 400px;">
                            ${createPipelineFlowchart()}
                        </div>
                        <button id="simulatePipelineBtn" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: #4caf50; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                            ▶️ Simulate Pipeline
                        </button>
                    </div>
                    
                    <!-- Watermark Removal Comparison -->
                    <div style="padding: 2rem; background: linear-gradient(135deg, #fafafa, #f5f5f5); border: 1px solid #e0e0e0; border-left: 4px solid #7b1fa2; border-radius: 12px;">
                        <h3 style="color: #1a1a1a; font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 700;">💧 Watermark Removal Demo</h3>
                        <p style="color: #666; margin-bottom: 1.5rem; line-height: 1.6;">
                            Visual comparison of documents before and after ML-based watermark removal
                        </p>
                        <div id="watermarkDemoContainer" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                            <div>
                                <h4 style="color: #1a1a1a; margin-bottom: 0.5rem; font-weight: 600;">Before (With Watermark)</h4>
                                <div id="watermarkBefore" style="min-height: 250px; background: #f0f0f0; border: 2px solid #e0e0e0; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #999; position: relative;">
                                    <div style="text-align: center;">
                                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">📄</div>
                                        <div>Sample document with watermark</div>
                                    </div>
                                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 3rem; color: rgba(0,0,0,0.1); font-weight: bold; pointer-events: none;">CONFIDENTIAL</div>
                                </div>
                            </div>
                            <div>
                                <h4 style="color: #1a1a1a; margin-bottom: 0.5rem; font-weight: 600;">After (Watermark Removed)</h4>
                                <div id="watermarkAfter" style="min-height: 250px; background: #f0f0f0; border: 2px solid #e0e0e0; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #999;">
                                    <div style="text-align: center;">
                                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">✨</div>
                                        <div>Click "Process" to see result</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button id="processWatermarkBtn" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: #7b1fa2; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                            🔄 Process Watermark Removal
                        </button>
                        <div id="watermarkInfo" style="margin-top: 1rem; padding: 1rem; background: #f3e5f5; border-radius: 6px; font-size: 0.85rem; color: #7b1fa2; display: none;">
                            <strong>ML Detection:</strong> <span id="watermarkType">-</span> | <strong>Confidence:</strong> <span id="watermarkConfidence">-</span>% | <strong>Processing Time:</strong> <span id="watermarkTime">-</span>ms
                        </div>
                    </div>
                </div>
                
                <!-- Feature Cards -->
                <div style="display: grid; gap: 2rem; margin-top: 2rem;">
                    ${createAIFeatureCard(
                        '📄 Document Extraction Pipeline',
                        'End-to-end bank statement extraction with native PDF text and OCR fallback',
                        [
                            'Native PDF text extraction (PyMuPDF)',
                            'OCR fallback (Tesseract + OpenCV)',
                            'Multi-angle scanning with quality scoring',
                            'Validation-first framework for data integrity'
                        ],
                        ['Python', 'PyMuPDF', 'Tesseract', 'OpenCV']
                    )}
                    
                    ${createAIFeatureCard(
                        '🧠 LLM Integration',
                        'Local and cloud LLM workflows for structured underwriting summaries',
                        [
                            'Ollama for local LLM inference',
                            'vLLM for high-performance production',
                            'OpenAI-compatible API integration',
                            'Token-efficient payload optimization'
                        ],
                        ['Ollama', 'vLLM', 'OpenAI API', 'FastAPI']
                    )}
                    
                    ${createAIFeatureCard(
                        '🔒 Secure AI Gateway',
                        'Production-ready service architecture with JWT/RSA and real-time processing',
                        [
                            'Node.js gateway with JWT authentication',
                            'RSA key management',
                            'Rate limiting and CORS allowlists',
                            'FastAPI Server-Sent Events for real-time updates'
                        ],
                        ['Node.js', 'JWT', 'RSA', 'FastAPI', 'SSE']
                    )}
                </div>
                
                <div style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #e8f4f8, #f0f8ff); border-left: 4px solid #2171d6; border-radius: 8px;">
                    <h3 style="color: #2171d6; margin-bottom: 1rem; font-weight: 600;">🚀 Try It Out</h3>
                    <p style="color: #1a1a1a; margin-bottom: 1rem;">
                        Open the Terminal and try these AI commands:
                    </p>
                    <div style="background: #1a1a1a; padding: 1rem; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 0.9rem;">
                        <div style="color: #64ffda;">$ ai-about</div>
                        <div style="color: #64ffda;">$ ocr-demo</div>
                        <div style="color: #64ffda;">$ extract-doc</div>
                        <div style="color: #64ffda;">$ llm-status</div>
                    </div>
                </div>
            </div>
        `
    },

    testimonials: {
        title: 'Testimonials & Reviews',
        icon: '⭐',
        content: `
            <div style="max-width: 1000px;">
                <h2 style="font-size: 2rem; margin-bottom: 1rem; color: #1a1a1a; font-weight: 700;">Client Testimonials & Recommendations</h2>
                <p style="color: #666; margin-bottom: 2rem; line-height: 1.6;">
                    Here's what clients and colleagues say about working with me. These testimonials showcase my commitment to quality, 
                    technical expertise, and collaborative approach.
                </p>
                
                <!-- Testimonials Carousel -->
                <div class="testimonials-carousel-container" style="position: relative;">
                    <div class="testimonials-carousel" id="testimonialsCarousel" style="display: flex; gap: 1.5rem; overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth; padding: 1rem 0; scrollbar-width: thin;">
                        ${createTestimonialCard(
                            'Client Review',
                            'Project Manager',
                            'GlobalX Digital Corporation',
                            5,
                            'Ryan delivered exceptional results on our database architecture redesign. His technical expertise, leadership skills, and ability to coordinate multiple teams were outstanding. He revived a stalled project and delivered a fully enhanced Version 2 within 2 months.',
                            'LinkedIn',
                            'https://www.linkedin.com/in/ryanjamesindangan'
                        )}
                        ${createTestimonialCard(
                            'Upwork Client',
                            'Startup Founder',
                            'Tech Startup',
                            5,
                            'Ryan is an exceptional full-stack developer. He built our entire platform from scratch, integrating AI features that significantly improved our workflow. His code quality is excellent, and he always delivers on time. Highly recommended!',
                            'Upwork',
                            'https://www.upwork.com/freelancers/~01d452f9125d3dcdf1'
                        )}
                        ${createTestimonialCard(
                            'Team Lead',
                            'Senior Developer',
                            'Previous Project',
                            5,
                            'Working with Ryan was a pleasure. His deep understanding of both frontend and backend technologies, combined with his AI/ML expertise, made him an invaluable team member. He consistently delivered high-quality solutions and was always willing to help teammates.',
                            'LinkedIn',
                            'https://www.linkedin.com/in/ryanjamesindangan'
                        )}
                        ${createTestimonialCard(
                            'Client Feedback',
                            'CTO',
                            'Enterprise Client',
                            5,
                            'Ryan\'s work on our Document Intelligence pipeline was outstanding. He implemented complex OCR and watermark removal systems that significantly improved our processing accuracy. His attention to detail and problem-solving skills are top-notch.',
                            'LinkedIn',
                            'https://www.linkedin.com/in/ryanjamesindangan'
                        )}
                        ${createTestimonialCard(
                            'Upwork Review',
                            'Product Owner',
                            'SaaS Company',
                            5,
                            'Ryan exceeded our expectations on multiple projects. His ability to understand complex requirements and translate them into clean, maintainable code is impressive. He\'s proactive, communicates well, and always finds the best technical solutions.',
                            'Upwork',
                            'https://www.upwork.com/freelancers/~01d452f9125d3dcdf1'
                        )}
                    </div>
                    
                    <!-- Carousel Navigation -->
                    <div class="testimonials-nav" style="display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 2rem;">
                        <button class="testimonial-nav-btn testimonial-prev" style="padding: 0.75rem 1.5rem; background: #2171d6; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s;">← Previous</button>
                        <div class="testimonial-dots" style="display: flex; gap: 0.5rem;">
                            <!-- Dots will be generated by JavaScript -->
                        </div>
                        <button class="testimonial-nav-btn testimonial-next" style="padding: 0.75rem 1.5rem; background: #2171d6; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s;">Next →</button>
                    </div>
                </div>
                
                <!-- External Links -->
                <div style="margin-top: 3rem; padding: 2rem; background: linear-gradient(135deg, #e8f4f8, #f0f8ff); border-left: 4px solid #2171d6; border-radius: 8px;">
                    <h3 style="color: #2171d6; margin-bottom: 1rem; font-weight: 600;">📊 View More Reviews</h3>
                    <p style="color: #1a1a1a; margin-bottom: 1.5rem; line-height: 1.6;">
                        Check out more testimonials and recommendations on my professional profiles:
                    </p>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <a href="https://www.linkedin.com/in/ryanjamesindangan" target="_blank" rel="noopener noreferrer" 
                           style="padding: 1rem 1.5rem; background: #0077b5; color: #fff; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem; transition: all 0.2s;">
                            💼 LinkedIn Recommendations
                        </a>
                        <a href="https://www.upwork.com/freelancers/~01d452f9125d3dcdf1" target="_blank" rel="noopener noreferrer" 
                           style="padding: 1rem 1.5rem; background: #6fda44; color: #fff; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem; transition: all 0.2s;">
                            🎯 Upwork Reviews
                        </a>
                    </div>
                </div>
            </div>
        `
    },

    'github-stats': {
        title: 'GitHub Stats & Activity',
        icon: '📊',
        content: `
            <div style="max-width: 1000px;">
                <h2 style="font-size: 2rem; margin-bottom: 1rem; color: #1a1a1a; font-weight: 700;">GitHub Statistics & Activity</h2>
                <p style="color: #666; margin-bottom: 2rem; line-height: 1.6;">
                    Real-time statistics from my GitHub profile, showcasing active development and community engagement.
                </p>
                
                <!-- Loading State -->
                <div id="githubStatsLoading" style="text-align: center; padding: 3rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⏳</div>
                    <p style="color: #666;">Loading GitHub statistics...</p>
                </div>
                
                <!-- Error State -->
                <div id="githubStatsError" style="display: none; text-align: center; padding: 3rem; background: #fee; border: 1px solid #fcc; border-radius: 8px; color: #c33;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                    <p style="margin-bottom: 1rem;">Failed to load GitHub statistics.</p>
                    <button onclick="loadGitHubStats()" style="padding: 0.75rem 1.5rem; background: #2171d6; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Retry</button>
                </div>
                
                <!-- Stats Content -->
                <div id="githubStatsContent" style="display: none;">
                    <!-- User Stats -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                        <div class="github-stat-card" style="padding: 1.5rem; background: linear-gradient(135deg, #e8f4f8, #f0f8ff); border: 1px solid #d0e8f0; border-radius: 8px; text-align: center;">
                            <div style="font-size: 2.5rem; font-weight: bold; color: #2171d6; margin-bottom: 0.5rem;" id="githubPublicRepos">-</div>
                            <div style="color: #666; font-size: 0.9rem;">Public Repositories</div>
                        </div>
                        <div class="github-stat-card" style="padding: 1.5rem; background: linear-gradient(135deg, #e8f4f8, #f0f8ff); border: 1px solid #d0e8f0; border-radius: 8px; text-align: center;">
                            <div style="font-size: 2.5rem; font-weight: bold; color: #2171d6; margin-bottom: 0.5rem;" id="githubFollowers">-</div>
                            <div style="color: #666; font-size: 0.9rem;">Followers</div>
                        </div>
                        <div class="github-stat-card" style="padding: 1.5rem; background: linear-gradient(135deg, #e8f4f8, #f0f8ff); border: 1px solid #d0e8f0; border-radius: 8px; text-align: center;">
                            <div style="font-size: 2.5rem; font-weight: bold; color: #2171d6; margin-bottom: 0.5rem;" id="githubFollowing">-</div>
                            <div style="color: #666; font-size: 0.9rem;">Following</div>
                        </div>
                        <div class="github-stat-card" style="padding: 1.5rem; background: linear-gradient(135deg, #fff8e1, #fffde7); border: 1px solid #ffe082; border-radius: 8px; text-align: center;">
                            <div style="font-size: 2.5rem; font-weight: bold; color: #f57c00; margin-bottom: 0.5rem;" id="githubTotalStars">-</div>
                            <div style="color: #666; font-size: 0.9rem;">Total Stars</div>
                        </div>
                    </div>
                    
                    <!-- Top Repositories -->
                    <div style="margin-bottom: 2rem;">
                        <h3 style="color: #1a1a1a; font-size: 1.3rem; margin-bottom: 1rem; font-weight: 700;">⭐ Top Repositories</h3>
                        <div id="githubTopRepos" style="display: grid; gap: 1rem;">
                            <!-- Repositories will be loaded here -->
                        </div>
                    </div>
                    
                    <!-- Recent Activity -->
                    <div style="margin-bottom: 2rem;">
                        <h3 style="color: #1a1a1a; font-size: 1.3rem; margin-bottom: 1rem; font-weight: 700;">🔄 Recent Activity</h3>
                        <div id="githubRecentActivity" style="display: grid; gap: 0.75rem;">
                            <!-- Activity will be loaded here -->
                        </div>
                    </div>
                    
                    <!-- External Link -->
                    <div style="padding: 1.5rem; background: linear-gradient(135deg, #e8f4f8, #f0f8ff); border-left: 4px solid #2171d6; border-radius: 8px; text-align: center;">
                        <a href="https://github.com/ryanjamesindangan" target="_blank" rel="noopener noreferrer" 
                           style="padding: 1rem 2rem; background: #2171d6; color: #fff; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem;">
                            🔗 View Full GitHub Profile
                        </a>
                    </div>
                </div>
            </div>
        `
    },

    blog: {
        title: 'Blog & Articles',
        icon: '📝',
        content: `
            <div style="max-width: 1200px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                    <h2 style="font-size: 2rem; color: #1a1a1a; font-weight: 700; margin: 0;">Technical Blog & Articles</h2>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <input type="text" id="blogSearchInput" placeholder="Search articles..." 
                               style="padding: 0.5rem 1rem; border: 1px solid #e0e0e0; border-radius: 6px; font-size: 0.9rem; min-width: 200px;">
                        <button class="blog-filter-btn active" data-filter="all" style="padding: 0.5rem 1rem; background: #2171d6; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.85rem;">All</button>
                        <button class="blog-filter-btn" data-filter="tutorial" style="padding: 0.5rem 1rem; background: #f0f0f0; color: #1a1a1a; border: 1px solid #e0e0e0; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.85rem;">Tutorials</button>
                        <button class="blog-filter-btn" data-filter="case-study" style="padding: 0.5rem 1rem; background: #f0f0f0; color: #1a1a1a; border: 1px solid #e0e0e0; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.85rem;">Case Studies</button>
                        <button class="blog-filter-btn" data-filter="ai-ml" style="padding: 0.5rem 1rem; background: #f0f0f0; color: #1a1a1a; border: 1px solid #e0e0e0; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.85rem;">AI/ML</button>
                        <button class="blog-filter-btn" data-filter="technical" style="padding: 0.5rem 1rem; background: #f0f0f0; color: #1a1a1a; border: 1px solid #e0e0e0; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.85rem;">Technical</button>
                    </div>
                </div>
                
                <div id="blogPostsContainer" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 2rem;">
                    ${getBlogPosts().map(post => createBlogPostCard(post)).join('')}
                </div>
            </div>
        `
    },

    'code-snippets': {
        title: 'Code Examples',
        icon: '💻',
        content: `
            <div style="max-width: 1200px;">
                <h2 style="font-size: 2rem; margin-bottom: 1rem; color: var(--text-primary); font-weight: 700;">💻 Code Examples</h2>
                <p style="color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.6;">
                    Interactive code snippets showcasing coding style, best practices, and real-world examples from my projects.
                </p>
                
                <div style="display: grid; gap: 2rem;">
                    <!-- Python: Document Intelligence Pipeline -->
                    <div class="code-snippet-container" style="background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 8px; overflow: hidden; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--bg-tertiary); border-bottom: 1px solid var(--glass-border);">
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <span style="font-size: 1.2rem;">🐍</span>
                                <span style="color: var(--text-primary); font-weight: 600;">Python - Document Intelligence Pipeline</span>
                            </div>
                            <button class="code-copy-btn" style="padding: 0.5rem 1rem; background: var(--windows-blue); color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.2s ease;" onmouseover="this.style.background='var(--windows-hover)'" onmouseout="this.style.background='var(--windows-blue)'">
                                📋 Copy Code
                            </button>
                        </div>
                        <pre style="margin: 0; padding: 1.5rem; background: #1e1e1e; color: #d4d4d4; overflow-x: auto; font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 0.9rem; line-height: 1.6;"><code>def extract_bank_statement(pdf_path):
    """
    Extract text from bank statement PDF with OCR fallback.
    Uses native PDF text extraction first, falls back to OCR if needed.
    """
    try:
        # Try native PDF text extraction
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        
        if len(text.strip()) > 100:  # Sufficient text extracted
            return {"method": "native", "text": text, "confidence": 1.0}
    except Exception as e:
        logger.warning(f"Native extraction failed: {e}")
    
    # Fallback to OCR with preprocessing
    image = pdf2image.convert_from_path(pdf_path)[0]
    processed = preprocess_image(image)  # Denoise, threshold, deskew
    text = pytesseract.image_to_string(processed, lang='eng')
    
    return {
        "method": "ocr",
        "text": text,
        "confidence": calculate_confidence(text)
    }</code></pre>
                    </div>
                    
                    <!-- JavaScript: Window Management -->
                    <div class="code-snippet-container" style="background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 8px; overflow: hidden; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--bg-tertiary); border-bottom: 1px solid var(--glass-border);">
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <span style="font-size: 1.2rem;">⚡</span>
                                <span style="color: var(--text-primary); font-weight: 600;">JavaScript - Window Management (Vanilla JS)</span>
                            </div>
                            <div style="display: flex; gap: 0.5rem;">
                                <button class="code-run-btn" style="padding: 0.5rem 1rem; background: #4caf50; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.2s ease;" onmouseover="this.style.background='#45a049'" onmouseout="this.style.background='#4caf50'">
                                    ▶️ Run
                                </button>
                                <button class="code-copy-btn" style="padding: 0.5rem 1rem; background: var(--windows-blue); color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.2s ease;" onmouseover="this.style.background='var(--windows-hover)'" onmouseout="this.style.background='var(--windows-blue)'">
                                    📋 Copy
                                </button>
                            </div>
                        </div>
                        <pre style="margin: 0; padding: 1.5rem; background: #1e1e1e; color: #d4d4d4; overflow-x: auto; font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 0.9rem; line-height: 1.6;"><code>// Window management with drag, resize, and snap
class WindowManager {
    constructor() {
        this.windows = new Map();
        this.activeWindow = null;
    }
    
    createWindow(config) {
        const window = document.createElement('div');
        window.className = 'window';
        window.dataset.appId = config.id;
        
        // Make draggable
        this.makeDraggable(window, config.title);
        
        // Make resizable
        this.makeResizable(window);
        
        this.windows.set(config.id, window);
        return window;
    }
    
    makeDraggable(element, title) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        element.querySelector('.window-header').addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = element.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            element.style.left = (startLeft + deltaX) + 'px';
            element.style.top = (startTop + deltaY) + 'px';
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
}</code></pre>
                    </div>
                    
                    <!-- FastAPI: Real-time Processing -->
                    <div class="code-snippet-container" style="background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 8px; overflow: hidden; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--bg-tertiary); border-bottom: 1px solid var(--glass-border);">
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <span style="font-size: 1.2rem;">🚀</span>
                                <span style="color: var(--text-primary); font-weight: 600;">FastAPI - Server-Sent Events for Real-time Processing</span>
                            </div>
                            <button class="code-copy-btn" style="padding: 0.5rem 1rem; background: var(--windows-blue); color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.2s ease;" onmouseover="this.style.background='var(--windows-hover)'" onmouseout="this.style.background='var(--windows-blue)'">
                                📋 Copy Code
                            </button>
                        </div>
                        <pre style="margin: 0; padding: 1.5rem; background: #1e1e1e; color: #d4d4d4; overflow-x: auto; font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 0.9rem; line-height: 1.6;"><code>from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import asyncio
import json

app = FastAPI()

@app.post("/process-document")
async def process_document(document_id: str):
    """
    Process document with real-time progress updates via SSE.
    """
    async def event_generator():
        stages = [
            ("loading", "Loading document..."),
            ("preprocessing", "Preprocessing image..."),
            ("ocr", "Running OCR..."),
            ("validation", "Validating extracted data..."),
            ("complete", "Processing complete!")
        ]
        
        for stage, message in stages:
            yield f"data: {json.dumps({'stage': stage, 'message': message})}\n\n"
            await asyncio.sleep(1)  # Simulate processing
        
        # Final result
        result = {"status": "success", "data": {...}}
        yield f"data: {json.dumps(result)}\n\n"
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )</code></pre>
                    </div>
                    
                    <!-- React: Component Example -->
                    <div class="code-snippet-container" style="background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 8px; overflow: hidden; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--bg-tertiary); border-bottom: 1px solid var(--glass-border);">
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <span style="font-size: 1.2rem;">⚛️</span>
                                <span style="color: var(--text-primary); font-weight: 600;">React - Reusable Component Pattern</span>
                            </div>
                            <button class="code-copy-btn" style="padding: 0.5rem 1rem; background: var(--windows-blue); color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.2s ease;" onmouseover="this.style.background='var(--windows-hover)'" onmouseout="this.style.background='var(--windows-blue)'">
                                📋 Copy Code
                            </button>
                        </div>
                        <pre style="margin: 0; padding: 1.5rem; background: #1e1e1e; color: #d4d4d4; overflow-x: auto; font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 0.9rem; line-height: 1.6;"><code>import React, { useState, useEffect } from 'react';

const DocumentProcessor = ({ documentId, onComplete }) => {
    const [status, setStatus] = useState('idle');
    const [progress, setProgress] = useState(0);
    
    useEffect(() => {
        const eventSource = new EventSource(
            \`/api/process-document/\${documentId}\`
        );
        
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setStatus(data.stage);
            setProgress(calculateProgress(data.stage));
            
            if (data.status === 'success') {
                onComplete(data.data);
                eventSource.close();
            }
        };
        
        return () => eventSource.close();
    }, [documentId, onComplete]);
    
    return (
        <div className="processor">
            <div className="status">{status}</div>
            <div className="progress-bar">
                <div style={{ width: \`\${progress}%\` }} />
            </div>
        </div>
    );
};

export default DocumentProcessor;</code></pre>
                    </div>
                </div>
                
                <div style="margin-top: 2rem; padding: 1.5rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 8px; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">
                    <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-weight: 600;">💡 Best Practices Demonstrated</h3>
                    <ul style="color: var(--text-secondary); line-height: 1.8; margin: 0; padding-left: 1.5rem;">
                        <li>Clean, readable code with proper documentation</li>
                        <li>Error handling and fallback strategies</li>
                        <li>Real-time processing with Server-Sent Events</li>
                        <li>Reusable component patterns</li>
                        <li>TypeScript-ready JavaScript patterns</li>
                        <li>Performance optimization considerations</li>
                    </ul>
                </div>
            </div>
        `
    },

    'easter-eggs': {
        title: 'Easter Eggs & Hidden Features',
        icon: '🥚',
        content: `
            <div style="max-width: 800px;">
                <h1 style="font-size: 2rem; margin-bottom: 1.5rem; color: #1a1a1a; font-weight: 700;">
                    🥚 Easter Eggs & Hidden Features
                </h1>
                <p style="line-height: 1.8; margin-bottom: 2rem; color: #666;">
                    Discover all the hidden tricks and easter eggs in this portfolio! These features showcase 
                    the interactive nature of this Web OS experience.
                </p>
                
                <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                    <!-- Konami Code -->
                    <div style="padding: 1.5rem; background: #fff8e1; border: 2px solid #ffc107; border-radius: 8px;">
                        <div style="display: flex; align-items: start; gap: 1rem; margin-bottom: 1rem;">
                            <div style="font-size: 2.5rem;">🎮</div>
                            <div style="flex: 1;">
                                <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem; color: #1a1a1a; font-weight: 600;">
                                    Konami Code
                                </h3>
                                <p style="color: #666; margin-bottom: 1rem; line-height: 1.6;">
                                    The classic cheat code from retro gaming! Type this sequence anywhere on the page:
                                </p>
                                <div style="background: #1a1a1a; color: #fff; padding: 1rem; border-radius: 6px; font-family: monospace; font-size: 1.1rem; text-align: center; margin-bottom: 1rem;">
                                    ↑ ↑ ↓ ↓ ← → ← → B A
                                </div>
                                <p style="color: #666; margin-bottom: 1rem; line-height: 1.6;">
                                    <strong>What happens:</strong> Confetti falls from the sky, rainbow effects appear, and a celebration notification!
                                </p>
                                <button class="try-konami-btn" style="padding: 0.75rem 1.5rem; background: #ffc107; border: none; border-radius: 6px; color: #1a1a1a; font-weight: 600; cursor: pointer; transition: all 0.2s;">
                                    🎯 Try It Now (Click to simulate)
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Keyboard Shortcuts -->
                    <div style="padding: 1.5rem; background: #e8f5e9; border: 2px solid #4caf50; border-radius: 8px;">
                        <div style="display: flex; align-items: start; gap: 1rem; margin-bottom: 1rem;">
                            <div style="font-size: 2.5rem;">⌨️</div>
                            <div style="flex: 1;">
                                <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem; color: #1a1a1a; font-weight: 600;">
                                    Keyboard Shortcuts
                                </h3>
                                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                                    <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: rgba(255,255,255,0.5); border-radius: 6px;">
                                        <kbd style="padding: 0.5rem 0.75rem; background: #1a1a1a; color: #fff; border-radius: 4px; font-family: monospace; font-size: 0.9rem;">Ctrl + Shift + D</kbd>
                                        <span style="flex: 1; color: #666;">Developer mode - Shows console messages</span>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: rgba(255,255,255,0.5); border-radius: 6px;">
                                        <kbd style="padding: 0.5rem 0.75rem; background: #1a1a1a; color: #fff; border-radius: 4px; font-family: monospace; font-size: 0.9rem;">Ctrl + Shift + M</kbd>
                                        <span style="flex: 1; color: #666;">Matrix mode - Green rain effect overlay</span>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: rgba(255,255,255,0.5); border-radius: 6px;">
                                        <kbd style="padding: 0.5rem 0.75rem; background: #1a1a1a; color: #fff; border-radius: 4px; font-family: monospace; font-size: 0.9rem;">Ctrl + Shift + S</kbd>
                                        <span style="flex: 1; color: #666;">Quick launch Snake game</span>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: rgba(255,255,255,0.5); border-radius: 6px;">
                                        <kbd style="padding: 0.5rem 0.75rem; background: #1a1a1a; color: #fff; border-radius: 4px; font-family: monospace; font-size: 0.9rem;">Win + D</kbd>
                                        <span style="flex: 1; color: #666;">Show desktop (minimize all windows)</span>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: rgba(255,255,255,0.5); border-radius: 6px;">
                                        <kbd style="padding: 0.5rem 0.75rem; background: #1a1a1a; color: #fff; border-radius: 4px; font-family: monospace; font-size: 0.9rem;">Alt + F4</kbd>
                                        <span style="flex: 1; color: #666;">Close active window</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Secret Click Counter -->
                    <div style="padding: 1.5rem; background: #f3e5f5; border: 2px solid #9c27b0; border-radius: 8px;">
                        <div style="display: flex; align-items: start; gap: 1rem; margin-bottom: 1rem;">
                            <div style="font-size: 2.5rem;">🔍</div>
                            <div style="flex: 1;">
                                <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem; color: #1a1a1a; font-weight: 600;">
                                    Secret Click Counter
                                </h3>
                                <p style="color: #666; margin-bottom: 1rem; line-height: 1.6;">
                                    Triple-click on the profile photo during the boot screen to discover a secret counter!
                                </p>
                                <p style="color: #999; font-size: 0.9rem; font-style: italic;">
                                    💡 Hint: Wait for the boot screen to appear, then triple-click the profile picture
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Console Secrets -->
                    <div style="padding: 1.5rem; background: #e3f2fd; border: 2px solid #2196f3; border-radius: 8px;">
                        <div style="display: flex; align-items: start; gap: 1rem; margin-bottom: 1rem;">
                            <div style="font-size: 2.5rem;">💻</div>
                            <div style="flex: 1;">
                                <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem; color: #1a1a1a; font-weight: 600;">
                                    Console Secrets
                                </h3>
                                <p style="color: #666; margin-bottom: 1rem; line-height: 1.6;">
                                    Open your browser's developer console (F12) to see friendly messages and hints about hidden features!
                                </p>
                                <button class="open-console-hint-btn" style="padding: 0.75rem 1.5rem; background: #2196f3; border: none; border-radius: 6px; color: #fff; font-weight: 600; cursor: pointer; transition: all 0.2s;">
                                    📖 Show Console Hint
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Right-Click Menu -->
                    <div style="padding: 1.5rem; background: #fff3e0; border: 2px solid #ff9800; border-radius: 8px;">
                        <div style="display: flex; align-items: start; gap: 1rem; margin-bottom: 1rem;">
                            <div style="font-size: 2.5rem;">🖱️</div>
                            <div style="flex: 1;">
                                <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem; color: #1a1a1a; font-weight: 600;">
                                    Desktop Context Menu
                                </h3>
                                <p style="color: #666; margin-bottom: 1rem; line-height: 1.6;">
                                    Right-click on an empty area of the desktop to access:
                                </p>
                                <ul style="color: #666; line-height: 1.8; padding-left: 1.5rem;">
                                    <li>🔄 Refresh Desktop</li>
                                    <li>👁️ View Source Code</li>
                                    <li>📋 Show All Windows</li>
                                    <li>⬇️ Minimize All</li>
                                    <li>🖼️ Change Wallpaper</li>
                                    <li>ℹ️ About This Portfolio</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <!-- AI Assistant Features -->
                    <div style="padding: 1.5rem; background: #e0f2f1; border: 2px solid #009688; border-radius: 8px;">
                        <div style="display: flex; align-items: start; gap: 1rem; margin-bottom: 1rem;">
                            <div style="font-size: 2.5rem;">🤖</div>
                            <div style="flex: 1;">
                                <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem; color: #1a1a1a; font-weight: 600;">
                                    AI Assistant Features
                                </h3>
                                <p style="color: #666; margin-bottom: 1rem; line-height: 1.6;">
                                    The AI Assistant has many hidden features:
                                </p>
                                <ul style="color: #666; line-height: 1.8; padding-left: 1.5rem;">
                                    <li>🎤 Voice input (click the mic button)</li>
                                    <li>🔍 Conversation search</li>
                                    <li>💬 Quick reply buttons</li>
                                    <li>😊 Message reactions</li>
                                    <li>📤 Export conversations</li>
                                    <li>🧠 Remembers your name</li>
                                    <li>🎨 Conversation modes (Professional, Casual, Technical)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 2rem; padding: 1.5rem; background: #f5f5f5; border-radius: 8px; text-align: center;">
                    <p style="color: #666; margin-bottom: 0.5rem;">
                        <strong>💡 Pro Tip:</strong> Try combining features! For example, activate Matrix mode and then use the Konami Code for a double effect!
                    </p>
                    <p style="color: #999; font-size: 0.9rem;">
                        Found all the easter eggs? Check the console for more developer secrets! 🎉
                    </p>
                </div>
            </div>
        `
    }
};

// ===========================
// Blog Posts Data
// ===========================
function getBlogPosts() {
    return [
        {
            id: 'document-intelligence-pipeline',
            title: 'Building an End-to-End Document Intelligence Pipeline',
            excerpt: 'Learn how to build a production-ready document extraction system combining native PDF parsing, OCR fallback, and ML-based watermark removal for financial document processing.',
            category: 'case-study',
            tags: ['AI/ML', 'Python', 'OCR', 'Document Intelligence', 'FastAPI'],
            date: '2025-01-15',
            readTime: '12 min read',
            featured: true
        },
        {
            id: 'ocr-preprocessing-techniques',
            title: 'Advanced OCR Preprocessing Techniques for Better Accuracy',
            excerpt: 'Deep dive into OpenCV and PIL techniques for improving OCR accuracy: denoising, adaptive thresholding, deskewing, and multi-angle scanning strategies.',
            category: 'tutorial',
            tags: ['OCR', 'OpenCV', 'Python', 'Computer Vision', 'Tutorial'],
            date: '2025-01-10',
            readTime: '8 min read',
            featured: false
        },
        {
            id: 'watermark-removal-ml',
            title: 'ML-Based Watermark Removal Using RandomForest Classification',
            excerpt: 'A comprehensive guide to building an automated watermark detection and removal system using feature engineering and RandomForest classification for document processing.',
            category: 'ai-ml',
            tags: ['Machine Learning', 'RandomForest', 'scikit-learn', 'Python', 'Document Processing'],
            date: '2025-01-05',
            readTime: '15 min read',
            featured: true
        },
        {
            id: 'ollama-llm-integration',
            title: 'Integrating Local LLMs with Ollama for Production Workflows',
            excerpt: 'Step-by-step guide to integrating Ollama for local LLM inference, token-efficient payloads, and structured output generation for underwriting summaries.',
            category: 'tutorial',
            tags: ['LLM', 'Ollama', 'Python', 'AI', 'Tutorial'],
            date: '2024-12-28',
            readTime: '10 min read',
            featured: false
        },
        {
            id: 'fastapi-sse-realtime',
            title: 'Real-Time Processing with FastAPI Server-Sent Events',
            excerpt: 'Implementing real-time progress updates and streaming results using FastAPI SSE for AI pipeline visibility and user feedback.',
            category: 'technical',
            tags: ['FastAPI', 'SSE', 'Python', 'Real-time', 'Backend'],
            date: '2024-12-20',
            readTime: '7 min read',
            featured: false
        },
        {
            id: 'secure-ai-gateway',
            title: 'Building a Secure AI Gateway with JWT and RSA',
            excerpt: 'Architecture and implementation of a production-ready Node.js gateway with JWT authentication, RSA key management, rate limiting, and CORS allowlists.',
            category: 'technical',
            tags: ['Node.js', 'JWT', 'Security', 'API Gateway', 'RSA'],
            date: '2024-12-15',
            readTime: '9 min read',
            featured: false
        },
        {
            id: 'bank-statement-extraction',
            title: 'Bank Statement Extraction: Native PDF vs OCR Fallback',
            excerpt: 'Case study on building a validation-first extraction framework for financial data integrity, combining native PDF text extraction with intelligent OCR fallback.',
            category: 'case-study',
            tags: ['Document Intelligence', 'PDF Processing', 'OCR', 'Financial Tech', 'Case Study'],
            date: '2024-12-10',
            readTime: '11 min read',
            featured: true
        },
        {
            id: 'validation-framework-design',
            title: 'Designing a Validation-First Extraction Framework',
            excerpt: 'Best practices for building extraction systems that enforce structural integrity invariants and auditability without mutating source financial text.',
            category: 'technical',
            tags: ['Architecture', 'Best Practices', 'Data Validation', 'System Design'],
            date: '2024-12-05',
            readTime: '6 min read',
            featured: false
        }
    ];
}

// ===========================
// Blog Post Card Component
// ===========================
function createBlogPostCard(post) {
    const categoryColors = {
        'tutorial': { bg: '#e8f4f8', border: '#d0e8f0', text: '#2171d6' },
        'case-study': { bg: '#fff8e1', border: '#ffe082', text: '#f57c00' },
        'ai-ml': { bg: '#f3e5f5', border: '#ce93d8', text: '#7b1fa2' },
        'technical': { bg: '#e0f2f1', border: '#80cbc4', text: '#00695c' }
    };
    
    const colors = categoryColors[post.category] || categoryColors.technical;
    const categoryLabels = {
        'tutorial': '📚 Tutorial',
        'case-study': '📊 Case Study',
        'ai-ml': '🤖 AI/ML',
        'technical': '⚙️ Technical'
    };
    
    return `
        <div class="blog-post-card" data-category="${post.category}" data-post-id="${post.id}" 
             style="padding: 0; background: #fafafa; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; transition: all 0.3s ease; cursor: pointer; position: relative;">
            ${post.featured ? `
                <div style="position: absolute; top: 1rem; right: 1rem; background: #ffb900; color: #fff; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; z-index: 1;">
                    ⭐ Featured
                </div>
            ` : ''}
            <div style="padding: 1.5rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                    <span style="padding: 0.25rem 0.75rem; background: ${colors.bg}; border: 1px solid ${colors.border}; border-radius: 4px; color: ${colors.text}; font-size: 0.75rem; font-weight: 600;">
                        ${categoryLabels[post.category] || '📝 Article'}
                    </span>
                    <span style="color: #999; font-size: 0.75rem;">${formatBlogDate(post.date)}</span>
                    <span style="color: #999; font-size: 0.75rem;">•</span>
                    <span style="color: #999; font-size: 0.75rem;">${post.readTime}</span>
                </div>
                <h3 style="color: #1a1a1a; font-size: 1.3rem; margin-bottom: 0.75rem; font-weight: 700; line-height: 1.4;">${post.title}</h3>
                <p style="color: #666; line-height: 1.6; margin-bottom: 1rem; font-size: 0.9rem;">${post.excerpt}</p>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
                    ${post.tags.slice(0, 3).map(tag => `
                        <span style="padding: 0.25rem 0.5rem; background: #f0f0f0; border: 1px solid #e0e0e0; border-radius: 4px; color: #666; font-size: 0.75rem;">
                            ${tag}
                        </span>
                    `).join('')}
                    ${post.tags.length > 3 ? `<span style="color: #999; font-size: 0.75rem; padding: 0.25rem 0.5rem;">+${post.tags.length - 3} more</span>` : ''}
                </div>
                <button class="read-more-btn" data-post-id="${post.id}" 
                        style="padding: 0.75rem 1.5rem; background: #2171d6; border: 1px solid #1a5fb8; border-radius: 6px; color: #fff; font-weight: 600; cursor: pointer; transition: all 0.2s; width: 100%; font-size: 0.9rem;">
                    Read Article →
                </button>
            </div>
        </div>
    `;
}

// Helper function to format blog dates
function formatBlogDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Helper functions to create UI components
function createSkillCategory(title, skills) {
    return `
        <div style="padding: 1.5rem; background: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h3 style="color: #2171d6; margin-bottom: 1rem; font-weight: 600; font-size: 1.1rem;">${title}</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${skills.map(skill => `
                    <span style="padding: 0.5rem 1rem; background: #e8f4f8; border: 1px solid #d0e8f0; border-radius: 4px; color: #1a1a1a; font-size: 0.9rem; font-weight: 500;">
                        ${skill}
                    </span>
                `).join('')}
            </div>
        </div>
    `;
}

function createExperienceCard(title, company, dates, location, responsibilities, tech) {
    return `
        <div style="padding: 1.5rem; background: #fafafa; border-left: 3px solid #2171d6; border-radius: 8px; margin-bottom: 1.5rem; border: 1px solid #e0e0e0;">
            <h3 style="color: #1a1a1a; font-size: 1.3rem; margin-bottom: 0.5rem; font-weight: 700;">${title}</h3>
            <div style="color: #2171d6; font-weight: 600; margin-bottom: 0.25rem;">${company}</div>
            <div style="color: #666; font-size: 0.9rem; margin-bottom: 1rem;">${dates} • ${location}</div>
            <ul style="color: #1a1a1a; line-height: 1.8; margin-bottom: 1rem; padding-left: 1.5rem;">
                ${responsibilities.map(resp => `<li style="margin-bottom: 0.5rem;">${resp}</li>`).join('')}
            </ul>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${tech.map(t => `
                    <span style="padding: 0.25rem 0.75rem; background: #e8f4f8; border: 1px solid #d0e8f0; border-radius: 4px; color: #2171d6; font-size: 0.85rem; font-weight: 500;">
                        ${t}
                    </span>
                `).join('')}
            </div>
        </div>
    `;
}

function createProjectCard(title, description, tech, link, demoApp) {
    return `
        <div style="padding: 1.5rem; background: #fafafa; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h3 style="color: #1a1a1a; font-size: 1.3rem; margin-bottom: 1rem; font-weight: 700;">${title}</h3>
            <p style="color: #1a1a1a; line-height: 1.6; margin-bottom: 1rem;">${description}</p>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
                ${tech.map(t => `
                    <span style="padding: 0.25rem 0.75rem; background: #e8f4f8; border: 1px solid #d0e8f0; border-radius: 4px; color: #2171d6; font-size: 0.85rem; font-weight: 500;">
                        ${t}
                    </span>
                `).join('')}
            </div>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                ${demoApp ? `
                    <button class="open-demo-btn" data-demo="${demoApp}"
                       style="padding: 0.75rem 1.5rem; background: #2171d6; border: 1px solid #1a5fb8; border-radius: 6px; color: #fff; font-weight: 600; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 0.5rem;">
                        🎬 Watch Demo Video
                    </button>
                ` : ''}
                ${link ? `
                    <a href="${link}" target="_blank" rel="noopener noreferrer" 
                       style="padding: 0.75rem 1.5rem; background: #f0f0f0; border: 1px solid #d0d0d0; border-radius: 6px; color: #2171d6; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem;">
                        📂 View on GitHub
                    </a>
                ` : !demoApp ? `
                    <span style="color: #666; font-size: 0.9rem; padding: 0.75rem;">🔒 Private Repository</span>
                ` : ''}
            </div>
        </div>
    `;
}

function createEnhancedProjectCard(title, description, tech, githubLink, liveDemoLink, screenshot, category) {
    const techLower = tech.map(t => t.toLowerCase()).join(' ');
    const categoryAttr = category || 'all';
    
    return `
        <div class="project-card" data-category="${categoryAttr}" data-tech="${techLower}" style="padding: 0; background: #fafafa; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; transition: all 0.3s ease; cursor: pointer; position: relative;">
            ${screenshot ? `
                <div class="project-preview" style="width: 100%; height: 200px; background: linear-gradient(135deg, #e8f4f8, #f0f8ff); display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    <img src="${screenshot}" alt="${title}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" />
                </div>
            ` : `
                <div class="project-preview" style="width: 100%; height: 200px; background: linear-gradient(135deg, #e8f4f8, #f0f8ff); display: flex; align-items: center; justify-content: center; font-size: 4rem; opacity: 0.6;">
                    ${title.split(' ')[0]}
                </div>
            `}
            <div style="padding: 1.5rem;">
                <h3 style="color: #1a1a1a; font-size: 1.3rem; margin-bottom: 0.75rem; font-weight: 700;">${title}</h3>
                <p style="color: #666; line-height: 1.6; margin-bottom: 1rem; font-size: 0.9rem;">${description}</p>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">
                    ${tech.map(t => `
                        <span class="tech-tag" style="padding: 0.25rem 0.75rem; background: #e8f4f8; border: 1px solid #d0e8f0; border-radius: 4px; color: #2171d6; font-size: 0.85rem; font-weight: 500;">
                            ${t}
                        </span>
                    `).join('')}
                </div>
                <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                    ${liveDemoLink ? `
                        <button class="project-live-demo-btn" data-live-demo="${liveDemoLink}" 
                           style="padding: 0.75rem 1.5rem; background: #4caf50; border: 1px solid #45a049; border-radius: 6px; color: #fff; font-weight: 600; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.9rem;">
                            🌐 View Live
                        </button>
                    ` : ''}
                    ${githubLink ? `
                        <a href="${githubLink}" target="_blank" rel="noopener noreferrer" 
                           style="padding: 0.75rem 1.5rem; background: #2171d6; border: 1px solid #1a5fb8; border-radius: 6px; color: #fff; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.9rem;">
                            📂 View Code
                        </a>
                    ` : `
                        <span style="color: #999; font-size: 0.85rem; padding: 0.75rem; display: inline-flex; align-items: center; gap: 0.5rem;">🔒 Private Repository</span>
                    `}
                    <button class="project-details-btn" data-title="${title}" data-description="${description}" data-tech="${tech.join(', ')}" data-github="${githubLink || ''}" data-live="${liveDemoLink || ''}"
                       style="padding: 0.75rem 1.5rem; background: #f0f0f0; border: 1px solid #d0d0d0; border-radius: 6px; color: #1a1a1a; font-weight: 600; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.9rem;">
                        ℹ️ Details
                    </button>
                </div>
            </div>
        </div>
    `;
}

function createCertCard(title, issuer, date, description, link) {
    const isPDF = link && link.endsWith('.pdf');
    return `
        <div style="padding: 1.5rem; background: #fafafa; border: 1px solid #e0e0e0; border-left: 3px solid #2171d6; border-radius: 8px;">
            <h3 style="color: #1a1a1a; margin-bottom: 0.5rem; font-weight: 700;">${title}</h3>
            <p style="color: #666; margin-bottom: 1rem; font-size: 0.9rem;">${issuer} • ${date}</p>
            <p style="color: #1a1a1a; line-height: 1.6; margin-bottom: 1rem;">${description}</p>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                ${link ? `
                    <button class="view-cert-btn" data-cert="${link}" data-title="${title}" data-type="${isPDF ? 'pdf' : 'image'}"
                            style="padding: 0.75rem 1.5rem; background: #2171d6; color: #fff; border: 1px solid #1a5fb8; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s;">
                        👁️ View Certificate
                    </button>
                    <a href="${link}" download 
                       style="padding: 0.75rem 1.5rem; background: #4caf50; color: #fff; border: 1px solid #45a049; border-radius: 6px; text-decoration: none; font-weight: 600;">
                        📥 Download
                    </a>
                ` : ''}
            </div>
        </div>
    `;
}

function createModuleBadge(name) {
    return `
        <div style="padding: 0.5rem; background: rgba(124, 58, 237, 0.2); border-radius: 6px; text-align: center; font-size: 0.85rem; color: #e2e8f0;">
            ✓ ${name}
        </div>
    `;
}

function createCertModuleBadge(name, certPath) {
    return `
        <button class="view-cert-btn" data-cert="${certPath}" data-title="${name}" data-type="image"
                style="padding: 0.75rem 1rem; background: #fafafa; border: 1px solid #e0e0e0; border-radius: 6px; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; gap: 0.5rem; align-items: center; text-align: center; color: #1a1a1a;">
            <span style="font-size: 1.5rem;">🔐</span>
            <span style="font-size: 0.85rem; font-weight: 600; color: #1a1a1a;">${name}</span>
            <span style="font-size: 0.75rem; color: #666;">Click to view</span>
        </button>
    `;
}

function createContactItem(icon, label, value, link) {
    const content = link 
        ? `<a href="${link}" target="_blank" rel="noopener noreferrer" style="color: var(--windows-blue); text-decoration: none; transition: color 0.2s ease;" onmouseover="this.style.color='var(--windows-hover)'" onmouseout="this.style.color='var(--windows-blue)'">${value}</a>`
        : value;
    
    return `
        <div style="padding: 1.5rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 8px; display: flex; align-items: center; gap: 1rem; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); transition: all 0.2s ease;" onmouseover="this.style.borderColor='var(--windows-blue)'" onmouseout="this.style.borderColor='var(--glass-border)'">
            <div style="font-size: 2rem;">${icon}</div>
            <div style="flex: 1;">
                <div style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 0.25rem;">${label}</div>
                <div style="color: var(--text-primary); font-size: 1rem; word-break: break-word; font-weight: 500;">${content}</div>
            </div>
        </div>
    `;
}

function createAIFeatureCard(title, description, features, tech) {
    return `
        <div style="padding: 1.5rem; background: linear-gradient(135deg, #fafafa, #f5f5f5); border: 1px solid #e0e0e0; border-left: 4px solid #2171d6; border-radius: 8px;">
            <h3 style="color: #1a1a1a; font-size: 1.3rem; margin-bottom: 0.5rem; font-weight: 700;">${title}</h3>
            <p style="color: #666; margin-bottom: 1rem; line-height: 1.6;">${description}</p>
            <div style="margin-bottom: 1rem;">
                <h4 style="color: #2171d6; font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem;">Key Features:</h4>
                <ul style="color: #1a1a1a; line-height: 1.8; padding-left: 1.5rem; margin-bottom: 1rem;">
                    ${features.map(feature => `<li style="margin-bottom: 0.25rem; font-size: 0.9rem;">${feature}</li>`).join('')}
                </ul>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${tech.map(t => `
                    <span style="padding: 0.25rem 0.75rem; background: #e8f4f8; border: 1px solid #d0e8f0; border-radius: 4px; color: #2171d6; font-size: 0.85rem; font-weight: 500;">
                        ${t}
                    </span>
                `).join('')}
            </div>
        </div>
    `;
}

function createTestimonialCard(name, role, company, rating, text, source, sourceLink, avatar = null) {
    const stars = '⭐'.repeat(rating);
    const sourceIcon = source === 'LinkedIn' ? '💼' : source === 'Upwork' ? '🎯' : '⭐';
    
    return `
        <div class="testimonial-card" style="padding: 2rem; background: linear-gradient(135deg, #ffffff, #f8f9fa); border: 1px solid #e0e0e0; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); min-height: 280px; display: flex; flex-direction: column;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                ${avatar ? `<img src="${avatar}" alt="${name}" loading="lazy" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid #2171d6;">` : `<div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #2171d6, #1a5fb8); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: bold;">${name.charAt(0)}</div>`}
                <div style="flex: 1;">
                    <h3 style="color: #1a1a1a; font-size: 1.1rem; margin-bottom: 0.25rem; font-weight: 700;">${name}</h3>
                    <p style="color: #666; font-size: 0.9rem; margin-bottom: 0.25rem;">${role}</p>
                    <p style="color: #999; font-size: 0.85rem;">${company}</p>
                </div>
            </div>
            <div style="margin-bottom: 1rem; font-size: 1.2rem; color: #ffa500;">${stars}</div>
            <p style="color: #1a1a1a; line-height: 1.8; font-size: 0.95rem; flex: 1; font-style: italic; margin-bottom: 1rem;">"${text}"</p>
            ${sourceLink ? `
                <div style="margin-top: auto; padding-top: 1rem; border-top: 1px solid #e0e0e0;">
                    <a href="${sourceLink}" target="_blank" rel="noopener noreferrer" 
                       style="display: inline-flex; align-items: center; gap: 0.5rem; color: #2171d6; text-decoration: none; font-size: 0.85rem; font-weight: 600;">
                        ${sourceIcon} View on ${source}
                    </a>
                </div>
            ` : ''}
        </div>
    `;
}

// ===========================
// Pipeline Flowchart Component
// ===========================
function createPipelineFlowchart() {
    return `
        <div style="display: flex; flex-direction: column; gap: 1rem; position: relative;">
            <!-- Step 1: Document Input -->
            <div class="pipeline-step" data-step="1" style="padding: 1rem; background: #e8f4f8; border: 2px solid #2171d6; border-radius: 8px; text-align: center; transition: all 0.3s ease;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">📄</div>
                <div style="font-weight: 600; color: #2171d6; margin-bottom: 0.25rem;">Document Input</div>
                <div style="font-size: 0.85rem; color: #666;">PDF/Image Upload</div>
            </div>
            
            <!-- Arrow -->
            <div style="text-align: center; color: #2171d6; font-size: 1.5rem;">↓</div>
            
            <!-- Step 2: Preprocessing -->
            <div class="pipeline-step" data-step="2" style="padding: 1rem; background: #f0f0f0; border: 2px solid #ccc; border-radius: 8px; text-align: center; transition: all 0.3s ease;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔧</div>
                <div style="font-weight: 600; color: #666; margin-bottom: 0.25rem;">Preprocessing</div>
                <div style="font-size: 0.85rem; color: #999;">Denoising, Thresholding, Deskewing</div>
            </div>
            
            <!-- Arrow -->
            <div style="text-align: center; color: #2171d6; font-size: 1.5rem;">↓</div>
            
            <!-- Step 3: Extraction -->
            <div class="pipeline-step" data-step="3" style="padding: 1rem; background: #f0f0f0; border: 2px solid #ccc; border-radius: 8px; text-align: center; transition: all 0.3s ease;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔍</div>
                <div style="font-weight: 600; color: #666; margin-bottom: 0.25rem;">Text Extraction</div>
                <div style="font-size: 0.85rem; color: #999;">Native PDF → OCR Fallback</div>
            </div>
            
            <!-- Arrow -->
            <div style="text-align: center; color: #2171d6; font-size: 1.5rem;">↓</div>
            
            <!-- Step 4: Validation -->
            <div class="pipeline-step" data-step="4" style="padding: 1rem; background: #f0f0f0; border: 2px solid #ccc; border-radius: 8px; text-align: center; transition: all 0.3s ease;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">✅</div>
                <div style="font-weight: 600; color: #666; margin-bottom: 0.25rem;">Validation</div>
                <div style="font-size: 0.85rem; color: #999;">Structure & Data Integrity Check</div>
            </div>
            
            <!-- Arrow -->
            <div style="text-align: center; color: #2171d6; font-size: 1.5rem;">↓</div>
            
            <!-- Step 5: Output -->
            <div class="pipeline-step" data-step="5" style="padding: 1rem; background: #f0f0f0; border: 2px solid #ccc; border-radius: 8px; text-align: center; transition: all 0.3s ease;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">📊</div>
                <div style="font-weight: 600; color: #666; margin-bottom: 0.25rem;">Structured Output</div>
                <div style="font-size: 0.85rem; color: #999;">JSON/CSV Export</div>
            </div>
        </div>
    `;
}

// ===========================
// Helper Functions
// ===========================

// Make apps globally available
if (typeof window !== 'undefined') {
    window.apps = apps;
}

