/**
 * Portfolio Configuration
 * Central configuration file for all constants and settings
 * @module config
 */

const CONFIG = {
    // Personal Information
    personal: {
        name: 'Ryan James Indangan',
        title: 'Full-Stack Developer & CTO',
        initials: 'RJ',
        email: 'ryanjamesfranciscoindangan@yahoo.com',
        phone: '+63 999 333 9030',
        location: 'Caloocan City, Metro Manila, Philippines'
    },

    // Career Information
    career: {
        startYear: 2018,
        startMonth: 3, // March
        company: 'GlobalX Digital Corporation'
    },

    // Social Links
    social: {
        github: 'https://github.com/ryanjamesindangan',
        linkedin: 'https://www.linkedin.com/in/ryan-james-indangan-63b271164/',
        facebook: 'https://www.facebook.com/0RyanSimper0/',
        upwork: 'https://www.upwork.com/freelancers/~01d452f9125d3dcdf1'
    },

    // Project Links
    projects: {
        cryptoSimulator: {
            github: 'https://github.com/ryanjamesindangan/crypto-checkout-simulator',
            video: 'https://youtu.be/yK9YYBwnw3M'
        },
        supplierManagement: {
            github: 'https://github.com/ryanjamesindangan/supplier-order-management-rjfi',
            video: 'https://youtu.be/hEIBbsilfEI'
        },
        portfolio: 'https://github.com/ryanjamesindangan/ryanjamesindangan.github.io'
    },

    // UI Settings
    ui: {
        bootDelay: 2500, // Boot screen duration in ms
        autoOpenDelay: 3000, // Delay before auto-opening apps
        windowAnimationDelay: 300, // Delay between cascading windows
        notificationDuration: 3000, // Notification display duration
        taskbarHeight: 60,
        windowHeaderHeight: 40,
        desktopIconWidth: 90,
        windowGap: 10
    },

    // Window Layout
    layout: {
        defaultWidth: 800,
        defaultHeight: 600,
        minWidth: 400,
        minHeight: 300,
        autoOpenApps: [
            { id: 'about', position: 'top-left' },
            { id: 'skills', position: 'top-right' },
            { id: 'projects', position: 'bottom-left' },
            { id: 'contact', position: 'bottom-right' }
        ]
    },

    // Theme Colors (from CSS variables)
    theme: {
        primary: '#64ffda',
        secondary: '#7c3aed',
        accent: '#f59e0b'
    },

    // Feature Flags
    features: {
        autoOpenApps: true,
        draggableIcons: true,
        keyboardShortcuts: true,
        contextMenu: true,
        notifications: true
    },

    // Assets Paths
    assets: {
        profilePhoto: 'assets/profile-photo.jpg',
        certificates: {
            cto: 'assets/certificates/cto-certificate.pdf',
            ethicalHacking: {
                database: 'assets/certificates/database-hacking.jpg',
                website: 'assets/certificates/bringing-down-a-website.jpg',
                passwords: 'assets/certificates/hacking-passwords.jpg',
                dataSafe: 'assets/certificates/make-your-data-safe.jpg'
            }
        }
    },

    // Application Metadata
    app: {
        name: 'Interactive Portfolio',
        version: '2.0.0',
        description: 'A unique OS-style portfolio experience',
        author: 'Ryan James Indangan'
    }
};

// Freeze config to prevent modifications
Object.freeze(CONFIG);
Object.freeze(CONFIG.personal);
Object.freeze(CONFIG.career);
Object.freeze(CONFIG.social);
Object.freeze(CONFIG.projects);
Object.freeze(CONFIG.ui);
Object.freeze(CONFIG.layout);
Object.freeze(CONFIG.theme);
Object.freeze(CONFIG.features);
Object.freeze(CONFIG.assets);
Object.freeze(CONFIG.app);

