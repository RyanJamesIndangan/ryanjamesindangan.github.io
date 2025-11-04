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
        this.dragRafId = null;
        this.resizeRafId = null;
        this.mouseX = 0;
        this.mouseY = 0;
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
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        const isLaptop = window.innerWidth > 1024 && window.innerWidth <= 1920;
        const isSmallLaptop = window.innerWidth > 1024 && window.innerWidth <= 1366;
        
        if (isMobile) {
            windowEl.style.left = '0';
            windowEl.style.top = '0';
            windowEl.style.width = '100%';
            windowEl.style.height = `calc(100% - var(--taskbar-height))`;
        } else {
            // Calculate tiled layout positions (responsive based on screen size)
            if (position) {
                // Adjust desktop icon width based on screen size
                let desktopIconWidth = 130;
                if (isSmallLaptop) {
                    desktopIconWidth = 100;
                } else if (isLaptop) {
                    desktopIconWidth = 110;
                } else if (isTablet) {
                    desktopIconWidth = 80;
                }
                
                const desktopWidth = window.innerWidth - desktopIconWidth;
                const desktopHeight = window.innerHeight - 60; // Subtract taskbar height
                const gap = 10;
                const leftOffset = desktopIconWidth; // Start windows after desktop icons
                
                // For laptops, use 2-column layout instead of 3-column for better usability
                const useTwoColumnLayout = isSmallLaptop || isLaptop;
                
                // Mixed layout: Left column split (About Me top, Skills bottom), 
                // Center and Right columns full height (Experience, Certifications)
                const fullHeightApps = ['experience', 'certifications'];
                const isFullHeight = fullHeightApps.includes(appId);
                const isMixedLayout = isFullHeight || appId === 'about' || appId === 'skills';
                
                if (isMixedLayout && !useTwoColumnLayout) {
                    // 3-column layout for large screens (original behavior)
                    const leftColumnWidth = (desktopWidth / 3) - (gap * 4 / 3);
                    const centerColumnWidth = (desktopWidth / 3) - (gap * 4 / 3);
                    const rightColumnWidth = (desktopWidth / 3) - (gap * 4 / 3);
                    const fullHeight = desktopHeight - (gap * 2);
                    // About Me takes 35% of height, Skills takes the rest to align bottom with center column
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
                } else if (isMixedLayout && useTwoColumnLayout) {
                    // 2-column layout for laptops (better for smaller screens)
                    const leftColumnWidth = (desktopWidth / 2) - (gap * 1.5);
                    const rightColumnWidth = (desktopWidth / 2) - (gap * 1.5);
                    const fullHeight = desktopHeight - (gap * 2);
                    const halfHeight = (desktopHeight / 2) - (gap * 1.5);
                    
                    switch(position) {
                        case 'top-left':
                            // About Me - top half of left column
                            windowEl.style.left = `${leftOffset + gap}px`;
                            windowEl.style.top = `${gap}px`;
                            windowEl.style.width = `${leftColumnWidth}px`;
                            windowEl.style.height = `${halfHeight}px`;
                            windowEl.dataset.position = position;
                            break;
                        case 'bottom-left':
                            // Skills - bottom half of left column
                            windowEl.style.left = `${leftOffset + gap}px`;
                            windowEl.style.top = `${halfHeight + gap * 2}px`;
                            windowEl.style.width = `${leftColumnWidth}px`;
                            windowEl.style.height = `${halfHeight}px`;
                            windowEl.dataset.position = position;
                            break;
                        case 'top-center':
                            // Experience - top half of right column
                            windowEl.style.left = `${leftOffset + desktopWidth / 2 + gap}px`;
                            windowEl.style.top = `${gap}px`;
                            windowEl.style.width = `${rightColumnWidth}px`;
                            windowEl.style.height = `${halfHeight}px`;
                            windowEl.dataset.position = position;
                            break;
                        case 'top-right':
                            // Certifications - bottom half of right column
                            windowEl.style.left = `${leftOffset + desktopWidth / 2 + gap}px`;
                            windowEl.style.top = `${halfHeight + gap * 2}px`;
                            windowEl.style.width = `${rightColumnWidth}px`;
                            windowEl.style.height = `${halfHeight}px`;
                            windowEl.dataset.position = position;
                            break;
                    }
                } else {
                    // Default 2-column layout for other cases
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
            
            // Get current window position and mouse position
            const rect = windowEl.getBoundingClientRect();
            const desktop = document.querySelector('.desktop');
            const desktopRect = desktop.getBoundingClientRect();
            
            // Calculate offset from mouse to window's top-left corner
            // This offset will remain constant during dragging
            this.startX = e.clientX - rect.left;
            this.startY = e.clientY - rect.top;
            
            // Store initial window position relative to desktop
            this.startLeft = rect.left - desktopRect.left;
            this.startTop = rect.top - desktopRect.top;
            
            // Enable hardware acceleration
            windowEl.style.willChange = 'transform';
            windowEl.style.transition = 'none';
            header.style.cursor = 'grabbing';
            header.style.userSelect = 'none';
            
            // Initialize mouse position
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            // Start smooth animation loop
            if (!this.dragRafId) {
                this.dragRafId = requestAnimationFrame(() => this.updateWindowDrag());
            }
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
        if (windowEl.classList.contains('maximized')) return;
        
        this.isResizing = true;
        this.activeWindow = windowEl;
        this.currentHandle = direction;
        
        // Get current window position and size
        const rect = windowEl.getBoundingClientRect();
        const desktop = document.querySelector('.desktop');
        const desktopRect = desktop.getBoundingClientRect();
        
        // Store initial mouse position
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        
        // Store initial window dimensions and position relative to desktop
        this.startWidth = rect.width;
        this.startHeight = rect.height;
        this.startLeft = rect.left - desktopRect.left;
        this.startTop = rect.top - desktopRect.top;
        
        // Disable transitions for smooth resizing
        windowEl.style.transition = 'none';
        windowEl.style.willChange = 'width, height, left, top';
        
        // Prevent text selection during resize
        document.body.style.userSelect = 'none';
        document.body.style.cursor = getComputedStyle(e.target).cursor;
        
        // Start resize animation loop
        if (!this.resizeRafId) {
            this.resizeRafId = requestAnimationFrame(() => this.updateWindowResize());
        }
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
            <span class="app-name">${title.length > 20 ? title.substring(0, 18) + '...' : title}</span>
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

    updateWindowDrag() {
        if (!this.isDragging || !this.activeWindow) {
            this.dragRafId = null;
            return;
        }
        
        const windowEl = this.activeWindow;
        if (windowEl.classList.contains('maximized')) {
            this.dragRafId = null;
            return;
        }
        
        // Get desktop bounds
        const desktop = document.querySelector('.desktop');
        const desktopRect = desktop.getBoundingClientRect();
        const taskbarHeight = 40;
        
        // Calculate new position relative to desktop
        // mouseX/mouseY are in viewport coordinates, so we subtract desktopRect.left/top
        const newLeft = (this.mouseX - desktopRect.left) - this.startX;
        const newTop = (this.mouseY - desktopRect.top) - this.startY;
        
        // Constrain to desktop area (excluding taskbar)
        const minLeft = 0;
        const maxLeft = desktopRect.width - windowEl.offsetWidth;
        const minTop = 0;
        const maxTop = desktopRect.height - taskbarHeight - windowEl.offsetHeight;
        
        // Apply constraints
        const constrainedLeft = Math.max(minLeft, Math.min(maxLeft, newLeft));
        const constrainedTop = Math.max(minTop, Math.min(maxTop, newTop));
        
        // Update position with hardware acceleration
        windowEl.style.left = `${constrainedLeft}px`;
        windowEl.style.top = `${constrainedTop}px`;
        
        // Continue animation loop
        this.dragRafId = requestAnimationFrame(() => this.updateWindowDrag());
    }
    
    updateWindowResize() {
        if (!this.isResizing || !this.activeWindow || !this.currentHandle) {
            this.resizeRafId = null;
            return;
        }
        
        const windowEl = this.activeWindow;
        if (windowEl.classList.contains('maximized')) {
            this.resizeRafId = null;
            return;
        }
        
        const handle = this.currentHandle; // This is a string like "n", "s", "e", "w", "ne", "nw", "se", "sw"
        
        // Get desktop bounds
        const desktop = document.querySelector('.desktop');
        const desktopRect = desktop.getBoundingClientRect();
        const taskbarHeight = 40;
        const minWidth = 300;
        const minHeight = 200;
        const maxWidth = desktopRect.width;
        const maxHeight = desktopRect.height - taskbarHeight;
        
        // Calculate delta from starting mouse position
        const deltaX = this.mouseX - this.startX;
        const deltaY = this.mouseY - this.startY;
        
        // Get current window position relative to desktop
        const windowRect = windowEl.getBoundingClientRect();
        const currentLeft = windowRect.left - desktopRect.left;
        const currentTop = windowRect.top - desktopRect.top;
        
        // Calculate new size and position
        let newWidth = this.startWidth;
        let newHeight = this.startHeight;
        let newLeft = this.startLeft;
        let newTop = this.startTop;
        
        // Handle resize based on direction
        // East (right) edge
        if (handle === 'e' || handle === 'ne' || handle === 'se') {
            newWidth = Math.max(minWidth, Math.min(maxWidth, this.startWidth + deltaX));
        }
        
        // West (left) edge
        if (handle === 'w' || handle === 'nw' || handle === 'sw') {
            newWidth = Math.max(minWidth, Math.min(maxWidth, this.startWidth - deltaX));
            newLeft = this.startLeft + (this.startWidth - newWidth);
        }
        
        // South (bottom) edge
        if (handle === 's' || handle === 'se' || handle === 'sw') {
            newHeight = Math.max(minHeight, Math.min(maxHeight, this.startHeight + deltaY));
        }
        
        // North (top) edge
        if (handle === 'n' || handle === 'ne' || handle === 'nw') {
            newHeight = Math.max(minHeight, Math.min(maxHeight, this.startHeight - deltaY));
            newTop = this.startTop + (this.startHeight - newHeight);
        }
        
        // Apply constraints to keep window within desktop bounds
        newLeft = Math.max(0, Math.min(desktopRect.width - newWidth, newLeft));
        newTop = Math.max(0, Math.min(desktopRect.height - taskbarHeight - newHeight, newTop));
        
        // Ensure minimum size is maintained
        if (newWidth < minWidth) {
            newWidth = minWidth;
            if (handle === 'w' || handle === 'nw' || handle === 'sw') {
                newLeft = this.startLeft + this.startWidth - minWidth;
            }
        }
        if (newHeight < minHeight) {
            newHeight = minHeight;
            if (handle === 'n' || handle === 'ne' || handle === 'nw') {
                newTop = this.startTop + this.startHeight - minHeight;
            }
        }
        
        // Update window with hardware acceleration
        windowEl.style.transition = 'none';
        windowEl.style.width = `${newWidth}px`;
        windowEl.style.height = `${newHeight}px`;
        windowEl.style.left = `${newLeft}px`;
        windowEl.style.top = `${newTop}px`;
        
        // Continue animation loop
        this.resizeRafId = requestAnimationFrame(() => this.updateWindowResize());
    }
}

// Global mouse events for dragging and resizing
document.addEventListener('mousemove', (e) => {
    if (window.windowManager.isDragging || window.windowManager.isResizing) {
        window.windowManager.mouseX = e.clientX;
        window.windowManager.mouseY = e.clientY;
        
        // Start animation loop if not already running
        if (window.windowManager.isDragging && !window.windowManager.dragRafId) {
            window.windowManager.dragRafId = requestAnimationFrame(() => window.windowManager.updateWindowDrag());
        }
        if (window.windowManager.isResizing && !window.windowManager.resizeRafId) {
            window.windowManager.resizeRafId = requestAnimationFrame(() => window.windowManager.updateWindowResize());
        }
    }
    
});

document.addEventListener('mouseup', () => {
    if (window.windowManager.isDragging) {
        const header = window.windowManager.activeWindow?.querySelector('.window-header');
        if (header) {
            header.style.cursor = 'move';
            header.style.userSelect = '';
        }
        const windowEl = window.windowManager.activeWindow;
        if (windowEl) {
            windowEl.style.willChange = 'auto';
            windowEl.style.transition = '';
        }
        // Cancel animation frame
        if (window.windowManager.dragRafId) {
            cancelAnimationFrame(window.windowManager.dragRafId);
            window.windowManager.dragRafId = null;
        }
    }
    if (window.windowManager.isResizing) {
        const windowEl = window.windowManager.activeWindow;
        if (windowEl) {
            windowEl.style.willChange = 'auto';
            windowEl.style.transition = '';
        }
        // Restore body cursor and userSelect
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        // Cancel animation frame
        if (window.windowManager.resizeRafId) {
            cancelAnimationFrame(window.windowManager.resizeRafId);
            window.windowManager.resizeRafId = null;
        }
    }
    window.windowManager.isDragging = false;
    window.windowManager.isResizing = false;
    window.windowManager.activeWindow = null;
    window.windowManager.currentHandle = null;
});

// Initialize window manager
window.windowManager = new WindowManager();

