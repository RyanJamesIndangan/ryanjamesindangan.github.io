// ===========================
// Clippy Suggestions System
// ===========================

class ClippySuggestions {
    constructor() {
        this.currentSuggestion = null;
        this.suggestionTypes = {
            'startup-chat': {
                id: 'startup-chat',
                title: "Hi there! 👋",
                message: "I'm Clippy, your AI assistant! You can chat with me anytime by clicking the button in the bottom right corner. Want to try it now?",
                options: [
                    { value: 'yes', text: 'Yes, let\'s chat!' },
                    { value: 'no', text: 'Maybe later' }
                ],
                priority: 0 // Highest priority - show first
            },
            'first-visit': {
                id: 'first-visit',
                title: "It looks like you're new here!",
                message: "Would you like help getting started?",
                options: [
                    { value: 'yes', text: 'Get help getting started' },
                    { value: 'no', text: 'Just explore on my own' }
                ],
                priority: 1
            },
            'idle-help': {
                id: 'idle-help',
                title: "It looks like you've been browsing.",
                message: "Need help finding something?",
                options: [
                    { value: 'yes', text: 'Yes, I need help' },
                    { value: 'no', text: 'No, I\'m fine' }
                ],
                priority: 2
            },
            'ai-assistant-intro': {
                id: 'ai-assistant-intro',
                title: "It looks like you're trying to use the AI Assistant!",
                message: "Would you like help?",
                options: [
                    { value: 'yes', text: 'Get help with the AI Assistant' },
                    { value: 'no', text: 'Just explore on my own' }
                ],
                priority: 1
            },
            'voice-input': {
                id: 'voice-input',
                title: "It looks like you haven't tried voice input!",
                message: "Want to try speaking to Clippy?",
                options: [
                    { value: 'yes', text: 'Yes, show me how' },
                    { value: 'no', text: 'Maybe later' }
                ],
                priority: 3
            },
            'projects-section': {
                id: 'projects-section',
                title: "It looks like you're viewing projects!",
                message: "Want to learn more about my work?",
                options: [
                    { value: 'yes', text: 'Yes, tell me more' },
                    { value: 'no', text: 'I\'ll explore myself' }
                ],
                priority: 2
            }
        };
        this.hoverTimer = null;
        this.idleTimer = null;
        this.lastInteractionTime = Date.now();
        this.init();
    }
    
    init() {
        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        const toggleBtn = document.getElementById('aiAssistantToggle');
        if (!toggleBtn) {
            // Retry if toggle button not ready yet
            setTimeout(() => this.setup(), 500);
            return;
        }
        
        // Hover trigger - only if no suggestion is currently showing
        toggleBtn.addEventListener('mouseenter', () => {
            // Don't show if there's already a suggestion or if chat is open
            const chatWidget = document.getElementById('aiAssistantWidget');
            if (chatWidget && chatWidget.classList.contains('active')) {
                return; // Don't show if chat is already open
            }
            
            this.hoverTimer = setTimeout(() => {
                // Double check no suggestion is showing
                if (!this.currentSuggestion) {
                    this.showSuggestion('ai-assistant-intro');
                }
            }, 2000); // 2 second delay
        });
        
        toggleBtn.addEventListener('mouseleave', () => {
            if (this.hoverTimer) {
                clearTimeout(this.hoverTimer);
                this.hoverTimer = null;
            }
        });
        
        // Startup chat suggestion - show after boot completes
        this.setupStartupChat();
        
        // First visit check
        this.checkFirstVisit();
        
        // Idle detection
        this.setupIdleDetection();
        
        // Contextual triggers
        this.setupContextualTriggers();
        
        // Track user interactions
        this.trackInteractions();
    }
    
