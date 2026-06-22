// ===========================
// Wallpaper Selector
// ===========================

class WallpaperSelector {
    constructor() {
        this.wallpapers = [
            // Default = theme-aware "Claude paper" (null gradient -> CSS [data-theme] rules drive it).
            { name: 'Claude Paper (Auto)', url: null, gradient: null },
            { name: 'Warm Ivory', url: null, gradient: 'radial-gradient(1100px 760px at 78% -12%, #FBF6EE 0%, transparent 60%), linear-gradient(160deg, #FAF9F5 0%, #F3F1E9 55%, #ECE8DC 100%)' },
            { name: 'Clay', url: null, gradient: 'radial-gradient(900px 600px at 75% -10%, #E8A283 0%, transparent 55%), linear-gradient(160deg, #D97757 0%, #C2643F 55%, #A14E2F 100%)' },
            { name: 'Warm Dusk', url: null, gradient: 'radial-gradient(1000px 700px at 78% -10%, rgba(217,119,87,0.16) 0%, transparent 55%), linear-gradient(160deg, #2A2825 0%, #1F1E1B 60%, #181614 100%)' },
            { name: 'Sand', url: null, gradient: 'linear-gradient(160deg, #E4D3BD 0%, #C9B091 50%, #9C7E5C 100%)' },
            // Windows nostalgia themes (optional — warm overlay so they sit with the theme)
            { name: 'Windows 7 Official', url: 'assets/themes/windows-7-official-3840x2160-13944.jpg', gradient: 'linear-gradient(135deg, rgba(60, 50, 40, 0.25) 0%, rgba(60, 50, 40, 0.12) 50%, rgba(60, 50, 40, 0.25) 100%)' },
            { name: 'Windows XP Classic', url: 'assets/themes/windows-xp-classic-landscape-4089x2726-10769.jpg', gradient: 'linear-gradient(135deg, rgba(60, 50, 40, 0.25) 0%, rgba(60, 50, 40, 0.12) 50%, rgba(60, 50, 40, 0.25) 100%)' },
            { name: 'Windows 11', url: 'assets/themes/windows-11-blue-aesthetic-5120x2880-17495.png', gradient: 'linear-gradient(135deg, rgba(60, 50, 40, 0.25) 0%, rgba(60, 50, 40, 0.12) 50%, rgba(60, 50, 40, 0.25) 100%)' }
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

        // Theme-aware "Auto" wallpaper: clear the inline bg so the CSS
        // [data-theme] .wallpaper rules (warm ivory / warm dusk) drive it.
        if (!selected.url && !selected.gradient) {
            wallpaper.style.removeProperty('background');
            wallpaper.style.removeProperty('transition');
            localStorage.setItem('selectedWallpaper', index.toString());
            this.currentWallpaper = index;
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
        // Close context menu if open
        if (window.closeContextMenu) {
            window.closeContextMenu();
        }
        
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
                    } else if (wp.gradient) {
                        previewStyle = `background: ${wp.gradient};`;
                    } else {
                        previewStyle = `background: linear-gradient(160deg, #FAF9F5 0%, #E8E6DC 100%);`;
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

