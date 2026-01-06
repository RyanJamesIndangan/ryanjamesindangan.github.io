// ===========================
// Portfolio Main Application
// ===========================

// Performance: Use requestIdleCallback for non-critical initialization
const initNonCritical = (callback) => {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(callback, { timeout: 2000 });
    } else {
        setTimeout(callback, 1);
    }
};

// ===========================
// Clippy Avatar Helper
// ===========================
function getClippyAvatar() {
    // Return Clippy SVG for message avatars
    return `<div class="clippy-avatar-inline" style="width: 40px; height: 40px; display: inline-block;">
        <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M 30 20 Q 20 20 20 30 L 20 50 Q 20 60 30 60 L 50 60 Q 60 60 60 50 L 60 30 Q 60 20 50 20 L 30 20 Z" 
                  fill="#FFD700" stroke="#FFA500" stroke-width="2"/>
            <circle cx="35" cy="35" r="4" fill="#000"/>
            <circle cx="55" cy="35" r="4" fill="#000"/>
            <path d="M 35 50 Q 45 55 55 50" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/>
        </svg>
    </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
    // Critical: Initialize immediately
    initializeClock();
    initializeStartMenu();
    // Initialize context menu with a slight delay to ensure desktop is ready
    setTimeout(initializeContextMenu, 100);
    initializeDesktopIcons();
    initializeSelectionBox();
    initializeAppTiles();
    initializeSystemTray();
    updateExperienceYears();
    initializeThemeToggle();
    initializeCertificateModal();
    initializeAIAssistant();
    
    // Non-critical: Defer GitHub stats (external API call)
    initNonCritical(() => {
        initializeGitHubStats();
    });
    
    // Auto-open apps in a nice cascading manner after boot
    // Wait for boot screen to finish (2500ms fade + 800ms transition = 3300ms)
    setTimeout(() => {
        autoOpenApps();
    }, 3500); // Wait for boot screen to fully finish
});

// ===========================
// Clock
// ===========================
function initializeClock() {
    const clockEl = document.getElementById('clock');
    
    function updateClock() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        // Windows 7 style date format: "28/08/2014" or "MM/DD/YYYY"
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const year = now.getFullYear();
        const dateStr = `${day}/${month}/${year}`;
        
        clockEl.querySelector('.time').textContent = timeStr;
        clockEl.querySelector('.date').textContent = dateStr;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// ===========================
// System Tray
// ===========================
function initializeSystemTray() {
    const trayChevron = document.getElementById('trayChevron');
    const trayHiddenIcons = document.getElementById('trayHiddenIcons');
    const trayCloseBtn = document.getElementById('trayCloseBtn');
    
    if (trayChevron && trayHiddenIcons) {
        // Toggle hidden icons popup
        trayChevron.addEventListener('click', (e) => {
            e.stopPropagation();
            trayHiddenIcons.classList.toggle('active');
        });
        
        // Close on close button click
        if (trayCloseBtn) {
            trayCloseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                trayHiddenIcons.classList.remove('active');
            });
        }
        
        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!trayChevron.contains(e.target) && !trayHiddenIcons.contains(e.target)) {
                trayHiddenIcons.classList.remove('active');
            }
        });
        
        // Prevent closing when clicking inside popup
        trayHiddenIcons.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    // WiFi icon functionality (placeholder)
    const wifiIcon = document.getElementById('wifiIcon');
    if (wifiIcon) {
        wifiIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            showNotification('📶 Network settings (Coming soon)');
            trayHiddenIcons?.classList.remove('active');
        });
    }
    
    // Volume icon functionality (placeholder)
    const volumeIcon = document.getElementById('volumeIcon');
    if (volumeIcon) {
        volumeIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            showNotification('🔊 Volume control (Coming soon)');
            trayHiddenIcons?.classList.remove('active');
        });
    }
}

// ===========================
// Start Menu
// ===========================
function initializeStartMenu() {
    const startButton = document.getElementById('startButton');
    const startMenu = document.getElementById('startMenu');
    const shutdownBtn = document.querySelector('.shutdown-btn');
    
    startButton.addEventListener('click', (e) => {
        e.stopPropagation();
        startMenu.classList.toggle('active');
        startButton.classList.toggle('active');
    });
    
    // Close start menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!startMenu.contains(e.target) && e.target !== startButton) {
            startMenu.classList.remove('active');
            startButton.classList.remove('active');
        }
    });
    
    // Shutdown button - show menu
    if (shutdownBtn) {
        shutdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            showShutdownMenu(e);
        });
    }
}

// Shutdown Menu
function showShutdownMenu(e) {
    // Remove existing menu if any
    const existingMenu = document.querySelector('.shutdown-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    const menu = document.createElement('div');
    menu.className = 'shutdown-menu';
    menu.innerHTML = `
        <div class="shutdown-menu-item" data-action="shutdown">
            <span class="shutdown-icon">⏻</span>
            <div>
                <div class="shutdown-title">Shut down</div>
                <div class="shutdown-desc">Close the portfolio</div>
            </div>
        </div>
        <div class="shutdown-menu-item" data-action="restart">
            <span class="shutdown-icon">↻</span>
            <div>
                <div class="shutdown-title">Restart</div>
                <div class="shutdown-desc">Reload the page</div>
            </div>
        </div>
        <div class="shutdown-menu-item" data-action="sleep">
            <span class="shutdown-icon">🌙</span>
            <div>
                <div class="shutdown-title">Sleep</div>
                <div class="shutdown-desc">Dim the screen</div>
            </div>
        </div>
        <div class="shutdown-menu-item" data-action="lock">
            <span class="shutdown-icon">🔒</span>
            <div>
                <div class="shutdown-title">Lock</div>
                <div class="shutdown-desc">Show lock screen</div>
            </div>
        </div>
        <div class="shutdown-menu-item" data-action="signout">
            <span class="shutdown-icon">👤</span>
            <div>
                <div class="shutdown-title">Sign out</div>
                <div class="shutdown-desc">Clear session data</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(menu);
    
    // Position menu in the red square area (right side of desktop)
    const menuWidth = 220;
    const menuHeight = 280;
    
    // Position in the right side of desktop, vertically centered
    // This matches the red square area shown in the screenshot
    const rightMargin = 50; // Distance from right edge
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const taskbarHeight = 60; // Approximate taskbar height
    
    // Calculate vertical center position (excluding taskbar)
    const availableHeight = viewportHeight - taskbarHeight;
    const centerTop = (availableHeight / 2) - (menuHeight / 2);
    
    // Ensure menu doesn't go off-screen
    let finalTop = Math.max(80, Math.min(centerTop, viewportHeight - menuHeight - 80));
    let finalRight = rightMargin;
    
    // Ensure it doesn't go off the right edge
    if (finalRight + menuWidth > viewportWidth - 20) {
        finalRight = viewportWidth - menuWidth - 20;
    }
    
    menu.style.right = `${finalRight}px`;
    menu.style.top = `${finalTop}px`;
    menu.style.left = 'auto'; // Clear left positioning
    
    // Animate in
    setTimeout(() => menu.classList.add('active'), 10);
    
    // Handle menu item clicks
    menu.querySelectorAll('.shutdown-menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = item.dataset.action;
            menu.remove();
            
            switch(action) {
                case 'shutdown':
                    // Trigger Clippy animation
                    if (window.desktopClippy && window.desktopClippy.trigger) {
                        window.desktopClippy.trigger('shutdown');
                    }
                    showShutdownAnimation(() => {
                        showNotification('Portfolio shutting down...', 'info', 2000);
                        setTimeout(() => {
                            document.body.style.opacity = '0';
                            setTimeout(() => location.reload(), 500);
                        }, 2000);
                    });
                    break;
                case 'restart':
                    showNotification('Restarting portfolio...', 'info', 1500);
                    setTimeout(() => location.reload(), 1500);
                    break;
                case 'sleep':
                    // Trigger Clippy animation
                    if (window.desktopClippy && window.desktopClippy.trigger) {
                        window.desktopClippy.trigger('sleep');
                    }
                    showSleepMode();
                    break;
                case 'lock':
                    // Trigger Clippy animation
                    if (window.desktopClippy && window.desktopClippy.trigger) {
                        window.desktopClippy.trigger('lock');
                    }
                    showLockScreen();
                    break;
                case 'signout':
                    clearAllSessionData();
                    showNotification('Signed out. Session cleared.', 'info', 2000);
                    setTimeout(() => location.reload(), 2000);
                    break;
            }
        });
    });
    
    // Close on outside click
    const closeOnOutsideClick = (e) => {
        if (!menu.contains(e.target) && !e.target.closest('.shutdown-btn')) {
            menu.remove();
            document.removeEventListener('click', closeOnOutsideClick);
        }
    };
    setTimeout(() => {
        document.addEventListener('click', closeOnOutsideClick);
    }, 100);
    
    // Close on Escape
    const closeOnEscape = (e) => {
        if (e.key === 'Escape') {
            menu.remove();
            document.removeEventListener('keydown', closeOnEscape);
        }
    };
    document.addEventListener('keydown', closeOnEscape);
}

function showShutdownAnimation(callback) {
    const overlay = document.createElement('div');
    overlay.className = 'shutdown-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: #fff;
        font-family: 'Segoe UI', sans-serif;
    `;
    overlay.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">⏻</div>
        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">Shutting down...</div>
        <div style="font-size: 0.9rem; opacity: 0.7;">Please wait</div>
    `;
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        if (callback) callback();
    }, 1000);
}

function showSleepMode() {
    const overlay = document.createElement('div');
    overlay.className = 'sleep-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        z-index: 999998;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.9;
    `;
    document.body.appendChild(overlay);
    
    showNotification('Sleep mode activated. Click anywhere to wake up.', 'info', 3000);
    
    overlay.addEventListener('click', () => {
        overlay.style.transition = 'opacity 0.5s';
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 500);
    });
}

function showLockScreen() {
    const overlay = document.createElement('div');
    overlay.className = 'lock-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        z-index: 999997;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: #fff;
        font-family: 'Segoe UI', sans-serif;
    `;
    overlay.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 1rem;">🔒</div>
        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">Portfolio Locked</div>
        <div style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 2rem;">Click anywhere to unlock</div>
        <div style="font-size: 2rem; animation: pulse 2s infinite;">👆</div>
    `;
    document.body.appendChild(overlay);
    
    overlay.addEventListener('click', () => {
        overlay.style.transition = 'opacity 0.5s, transform 0.5s';
        overlay.style.opacity = '0';
        overlay.style.transform = 'scale(0.95)';
        setTimeout(() => overlay.remove(), 500);
        showNotification('Portfolio unlocked', 'success', 2000);
    });
}

function clearAllSessionData() {
    // Clear all localStorage data
    localStorage.clear();
    showNotification('All session data cleared', 'info', 2000);
}

// ===========================
// Desktop Icons
// ===========================
let selectedIcon = null;

function initializeDesktopIcons() {
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    
    desktopIcons.forEach(icon => {
        const appId = icon.dataset.app;
        const iconType = icon.dataset.icon;
        
        // Double-click to open
        icon.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            if (appId) {
                // Check if window exists and is minimized
                const windowEl = window.windowManager?.windows.get(appId);
                if (windowEl && windowEl.classList.contains('minimized')) {
                    // Restore minimized window
                    window.windowManager.minimizeWindow(appId);
                } else {
                    // Open or focus window
                    openApp(appId);
                }
            } else if (iconType === 'recycle') {
                // Show confirmation dialog before opening external link
                showRecycleBinDialog();
            }
        });
        
        // Single click to select
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            selectIcon(icon);
        });
        
        // Enter/Space key to open (accessibility)
        icon.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const appId = icon.dataset.app;
                if (appId) {
                    const windowEl = window.windowManager?.windows.get(appId);
                    if (windowEl && windowEl.classList.contains('minimized')) {
                        window.windowManager.minimizeWindow(appId);
                    } else {
                        openApp(appId);
                    }
                } else if (icon.id === 'recycleBinIcon') {
                    showRecycleBinDialog();
                }
            }
        });
        
        // Make draggable
        makeDraggable(icon);
    });
    
    // Click desktop to deselect
    document.querySelector('.desktop').addEventListener('click', () => {
        deselectAllIcons();
    });
    
    // Keyboard navigation for icons
    document.addEventListener('keydown', (e) => {
        // Enter key to open selected icon
        if (e.key === 'Enter' && selectedIcon) {
            const appId = selectedIcon.dataset.app;
            if (appId) {
                const windowEl = window.windowManager?.windows.get(appId);
                if (windowEl && windowEl.classList.contains('minimized')) {
                    window.windowManager.minimizeWindow(appId);
                } else {
                    openApp(appId);
                }
            }
            return;
        }
        
        // Arrow keys to navigate between icons
        if (selectedIcon && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
            navigateIcons(e.key);
        }
    });
}

// ===========================
// Recycle Bin Dialog
// ===========================
function showRecycleBinDialog() {
    // Create Windows 7-style confirmation dialog
    const dialog = document.createElement('div');
    dialog.className = 'windows-dialog';
    dialog.innerHTML = `
        <div class="dialog-content">
            <div class="dialog-header">
                <div class="dialog-icon">🗑️</div>
                <div class="dialog-title">Recycle Bin</div>
            </div>
            <div class="dialog-body">
                <p>Open external link?</p>
                <p class="dialog-message">This will open your GitHub profile in a new tab.</p>
            </div>
            <div class="dialog-footer">
                <button class="dialog-btn dialog-btn-primary" id="dialogOk">OK</button>
                <button class="dialog-btn" id="dialogCancel">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Show dialog with animation
    setTimeout(() => {
        dialog.classList.add('active');
    }, 10);
    
    // Handle OK button
    document.getElementById('dialogOk').addEventListener('click', () => {
        dialog.classList.remove('active');
        setTimeout(() => {
            dialog.remove();
            window.open('https://github.com/ryanjamesindangan', '_blank');
        }, 200);
    });
    
    // Handle Cancel button
    document.getElementById('dialogCancel').addEventListener('click', () => {
        dialog.classList.remove('active');
        setTimeout(() => {
            dialog.remove();
        }, 200);
    });
    
    // Close on Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            dialog.classList.remove('active');
            setTimeout(() => {
                dialog.remove();
                document.removeEventListener('keydown', handleEscape);
            }, 200);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

function selectIcon(icon) {
    deselectAllIcons();
    icon.classList.add('selected');
    selectedIcon = icon;
}

function deselectAllIcons() {
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.classList.remove('selected');
    });
    selectedIcon = null;
}

