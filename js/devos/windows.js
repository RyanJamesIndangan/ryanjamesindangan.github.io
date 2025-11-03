// ===========================
// Window Management System
// ===========================

class WindowManager {
    constructor() {
        this.windows = new Map();
        this.zIndex = 100;
        this.activeWindow = null;
        this.isDragging = false;
        this.isResizing = false;
        this.currentHandle = null;
        this.startX = 0;
        this.startY = 0;
        this.startWidth = 0;
        this.startHeight = 0;
        this.startLeft = 0;
        this.startTop = 0;
    }

    createWindow(appId, title, icon, content, position = null) {
        // Check if window already exists
        if (this.windows.has(appId)) {
            this.focusWindow(appId);
            return;
        }

        const windowEl = document.createElement('div');
        windowEl.className = 'window';
        windowEl.dataset.appId = appId;
        windowEl.style.zIndex = ++this.zIndex;

        // Set initial position and size
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            windowEl.style.left = '0';
            windowEl.style.top = '0';
            windowEl.style.width = '100%';
            windowEl.style.height = `calc(100% - var(--taskbar-height))`;
        } else {
            // Calculate tiled layout positions (supporting 2x2 grid or 3-column layout)
            if (position) {
                const desktopIconWidth = 130; // Reserve space for desktop icons on the left
                const desktopWidth = window.innerWidth - desktopIconWidth;
                const desktopHeight = window.innerHeight - 60; // Subtract taskbar height
                const gap = 10;
                const leftOffset = desktopIconWidth; // Start windows after desktop icons
                
                // Mixed layout: Left column split (About Me top, Skills bottom), 
                // Center and Right columns full height (Experience, Certifications)
                const fullHeightApps = ['experience', 'certifications'];
                const isFullHeight = fullHeightApps.includes(appId);
                const isMixedLayout = isFullHeight || appId === 'about' || appId === 'skills';
                
                if (isMixedLayout) {
                    // Calculate widths for 3-column layout
                    const leftColumnWidth = (desktopWidth / 3) - (gap * 4 / 3);
                    const centerColumnWidth = (desktopWidth / 3) - (gap * 4 / 3);
                    const rightColumnWidth = (desktopWidth / 3) - (gap * 4 / 3);
                    const fullHeight = desktopHeight - (gap * 2);
                    // About Me takes 35% of height, Skills takes the rest to align bottom with center column
                    // Center column bottom = gap + (desktopHeight - gap * 2) = desktopHeight - gap
                    const aboutMeHeight = desktopHeight * 0.35 - gap;
                    const skillsTop = desktopHeight * 0.35 + gap;
                    const skillsHeight = (desktopHeight - gap) - skillsTop; // Aligns bottom with center column
                    
                    switch(position) {
                        case 'top-left':
                            // About Me - 35% height in left column
                            windowEl.style.left = `${leftOffset + gap}px`;
                            windowEl.style.top = `${gap}px`;
                            windowEl.style.width = `${leftColumnWidth}px`;
                            windowEl.style.height = `${aboutMeHeight}px`;
                            windowEl.dataset.position = position;
                            break;
                        case 'bottom-left':
                            // Skills - fills remaining height, bottom aligned with center column
                            windowEl.style.left = `${leftOffset + gap}px`;
                            windowEl.style.top = `${skillsTop}px`;
                            windowEl.style.width = `${leftColumnWidth}px`;
                            windowEl.style.height = `${skillsHeight}px`;
                            windowEl.dataset.position = position;
                            break;
                        case 'top-center':
                            // Experience - full height in center column
                            windowEl.style.left = `${leftOffset + desktopWidth / 3 + gap}px`;
                            windowEl.style.top = `${gap}px`;
                            windowEl.style.width = `${centerColumnWidth}px`;
                            windowEl.style.height = `${fullHeight}px`;
                            windowEl.dataset.position = position;
                            break;
                        case 'top-right':
                            // Certifications - full height in right column
                            windowEl.style.left = `${leftOffset + (desktopWidth / 3) * 2 + gap}px`;
                            windowEl.style.top = `${gap}px`;
                            windowEl.style.width = `${rightColumnWidth}px`;
                            windowEl.style.height = `${fullHeight}px`;
                            windowEl.dataset.position = position;
                            break;
                    }
                } else {
                    // Default 2-column layout (original behavior)
                    const windowWidth = (desktopWidth / 2) - (gap * 1.5);
                    const windowHeight = (desktopHeight / 2) - gap;
                    
                    switch(position) {
                        case 'top-left':
                            windowEl.style.left = `${leftOffset + gap}px`;
                            windowEl.style.top = `${gap}px`;
                            windowEl.style.width = `${windowWidth}px`;
                            windowEl.style.height = `${windowHeight}px`;
                            windowEl.dataset.position = position;
                            break;
                        case 'top-right':
                            windowEl.style.left = `${leftOffset + desktopWidth / 2 + gap}px`;
                            windowEl.style.top = `${gap}px`;
                            windowEl.style.width = `${windowWidth}px`;
                            windowEl.style.height = `${windowHeight}px`;
                            windowEl.dataset.position = position;
                            break;
                        case 'bottom-left':
                            windowEl.style.left = `${leftOffset + gap}px`;
                            windowEl.style.top = `${desktopHeight / 2 + gap}px`;
                            windowEl.style.width = `${windowWidth}px`;
                            windowEl.style.height = `${(desktopHeight / 2) - gap}px`;
                            windowEl.dataset.position = position;
                            break;
                        case 'bottom-right':
                            windowEl.style.left = `${leftOffset + desktopWidth / 2 + gap}px`;
                            windowEl.style.top = `${desktopHeight / 2 + gap}px`;
                            windowEl.style.width = `${windowWidth}px`;
                            windowEl.style.height = `${(desktopHeight / 2) - gap}px`;
                            windowEl.dataset.position = position;
                            break;
                    }
                }
            } else {
                // Default cascading position for manually opened windows
                const offset = (this.windows.size * 30) % 100;
                const leftOffset = 130; // Keep space for desktop icons
                windowEl.style.left = `${leftOffset + 100 + offset}px`;
                windowEl.style.top = `${50 + offset}px`;
                windowEl.style.width = '800px';
                windowEl.style.height = '600px';
            }
        }

