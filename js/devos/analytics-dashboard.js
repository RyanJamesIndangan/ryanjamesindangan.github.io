// ===========================
// Analytics Dashboard Renderer
// ===========================

function renderAnalyticsDashboard() {
    const dashboard = document.getElementById('analyticsDashboard');
    if (!dashboard || !window.portfolioAnalytics) return;
    
    const summary = window.portfolioAnalytics.getSummary();
    
    dashboard.innerHTML = `
        <!-- Overview Stats -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <div style="padding: 1.5rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 8px; text-align: center; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">
                <div style="font-size: 2rem; color: var(--windows-blue); font-weight: bold;">${summary.pageViews}</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">Page Views</div>
            </div>
            <div style="padding: 1.5rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 8px; text-align: center; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">
                <div style="font-size: 2rem; color: var(--windows-blue); font-weight: bold;">${summary.uniqueVisits}</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">Unique Visits</div>
            </div>
            <div style="padding: 1.5rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 8px; text-align: center; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">
                <div style="font-size: 2rem; color: var(--accent); font-weight: bold;">${summary.timeOnSite}</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">Time on Site</div>
            </div>
            <div style="padding: 1.5rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 8px; text-align: center; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">
                <div style="font-size: 2rem; color: var(--success); font-weight: bold;">${summary.chatbotMessages}</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">Chatbot Messages</div>
            </div>
        </div>
        
        <!-- Visit Info -->
        <div style="padding: 1.5rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 8px; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); margin-bottom: 1.5rem;">
            <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-weight: 600;">📅 Visit Information</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                <div>
                    <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.25rem;">First Visit</div>
                    <div style="color: var(--text-primary); font-weight: 500;">${summary.firstVisit}</div>
                </div>
                <div>
                    <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Last Visit</div>
                    <div style="color: var(--text-primary); font-weight: 500;">${summary.lastVisit}</div>
                </div>
            </div>
        </div>
        
        <!-- Top Apps -->
        <div style="padding: 1.5rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 8px; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); margin-bottom: 1.5rem;">
            <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-weight: 600;">📱 Most Opened Apps</h3>
            ${summary.topApps.length > 0 ? `
                <div style="display: grid; gap: 0.75rem;">
                    ${summary.topApps.map((app, index) => {
                        const appNames = {
                            'about': 'About Me',
                            'skills': 'Technical Skills',
                            'experience': 'Work Experience',
                            'projects': 'Projects',
                            'certifications': 'Certifications',
                            'contact': 'Contact',
                            'ai-lab': 'AI Lab',
                            'blog': 'Blog',
                            'github-stats': 'GitHub Stats',
                            'testimonials': 'Testimonials'
                        };
                        const appName = appNames[app.appId] || app.appId;
                        const maxCount = summary.topApps[0].count;
                        const percentage = (app.count / maxCount) * 100;
                        
                        return `
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <div style="flex: 1;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                                        <span style="color: var(--text-primary); font-weight: 500;">${appName}</span>
                                        <span style="color: var(--text-secondary); font-size: 0.9rem;">${app.count} ${app.count === 1 ? 'time' : 'times'}</span>
                                    </div>
                                    <div style="height: 6px; background: var(--bg-tertiary); border-radius: 3px; overflow: hidden;">
                                        <div style="height: 100%; background: var(--windows-blue); width: ${percentage}%; transition: width 0.3s ease;"></div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            ` : '<p style="color: var(--text-secondary);">No app opens tracked yet.</p>'}
        </div>
        
        <!-- Top Sections -->
        <div style="padding: 1.5rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 8px; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">
            <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-weight: 600;">👁️ Most Viewed Sections</h3>
            ${summary.topSections.length > 0 ? `
                <div style="display: grid; gap: 0.75rem;">
                    ${summary.topSections.map((section, index) => {
                        const sectionNames = {
                            'about': 'About Me',
                            'skills': 'Technical Skills',
                            'experience': 'Work Experience',
                            'projects': 'Projects',
                            'certifications': 'Certifications',
                            'contact': 'Contact',
                            'ai-lab': 'AI Lab',
                            'blog': 'Blog',
                            'github-stats': 'GitHub Stats',
                            'testimonials': 'Testimonials'
                        };
                        const sectionName = sectionNames[section.section] || section.section;
                        const maxCount = summary.topSections[0].count;
                        const percentage = (section.count / maxCount) * 100;
                        
                        return `
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <div style="flex: 1;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                                        <span style="color: var(--text-primary); font-weight: 500;">${sectionName}</span>
                                        <span style="color: var(--text-secondary); font-size: 0.9rem;">${section.count} ${section.count === 1 ? 'view' : 'views'}</span>
                                    </div>
                                    <div style="height: 6px; background: var(--bg-tertiary); border-radius: 3px; overflow: hidden;">
                                        <div style="height: 100%; background: var(--accent); width: ${percentage}%; transition: width 0.3s ease;"></div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            ` : '<p style="color: var(--text-secondary);">No section views tracked yet.</p>'}
        </div>
    `;
}

// Initialize when analytics app is opened
document.addEventListener('appOpened', (e) => {
    if (e.detail && e.detail.appId === 'analytics') {
        setTimeout(renderAnalyticsDashboard, 100);
    }
});

// Also try to render on page load if analytics app is already open
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            const analyticsWindow = document.querySelector('.window[data-app-id="analytics"]');
            if (analyticsWindow && !analyticsWindow.classList.contains('minimized')) {
                renderAnalyticsDashboard();
            }
        }, 1000);
    });
} else {
    setTimeout(() => {
        const analyticsWindow = document.querySelector('.window[data-app-id="analytics"]');
        if (analyticsWindow && !analyticsWindow.classList.contains('minimized')) {
            renderAnalyticsDashboard();
        }
    }, 1000);
}