function navigateIcons(direction) {
    const icons = Array.from(document.querySelectorAll('.desktop-icon'));
    if (icons.length === 0) return;
    
    // If no icon is selected, select the first one
    if (!selectedIcon || !icons.includes(selectedIcon)) {
        selectIcon(icons[0]);
        return;
    }
    
    const currentRect = selectedIcon.getBoundingClientRect();
    const currentCenterX = currentRect.left + currentRect.width / 2;
    const currentCenterY = currentRect.top + currentRect.height / 2;
    
    let bestIcon = null;
    let bestDistance = Infinity;
    
    icons.forEach(icon => {
        if (icon === selectedIcon) return;
        
        const iconRect = icon.getBoundingClientRect();
        const iconCenterX = iconRect.left + iconRect.width / 2;
        const iconCenterY = iconRect.top + iconRect.height / 2;
        
        let isValid = false;
        let distance = 0;
        
        switch(direction) {
            case 'ArrowUp':
                // Find icon above current (smaller Y)
                if (iconCenterY < currentCenterY) {
                    isValid = true;
                    // Prefer icons that are closer horizontally (same column)
                    const horizontalDistance = Math.abs(iconCenterX - currentCenterX);
                    // Prefer icons directly above (small horizontal distance)
                    distance = iconCenterY - currentCenterY + horizontalDistance * 0.5;
                }
                break;
            case 'ArrowDown':
                // Find icon below current (larger Y)
                if (iconCenterY > currentCenterY) {
                    isValid = true;
                    const horizontalDistance = Math.abs(iconCenterX - currentCenterX);
                    distance = iconCenterY - currentCenterY + horizontalDistance * 0.5;
                }
                break;
            case 'ArrowLeft':
                // Find icon to the left (smaller X)
                if (iconCenterX < currentCenterX) {
                    isValid = true;
                    const verticalDistance = Math.abs(iconCenterY - currentCenterY);
                    distance = currentCenterX - iconCenterX + verticalDistance * 0.5;
                }
                break;
            case 'ArrowRight':
                // Find icon to the right (larger X)
                if (iconCenterX > currentCenterX) {
                    isValid = true;
                    const verticalDistance = Math.abs(iconCenterY - currentCenterY);
                    distance = iconCenterX - currentCenterX + verticalDistance * 0.5;
                }
                break;
        }
        
        if (isValid && distance < bestDistance) {
            bestDistance = distance;
            bestIcon = icon;
        }
    });
    
    // If no icon found in that direction, wrap around
    if (!bestIcon && icons.length > 1) {
        if (direction === 'ArrowUp' || direction === 'ArrowLeft') {
            // Wrap to last icon
            bestIcon = icons[icons.length - 1];
        } else {
            // Wrap to first icon
            bestIcon = icons[0];
        }
    }
    
    if (bestIcon) {
        selectIcon(bestIcon);
        bestIcon.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function makeDraggable(icon) {
    let isDragging = false;
    let currentX = 0;
    let currentY = 0;
    let initialX = 0;
    let initialY = 0;
    let xOffset = 0;
    let yOffset = 0;
    let rafId = null;
    let mouseX = 0;
    let mouseY = 0;
    let startMouseX = 0;
    let startMouseY = 0;
    
    // Enable hardware acceleration
    icon.style.willChange = 'transform';
    icon.style.transform = 'translate3d(0, 0, 0)';
    
    icon.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseup', dragEnd);
    
    function dragStart(e) {
        if (e.target.closest('.desktop-icon') !== icon) return;
        
        // Prevent dragging if it's a double-click
        if (e.detail === 2) return;
        
        // Get current transform values to track accumulated offset
        const transform = window.getComputedStyle(icon).transform;
        if (transform && transform !== 'none') {
            const matrix = new DOMMatrix(transform);
            xOffset = matrix.m41 || 0;
            yOffset = matrix.m42 || 0;
        } else {
            xOffset = 0;
            yOffset = 0;
        }
        
        // Store starting mouse position
        startMouseX = e.clientX;
        startMouseY = e.clientY;
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (e.target === icon || icon.contains(e.target)) {
            isDragging = true;
            icon.style.cursor = 'grabbing';
            icon.style.userSelect = 'none';
            icon.style.zIndex = '1000';
            
            // Start smooth animation loop
            animate();
        }
    }
    
    function updateMousePosition(e) {
        if (isDragging) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }
    }
    
    function animate() {
        if (!isDragging) return;
        
        // Calculate delta from starting mouse position (simple and correct)
        const deltaX = mouseX - startMouseX;
        const deltaY = mouseY - startMouseY;
        
        // Apply delta to existing offset
        currentX = xOffset + deltaX;
        currentY = yOffset + deltaY;
        
        // Update position with hardware acceleration
        icon.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        
        // Continue animation loop
        rafId = requestAnimationFrame(animate);
    }
    
    function dragEnd(e) {
        if (isDragging) {
            isDragging = false;
            xOffset = currentX;
            yOffset = currentY;
            icon.style.cursor = 'pointer';
            icon.style.userSelect = '';
            icon.style.zIndex = '';
            
            // Cancel animation frame
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        }
    }
}

// ===========================
// App Tiles
// ===========================
function initializeAppTiles() {
    const appTiles = document.querySelectorAll('.app-tile');
    
    appTiles.forEach(tile => {
        tile.addEventListener('click', () => {
            const appId = tile.dataset.app;
            openApp(appId);
            
            // Close start menu
            document.getElementById('startMenu').classList.remove('active');
            document.getElementById('startButton').classList.remove('active');
        });
    });
    
    // Handle menu links in right pane (Certifications, Contact, Resume)
    const menuLinks = document.querySelectorAll('.menu-link[data-app]');
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const appId = link.dataset.app;
            openApp(appId);
            
            // Close start menu
            document.getElementById('startMenu').classList.remove('active');
            document.getElementById('startButton').classList.remove('active');
        });
    });
    
    // External links (GitHub, LinkedIn) - let them work normally
    const externalLinks = document.querySelectorAll('.menu-link.external-link');
    externalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Close start menu when opening external link
            document.getElementById('startMenu').classList.remove('active');
            document.getElementById('startButton').classList.remove('active');
            // Let the link work normally (open in new tab)
        });
    });
}

// ===========================
// Open Application
// ===========================
function openApp(appId, position = null) {
    const app = apps[appId];
    if (!app) return;
    
    // Check if window already exists
    const existingWindow = window.windowManager?.windows.get(appId);
    if (existingWindow) {
        // If window exists but is minimized, restore it
        if (existingWindow.classList.contains('minimized')) {
            window.windowManager.minimizeWindow(appId);
        } else {
            // If window exists and is visible, focus it
            window.windowManager.focusWindow(appId);
        }
        return;
    }
    
    // Create new window
    if (window.windowManager) {
        window.windowManager.createWindow(
            appId,
            app.title,
            app.icon,
            app.content,
            position
        );
    } else {
        console.error('WindowManager not initialized');
    }
    
    // Trigger Clippy animation for specific app opens
    if (window.desktopClippy && window.desktopClippy.trigger) {
        const appEventMap = {
            'ai-lab': 'app-open-ai-lab',
            'projects': 'app-open-projects',
            'terminal': 'app-open-terminal'
        };
        const event = appEventMap[appId];
        if (event) {
            window.desktopClippy.trigger(event);
        }
    }
    
    // Initialize terminal if opened
    if (appId === 'terminal') {
        setTimeout(() => initializeTerminal(), 100);
    }
    
    // Initialize demo buttons if projects window opened
    if (appId === 'projects') {
        setTimeout(() => {
            initializeDemoButtons();
            initializeProjectFilters();
            initializeProjectModals();
        }, 100);
    }
    
    // Initialize Snake game if opened
    if (appId === 'snake') {
        setTimeout(() => initializeSnakeGame(), 100);
    }
    
    // Initialize testimonials carousel if opened
    if (appId === 'testimonials') {
        setTimeout(() => initializeTestimonialsCarousel(), 100);
    }
    
    // Initialize GitHub stats if opened
    if (appId === 'github-stats') {
        setTimeout(() => loadGitHubStats(), 100);
    }
    
    // Initialize blog if opened
    if (appId === 'blog') {
        setTimeout(() => {
            initializeBlogFilters();
            initializeBlogSearch();
            initializeBlogPostModals();
        }, 100);
    }
    
    // Initialize AI Lab demos if opened
    if (appId === 'ai-lab') {
        setTimeout(() => {
            initializeOCRDemo();
            initializePipelineVisualization();
            initializeWatermarkDemo();
        }, 100);
    }
    
    // Update experience years when About app is opened
    if (appId === 'about') {
        setTimeout(() => {
            updateExperienceYears();
        }, 200);
    }
    
    // Initialize easter eggs app if opened
    if (appId === 'easter-eggs') {
        // Use requestAnimationFrame to ensure DOM is ready, then add a small delay
        requestAnimationFrame(() => {
            setTimeout(() => {
                initializeEasterEggsApp();
            }, 200);
        });
    }
}

// Initialize Easter Eggs App
function initializeEasterEggsApp() {
    // Find the easter-eggs window
    const easterEggsWindow = window.windowManager?.windows.get('easter-eggs');
    if (!easterEggsWindow) {
        console.warn('Easter Eggs window not found, retrying...');
        setTimeout(initializeEasterEggsApp, 200);
        return;
    }
    
    // Find the window content container
    const windowContent = easterEggsWindow.querySelector('.window-content');
    if (!windowContent) {
        console.warn('Easter Eggs window content not found, retrying...');
        setTimeout(initializeEasterEggsApp, 200);
        return;
    }
    
    // Try Konami Code button - search within the window content
    const tryKonamiBtn = windowContent.querySelector('.try-konami-btn');
    if (tryKonamiBtn && !tryKonamiBtn.dataset.initialized) {
        tryKonamiBtn.dataset.initialized = 'true';
        tryKonamiBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (window.easterEggs) {
                window.easterEggs.activateKonamiCode();
                showNotification('🎉 Konami Code activated!', 'success', 3000);
            } else {
                showNotification('⚠️ Easter Eggs system not initialized', 'warning', 2000);
            }
        });
    } else if (!tryKonamiBtn) {
        console.warn('Try Konami button not found in Easter Eggs app');
    }
    
    // Console hint button - search within the window content
    const consoleHintBtn = windowContent.querySelector('.open-console-hint-btn');
    if (consoleHintBtn && !consoleHintBtn.dataset.initialized) {
        consoleHintBtn.dataset.initialized = 'true';
        consoleHintBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showNotification('💡 Open browser console (F12) to see the hint!', 'info', 4000);
            // Also log it to console if available
            if (console && console.log) {
                console.log('%cTry the Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A', 'font-size: 12px; color: #fbbf24;');
            }
        });
    } else if (!consoleHintBtn) {
        console.warn('Console hint button not found in Easter Eggs app');
    }
}

// ===========================
// Demo Buttons (for video players)
// ===========================
function initializeDemoButtons() {
    const demoButtons = document.querySelectorAll('.open-demo-btn');
    demoButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const demoApp = this.dataset.demo;
            openApp(demoApp);
        });
    });
}

