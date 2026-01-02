// ===========================
// Wallpaper Selector
// ===========================

class WallpaperSelector {
    constructor() {
        this.wallpapers = [
            { name: 'Default', url: 'assets/background.jpg', gradient: 'linear-gradient(135deg, rgba(13, 17, 23, 0.4) 0%, rgba(26, 29, 41, 0.3) 50%, rgba(13, 17, 23, 0.4) 100%)' },
            { name: 'Windows XP Classic', url: 'assets/themes/windows-xp-classic-landscape-4089x2726-10769.jpg', gradient: 'linear-gradient(135deg, rgba(13, 17, 23, 0.2) 0%, rgba(26, 29, 41, 0.1) 50%, rgba(13, 17, 23, 0.2) 100%)' },
            { name: 'Windows 7 Official', url: 'assets/themes/windows-7-official-3840x2160-13944.jpg', gradient: 'linear-gradient(135deg, rgba(13, 17, 23, 0.2) 0%, rgba(26, 29, 41, 0.1) 50%, rgba(13, 17, 23, 0.2) 100%)' },
            { name: 'Windows Server 2003', url: 'assets/themes/microsoft-windows-server-2003-2880x1800-17236.png', gradient: 'linear-gradient(135deg, rgba(13, 17, 23, 0.2) 0%, rgba(26, 29, 41, 0.1) 50%, rgba(13, 17, 23, 0.2) 100%)' },
            { name: 'Windows 10 Blue', url: 'assets/themes/windows-10-microsoft-windows-blue-2560x1918-1554.jpg', gradient: 'linear-gradient(135deg, rgba(13, 17, 23, 0.2) 0%, rgba(26, 29, 41, 0.1) 50%, rgba(13, 17, 23, 0.2) 100%)' },
            { name: 'Windows 11 Blue', url: 'assets/themes/windows-11-blue-aesthetic-5120x2880-17495.png', gradient: 'linear-gradient(135deg, rgba(13, 17, 23, 0.2) 0%, rgba(26, 29, 41, 0.1) 50%, rgba(13, 17, 23, 0.2) 100%)' },
            { name: 'Blue Theme', url: null, gradient: 'linear-gradient(135deg, rgba(30, 58, 138, 0.6) 0%, rgba(59, 130, 246, 0.4) 50%, rgba(30, 58, 138, 0.6) 100%)' },
            { name: 'Purple Theme', url: null, gradient: 'linear-gradient(135deg, rgba(88, 28, 135, 0.6) 0%, rgba(147, 51, 234, 0.4) 50%, rgba(88, 28, 135, 0.6) 100%)' },
            { name: 'AI Theme', url: null, gradient: 'linear-gradient(135deg, rgba(20, 30, 48, 0.7) 0%, rgba(30, 41, 59, 0.5) 50%, rgba(15, 23, 42, 0.7) 100%)' }
        ];
        
        // Get saved wallpaper index, validate it, and default to 0 if invalid
        const savedIndex = localStorage.getItem('selectedWallpaper');
        const parsedIndex = savedIndex !== null ? parseInt(savedIndex, 10) : 0;
        this.currentWallpaper = (parsedIndex >= 0 && parsedIndex < this.wallpapers.length) ? parsedIndex : 0;
        
        // Save the validated index back to localStorage
        localStorage.setItem('selectedWallpaper', this.currentWallpaper.toString());
        
        this.init();
    }

    init() {
        // Wait for wallpaper element to be available
        this.waitForWallpaperElement().then(() => {
            this.applyWallpaper(this.currentWallpaper);
        });
        this.addWallpaperSelector();
    }

    waitForWallpaperElement() {
        return new Promise((resolve) => {
            const checkElement = () => {
                const wallpaper = document.getElementById('wallpaper');
                if (wallpaper) {
                    resolve();
                } else {
                    // Retry after a short delay
                    setTimeout(checkElement, 50);
                }
            };
            checkElement();
        });
    }

    applyWallpaper(index) {
        // Validate index
        if (index < 0 || index >= this.wallpapers.length) {
            console.warn(`Invalid wallpaper index: ${index}. Using default.`);
            index = 0;
        }

        const wallpaper = document.getElementById('wallpaper');
        if (!wallpaper) {
            console.warn('Wallpaper element not found. Retrying...');
            // Retry after a short delay
            setTimeout(() => this.applyWallpaper(index), 100);
            return;
        }

        const selected = this.wallpapers[index];
        if (!selected) {
            console.warn(`Wallpaper at index ${index} not found. Using default.`);
            index = 0;
            const defaultWallpaper = this.wallpapers[0];
            if (defaultWallpaper.url) {
                wallpaper.style.setProperty('background', `${defaultWallpaper.gradient}, url('${defaultWallpaper.url}') center center / cover no-repeat`, 'important');
            } else {
                wallpaper.style.setProperty('background', defaultWallpaper.gradient, 'important');
            }
            localStorage.setItem('selectedWallpaper', '0');
            this.currentWallpaper = 0;
            return;
        }

        // Apply wallpaper with !important to override CSS defaults
        if (selected.url) {
            // Preload image to ensure it's ready
            const img = new Image();
            img.onload = () => {
                // Use setProperty with !important to ensure it overrides CSS
                wallpaper.style.setProperty('background', `${selected.gradient}, url('${selected.url}') center center / cover no-repeat`, 'important');
                wallpaper.style.setProperty('transition', 'background 0.5s ease-in-out', 'important');
            };
            img.onerror = () => {
                console.warn(`Failed to load wallpaper image: ${selected.url}. Using gradient only.`);
                wallpaper.style.setProperty('background', selected.gradient, 'important');
                wallpaper.style.setProperty('transition', 'background 0.5s ease-in-out', 'important');
            };
            img.src = selected.url;
        } else {
            wallpaper.style.setProperty('background', selected.gradient, 'important');
            wallpaper.style.setProperty('transition', 'background 0.5s ease-in-out', 'important');
        }
        
        // Save to localStorage
        localStorage.setItem('selectedWallpaper', index.toString());
        this.currentWallpaper = index;
        
        // Update active state in menu if it's open
        this.updateMenuActiveState();
    }

