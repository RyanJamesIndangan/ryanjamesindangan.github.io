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
                <svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <!-- Paperclip gradient for 3D metallic effect -->
                        <linearGradient id="paperclipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#A89BB8;stop-opacity:1" />
                            <stop offset="30%" style="stop-color:#8B7D9B;stop-opacity:1" />
                            <stop offset="70%" style="stop-color:#6B5D7B;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#8B7D9B;stop-opacity:1" />
                        </linearGradient>
                        <!-- Paperclip highlight -->
                        <linearGradient id="paperclipHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.4" />
                            <stop offset="50%" style="stop-color:#FFFFFF;stop-opacity:0.1" />
                            <stop offset="100%" style="stop-color:#FFFFFF;stop-opacity:0" />
                        </linearGradient>
                        <!-- Paper shadow -->
                        <filter id="paperShadow">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
                            <feOffset dx="0" dy="2" result="offsetblur"/>
                            <feComponentTransfer>
                                <feFuncA type="linear" slope="0.3"/>
                            </feComponentTransfer>
                            <feMerge>
                                <feMergeNode/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    
                    <!-- Yellow Lined Paper Background -->
                    <rect class="clippy-paper" x="20" y="25" width="60" height="70" rx="1" fill="#FFFACD" stroke="#E6E6B8" stroke-width="0.5" filter="url(#paperShadow)"/>
                    
                    <!-- Paper Lines (more subtle) -->
                    <line x1="25" y1="38" x2="75" y2="38" stroke="#B8B894" stroke-width="0.4" opacity="0.5"/>
                    <line x1="25" y1="46" x2="75" y2="46" stroke="#B8B894" stroke-width="0.4" opacity="0.5"/>
                    <line x1="25" y1="54" x2="75" y2="54" stroke="#B8B894" stroke-width="0.4" opacity="0.5"/>
                    <line x1="25" y1="62" x2="75" y2="62" stroke="#B8B894" stroke-width="0.4" opacity="0.5"/>
                    <line x1="25" y1="70" x2="75" y2="70" stroke="#B8B894" stroke-width="0.4" opacity="0.5"/>
                    <line x1="25" y1="78" x2="75" y2="78" stroke="#B8B894" stroke-width="0.4" opacity="0.5"/>
                    <line x1="25" y1="86" x2="75" y2="86" stroke="#B8B894" stroke-width="0.4" opacity="0.5"/>
                    
                    <!-- Red Margin Line -->
                    <line x1="27" y1="25" x2="27" y2="95" stroke="#DC143C" stroke-width="1.2" opacity="0.7"/>
                    
                    <!-- Clippy Paperclip - Realistic 3D Purple-Grey Metal -->
                    <!-- Main paperclip body with proper curves -->
                    <path class="clippy-body" d="M 45 22 
                        C 38 22, 32 26, 32 33
                        L 32 42
                        C 32 49, 38 53, 45 53
                        L 50 53
                        C 57 53, 63 49, 63 42
                        L 63 38
                        C 63 31, 57 27, 50 27
                        L 45 27
                        C 38 27, 32 31, 32 38
                        L 32 58
                        C 32 65, 38 69, 45 69
                        L 50 69
                        C 57 69, 63 65, 63 58
                        L 63 54
                        C 63 47, 57 43, 50 43
                        L 45 43
                        C 38 43, 32 47, 32 54
                        L 32 73
                        C 32 80, 38 84, 45 84
                        L 50 84
                        C 57 84, 63 80, 63 73
                        Z" 
                        fill="url(#paperclipGradient)" 
                        stroke="#5A4D6A" 
                        stroke-width="1.2"
                        stroke-linejoin="round"/>
                    
                    <!-- Paperclip highlight for 3D effect -->
                    <path class="clippy-highlight" d="M 45 22 
                        C 38 22, 32 26, 32 33
                        L 32 42
                        C 32 49, 38 53, 45 53
                        L 50 53
                        C 57 53, 63 49, 63 42
                        L 63 38
                        C 63 31, 57 27, 50 27
                        L 45 27
                        C 38 27, 32 31, 32 38
                        L 32 58
                        C 32 65, 38 69, 45 69
                        L 50 69
                        C 57 69, 63 65, 63 58
                        L 63 54
                        C 63 47, 57 43, 50 43
                        L 45 43
                        C 38 43, 32 47, 32 54
                        L 32 73
                        C 32 80, 38 84, 45 84
                        L 50 84
                        C 57 84, 63 80, 63 73
                        Z" 
                        fill="url(#paperclipHighlight)" 
                        opacity="0.6"/>
                    
                    <!-- Paperclip shadow on paper -->
                    <ellipse cx="47.5" cy="88" rx="6" ry="2" fill="#000000" opacity="0.2"/>
                    
                    <!-- Googly Eyes (Large white with black pupils) -->
                    <!-- Left Eye White -->
                    <circle class="clippy-eye-white" cx="44" cy="35" r="5.5" fill="#FFFFFF" stroke="#D0D0D0" stroke-width="0.8"/>
                    <!-- Left Eye Pupil -->
                    <circle class="clippy-eye-pupil" cx="44" cy="35" r="3.2" fill="#000000"/>
                    <!-- Left Eye Highlight -->
                    <circle cx="45" cy="34" r="1" fill="#FFFFFF" opacity="0.8"/>
                    
                    <!-- Right Eye White -->
                    <circle class="clippy-eye-white" cx="51" cy="35" r="5.5" fill="#FFFFFF" stroke="#D0D0D0" stroke-width="0.8"/>
                    <!-- Right Eye Pupil -->
                    <circle class="clippy-eye-pupil" cx="51" cy="35" r="3.2" fill="#000000"/>
                    <!-- Right Eye Highlight -->
                    <circle cx="52" cy="34" r="1" fill="#FFFFFF" opacity="0.8"/>
                    
                    <!-- Arched Eyebrows (thick and expressive) -->
                    <path class="clippy-eyebrow" d="M 39 29 Q 44 27 44 29" stroke="#000000" stroke-width="3" fill="none" stroke-linecap="round"/>
                    <path class="clippy-eyebrow" d="M 51 29 Q 56 27 56 29" stroke="#000000" stroke-width="3" fill="none" stroke-linecap="round"/>
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

