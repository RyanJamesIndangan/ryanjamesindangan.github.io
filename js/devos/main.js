// ===========================
// DevOS Main Application
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
function initializeDesktopIcons() {
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    
    desktopIcons.forEach(icon => {
        icon.addEventListener('dblclick', () => {
            const appId = icon.dataset.app;
            openApp(appId);
        });
    });
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
function openApp(appId) {
    const app = apps[appId];
    if (!app) return;
    
    window.windowManager.createWindow(
        appId,
        app.title,
        app.icon,
        app.content
    );
    
    // Initialize terminal if opened
    if (appId === 'terminal') {
        setTimeout(() => initializeTerminal(), 100);
    }
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
                case 'about-devos':
                    alert('DevOS Portfolio v2.0.0\n\nBuilt by Ryan James Indangan\nA unique portfolio OS experience');
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

