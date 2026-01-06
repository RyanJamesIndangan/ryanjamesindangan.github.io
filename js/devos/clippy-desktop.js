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
            idleGif: { min: 3000, max: 6000, current: 0 },
            movement: { min: 0, max: 0, current: 0 }, // No cooldown, cycle controls timing
            deterministic: { min: 2000, current: 0 }
        };
        this.position = { x: 0, y: 0 };
        this.targetPosition = null;
        this.isMoving = false;
        this.jumpsInSequence = 0; // Track jumps in current sequence
        this.targetJumps = 0; // Target number of jumps (2-5)
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
            console.log('DesktopClippy: Reduced motion enabled, skipping animations');
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
                    console.warn('DesktopClippy: Asset Manager not available, retrying...');
                    // Retry a few more times
                    setTimeout(() => {
                        this.assetManager = window.clippyAssetManager;
                        if (this.assetManager) {
                            this.init();
                        } else {
                            console.error('DesktopClippy: Asset Manager still not available after retries');
                        }
                    }, 500);
                }
            }, 100);
            return;
        }
        
        // Wait for DOM and boot to complete
        const tryCreate = () => {
            const desktop = document.getElementById('desktop');
            if (!desktop) {
                console.log('DesktopClippy: Desktop element not found, retrying...');
                setTimeout(tryCreate, 500);
                return;
            }
            console.log('DesktopClippy: Creating Clippy element...');
            this.createClippy();
        };
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                // Wait for boot complete or timeout
                const bootHandler = () => {
                    setTimeout(tryCreate, 500);
                };
                document.addEventListener('bootComplete', bootHandler, { once: true });
                // Fallback: if bootComplete doesn't fire within 5 seconds, create anyway
                setTimeout(() => {
                    if (!this.element) {
                        console.log('DesktopClippy: BootComplete timeout, creating anyway...');
                        tryCreate();
                    }
                }, 5000);
            });
        } else {
            if (document.getElementById('bootScreen')) {
                const bootHandler = () => {
                    setTimeout(tryCreate, 500);
                };
                document.addEventListener('bootComplete', bootHandler, { once: true });
                // Fallback timeout
                setTimeout(() => {
                    if (!this.element) {
                        console.log('DesktopClippy: BootComplete timeout, creating anyway...');
                        tryCreate();
                    }
                }, 5000);
            } else {
                // Boot already complete, create immediately
                setTimeout(tryCreate, 500);
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
        
        // Start movement cycle (idle cycle is now part of movement flow)
        this.startMovementCycle();
        
        // Trigger initial movement after a short delay
        setTimeout(() => {
            // Ensure we're in STATIC state and not already moving
            if (this.state !== 'STATIC') {
                this.setState('STATIC');
            }
            
            if (!this.isMoving) {
                // Reset cooldown for initial movement
                this.cooldowns.movement.current = 0;
                
                this.triggerMovement().catch(error => {
                    console.error('Error in initial movement:', error);
                    this.isMoving = false;
                    this.setState('STATIC');
                });
            }
        }, 2000); // Wait 2 seconds after creation before first movement
        
        // Start safety timeout
        this.startSafetyTimeout();
    }
    
    getStaticHTML() {
        return `
            <div class="desktop-clippy-inner">
                <!-- Multi-panel paper for realistic wrapping -->
                <div class="desktop-clippy-paper-wrapper">
                    <div class="desktop-clippy-paper-panel paper-top"></div>
                    <div class="desktop-clippy-paper-panel paper-right"></div>
                    <div class="desktop-clippy-paper-panel paper-bottom"></div>
                    <div class="desktop-clippy-paper-panel paper-left"></div>
                    <div class="desktop-clippy-paper-panel paper-front"></div>
                </div>
                <img src="assets/clippy/clippy.png" alt="Clippy" class="desktop-clippy-image" onload="console.log('DesktopClippy: Image loaded successfully');" onerror="console.error('DesktopClippy: Image failed to load:', this.src); this.style.display='none';" />
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
            img.style.zIndex = '0';
        }
        if (gif) {
            gif.style.display = 'none';
            gif.style.opacity = '0';
            gif.src = '';
            gif.style.zIndex = '2';
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
        const paperWrapper = this.element?.querySelector('.desktop-clippy-paper-wrapper');
        const image = this.element?.querySelector('.desktop-clippy-image');
        if (!inner || !paperWrapper) return;
        
        const topPanel = paperWrapper.querySelector('.paper-top');
        const rightPanel = paperWrapper.querySelector('.paper-right');
        const bottomPanel = paperWrapper.querySelector('.paper-bottom');
        const leftPanel = paperWrapper.querySelector('.paper-left');
        const frontPanel = paperWrapper.querySelector('.paper-front');
        
        if (!topPanel || !rightPanel || !bottomPanel || !leftPanel || !frontPanel) return;
        
        // Use GSAP Timeline for realistic multi-panel paper wrap
        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline();
            
            // Reset all panels to starting positions (clean state)
            gsap.set([topPanel, rightPanel, bottomPanel, leftPanel, frontPanel], {
                opacity: 0,
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                scale: 1,
                x: 0,
                y: 0,
                z: 0
            });
            
            // Wrap animation must be exactly 3 seconds total
            // Stage 1: Top panel folds down (0.5s)
            tl.set(topPanel, {
                opacity: 1,
                rotateX: -90,
                transformOrigin: 'bottom center'
            });
            tl.to(topPanel, {
                rotateX: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
            
            // Stage 2: Right panel folds left (0.5s) - overlaps with top
            tl.set(rightPanel, {
                opacity: 1,
                rotateY: 90,
                transformOrigin: 'left center'
            });
            tl.to(rightPanel, {
                rotateY: 0,
                duration: 0.5,
                ease: 'power2.out'
            }, '-=0.3');
            
            // Stage 3: Bottom panel folds up (0.5s)
            tl.set(bottomPanel, {
                opacity: 1,
                rotateX: 90,
                transformOrigin: 'top center'
            });
            tl.to(bottomPanel, {
                rotateX: 0,
                duration: 0.5,
                ease: 'power2.out'
            }, '-=0.3');
            
            // Stage 4: Left panel folds right (0.5s)
            tl.set(leftPanel, {
                opacity: 1,
                rotateY: -90,
                transformOrigin: 'right center'
            });
            tl.to(leftPanel, {
                rotateY: 0,
                duration: 0.5,
                ease: 'power2.out'
            }, '-=0.3');
            
            // Stage 5: Front panel covers everything (0.5s)
            tl.set(frontPanel, {
                opacity: 0,
                scale: 0.8,
                z: 0
            });
            tl.to(frontPanel, {
                opacity: 1,
                scale: 1,
                z: 40,
                duration: 0.5,
                ease: 'power2.in'
            }, '-=0.3');
            
            // Hide image as paper wraps (overlaps with panels)
            if (image) {
                tl.to(image, {
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.5,
                    ease: 'power2.in'
                }, '-=0.8');
            }
            
            // Stage 6: All panels fade out to reveal GIF underneath (0.5s to complete 3s total)
            tl.to([topPanel, rightPanel, bottomPanel, leftPanel, frontPanel], {
                opacity: 0,
                duration: 0.5,
                ease: 'power1.out'
            });
            
            await tl;
        } else {
            // Fallback
            inner.classList.add('clippy-wrap');
            await this.waitForAnimation(inner, 'clippy-wrap', 3000);
        }
        
        // Wait for wrap animation to fully complete before showing GIF
        // This ensures proper sequencing
        await this.waitForDuration(100);
        
        // Transition complete, move to ANIMATED_GIF
        this.setState('ANIMATED_GIF');
    }
    
    async onAnimatedGIF() {
        // Clear previous GIF path to ensure we get a new random GIF
        this.currentGIFPath = null;
        this.currentGIF = null;
        
        // Load and show GIF - get a fresh random GIF
        const gifPath = this.pendingDeterministic || this.getNextIdleGIF();
        if (!gifPath) {
            // No GIF available, return to static
            console.warn('Clippy: No GIF available');
            this.setState('TRANSITION_UNWRAP');
            return;
        }
        
        // Ensure we're getting a different GIF if we just showed one
        if (gifPath === this.lastIdleGIF && !this.pendingDeterministic) {
            // Force a different GIF by temporarily clearing lastIdleGIF
            const tempLast = this.lastIdleGIF;
            this.lastIdleGIF = null;
            const newGifPath = this.getNextIdleGIF();
            if (newGifPath && newGifPath !== gifPath) {
                this.currentGIFPath = newGifPath;
            } else {
                this.currentGIFPath = gifPath;
            }
            this.lastIdleGIF = tempLast;
        } else {
            this.currentGIFPath = gifPath;
        }
        
        const wasDeterministic = !!this.pendingDeterministic;
        this.pendingDeterministic = null;
        
        const gifElement = this.element?.querySelector('.desktop-clippy-gif');
        const imgElement = this.element?.querySelector('.desktop-clippy-image');
        
        if (!gifElement || !imgElement) {
            console.warn('Clippy: GIF or image element not found');
            this.setState('TRANSITION_UNWRAP');
            return;
        }
        
        try {
            // Timeout safeguard: if loading takes too long, fallback
            let loadTimeout;
            const timeoutPromise = new Promise((_, reject) => {
                loadTimeout = setTimeout(() => {
                    console.warn('Clippy: GIF load timeout:', gifPath);
                    reject(new Error('GIF load timeout'));
                }, 8000); // Increased timeout to 8 seconds
            });
            
            // Load GIF
            const loadPromise = this.assetManager.loadGIF(gifPath);
            const gifImg = await Promise.race([loadPromise, timeoutPromise]);
            clearTimeout(loadTimeout);
            
            // Ensure we're still in ANIMATED_GIF state (not interrupted)
            if (this.state !== 'ANIMATED_GIF') {
                console.log('Clippy: State changed during GIF load, aborting');
                return;
            }
            
            // Hide static image smoothly with GSAP
            if (typeof gsap !== 'undefined') {
                await gsap.to(imgElement, {
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.2,
                    ease: 'power2.in'
                });
            } else {
                imgElement.style.opacity = '0';
            }
            
            // Hide static image first
            if (imgElement) {
                imgElement.style.display = 'none';
            }
            
            // Set GIF source and wait for it to load
            gifElement.src = gifImg.src;
            gifElement.style.display = 'block';
            gifElement.style.opacity = '0';
            gifElement.style.zIndex = '2';
            
            // Wait for GIF to actually load and be ready
            await new Promise((resolve) => {
                if (gifImg.complete && gifImg.naturalWidth > 0) {
                    // Already loaded
                    resolve();
                } else {
                    // Wait for load
                    const onLoad = () => {
                        gifElement.removeEventListener('load', onLoad);
                        gifElement.removeEventListener('error', onError);
                        resolve();
                    };
                    const onError = () => {
                        gifElement.removeEventListener('load', onLoad);
                        gifElement.removeEventListener('error', onError);
                        console.warn('Clippy: GIF element failed to load:', gifPath);
                        resolve(); // Continue anyway
                    };
                    gifElement.addEventListener('load', onLoad);
                    gifElement.addEventListener('error', onError);
                    // Fallback timeout
                    setTimeout(() => {
                        gifElement.removeEventListener('load', onLoad);
                        gifElement.removeEventListener('error', onError);
                        resolve();
                    }, 2000);
                }
            });
            
            // Ensure we're still in ANIMATED_GIF state
            if (this.state !== 'ANIMATED_GIF') {
                console.log('Clippy: State changed after GIF load, aborting');
                return;
            }
            
            // Show GIF smoothly with fade in
            if (typeof gsap !== 'undefined') {
                gsap.set(gifElement, { opacity: 0, scale: 0.9 });
                await gsap.to(gifElement, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            } else {
                gifElement.style.opacity = '1';
                await this.waitForDuration(300);
            }
            
            // Determine if this is deterministic (1 loop) or idle (continuous)
            const isDeterministic = wasDeterministic || gifPath.includes('/deterministic/');
            
            // Play GIF for exactly 5 seconds (excluding transformation time)
            // This is the visible duration after wrap completes
            // Wait for the full duration to ensure proper sequencing
            await this.waitForDuration(5000);
            
            // Ensure we're still in ANIMATED_GIF state before unwrapping
            // This prevents overlapping animations
            if (this.state === 'ANIMATED_GIF') {
                // Small pause to ensure GIF display is complete
                await this.waitForDuration(100);
                this.setState('TRANSITION_UNWRAP');
            }
            
            // Reset idle GIF cooldown after playing (if it was idle)
            if (!isDeterministic) {
                this.cooldowns.idleGif.current = this.cooldowns.idleGif.min + 
                    Math.random() * (this.cooldowns.idleGif.max - this.cooldowns.idleGif.min);
            }
        } catch (error) {
            console.warn('Clippy: Failed to load GIF:', gifPath, error);
            // Fallback to static
            if (this.state === 'ANIMATED_GIF') {
                this.setState('TRANSITION_UNWRAP');
            }
        }
    }
    
    async onTransitionUnwrap() {
        const inner = this.element?.querySelector('.desktop-clippy-inner');
        const paperWrapper = this.element?.querySelector('.desktop-clippy-paper-wrapper');
        const gif = this.element?.querySelector('.desktop-clippy-gif');
        const image = this.element?.querySelector('.desktop-clippy-image');
        if (!inner || !paperWrapper) return;
        
        const topPanel = paperWrapper.querySelector('.paper-top');
        const rightPanel = paperWrapper.querySelector('.paper-right');
        const bottomPanel = paperWrapper.querySelector('.paper-bottom');
        const leftPanel = paperWrapper.querySelector('.paper-left');
        const frontPanel = paperWrapper.querySelector('.paper-front');
        
        if (!topPanel || !rightPanel || !bottomPanel || !leftPanel || !frontPanel) return;
        
        // Use GSAP Timeline for realistic multi-panel paper unwrap
        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline();
            
            // Reset all panels to wrapped state (visible) for unwrap animation
            gsap.set([topPanel, rightPanel, bottomPanel, leftPanel, frontPanel], {
                opacity: 0.85,
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                scale: 1,
                x: 0,
                y: 0,
                z: 0
            });
            
            // Unwrap animation must be exactly 3 seconds total
            // Stage 1: Front panel peels away first (0.5s)
            tl.to(frontPanel, {
                opacity: 0,
                scale: 0.8,
                z: 80,
                rotateY: -45,
                duration: 0.5,
                ease: 'power2.out'
            });
            
            // Stage 2: Left panel unfolds to the left (0.5s)
            tl.to(leftPanel, {
                opacity: 0,
                rotateY: -90,
                x: '-=30',
                duration: 0.5,
                ease: 'power2.out'
            }, '-=0.3');
            
            // Stage 3: Right panel unfolds to the right (0.5s)
            tl.to(rightPanel, {
                opacity: 0,
                rotateY: 90,
                x: '+=30',
                duration: 0.5,
                ease: 'power2.out'
            }, '-=0.3');
            
            // Stage 4: Top panel folds up (0.5s)
            tl.to(topPanel, {
                opacity: 0,
                rotateX: -90,
                y: '-=20',
                duration: 0.5,
                ease: 'power2.out'
            }, '-=0.3');
            
            // Stage 5: Bottom panel folds down (0.5s)
            tl.to(bottomPanel, {
                opacity: 0,
                rotateX: 90,
                y: '+=20',
                duration: 0.5,
                ease: 'power2.out'
            }, '-=0.3');
            
            // Hide GIF as paper unwraps (overlaps with panels)
            if (gif) {
                tl.to(gif, {
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.5,
                    ease: 'power2.in',
                    onComplete: () => {
                        gif.style.display = 'none';
                        gif.style.opacity = '0';
                        gif.src = '';
                    }
                }, '-=0.8');
            }
            
            // Show static image with smooth reveal (0.5s to complete 3s total)
            if (image) {
                tl.set(image, { 
                    opacity: 0, 
                    scale: 0.9,
                    display: 'block'
                }, '-=0.5');
                tl.to(image, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    ease: 'power2.out'
                }, '-=0.5');
            }
            
            // Reset all panels to clean state after unwrap completes
            tl.set([topPanel, rightPanel, bottomPanel, leftPanel, frontPanel], {
                opacity: 0,
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                scale: 1,
                x: 0,
                y: 0,
                z: 0
            });
            
            await tl;
        } else {
            // Fallback
            inner.classList.remove('clippy-wrap');
            inner.classList.add('clippy-unwrap');
            await this.waitForAnimation(inner, 'clippy-unwrap', 3000);
            inner.classList.remove('clippy-unwrap');
            
            if (gif) {
                gif.style.display = 'none';
                gif.style.opacity = '0';
                gif.src = '';
            }
            if (image) {
                image.style.display = 'block';
                image.style.opacity = '1';
                image.style.zIndex = '0';
            }
        }
        
        // Wait for unwrap animation to fully complete before returning to static
        // This ensures proper sequencing
        await this.waitForDuration(100);
        
        // Return to static state
        this.setState('STATIC');
        
        // After unwrap completes (1 second), immediately start new jump sequence
        // Reset jump counter and start new sequence
        this.jumpsInSequence = 0;
        this.targetJumps = Math.floor(Math.random() * 4) + 2; // Random 2-5 jumps
        
        // Small pause then start jumping again
        await this.waitForDuration(200);
        
        if (!this.isMoving && this.state === 'STATIC') {
            this.triggerMovement().catch(error => {
                console.error('Error in movement after unwrap:', error);
                this.isMoving = false;
                this.setState('STATIC');
            });
        }
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
        
        // Limit maximum jump distance to make jumps shorter
        const maxJumpDistance = 150; // Maximum distance per jump
        const limitedDistance = Math.min(distance, maxJumpDistance);
        
        // If distance is too long, move to an intermediate point
        let actualTargetX = targetX;
        let actualTargetY = targetY;
        if (distance > maxJumpDistance) {
            const ratio = maxJumpDistance / distance;
            actualTargetX = this.position.x + (targetX - this.position.x) * ratio;
            actualTargetY = this.position.y + (targetY - this.position.y) * ratio;
        }
        
        // Break into hops (2-5 hops as per requirement)
        const numHops = Math.min(5, Math.max(2, Math.ceil(limitedDistance / 50)));
        const hopDistance = limitedDistance / numHops;
        const angle = Math.atan2(actualTargetY - this.position.y, actualTargetX - this.position.x);
        
        for (let i = 0; i < numHops; i++) {
            const progress = (i + 1) / numHops;
            const newX = this.position.x + (actualTargetX - this.position.x) * progress;
            const newY = this.position.y + (actualTargetY - this.position.y) * progress;
            
            // Apply hop animation
            await this.performHop(newX, newY);
        }
        
        this.position = { x: actualTargetX, y: actualTargetY };
        
        // Increment jump counter
        this.jumpsInSequence++;
        
        // Check if we've completed the target number of jumps (2-5)
        if (this.jumpsInSequence >= this.targetJumps) {
            // Reset jump counter
            this.jumpsInSequence = 0;
            this.isMoving = false;
            
            // Set to STATIC and start transformation cycle
            this.setState('STATIC');
            
            // Small pause after stopping (0.2s)
            await this.waitForDuration(200);
            
            // Start wrap transformation (1 second)
            this.setState('TRANSITION_WRAP');
        } else {
            // Continue jumping - calculate next position
            this.isMoving = false;
            await this.waitForDuration(100); // Small pause between jumps
            
            // Trigger next jump in sequence
            if (this.state === 'STATIC' || this.state === 'MOVING') {
                await this.triggerNextJump();
            }
        }
    }
    
    async triggerNextJump() {
        // Calculate next position for jump sequence
        const desktop = document.getElementById('desktop');
        if (!desktop) {
            return;
        }
        
        const desktopRect = desktop.getBoundingClientRect();
        const taskbarHeight = 60;
        const margin = 100;
        const clippySize = 80;
        const maxJumpDistance = 150;
        
        // Calculate safe bounds
        const minX = margin;
        const maxX = desktopRect.width - margin - clippySize;
        const minY = margin;
        const maxY = desktopRect.height - taskbarHeight - margin - clippySize;
        
        // Ensure valid bounds
        if (maxX <= minX || maxY <= minY) {
            return;
        }
        
        // Calculate random position within jump distance
        let newX, newY;
        let attempts = 0;
        const maxAttempts = 20;
        
        do {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * maxJumpDistance + 50; // 50-200px
            newX = this.position.x + Math.cos(angle) * distance;
            newY = this.position.y + Math.sin(angle) * distance;
            
            // Clamp to bounds
            newX = Math.max(minX, Math.min(maxX, newX));
            newY = Math.max(minY, Math.min(maxY, newY));
            
            attempts++;
        } while (attempts < maxAttempts && 
                 (newX === this.position.x && newY === this.position.y));
        
        // Move to next position
        await this.moveToPosition(newX, newY);
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
        // Idle cycle is now handled by movement cycle
        // GIFs are triggered after movement stops, not randomly
        // This creates a clear flow: MOVE -> STOP -> GIF -> BACK -> MOVE
    }
    
    startMovementCycle() {
        if (this.movementTimer) clearInterval(this.movementTimer);
        if (this.reducedMotion) return;
        
        // Movement cycle now only checks cooldowns
        // Actual movement triggering happens after unwrap completes
        this.movementTimer = setInterval(() => {
            try {
                this.updateCooldowns();
            } catch (error) {
                console.error('Error in movement cycle:', error);
            }
        }, 1000);
    }
    
    getMovementProbability() {
        // Base probability: 40% (much higher for more movement)
        let prob = 0.40;
        
        // Increase if been static for a while
        if (this.state === 'STATIC') {
            // Check time since last movement (simplified)
            prob = 0.50;
        }
        
        // After idle GIF: 60% chance to move
        if (this.lastIdleGIF) {
            prob = 0.60;
        }
        
        return prob;
    }
    
    async triggerMovement() {
        // Prevent multiple simultaneous movements
        if (this.isMoving) {
            return;
        }
        
        if (this.reducedMotion) {
            return;
        }
        
        // Ensure we're in STATIC state before moving
        if (this.state !== 'STATIC' && this.state !== 'MOVING') {
            // Wait a bit and try again
            setTimeout(() => {
                if (this.state === 'STATIC' && !this.isMoving) {
                    this.triggerMovement();
                }
            }, 500);
            return;
        }
        
        // If starting a new jump sequence, set target jumps (2-5)
        if (this.jumpsInSequence === 0) {
            this.targetJumps = Math.floor(Math.random() * 4) + 2; // Random 2-5 jumps
        }
        
        // Calculate new position
        const desktop = document.getElementById('desktop');
        if (!desktop) {
            return;
        }
        
        const desktopRect = desktop.getBoundingClientRect();
        const taskbarHeight = 60;
        const margin = 100;
        const clippySize = 80;
        const minDistance = 50; // Reduced minimum distance for easier movement
        
        // Calculate safe bounds
        const minX = margin;
        const maxX = desktopRect.width - margin - clippySize;
        const minY = margin;
        const maxY = desktopRect.height - taskbarHeight - margin - clippySize;
        
        // Ensure valid bounds
        if (maxX <= minX || maxY <= minY) {
            return; // Can't move if bounds are invalid
        }
        
        // Initialize position if not set or is (0,0)
        if (!this.position || (this.position.x === 0 && this.position.y === 0)) {
            if (this.element) {
                const rect = this.element.getBoundingClientRect();
                this.position = {
                    x: rect.left - desktopRect.left,
                    y: rect.top - desktopRect.top
                };
            } else {
                this.setRandomPosition();
            }
        }
        
        let newX, newY;
        let attempts = 0;
        const maxAttempts = 20; // Increased attempts
        
        do {
            newX = minX + Math.random() * (maxX - minX);
            newY = minY + Math.random() * (maxY - minY);
            attempts++;
            
            // If we've tried too many times, just use any valid position
            if (attempts >= maxAttempts) {
                break;
            }
        } while (
            Math.sqrt(Math.pow(newX - this.position.x, 2) + Math.pow(newY - this.position.y, 2)) < minDistance &&
            attempts < maxAttempts
        );
        
        // Reset movement cooldown (will be set again after movement)
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
function attemptDesktopClippyInit() {
    if (!desktopClippyInstance) {
        console.log('DesktopClippy: Attempting initialization...');
        initializeDesktopClippy();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        document.addEventListener('bootComplete', () => {
            setTimeout(attemptDesktopClippyInit, 1500);
        }, { once: true });
        // Fallback: if bootComplete doesn't fire, try after 6 seconds
        setTimeout(() => {
            if (!desktopClippyInstance || !desktopClippyInstance.element) {
                console.log('DesktopClippy: BootComplete fallback triggered');
                attemptDesktopClippyInit();
            }
        }, 6000);
    });
} else {
    if (document.getElementById('bootScreen')) {
        document.addEventListener('bootComplete', () => {
            setTimeout(attemptDesktopClippyInit, 1500);
        }, { once: true });
        // Fallback timeout
        setTimeout(() => {
            if (!desktopClippyInstance || !desktopClippyInstance.element) {
                console.log('DesktopClippy: BootComplete fallback triggered');
                attemptDesktopClippyInit();
            }
        }, 6000);
    } else {
        // Boot already complete, initialize immediately
        setTimeout(attemptDesktopClippyInit, 1500);
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
    },
    // Force initialization
    init: () => {
        if (!desktopClippyInstance) {
            console.log('DesktopClippy: Force initializing...');
            initializeDesktopClippy();
        } else if (!desktopClippyInstance.element) {
            console.log('DesktopClippy: Instance exists but no element, creating...');
            desktopClippyInstance.createClippy();
        } else {
            console.log('DesktopClippy: Already initialized');
        }
    },
    // Debug info
    debug: () => {
        console.log('=== DesktopClippy Debug ===');
        console.log('Instance:', desktopClippyInstance);
        console.log('Element:', desktopClippyInstance?.element);
        console.log('State:', desktopClippyInstance?.state);
        console.log('Position:', desktopClippyInstance?.position);
        console.log('Asset Manager:', window.clippyAssetManager);
        console.log('Reduced Motion:', desktopClippyInstance?.reducedMotion);
        if (desktopClippyInstance?.element) {
            const rect = desktopClippyInstance.element.getBoundingClientRect();
            console.log('Bounding Rect:', rect);
            console.log('Computed Styles:', window.getComputedStyle(desktopClippyInstance.element));
        }
        return desktopClippyInstance;
    }
};

