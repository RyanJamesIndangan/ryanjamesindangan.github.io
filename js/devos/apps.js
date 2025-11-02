// ===========================
// Application Content
// ===========================

const apps = {
    about: {
        title: 'About Me',
        icon: '👨‍💻',
        content: `
            <div style="max-width: 700px;">
                <h1 style="font-size: 2.5rem; margin-bottom: 1rem; background: linear-gradient(135deg, #64ffda, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                    Ryan James Indangan
                </h1>
                <p style="font-size: 1.2rem; color: #5eb3ff; margin-bottom: 2rem;">
                    Full-Stack Web Developer & Certified CTO
                </p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                    <div style="padding: 1rem; background: rgba(51, 153, 255, 0.15); border-radius: 8px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: #5eb3ff;"><span id="yearsExp">7</span>+</div>
                        <div style="font-size: 0.9rem; color: #c2d0e8;">Years Experience</div>
                    </div>
                    <div style="padding: 1rem; background: rgba(51, 153, 255, 0.15); border-radius: 8px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: #5eb3ff;">50+</div>
                        <div style="font-size: 0.9rem; color: #c2d0e8;">Projects Delivered</div>
                    </div>
                    <div style="padding: 1rem; background: rgba(255, 185, 0, 0.15); border-radius: 8px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: #ffb900;">12</div>
                        <div style="font-size: 0.9rem; color: #c2d0e8;">Team Members Led</div>
                    </div>
                </div>

                <p style="line-height: 1.8; margin-bottom: 1rem; color: #e2e8f0;">
                    I'm a versatile <strong style="color: #5eb3ff;">Full-Stack Web Developer</strong> with deep expertise in the LAMP stack, 
                    PHP frameworks (CodeIgniter, Laravel), and modern frontend libraries including React, Vue, and Angular.
                </p>
                
                <p style="line-height: 1.8; margin-bottom: 1rem; color: #e2e8f0;">
                    With over <strong><span id="yearsExp2">7</span> years</strong> of experience, I've led senior development teams, built scalable applications, 
                    and leveraged AWS for cloud infrastructure. My approach combines strong technical hands-on expertise 
                    with strategic thinking to deliver results in Agile environments.
                </p>
                
                <p style="line-height: 1.8; margin-bottom: 1rem; color: #e2e8f0;">
                    I specialize in <strong style="color: #5eb3ff;">AI-integrated development</strong>, applying cutting-edge AI tools 
                    to improve efficiency, enhance quality assurance, and scale solutions while maintaining code 
                    quality and best practices.
                </p>

                <div style="margin-top: 2rem; padding: 1.5rem; background: rgba(100, 255, 218, 0.05); border-left: 3px solid #64ffda; border-radius: 8px;">
                    <h3 style="color: #5eb3ff; margin-bottom: 1rem;">🏆 Recent Achievement</h3>
                    <p style="color: #e2e8f0; line-height: 1.6;">
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
                <h2 style="font-size: 2rem; margin-bottom: 2rem; color: #5eb3ff;">Tech Stack & Expertise</h2>
                
                <div style="display: grid; gap: 1.5rem;">
                    ${createSkillCategory('💻 Frontend', ['React', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'jQuery'])}
                    
                    ${createSkillCategory('⚙️ Backend', ['PHP', 'CodeIgniter', 'Laravel', 'Node.js', 'Express', 'Python', 'Django', 'Java', 'Spring Boot', 'Socket.io'])}
                    
                    ${createSkillCategory('🗄️ Database', ['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase', 'REST APIs', 'GraphQL', 'WebSockets'])}
                    
                    ${createSkillCategory('🔐 Cybersecurity', ['Penetration Testing', 'Vulnerability Assessment', 'Network Security', 'Database Security', 'WiFi Security', 'Android Security', 'XSS Prevention', 'Password Security', 'Network Spying', 'Security Best Practices'])}
                    
                    ${createSkillCategory('☁️ Cloud & DevOps', ['AWS (EC2, RDS, Lambda, S3)', 'Docker', 'Kubernetes', 'DigitalOcean', 'Jenkins', 'GitHub Actions', 'CI/CD'])}
                    
                    ${createSkillCategory('🛠️ Tools & Automation', ['Git', 'GitHub / GitLab', 'N8N', 'Cursor AI', 'v0 by Vercel', 'Postman', 'Docker Compose', 'Selenium', 'Cypress'])}
                    
                    ${createSkillCategory('📊 Project Management', ['Jira', 'Confluence', 'Asana', 'Monday.com', 'ClickUp', 'Slack', 'MS Teams', 'Agile / Scrum'])}
                </div>
            </div>
        `
    },

    experience: {
        title: 'Work Experience',
        icon: '💼',
        content: `
            <div style="max-width: 800px;">
                <h2 style="font-size: 2rem; margin-bottom: 2rem; color: #5eb3ff;">Professional Journey</h2>
                
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
            <div style="max-width: 900px;">
                <h2 style="font-size: 2rem; margin-bottom: 2rem; color: #5eb3ff;">Showcase</h2>
                
                <div style="display: grid; gap: 2rem;">
                    ${createProjectCard(
                        '💳 Crypto Checkout Simulator',
                        'Full-stack cryptocurrency payment processing simulation with real-time exchange rates and transaction tracking.',
                        ['React', 'Node.js', 'Express', 'MongoDB', 'WebSocket'],
                        'https://github.com/ryanjamesindangan/crypto-checkout-simulator',
                        'crypto-demo'
                    )}
                    
                    ${createProjectCard(
                        '📦 Supplier Order Management',
                        'Enterprise-grade order management system with inventory tracking, automated workflows, and comprehensive reporting.',
                        ['Laravel', 'Vue.js', 'MySQL', 'Docker', 'AWS'],
                        'https://github.com/ryanjamesindangan/supplier-order-management-rjfi',
                        'supplier-demo'
                    )}
                    
                    ${createProjectCard(
                        '🏢 GlobalX Digital Platform',
                        'Complete platform redesign with enhanced database architecture, serving 10,000+ users with real-time features.',
                        ['Laravel', 'React', 'PostgreSQL', 'Redis', 'AWS'],
                        null,
                        null
                    )}
                    
                    ${createProjectCard(
                        '🤖 N8N Automation Hub',
                        'Custom N8N workflows automating CI/CD processes, testing, and deployment across multiple environments.',
                        ['N8N', 'Docker', 'GitHub Actions', 'AWS Lambda', 'Node.js'],
                        null,
                        null
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
                <h2 style="font-size: 2rem; margin-bottom: 2rem; color: #5eb3ff;">Professional Credentials</h2>
                
                <div style="display: grid; gap: 1.5rem;">
                    ${createCertCard(
                        '👨‍💼 Certified Chief Technology Officer',
                        'TechSherpas',
                        'Issued Jul 2023',
                        'Comprehensive CTO certification covering technology leadership, strategic planning, team management, and enterprise architecture.',
                        'assets/certificates/cto-certificate.pdf'
                    )}
                    
                    <div style="padding: 2rem; background: rgba(124, 58, 237, 0.1); border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 12px;">
                        <h3 style="color: #5eb3ff; margin-bottom: 1rem;">🔐 Hacker-X Ethical Hacking Course</h3>
                        <p style="color: #94a3b8; margin-bottom: 1.5rem;">Hacker-X • Completed 2025</p>
                        <p style="color: #e2e8f0; line-height: 1.6; margin-bottom: 1.5rem;">
                            Comprehensive cybersecurity training covering penetration testing, vulnerability assessment, network security, and ethical hacking practices.
                        </p>
                        
                        ${createCertCard(
                            '🏆 Hacker-X Final Certificate',
                            'Hacker-X',
                            'Completed 2024',
                            'Comprehensive completion certificate for the complete Hacker-X ethical hacking course series.',
                            'assets/certificates/Hacker-X/hacker-x-final-certificate.jpg'
                        )}
                        
                        <h4 style="color: #5eb3ff; margin-top: 2rem; margin-bottom: 1rem; font-size: 1.1rem;">Course Modules (21 Modules)</h4>
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
            <div style="max-width: 600px;">
                <h2 style="font-size: 2rem; margin-bottom: 1rem; color: #5eb3ff;">Let's Connect</h2>
                <p style="color: #94a3b8; margin-bottom: 3rem; font-size: 1.1rem;">
                    Looking for a skilled developer? Let's discuss your project!
                </p>
                
                <div style="display: grid; gap: 1.5rem;">
                    ${createContactItem('📧', 'Email', 'ryanjamesfranciscoindangan@yahoo.com', 'mailto:ryanjamesfranciscoindangan@yahoo.com')}
                    ${createContactItem('📱', 'Phone', '+63 999 333 9030', 'tel:+639993339030')}
                    ${createContactItem('📍', 'Location', 'Caloocan City, Metro Manila, Philippines', null)}
                    ${createContactItem('💼', 'LinkedIn', 'ryan-james-indangan', 'https://www.linkedin.com/in/ryan-james-indangan-63b271164/')}
                    ${createContactItem('👨‍💻', 'GitHub', 'ryanjamesindangan', 'https://github.com/ryanjamesindangan')}
                    ${createContactItem('🎯', 'Upwork', 'Top Rated Developer', 'https://www.upwork.com/freelancers/~01d452f9125d3dcdf1')}
                    ${createContactItem('👥', 'Facebook', '@0RyanSimper0', 'https://www.facebook.com/0RyanSimper0/')}
                </div>

                <div style="margin-top: 3rem; padding: 2rem; background: rgba(100, 255, 218, 0.1); border-radius: 12px; text-align: center;">
                    <h3 style="color: #5eb3ff; margin-bottom: 1rem;">🌟 Social Proof</h3>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1.5rem;">
                        <div>
                            <div style="font-size: 1.5rem; color: #5eb3ff; font-weight: bold;">Top Rated</div>
                            <div style="font-size: 0.85rem; color: #94a3b8;">on Upwork</div>
                        </div>
                        <div>
                            <div style="font-size: 1.5rem; color: #5eb3ff; font-weight: bold;">758+</div>
                            <div style="font-size: 0.85rem; color: #94a3b8;">LinkedIn Connections</div>
                        </div>
                        <div>
                            <div style="font-size: 1.5rem; color: #f59e0b; font-weight: bold;">Certified</div>
                            <div style="font-size: 0.85rem; color: #94a3b8;">CTO</div>
                        </div>
                    </div>
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

    resume: {
        title: 'Resume / CV',
        icon: '📄',
        content: `
            <div style="max-width: 700px; text-align: center;">
                <h2 style="font-size: 2rem; margin-bottom: 1rem; color: #5eb3ff;">Resume / CV</h2>
                <p style="color: #94a3b8; margin-bottom: 2rem;">
                    Download my complete resume in your preferred format
                </p>
                
                <div style="display: grid; gap: 1rem; margin-bottom: 2rem;">
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <button class="view-cert-btn" data-cert="assets/resume.pdf" data-title="Resume - Ryan James Indangan" data-type="pdf"
                                style="flex: 1; min-width: 200px; padding: 1.5rem; background: linear-gradient(135deg, #7c3aed, #64ffda); border: none; border-radius: 12px; color: #fff; cursor: pointer; font-size: 1.1rem; font-weight: 600; transition: all 0.2s;">
                            👁️ Preview Resume
                        </button>
                        <a href="assets/resume.pdf" download="Ryan-James-Indangan-Resume.pdf"
                           style="flex: 1; min-width: 200px; padding: 1.5rem; background: rgba(100, 255, 218, 0.1); border: 2px solid #64ffda; border-radius: 12px; color: #5eb3ff; cursor: pointer; font-size: 1.1rem; font-weight: 600; transition: all 0.2s; text-decoration: none; text-align: center; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                            📥 Download PDF Resume
                        </a>
                    </div>
                    <button onclick="window.open('https://www.linkedin.com/in/ryan-james-indangan-63b271164/', '_blank')"
                            style="padding: 1.5rem; background: rgba(124, 58, 237, 0.1); border: 2px solid #7c3aed; border-radius: 12px; color: #5eb3ff; cursor: pointer; font-size: 1.1rem; transition: all 0.2s;">
                        💼 View LinkedIn Profile
                    </button>
                </div>

                <div style="padding: 2rem; background: rgba(255, 255, 255, 0.05); border-radius: 12px; text-align: left;">
                    <h3 style="color: #5eb3ff; margin-bottom: 1rem;">Quick Stats</h3>
                    <div style="color: #e2e8f0; line-height: 2;">
                        <div>📅 <strong>Experience:</strong> <span id="yearsExp3">7</span>+ years</div>
                        <div>🎓 <strong>Education:</strong> BS Computer Science</div>
                        <div>🏆 <strong>Certification:</strong> Certified CTO</div>
                        <div>💼 <strong>Role:</strong> Full-Stack Developer & CTO</div>
                        <div>🌍 <strong>Location:</strong> Metro Manila, Philippines</div>
                        <div>✉️ <strong>Email:</strong> ryanjamesfranciscoindangan@yahoo.com</div>
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
    }
};