// ===========================
// Context Menu
// ===========================
function initializeContextMenu() {
    let contextMenu = document.getElementById('contextMenu');
    const desktop = document.getElementById('desktop') || document.querySelector('.desktop');
    
    if (!contextMenu) {
        console.warn('Context menu element not found');
        // Retry after a delay
        setTimeout(initializeContextMenu, 500);
        return;
    }
    
    // Move context menu to body if it's not already there (to avoid overflow:hidden clipping)
    if (contextMenu.parentElement !== document.body) {
        console.log('Moving context menu to body');
        document.body.appendChild(contextMenu);
    }
    
    if (!desktop) {
        console.warn('Desktop element not found, retrying...');
        // Retry after a delay
        setTimeout(initializeContextMenu, 500);
        return;
    }
    
    // Remove any existing listener if it exists (by using a named function)
    if (desktop._contextMenuHandler) {
        desktop.removeEventListener('contextmenu', desktop._contextMenuHandler, true);
    }
    
    // Create handler function
    desktop._contextMenuHandler = (e) => {
        console.log('Context menu event triggered on:', e.target, 'closest desktop:', e.target.closest('.desktop'));
        
        // Only show on desktop area, not on windows, icons, or other interactive elements
        const target = e.target;
        
        // Check if clicking on interactive elements
        if (target.closest('.window')) {
            console.log('Blocked: clicked on window');
            return;
        }
        if (target.closest('.desktop-icon')) {
            console.log('Blocked: clicked on desktop icon');
            return;
        }
        if (target.closest('.taskbar')) {
            console.log('Blocked: clicked on taskbar');
            return;
        }
        if (target.closest('.ai-assistant-widget')) {
            console.log('Blocked: clicked on AI assistant');
            return;
        }
        if (target.closest('.context-menu')) {
            console.log('Blocked: clicked on context menu');
            return;
        }
        if (target.closest('.start-menu')) {
            console.log('Blocked: clicked on start menu');
            return;
        }
        if (target.closest('.notification')) {
            console.log('Blocked: clicked on notification');
            return;
        }
        if (target.closest('.wallpaper-menu')) {
            console.log('Blocked: clicked on wallpaper menu');
            return;
        }
        
        // Allow right-click on wallpaper or empty desktop area
        e.preventDefault();
        e.stopPropagation();
        
        // Position context menu
        const x = Math.min(e.clientX, window.innerWidth - 220); // Prevent overflow
        const y = Math.min(e.clientY, window.innerHeight - 300); // Prevent overflow
        
        // Force all styles inline to override any CSS
        contextMenu.style.cssText = `
            position: fixed !important;
            left: ${x}px !important;
            top: ${y}px !important;
            display: block !important;
            z-index: 100001 !important;
            opacity: 1 !important;
            visibility: visible !important;
            transform: scale(1) !important;
            pointer-events: auto !important;
        `;
        contextMenu.classList.add('active');
        
        // Ensure it's in the body, not nested
        if (contextMenu.parentElement !== document.body) {
            document.body.appendChild(contextMenu);
        }
        
        console.log('Context menu shown at', x, y, 'menu element:', contextMenu); // Debug log
        console.log('Context menu computed styles:', {
            display: window.getComputedStyle(contextMenu).display,
            opacity: window.getComputedStyle(contextMenu).opacity,
            visibility: window.getComputedStyle(contextMenu).visibility,
            zIndex: window.getComputedStyle(contextMenu).zIndex,
            position: window.getComputedStyle(contextMenu).position,
            left: window.getComputedStyle(contextMenu).left,
            top: window.getComputedStyle(contextMenu).top
        });
        console.log('Context menu parent:', contextMenu.parentElement);
    };
    
    // Add context menu event listener to desktop
    // Use capture phase to ensure we catch the event before other handlers
    desktop.addEventListener('contextmenu', desktop._contextMenuHandler, true);
    
    // Also add to document as fallback
    document.addEventListener('contextmenu', (e) => {
        // Only handle if clicking on desktop or wallpaper
        if (e.target.closest('.desktop') || e.target.classList.contains('wallpaper') || e.target.id === 'wallpaper') {
            // Check if it's not already handled by desktop handler
            if (!e.target.closest('.window') && 
                !e.target.closest('.desktop-icon') && 
                !e.target.closest('.taskbar') &&
                !e.target.closest('.ai-assistant-widget') &&
                !e.target.closest('.context-menu') &&
                !e.target.closest('.start-menu')) {
                console.log('Document-level context menu handler triggered');
                desktop._contextMenuHandler(e);
            }
        }
    }, true);
    
    // Function to close context menu properly (make it globally accessible)
    window.closeContextMenu = () => {
        const menu = document.getElementById('contextMenu');
        if (menu) {
            // Remove active class first
            menu.classList.remove('active');
            
            // Hide instantly without teleporting - keep position, just hide
            menu.style.setProperty('opacity', '0', 'important');
            menu.style.setProperty('visibility', 'hidden', 'important');
            menu.style.setProperty('pointer-events', 'none', 'important');
            menu.style.setProperty('z-index', '-1', 'important');
            
            // After a brief moment, clean up positioning (but don't do it immediately to avoid teleport)
            setTimeout(() => {
                if (!menu.classList.contains('active')) {
                    // Only clear position if menu is still closed
                    menu.style.removeProperty('left');
                    menu.style.removeProperty('top');
                }
            }, 200); // Wait for any transitions to complete
        }
    };
    
    const closeContextMenu = window.closeContextMenu;
    
    // Close context menu on click outside
    let clickHandler = (e) => {
        // Check if click is outside context menu
        if (!contextMenu.contains(e.target) && !e.target.closest('.context-menu')) {
            // Only close if menu is active
            if (contextMenu.classList.contains('active') || 
                window.getComputedStyle(contextMenu).visibility === 'visible' ||
                window.getComputedStyle(contextMenu).opacity !== '0') {
                console.log('Click outside detected, closing menu');
                closeContextMenu();
            }
        }
    };
    
    // Use capture phase and make sure it runs
    document.addEventListener('click', clickHandler, true);
    
    // Close context menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contextMenu.classList.contains('active')) {
            closeContextMenu();
        }
    });
    
    // Close context menu when wallpaper menu opens
    document.addEventListener('click', (e) => {
        if (e.target.closest('.wallpaper-menu') || e.target.closest('.wallpaper-option')) {
            if (contextMenu.classList.contains('active')) {
                closeContextMenu();
            }
        }
    });
    
    // Context menu actions
    contextMenu.querySelectorAll('.context-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            const action = item.dataset.action;
            
            // Close menu FIRST, immediately
            console.log('Context item clicked:', action);
            closeContextMenu();
            
            // Execute action after menu closes
            setTimeout(() => {
            switch(action) {
                case 'refresh':
                    showNotification('Refreshing desktop...', 'info', 1000);
                    setTimeout(() => location.reload(), 500);
                    break;
                case 'view-code':
                    window.open('https://github.com/ryanjamesindangan/ryanjamesindangan.github.io', '_blank');
                    showNotification('Opening GitHub repository...', 'success');
                    break;
                case 'show-all-windows':
                    // Restore all minimized windows
                    window.windowManager?.windows.forEach((windowEl, appId) => {
                        if (windowEl.classList.contains('minimized')) {
                            window.windowManager.minimizeWindow(appId);
                        }
                    });
                    showNotification('All windows restored', 'success');
                    break;
                case 'minimize-all':
                    window.keyboardShortcuts?.showDesktop();
                    showNotification('All windows minimized', 'info');
                    break;
                case 'change-wallpaper':
                    if (window.wallpaperSelector) {
                        window.wallpaperSelector.showWallpaperMenu();
                    } else {
                        showNotification('Wallpaper selector not available', 'error');
                    }
                    break;
                case 'about-portfolio':
                    showNotification('Portfolio OS v3.0 | Built by Ryan James Indangan | AI/ML Focus', 'info', 4000);
                    break;
            }
            }, 10); // Small delay to ensure menu closes
        });
    });
}

// ===========================
// Terminal
// ===========================
function initializeTerminal() {
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutput');
    
    if (!terminalInput || !terminalOutput) return;
    
    terminalInput.focus();
    
    // Command history
    let commandHistory = [];
    let historyIndex = -1;
    
    const commands = {
        help: () => `
Available commands:
  General:
  about       - Display information about me
  skills      - List technical skills
  experience  - Show work experience
  projects    - Display featured projects
  contact     - Show contact information
  clear       - Clear terminal screen
  github      - Open GitHub profile
  linkedin    - Open LinkedIn profile
  help        - Show this help message
    
  AI/ML Commands:
    ai-about    - AI-focused professional summary
    ai-skills    - Detailed AI/ML skills breakdown
    ai-projects  - Document Intelligence projects
    ocr-demo     - Simulate OCR processing
    llm-status   - Check LLM connection status
    extract-doc  - Simulate document extraction
    watermark    - Watermark removal demo
        `,
        about: () => {
            const startYear = 2018;
            const currentYear = new Date().getFullYear();
            const years = currentYear - startYear;
            return `Ryan James Indangan - Full-Stack Developer & CTO\n${years}+ years of experience in web development\nSpecializing in AI/ML and Document Intelligence`;
        },
        skills: () => 'Frontend: React, Vue, Angular, Next.js\nBackend: PHP, Laravel, Node.js, FastAPI, Django\nCloud: AWS, Docker, Kubernetes\nAI/ML: Document Intelligence, OCR, LLM Integration',
        experience: () => 'AI Developer/ML Engineer at Alliance Global Solutions (Nov 2025 - Present)\nSenior Full-Stack Developer at GlobalX Digital\nFormer CTO at Payo Digital\nTop Rated on Upwork',
        projects: () => 'Check out my projects:\n- Crypto Checkout Simulator\n- Supplier Order Management\n- GlobalX Platform Redesign\n- Document Intelligence Pipeline',
        contact: () => 'Email: ryanjamesfranciscoindangan@yahoo.com\nPhone: +63 999 333 9030\nLinkedIn: ryan-james-indangan',
        github: () => {
            window.open('https://github.com/ryanjamesindangan', '_blank');
            return 'Opening GitHub profile...';
        },
        linkedin: () => {
            window.open('https://www.linkedin.com/in/ryan-james-indangan-63b271164/', '_blank');
            return 'Opening LinkedIn profile...';
        },
        clear: () => {
            terminalOutput.innerHTML = '';
            return '';
        },
        // AI/ML Commands
        'ai-about': () => {
            return `📎 Clippy: AI Developer & Machine Learning Engineer

Specializing in Document Intelligence and AI-powered automation:
• End-to-end bank statement extraction pipelines
• Advanced OCR with multi-angle scanning
• ML-based watermark removal (RandomForest)
• LLM integration (Ollama, vLLM, OpenAI APIs)
• FastAPI SSE for real-time processing

Current Role: AI Developer/ML Engineer at Alliance Global Solutions BPO
Focus: Financial document processing and automated underwriting`;
        },
        'ai-skills': () => {
            return `📎 Clippy: AI & Machine Learning Stack:

Document Intelligence:
  • OCR: Tesseract, OpenCV, PIL
  • PDF Processing: PyMuPDF, pdfplumber, pdf2image
  • Computer Vision: OpenCV, scikit-image

Machine Learning:
  • Classification: RandomForest, scikit-learn
  • Feature Engineering
  • Model Training & Validation

LLM Integration:
  • Ollama (Local LLMs)
  • vLLM (High-performance inference)
  • OpenAI-compatible APIs
  • Token-efficient payloads

Pipeline Architecture:
  • Validation-first extraction
  • Real-time processing (FastAPI SSE)
  • Secure service architecture (JWT, RSA)`;
        },
        'ai-projects': () => {
            return `📄 Document Intelligence Projects:

1. Bank Statement Extraction Pipeline
   - Native PDF text + OCR fallback
   - Multi-angle OCR with quality scoring
   - Validation-first framework

2. Watermark Removal System
   - ML-based detection (RandomForest)
   - Feature engineering
   - Automated routing to removal strategies

3. LLM Underwriting Summaries
   - Ollama integration
   - Structured output generation
   - Real-time processing visibility

4. Secure AI Gateway
   - Node.js with JWT/RSA
   - Rate limiting & CORS
   - FastAPI SSE streaming`;
        },
        'ocr-demo': () => {
            return `🔍 OCR Processing Simulation...

[1/4] Loading document... ✓
[2/4] Preprocessing (denoising, thresholding, deskewing)... ✓
[3/4] Multi-angle OCR scanning... ✓
[4/4] Quality scoring & text extraction... ✓

Result: Successfully extracted 1,247 characters
Confidence: 94.3%
Processing time: 2.3s

Document Type: Bank Statement
Pages: 3
Text Regions: 45 detected`;
        },
        'llm-status': () => {
            return `📎 Clippy: LLM Service Status:

Ollama (Local):
  Status: ✓ Connected
  Model: llama3.1:8b
  Tokens/sec: 45.2
  Memory: 8.2GB / 16GB

vLLM (Production):
  Status: ✓ Running
  Endpoint: https://api.example.com/vllm
  Latency: 120ms avg
  Queue: 0 pending

OpenAI API:
  Status: ✓ Available
  Model: gpt-4-turbo
  Rate Limit: 500 req/min

All systems operational! 🚀`;
        },
        'extract-doc': () => {
            return `📄 Document Extraction Simulation...

Document: bank_statement_2025.pdf
Size: 2.4 MB
Pages: 3

[Processing Pipeline]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1: Native PDF extraction...     ✓ 100%
Step 2: OCR fallback (if needed)...  ✓ 100%
Step 3: Structure validation...      ✓ 100%
Step 4: Data normalization...         ✓ 100%
Step 5: Classification...             ✓ 100%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Extracted Data:
• Account Number: ****1234
• Statement Period: Nov 2025
• Transactions: 47
• Total Deposits: $12,450.00
• Total Withdrawals: $8,230.00
• Balance: $4,220.00

Validation: ✓ Passed
Integrity: ✓ Verified
Ready for underwriting review.`;
        },
        'watermark': () => {
            return `💧 Watermark Removal Demo...

[Analyzing Document]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Feature Extraction...        ✓
Watermark Type Detection...   ✓
ML Classification...          ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Detected: Text Watermark
Confidence: 87.3%
Strategy: RandomForest Classifier

[Removal Process]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Preprocessing...             ✓
Feature Engineering...        ✓
Classification...            ✓
Removal Applied...            ✓
Quality Check...              ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Result: Watermark successfully removed
Quality Score: 92.1%
Processing Time: 1.8s`;
        }
    };
    
    terminalInput.addEventListener('keydown', (e) => {
        // Command history navigation
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                if (historyIndex === -1) {
                    historyIndex = commandHistory.length - 1;
                } else if (historyIndex > 0) {
                    historyIndex--;
                }
                terminalInput.value = commandHistory[historyIndex];
            }
            return;
        }
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex !== -1) {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = commandHistory[historyIndex];
                } else {
                    historyIndex = -1;
                    terminalInput.value = '';
                }
            }
            return;
        }
        
        // Tab completion (basic)
        if (e.key === 'Tab') {
            e.preventDefault();
            const input = terminalInput.value.trim().toLowerCase();
            const matches = Object.keys(commands).filter(cmd => cmd.startsWith(input));
            if (matches.length === 1) {
                terminalInput.value = matches[0];
            } else if (matches.length > 1) {
                // Show possible completions
                const completionLine = document.createElement('div');
                completionLine.style.color = '#94a3b8';
                completionLine.style.fontSize = '0.85rem';
                completionLine.textContent = `Possible completions: ${matches.join(', ')}`;
                terminalOutput.appendChild(completionLine);
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }
            return;
        }
        
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim();
            const commandLower = command.toLowerCase();
            terminalInput.value = '';
            
            // Reset history index
            historyIndex = -1;
            
            // Add to history if not empty
            if (command) {
                commandHistory.push(command);
                // Keep only last 50 commands
                if (commandHistory.length > 50) {
                    commandHistory.shift();
                }
            }
            
            // Display command
            const commandLine = document.createElement('div');
            commandLine.style.color = '#64ffda';
            commandLine.textContent = `ryan@devos:~$ ${command}`;
            terminalOutput.appendChild(commandLine);
            
            // Execute command
            if (command) {
                const output = document.createElement('div');
                output.style.color = '#e2e8f0';
                output.style.whiteSpace = 'pre-wrap';
                output.style.marginBottom = '1rem';
                output.style.fontFamily = 'JetBrains Mono, monospace';
                
                if (commands[commandLower]) {
                    output.textContent = commands[commandLower]();
                } else {
                    output.textContent = `Command not found: ${command}\nType 'help' for available commands`;
                    output.style.color = '#ef4444';
                }
                
                terminalOutput.appendChild(output);
            }
            
            // Scroll to bottom
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    });
}

