// ===========================
// Keyboard Shortcuts System
// ===========================

class KeyboardShortcuts {
    constructor() {
        this.shortcuts = new Map();
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            // Windows key combinations (Meta key on Mac, Ctrl on Windows/Linux)
            const winKey = e.metaKey || (e.ctrlKey && e.altKey);
            
            if (winKey) {
                this.handleWinKeyCombination(e);
            } else if (e.altKey) {
                this.handleAltKeyCombination(e);
            }
        });
    }

    handleWinKeyCombination(e) {
        const key = e.key.toLowerCase();
        
        switch(key) {
            case 'arrowleft':
                e.preventDefault();
                this.snapWindow('left');
                break;
            case 'arrowright':
                e.preventDefault();
                this.snapWindow('right');
                break;
            case 'arrowup':
                e.preventDefault();
                this.snapWindow('top');
                break;
            case 'arrowdown':
                e.preventDefault();
                this.snapWindow('bottom');
                break;
            case 'd':
                e.preventDefault();
                this.showDesktop();
                break;
            case 'm':
                e.preventDefault();
                this.minimizeAll();
                break;
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                e.preventDefault();
                this.openAppByNumber(parseInt(key));
                break;
        }
    }

    handleAltKeyCombination(e) {
        const key = e.key.toLowerCase();
        
        // Existing Alt shortcuts
        if (key === 'a') {
            e.preventDefault();
            openApp('about');
        } else if (key === 's') {
            e.preventDefault();
            openApp('skills');
        } else if (key === 'e') {
            e.preventDefault();
            openApp('experience');
        } else if (key === 'p') {
            e.preventDefault();
            openApp('projects');
        } else if (key === 'c') {
            e.preventDefault();
            openApp('contact');
        } else if (key === 't') {
            e.preventDefault();
            openApp('terminal');
        } else if (key === 'i') {
            e.preventDefault();
            openApp('ai-lab');
        }
    }

    snapWindow(direction) {
        const activeWindow = window.windowManager?.activeWindow;
        if (!activeWindow || activeWindow.classList.contains('maximized')) return;

        const desktop = document.querySelector('.desktop');
        const desktopRect = desktop.getBoundingClientRect();
        const taskbarHeight = 40;
        
        // Calculate desktop icon width
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        const isLaptop = window.innerWidth > 1024 && window.innerWidth <= 1920;
        const isSmallLaptop = window.innerWidth > 1024 && window.innerWidth <= 1366;
        let desktopIconWidth = 300;
        if (isSmallLaptop) desktopIconWidth = 240;
        else if (isLaptop) desktopIconWidth = 270;
        else if (isTablet) desktopIconWidth = 220;
        
        const availableWidth = desktopRect.width - desktopIconWidth;
        const availableHeight = desktopRect.height - taskbarHeight;
        const windowWidth = activeWindow.offsetWidth;
        const windowHeight = activeWindow.offsetHeight;
        
        activeWindow.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        switch(direction) {
            case 'left':
                activeWindow.style.left = `${desktopIconWidth}px`;
                activeWindow.style.top = '0';
                activeWindow.style.width = `${availableWidth / 2}px`;
                activeWindow.style.height = `${availableHeight}px`;
                break;
            case 'right':
                activeWindow.style.left = `${desktopIconWidth + availableWidth / 2}px`;
                activeWindow.style.top = '0';
                activeWindow.style.width = `${availableWidth / 2}px`;
                activeWindow.style.height = `${availableHeight}px`;
                break;
            case 'top':
                activeWindow.style.left = `${desktopIconWidth}px`;
                activeWindow.style.top = '0';
                activeWindow.style.width = `${availableWidth}px`;
                activeWindow.style.height = `${availableHeight / 2}px`;
                break;
            case 'bottom':
                activeWindow.style.left = `${desktopIconWidth}px`;
                activeWindow.style.top = `${availableHeight / 2}px`;
                activeWindow.style.width = `${availableWidth}px`;
                activeWindow.style.height = `${availableHeight / 2}px`;
                break;
        }
        
        setTimeout(() => {
            activeWindow.style.transition = '';
        }, 300);
    }

    showDesktop() {
        // Minimize all windows
        window.windowManager?.windows.forEach((windowEl, appId) => {
            if (!windowEl.classList.contains('minimized')) {
                window.windowManager.minimizeWindow(appId);
            }
        });
    }

    minimizeAll() {
        this.showDesktop();
    }

    openAppByNumber(num) {
        const appOrder = ['about', 'skills', 'experience', 'projects', 'certifications', 'terminal', 'contact', 'resume', 'snake'];
        if (num <= appOrder.length) {
            const appId = appOrder[num - 1];
            openApp(appId);
        }
    }
}

// Initialize keyboard shortcuts
window.keyboardShortcuts = new KeyboardShortcuts();

