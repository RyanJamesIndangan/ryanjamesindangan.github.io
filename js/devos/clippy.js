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
    
    getClippySVG(pose = 'standard') {
        // Map pose names to image files
        const poseMap = {
            'standard': 'clippy-standard.png',
            'sleeping': 'clippy-sleeping.png',
            'atomic': 'clippy-atomic.png',
            'number4': 'clippy-number4.png',
            'headphones': 'clippy-headphones.png',
            'checkmark': 'clippy-checkmark.png',
            'surprised': 'clippy-surprised.png',
            'box': 'clippy-box.png',
            'squiggly': 'clippy-squiggly.png'
        };
        
        const imageFile = poseMap[pose] || 'clippy-standard.png';
        const imagePath = `assets/clippy/${imageFile}`;
        
        return `
            <div class="clippy-character" title="It looks like you're trying to chat! Would you like help?">
                <img src="${imagePath}" alt="Clippy" class="clippy-image" onerror="this.src='assets/clippy.png'" />
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
                                    (avatar.textContent.includes('🤖') || avatar.innerHTML.includes('🤖') || avatar.querySelector('img[src*="clippy"]')));
                
                if (isAssistant) {
                    // Only replace if it's still an emoji or doesn't have Clippy image
                    if (avatar.textContent.includes('🤖') || (!avatar.querySelector('.clippy-image') && !avatar.querySelector('img[src*="clippy"]'))) {
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
                                                (avatar.textContent.includes('🤖') || avatar.innerHTML.includes('🤖') || avatar.querySelector('img[src*="clippy"]')));
                            
                            if (isAssistant) {
                                if (avatar.textContent.includes('🤖') || (!avatar.querySelector('.clippy-image') && !avatar.querySelector('img[src*="clippy"]'))) {
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