// ===========================
// Dynamic Experience Years
// ===========================
function updateExperienceYears() {
    const startYear = 2018; // Started career in March 2018
    const currentYear = new Date().getFullYear();
    const yearsOfExperience = currentYear - startYear;
    
    // Update all instances after a small delay to ensure DOM is ready
    setTimeout(() => {
        document.querySelectorAll('#yearsExp, #yearsExp2, #yearsExp3').forEach(el => {
            if (el) el.textContent = yearsOfExperience;
        });
    }, 100);
}

// ===========================
// Theme Toggle
// ===========================
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    // Detect system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Get saved theme or use system preference
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    // Apply initial theme
    applyTheme(initialTheme);
    
    // Update icon based on initial theme
    updateThemeIcon(initialTheme === 'dark');
    
    // Listen for system preference changes (if no manual preference set)
    if (!savedTheme) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            const newTheme = e.matches ? 'dark' : 'light';
            applyTheme(newTheme);
            updateThemeIcon(newTheme === 'dark');
        });
    }
    
    // Toggle on click
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        applyTheme(newTheme);
        updateThemeIcon(newTheme === 'dark');
        
        // Save preference
        localStorage.setItem('theme', newTheme);
        
        // Show notification
        showNotification(newTheme === 'dark' ? '🌙 Dark mode activated' : '☀️ Light mode activated', 'success', 2000);
    });
    
    function applyTheme(theme) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }
    
    function updateThemeIcon(isDark) {
        const icon = themeToggle.querySelector('.icon');
        if (icon) {
            icon.textContent = isDark ? '🌙' : '☀️';
        }
    }
}

// ===========================
// GitHub Stats
// ===========================
function initializeGitHubStats() {
    const githubStats = document.getElementById('githubStats');
    if (!githubStats) return;
    
    githubStats.addEventListener('click', () => {
        // Open GitHub Stats window
        if (window.openApp) {
            window.openApp('github-stats');
        } else {
            showNotification('GitHub: 50+ projects | Top Rated on Upwork', 'success');
        }
    });
}

// ===========================
// Load GitHub Stats Data
// ===========================
async function loadGitHubStats() {
    const loadingEl = document.getElementById('githubStatsLoading');
    const errorEl = document.getElementById('githubStatsError');
    const contentEl = document.getElementById('githubStatsContent');
    
    if (!loadingEl || !errorEl || !contentEl) return;
    
    // Show loading, hide error and content
    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';
    contentEl.style.display = 'none';
    
    try {
        const username = 'ryanjamesindangan';
        
        // Fetch user data
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) throw new Error('Failed to fetch user data');
        const userData = await userResponse.json();
        
        // Fetch repositories (sorted by stars)
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=5`);
        if (!reposResponse.ok) throw new Error('Failed to fetch repositories');
        const reposData = await reposResponse.json();
        
        // Fetch recent events
        const eventsResponse = await fetch(`https://api.github.com/users/${username}/events/public?per_page=10`);
        if (!eventsResponse.ok) throw new Error('Failed to fetch events');
        const eventsData = await eventsResponse.json();
        
        // Calculate total stars
        const totalStars = reposData.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
        
        // Update user stats
        document.getElementById('githubPublicRepos').textContent = userData.public_repos || 0;
        document.getElementById('githubFollowers').textContent = userData.followers || 0;
        document.getElementById('githubFollowing').textContent = userData.following || 0;
        document.getElementById('githubTotalStars').textContent = totalStars;
        
        // Update top repositories
        const topReposEl = document.getElementById('githubTopRepos');
        if (topReposEl) {
            topReposEl.innerHTML = reposData.map(repo => `
                <div style="padding: 1.5rem; background: #fafafa; border: 1px solid #e0e0e0; border-left: 3px solid #2171d6; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                        <h4 style="color: #1a1a1a; font-size: 1.1rem; font-weight: 700; margin: 0;">
                            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" style="color: #2171d6; text-decoration: none;">
                                ${repo.name}
                            </a>
                        </h4>
                        <div style="display: flex; gap: 1rem; align-items: center;">
                            <span style="color: #666; font-size: 0.85rem;">⭐ ${repo.stargazers_count || 0}</span>
                            <span style="color: #666; font-size: 0.85rem;">🍴 ${repo.forks_count || 0}</span>
                        </div>
                    </div>
                    ${repo.description ? `<p style="color: #666; font-size: 0.9rem; margin-bottom: 0.5rem; line-height: 1.5;">${repo.description}</p>` : ''}
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        ${repo.language ? `<span style="padding: 0.25rem 0.75rem; background: #e8f4f8; border: 1px solid #d0e8f0; border-radius: 4px; color: #2171d6; font-size: 0.85rem; font-weight: 500;">${repo.language}</span>` : ''}
                        <span style="padding: 0.25rem 0.75rem; background: #f0f0f0; border: 1px solid #e0e0e0; border-radius: 4px; color: #666; font-size: 0.85rem;">
                            Updated ${formatDate(repo.updated_at)}
                        </span>
                    </div>
                </div>
            `).join('');
        }
        
        // Update recent activity
        const activityEl = document.getElementById('githubRecentActivity');
        if (activityEl) {
            activityEl.innerHTML = eventsData.slice(0, 5).map(event => {
                const eventType = event.type;
                const repo = event.repo.name;
                const date = formatDate(event.created_at);
                let icon = '📝';
                let description = '';
                
                switch(eventType) {
                    case 'PushEvent':
                        icon = '📤';
                        description = `Pushed ${event.payload.commits?.length || 0} commit(s) to ${repo}`;
                        break;
                    case 'CreateEvent':
                        icon = '✨';
                        description = `Created ${event.payload.ref_type} in ${repo}`;
                        break;
                    case 'WatchEvent':
                        icon = '⭐';
                        description = `Starred ${repo}`;
                        break;
                    case 'ForkEvent':
                        icon = '🍴';
                        description = `Forked ${repo}`;
                        break;
                    case 'IssuesEvent':
                        icon = '🐛';
                        description = `${event.payload.action} issue in ${repo}`;
                        break;
                    case 'PullRequestEvent':
                        icon = '🔀';
                        description = `${event.payload.action} pull request in ${repo}`;
                        break;
                    default:
                        description = `${eventType} in ${repo}`;
                }
                
                return `
                    <div style="padding: 1rem; background: #fafafa; border: 1px solid #e0e0e0; border-radius: 6px; display: flex; align-items: center; gap: 1rem;">
                        <div style="font-size: 1.5rem;">${icon}</div>
                        <div style="flex: 1;">
                            <div style="color: #1a1a1a; font-size: 0.9rem; font-weight: 500;">${description}</div>
                            <div style="color: #999; font-size: 0.8rem; margin-top: 0.25rem;">${date}</div>
                        </div>
                    </div>
                `;
            }).join('') || '<p style="color: #666; text-align: center; padding: 2rem;">No recent activity</p>';
        }
        
        // Hide loading, show content
        loadingEl.style.display = 'none';
        contentEl.style.display = 'block';
        
    } catch (error) {
        console.error('GitHub Stats Error:', error);
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
        
        // Show user-friendly error message
        const errorMessage = errorEl.querySelector('.error-message') || document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `
            <p style="color: #ef4444; margin-bottom: 1rem;">Failed to load GitHub statistics.</p>
            <p style="color: #666; font-size: 0.9rem; margin-bottom: 1rem;">${error.message || 'Network error or API rate limit exceeded.'}</p>
            <button onclick="loadGitHubStats()" style="padding: 0.5rem 1rem; background: #2171d6; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Retry
            </button>
        `;
        if (!errorEl.querySelector('.error-message')) {
            errorEl.appendChild(errorMessage);
        }
    }
}

// Helper function to format dates
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
}