// Helper functions to create UI components
function createSkillCategory(title, skills) {
    return `
        <div style="padding: 1.5rem; background: rgba(255, 255, 255, 0.05); border-radius: 12px;">
            <h3 style="color: #5eb3ff; margin-bottom: 1rem;">${title}</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${skills.map(skill => `
                    <span style="padding: 0.5rem 1rem; background: rgba(100, 255, 218, 0.1); border: 1px solid rgba(100, 255, 218, 0.3); border-radius: 6px; color: #e2e8f0; font-size: 0.9rem;">
                        ${skill}
                    </span>
                `).join('')}
            </div>
        </div>
    `;
}

function createExperienceCard(title, company, dates, location, responsibilities, tech) {
    return `
        <div style="padding: 2rem; background: rgba(255, 255, 255, 0.05); border-left: 3px solid #64ffda; border-radius: 12px; margin-bottom: 1.5rem;">
            <h3 style="color: #5eb3ff; font-size: 1.3rem; margin-bottom: 0.5rem;">${title}</h3>
            <div style="color: #5eb3ff; font-weight: 600; margin-bottom: 0.25rem;">${company}</div>
            <div style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 1rem;">${dates} • ${location}</div>
            <ul style="color: #e2e8f0; line-height: 1.8; margin-bottom: 1rem; padding-left: 1.5rem;">
                ${responsibilities.map(resp => `<li style="margin-bottom: 0.5rem;">${resp}</li>`).join('')}
            </ul>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${tech.map(t => `
                    <span style="padding: 0.25rem 0.75rem; background: rgba(124, 58, 237, 0.2); border-radius: 4px; color: #5eb3ff; font-size: 0.85rem;">
                        ${t}
                    </span>
                `).join('')}
            </div>
        </div>
    `;
}

