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
                <p style="font-size: 1.2rem; color: #64ffda; margin-bottom: 2rem;">
                    Full-Stack Web Developer & Certified CTO
                </p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                    <div style="padding: 1rem; background: rgba(100, 255, 218, 0.1); border-radius: 8px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: #64ffda;"><span id="yearsExp">7</span>+</div>
                        <div style="font-size: 0.9rem; color: #94a3b8;">Years Experience</div>
                    </div>
                    <div style="padding: 1rem; background: rgba(124, 58, 237, 0.1); border-radius: 8px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: #7c3aed;">50+</div>
                        <div style="font-size: 0.9rem; color: #94a3b8;">Projects Delivered</div>
                    </div>
                    <div style="padding: 1rem; background: rgba(245, 158, 11, 0.1); border-radius: 8px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: #f59e0b;">12</div>
                        <div style="font-size: 0.9rem; color: #94a3b8;">Team Members Led</div>
                    </div>
                </div>

                <p style="line-height: 1.8; margin-bottom: 1rem; color: #e2e8f0;">
                    I'm a versatile <strong style="color: #64ffda;">Full-Stack Web Developer</strong> with deep expertise in the LAMP stack, 
                    PHP frameworks (CodeIgniter, Laravel), and modern frontend libraries including React, Vue, and Angular.
                </p>
                
                <p style="line-height: 1.8; margin-bottom: 1rem; color: #e2e8f0;">
                    With over <strong><span id="yearsExp2">7</span> years</strong> of experience, I've led senior development teams, built scalable applications, 
                    and leveraged AWS for cloud infrastructure. My approach combines strong technical hands-on expertise 
                    with strategic thinking to deliver results in Agile environments.
                </p>
                
                <p style="line-height: 1.8; margin-bottom: 1rem; color: #e2e8f0;">
                    I specialize in <strong style="color: #7c3aed;">AI-integrated development</strong>, applying cutting-edge AI tools 
                    to improve efficiency, enhance quality assurance, and scale solutions while maintaining code 
                    quality and best practices.
                </p>

                <div style="margin-top: 2rem; padding: 1.5rem; background: rgba(100, 255, 218, 0.05); border-left: 3px solid #64ffda; border-radius: 8px;">
                    <h3 style="color: #64ffda; margin-bottom: 1rem;">🏆 Recent Achievement</h3>
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
                <h2 style="font-size: 2rem; margin-bottom: 2rem; color: #64ffda;">Tech Stack & Expertise</h2>
                
                <div style="display: grid; gap: 1.5rem;">
                    ${createSkillCategory('💻 Frontend', ['React', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'jQuery'])}
                    
                    ${createSkillCategory('⚙️ Backend', ['PHP', 'CodeIgniter', 'Laravel', 'Node.js', 'Express', 'Python', 'Django', 'Java', 'Spring Boot'])}
                    
                    ${createSkillCategory('🗄️ Database', ['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase', 'REST APIs', 'GraphQL', 'WebSockets'])}
                    
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
                <h2 style="font-size: 2rem; margin-bottom: 2rem; color: #64ffda;">Professional Journey</h2>
                
                ${createExperienceCard(
                    'Senior Full-Stack Developer',
                    'GlobalX Digital Corporation',
                    'Feb 2024 - Present',
                    'Caloocan City, Metro Manila',
                    [
                        'Led complete database architecture redesign for enhanced scalability',
                        'Directed team of 12 developers across 3 specialized teams',
                        'Revived stalled project, delivering Version 2 in 2 months',
                        'Implemented AI-powered automation reducing development time by 40%'
                    ],
                    ['Laravel', 'React', 'AWS', 'Docker', 'MySQL']
                )}
                
                ${createExperienceCard(
                    'Chief Technology Officer',
                    'Payo Digital Corporation',
                    'Apr 2023 - Jan 2024',
                    'Caloocan City, Metro Manila',
                    [
                        'Established comprehensive tech infrastructure from ground up',
                        'Architected scalable systems using AWS and modern frameworks',
                        'Built and mentored development team across multiple projects',
                        'Implemented agile workflows improving delivery speed by 60%'
                    ],
                    ['AWS', 'CodeIgniter', 'Laravel', 'Vue.js', 'MongoDB']
                )}
                
                ${createExperienceCard(
                    'Full-Stack Developer (Top Rated)',
                    'Upwork',
                    'Apr 2021 - Present',
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
                    'Junior Web Developer',
                    'EEZEETEL',
                    'Mar 2018 - Sep 2018',
                    'Manila, Philippines',
                    [
                        'Built and maintained e-commerce platform features',
                        'Collaborated with senior developers on complex projects',
                        'Implemented responsive designs and API integrations',
                        'Gained foundation in professional development practices'
                    ],
                    ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL']
                )}
            </div>
        `
    },

    projects: {
        title: 'Featured Projects',
        icon: '🚀',
        content: `
            <div style="max-width: 900px;">
                <h2 style="font-size: 2rem; margin-bottom: 2rem; color: #64ffda;">Showcase</h2>
                
                <div style="display: grid; gap: 2rem;">
                    ${createProjectCard(
                        '💳 Crypto Checkout Simulator',
                        'Full-stack cryptocurrency payment processing simulation with real-time exchange rates and transaction tracking.',
                        ['React', 'Node.js', 'Express', 'MongoDB', 'WebSocket'],
                        'https://github.com/ryanjamesindangan/crypto-checkout-simulator',
                        'crypto-demo'
                    )}
                    
                    ${createProjectCard(
                        '📦 Supplier Order Management (RJFI)',
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
            <div style="max-width: 700px;">
                <h2 style="font-size: 2rem; margin-bottom: 2rem; color: #64ffda;">Professional Credentials</h2>
                
                <div style="display: grid; gap: 1.5rem;">
                    ${createCertCard(
                        '👨‍💼 Certified Chief Technology Officer',
                        'TechSherpas',
                        'Issued Jul 2023',
                        'Comprehensive CTO certification covering technology leadership, strategic planning, team management, and enterprise architecture.',
                        'assets/certificates/cto-certificate.pdf'
                    )}
                    
                    <div style="padding: 2rem; background: rgba(124, 58, 237, 0.1); border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 12px;">
                        <h3 style="color: #7c3aed; margin-bottom: 1rem;">🔐 Ethical Hacking Course</h3>
                        <p style="color: #94a3b8; margin-bottom: 1.5rem;">Great Learning • Completed 2024</p>
                        <p style="color: #e2e8f0; line-height: 1.6; margin-bottom: 1rem;">
                            Comprehensive security training covering penetration testing, vulnerability assessment, and security best practices.
                        </p>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.5rem;">
                            ${createModuleBadge('Database Hacking')}
                            ${createModuleBadge('Website Security')}
                            ${createModuleBadge('Password Security')}
                            ${createModuleBadge('Data Protection')}
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
                <h2 style="font-size: 2rem; margin-bottom: 1rem; color: #64ffda;">Let's Connect</h2>
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
                    <h3 style="color: #64ffda; margin-bottom: 1rem;">🌟 Social Proof</h3>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1.5rem;">
                        <div>
                            <div style="font-size: 1.5rem; color: #64ffda; font-weight: bold;">Top Rated</div>
                            <div style="font-size: 0.85rem; color: #94a3b8;">on Upwork</div>
                        </div>
                        <div>
                            <div style="font-size: 1.5rem; color: #7c3aed; font-weight: bold;">758+</div>
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
                <div style="color: #64ffda; margin-bottom: 1rem;">
                    DevOS Terminal v2.0.0<br>
                    Type 'help' for available commands
                </div>
                <div id="terminalOutput" style="color: #e2e8f0; margin-bottom: 1rem; max-height: 300px; overflow-y: auto;"></div>
                <div style="display: flex; align-items: center; color: #e2e8f0;">
                    <span style="color: #64ffda;">ryan@devos:~$</span>
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
                <h2 style="font-size: 2rem; margin-bottom: 1rem; color: #64ffda;">Resume / CV</h2>
                <p style="color: #94a3b8; margin-bottom: 2rem;">
                    Download my complete resume in your preferred format
                </p>
                
                <div style="display: grid; gap: 1rem; margin-bottom: 2rem;">
                    <button onclick="alert('Resume PDF will be available soon!')" 
                            style="padding: 1.5rem; background: rgba(100, 255, 218, 0.1); border: 2px solid #64ffda; border-radius: 12px; color: #64ffda; cursor: pointer; font-size: 1.1rem; transition: all 0.2s;">
                        📥 Download PDF Resume
                    </button>
                    <button onclick="window.open('https://www.linkedin.com/in/ryan-james-indangan-63b271164/', '_blank')"
                            style="padding: 1.5rem; background: rgba(124, 58, 237, 0.1); border: 2px solid #7c3aed; border-radius: 12px; color: #7c3aed; cursor: pointer; font-size: 1.1rem; transition: all 0.2s;">
                        💼 View LinkedIn Profile
                    </button>
                </div>

                <div style="padding: 2rem; background: rgba(255, 255, 255, 0.05); border-radius: 12px; text-align: left;">
                    <h3 style="color: #64ffda; margin-bottom: 1rem;">Quick Stats</h3>
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
                            <h3 style="color: #64ffda; margin: 0; font-size: 1.2rem;">Crypto Checkout Simulator</h3>
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
                       style="padding: 0.5rem 1rem; background: rgba(100, 255, 218, 0.2); border: 1px solid #64ffda; border-radius: 6px; color: #64ffda; text-decoration: none; font-size: 0.9rem;">
                        🔗 Open in YouTube
                    </a>
                    <a href="https://github.com/ryanjamesindangan/crypto-checkout-simulator" target="_blank" rel="noopener noreferrer"
                       style="padding: 0.5rem 1rem; background: rgba(124, 58, 237, 0.2); border: 1px solid #7c3aed; border-radius: 6px; color: #7c3aed; text-decoration: none; font-size: 0.9rem;">
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
                            <h3 style="color: #64ffda; margin: 0; font-size: 1.2rem;">Supplier Order Management System</h3>
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
                       style="padding: 0.5rem 1rem; background: rgba(100, 255, 218, 0.2); border: 1px solid #64ffda; border-radius: 6px; color: #64ffda; text-decoration: none; font-size: 0.9rem;">
                        🔗 Open in YouTube
                    </a>
                    <a href="https://github.com/ryanjamesindangan/supplier-order-management-rjfi" target="_blank" rel="noopener noreferrer"
                       style="padding: 0.5rem 1rem; background: rgba(124, 58, 237, 0.2); border: 1px solid #7c3aed; border-radius: 6px; color: #7c3aed; text-decoration: none; font-size: 0.9rem;">
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
            <h3 style="color: #64ffda; margin-bottom: 1rem;">${title}</h3>
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
            <h3 style="color: #64ffda; font-size: 1.3rem; margin-bottom: 0.5rem;">${title}</h3>
            <div style="color: #7c3aed; font-weight: 600; margin-bottom: 0.25rem;">${company}</div>
            <div style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 1rem;">${dates} • ${location}</div>
            <ul style="color: #e2e8f0; line-height: 1.8; margin-bottom: 1rem; padding-left: 1.5rem;">
                ${responsibilities.map(resp => `<li style="margin-bottom: 0.5rem;">${resp}</li>`).join('')}
            </ul>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${tech.map(t => `
                    <span style="padding: 0.25rem 0.75rem; background: rgba(124, 58, 237, 0.2); border-radius: 4px; color: #7c3aed; font-size: 0.85rem;">
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
            <h3 style="color: #64ffda; font-size: 1.3rem; margin-bottom: 1rem;">${title}</h3>
            <p style="color: #e2e8f0; line-height: 1.6; margin-bottom: 1rem;">${description}</p>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
                ${tech.map(t => `
                    <span style="padding: 0.25rem 0.75rem; background: rgba(100, 255, 218, 0.1); border: 1px solid rgba(100, 255, 218, 0.3); border-radius: 4px; color: #64ffda; font-size: 0.85rem;">
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
                       style="padding: 0.75rem 1.5rem; background: rgba(124, 58, 237, 0.2); border: 1px solid #7c3aed; border-radius: 8px; color: #7c3aed; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem;">
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
    return `
        <div style="padding: 2rem; background: rgba(100, 255, 218, 0.1); border: 1px solid rgba(100, 255, 218, 0.3); border-radius: 12px;">
            <h3 style="color: #64ffda; margin-bottom: 0.5rem;">${title}</h3>
            <p style="color: #94a3b8; margin-bottom: 1rem;">${issuer} • ${date}</p>
            <p style="color: #e2e8f0; line-height: 1.6; margin-bottom: 1rem;">${description}</p>
            ${link ? `
                <button onclick="window.open('${link}', '_blank')" 
                        style="padding: 0.75rem 1.5rem; background: #64ffda; color: #0a0e27; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                    📜 View Certificate
                </button>
            ` : ''}
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

function createContactItem(icon, label, value, link) {
    const content = link 
        ? `<a href="${link}" target="_blank" rel="noopener noreferrer" style="color: #64ffda; text-decoration: none;">${value}</a>`
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