// ===========================
// Enhanced Notification System
// ===========================
function showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notifications
    document.querySelectorAll('.notification-toast').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    
    const icons = {
        info: 'ℹ️',
        success: '✓',
        warning: '⚠️',
        error: '✕'
    };
    
    const colors = {
        info: '#64ffda',
        success: '#4caf50',
        warning: '#ffb900',
        error: '#ef4444'
    };
    
    notification.innerHTML = `
        <div class="notification-icon">${icons[type] || icons.info}</div>
        <div class="notification-message">${message}</div>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: rgba(30, 36, 66, 0.98);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid ${colors[type] || colors.info}40;
        border-left: 3px solid ${colors[type] || colors.info};
        border-radius: 8px;
        color: ${colors[type] || colors.info};
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        min-width: 300px;
        max-width: 400px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px ${colors[type] || colors.info}20;
        animation: notificationSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after duration
    setTimeout(() => {
        notification.style.animation = 'notificationSlideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Enhanced notification styles (CSS is in devos.css)

// ===========================
// Keyboard Shortcuts
// ===========================
document.addEventListener('keydown', (e) => {
    // Alt + A = About
    if (e.altKey && e.key === 'a') {
        e.preventDefault();
        openApp('about');
    }
    
    // Alt + S = Skills
    if (e.altKey && e.key === 's') {
        e.preventDefault();
        openApp('skills');
    }
    
    // Alt + E = Experience
    if (e.altKey && e.key === 'e') {
        e.preventDefault();
        openApp('experience');
    }
    
    // Alt + P = Projects
    if (e.altKey && e.key === 'p') {
        e.preventDefault();
        openApp('projects');
    }
    
    // Alt + C = Contact
    if (e.altKey && e.key === 'c') {
        e.preventDefault();
        openApp('contact');
    }
    
    // Alt + T = Terminal
    if (e.altKey && e.key === 't') {
        e.preventDefault();
        openApp('terminal');
    }
});

// ===========================
// Selection Box (Rubber Band)
// ===========================
function initializeSelectionBox() {
    const desktop = document.querySelector('.desktop');
    let isSelecting = false;
    let startX, startY;
    let selectionBox = null;
    
    desktop.addEventListener('mousedown', (e) => {
        // Only start selection if clicking on desktop (not on icons or windows)
        if (e.target === desktop || e.target.classList.contains('wallpaper')) {
            isSelecting = true;
            startX = e.clientX;
            startY = e.clientY;
            
            // Create selection box
            selectionBox = document.createElement('div');
            selectionBox.className = 'selection-box';
            selectionBox.style.left = startX + 'px';
            selectionBox.style.top = startY + 'px';
            desktop.appendChild(selectionBox);
            
            // Deselect all icons
            deselectAllIcons();
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isSelecting || !selectionBox) return;
        
        const currentX = e.clientX;
        const currentY = e.clientY;
        
        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);
        const left = Math.min(startX, currentX);
        const top = Math.min(startY, currentY);
        
        selectionBox.style.left = left + 'px';
        selectionBox.style.top = top + 'px';
        selectionBox.style.width = width + 'px';
        selectionBox.style.height = height + 'px';
        
        // Check which icons are within selection box
        const selectionRect = selectionBox.getBoundingClientRect();
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            const iconRect = icon.getBoundingClientRect();
            
            // Check if icon overlaps with selection box
            const isOverlapping = !(
                iconRect.right < selectionRect.left ||
                iconRect.left > selectionRect.right ||
                iconRect.bottom < selectionRect.top ||
                iconRect.top > selectionRect.bottom
            );
            
            if (isOverlapping) {
                icon.classList.add('selected');
            } else {
                icon.classList.remove('selected');
            }
        });
    });
    
    document.addEventListener('mouseup', () => {
        if (isSelecting && selectionBox) {
            // Remove selection box
            selectionBox.remove();
            selectionBox = null;
            isSelecting = false;
            
            // Update selected icon reference
            const selectedIcons = document.querySelectorAll('.desktop-icon.selected');
            if (selectedIcons.length === 1) {
                selectedIcon = selectedIcons[0];
            } else if (selectedIcons.length > 1) {
                selectedIcon = selectedIcons[selectedIcons.length - 1];
            }
        }
    });
}

// ===========================
// Auto-Open Apps on Boot
// ===========================
function autoOpenApps() {
    // Check if on mobile (don't auto-open on mobile to avoid clutter)
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // On mobile, just show a welcome notification
        showNotification('👋 Welcome! Tap Menu to explore', 'info');
        return;
    }
    
    // Ensure windowManager is initialized
    if (!window.windowManager) {
        console.error('WindowManager not initialized, retrying...');
        setTimeout(autoOpenApps, 100);
        return;
    }
    
    // Desktop: Open apps in a 3-column layout matching the screenshot
    // Left column: About Me (top) + Tech Stack (bottom)
    // Middle column: Professional Journey (top) + Showcase/Projects (bottom)
    // Right column: Professional Credentials (top)
    const appsToOpen = [
        { id: 'about', delay: 0, position: 'top-left' },
        { id: 'skills', delay: 150, position: 'bottom-left' },
        { id: 'experience', delay: 300, position: 'top-center' },
        { id: 'projects', delay: 450, position: 'bottom-center' },
        { id: 'certifications', delay: 600, position: 'top-right' }
    ];
    
    appsToOpen.forEach(app => {
        setTimeout(() => {
            openApp(app.id, app.position);
        }, app.delay);
    });
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('✨ Portfolio ready! Explore each section', 'success');
    }, 1500);
}

// ===========================
// Certificate Modal
// ===========================
function initializeCertificateModal() {
    const modal = document.getElementById('certificateModal');
    const modalTitle = document.getElementById('certModalTitle');
    const modalBody = document.getElementById('certModalBody');
    const downloadBtn = document.getElementById('certDownloadBtn');
    const closeBtn = document.getElementById('certModalClose');
    const overlay = modal.querySelector('.cert-modal-overlay');
    
    // Close modal function
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Open modal function
    function openModal(certPath, title, type) {
        modalTitle.textContent = title;
        modalBody.innerHTML = '';
        
        // Properly encode the path for use in URLs
        // Split the path into directory and filename, encode only the filename
        const pathParts = certPath.split('/');
        const filename = pathParts.pop();
        const directory = pathParts.join('/');
        const encodedPath = directory ? `${directory}/${encodeURIComponent(filename)}` : encodeURIComponent(filename);
        
        if (type === 'pdf') {
            // Use iframe for better compatibility
            modalBody.innerHTML = `
                <div style="width: 100%; height: 100%; display: flex; flex-direction: column;">
                    <div style="flex: 1; position: relative; min-height: 500px;">
                        <iframe 
                            src="${encodedPath}#toolbar=1&navpanes=0&scrollbar=1&view=FitH" 
                            type="application/pdf"
                            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; background: #525659;"
                            onload="this.style.background='#fff';"
                        ></iframe>
                    </div>
                    <div style="padding: 1rem; background: rgba(0, 120, 215, 0.1); border-radius: 8px; text-align: center; margin-top: 1rem;">
                        <p style="color: var(--text-secondary); margin-bottom: 1rem; font-size: 0.9rem;">
                            📄 PDF Document • Use the buttons below for more options
                        </p>
                        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                            <a href="${encodedPath}" target="_blank" rel="noopener noreferrer"
                               style="padding: 0.75rem 1.5rem; background: var(--windows-blue); color: #fff; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem;">
                                🔗 Open in New Tab
                            </a>
                            <a href="${encodedPath}" download="${filename}"
                               style="padding: 0.75rem 1.5rem; background: var(--success); color: #fff; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem;">
                                📥 Download PDF
                            </a>
                        </div>
                    </div>
                </div>
            `;
        } else {
            modalBody.innerHTML = `<img src="${encodedPath}" alt="${title}" loading="lazy" />`;
        }
        
        downloadBtn.href = encodedPath;
        downloadBtn.download = filename;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Event listeners
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Listen for certificate button clicks (delegated event)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-cert-btn') || e.target.closest('.view-cert-btn')) {
            const btn = e.target.classList.contains('view-cert-btn') ? e.target : e.target.closest('.view-cert-btn');
            const certPath = btn.dataset.cert;
            const title = btn.dataset.title;
            const type = btn.dataset.type;
            
            if (certPath && title && type) {
                e.preventDefault();
                openModal(certPath, title, type);
            }
        }
    });
}

// ===========================
// AI Assistant Chatbot
// ===========================
function initializeAIAssistant() {
    const widget = document.getElementById('aiAssistantWidget');
    const toggleBtn = document.getElementById('aiAssistantToggle');
    const closeBtn = document.getElementById('aiAssistantClose');
    const minimizeBtn = document.getElementById('aiMinimizeBtn');
    const chatInput = document.getElementById('aiChatInput');
    const sendBtn = document.getElementById('aiSendBtn');
    const chatMessages = document.getElementById('aiChatMessages');
    
    if (!widget || !chatMessages) return;
    
    // Check if widget was previously closed
    const wasClosed = localStorage.getItem('aiAssistantClosed') === 'true';
    if (wasClosed) {
        widget.classList.add('hidden');
        if (toggleBtn) toggleBtn.classList.add('visible');
    } else {
        if (toggleBtn) toggleBtn.classList.remove('visible');
    }

    // Load conversation history or show initial greeting
    if (window.portfolioChatbot && window.portfolioChatbot.conversationHistory.length > 0) {
        chatMessages.innerHTML = '';
        window.portfolioChatbot.conversationHistory.forEach((msg, index) => {
            // Generate message ID for reactions
            const messageId = msg.messageId || `msg-${Date.now()}-${index}`;
            addChatMessage(msg.message, msg.role, msg.suggestions || [], messageId);
            
            // Restore reactions if any (after DOM is ready)
            requestAnimationFrame(() => {
                const reactions = JSON.parse(localStorage.getItem('chatbotReactions') || '{}');
                if (reactions[messageId]) {
                    const messageEl = chatMessages.querySelector(`[data-message-id="${messageId}"]`);
                    if (messageEl) {
                        const reactionBtn = messageEl.querySelector(`[data-reaction="${reactions[messageId]}"]`);
                        if (reactionBtn) {
                            reactionBtn.classList.add('active');
                        }
                    }
                }
            });
        });
        scrollChatToBottom();
    } else {
        // Show initial greeting with suggestions if no history
        const userName = window.portfolioChatbot && window.portfolioChatbot.userName 
            ? ` ${window.portfolioChatbot.userName}` 
            : '';
        const initialGreeting = {
            text: userName 
                ? `Hello${userName}! 👋 Welcome back! I'm Ryan's AI Assistant. How can I help you today?`
                : "Hello! 👋 I'm Ryan's AI Assistant. I can help you learn about his skills, experience, projects, and AI/ML expertise. What would you like to know?",
            suggestions: [
                "What are your skills?",
                "Tell me about your AI work",
                "Show me your experience",
                "What projects have you built?"
            ]
        };
        addChatMessage(initialGreeting.text, 'assistant', initialGreeting.suggestions);
        
        // Add a subtle disclaimer after a short delay (only on first load, if user hasn't interacted)
        setTimeout(() => {
            const chatMessages = document.getElementById('aiChatMessages');
            if (chatMessages && chatMessages.children.length <= 1 && !window.portfolioChatbot.conversationHistory.length) {
                const disclaimer = {
                    text: `💡 **Note**: I'm a rule-based chatbot built with vanilla JavaScript. I use pattern matching to answer questions about Ryan's portfolio. This demonstrates client-side interactivity without external APIs.`,
                    suggestions: []
                };
                addChatMessage(disclaimer.text, 'assistant', disclaimer.suggestions);
            }
        }, 3000);
    }

    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAIAssistant();
        });
    }

    // Minimize button
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            minimizeAIAssistant();
        });
    }

    // Toggle button
    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showAIAssistant();
        });
    }
    
    // Menu button and dropdown
    const menuBtn = document.getElementById('aiMenuBtn');
    const menuDropdown = document.getElementById('aiMenuDropdown');
    const clearChatBtn = document.getElementById('aiClearChatBtn');
    const clearMemoryBtn = document.getElementById('aiClearMemoryBtn');
    const exportChatBtn = document.getElementById('aiExportChatBtn');
    const copyChatBtn = document.getElementById('aiCopyChatBtn');
    const helpBtn = document.getElementById('aiHelpBtn');
    
    if (menuBtn && menuDropdown) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const isShowing = menuDropdown.classList.contains('show');
            // Close all other dropdowns first
            document.querySelectorAll('.ai-menu-dropdown.show').forEach(dd => {
                if (dd !== menuDropdown) dd.classList.remove('show');
            });
            // Toggle this dropdown
            if (isShowing) {
                menuDropdown.classList.remove('show');
            } else {
                menuDropdown.classList.add('show');
            }
        });
        
        // Close dropdown when clicking outside
        const closeDropdown = (e) => {
            if (menuDropdown && menuDropdown.classList.contains('show')) {
                if (!menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
                    menuDropdown.classList.remove('show');
                }
            }
        };
        
        // Use capture phase to ensure it fires before other click handlers
        document.addEventListener('click', closeDropdown, true);
    }
    
    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            clearChat();
            if (menuDropdown) menuDropdown.classList.remove('show');
        });
    }
    
    if (clearMemoryBtn) {
        clearMemoryBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            clearChatbotMemory();
            if (menuDropdown) menuDropdown.classList.remove('show');
        });
    }
    
    if (exportChatBtn) {
        exportChatBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            exportConversation();
            if (menuDropdown) menuDropdown.classList.remove('show');
        });
    }
    
    if (copyChatBtn) {
        copyChatBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            copyConversationToClipboard();
            if (menuDropdown) menuDropdown.classList.remove('show');
        });
    }
    
    if (helpBtn) {
        helpBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (window.sendChatMessage) {
                window.sendChatMessage('help');
            }
            if (menuDropdown) menuDropdown.classList.remove('show');
        });
    }
    
    // Conversation Mode Selector
    const modeItems = document.querySelectorAll('.mode-item');
    const updateModeDisplay = () => {
        if (window.portfolioChatbot) {
            const currentMode = window.portfolioChatbot.conversationMode || 'professional';
            modeItems.forEach(item => {
                if (item.dataset.mode === currentMode) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    };
    
    // Initialize mode display
    updateModeDisplay();
    
    modeItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const mode = item.dataset.mode;
            if (window.portfolioChatbot) {
                window.portfolioChatbot.setConversationMode(mode);
                updateModeDisplay();
                
                // Show notification
                const modeNames = {
                    'professional': 'Professional',
                    'casual': 'Casual',
                    'technical': 'Technical'
                };
                showNotification(`Switched to ${modeNames[mode]} Mode`, 'success', 2000);
            }
            if (menuDropdown) menuDropdown.classList.remove('show');
        });
    });

    // Send message on Enter
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        });

        // Send button
        if (sendBtn) {
            sendBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                sendChatMessage();
            });
        }
    }
    
    // Phase 4: Conversation Search
    const searchBtn = document.getElementById('aiSearchBtn');
    const searchContainer = document.getElementById('aiSearchContainer');
    const searchInput = document.getElementById('aiSearchInput');
    const searchClose = document.getElementById('aiSearchClose');
    
    if (searchBtn && searchContainer && searchInput) {
        // Toggle search container
        searchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const isVisible = searchContainer.classList.contains('show');
            if (isVisible) {
                closeSearch();
            } else {
                openSearch();
            }
        });
        
        // Close search
        if (searchClose) {
            searchClose.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                closeSearch();
            });
        }
        
        // Search on input
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length === 0) {
                clearSearchHighlights();
                return;
            }
            
            // Debounce search
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300);
        });
        
        // Search on Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = searchInput.value.trim();
                if (query) {
                    performSearch(query);
                }
            }
        });
        
        // Close search on Escape
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSearch();
            }
        });
    }
    
    // Phase 4: Voice Input - Use existing function
    const voiceBtn = document.getElementById('aiVoiceBtn');
    if (voiceBtn && chatInput) {
        console.log('Initializing voice input...'); // Debug log
        initializeVoiceInput(voiceBtn, chatInput);
    } else {
        console.warn('Voice button or chat input not found:', { voiceBtn: !!voiceBtn, chatInput: !!chatInput });
        // Retry after a short delay
        setTimeout(() => {
            const retryVoiceBtn = document.getElementById('aiVoiceBtn');
            const retryChatInput = document.getElementById('aiChatInput');
            if (retryVoiceBtn && retryChatInput) {
                console.log('Retrying voice input initialization...');
                initializeVoiceInput(retryVoiceBtn, retryChatInput);
            }
        }, 500);
    }
}

window.sendChatMessage = function(messageText = null) {
    const chatInput = document.getElementById('aiChatInput');
    const chatMessages = document.getElementById('aiChatMessages');
    const sendBtn = document.getElementById('aiSendBtn');
    
    if (!chatInput || !chatMessages || !window.portfolioChatbot) return;
    
    let message = messageText || chatInput.value.trim();
    if (!message) return;
    
    // XSS Prevention: Sanitize user input before processing
    message = sanitizeUserInput(message);
    if (!message) return; // If sanitization removed everything, don't send

    // Disable input while processing
    chatInput.disabled = true;
    if (sendBtn) sendBtn.disabled = true;

    // Clear input if using text input
    if (!messageText) {
        chatInput.value = '';
    }

    // Add user message
    addChatMessage(message, 'user');
    scrollChatToBottom();
    
    // Trigger deterministic animation for message sent (if desktop clippy exists)
    if (window.desktopClippy && window.desktopClippy.trigger) {
        window.desktopClippy.trigger('message-sent');
    }

    // Show typing indicator
    showTypingIndicator();

    // Simulate typing delay
    setTimeout(() => {
        // Get bot response (now returns object with text and suggestions)
        const response = window.portfolioChatbot.processMessage(message);
        
        // Hide typing indicator
        hideTypingIndicator();
        
        // Handle special actions
        if (response.action) {
            if (response.action.type === 'clearChat') {
                clearChat();
            } else if (response.action.type === 'clearMemory') {
                clearChatbotMemory();
            }
        }
        
        // Add bot response with suggestions
        // Get messageId from the last conversation history entry
        const lastMessage = window.portfolioChatbot.conversationHistory[window.portfolioChatbot.conversationHistory.length - 1];
        const messageId = lastMessage && lastMessage.messageId ? lastMessage.messageId : null;
        addChatMessage(response.text, 'assistant', response.suggestions || [], messageId);
        
        // Trigger deterministic animation for assistant response (if desktop clippy exists)
        if (window.desktopClippy && window.desktopClippy.trigger) {
            window.desktopClippy.trigger('assistant-response');
        }
        
        // Restore reaction if exists (after DOM is ready)
        if (messageId) {
            // Use requestAnimationFrame for better timing
            requestAnimationFrame(() => {
                const reactions = JSON.parse(localStorage.getItem('chatbotReactions') || '{}');
                if (reactions[messageId]) {
                    const messageEl = document.querySelector(`[data-message-id="${messageId}"]`);
                    if (messageEl) {
                        const reactionBtn = messageEl.querySelector(`[data-reaction="${reactions[messageId]}"]`);
                        if (reactionBtn) {
                            reactionBtn.classList.add('active');
                        }
                    }
                }
            });
        }
        
        scrollChatToBottom();

        // Re-enable input
        chatInput.disabled = false;
        if (sendBtn) sendBtn.disabled = false;
        chatInput.focus();
    }, 500 + Math.random() * 500); // Random delay between 500-1000ms for more natural feel
}

function addChatMessage(message, role, suggestions = [], messageId = null) {
    const chatMessages = document.getElementById('aiChatMessages');
    if (!chatMessages) return;

    const messageEl = document.createElement('div');
    messageEl.className = `ai-message ai-message-${role}`;
    
    // Generate unique ID for message if not provided
    if (!messageId) {
        messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    messageEl.dataset.messageId = messageId;
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    
    // Build suggestions HTML if provided (only for assistant messages)
    let suggestionsHTML = '';
    if (role === 'assistant' && suggestions && suggestions.length > 0) {
        suggestionsHTML = `
            <div class="ai-quick-replies">
                ${suggestions.map(suggestion => {
                    // Escape HTML to prevent XSS
                    const safeSuggestion = escapeHtml(suggestion);
                    // Use data attribute instead of onclick for security
                    return `<button class="ai-quick-reply-btn" data-suggestion="${escapeHtml(suggestion)}">
                        ${safeSuggestion}
                    </button>`;
                }).join('')}
            </div>
        `;
    }
    
    // Add reaction buttons for assistant messages
    let reactionsHTML = '';
    if (role === 'assistant') {
        reactionsHTML = `
            <div class="ai-message-reactions">
                <button class="ai-reaction-btn" data-reaction="👍" data-message-id="${messageId}" title="Like">👍</button>
                <button class="ai-reaction-btn" data-reaction="❤️" data-message-id="${messageId}" title="Love">❤️</button>
                <button class="ai-reaction-btn" data-reaction="👎" data-message-id="${messageId}" title="Dislike">👎</button>
            </div>
        `;
    }
    
    // Determine if this is a user message for proper sanitization
    const isUserMessage = role === 'user';
    
    // Format message with proper XSS protection
    const formattedMessage = formatChatMessage(message, isUserMessage);
    
    messageEl.innerHTML = `
        <div class="ai-message-avatar">${role === 'user' ? '👤' : getClippyAvatar()}</div>
        <div class="ai-message-content">
            <div class="ai-message-text">${formattedMessage}</div>
            ${suggestionsHTML}
            ${reactionsHTML}
            <div class="ai-message-time">${escapeHtml(timeStr)}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageEl);
    
    // Store original HTML for search functionality (after DOM is created and listeners attached)
    const textEl = messageEl.querySelector('.ai-message-text');
    if (textEl && !textEl.hasAttribute('data-original-html')) {
        textEl.setAttribute('data-original-html', textEl.innerHTML);
    }
    
    // Attach event listeners for action buttons (Open App, etc.)
    attachChatActionListeners(messageEl);
    
    // Attach quick reply button listeners (secure - no onclick)
    attachQuickReplyListeners(messageEl);
    
    // Attach reaction button listeners
    if (role === 'assistant') {
        attachReactionListeners(messageEl);
    }
}

