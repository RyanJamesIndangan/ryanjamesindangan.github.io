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
                <svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <!-- Clippy Paperclip Body -->
                    <path class="clippy-body" d="M 30 20 Q 20 20 20 30 L 20 50 Q 20 60 30 60 L 50 60 Q 60 60 60 50 L 60 30 Q 60 20 50 20 L 30 20 Z" 
                          fill="#FFD700" stroke="#FFA500" stroke-width="2"/>
                    <!-- Clippy Eye 1 -->
                    <circle class="clippy-eye" cx="35" cy="35" r="4" fill="#000"/>
                    <!-- Clippy Eye 2 -->
                    <circle class="clippy-eye" cx="55" cy="35" r="4" fill="#000"/>
                    <!-- Clippy Smile -->
                    <path class="clippy-mouth" d="M 35 50 Q 45 55 55 50" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/>
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

