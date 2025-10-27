// ===========================
// Error Handler - Suppress external extension errors
// ===========================
window.addEventListener('error', (e) => {
    // Suppress errors from browser extensions and ad blockers
    if (e.message && (
        e.message.includes('extension') || 
        e.message.includes('chrome-extension') ||
        e.message.includes('moz-extension') ||
        e.message.includes('ERR_BLOCKED_BY_CLIENT')
    )) {
        e.preventDefault();
        return true;
    }
});

window.addEventListener('unhandledrejection', (e) => {
    // Suppress promise rejections from extensions
    if (e.reason && e.reason.message && (
        e.reason.message.includes('extension') ||
        e.reason.message.includes('message channel closed')
    )) {
        e.preventDefault();
        return true;
    }
});

// ===========================
// Particle Background Animation
// ===========================
class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.particleCount = 80;
        this.init();
    }

    init() {
        try {
            for (let i = 0; i < this.particleCount; i++) {
                this.createParticle();
            }
            this.animate();
        } catch (error) {
            console.log('Particle system initialization failed:', error);
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 3 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = Math.random() > 0.5 ? '#64ffda' : '#7c3aed';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        
        const data = {
            element: particle,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: parseFloat(particle.style.width)
        };
        
        particle.style.left = data.x + 'px';
        particle.style.top = data.y + 'px';
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        
        this.particles.push(data);
        this.container.appendChild(particle);
    }

    animate() {
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
            if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;
            
            p.element.style.left = p.x + 'px';
            p.element.style.top = p.y + 'px';
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particles
try {
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        new ParticleSystem(particlesContainer);
    }
} catch (error) {
    console.log('Particle system failed to initialize:', error);
}

// ===========================
// Typing Animation
// ===========================
const typingElement = document.querySelector('.typing-text');
const titles = [
    'Full-Stack Developer',
    'Technical Lead',
    'Cloud Architect',
    'AI Integration Specialist',
    'Team Leader'
];

let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    const currentTitle = titles[titleIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingElement.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentTitle.length) {
        isDeleting = true;
        typingSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typingSpeed = 500;
    }
    
    setTimeout(typeEffect, typingSpeed);
}

// Start typing effect
setTimeout(typeEffect, 1000);

// ===========================
// Navigation
// ===========================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Scroll effect for navbar
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');

function highlightNav() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.add('active');
        } else {
            document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', highlightNav);

// ===========================
// Smooth Scroll
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===========================
// Scroll Animations
// ===========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements
const fadeElements = document.querySelectorAll('.skill-category, .timeline-item, .project-card, .about-text, .about-image');
fadeElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===========================
// Mouse Movement Effect for Hero
// ===========================
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function updateMouseEffect() {
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;
    
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        const moveX = (targetX - window.innerWidth / 2) * 0.01;
        const moveY = (targetY - window.innerHeight / 2) * 0.01;
        heroContent.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
    
    requestAnimationFrame(updateMouseEffect);
}

updateMouseEffect();

// ===========================
// Skill Tags Hover Effect
// ===========================
const skillTags = document.querySelectorAll('.skill-tag');

skillTags.forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.05)';
    });
    
    tag.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ===========================
// Project Cards Tilt Effect
// ===========================
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===========================
// Experience Timeline Animation
// ===========================
const timelineItems = document.querySelectorAll('.timeline-item');

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateX(-30px)';
            
            setTimeout(() => {
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }, 100);
        }
    });
}, { threshold: 0.2 });

timelineItems.forEach(item => {
    timelineObserver.observe(item);
});

// ===========================
// Contact Section Animations
// ===========================
const contactItems = document.querySelectorAll('.contact-item');

contactItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    
    const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.5 });
    
    contactObserver.observe(item);
});

// ===========================
// Social Links Animation
// ===========================
const socialLinks = document.querySelectorAll('.social-link');

socialLinks.forEach((link, index) => {
    link.style.opacity = '0';
    link.style.transform = 'translateY(20px)';
    
    const socialObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100 + 300);
            }
        });
    }, { threshold: 0.5 });
    
    socialObserver.observe(link);
});

// ===========================
// Cursor Trail Effect - DISABLED
// ===========================
// Removed due to visual issues causing eye strain
// The effect was creating screen flashing when mouse moved

// ===========================
// Performance optimization
// ===========================
// Debounce resize events
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Refresh particle system
        if (particlesContainer) {
            particlesContainer.innerHTML = '';
            new ParticleSystem(particlesContainer);
        }
    }, 250);
});

// ===========================
// Loading Animation
// ===========================
try {
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });
} catch (error) {
    console.log('Loading animation failed:', error);
}

// ===========================
// Certificate Modal
// ===========================
const modal = document.getElementById('certificateModal');
const modalTitle = document.getElementById('modalTitle');
const certificatePreview = document.getElementById('certificatePreview');
const downloadBtn = document.getElementById('downloadBtn');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');

// Function to open modal
function openCertificateModal(certPath, title, type) {
    // Set title
    modalTitle.textContent = title;
    
    // Clear previous content
    certificatePreview.innerHTML = '';
    
    // Add content based on type
    if (type === 'pdf') {
        // For PDF files
        const iframe = document.createElement('iframe');
        iframe.src = certPath;
        iframe.title = title;
        certificatePreview.appendChild(iframe);
    } else {
        // For images
        const img = document.createElement('img');
        img.src = certPath;
        img.alt = title;
        img.loading = 'lazy';
        certificatePreview.appendChild(img);
    }
    
    // Set download button
    const filename = certPath.split('/').pop();
    downloadBtn.href = certPath;
    downloadBtn.download = filename;
    
    // Show modal with animation
    modal.classList.add('active');
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// Function to close modal
function closeCertificateModal() {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.classList.remove('active');
        certificatePreview.innerHTML = '';
    }, 300);
    
    // Re-enable body scroll
    document.body.style.overflow = '';
}

// Add click listeners to all view certificate buttons
document.querySelectorAll('.view-cert-btn').forEach(button => {
    button.addEventListener('click', function() {
        const certPath = this.dataset.cert;
        const title = this.dataset.title;
        const type = this.dataset.type;
        openCertificateModal(certPath, title, type);
    });
});

// Close modal on close button click
modalClose.addEventListener('click', closeCertificateModal);

// Close modal on overlay click
modalOverlay.addEventListener('click', closeCertificateModal);

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeCertificateModal();
    }
});

// ===========================
// Console Message (Easter Egg)
// ===========================
console.log('%c👋 Hello there!', 'font-size: 20px; font-weight: bold; color: #64ffda;');
console.log('%cLooking at the code? I like your style!', 'font-size: 14px; color: #a8b2d1;');
console.log('%cFeel free to reach out: ryanjamesfranciscoindangan@yahoo.com', 'font-size: 12px; color: #8892b0;');
console.log('%c\nBuilt with: HTML5, CSS3, Vanilla JavaScript', 'font-size: 11px; color: #7c3aed;');

