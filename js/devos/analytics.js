// ===========================
// Privacy-Friendly Analytics
// ===========================

class PortfolioAnalytics {
    constructor() {
        this.storageKey = 'portfolioAnalytics';
        this.data = this.loadData();
        this.init();
    }
    
    init() {
        // Track page view
        this.trackPageView();
        
        // Track app opens
        this.trackAppOpens();
        
        // Track section views
        this.trackSectionViews();
        
        // Track time on site
        this.trackTimeOnSite();
        
        // Track chatbot interactions
        this.trackChatbotInteractions();
    }
    
    loadData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('Failed to load analytics data:', e);
        }
        
        // Initialize default structure
        return {
            pageViews: 0,
            uniqueVisits: 0,
            appOpens: {},
            sectionViews: {},
            timeOnSite: 0,
            chatbotMessages: 0,
            firstVisit: new Date().toISOString(),
            lastVisit: new Date().toISOString(),
            visitHistory: []
        };
    }
    
    saveData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (e) {
            console.error('Failed to save analytics data:', e);
        }
    }
    
    trackPageView() {
        // Check if this is a new session (no sessionStorage flag)
        const sessionKey = 'analyticsSession';
        const hasSession = sessionStorage.getItem(sessionKey);
        
        if (!hasSession) {
            this.data.pageViews++;
            this.data.uniqueVisits++;
            sessionStorage.setItem(sessionKey, 'true');
            
            // Add to visit history (keep last 30 visits)
            this.data.visitHistory.push({
                timestamp: new Date().toISOString(),
                referrer: document.referrer || 'direct',
                userAgent: navigator.userAgent.substring(0, 100) // Truncate for privacy
            });
            
            if (this.data.visitHistory.length > 30) {
                this.data.visitHistory.shift();
            }
        }
        
        this.data.lastVisit = new Date().toISOString();
        this.saveData();
    }
    
    trackAppOpens() {
        // Listen for app open events
        document.addEventListener('appOpened', (e) => {
            if (e.detail && e.detail.appId) {
                const appId = e.detail.appId;
                this.data.appOpens[appId] = (this.data.appOpens[appId] || 0) + 1;
                this.saveData();
            }
        });
    }
    
    trackSectionViews() {
        // Track when windows are opened (sections viewed)
        const observer = new MutationObserver(() => {
            const windows = document.querySelectorAll('.window:not(.minimized)');
            windows.forEach(window => {
                const appId = window.dataset.appId;
                if (appId) {
                    this.data.sectionViews[appId] = (this.data.sectionViews[appId] || 0) + 1;
                }
            });
        });
        
        // Observe window container
        const windowContainer = document.querySelector('.windows-container');
        if (windowContainer) {
            observer.observe(windowContainer, {
                childList: true,
                attributes: true,
                attributeFilter: ['class']
            });
        }
    }
    
    trackTimeOnSite() {
        // Track time spent on site
        const startTime = Date.now();
        
        // Update every 30 seconds
        setInterval(() => {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            this.data.timeOnSite = timeSpent;
            this.saveData();
        }, 30000);
        
        // Save on page unload
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            this.data.timeOnSite += timeSpent;
            this.saveData();
        });
    }
    
    trackChatbotInteractions() {
        // Track chatbot messages
        const originalSend = window.sendChatMessage;
        if (originalSend) {
            window.sendChatMessage = (...args) => {
                this.data.chatbotMessages++;
                this.saveData();
                return originalSend.apply(this, args);
            };
        }
    }
    
    // Get analytics summary
    getSummary() {
        const topApps = Object.entries(this.data.appOpens)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([appId, count]) => ({ appId, count }));
        
        const topSections = Object.entries(this.data.sectionViews)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([section, count]) => ({ section, count }));
        
        return {
            pageViews: this.data.pageViews,
            uniqueVisits: this.data.uniqueVisits,
            timeOnSite: this.formatTime(this.data.timeOnSite),
            chatbotMessages: this.data.chatbotMessages,
            topApps,
            topSections,
            firstVisit: new Date(this.data.firstVisit).toLocaleDateString(),
            lastVisit: new Date(this.data.lastVisit).toLocaleDateString()
        };
    }
    
    formatTime(seconds) {
        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    }
    
    // Reset analytics (for privacy)
    reset() {
        this.data = {
            pageViews: 0,
            uniqueVisits: 0,
            appOpens: {},
            sectionViews: {},
            timeOnSite: 0,
            chatbotMessages: 0,
            firstVisit: new Date().toISOString(),
            lastVisit: new Date().toISOString(),
            visitHistory: []
        };
        this.saveData();
    }
}

// Initialize analytics
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.portfolioAnalytics = new PortfolioAnalytics();
    });
} else {
    window.portfolioAnalytics = new PortfolioAnalytics();
}