    setupStartupChat() {
        // Listen for boot complete event
        const handleBootComplete = () => {
            // Wait a bit for apps to load and UI to settle
            setTimeout(() => {
                const toggleBtn = document.getElementById('aiAssistantToggle');
                if (toggleBtn && toggleBtn.classList.contains('visible')) {
                    // Check if user has permanently dismissed this
                    const dismissed = JSON.parse(localStorage.getItem('clippy-dismissed') || '{}');
                    const startupDismissal = dismissed['startup-chat'];
                    
                    // Only show if not permanently dismissed and no other suggestion is showing
                    if ((!startupDismissal || startupDismissal.permanent !== true) && !this.currentSuggestion) {
                        // Small delay to let everything settle
                        setTimeout(() => {
                            if (!this.currentSuggestion) {
                                this.showSuggestion('startup-chat');
                            }
                        }, 2000); // 2 seconds after boot complete
                    }
                }
            }, 1000); // 1 second initial delay
        };
        
        // Check if boot already completed
        if (document.getElementById('bootScreen') && document.getElementById('bootScreen').style.display === 'none') {
            // Boot already completed, show immediately
            handleBootComplete();
        } else {
            // Wait for boot complete event
            document.addEventListener('bootComplete', handleBootComplete, { once: true });
        }
    }
    
    checkFirstVisit() {
        const hasVisited = localStorage.getItem('clippy-has-visited');
        if (!hasVisited) {
            // Wait for boot screen to finish (3500ms) + extra delay for apps to open
            // Also wait for AI Assistant toggle to be visible
            const checkToggle = setInterval(() => {
                const toggleBtn = document.getElementById('aiAssistantToggle');
                if (toggleBtn && toggleBtn.classList.contains('visible')) {
                    clearInterval(checkToggle);
                    // Show after boot and apps have loaded
                    setTimeout(() => {
                        if (!this.currentSuggestion) {
                            this.showSuggestion('first-visit');
                        }
                    }, 5000); // 5 seconds after toggle is visible
                }
            }, 500);
            
            // Fallback timeout
            setTimeout(() => clearInterval(checkToggle), 10000);
            
            localStorage.setItem('clippy-has-visited', 'true');
        }
    }
    
    setupIdleDetection() {
        // Check for idle every 30 seconds
        setInterval(() => {
            const idleTime = Date.now() - this.lastInteractionTime;
            const idleMinutes = idleTime / (1000 * 60);
            
            // Show suggestion if idle for 2+ minutes and no suggestion is showing
            if (idleMinutes >= 2 && !this.currentSuggestion) {
                // Only check if permanently dismissed
                const dismissed = JSON.parse(localStorage.getItem('clippy-dismissed') || '{}');
                const idleDismissal = dismissed['idle-help'];
                if (!idleDismissal || idleDismissal.permanent !== true) {
                    this.showSuggestion('idle-help');
                }
            }
        }, 30000); // Check every 30 seconds
    }
    
    setupContextualTriggers() {
        // Watch for section views
        const observer = new MutationObserver(() => {
            // Check if projects section is visible
            const projectsWindow = window.windowManager?.windows.get('projects');
            if (projectsWindow && projectsWindow.classList.contains('active')) {
                // Only check if permanently dismissed
                const dismissed = JSON.parse(localStorage.getItem('clippy-dismissed') || '{}');
                const projectsDismissal = dismissed['projects-section'];
                if ((!projectsDismissal || projectsDismissal.permanent !== true) && !this.currentSuggestion) {
                    setTimeout(() => {
                        if (!this.currentSuggestion) {
                            this.showSuggestion('projects-section');
                        }
                    }, 2000);
                }
            }
        });
        
        // Observe window container
        const windowsContainer = document.getElementById('windowsContainer');
        if (windowsContainer) {
            observer.observe(windowsContainer, { 
                attributes: true, 
                attributeFilter: ['class'],
                subtree: true 
            });
        }
        
        // Watch for voice button visibility (to suggest voice input)
        const voiceBtn = document.getElementById('aiVoiceBtn');
        if (voiceBtn) {
            const voiceObserver = new MutationObserver(() => {
                const isVisible = voiceBtn.offsetParent !== null;
                if (isVisible) {
                    // Check if user has used voice before
                    const hasUsedVoice = localStorage.getItem('clippy-voice-used');
                    if (!hasUsedVoice) {
                        // Only check if permanently dismissed
                        const dismissed = JSON.parse(localStorage.getItem('clippy-dismissed') || '{}');
                        const voiceDismissal = dismissed['voice-input'];
                        if ((!voiceDismissal || voiceDismissal.permanent !== true) && !this.currentSuggestion) {
                            setTimeout(() => {
                                if (!this.currentSuggestion) {
                                    this.showSuggestion('voice-input');
                                }
                            }, 5000);
                        }
                    }
                }
            });
            
            voiceObserver.observe(voiceBtn, { 
                attributes: true, 
                attributeFilter: ['style', 'class'] 
            });
        }
    }
    
