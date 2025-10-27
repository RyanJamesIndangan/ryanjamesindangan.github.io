/**
 * Utility Helper Functions
 * Reusable utility functions for the portfolio
 * @module utils/helpers
 */

/**
 * Calculate years of experience from start date
 * @returns {number} Years of experience
 */
function calculateExperience() {
    const startYear = CONFIG.career.startYear;
    const currentYear = new Date().getFullYear();
    return currentYear - startYear;
}

/**
 * Format date to readable string
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
}

/**
 * Format time to readable string
 * @param {Date} date - Date object
 * @returns {string} Formatted time string
 */
function formatTime(date) {
    return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
}

/**
 * Debounce function to limit execution rate
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if device is mobile
 * @returns {boolean} True if mobile device
 */
function isMobile() {
    return window.innerWidth <= 768;
}

/**
 * Generate unique ID
 * @returns {string} Unique ID string
 */
function generateId() {
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sanitize HTML string
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Wait for specified time
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after wait time
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get viewport dimensions
 * @returns {Object} Width and height of viewport
 */
function getViewportSize() {
    return {
        width: window.innerWidth,
        height: window.innerHeight
    };
}

/**
 * Clamp number between min and max
 * @param {number} num - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped number
 */
function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is visible
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Smoothly scroll to element
 * @param {HTMLElement|string} target - Element or selector to scroll to
 */
function scrollToElement(target) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise} Promise that resolves when copied
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
}

