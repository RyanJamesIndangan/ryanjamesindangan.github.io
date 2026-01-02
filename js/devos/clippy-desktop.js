// ===========================
// Desktop Clippy - Roaming Animated Assistant
// ===========================

class DesktopClippy {
    constructor() {
        this.element = null;
        this.state = 'STATIC';
        this.currentGIF = null;
        this.currentGIFPath = null;
        this.idleTimer = null;
        this.movementTimer = null;
        this.cooldowns = {
            idleGif: { min: 5000, max: 8000, current: 0 },
            movement: { min: 5000, max: 30000, current: 0 },
            deterministic: { min: 2000, current: 0 }
        };
        this.position = { x: 0, y: 0 };
        this.targetPosition = null;
        this.isMoving = false;
        this.lastIdleGIF = null;
        this.pendingDeterministic = null;
        this.reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.assetManager = window.clippyAssetManager;
        this.safetyTimeout = null;
        
        // Listen for reduced motion changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
                this.reducedMotion = e.matches;
                if (this.reducedMotion) {
                    this.resetToStatic();
                }
            });
        }
        
        // Don't call init() here - it will be called after initialization
    }
    
    init() {
        if (this.reducedMotion) {
            // Skip all animations if reduced motion is preferred
            return;
        }
        
        // Wait for asset manager to be available
        if (!this.assetManager) {
            // Retry after a short delay
            setTimeout(() => {
                this.assetManager = window.clippyAssetManager;
                if (this.assetManager) {
                    this.init();
                } else {
                    console.warn('Clippy Asset Manager not available');
                }
            }, 100);
            return;
        }
        
        // Wait for DOM and boot to complete
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                document.addEventListener('bootComplete', () => this.createClippy(), { once: true });
            });
        } else {
            if (document.getElementById('bootScreen')) {
                document.addEventListener('bootComplete', () => this.createClippy(), { once: true });
            } else {
                this.createClippy();
            }
        }
    }
    
    createClippy() {
        // Create Clippy element on desktop
        const desktop = document.getElementById('desktop');
        if (!desktop) {
            setTimeout(() => this.createClippy(), 500);
            return;
        }
        
        // Check if already exists
        let clippyEl = document.getElementById('desktopClippy');
        if (clippyEl) {
            this.element = clippyEl;
            this.setState('STATIC');
            return;
        }
        
        // Create element
        clippyEl = document.createElement('div');
        clippyEl.id = 'desktopClippy';
        clippyEl.className = 'desktop-clippy';
        clippyEl.innerHTML = this.getStaticHTML();
        
        desktop.appendChild(clippyEl);
        this.element = clippyEl;
        
        // Ensure element is visible
        clippyEl.style.display = 'block';
        clippyEl.style.opacity = '1';
        clippyEl.style.visibility = 'visible';
        
        // Set initial position (random on desktop)
        // Use requestAnimationFrame to ensure element is rendered first
        requestAnimationFrame(() => {
            this.setRandomPosition();
            // Debug: verify element is visible
            if (this.element) {
                const rect = this.element.getBoundingClientRect();
                console.log('Desktop Clippy created at:', this.position, 'Element visible:', rect.width > 0 && rect.height > 0);
            }
        });
        
        // Start idle cycle
        this.startIdleCycle();
        
        // Start movement cycle
        this.startMovementCycle();
        
        // Start safety timeout
        this.startSafetyTimeout();
    }
    
    getStaticHTML() {
        return `
            <div class="desktop-clippy-inner">
                <div class="desktop-clippy-paper"></div>
                <img src="assets/clippy/clippy.png" alt="Clippy" class="desktop-clippy-image" onerror="console.error('Clippy image failed to load:', this.src); this.style.display='none';" />
                <img src="" alt="" class="desktop-clippy-gif" style="display: none;" />
            </div>
        `;
    }
    
    setState(newState) {
        if (this.state === newState) return;
        
        const oldState = this.state;
        this.state = newState;
        
        // Handle state transitions
        switch(newState) {
            case 'STATIC':
                this.onStaticState();
                break;
            case 'TRANSITION_WRAP':
                this.onTransitionWrap();
                break;
            case 'ANIMATED_GIF':
                this.onAnimatedGIF();
                break;
            case 'TRANSITION_UNWRAP':
                this.onTransitionUnwrap();
                break;
            case 'MOVING':
                this.onMovingState();
                break;
        }
    }
    
    onStaticState() {
        // Show static image, hide GIF
        const img = this.element?.querySelector('.desktop-clippy-image');
        const gif = this.element?.querySelector('.desktop-clippy-gif');
        if (img) {
            img.style.display = 'block';
            img.style.opacity = '1';
        }
        if (gif) {
            gif.style.display = 'none';
            gif.src = '';
        }
        this.currentGIF = null;
        this.currentGIFPath = null;
        
        // Ensure element itself is visible
        if (this.element) {
            this.element.style.display = 'block';
            this.element.style.opacity = '1';
            this.element.style.visibility = 'visible';
        }
    }
    
    async onTransitionWrap() {
        const inner = this.element?.querySelector('.desktop-clippy-inner');
        const paper = this.element?.querySelector('.desktop-clippy-paper');
        if (!inner || !paper) return;
        
        // Start wrap animation
        inner.classList.add('clippy-wrap');
        
        // Wait for animation to complete
        await this.waitForAnimation(inner, 'clippy-wrap', 400);
        
        // Transition complete, move to ANIMATED_GIF
        this.setState('ANIMATED_GIF');
    }
    
    async onAnimatedGIF() {
        // Load and show GIF
        const gifPath = this.pendingDeterministic || this.getNextIdleGIF();
        if (!gifPath) {
            // No GIF available, return to static
            this.setState('TRANSITION_UNWRAP');
            return;
        }
        
        this.currentGIFPath = gifPath;
        const wasDeterministic = !!this.pendingDeterministic;
        this.pendingDeterministic = null;
        
        try {
            // Timeout safeguard: if loading takes too long, fallback
            const loadTimeout = setTimeout(() => {
                console.warn('GIF load timeout:', gifPath);
                this.setState('TRANSITION_UNWRAP');
            }, 5000);
            
            const gifImg = await this.assetManager.loadGIF(gifPath);
            clearTimeout(loadTimeout);
            
            const gifElement = this.element?.querySelector('.desktop-clippy-gif');
            const imgElement = this.element?.querySelector('.desktop-clippy-image');
            
            if (gifElement && imgElement) {
                // Hide static, show GIF
                imgElement.style.opacity = '0';
                gifElement.src = gifImg.src;
                gifElement.style.display = 'block';
                gifElement.style.opacity = '1';
                
                // Determine if this is deterministic (1 loop) or idle (continuous)
                const isDeterministic = wasDeterministic || gifPath.includes('/deterministic/');
                
                if (isDeterministic) {
                    // Play for estimated duration (default 3 seconds for deterministic)
                    await this.waitForDuration(3000);
                    this.setState('TRANSITION_UNWRAP');
                } else {
                    // Idle GIF: play for 8-10 seconds
                    const duration = 8000 + Math.random() * 2000;
                    await this.waitForDuration(duration);
                    
                    // Reset idle GIF cooldown after playing
                    this.cooldowns.idleGif.current = this.cooldowns.idleGif.min + 
                        Math.random() * (this.cooldowns.idleGif.max - this.cooldowns.idleGif.min);
                    
                    this.setState('TRANSITION_UNWRAP');
                }
            }
        } catch (error) {
            console.warn('Failed to load GIF:', gifPath, error);
            // Fallback to static
            this.setState('TRANSITION_UNWRAP');
        }
    }
    
    async onTransitionUnwrap() {
        const inner = this.element?.querySelector('.desktop-clippy-inner');
        if (!inner) return;
        
        // Start unwrap animation
        inner.classList.remove('clippy-wrap');
        inner.classList.add('clippy-unwrap');
        
        // Wait for animation
        await this.waitForAnimation(inner, 'clippy-unwrap', 400);
        
        // Clean up
        inner.classList.remove('clippy-unwrap');
        
        // Return to static
        this.setState('STATIC');
    }
    
    onMovingState() {
        // Movement is handled by moveToPosition
    }
    
    async moveToPosition(targetX, targetY) {
        if (this.isMoving || this.reducedMotion) return;
        
        this.isMoving = true;
        this.setState('MOVING');
        this.targetPosition = { x: targetX, y: targetY };
        
        const distance = Math.sqrt(
            Math.pow(targetX - this.position.x, 2) + 
            Math.pow(targetY - this.position.y, 2)
        );
        
        // Break into hops (3-5 hops)
        const numHops = Math.min(5, Math.max(3, Math.ceil(distance / 40)));
        const hopDistance = distance / numHops;
        const angle = Math.atan2(targetY - this.position.y, targetX - this.position.x);
        
        for (let i = 0; i < numHops; i++) {
            const progress = (i + 1) / numHops;
            const newX = this.position.x + (targetX - this.position.x) * progress;
            const newY = this.position.y + (targetY - this.position.y) * progress;
            
            // Apply hop animation
            await this.performHop(newX, newY);
        }
        
        this.position = { x: targetX, y: targetY };
        this.isMoving = false;
        
        // After movement, check if idle GIF should play
        if (this.state === 'MOVING') {
            // Small delay before deciding next action
            await this.waitForDuration(200);
            
            if (this.shouldPlayIdleGIF()) {
                this.setState('TRANSITION_WRAP');
            } else {
                this.setState('STATIC');
            }
        }
    }
    
    async performHop(x, y) {
        if (!this.element) return;
        
        // Update position immediately (CSS transition will animate smoothly)
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
        
        // Add hop animation class for bounce effect
        this.element.classList.add('clippy-hop');
        
        // Wait for hop animation (250ms)
        await this.waitForDuration(250);
        
        this.element.classList.remove('clippy-hop');
        
        // Small pause between hops
        await this.waitForDuration(100);
    }
    
    setRandomPosition() {
        const desktop = document.getElementById('desktop');
        if (!desktop || !this.element) return;
        
        const desktopRect = desktop.getBoundingClientRect();
        const taskbarHeight = 60; // Approximate taskbar height
        const margin = 100; // Safe margin from edges
        const clippySize = 80; // Clippy size
        
        // Calculate safe bounds
        const minX = margin;
        const maxX = desktopRect.width - margin - clippySize;
        const minY = margin;
        const maxY = desktopRect.height - taskbarHeight - margin - clippySize;
        
        // Ensure valid bounds
        if (maxX <= minX || maxY <= minY) {
            // Fallback to center if bounds are invalid
            const x = desktopRect.width / 2 - clippySize / 2;
            const y = desktopRect.height / 2 - clippySize / 2;
            this.position = { x, y };
            this.element.style.left = `${x}px`;
            this.element.style.top = `${y}px`;
            return;
        }
        
        const x = minX + Math.random() * (maxX - minX);
        const y = minY + Math.random() * (maxY - minY);
        
        this.position = { x, y };
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }
    
    getNextIdleGIF() {
        // Check cooldown
        if (this.cooldowns.idleGif.current > 0) {
            return null;
        }
        
        const gifPath = this.assetManager.getRandomIdleGIF();
        if (!gifPath) return null;
        
        // Avoid repeating last GIF
        if (gifPath === this.lastIdleGIF) {
            // Get all idle GIFs from asset manager
            const allIdle = [
                'assets/clippy/idle/clippy-animation-when-idle-have-a-coffee-in-his-hand.gif',
                'assets/clippy/idle/clippy-animation-when-idle-saying-are-you-there.gif',
                'assets/clippy/idle/clippy-animation-when-idle-clicking-laptop-fast.gif',
                'assets/clippy/idle/clippy-animation-when-idle-driking-beer.gif',
                'assets/clippy/idle/clippy-animation-when-idle-removing-glass-a-bit-to-look-at-user.gif',
                'assets/clippy/idle/clippy-animation-when-idle-saying-im-here.gif',
                'assets/clippy/idle/clippy-animation-when-idle-shaking-around.gif',
                'assets/clippy/idle/clippy-animation-when-idle-sleepy-in-front-of-laptop.gif',
                'assets/clippy/idle/clippy-animation-when-idle-smelling-mug-of-coffee.gif',
                'assets/clippy/idle/clippy-animation-when-idle-stuck-in-traffic.gif',
                'assets/clippy/idle/clippy-animation-when-idle-talking-to-flask.gif',
                'assets/clippy/idle/clippy-animation-when-idle-with-sun-and-have-sun-glasses.gif'
            ];
            const otherGIFs = allIdle.filter(p => p !== gifPath);
            if (otherGIFs.length > 0) {
                return otherGIFs[Math.floor(Math.random() * otherGIFs.length)];
            }
        }
        
        this.lastIdleGIF = gifPath;
        return gifPath;
    }
    
    shouldPlayIdleGIF() {
        return this.cooldowns.idleGif.current <= 0 && this.getNextIdleGIF() !== null;
    }
    
    startIdleCycle() {
        if (this.idleTimer) clearInterval(this.idleTimer);
        if (this.reducedMotion) return;
        
        this.idleTimer = setInterval(() => {
            try {
                this.updateCooldowns();
                
                // If static and cooldown expired, trigger idle GIF
                if (this.state === 'STATIC' && this.shouldPlayIdleGIF()) {
                    // Random delay to feel natural (3-10 seconds)
                    const delay = 3000 + Math.random() * 7000;
                    setTimeout(() => {
                        if (this.state === 'STATIC' && this.shouldPlayIdleGIF()) {
                            this.setState('TRANSITION_WRAP');
                        }
                    }, delay);
                }
            } catch (error) {
                console.error('Error in idle cycle:', error);
            }
        }, 1000);
    }
    
    startMovementCycle() {
        if (this.movementTimer) clearInterval(this.movementTimer);
        if (this.reducedMotion) return;
        
        this.movementTimer = setInterval(() => {
            try {
                this.updateCooldowns();
                
                // Check if movement should occur
                if (this.state === 'STATIC' && 
                    this.cooldowns.movement.current <= 0 && 
                    !this.isMoving) {
                    
                    // Probability check
                    const probability = this.getMovementProbability();
                    if (Math.random() < probability) {
                        this.triggerMovement().catch(error => {
                            console.error('Error in movement:', error);
                            this.isMoving = false;
                            this.setState('STATIC');
                        });
                    }
                }
            } catch (error) {
                console.error('Error in movement cycle:', error);
            }
        }, 2000);
    }
    
    getMovementProbability() {
        // Base probability: 15%
        let prob = 0.15;
        
        // Increase if been static for a while
        if (this.state === 'STATIC') {
            // Check time since last movement (simplified)
            prob = 0.20;
        }
        
        // After idle GIF: 30% chance
        if (this.lastIdleGIF) {
            prob = 0.30;
        }
        
        return prob;
    }
    
    async triggerMovement() {
        if (this.isMoving || this.reducedMotion) return;
        
        // Calculate new position
        const desktop = document.getElementById('desktop');
        if (!desktop) return;
        
        const desktopRect = desktop.getBoundingClientRect();
        const taskbarHeight = 60;
        const margin = 100;
        const clippySize = 80;
        const minDistance = 100; // Minimum movement distance
        
        // Calculate safe bounds
        const minX = margin;
        const maxX = desktopRect.width - margin - clippySize;
        const minY = margin;
        const maxY = desktopRect.height - taskbarHeight - margin - clippySize;
        
        // Ensure valid bounds
        if (maxX <= minX || maxY <= minY) {
            return; // Can't move if bounds are invalid
        }
        
        let newX, newY;
        let attempts = 0;
        do {
            newX = minX + Math.random() * (maxX - minX);
            newY = minY + Math.random() * (maxY - minY);
            attempts++;
        } while (
            Math.sqrt(Math.pow(newX - this.position.x, 2) + Math.pow(newY - this.position.y, 2)) < minDistance &&
            attempts < 10
        );
        
        // Reset movement cooldown
        this.cooldowns.movement.current = this.cooldowns.movement.min + 
            Math.random() * (this.cooldowns.movement.max - this.cooldowns.movement.min);
        
        await this.moveToPosition(newX, newY);
    }
    
    updateCooldowns() {
        // Update cooldown timers
        Object.keys(this.cooldowns).forEach(key => {
            if (this.cooldowns[key].current > 0) {
                this.cooldowns[key].current -= 1000; // Decrease by 1 second
                if (this.cooldowns[key].current < 0) {
                    this.cooldowns[key].current = 0;
                }
            }
        });
    }
    
    /**
     * Trigger a deterministic animation
     * @param {string} event - Event name
     */
    async triggerDeterministic(event) {
        if (this.reducedMotion) return;
        
        const gifPath = this.assetManager.getDeterministicGIF(event);
        if (!gifPath) return; // No GIF for this event
        
        // If busy, queue it (replace any existing queue)
        if (this.state !== 'STATIC' && this.state !== 'ANIMATED_GIF') {
            this.pendingDeterministic = gifPath;
            return;
        }
        
        // If in idle GIF, interrupt it
        if (this.state === 'ANIMATED_GIF' && this.currentGIFPath?.includes('/idle/')) {
            this.pendingDeterministic = gifPath;
            // Force transition to unwrap, then wrap again
            this.setState('TRANSITION_UNWRAP');
            setTimeout(() => {
                if (this.pendingDeterministic === gifPath) {
                    this.setState('TRANSITION_WRAP');
                }
            }, 500);
            return;
        }
        
        // Set cooldown
        this.cooldowns.deterministic.current = this.cooldowns.deterministic.min;
        
        // Trigger animation
        this.pendingDeterministic = gifPath;
        if (this.state === 'STATIC') {
            this.setState('TRANSITION_WRAP');
        }
    }
    
    resetToStatic() {
        // Reset everything to static state
        this.setState('STATIC');
        this.currentGIF = null;
        this.currentGIFPath = null;
        this.pendingDeterministic = null;
        this.isMoving = false;
        if (this.idleTimer) clearInterval(this.idleTimer);
        if (this.movementTimer) clearInterval(this.movementTimer);
    }
    
    /**
     * Safety timeout: if stuck in any state for too long, reset
     */
    startSafetyTimeout() {
        if (this.safetyTimeout) clearTimeout(this.safetyTimeout);
        
        this.safetyTimeout = setTimeout(() => {
            // If stuck in transition or animated state for > 15 seconds, reset
            if (this.state !== 'STATIC' && this.state !== 'MOVING') {
                console.warn('Clippy stuck in state:', this.state, '- resetting to STATIC');
                this.resetToStatic();
            }
            this.startSafetyTimeout(); // Restart timeout
        }, 15000);
    }
    
    // Utility methods
    waitForDuration(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    waitForAnimation(element, className, duration) {
        return new Promise(resolve => {
            const handler = () => {
                element.removeEventListener('animationend', handler);
                resolve();
            };
            element.addEventListener('animationend', handler);
            // Fallback timeout
            setTimeout(handler, duration + 100);
        });
    }
}