        // Window HTML
        windowEl.innerHTML = `
            <div class="window-header">
                <div class="window-title">
                    <span class="window-title-icon">${icon}</span>
                    <span>${title}</span>
                </div>
                <div class="window-controls">
                    <button class="window-btn minimize" title="Minimize">−</button>
                    <button class="window-btn maximize" title="Maximize">□</button>
                    <button class="window-btn close" title="Close">×</button>
                </div>
            </div>
            <div class="window-content">${content}</div>
            ${!isMobile ? `
                <div class="resize-handle n"></div>
                <div class="resize-handle s"></div>
                <div class="resize-handle e"></div>
                <div class="resize-handle w"></div>
                <div class="resize-handle ne"></div>
                <div class="resize-handle nw"></div>
                <div class="resize-handle se"></div>
                <div class="resize-handle sw"></div>
            ` : ''}
        `;

        document.getElementById('windowsContainer').appendChild(windowEl);
        this.windows.set(appId, windowEl);

        // Add event listeners
        this.attachWindowEvents(windowEl, appId);
        
        // Focus the window
        this.focusWindow(appId);

        // Create taskbar button
        this.createTaskbarButton(appId, title, icon);
        
        // Trigger event for snake icon update
        if (appId === 'snake') {
            setTimeout(() => {
                document.dispatchEvent(new CustomEvent('snakeWindowCreated'));
            }, 100);
        }