// XSS Prevention: Sanitize user input before processing
function sanitizeUserInput(input) {
    if (!input) return '';
    
    // Remove/nullify dangerous patterns
    let sanitized = input
        // Remove script tags and content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        // Remove event handlers (onclick, onerror, etc.)
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
        // Remove javascript: protocol
        .replace(/javascript:/gi, '')
        // Remove data: protocol (can contain scripts)
        .replace(/data:text\/html/gi, '')
        // Remove vbscript: protocol
        .replace(/vbscript:/gi, '')
        // Remove iframe tags
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        // Remove object/embed tags
        .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
        .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
        // Remove style tags that could contain scripts
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        // Remove link tags with javascript
        .replace(/<link[^>]*href\s*=\s*["']?javascript:/gi, '')
        // Remove meta refresh redirects
        .replace(/<meta[^>]*http-equiv\s*=\s*["']?refresh["']?[^>]*>/gi, '');
    
    return sanitized.trim();
}

// XSS Prevention: HTML Entity Escaping
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// XSS Prevention: Sanitize URL to prevent javascript: and data: protocols
function sanitizeUrl(url) {
    if (!url) return '';
    const trimmed = url.trim();
    const lower = trimmed.toLowerCase();
    
    // Block dangerous protocols
    if (lower.startsWith('javascript:') || 
        lower.startsWith('data:') || 
        lower.startsWith('vbscript:') ||
        lower.startsWith('file:') ||
        lower.startsWith('about:')) {
        return '#';
    }
    
    // Only allow http, https, and mailto
    if (lower.startsWith('http://') || 
        lower.startsWith('https://') || 
        lower.startsWith('mailto:')) {
        return trimmed;
    }
    
    // If no protocol, assume it's not a valid URL
    return '#';
}

// XSS Prevention: Sanitize app name to prevent injection
function sanitizeAppName(appName) {
    if (!appName) return '';
    // Remove any HTML tags and dangerous characters
    return appName
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/[<>'"&]/g, '') // Remove dangerous characters
        .trim()
        .substring(0, 50); // Limit length
}

function formatChatMessage(text, isUserMessage = false) {
    if (!text) return '';
    
    // For user messages, escape ALL HTML first to prevent XSS
    if (isUserMessage) {
        // Escape HTML entities
        text = escapeHtml(text);
        
        // Then allow safe formatting (markdown that doesn't create script tags)
        // Convert markdown-style formatting to HTML (safe because text is already escaped)
        text = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code style="background: rgba(100, 255, 218, 0.2); padding: 0.2em 0.4em; border-radius: 3px; font-family: monospace; font-size: 0.9em;">$1</code>')
            .replace(/\n/g, '<br>');
        
        // Convert URLs to clickable links (with sanitization)
        text = text.replace(/(https?:\/\/[^\s<>"']+)/g, (match) => {
            const sanitized = sanitizeUrl(match);
            if (sanitized === '#') {
                return escapeHtml(match); // Show as plain text if dangerous
            }
            const escapedUrl = escapeHtml(match);
            return `<a href="${sanitized}" target="_blank" rel="noopener noreferrer" style="color: #64ffda; text-decoration: underline;">${escapedUrl}</a>`;
        });
        
        return text;
    }
    
    // For assistant messages (trusted), allow more formatting
    // But still sanitize dangerous elements
    
    // Convert [Open AppName] to clickable action buttons (with sanitization)
    text = text.replace(/\[Open (.+?)\]/g, (match, appName) => {
        const sanitizedAppName = sanitizeAppName(appName);
        const appId = mapAppNameToId(sanitizedAppName);
        if (appId) {
            const escapedAppName = escapeHtml(sanitizedAppName);
            // Use data attributes and event listeners instead of onclick for security
            return `<button class="chat-action-btn" data-app-id="${escapeHtml(appId)}" data-action="open-app">📂 Open ${escapedAppName}</button>`;
        }
        return escapeHtml(match); // Escape if not a valid app
    });
    
    // Convert URLs to clickable links (with sanitization)
    text = text.replace(/(https?:\/\/[^\s<>"']+)/g, (match) => {
        const sanitized = sanitizeUrl(match);
        if (sanitized === '#') {
            return escapeHtml(match); // Show as plain text if dangerous
        }
        const escapedUrl = escapeHtml(match);
        return `<a href="${sanitized}" target="_blank" rel="noopener noreferrer" style="color: #64ffda; text-decoration: underline;">${escapedUrl}</a>`;
    });
    
    // Convert markdown-style formatting to HTML
    // Escape content inside markdown to prevent XSS
    text = text
        .replace(/\*\*(.*?)\*\*/g, (match, content) => `<strong>${escapeHtml(content)}</strong>`)
        .replace(/\*(.*?)\*/g, (match, content) => `<em>${escapeHtml(content)}</em>`)
        .replace(/`(.*?)`/g, (match, content) => `<code style="background: rgba(100, 255, 218, 0.2); padding: 0.2em 0.4em; border-radius: 3px; font-family: monospace; font-size: 0.9em;">${escapeHtml(content)}</code>`)
        .replace(/\n/g, '<br>');
    
    return text;
}

function mapAppNameToId(appName) {
    const appMap = {
        'technical skills': 'skills',
        'tech stack': 'skills',
        'skills': 'skills',
        'work experience': 'experience',
        'experience': 'experience',
        'projects': 'projects',
        'ai lab': 'ai-lab',
        'ai': 'ai-lab',
        'certifications': 'certifications',
        'certificates': 'certifications',
        'about me': 'about',
        'about': 'about',
        'contact': 'contact',
        'resume': 'resume',
        'terminal': 'terminal',
        'snake game': 'snake',
        'snake': 'snake'
    };
    
    return appMap[appName.toLowerCase()] || null;
}

function attachReactionListeners(messageEl) {
    const reactionBtns = messageEl.querySelectorAll('.ai-reaction-btn');
    reactionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const reaction = btn.dataset.reaction;
            const messageId = btn.dataset.messageId;
            handleMessageReaction(messageId, reaction, btn);
        });
    });
}

function handleMessageReaction(messageId, reaction, btn) {
    // Toggle reaction
    const isActive = btn.classList.contains('active');
    const reactionsContainer = btn.closest('.ai-message-reactions');
    
    // Remove active state from all buttons
    reactionsContainer.querySelectorAll('.ai-reaction-btn').forEach(b => {
        b.classList.remove('active');
    });
    
    if (!isActive) {
        btn.classList.add('active');
        // Store reaction in localStorage
        const reactions = JSON.parse(localStorage.getItem('chatbotReactions') || '{}');
        reactions[messageId] = reaction;
        localStorage.setItem('chatbotReactions', JSON.stringify(reactions));
        
        // Show brief animation
        btn.style.transform = 'scale(1.3)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 200);
    } else {
        // Remove reaction
        const reactions = JSON.parse(localStorage.getItem('chatbotReactions') || '{}');
        delete reactions[messageId];
        localStorage.setItem('chatbotReactions', JSON.stringify(reactions));
    }
}

function attachQuickReplyListeners(messageEl) {
    // Handle quick reply buttons (secure - uses data attributes instead of onclick)
    const quickReplyBtns = messageEl.querySelectorAll('.ai-quick-reply-btn[data-suggestion]');
    quickReplyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const suggestion = btn.dataset.suggestion;
            if (suggestion && typeof window.sendChatMessage === 'function') {
                // Sanitize before sending
                const sanitized = sanitizeUserInput(suggestion);
                if (sanitized) {
                    window.sendChatMessage(sanitized);
                }
            }
        });
    });
}

function attachChatActionListeners(messageEl) {
    // Handle action buttons (Open App buttons)
    // Use data-action instead of onclick for security
    const actionButtons = messageEl.querySelectorAll('.chat-action-btn[data-action="open-app"]');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const appId = btn.dataset.appId;
            // Validate appId to prevent injection
            if (appId && /^[a-z0-9-]+$/.test(appId)) {
                if (typeof openApp === 'function') {
                    openApp(appId);
                }
            }
        });
    });
}

