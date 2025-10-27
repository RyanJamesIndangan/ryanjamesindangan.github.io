/**
 * Main Application Bootstrap
 * Enterprise-grade modular portfolio application
 */

import { componentLoader } from './modules/componentLoader.js';
import { config } from './modules/config.js';

// Application state
const app = {
    initialized: false,
    componentsLoaded: false
};

/**
 * Initialize the application
 */
async function init() {
    if (app.initialized) return;
    
    try {
        // Register all components
        config.components.forEach(component => {
            componentLoader.register(component.id, component.path, component.order);
        });

        // Load all components
        await componentLoader.loadAll();
        app.componentsLoaded = true;

        // Initialize features after components are loaded
        await initializeFeatures();
        
        app.initialized = true;
        console.log('%c✓ Application initialized successfully', 'color: #64ffda; font-weight: bold;');
    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
}

/**
 * Initialize application features
 */
async function initializeFeatures() {
    // Wait a bit for DOM to be fully ready
    await new Promise(resolve => setTimeout(resolve, 100));

    // Initialize all features
    initParticles();
    initTypingAnimation();
    initNavigation();
    initScrollAnimations();
    initProjectCardEffects();
    initTimelineAnimations();
    initContactAnimations();
    initLoadingAnimation();
    
    console.log('%c👋 Hello there!', 'font-size: 20px; font-weight: bold; color: #64ffda;');
    console.log('%cLooking at the code? I like your style!', 'font-size: 14px; color: #a8b2d1;');
    console.log('%cFeel free to reach out: ryanjamesfranciscoindangan@yahoo.com', 'font-size: 12px; color: #8892b0;');
}

// Import feature modules
import './modules/particles.js';
import './modules/typing.js';
import './modules/navigation.js';
import './modules/animations.js';

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export app instance for debugging
window.app = app;