        // Animate window in
        setTimeout(() => {
            windowEl.style.opacity = '1';
        }, 10);
    }

    attachWindowEvents(windowEl, appId) {
        const header = windowEl.querySelector('.window-header');
        const closeBtn = windowEl.querySelector('.close');
        const minimizeBtn = windowEl.querySelector('.minimize');
        const maximizeBtn = windowEl.querySelector('.maximize');
        const resizeHandles = windowEl.querySelectorAll('.resize-handle');

        // Window focus
        windowEl.addEventListener('mousedown', () => {
            this.focusWindow(appId);
        });

        // Dragging
        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-btn')) return;
            if (windowEl.classList.contains('maximized')) return;
            
            this.isDragging = true;
            this.activeWindow = windowEl;
            this.startX = e.clientX - windowEl.offsetLeft;
            this.startY = e.clientY - windowEl.offsetTop;
            header.style.cursor = 'grabbing';
        });

        // Close
        closeBtn.addEventListener('click', () => {
            this.closeWindow(appId);
        });

        // Minimize
        minimizeBtn.addEventListener('click', () => {
            this.minimizeWindow(appId);
        });

        // Maximize
        maximizeBtn.addEventListener('click', () => {
            this.toggleMaximize(appId);
        });

        // Resize handles
        resizeHandles.forEach(handle => {
            handle.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                this.startResize(e, windowEl, handle.className.split(' ')[1]);
            });
        });

        // Double-click header to maximize
        header.addEventListener('dblclick', (e) => {
            if (e.target.closest('.window-btn')) return;
            this.toggleMaximize(appId);
        });
    }

    startResize(e, windowEl, direction) {
        this.isResizing = true;
        this.activeWindow = windowEl;
        this.currentHandle = direction;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startWidth = windowEl.offsetWidth;
        this.startHeight = windowEl.offsetHeight;
        this.startLeft = windowEl.offsetLeft;
        this.startTop = windowEl.offsetTop;
    }

    focusWindow(appId) {
        const windowEl = this.windows.get(appId);
        if (!windowEl) return;

        // Update z-index
        this.windows.forEach(win => {
            if (win !== windowEl) {
                win.style.zIndex = 100;
            }
        });
        windowEl.style.zIndex = ++this.zIndex;
        this.activeWindow = windowEl;
        
        // Update taskbar - remove active from all, add to current
        document.querySelectorAll('.taskbar-app').forEach(btn => {
            btn.classList.remove('active');
        });
        const taskbarBtn = document.querySelector(`.taskbar-app[data-app="${appId}"]`);
        if (taskbarBtn) {
            taskbarBtn.classList.add('active');
        }
    }

    closeWindow(appId) {
        const windowEl = this.windows.get(appId);
        if (!windowEl) return;

        windowEl.style.opacity = '0';
        windowEl.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            windowEl.remove();
            this.windows.delete(appId);
            
            // Remove taskbar button
            const taskbarBtn = document.querySelector(`.taskbar-app[data-app="${appId}"]`);
            if (taskbarBtn) taskbarBtn.remove();
        }, 200);
    }

    minimizeWindow(appId) {
        const windowEl = this.windows.get(appId);
        if (!windowEl) return;

        const isMinimized = windowEl.classList.contains('minimized');
        
        if (isMinimized) {
            // Restore window
            windowEl.classList.remove('minimized');
            this.focusWindow(appId);
        } else {
            // Minimize window
            windowEl.classList.add('minimized');
            
            // Update taskbar button - keep button but remove active state
            const taskbarBtn = document.querySelector(`.taskbar-app[data-app="${appId}"]`);
            if (taskbarBtn) {
                taskbarBtn.classList.remove('active');
            }
            
            // Clear active window if it was the minimized one
            if (this.activeWindow === windowEl) {
                this.activeWindow = null;
            }
        }
    }

    toggleMaximize(appId) {
        const windowEl = this.windows.get(appId);
        if (!windowEl) return;

        windowEl.classList.toggle('maximized');
    }

    createTaskbarButton(appId, title, icon) {
        const taskbarApps = document.getElementById('taskbarApps');
        const button = document.createElement('button');
        button.className = 'taskbar-app active';
        button.dataset.app = appId;
        button.innerHTML = `
            <span class="app-icon">${icon}</span>
            <span class="app-name">${title}</span>
        `;
        
        button.addEventListener('click', () => {
            const windowEl = this.windows.get(appId);
            if (!windowEl) return;
            
            if (windowEl.classList.contains('minimized')) {
                // Restore minimized window
                windowEl.classList.remove('minimized');
                this.focusWindow(appId);
            } else {
                // Focus or minimize if already focused
                if (this.activeWindow === windowEl) {
                    // If already active, minimize it
                    this.minimizeWindow(appId);
                } else {
                    // Focus it
                    this.focusWindow(appId);
                }
            }
        });
        
        taskbarApps.appendChild(button);
    }
}

// Global mouse events for dragging and resizing
document.addEventListener('mousemove', (e) => {
    if (window.windowManager.isDragging && window.windowManager.activeWindow) {
        const windowEl = window.windowManager.activeWindow;
        if (windowEl.classList.contains('maximized')) return;
        
        const newLeft = e.clientX - window.windowManager.startX;
        const newTop = e.clientY - window.windowManager.startY;
        
        windowEl.style.left = `${Math.max(0, newLeft)}px`;
        windowEl.style.top = `${Math.max(0, newTop)}px`;
    }
    
    if (window.windowManager.isResizing && window.windowManager.activeWindow) {
        const windowEl = window.windowManager.activeWindow;
        const deltaX = e.clientX - window.windowManager.startX;
        const deltaY = e.clientY - window.windowManager.startY;
        const handle = window.windowManager.currentHandle;
        
        let newWidth = window.windowManager.startWidth;
        let newHeight = window.windowManager.startHeight;
        let newLeft = window.windowManager.startLeft;
        let newTop = window.windowManager.startTop;
        
        if (handle.includes('e')) newWidth = window.windowManager.startWidth + deltaX;
        if (handle.includes('w')) {
            newWidth = window.windowManager.startWidth - deltaX;
            newLeft = window.windowManager.startLeft + deltaX;
        }
        if (handle.includes('s')) newHeight = window.windowManager.startHeight + deltaY;
        if (handle.includes('n')) {
            newHeight = window.windowManager.startHeight - deltaY;
            newTop = window.windowManager.startTop + deltaY;
        }
        
        // Minimum size
        newWidth = Math.max(400, newWidth);
        newHeight = Math.max(300, newHeight);
        
        windowEl.style.width = `${newWidth}px`;
        windowEl.style.height = `${newHeight}px`;
        windowEl.style.left = `${newLeft}px`;
        windowEl.style.top = `${newTop}px`;
    }
});

document.addEventListener('mouseup', () => {
    if (window.windowManager.isDragging) {
        const header = window.windowManager.activeWindow?.querySelector('.window-header');
        if (header) header.style.cursor = 'move';
    }
    window.windowManager.isDragging = false;
    window.windowManager.isResizing = false;
    window.windowManager.activeWindow = null;
});

// Initialize window manager
window.windowManager = new WindowManager();