function scrollChatToBottom() {
    const chatMessages = document.getElementById('aiChatMessages');
    if (chatMessages) {
        // Small delay to ensure DOM is updated
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 50);
    }
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('aiChatMessages');
    if (!chatMessages) return;
    
    // Remove existing typing indicator if any
    const existing = chatMessages.querySelector('.ai-typing-indicator');
    if (existing) existing.remove();
    
    const typingEl = document.createElement('div');
    typingEl.className = 'ai-message ai-message-assistant ai-typing-indicator';
    typingEl.innerHTML = `
        <div class="ai-message-avatar"><img src="assets/clippy/clippy.png" alt="Clippy" class="clippy-avatar"></div>
        <div class="ai-message-content">
            <div class="ai-message-text ai-typing-text">
                <span class="ai-typing-dot"></span>
                <span class="ai-typing-dot"></span>
                <span class="ai-typing-dot"></span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingEl);
    scrollChatToBottom();
}

function hideTypingIndicator() {
    const chatMessages = document.getElementById('aiChatMessages');
    if (!chatMessages) return;
    
    // Trigger Clippy deterministic animation for typing end
    if (window.desktopClippy && window.desktopClippy.trigger) {
        window.desktopClippy.trigger('typing-ends');
    }
    
    const typingEl = chatMessages.querySelector('.ai-typing-indicator');
    if (typingEl) {
        typingEl.style.opacity = '0';
        setTimeout(() => typingEl.remove(), 200);
    }
}

function closeAIAssistant() {
    const widget = document.getElementById('aiAssistantWidget');
    const toggleBtn = document.getElementById('aiAssistantToggle');
    
    if (widget) {
        widget.classList.add('hidden');
        localStorage.setItem('aiAssistantClosed', 'true');
    }
    
    if (toggleBtn) {
        toggleBtn.classList.add('visible');
    }
}

function minimizeAIAssistant() {
    closeAIAssistant();
}

function clearChat() {
    const chatMessages = document.getElementById('aiChatMessages');
    if (!chatMessages) return;
    
    chatMessages.innerHTML = '';
    
    // Show initial greeting again
    const initialGreeting = {
        text: window.portfolioChatbot && window.portfolioChatbot.userName
            ? `Hello ${window.portfolioChatbot.userName}! 👋 Chat cleared. How can I help you?`
            : "Hello! 👋 Chat cleared. I'm Ryan's AI Assistant. What would you like to know?",
        suggestions: [
            "What are your skills?",
            "Tell me about your AI work",
            "Show me your experience",
            "What projects have you built?"
        ]
    };
    addChatMessage(initialGreeting.text, 'assistant', initialGreeting.suggestions);
    scrollChatToBottom();
}

function clearChatbotMemory() {
    if (!window.portfolioChatbot) return;
    
    // Clear everything
    window.portfolioChatbot.clearHistory();
    window.portfolioChatbot.userName = null;
    localStorage.removeItem('chatbotUserName');
    
    // Clear chat UI
    const chatMessages = document.getElementById('aiChatMessages');
    if (chatMessages) {
        chatMessages.innerHTML = '';
        
        // Show fresh greeting
        const initialGreeting = {
            text: "Hello! 👋 I'm Ryan's AI Assistant. I've cleared my memory and forgotten our conversation. How can I help you?",
            suggestions: [
                "What are your skills?",
                "Tell me about your AI work",
                "Show me your experience",
                "What projects have you built?"
            ]
        };
        addChatMessage(initialGreeting.text, 'assistant', initialGreeting.suggestions);
        scrollChatToBottom();
    }
}

function showAIAssistant() {
    const widget = document.getElementById('aiAssistantWidget');
    const toggleBtn = document.getElementById('aiAssistantToggle');
    const chatInput = document.getElementById('aiChatInput');
    
    if (widget) {
        widget.classList.remove('hidden');
        localStorage.setItem('aiAssistantClosed', 'false');
    }
    
    if (toggleBtn) {
        toggleBtn.classList.remove('visible');
    }

    // Focus input
    if (chatInput) {
        setTimeout(() => chatInput.focus(), 100);
    }
    
    // Trigger deterministic animation for chat opening
    if (window.desktopClippy && window.desktopClippy.trigger) {
        window.desktopClippy.trigger('chat-opens');
    }
}

function exportConversation() {
    if (!window.portfolioChatbot) return;
    
    const history = window.portfolioChatbot.conversationHistory;
    if (history.length === 0) {
        window.showNotification('No conversation to export', 'warning');
        return;
    }
    
    // Format conversation as readable text
    const lines = [
        '='.repeat(60),
        'Ryan James Indangan - Portfolio Chat Conversation',
        '='.repeat(60),
        `Exported: ${new Date().toLocaleString()}`,
        '',
    ];
    
    history.forEach((msg, index) => {
        const timestamp = new Date(msg.timestamp).toLocaleString();
        const role = msg.role === 'user' ? 'You' : 'AI Assistant';
        
        // Clean message text - remove HTML tags and markdown
        let message = msg.message || '';
        // Remove HTML tags
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = message;
        message = tempDiv.textContent || tempDiv.innerText || message;
        
        // Remove markdown formatting
        message = message.replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold
                        .replace(/\*(.*?)\*/g, '$1') // Remove markdown italic
                        .replace(/`(.*?)`/g, '$1') // Remove markdown code
                        .replace(/\[Open (.+?)\]/g, '$1') // Remove app links
                        .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
                        .trim();
        
        lines.push(`[${index + 1}] ${role} (${timestamp})`);
        lines.push('-'.repeat(60));
        lines.push(message);
        if (msg.suggestions && msg.suggestions.length > 0) {
            lines.push(`\nSuggested: ${msg.suggestions.join(', ')}`);
        }
        lines.push('');
    });
    
    lines.push('='.repeat(60));
    lines.push('End of Conversation');
    lines.push('='.repeat(60));
    
    const text = lines.join('\n');
    
    // Create and download file
    try {
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const dateStr = new Date().toISOString().split('T')[0];
        const timeStr = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
        a.download = `ryan-portfolio-chat-${dateStr}-${timeStr}.txt`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        
        window.showNotification('Conversation exported! 📥', 'success');
    } catch (error) {
        console.error('Export error:', error);
        window.showNotification('Failed to export conversation. Please try copying instead.', 'error');
    }
}

function copyConversationToClipboard() {
    if (!window.portfolioChatbot) return;
    
    const history = window.portfolioChatbot.conversationHistory;
    if (history.length === 0) {
        window.showNotification('No conversation to copy', 'warning');
        return;
    }
    
    // Format conversation for clipboard
    const lines = [
        'Ryan James Indangan - Portfolio Chat Conversation',
        `Exported: ${new Date().toLocaleString()}`,
        '',
    ];
    
    history.forEach((msg) => {
        const timestamp = new Date(msg.timestamp).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit' 
        });
        const role = msg.role === 'user' ? 'You' : 'AI Assistant';
        
        // Clean message text - remove HTML tags and markdown
        let message = msg.message || '';
        // Remove HTML tags
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = message;
        message = tempDiv.textContent || tempDiv.innerText || message;
        
        // Remove markdown formatting
        message = message.replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold
                        .replace(/\*(.*?)\*/g, '$1') // Remove markdown italic
                        .replace(/`(.*?)`/g, '$1') // Remove markdown code
                        .replace(/\[Open (.+?)\]/g, '$1') // Remove app links
                        .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
                        .trim();
        
        lines.push(`${role} (${timestamp}): ${message}`);
    });
    
    const text = lines.join('\n');
    
    // Copy to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            window.showNotification('Conversation copied to clipboard! 📋', 'success');
        }).catch(() => {
            // Fallback for older browsers
            fallbackCopyToClipboard(text);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            window.showNotification('Conversation copied to clipboard! 📋', 'success');
        } else {
            window.showNotification('Failed to copy. Please try exporting instead.', 'error');
        }
    } catch (err) {
        window.showNotification('Failed to copy. Please try exporting instead.', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Make functions globally available
window.closeAIAssistant = closeAIAssistant;
window.showAIAssistant = showAIAssistant;
window.minimizeAIAssistant = minimizeAIAssistant;
window.openApp = openApp; // Make openApp globally available for chatbot actions
window.exportConversation = exportConversation;
window.copyConversationToClipboard = copyConversationToClipboard;

// Voice Input (Speech-to-Text)
function initializeVoiceInput(voiceBtn, chatInput) {
    let recognition = null;
    let isRecording = false;
    let capturedTranscript = ''; // Store transcript when manually stopped
    
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.warn('SpeechRecognition API not available');
        voiceBtn.style.opacity = '0.5';
        voiceBtn.title = 'Voice input not supported in this browser';
        voiceBtn.disabled = true;
        return;
    }
    
    console.log('SpeechRecognition API available, initializing...');
    
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true; // Enable interim results to capture partial transcripts
    recognition.lang = 'en-US';
    
    voiceBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        console.log('Voice button clicked, isRecording:', isRecording); // Debug log
        
        if (!isRecording) {
            startVoiceRecording();
        } else {
            stopVoiceRecording();
        }
    });
    
    function startVoiceRecording() {
        try {
            capturedTranscript = ''; // Reset transcript
            recognition.start();
            isRecording = true;
            voiceBtn.classList.add('recording');
            voiceBtn.title = 'Recording... Click to stop';
            window.showNotification('🎤 Listening...', 'info');
        } catch (err) {
            console.error('Speech recognition error:', err);
            window.showNotification('Voice input error. Please try again.', 'error');
            isRecording = false;
        }
    }
    
    function stopVoiceRecording() {
        console.log('Stopping voice recording, capturedTranscript:', capturedTranscript);
        
        if (!isRecording) return; // Already stopped
        
        isRecording = false;
        voiceBtn.classList.remove('recording');
        voiceBtn.title = 'Voice Input (Click to start recording)';
        
        // Wait a moment for any pending results before stopping
        setTimeout(() => {
            // Stop recognition
            try {
                recognition.stop();
            } catch (err) {
                // Ignore errors when stopping (might already be stopped)
            }
            
            // If we have a captured transcript, use it
            if (capturedTranscript && capturedTranscript.trim()) {
                console.log('Using captured transcript:', capturedTranscript);
                if (chatInput) {
                    chatInput.value = capturedTranscript;
                    chatInput.focus();
                }
                // Auto-send after a short delay to allow user to review
                setTimeout(() => {
                    if (window.sendChatMessage) {
                        window.sendChatMessage();
                    }
                }, 500);
                window.showNotification('Voice transcribed! Sending... 🎤', 'info');
                capturedTranscript = ''; // Clear after using
            } else {
                // No transcript captured - might be because user stopped too quickly
                console.warn('No transcript captured when stopping');
                window.showNotification('No speech detected. Please try again.', 'warning');
            }
        }, 300); // Wait 300ms for any pending results
    }
    
    recognition.onresult = (event) => {
        console.log('Speech recognition result received:', event.results.length, 'results');
        
        // Process all results (including interim)
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = 0; i < event.results.length; i++) {
            const result = event.results[i];
            if (result && result.length > 0 && result[0]) {
                const transcript = result[0].transcript;
                console.log(`Result ${i}: isFinal=${result.isFinal}, transcript="${transcript}"`);
                
                if (result.isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript + ' ';
                }
            }
        }
        
        // Use final transcript if available, otherwise use interim
        const transcript = (finalTranscript || interimTranscript).trim();
        console.log('Combined transcript:', transcript);
        
        if (transcript) {
            // Store transcript for use when manually stopped
            capturedTranscript = transcript;
            console.log('Stored capturedTranscript:', capturedTranscript);
            
            // If we have final results, process immediately
            if (finalTranscript) {
                if (chatInput) {
                    chatInput.value = transcript;
                    chatInput.focus();
                }
                // Don't stop here - let it continue or stop naturally
                // Auto-send after a short delay
                setTimeout(() => {
                    if (window.sendChatMessage) {
                        window.sendChatMessage();
                    }
                }, 500);
                window.showNotification('Voice transcribed! Sending... 🎤', 'info');
                // Don't clear capturedTranscript here - keep it in case user stops manually
            } else {
                // Update input with interim results for preview
                if (chatInput) {
                    chatInput.value = transcript;
                }
            }
        } else {
            console.warn('No transcript found in results');
        }
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopVoiceRecording();
        
        let errorMsg = 'Voice input error. ';
        if (event.error === 'no-speech') {
            errorMsg = 'No speech detected. Please try again.';
        } else if (event.error === 'not-allowed') {
            errorMsg = 'Microphone permission denied. Please enable it in browser settings.';
        } else if (event.error === 'audio-capture') {
            errorMsg = 'No microphone found. Please check your device.';
        } else if (event.error === 'network') {
            errorMsg = 'Network error. Please check your connection.';
        } else if (event.error === 'aborted') {
            // User stopped recording, don't show error
            return;
        } else {
            errorMsg = `Voice input error: ${event.error}. Please try again.`;
        }
        window.showNotification(errorMsg, 'error');
    };
    
    recognition.onend = () => {
        console.log('Recognition ended, isRecording:', isRecording, 'capturedTranscript:', capturedTranscript);
        
        // Reset recording state when recognition ends
        // This handles cases where recognition ends naturally (after getting results)
        // or when user manually stops it
        if (isRecording) {
            // If we're still recording when onend fires, it means recognition ended
            // without results (timeout, error, or manual stop)
            isRecording = false;
            voiceBtn.classList.remove('recording');
            voiceBtn.title = 'Voice Input (Click to start recording)';
            
            // Wait a moment for any final results to be processed
            setTimeout(() => {
                // Check if we have a captured transcript (might have been captured in onresult before onend fired)
                if (capturedTranscript && capturedTranscript.trim() && chatInput) {
                    console.log('Using transcript from onend:', capturedTranscript);
                    chatInput.value = capturedTranscript;
                    chatInput.focus();
                    setTimeout(() => {
                        if (window.sendChatMessage) {
                            window.sendChatMessage();
                        }
                    }, 500);
                    window.showNotification('Voice transcribed! Sending... 🎤', 'info');
                    capturedTranscript = ''; // Clear after using
                } else if (!capturedTranscript || !capturedTranscript.trim()) {
                    console.warn('No transcript available when recognition ended');
                }
            }, 200);
        }
    };
    
    // Make recognition available for testing
    window.voiceRecognition = recognition;
}

// Phase 4: Conversation Search Functions
function openSearch() {
    const searchContainer = document.getElementById('aiSearchContainer');
    const searchInput = document.getElementById('aiSearchInput');
    if (searchContainer && searchInput) {
        searchContainer.classList.add('show');
        setTimeout(() => searchInput.focus(), 100);
    }
}

function closeSearch() {
    const searchContainer = document.getElementById('aiSearchContainer');
    const searchInput = document.getElementById('aiSearchInput');
    if (searchContainer && searchInput) {
        searchContainer.classList.remove('show');
        searchInput.value = '';
        clearSearchHighlights();
    }
}

function performSearch(query) {
    if (!query.trim()) {
        clearSearchHighlights();
        return;
    }
    
    const chatMessages = document.getElementById('aiChatMessages');
    if (!chatMessages) return;
    
    const messages = chatMessages.querySelectorAll('.ai-message');
    const lowerQuery = query.toLowerCase();
    let matchCount = 0;
    let firstMatch = null;
    
    messages.forEach(msg => {
        const textEl = msg.querySelector('.ai-message-text');
        if (!textEl) return;
        
        // Get plain text for searching
        const text = textEl.textContent || textEl.innerText;
        const lowerText = text.toLowerCase();
        
        // Store original HTML if not already stored (before any highlighting)
        if (!textEl.hasAttribute('data-original-html')) {
            // Remove any existing highlights first, then store
            const cleanHTML = textEl.innerHTML.replace(/<mark class="search-highlight">(.*?)<\/mark>/gi, '$1');
            textEl.setAttribute('data-original-html', cleanHTML);
        }
        
        // Restore original HTML (remove previous highlights)
        const originalHTML = textEl.getAttribute('data-original-html');
        textEl.innerHTML = originalHTML;
        
        if (lowerText.includes(lowerQuery)) {
            matchCount++;
            msg.classList.add('search-match');
            
            // Highlight matching text while preserving HTML structure
            // We need to highlight in the text content, not the HTML
            // So we'll wrap text nodes that match
            const walker = document.createTreeWalker(
                textEl,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );
            
            const textNodes = [];
            let node;
            while (node = walker.nextNode()) {
                if (node.textContent.toLowerCase().includes(lowerQuery)) {
                    textNodes.push(node);
                }
            }
            
            // Highlight matching text nodes
            textNodes.forEach(textNode => {
                const parent = textNode.parentNode;
                const text = textNode.textContent;
                const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                
                if (regex.test(text)) {
                    const highlighted = text.replace(regex, '<mark class="search-highlight">$1</mark>');
                    const wrapper = document.createElement('span');
                    wrapper.innerHTML = highlighted;
                    
                    // Replace text node with highlighted version
                    while (wrapper.firstChild) {
                        parent.insertBefore(wrapper.firstChild, textNode);
                    }
                    parent.removeChild(textNode);
                }
            });
            
            if (!firstMatch) {
                firstMatch = msg;
            }
        } else {
            msg.classList.remove('search-match');
        }
    });
    
    // Scroll to first match
    if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Show search results count
    const searchContainer = document.getElementById('aiSearchContainer');
    if (searchContainer) {
        let resultIndicator = searchContainer.querySelector('.search-results-count');
        if (matchCount > 0) {
            if (!resultIndicator) {
                resultIndicator = document.createElement('div');
                resultIndicator.className = 'search-results-count';
                searchContainer.appendChild(resultIndicator);
            }
            resultIndicator.textContent = `${matchCount} result${matchCount !== 1 ? 's' : ''}`;
            resultIndicator.style.display = 'block';
        } else {
            if (resultIndicator) {
                resultIndicator.style.display = 'none';
            }
        }
    }
}

function clearSearchHighlights() {
    const chatMessages = document.getElementById('aiChatMessages');
    if (!chatMessages) return;
    
    const messages = chatMessages.querySelectorAll('.ai-message');
    messages.forEach(msg => {
        msg.classList.remove('search-match');
        const textEl = msg.querySelector('.ai-message-text');
        if (textEl) {
            // Restore original HTML if available
            const originalHTML = textEl.getAttribute('data-original-html');
            if (originalHTML) {
                textEl.innerHTML = originalHTML;
            } else {
                // Fallback: just remove highlights
                textEl.innerHTML = textEl.innerHTML.replace(/<mark class="search-highlight">(.*?)<\/mark>/gi, '$1');
            }
        }
    });
    
    const searchContainer = document.getElementById('aiSearchContainer');
    if (searchContainer) {
        const resultIndicator = searchContainer.querySelector('.search-results-count');
        if (resultIndicator) {
            resultIndicator.style.display = 'none';
        }
    }
}

// ===========================
// Testimonials Carousel
// ===========================
function initializeTestimonialsCarousel() {
    const carousel = document.getElementById('testimonialsCarousel');
    if (!carousel) return;
    
    const cards = carousel.querySelectorAll('.testimonial-card');
    if (cards.length === 0) return;
    
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    const dotsContainer = document.querySelector('.testimonial-dots');
    
    let currentIndex = 0;
    const cardWidth = cards[0].offsetWidth + 24; // card width + gap
    
    // Create dots
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        cards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'testimonial-dot';
            dot.setAttribute('data-index', index);
            dot.style.cssText = 'width: 12px; height: 12px; border-radius: 50%; border: none; background: #ccc; cursor: pointer; transition: all 0.2s;';
            if (index === 0) {
                dot.style.background = '#2171d6';
                dot.style.transform = 'scale(1.2)';
            }
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }
    
    function updateCarousel() {
        carousel.scrollTo({
            left: currentIndex * cardWidth,
            behavior: 'smooth'
        });
        
        // Update dots
        if (dotsContainer) {
            dotsContainer.querySelectorAll('.testimonial-dot').forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.style.background = '#2171d6';
                    dot.style.transform = 'scale(1.2)';
                } else {
                    dot.style.background = '#ccc';
                    dot.style.transform = 'scale(1)';
                }
            });
        }
    }
    
    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, cards.length - 1));
        updateCarousel();
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCarousel();
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    // Auto-scroll (optional)
    let autoScrollInterval;
    function startAutoScroll() {
        autoScrollInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }
    
    // Start auto-scroll
    startAutoScroll();
    
    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoScroll);
    carousel.addEventListener('mouseleave', startAutoScroll);
    
    // Handle scroll snap
    carousel.addEventListener('scroll', () => {
        const scrollLeft = carousel.scrollLeft;
        const newIndex = Math.round(scrollLeft / cardWidth);
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < cards.length) {
            currentIndex = newIndex;
            if (dotsContainer) {
                dotsContainer.querySelectorAll('.testimonial-dot').forEach((dot, index) => {
                    if (index === currentIndex) {
                        dot.style.background = '#2171d6';
                        dot.style.transform = 'scale(1.2)';
                    } else {
                        dot.style.background = '#ccc';
                        dot.style.transform = 'scale(1)';
                    }
                });
            }
        }
    });
    
    // Keyboard navigation
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
}

// ===========================
// Project Filters
// ===========================
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Update active state
            filterButtons.forEach(b => {
                b.classList.remove('active');
                b.style.background = '#f0f0f0';
                b.style.color = '#1a1a1a';
                b.style.border = '1px solid #e0e0e0';
            });
            btn.classList.add('active');
            btn.style.background = '#2171d6';
            btn.style.color = '#fff';
            btn.style.border = '1px solid #1a5fb8';
            
            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    const category = card.dataset.category;
                    const tech = card.dataset.tech || '';
                    
                    if (category === filter || tech.includes(filter)) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });
}

// ===========================
// Project Modals & Live Demos
// ===========================
function initializeProjectModals() {
    // Live demo buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('project-live-demo-btn') || e.target.closest('.project-live-demo-btn')) {
            const btn = e.target.classList.contains('project-live-demo-btn') ? e.target : e.target.closest('.project-live-demo-btn');
            const liveUrl = btn.dataset.liveDemo;
            if (liveUrl) {
                // Check if URL is accessible before opening modal
                checkUrlAccessibility(liveUrl).then(isAccessible => {
                    if (isAccessible) {
                        openProjectModal(btn.closest('.project-card'), liveUrl);
                    } else {
                        showNotification('⚠️ Live demo is currently unavailable. The repository may not have GitHub Pages enabled or the URL may be incorrect.', 'warning', 5000);
                        // Still open modal but with error message
                        openProjectModal(btn.closest('.project-card'), liveUrl);
                    }
                }).catch(() => {
                    // If check fails, still try to open (might be CORS issue)
                    openProjectModal(btn.closest('.project-card'), liveUrl);
                });
            }
        }
        
        // Details button
        if (e.target.classList.contains('project-details-btn') || e.target.closest('.project-details-btn')) {
            const btn = e.target.classList.contains('project-details-btn') ? e.target : e.target.closest('.project-details-btn');
            const title = btn.dataset.title;
            const description = btn.dataset.description;
            const tech = btn.dataset.tech;
            const github = btn.dataset.github;
            const live = btn.dataset.live;
            
            showProjectDetailsModal(title, description, tech, github, live);
        }
    });
    
    // Project card hover effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.style.transition = 'all 0.3s ease';
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });
    });
}

function openProjectModal(card, liveUrl) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    `;
    
    modal.innerHTML = `
        <div style="background: #fff; border-radius: 12px; width: 100%; max-width: 1200px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">
            <div style="padding: 1.5rem; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="color: #1a1a1a; font-size: 1.5rem; font-weight: 700; margin: 0;">Live Demo</h3>
                <button class="close-project-modal" style="background: none; border: none; font-size: 2rem; color: #666; cursor: pointer; padding: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: all 0.2s;">×</button>
            </div>
            <div style="flex: 1; overflow: hidden; position: relative;">
                <div id="demo-error" style="display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; padding: 2rem; background: rgba(255, 255, 255, 0.95); border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); z-index: 10;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                    <h4 style="color: #1a1a1a; margin-bottom: 0.5rem; font-weight: 600;">Demo Not Available</h4>
                    <p style="color: #666; margin-bottom: 1rem; font-size: 0.9rem;">The live demo is currently unavailable. This could be due to:</p>
                    <ul style="color: #666; text-align: left; margin-bottom: 1rem; font-size: 0.85rem; padding-left: 1.5rem;">
                        <li>GitHub Pages not enabled for this repository</li>
                        <li>Repository is private</li>
                        <li>Deployment in progress</li>
                    </ul>
                    <a href="${liveUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 0.75rem 1.5rem; background: #2171d6; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 0.9rem;">Try Opening Directly</a>
                </div>
                <iframe id="demo-iframe" src="${liveUrl}" style="width: 100%; height: 100%; border: none;" frameborder="0" allowfullscreen onerror="document.getElementById('demo-error').style.display='block'; document.getElementById('demo-iframe').style.display='none';"></iframe>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Check if iframe loads successfully
    const iframe = modal.querySelector('#demo-iframe');
    const errorDiv = modal.querySelector('#demo-error');
    
    if (iframe) {
        let loadTimeout;
        let hasLoaded = false;
        
        // Set a timeout to check if the page loaded
        loadTimeout = setTimeout(() => {
            if (!hasLoaded && errorDiv) {
                // Try to detect if it's a 404 by checking iframe content
                try {
                    const iframeWindow = iframe.contentWindow;
                    if (iframeWindow) {
                        // Check if we can access the location (might be cross-origin)
                        try {
                            const currentUrl = iframeWindow.location.href;
                            // If URL changed or is different, might be an error page
                            if (currentUrl !== liveUrl && !currentUrl.includes('github.io')) {
                                showError();
                            }
                        } catch (e) {
                            // Cross-origin - can't check directly
                            // Show error after timeout as fallback
                            showError();
                        }
                    }
                } catch (err) {
                    showError();
                }
            }
        }, 5000); // Wait 5 seconds
        
        iframe.addEventListener('load', () => {
            hasLoaded = true;
            clearTimeout(loadTimeout);
            
            // Try to detect 404 by checking iframe content
            setTimeout(() => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    const bodyText = iframeDoc.body ? iframeDoc.body.innerText.toLowerCase() : '';
                    
                    // Check for common 404 indicators
                    if (bodyText.includes('404') || 
                        bodyText.includes('not found') || 
                        bodyText.includes('page not found') ||
                        iframeDoc.title.toLowerCase().includes('404')) {
                        showError();
                    }
                } catch (e) {
                    // Cross-origin - can't check, assume it loaded
                    console.log('Cross-origin iframe, cannot verify content');
                }
            }, 1000);
        });
        
        iframe.addEventListener('error', () => {
            showError();
        });
        
        function showError() {
            if (errorDiv && iframe) {
                errorDiv.style.display = 'block';
                iframe.style.display = 'none';
                clearTimeout(loadTimeout);
            }
        }
    }
    
    // Close handlers
    modal.querySelector('.close-project-modal').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    });
    
    // ESC key
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.body.style.overflow = '';
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

function showProjectDetailsModal(title, description, tech, github, live) {
    const modal = document.createElement('div');
    modal.className = 'project-details-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    `;
    
    modal.innerHTML = `
        <div style="background: #fff; border-radius: 12px; width: 100%; max-width: 700px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">
            <div style="padding: 2rem;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem;">
                    <h3 style="color: #1a1a1a; font-size: 1.8rem; font-weight: 700; margin: 0;">${title}</h3>
                    <button class="close-project-details-modal" style="background: none; border: none; font-size: 2rem; color: #666; cursor: pointer; padding: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: all 0.2s;">×</button>
                </div>
                <p style="color: #666; line-height: 1.8; margin-bottom: 1.5rem; font-size: 1rem;">${description}</p>
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="color: #1a1a1a; font-size: 1.1rem; font-weight: 600; margin-bottom: 0.75rem;">Technologies Used</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        ${tech.split(', ').map(t => `
                            <span style="padding: 0.5rem 1rem; background: #e8f4f8; border: 1px solid #d0e8f0; border-radius: 6px; color: #2171d6; font-size: 0.9rem; font-weight: 500;">
                                ${t}
                            </span>
                        `).join('')}
                    </div>
                </div>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    ${live ? `
                        <button class="project-live-demo-btn-modal" data-live-demo="${live}" 
                           style="padding: 1rem 2rem; background: #4caf50; border: 1px solid #45a049; border-radius: 8px; color: #fff; font-weight: 600; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 0.5rem;">
                            🌐 View Live Demo
                        </button>
                    ` : ''}
                    ${github ? `
                        <a href="${github}" target="_blank" rel="noopener noreferrer" 
                           style="padding: 1rem 2rem; background: #2171d6; border: 1px solid #1a5fb8; border-radius: 8px; color: #fff; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem;">
                            📂 View on GitHub
                        </a>
                    ` : `
                        <span style="color: #999; font-size: 0.9rem; padding: 1rem; display: inline-flex; align-items: center; gap: 0.5rem;">🔒 Private Repository</span>
                    `}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close handlers
    modal.querySelector('.close-project-details-modal').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    });
    
    // Live demo button in modal
    const liveBtn = modal.querySelector('.project-live-demo-btn-modal');
    if (liveBtn) {
        liveBtn.addEventListener('click', () => {
            modal.remove();
            document.body.style.overflow = '';
            openProjectModal(null, liveBtn.dataset.liveDemo);
        });
    }
    
    // ESC key
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.body.style.overflow = '';
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}