function createProjectCard(title, description, tech, link, demoApp) {
    return `
        <div style="padding: 2rem; background: rgba(255, 255, 255, 0.05); border-radius: 12px;">
            <h3 style="color: #5eb3ff; font-size: 1.3rem; margin-bottom: 1rem;">${title}</h3>
            <p style="color: #e2e8f0; line-height: 1.6; margin-bottom: 1rem;">${description}</p>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
                ${tech.map(t => `
                    <span style="padding: 0.25rem 0.75rem; background: rgba(100, 255, 218, 0.1); border: 1px solid rgba(100, 255, 218, 0.3); border-radius: 4px; color: #5eb3ff; font-size: 0.85rem;">
                        ${t}
                    </span>
                `).join('')}
            </div>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                ${demoApp ? `
                    <button class="open-demo-btn" data-demo="${demoApp}"
                       style="padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #7c3aed, #64ffda); border: none; border-radius: 8px; color: #fff; font-weight: 600; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 0.5rem;">
                        🎬 Watch Demo Video
                    </button>
                ` : ''}
                ${link ? `
                    <a href="${link}" target="_blank" rel="noopener noreferrer" 
                       style="padding: 0.75rem 1.5rem; background: rgba(124, 58, 237, 0.2); border: 1px solid #3399ff; border-radius: 8px; color: #5eb3ff; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem;">
                        📂 View on GitHub
                    </a>
                ` : !demoApp ? `
                    <span style="color: #94a3b8; font-size: 0.9rem; padding: 0.75rem;">🔒 Private Repository</span>
                ` : ''}
            </div>
        </div>
    `;
}

