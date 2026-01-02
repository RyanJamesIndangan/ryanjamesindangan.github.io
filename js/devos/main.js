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
    initializeAIAssistant();
    
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
                    }
                    break;
                case 'about-portfolio':
                    showNotification('Portfolio OS v3.0 | Built by Ryan James Indangan | AI/ML Focus', 'info', 4000);
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
        about: () => 'Ryan James Indangan - Full-Stack Developer & CTO\n7+ years of experience in web development\nSpecializing in AI/ML and Document Intelligence',
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
            return `🤖 AI Developer & Machine Learning Engineer

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
            return `🤖 AI & Machine Learning Stack:

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
            return `🤖 LLM Service Status:

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
        showNotification('GitHub: 50+ projects | Top Rated on Upwork', 'success');
    });
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
        window.portfolioChatbot.conversationHistory.forEach(msg => {
            addChatMessage(msg.message, msg.role, msg.suggestions || []);
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
    const helpBtn = document.getElementById('aiHelpBtn');
    
    if (menuBtn && menuDropdown) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menuDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
                menuDropdown.classList.remove('show');
            }
        });
    }
    
    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            clearChat();
            if (menuDropdown) menuDropdown.classList.remove('show');
        });
    }
    
    if (clearMemoryBtn) {
        clearMemoryBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            clearChatbotMemory();
            if (menuDropdown) menuDropdown.classList.remove('show');
        });
    }
    
    if (helpBtn) {
        helpBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sendChatMessage('help');
            if (menuDropdown) menuDropdown.classList.remove('show');
        });
    }

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
}

window.sendChatMessage = function(messageText = null) {
    const chatInput = document.getElementById('aiChatInput');
    const chatMessages = document.getElementById('aiChatMessages');
    const sendBtn = document.getElementById('aiSendBtn');
    
    if (!chatInput || !chatMessages || !window.portfolioChatbot) return;
    
    const message = messageText || chatInput.value.trim();
    if (!message) return;

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
        addChatMessage(response.text, 'assistant', response.suggestions || []);
        scrollChatToBottom();

        // Re-enable input
        chatInput.disabled = false;
        if (sendBtn) sendBtn.disabled = false;
        chatInput.focus();
    }, 500 + Math.random() * 500); // Random delay between 500-1000ms for more natural feel
}

function addChatMessage(message, role, suggestions = []) {
    const chatMessages = document.getElementById('aiChatMessages');
    if (!chatMessages) return;

    const messageEl = document.createElement('div');
    messageEl.className = `ai-message ai-message-${role}`;
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    
    // Build suggestions HTML if provided (only for assistant messages)
    let suggestionsHTML = '';
    if (role === 'assistant' && suggestions && suggestions.length > 0) {
        suggestionsHTML = `
            <div class="ai-quick-replies">
                ${suggestions.map(suggestion => {
                    // Escape quotes and HTML to prevent XSS and syntax errors
                    const escapedSuggestion = suggestion
                        .replace(/\\/g, '\\\\')
                        .replace(/'/g, "\\'")
                        .replace(/"/g, '&quot;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;');
                    return `<button class="ai-quick-reply-btn" onclick="sendChatMessage('${escapedSuggestion}')">
                        ${suggestion.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                    </button>`;
                }).join('')}
            </div>
        `;
    }
    
    messageEl.innerHTML = `
        <div class="ai-message-avatar">${role === 'user' ? '👤' : '🤖'}</div>
        <div class="ai-message-content">
            <div class="ai-message-text">${formatChatMessage(message)}</div>
            ${suggestionsHTML}
            <div class="ai-message-time">${timeStr}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageEl);
    
    // Attach event listeners for action buttons (Open App, etc.)
    attachChatActionListeners(messageEl);
}

function formatChatMessage(text) {
    if (!text) return '';
    
    // Convert [Open AppName] to clickable action buttons
    text = text.replace(/\[Open (.+?)\]/g, (match, appName) => {
        const appId = mapAppNameToId(appName);
        if (appId) {
            return `<button class="chat-action-btn" data-app-id="${appId}" onclick="openApp('${appId}'); this.style.opacity='0.6';">📂 Open ${appName}</button>`;
        }
        return match;
    });
    
    // Convert URLs to clickable links
    text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #64ffda; text-decoration: underline;">$1</a>');
    
    // Convert markdown-style formatting to HTML
    text = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code style="background: rgba(100, 255, 218, 0.2); padding: 0.2em 0.4em; border-radius: 3px; font-family: monospace; font-size: 0.9em;">$1</code>')
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

function attachChatActionListeners(messageEl) {
    // Handle action buttons (Open App buttons)
    const actionButtons = messageEl.querySelectorAll('.chat-action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const appId = btn.dataset.appId;
            if (appId) {
                openApp(appId);
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
        <div class="ai-message-avatar">🤖</div>
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
}

// Make functions globally available
window.closeAIAssistant = closeAIAssistant;
window.showAIAssistant = showAIAssistant;
window.minimizeAIAssistant = minimizeAIAssistant;
window.openApp = openApp; // Make openApp globally available for chatbot actions

