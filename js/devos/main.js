// ===========================
// Portfolio Main Application
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    initializeClock();
    initializeStartMenu();
    initializeContextMenu();
    initializeDesktopIcons();
    initializeAppTiles();
    updateExperienceYears();
    initializeThemeToggle();
    initializeGitHubStats();
    initializeCertificateModal();
    
    // Auto-open apps in a nice cascading manner after boot
    setTimeout(() => {
        autoOpenApps();
    }, 3000); // Wait for boot screen to finish
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
        const dateStr = now.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
        
        clockEl.querySelector('.time').textContent = timeStr;
        clockEl.querySelector('.date').textContent = dateStr;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
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
        // Double-click to open
        icon.addEventListener('dblclick', () => {
            const appId = icon.dataset.app;
            openApp(appId);
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
            openApp(appId);
            return;
        }
        
        // Arrow keys to navigate between icons
        if (selectedIcon && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
            navigateIcons(e.key);
        }
    });
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
    const currentIndex = icons.indexOf(selectedIcon);
    
    if (currentIndex === -1) return;
    
    let nextIndex;
    
    switch(direction) {
        case 'ArrowUp':
            // Move up in the column
            nextIndex = currentIndex - 1;
            break;
        case 'ArrowDown':
            // Move down in the column
            nextIndex = currentIndex + 1;
            break;
        case 'ArrowLeft':
            // For single column layout, same as up
            nextIndex = currentIndex - 1;
            break;
        case 'ArrowRight':
            // For single column layout, same as down
            nextIndex = currentIndex + 1;
            break;
    }
    
    // Wrap around
    if (nextIndex < 0) {
        nextIndex = icons.length - 1;
    } else if (nextIndex >= icons.length) {
        nextIndex = 0;
    }
    
    if (icons[nextIndex]) {
        selectIcon(icons[nextIndex]);
        // Scroll icon into view if needed
        icons[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function makeDraggable(icon) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    
    // Get current position from inline styles or computed position
    const rect = icon.getBoundingClientRect();
    const desktopRect = document.querySelector('.desktop-icons').getBoundingClientRect();
    
    icon.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    
    function dragStart(e) {
        if (e.target.closest('.desktop-icon') !== icon) return;
        
        // Prevent dragging if it's a double-click
        if (e.detail === 2) return;
        
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        
        if (e.target === icon || icon.contains(e.target)) {
            isDragging = true;
            icon.style.cursor = 'grabbing';
        }
    }
    
    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            xOffset = currentX;
            yOffset = currentY;
            
            setTranslate(currentX, currentY, icon);
        }
    }
    
    function dragEnd(e) {
        if (isDragging) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            icon.style.cursor = 'pointer';
        }
    }
    
    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
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
}

// ===========================
// Open Application
// ===========================
function openApp(appId, position = null) {
    const app = apps[appId];
    if (!app) return;
    
    window.windowManager.createWindow(
        appId,
        app.title,
        app.icon,
        app.content,
        position
    );
    
    // Initialize terminal if opened
    if (appId === 'terminal') {
        setTimeout(() => initializeTerminal(), 100);
    }
    
    // Initialize demo buttons if projects window opened
    if (appId === 'projects') {
        setTimeout(() => initializeDemoButtons(), 100);
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
    
    // Desktop: Open apps in a tiled grid layout (2x2)
    const appsToOpen = [
        { id: 'about', delay: 0, position: 'top-left' },
        { id: 'skills', delay: 300, position: 'top-right' },
        { id: 'projects', delay: 600, position: 'bottom-left' },
        { id: 'contact', delay: 900, position: 'bottom-right' }
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
        
        if (type === 'pdf') {
            modalBody.innerHTML = `<iframe src="${certPath}#toolbar=1&navpanes=0" type="application/pdf"></iframe>`;
        } else {
            modalBody.innerHTML = `<img src="${certPath}" alt="${title}" />`;
        }
        
        downloadBtn.href = certPath;
        const filename = certPath.split('/').pop();
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

