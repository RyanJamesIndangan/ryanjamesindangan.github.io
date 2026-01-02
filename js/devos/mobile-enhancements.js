// ===========================
// Mobile OS Enhancements
// ===========================

class MobileEnhancements {
    constructor() {
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.swipeThreshold = 50;
        this.init();
    }

    init() {
        if (window.innerWidth <= 768) {
            this.initMobileBottomSheet();
            this.initSwipeGestures();
            this.initMobileOptimizations();
        }
    }

    initMobileBottomSheet() {
        // Create mobile app drawer (bottom sheet)
        const drawer = document.createElement('div');
        drawer.id = 'mobileAppDrawer';
        drawer.className = 'mobile-app-drawer';
        drawer.innerHTML = `
            <div class="mobile-drawer-handle"></div>
            <div class="mobile-drawer-header">
                <h3>Applications</h3>
                <button class="mobile-drawer-close" id="mobileDrawerClose">×</button>
            </div>
            <div class="mobile-drawer-content" id="mobileDrawerContent">
                <!-- Apps will be populated here -->
            </div>
        `;
        document.body.appendChild(drawer);

        // Populate drawer with apps
        this.populateMobileDrawer();

        // Don't intercept start button - let the normal start menu work
        // The mobile drawer can be opened via a different method if needed
        // For now, we'll use the normal start menu on mobile too

        // Close button
        document.getElementById('mobileDrawerClose')?.addEventListener('click', () => {
            this.closeMobileDrawer();
        });

        // Close on overlay click
        drawer.addEventListener('click', (e) => {
            if (e.target === drawer) {
                this.closeMobileDrawer();
            }
        });

        // Swipe down to close
        let drawerStartY = 0;
        const drawerContent = document.getElementById('mobileDrawerContent');
        const drawerHandle = drawer.querySelector('.mobile-drawer-handle');

        [drawerHandle, drawerContent].forEach(el => {
            if (!el) return;
            el.addEventListener('touchstart', (e) => {
                drawerStartY = e.touches[0].clientY;
            });

            el.addEventListener('touchmove', (e) => {
                const currentY = e.touches[0].clientY;
                const deltaY = currentY - drawerStartY;
                
                if (deltaY > 0) {
                    drawer.style.transform = `translateY(${deltaY}px)`;
                }
            });

            el.addEventListener('touchend', (e) => {
                const currentY = e.changedTouches[0].clientY;
                const deltaY = currentY - drawerStartY;
                
                if (deltaY > 100) {
                    this.closeMobileDrawer();
                } else {
                    drawer.style.transform = '';
                }
            });
        });
    }

    populateMobileDrawer() {
        const drawerContent = document.getElementById('mobileDrawerContent');
        if (!drawerContent) return;

        const apps = [
            { id: 'about', icon: '👨‍💻', name: 'About Me' },
            { id: 'skills', icon: '🛠️', name: 'Technical Skills' },
            { id: 'experience', icon: '💼', name: 'Work Experience' },
            { id: 'projects', icon: '🚀', name: 'Projects' },
            { id: 'certifications', icon: '🎓', name: 'Certifications' },
            { id: 'terminal', icon: '⌨️', name: 'Terminal' },
            { id: 'ai-lab', icon: '<img src="assets/clippy-on-yellow-paper.png" alt="Clippy" class="clippy-icon">', name: 'AI Lab' },
            { id: 'snake', icon: '🐍', name: 'Snake Game' },
            { id: 'contact', icon: '📧', name: 'Contact' },
            { id: 'resume', icon: '📄', name: 'Resume' }
        ];

        drawerContent.innerHTML = apps.map(app => `
            <button class="mobile-app-item" data-app="${app.id}" onclick="openApp('${app.id}'); window.mobileEnhancements?.closeMobileDrawer();">
                <div class="mobile-app-icon">${app.icon}</div>
                <div class="mobile-app-name">${app.name}</div>
            </button>
        `).join('');
    }

    openMobileDrawer() {
        const drawer = document.getElementById('mobileAppDrawer');
        if (drawer) {
            drawer.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeMobileDrawer() {
        const drawer = document.getElementById('mobileAppDrawer');
        if (drawer) {
            drawer.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    initSwipeGestures() {
        // Swipe left/right to switch between windows
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (!window.windowManager) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            // Only handle horizontal swipes (ignore if vertical swipe is larger)
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.swipeThreshold) {
                const windows = Array.from(window.windowManager.windows.values());
                const visibleWindows = windows.filter(w => !w.classList.contains('minimized'));
                
                if (visibleWindows.length > 1) {
                    const currentIndex = visibleWindows.findIndex(w => 
                        w === window.windowManager.activeWindow
                    );
                    
                    if (deltaX > 0 && currentIndex > 0) {
                        // Swipe right - previous window
                        const prevWindow = visibleWindows[currentIndex - 1];
                        const appId = prevWindow.dataset.appId;
                        window.windowManager.focusWindow(appId);
                    } else if (deltaX < 0 && currentIndex < visibleWindows.length - 1) {
                        // Swipe left - next window
                        const nextWindow = visibleWindows[currentIndex + 1];
                        const appId = nextWindow.dataset.appId;
                        window.windowManager.focusWindow(appId);
                    }
                }
            }
        }, { passive: true });
    }

    initMobileOptimizations() {
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Optimize touch targets
        document.querySelectorAll('.window-btn, .taskbar-app, .desktop-icon').forEach(el => {
            el.style.minHeight = '48px';
            el.style.minWidth = '48px';
        });
    }
}

// Initialize mobile enhancements
if (window.innerWidth <= 768) {
    window.mobileEnhancements = new MobileEnhancements();
}

// Reinitialize on resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.innerWidth <= 768 && !window.mobileEnhancements) {
            window.mobileEnhancements = new MobileEnhancements();
        } else if (window.innerWidth > 768 && window.mobileEnhancements) {
            // Clean up mobile drawer if exists
            const drawer = document.getElementById('mobileAppDrawer');
            if (drawer) drawer.remove();
            window.mobileEnhancements = null;
        }
    }, 250);
});