    trackInteractions() {
        // Track mouse movements, clicks, keyboard
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, () => {
                this.lastInteractionTime = Date.now();
            }, { passive: true });
        });
    }
    
    isDismissed(suggestionId, cooldownMinutes = 5) {
        const dismissed = JSON.parse(localStorage.getItem('clippy-dismissed') || '{}');
        const suggestion = dismissed[suggestionId];
        
        if (!suggestion) return false;
        
        // If permanently dismissed, always return true
        if (suggestion.permanent === true) {
            return true;
        }
        
        // For time-based dismissals, check if cooldown has passed
        // If cooldown passed, remove the dismissal record so it can show again
        const cooldownMs = cooldownMinutes * 60 * 1000;
        const timeSinceDismiss = Date.now() - suggestion.timestamp;
        
        if (timeSinceDismiss >= cooldownMs) {
            // Cooldown passed, remove dismissal record
            delete dismissed[suggestionId];
            localStorage.setItem('clippy-dismissed', JSON.stringify(dismissed));
            return false;
        }
        
        return true;
    }
    
    showSuggestion(suggestionId) {
        // Don't show if already showing or if globally disabled
        if (this.currentSuggestion) return;
        
        const globallyDisabled = localStorage.getItem('clippy-suggestions-disabled') === 'true';
        if (globallyDisabled) return;
        
        const suggestion = this.suggestionTypes[suggestionId];
        if (!suggestion) return;
        
        // Only check if PERMANENTLY dismissed (checkbox was checked)
        // Don't check time-based dismissals - let them show again
        const dismissed = JSON.parse(localStorage.getItem('clippy-dismissed') || '{}');
        const suggestionDismissal = dismissed[suggestionId];
        if (suggestionDismissal && suggestionDismissal.permanent === true) {
            return; // Only skip if permanently dismissed
        }
        
        this.currentSuggestion = suggestionId;
        this.createSuggestionBubble(suggestion);
    }
    
    createSuggestionBubble(suggestion) {
        const toggleBtn = document.getElementById('aiAssistantToggle');
        if (!toggleBtn) return;
        
        // Remove existing suggestion
        const existing = document.getElementById('clippySuggestion');
        if (existing) existing.remove();
        
        // Create container
        const container = document.createElement('div');
        container.id = 'clippySuggestion';
        container.className = 'clippy-suggestion-container';
        
        // Get toggle button position
        const toggleRect = toggleBtn.getBoundingClientRect();
        
        container.innerHTML = `
            <div class="clippy-suggestion-clippy">
                <img src="assets/clippy/clippy-standard.png" alt="Clippy" class="clippy-suggestion-image" onerror="this.src='assets/clippy.png'">
            </div>
            <div class="clippy-suggestion-bubble">
                <div class="clippy-suggestion-pointer"></div>
                <div class="clippy-suggestion-content">
                    <p class="clippy-suggestion-title">${suggestion.title}</p>
                    <p class="clippy-suggestion-message">${suggestion.message}</p>
                    <div class="clippy-suggestion-options" data-suggestion-id="${suggestion.id}">
                        ${suggestion.options.map((opt, idx) => `
                            <label class="clippy-radio-option">
                                <input type="radio" name="clippy-help-${suggestion.id}" value="${opt.value}" ${idx === 0 ? 'checked' : ''}>
                                <span>${opt.text}</span>
                            </label>
                        `).join('')}
                        <label class="clippy-checkbox-option">
                            <input type="checkbox" id="clippyDontShow-${suggestion.id}" class="clippy-dont-show">
                            <span>Don't show me this tip again</span>
                        </label>
                    </div>
                    <div class="clippy-suggestion-actions">
                        <button class="clippy-suggestion-ok" data-suggestion-id="${suggestion.id}">OK</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(container);
        
        // Position relative to toggle button
        this.positionSuggestion(container, toggleRect);
        
        // Animate in
        requestAnimationFrame(() => {
            container.classList.add('active');
        });
        
        // Setup event listeners
        this.setupSuggestionEvents(container, suggestion);
        
        // Auto-dismiss after 60 seconds if no interaction (increased from 30)
        setTimeout(() => {
            if (this.currentSuggestion === suggestion.id) {
                this.dismissSuggestion(suggestion.id, false);
            }
        }, 60000);
    }
    
    positionSuggestion(container, toggleRect) {
        const bubble = container.querySelector('.clippy-suggestion-bubble');
        const clippy = container.querySelector('.clippy-suggestion-clippy');
        
        if (!bubble || !clippy) return;
        
        // Calculate positions
        const bubbleWidth = 320;
        const bubbleHeight = 200;
        const clippySize = 80;
        const gap = 15;
        
        // Position bubble ABOVE the toggle button, centered horizontally
        const toggleCenterX = toggleRect.left + (toggleRect.width / 2);
        let bubbleLeft = toggleCenterX - (bubbleWidth / 2);
        let bubbleTop = toggleRect.top - bubbleHeight - gap;
        
        // Position Clippy to the left of bubble
        let clippyLeft = bubbleLeft - clippySize - gap;
        let clippyTop = bubbleTop + (bubbleHeight / 2) - (clippySize / 2);
        
        // Ensure bubble doesn't go off left edge
        if (bubbleLeft < 20) {
            bubbleLeft = 20;
            clippyLeft = bubbleLeft - clippySize - gap;
            // If Clippy would go off screen, position it differently
            if (clippyLeft < 20) {
                clippyLeft = bubbleLeft + bubbleWidth + gap;
            }
        }
        
        // Ensure bubble doesn't go off right edge
        if (bubbleLeft + bubbleWidth > window.innerWidth - 20) {
            bubbleLeft = window.innerWidth - bubbleWidth - 20;
            clippyLeft = bubbleLeft - clippySize - gap;
            // If Clippy would go off screen, position it differently
            if (clippyLeft < 20) {
                clippyLeft = bubbleLeft + bubbleWidth + gap;
            }
        }
        
        // Ensure bubble doesn't go off top
        if (bubbleTop < 20) {
            bubbleTop = toggleRect.bottom + gap;
        }
        
        // Ensure Clippy doesn't go off screen
        if (clippyLeft < 20) {
            clippyLeft = 20;
        }
        if (clippyLeft + clippySize > window.innerWidth - 20) {
            clippyLeft = window.innerWidth - clippySize - 20;
        }
        
        // Mobile adjustments
        if (window.innerWidth < 768) {
            bubbleLeft = 20;
            bubbleTop = toggleRect.top - bubbleHeight - gap;
            clippyLeft = bubbleLeft + (bubbleWidth / 2) - (clippySize / 2);
            clippyTop = bubbleTop - clippySize - 10;
        }
        
        bubble.style.left = `${bubbleLeft}px`;
        bubble.style.top = `${bubbleTop}px`;
        
        clippy.style.left = `${clippyLeft}px`;
        clippy.style.top = `${clippyTop}px`;
        
        // Position pointer to point DOWN at the toggle button center
        const pointer = bubble.querySelector('.clippy-suggestion-pointer');
        if (pointer && window.innerWidth >= 768) {
            // Calculate where the toggle button center is relative to the bubble's left edge
            const toggleCenterRelativeToBubble = toggleCenterX - bubbleLeft;
            // Position pointer at the bottom of bubble, aligned with toggle button center
            // The pointer should point down to the toggle button
            pointer.style.left = `${toggleCenterRelativeToBubble - 12}px`; // 12px is half pointer width (24px total)
            pointer.style.right = 'auto';
            pointer.style.bottom = '-12px';
            pointer.style.top = 'auto';
            // Don't rotate - CSS already has it pointing down (border-top creates downward triangle)
            pointer.style.transform = 'translateX(0)';
        }
    }
    
    setupSuggestionEvents(container, suggestion) {
        const okBtn = container.querySelector('.clippy-suggestion-ok');
        const radioOptions = container.querySelectorAll('input[type="radio"]');
        const dontShowCheckbox = container.querySelector('.clippy-dont-show');
        
        // OK button
        if (okBtn) {
            okBtn.addEventListener('click', () => {
                const selected = container.querySelector('input[type="radio"]:checked');
                this.handleSuggestionResponse(suggestion.id, selected?.value || 'no', dontShowCheckbox?.checked || false);
            });
        }
        
        // Radio option changes - DON'T auto-submit, wait for OK button
        radioOptions.forEach(radio => {
            radio.addEventListener('change', () => {
                // Just update visual state, don't submit
                // User must click OK button
            });
        });
        
        // Click outside to dismiss (but not immediately - give user time)
        let clickOutsideHandler = null;
        setTimeout(() => {
            clickOutsideHandler = (e) => {
                if (!container.contains(e.target) && 
                    !e.target.closest('#aiAssistantToggle') &&
                    !e.target.closest('.clippy-suggestion-container')) {
                    this.dismissSuggestion(suggestion.id, false);
                    if (clickOutsideHandler) {
                        document.removeEventListener('click', clickOutsideHandler);
                    }
                }
            };
            // Only enable click-outside after 1 second (give user time to see it)
            document.addEventListener('click', clickOutsideHandler);
        }, 1000);
    }
    
    handleSuggestionResponse(suggestionId, response, dontShowAgain) {
        // Handle response
        if (response === 'yes') {
            this.handleHelpfulResponse(suggestionId);
        }
        
        // Dismiss suggestion
        this.dismissSuggestion(suggestionId, dontShowAgain);
    }
    
    handleHelpfulResponse(suggestionId) {
        switch(suggestionId) {
            case 'startup-chat':
            case 'first-visit':
            case 'ai-assistant-intro':
                // Open AI Assistant
                const showAI = window.showAIAssistant;
                if (showAI) showAI();
                // Show help message
                setTimeout(() => {
                    if (window.portfolioChatbot) {
                        window.portfolioChatbot.addMessage('assistant', "Hi! I'm Clippy, your AI assistant. I can help you learn about Ryan's skills, experience, and projects. Try asking me questions like 'What are Ryan's skills?' or 'Tell me about his projects'!");
                    }
                }, 500);
                break;
                
            case 'voice-input':
                // Highlight voice button
                const voiceBtn = document.getElementById('aiVoiceBtn');
                if (voiceBtn) {
                    voiceBtn.style.animation = 'pulse 1s ease-in-out 3';
                    setTimeout(() => {
                        voiceBtn.style.animation = '';
                    }, 3000);
                }
                // Show help
                if (window.showNotification) {
                    window.showNotification('Click the 🎤 button to use voice input!', 'info', 4000);
                }
                break;
                
            case 'projects-section':
                // Could scroll to projects or show more info
                break;
                
            case 'idle-help':
                // Open AI Assistant with help
                if (window.showAIAssistant) window.showAIAssistant();
                break;
        }
    }
    
    dismissSuggestion(suggestionId, dontShowAgain) {
        const container = document.getElementById('clippySuggestion');
        if (!container) return;
        
        // Animate out
        container.classList.remove('active');
        
        setTimeout(() => {
            container.remove();
            this.currentSuggestion = null;
        }, 300);
        
        // Only save dismissal if "Don't show again" checkbox was checked
        if (dontShowAgain) {
            const dismissed = JSON.parse(localStorage.getItem('clippy-dismissed') || '{}');
            dismissed[suggestionId] = {
                timestamp: Date.now(),
                permanent: true
            };
            localStorage.setItem('clippy-dismissed', JSON.stringify(dismissed));
        }
        // If checkbox NOT checked, don't save anything - allow it to show again immediately
    }
}

// Initialize
let clippySuggestionsInstance = null;

function initializeClippySuggestions() {
    if (!clippySuggestionsInstance) {
        clippySuggestionsInstance = new ClippySuggestions();
    }
}

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeClippySuggestions, 1000);
    });
} else {
    setTimeout(initializeClippySuggestions, 1000);
}

// Export
window.clippySuggestions = {
    instance: () => clippySuggestionsInstance,
    show: (suggestionId) => clippySuggestionsInstance?.showSuggestion(suggestionId),
    dismiss: (suggestionId) => clippySuggestionsInstance?.dismissSuggestion(suggestionId, false)
};

