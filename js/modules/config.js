/**
 * Application Configuration
 * Centralized configuration for the portfolio
 */

export const config = {
    // Personal Information
    personal: {
        name: 'Ryan James Indangan',
        fullName: 'Ryan James F. Indangan',
        role: 'Full-Stack Developer',
        location: 'Caloocan City, Metro Manila, Philippines',
        email: 'ryanjamesfranciscoindangan@yahoo.com',
        phone: '+63 999 333 9030',
        availability: true
    },

    // Social Links
    social: {
        upwork: 'https://www.upwork.com/freelancers/~01d452f9125d3dcdf1',
        linkedin: 'https://www.linkedin.com/in/ryanjamesindangan',
        github: 'https://github.com/ryanjamesindangan'
    },

    // Project Links
    projects: {
        cryptoCheckout: 'https://github.com/ryanjamesindangan/crypto-checkout-simulator',
        supplierManagement: 'https://github.com/ryanjamesindangan/supplier-order-management-rjfi'
    },

    // Component Loading Configuration
    components: [
        { id: 'hero-section', path: 'components/hero.html', order: 1 },
        { id: 'about-section', path: 'components/about.html', order: 2 },
        { id: 'skills-section', path: 'components/skills.html', order: 3 },
        { id: 'experience-section', path: 'components/experience.html', order: 4 },
        { id: 'certifications-section', path: 'components/certifications.html', order: 5 },
        { id: 'projects-section', path: 'components/projects.html', order: 6 },
        { id: 'contact-section', path: 'components/contact.html', order: 7 }
    ],

    // Animation Settings
    animations: {
        typingSpeed: 100,
        deleteSpeed: 50,
        pauseDuration: 2000,
        particleCount: 80
    },

    // Typing Animation Titles
    titles: [
        'Full-Stack Developer',
        'Technical Lead',
        'Cloud Architect',
        'AI Integration Specialist',
        'Team Leader'
    ]
};