    updateMenuActiveState() {
        const menu = document.querySelector('.wallpaper-menu');
        if (menu) {
            const options = menu.querySelectorAll('.wallpaper-option');
            options.forEach((option, index) => {
                if (index === this.currentWallpaper) {
                    option.classList.add('active');
                } else {
                    option.classList.remove('active');
                }
            });
        }
    }

    addWallpaperSelector() {
        // Add to context menu or system tray
        // For now, add to desktop context menu via right-click
        // This will be triggered from the context menu
    }

    showWallpaperMenu() {
        // Remove existing menu if any
        const existingMenu = document.querySelector('.wallpaper-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
        
        const menu = document.createElement('div');
        menu.className = 'wallpaper-menu';
        menu.innerHTML = `
            <div class="wallpaper-menu-header">
                <h3>Select Wallpaper</h3>
                <button class="wallpaper-menu-close" onclick="this.closest('.wallpaper-menu').remove()">×</button>
            </div>
            <div class="wallpaper-menu-content">
                ${this.wallpapers.map((wp, index) => {
                    // Build background style for preview
                    let previewStyle = '';
                    if (wp.url) {
                        previewStyle = `background: ${wp.gradient}, url('${wp.url}') center center / cover no-repeat;`;
                    } else {
                        previewStyle = `background: ${wp.gradient};`;
                    }
                    
                    return `
                        <button class="wallpaper-option ${this.currentWallpaper === index ? 'active' : ''}" 
                                onclick="window.wallpaperSelector.applyWallpaper(${index}); this.closest('.wallpaper-menu').remove();"
                                title="${wp.name}">
                            <div class="wallpaper-preview" style="${previewStyle}"></div>
                            <span class="wallpaper-name">${wp.name}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        `;
        
        document.body.appendChild(menu);
        
        // Position menu in center of viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const menuWidth = 450;
        const menuHeight = menu.offsetHeight || 400;
        menu.style.left = `${(viewportWidth - menuWidth) / 2}px`;
        menu.style.top = `${(viewportHeight - menuHeight) / 2}px`;
        
        // Close on outside click
        const closeOnOutsideClick = (e) => {
            if (!menu.contains(e.target) && !e.target.closest('.wallpaper-menu')) {
                menu.remove();
                document.removeEventListener('click', closeOnOutsideClick);
            }
        };
        setTimeout(() => {
            document.addEventListener('click', closeOnOutsideClick);
        }, 100);
        
        // Close on Escape key
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                menu.remove();
                document.removeEventListener('keydown', closeOnEscape);
            }
        };
        document.addEventListener('keydown', closeOnEscape);
        
        // Animate in
        setTimeout(() => menu.classList.add('active'), 10);
    }
}

// Initialize wallpaper selector
// Wait for DOM to be ready and ensure wallpaper element exists
function initializeWallpaperSelector() {
    // Check if wallpaper element exists
    const wallpaper = document.getElementById('wallpaper');
    if (wallpaper) {
        window.wallpaperSelector = new WallpaperSelector();
    } else {
        // Retry if element doesn't exist yet
        setTimeout(initializeWallpaperSelector, 100);
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait a bit more to ensure all elements are ready (especially after boot screen)
        setTimeout(initializeWallpaperSelector, 100);
    });
} else {
    // DOM already loaded
    setTimeout(initializeWallpaperSelector, 100);
}

// Also re-apply wallpaper after boot screen finishes (in case it was reset)
document.addEventListener('bootComplete', () => {
    if (window.wallpaperSelector) {
        const savedIndex = localStorage.getItem('selectedWallpaper');
        if (savedIndex !== null) {
            const index = parseInt(savedIndex, 10);
            if (!isNaN(index) && index >= 0 && index < window.wallpaperSelector.wallpapers.length) {
                window.wallpaperSelector.applyWallpaper(index);
            }
        }
    } else {
        // If wallpaper selector wasn't initialized yet, initialize it now
        setTimeout(initializeWallpaperSelector, 100);
    }
});

// Re-apply wallpaper when page becomes visible (handles tab switching, etc.)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.wallpaperSelector) {
        // Re-apply saved wallpaper when page becomes visible
        const savedIndex = localStorage.getItem('selectedWallpaper');
        if (savedIndex !== null) {
            const index = parseInt(savedIndex, 10);
            if (!isNaN(index) && index >= 0 && window.wallpaperSelector.wallpapers[index]) {
                window.wallpaperSelector.applyWallpaper(index);
            }
        }
    }
});

