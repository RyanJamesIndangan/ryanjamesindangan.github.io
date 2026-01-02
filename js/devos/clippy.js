// ===========================
// Clippy (Clippit) - Windows 98 Style Assistant
// ===========================

class Clippy {
    constructor() {
        this.container = null;
        this.currentAnimation = 'idle';
        this.animationInterval = null;
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createClippy());
        } else {
            this.createClippy();
        }
    }
    
    createClippy() {
        // Create Clippy in the chatbot header
        const header = document.querySelector('.ai-assistant-widget-header');
        if (header) {
            // Check if clippy container already exists or use the one from HTML
            let clippyContainer = header.querySelector('.clippy-container');
            if (!clippyContainer) {
                clippyContainer = document.createElement('div');
                clippyContainer.className = 'clippy-container';
                clippyContainer.id = 'clippyHeader';
                const headerContent = header.querySelector('div[style*="display: flex"]');
                if (headerContent) {
                    headerContent.insertBefore(clippyContainer, headerContent.firstChild);
                } else {
                    header.insertBefore(clippyContainer, header.firstChild);
                }
            }
            clippyContainer.innerHTML = this.getClippySVG();
            this.container = clippyContainer;
            
            // Start idle animation
            this.startIdleAnimation();
            
            // Add click interaction
            clippyContainer.addEventListener('click', () => {
                this.playAnimation('wave');
            });
        }
        
        // Replace emoji avatars in messages with Clippy
        this.replaceMessageAvatars();
        
        // Watch for new messages
        this.observeNewMessages();
    }
    
    getClippySVG() {
        return `
            <div class="clippy-character" title="It looks like you're trying to chat! Would you like help?">
                <svg width="80" height="80" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                    <!-- Yellow Lined Paper Background -->
                    <rect class="clippy-paper" x="25" y="30" width="70" height="85" rx="2" fill="#FFF9C4" stroke="#E0E0E0" stroke-width="1"/>
                    <!-- Paper Lines -->
                    <line x1="30" y1="45" x2="90" y2="45" stroke="#8B9A46" stroke-width="0.5" opacity="0.6"/>
                    <line x1="30" y1="55" x2="90" y2="55" stroke="#8B9A46" stroke-width="0.5" opacity="0.6"/>
                    <line x1="30" y1="65" x2="90" y2="65" stroke="#8B9A46" stroke-width="0.5" opacity="0.6"/>
                    <line x1="30" y1="75" x2="90" y2="75" stroke="#8B9A46" stroke-width="0.5" opacity="0.6"/>
                    <line x1="30" y1="85" x2="90" y2="85" stroke="#8B9A46" stroke-width="0.5" opacity="0.6"/>
                    <line x1="30" y1="95" x2="90" y2="95" stroke="#8B9A46" stroke-width="0.5" opacity="0.6"/>
                    <line x1="30" y1="105" x2="90" y2="105" stroke="#8B9A46" stroke-width="0.5" opacity="0.6"/>
                    <!-- Red Margin Line -->
                    <line x1="32" y1="30" x2="32" y2="115" stroke="#C62828" stroke-width="1.5" opacity="0.8"/>
                    
                    <!-- Clippy Paperclip - Purple-Grey Metal -->
                    <!-- Top Loop (Head) -->
                    <path class="clippy-body" d="M 50 25 Q 40 25 40 35 L 40 45 Q 40 50 45 50 L 55 50 Q 60 50 60 45 L 60 35 Q 60 25 50 25 Z" 
                          fill="#8B7D9B" stroke="#6B5D7B" stroke-width="1.5"/>
                    <!-- Middle Loop -->
                    <path class="clippy-body" d="M 45 50 Q 40 50 40 60 L 40 70 Q 40 75 45 75 L 55 75 Q 60 75 60 70 L 60 60 Q 60 50 55 50" 
                          fill="#8B7D9B" stroke="#6B5D7B" stroke-width="1.5"/>
                    <!-- Bottom Loop -->
                    <path class="clippy-body" d="M 45 75 Q 40 75 40 85 L 40 95 Q 40 100 45 100 L 55 100 Q 60 100 60 95 L 60 85 Q 60 75 55 75" 
                          fill="#8B7D9B" stroke="#6B5D7B" stroke-width="1.5"/>
                    
                    <!-- Paperclip Shadow on Paper -->
                    <ellipse cx="50" cy="105" rx="8" ry="3" fill="#000000" opacity="0.15"/>
                    
                    <!-- Googly Eyes (White with Black Pupils) -->
                    <!-- Left Eye -->
                    <circle class="clippy-eye-white" cx="47" cy="38" r="6" fill="#FFFFFF" stroke="#CCCCCC" stroke-width="0.5"/>
                    <circle class="clippy-eye-pupil" cx="47" cy="38" r="3.5" fill="#000000"/>
                    <!-- Right Eye -->
                    <circle class="clippy-eye-white" cx="53" cy="38" r="6" fill="#FFFFFF" stroke="#CCCCCC" stroke-width="0.5"/>
                    <circle class="clippy-eye-pupil" cx="53" cy="38" r="3.5" fill="#000000"/>
                    
                    <!-- Arched Eyebrows -->
                    <path class="clippy-eyebrow" d="M 42 32 Q 47 30 47 32" stroke="#000000" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                    <path class="clippy-eyebrow" d="M 53 32 Q 58 30 58 32" stroke="#000000" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                </svg>
            </div>
        `;
    }
    
    startIdleAnimation() {
        if (this.animationInterval) clearInterval(this.animationInterval);
        
        // Random idle animations
        const animations = ['idle', 'bounce', 'look-around'];
        let animationIndex = 0;
        
        this.animationInterval = setInterval(() => {
            if (this.currentAnimation === 'idle') {
                const randomAnim = animations[Math.floor(Math.random() * animations.length)];
                this.playAnimation(randomAnim, 2000);
            }
        }, 5000);
    }
    
    playAnimation(animation, duration = 3000) {
        if (!this.container) return;
        
        const clippy = this.container.querySelector('.clippy-character');
        if (!clippy) return;
        
        // Remove previous animation classes
        clippy.classList.remove('clippy-bounce', 'clippy-wave', 'clippy-look-around', 'clippy-excited', 'clippy-thinking');
        
        this.currentAnimation = animation;
        
        switch(animation) {
            case 'bounce':
                clippy.classList.add('clippy-bounce');
                break;
            case 'wave':
                clippy.classList.add('clippy-wave');
                break;
            case 'look-around':
                clippy.classList.add('clippy-look-around');
                break;
            case 'excited':
                clippy.classList.add('clippy-excited');
                break;
            case 'thinking':
                clippy.classList.add('clippy-thinking');
                break;
            default:
                // idle
                break;
        }
        
        if (duration) {
            setTimeout(() => {
                clippy.classList.remove('clippy-bounce', 'clippy-wave', 'clippy-look-around', 'clippy-excited', 'clippy-thinking');
                this.currentAnimation = 'idle';
            }, duration);
        }
    }
    
    replaceMessageAvatars() {
        // Replace all assistant avatars with Clippy
        const avatars = document.querySelectorAll('.ai-message-avatar');
        avatars.forEach(avatar => {
            // Check if it's an assistant message (not user)
            const message = avatar.closest('.ai-message');
            if (message) {
                // Check if it's assistant message by checking for assistant class or by checking if it doesn't have user class
                const isAssistant = message.classList.contains('ai-message-assistant') || 
                                   (!message.classList.contains('ai-message-user') && 
                                    (avatar.textContent.includes('🤖') || avatar.innerHTML.includes('🤖')));
                
                if (isAssistant) {
                    // Only replace if it's still an emoji or doesn't have Clippy SVG
                    if (avatar.textContent.includes('🤖') || !avatar.querySelector('svg')) {
                        avatar.innerHTML = this.getClippySVG();
                        avatar.classList.add('clippy-avatar');
                    }
                }
            }
        });
    }
    
    observeNewMessages() {
        const chatMessages = document.getElementById('aiChatMessages');
        if (!chatMessages) return;
        
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.classList.contains('ai-message')) {
                        const avatar = node.querySelector('.ai-message-avatar');
                        if (avatar) {
                            // Check if it's assistant message
                            const isAssistant = node.classList.contains('ai-message-assistant') || 
                                               (!node.classList.contains('ai-message-user') && 
                                                (avatar.textContent.includes('🤖') || avatar.innerHTML.includes('🤖')));
                            
                            if (isAssistant) {
                                if (avatar.textContent.includes('🤖') || !avatar.querySelector('svg')) {
                                    avatar.innerHTML = this.getClippySVG();
                                    avatar.classList.add('clippy-avatar');
                                    
                                    // Play excited animation when new message appears
                                    setTimeout(() => {
                                        this.playAnimation('excited', 1500);
                                    }, 100);
                                }
                            }
                        }
                    }
                });
            });
        });
        
        observer.observe(chatMessages, { childList: true });
    }
    
    // Play animation when user sends message
    onUserMessage() {
        this.playAnimation('thinking', 2000);
    }
    
    // Play animation when assistant responds
    onAssistantResponse() {
        this.playAnimation('excited', 1500);
    }
}

// Initialize Clippy
let clippyInstance = null;

function initializeClippy() {
    if (!clippyInstance) {
        clippyInstance = new Clippy();
        
        // Hook into message sending
        const originalSend = window.sendChatMessage;
        if (originalSend) {
            window.sendChatMessage = function(...args) {
                if (clippyInstance) {
                    clippyInstance.onUserMessage();
                }
                return originalSend.apply(this, args);
            };
        }
    }
}

// Initialize when chatbot is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeClippy, 500);
    });
} else {
    setTimeout(initializeClippy, 500);
}

// Re-initialize when chatbot widget is shown
document.addEventListener('appOpened', (e) => {
    if (e.detail && e.detail.appId === 'ai-assistant') {
        setTimeout(initializeClippy, 100);
    }
});

// Export for global access
window.clippy = {
    instance: () => clippyInstance,
    playAnimation: (anim) => clippyInstance && clippyInstance.playAnimation(anim)
};

