// ===========================
// Wallpaper Selector
// ===========================

class WallpaperSelector {
    constructor() {
        this.wallpapers = [
            { name: 'Default', url: 'assets/background.jpg', gradient: 'linear-gradient(135deg, rgba(13, 17, 23, 0.4) 0%, rgba(26, 29, 41, 0.3) 50%, rgba(13, 17, 23, 0.4) 100%)' },
            { name: 'Blue Theme', url: null, gradient: 'linear-gradient(135deg, rgba(30, 58, 138, 0.6) 0%, rgba(59, 130, 246, 0.4) 50%, rgba(30, 58, 138, 0.6) 100%)' },
            { name: 'Purple Theme', url: null, gradient: 'linear-gradient(135deg, rgba(88, 28, 135, 0.6) 0%, rgba(147, 51, 234, 0.4) 50%, rgba(88, 28, 135, 0.6) 100%)' },
            { name: 'AI Theme', url: null, gradient: 'linear-gradient(135deg, rgba(20, 30, 48, 0.7) 0%, rgba(30, 41, 59, 0.5) 50%, rgba(15, 23, 42, 0.7) 100%)' }
        ];
        this.currentWallpaper = localStorage.getItem('selectedWallpaper') || '0';
        this.init();
    }

    init() {
        this.applyWallpaper(parseInt(this.currentWallpaper));
        this.addWallpaperSelector();
    }

    applyWallpaper(index) {
        const wallpaper = document.getElementById('wallpaper');
        if (!wallpaper) return;

        const selected = this.wallpapers[index];
        if (selected.url) {
            wallpaper.style.background = `${selected.gradient}, url('${selected.url}') center center / cover no-repeat`;
        } else {
            wallpaper.style.background = selected.gradient;
        }
        
        localStorage.setItem('selectedWallpaper', index.toString());
        this.currentWallpaper = index.toString();
    }

    addWallpaperSelector() {
        // Add to context menu or system tray
        // For now, add to desktop context menu via right-click
        // This will be triggered from the context menu
    }

    showWallpaperMenu() {
        const menu = document.createElement('div');
        menu.className = 'wallpaper-menu';
        menu.innerHTML = `
            <div class="wallpaper-menu-header">
                <h3>Select Wallpaper</h3>
                <button class="wallpaper-menu-close" onclick="this.closest('.wallpaper-menu').remove()">×</button>
            </div>
            <div class="wallpaper-menu-content">
                ${this.wallpapers.map((wp, index) => `
                    <button class="wallpaper-option ${parseInt(this.currentWallpaper) === index ? 'active' : ''}" 
                            onclick="window.wallpaperSelector.applyWallpaper(${index}); this.closest('.wallpaper-menu').remove();">
                        <div class="wallpaper-preview" style="background: ${wp.gradient || wp.url ? `url('${wp.url}')` : wp.gradient};"></div>
                        <span class="wallpaper-name">${wp.name}</span>
                    </button>
                `).join('')}
            </div>
        `;
        
        document.body.appendChild(menu);
        
        // Position menu
        const rect = document.querySelector('.desktop').getBoundingClientRect();
        menu.style.left = `${rect.width / 2 - 200}px`;
        menu.style.top = `${rect.height / 2 - 150}px`;
        
        // Animate in
        setTimeout(() => menu.classList.add('active'), 10);
    }
}

// Initialize wallpaper selector
document.addEventListener('DOMContentLoaded', () => {
    window.wallpaperSelector = new WallpaperSelector();
});