function createCertCard(title, issuer, date, description, link) {
    const isPDF = link && link.endsWith('.pdf');
    return `
        <div style="padding: 2rem; background: rgba(100, 255, 218, 0.1); border: 1px solid rgba(100, 255, 218, 0.3); border-radius: 12px;">
            <h3 style="color: #5eb3ff; margin-bottom: 0.5rem;">${title}</h3>
            <p style="color: #94a3b8; margin-bottom: 1rem;">${issuer} • ${date}</p>
            <p style="color: #e2e8f0; line-height: 1.6; margin-bottom: 1rem;">${description}</p>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                ${link ? `
                    <button class="view-cert-btn" data-cert="${link}" data-title="${title}" data-type="${isPDF ? 'pdf' : 'image'}"
                            style="padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #7c3aed, #64ffda); color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s;">
                        👁️ View Certificate
                    </button>
                    <a href="${link}" download 
                       style="padding: 0.75rem 1.5rem; background: rgba(100, 255, 218, 0.2); border: 1px solid #64ffda; border-radius: 6px; color: #5eb3ff; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem;">
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
                style="padding: 0.75rem 1rem; background: rgba(124, 58, 237, 0.3); border: 1px solid rgba(124, 58, 237, 0.5); border-radius: 8px; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; gap: 0.5rem; align-items: center; text-align: center; color: #e2e8f0;">
            <span style="font-size: 1.5rem;">🔐</span>
            <span style="font-size: 0.85rem; font-weight: 600;">${name}</span>
            <span style="font-size: 0.75rem; color: #94a3b8;">Click to view</span>
        </button>
    `;
}

function createContactItem(icon, label, value, link) {
    const content = link 
        ? `<a href="${link}" target="_blank" rel="noopener noreferrer" style="color: #5eb3ff; text-decoration: none;">${value}</a>`
        : value;
    
    return `
        <div style="padding: 1.5rem; background: rgba(255, 255, 255, 0.05); border-radius: 12px; display: flex; align-items: center; gap: 1rem;">
            <div style="font-size: 2rem;">${icon}</div>
            <div style="flex: 1;">
                <div style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 0.25rem;">${label}</div>
                <div style="color: #e2e8f0; font-size: 1rem; word-break: break-word;">${content}</div>
            </div>
        </div>
    `;
}

