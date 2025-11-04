// ===========================
// Portfolio Main Application
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    initializeClock();
    initializeStartMenu();
    initializeContextMenu();
    initializeDesktopIcons();
    initializeSelectionBox();
    initializeAppTiles();
    initializeSystemTray();
    updateExperienceYears();
    initializeThemeToggle();
    initializeGitHubStats();
    initializeCertificateModal();
    
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
    
    // Initialize terminal if opened
    if (appId === 'terminal') {
        setTimeout(() => initializeTerminal(), 100);
    }
    
    // Initialize demo buttons if projects window opened
    if (appId === 'projects') {
        setTimeout(() => initializeDemoButtons(), 100);
    }
    
    // Initialize Snake game if opened
    if (appId === 'snake') {
        setTimeout(() => initializeSnakeGame(), 100);
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
    const contextMenu = document.getElementById('contextMenu');
    const desktop = document.querySelector('.desktop');
    
    desktop.addEventListener('contextmenu', (e) => {
        // Only show on desktop area, not on windows
        if (e.target.closest('.window')) return;
        
        e.preventDefault();
        
        contextMenu.style.left = `${e.clientX}px`;
        contextMenu.style.top = `${e.clientY}px`;
        contextMenu.classList.add('active');
    });
    
    document.addEventListener('click', () => {
        contextMenu.classList.remove('active');
    });
    
    // Context menu actions
    contextMenu.querySelectorAll('.context-item').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            
            switch(action) {
                case 'refresh':
                    location.reload();
                    break;
                case 'view-code':
                    window.open('https://github.com/ryanjamesindangan/ryanjamesindangan.github.io', '_blank');
                    break;
                case 'about-portfolio':
                    alert('Interactive Portfolio v2.0.0\n\nBuilt by Ryan James Indangan\nFull-Stack Developer & Certified CTO\n\nA unique OS-style portfolio experience');
                    break;
            }
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
    
    const commands = {
        help: () => `
Available commands:
  about       - Display information about me
  skills      - List technical skills
  experience  - Show work experience
  projects    - Display featured projects
  contact     - Show contact information
  clear       - Clear terminal screen
  github      - Open GitHub profile
  linkedin    - Open LinkedIn profile
  help        - Show this help message
        `,
        about: () => 'Ryan James Indangan - Full-Stack Developer & CTO\n7+ years of experience in web development',
        skills: () => 'Frontend: React, Vue, Angular\nBackend: PHP, Laravel, Node.js\nCloud: AWS, Docker, Kubernetes',
        experience: () => 'Senior Full-Stack Developer at GlobalX Digital\nFormer CTO at Payo Digital\nTop Rated on Upwork',
        projects: () => 'Check out my projects:\n- Crypto Checkout Simulator\n- Supplier Order Management\n- GlobalX Platform Redesign',
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
        }
    };
    
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim().toLowerCase();
            terminalInput.value = '';
            
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
                
                if (commands[command]) {
                    output.textContent = commands[command]();
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
    let isDark = true;
    
    themeToggle.addEventListener('click', () => {
        isDark = !isDark;
        themeToggle.querySelector('.icon').textContent = isDark ? '🌙' : '☀️';
        
        // Could add theme switching logic here
        // For now, just show a message
        showNotification(isDark ? 'Dark mode active' : 'Light mode coming soon!');
    });
}

// ===========================
// GitHub Stats
// ===========================
function initializeGitHubStats() {
    const githubStats = document.getElementById('githubStats');
    
    githubStats.addEventListener('click', () => {
        showNotification('GitHub: 50+ projects | Top Rated on Upwork');
    });
}

// ===========================
// Notification System
// ===========================
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: rgba(30, 36, 66, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(100, 255, 218, 0.3);
        border-radius: 8px;
        color: #64ffda;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

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
        showNotification('👋 Welcome! Tap Menu to explore');
        return;
    }
    
    // Ensure windowManager is initialized
    if (!window.windowManager) {
        console.error('WindowManager not initialized, retrying...');
        setTimeout(autoOpenApps, 100);
        return;
    }
    
    // Desktop: Open apps in a mixed layout (About Me + Skills split on left, Experience and Certifications full height)
    const appsToOpen = [
        { id: 'about', delay: 0, position: 'top-left' },
        { id: 'skills', delay: 150, position: 'bottom-left' },
        { id: 'experience', delay: 300, position: 'top-center' },
        { id: 'certifications', delay: 450, position: 'top-right' }
    ];
    
    appsToOpen.forEach(app => {
        setTimeout(() => {
            openApp(app.id, app.position);
        }, app.delay);
    });
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('✨ Portfolio ready! Explore each section');
    }, 1200);
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
            modalBody.innerHTML = `<img src="${encodedPath}" alt="${title}" />`;
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