// Create singleton instance
let desktopClippyInstance = null;

function initializeDesktopClippy() {
    if (!desktopClippyInstance) {
        desktopClippyInstance = new DesktopClippy();
        // Now call init after instance is created
        desktopClippyInstance.init();
    }
    return desktopClippyInstance;
}

// Initialize after boot - but don't create instance in constructor
// The instance will be created here
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        document.addEventListener('bootComplete', () => {
            setTimeout(() => {
                if (!desktopClippyInstance) {
                    initializeDesktopClippy();
                }
            }, 1500); // Slightly longer delay to ensure everything is ready
        }, { once: true });
    });
} else {
    if (document.getElementById('bootScreen')) {
        document.addEventListener('bootComplete', () => {
            setTimeout(() => {
                if (!desktopClippyInstance) {
                    initializeDesktopClippy();
                }
            }, 1500);
        }, { once: true });
    } else {
        // Boot already complete, initialize immediately
        setTimeout(() => {
            if (!desktopClippyInstance) {
                initializeDesktopClippy();
            }
        }, 1500);
    }
}

// Export for global access
window.desktopClippy = {
    instance: () => desktopClippyInstance,
    trigger: (event) => desktopClippyInstance?.triggerDeterministic(event),
    // Debug function to manually show Clippy
    show: () => {
        if (desktopClippyInstance && desktopClippyInstance.element) {
            const el = desktopClippyInstance.element;
            el.style.display = 'block';
            el.style.opacity = '1';
            el.style.visibility = 'visible';
            console.log('Desktop Clippy element:', el);
            console.log('Position:', desktopClippyInstance.position);
            console.log('State:', desktopClippyInstance.state);
            const rect = el.getBoundingClientRect();
            console.log('Bounding rect:', rect);
            return el;
        } else {
            console.log('Desktop Clippy instance:', desktopClippyInstance);
            if (!desktopClippyInstance) {
                initializeDesktopClippy();
            }
            return null;
        }
    }
};

