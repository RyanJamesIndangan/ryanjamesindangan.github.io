// ===========================
// Clippy Asset Manager
// Handles GIF loading, caching, and preloading
// ===========================

class ClippyAssetManager {
    constructor() {
        this.cache = new Map(); // GIF cache: path -> Image element
        this.loading = new Map(); // Currently loading: path -> Promise
        this.preloaded = new Set(); // Preloaded paths
        this.maxCacheSize = 10;
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.cleanupInterval = null;
    }
    
    /**
     * Load a GIF asset
     * @param {string} path - Path to the GIF
     * @returns {Promise<HTMLImageElement>}
     */
    async loadGIF(path) {
        // Check cache first
        if (this.cache.has(path)) {
            const cached = this.cache.get(path);
            // Reset timeout
            cached._lastUsed = Date.now();
            return cached;
        }
        
        // Check if already loading
        if (this.loading.has(path)) {
            return this.loading.get(path);
        }
        
        // Start loading
        const loadPromise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                img._lastUsed = Date.now();
                this.cache.set(path, img);
                this.loading.delete(path);
                resolve(img);
            };
            img.onerror = () => {
                this.loading.delete(path);
                reject(new Error(`Failed to load GIF: ${path}`));
            };
            img.src = path;
        });
        
        this.loading.set(path, loadPromise);
        return loadPromise;
    }
    
    /**
     * Preload idle GIFs (low priority)
     */
    async preloadIdleGIFs() {
        // Get list of idle GIFs from directory structure
        // We'll discover them dynamically or use a known list
        const idleGIFs = [
            'assets/clippy/idle/clippy-animation-when-idle-have-a-coffee-in-his-hand.gif',
            'assets/clippy/idle/clippy-animation-when-idle-saying-are-you-there.gif',
            'assets/clippy/idle/clippy-animation-when-idle-clicking-laptop-fast.gif',
            'assets/clippy/idle/clippy-animation-when-idle-driking-beer.gif',
            'assets/clippy/idle/clippy-animation-when-idle-removing-glass-a-bit-to-look-at-user.gif',
            'assets/clippy/idle/clippy-animation-when-idle-saying-im-here.gif',
            'assets/clippy/idle/clippy-animation-when-idle-shaking-around.gif',
            'assets/clippy/idle/clippy-animation-when-idle-sleepy-in-front-of-laptop.gif',
            'assets/clippy/idle/clippy-animation-when-idle-smelling-mug-of-coffee.gif',
            'assets/clippy/idle/clippy-animation-when-idle-stuck-in-traffic.gif',
            'assets/clippy/idle/clippy-animation-when-idle-talking-to-flask.gif',
            'assets/clippy/idle/clippy-animation-when-idle-with-sun-and-have-sun-glasses.gif'
        ];
        
        // Preload with low priority (using requestIdleCallback if available)
        const preload = (path) => {
            if (this.preloaded.has(path)) return;
            this.preloadGIF(path, { priority: 'low' });
        };
        
        if (window.requestIdleCallback) {
            idleGIFs.forEach(path => {
                requestIdleCallback(() => preload(path), { timeout: 5000 });
            });
        } else {
            // Fallback: delay preloading
            setTimeout(() => {
                idleGIFs.forEach(path => preload(path));
            }, 2000);
        }
    }
    
    /**
     * Preload a specific GIF
     * @param {string} path - Path to GIF
     * @param {Object} options - Preload options
     */
    async preloadGIF(path, options = {}) {
        if (this.preloaded.has(path) || this.cache.has(path)) {
            return;
        }
        
        try {
            await this.loadGIF(path);
            this.preloaded.add(path);
        } catch (error) {
            console.warn(`Failed to preload GIF: ${path}`, error);
        }
    }
    
    /**
     * Get deterministic GIF path for an event
     * @param {string} event - Event name
     * @returns {string|null} - GIF path or null
     */
    getDeterministicGIF(event) {
        const eventMap = {
            // Chat events
            'chat-opens': 'assets/clippy/deterministic/clippy-animation-saying-hello-there.gif',
            'message-sent': 'assets/clippy/deterministic/clippy-animation-saying-ok.gif',
            'assistant-response': 'assets/clippy/deterministic/clippy-animation-saying-looks-great.gif',
            'typing-starts': 'assets/clippy/deterministic/clippy-animation-showing-suspicion.gif',
            'typing-ends': 'assets/clippy/deterministic/clippy-animation-saying-ok.gif',
            
            // App events
            'app-open-ai-lab': 'assets/clippy/deterministic/clippy-animation-showing-charts.gif',
            'app-open-projects': 'assets/clippy/deterministic/clippy-animation-eyes-going-big-in-admiration.gif',
            'app-open-terminal': 'assets/clippy/deterministic/clippy-animation-saying-ok.gif',
            
            // System events
            'shutdown': 'assets/clippy/deterministic/clippy-animation-saying-brb.gif',
            'sleep': 'assets/clippy/deterministic/clippy-animation-sleepy-in-front-of-laptop.gif',
            'lock': 'assets/clippy/deterministic/clippy-animation-out-of-office.gif',
            
            // Status events
            'success': 'assets/clippy/deterministic/clippy-animation-saying-nice.gif',
            'error': 'assets/clippy/deterministic/clippy-animation-feeling-down.gif',
            'warning': 'assets/clippy/deterministic/clippy-animation-getting-surprised.gif',
            'info': 'assets/clippy/deterministic/clippy-animation-saying-yeah.gif',
            
            // Special events
            'idle-long': 'assets/clippy/deterministic/clippy-animation-saying-are-you-there.gif',
            'money': 'assets/clippy/deterministic/clippy-animation-having-a-lot-of-money-around-him.gif',
            'stocks-down': 'assets/clippy/deterministic/clippy-animation-stocks-going-down.gif',
            'wounded': 'assets/clippy/deterministic/clippy-animation-have-bandages-wounded.gif',
            'puke': 'assets/clippy/deterministic/clippy-animation-going-to-puke.gif',
            'blush': 'assets/clippy/deterministic/clippy-animation-blushing-with-heart-eyes.gif',
            'thank-you': 'assets/clippy/deterministic/clippy-animation-saying-thank-you.gif',
            'no-probs': 'assets/clippy/deterministic/clippy-animation-saying-no-probs.gif',
            'ship-it': 'assets/clippy/deterministic/clippy-animation-saying-ship-it.gif',
            'what': 'assets/clippy/deterministic/clippy-animation-saying-what.gif'
        };
        
        return eventMap[event] || null;
    }
    
    /**
     * Get random idle GIF path
     * @returns {string|null} - GIF path or null
     */
    getRandomIdleGIF() {
        const idleGIFs = [
            'assets/clippy/idle/clippy-animation-when-idle-have-a-coffee-in-his-hand.gif',
            'assets/clippy/idle/clippy-animation-when-idle-saying-are-you-there.gif',
            'assets/clippy/idle/clippy-animation-when-idle-clicking-laptop-fast.gif',
            'assets/clippy/idle/clippy-animation-when-idle-driking-beer.gif',
            'assets/clippy/idle/clippy-animation-when-idle-removing-glass-a-bit-to-look-at-user.gif',
            'assets/clippy/idle/clippy-animation-when-idle-saying-im-here.gif',
            'assets/clippy/idle/clippy-animation-when-idle-shaking-around.gif',
            'assets/clippy/idle/clippy-animation-when-idle-sleepy-in-front-of-laptop.gif',
            'assets/clippy/idle/clippy-animation-when-idle-smelling-mug-of-coffee.gif',
            'assets/clippy/idle/clippy-animation-when-idle-stuck-in-traffic.gif',
            'assets/clippy/idle/clippy-animation-when-idle-talking-to-flask.gif',
            'assets/clippy/idle/clippy-animation-when-idle-with-sun-and-have-sun-glasses.gif'
        ];
        
        if (idleGIFs.length === 0) return null;
        return idleGIFs[Math.floor(Math.random() * idleGIFs.length)];
    }
    
    /**
     * Clean up old cache entries
     */
    cleanupCache() {
        if (this.cache.size <= this.maxCacheSize) return;
        
        // Sort by last used time
        const entries = Array.from(this.cache.entries())
            .map(([path, img]) => ({ path, img, lastUsed: img._lastUsed || 0 }))
            .sort((a, b) => a.lastUsed - b.lastUsed);
        
        // Remove oldest entries
        const toRemove = this.cache.size - this.maxCacheSize;
        for (let i = 0; i < toRemove; i++) {
            this.cache.delete(entries[i].path);
        }
    }
    
    /**
     * Start periodic cache cleanup
     */
    startCleanup() {
        if (this.cleanupInterval) return;
        
        this.cleanupInterval = setInterval(() => {
            this.cleanupCache();
        }, 60000); // Every minute
    }
    
    /**
     * Stop cleanup
     */
    stopCleanup() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }
}

// Create singleton instance
const clippyAssetManager = new ClippyAssetManager();
clippyAssetManager.startCleanup();

// Preload idle GIFs after a delay (low priority)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => clippyAssetManager.preloadIdleGIFs(), 2000);
    });
} else {
    setTimeout(() => clippyAssetManager.preloadIdleGIFs(), 2000);
}

// Export for global access
window.clippyAssetManager = clippyAssetManager;

