// ===========================
// Easter Eggs & Hidden Features
// ===========================

class EasterEggs {
    constructor() {
        this.konamiCode = [];
        this.konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        this.secretCount = 0;
        this.init();
    }
    
    init() {
        // Konami Code
        this.initKonamiCode();
        
        // Secret click counter
        this.initSecretCounter();
        
        // Hidden keyboard shortcuts
        this.initHiddenShortcuts();
        
        // Secret message in console
        this.initConsoleMessage();
    }
    
    initKonamiCode() {
        document.addEventListener('keydown', (e) => {
            this.konamiCode.push(e.key);
            
            // Keep only last 10 keys
            if (this.konamiCode.length > 10) {
                this.konamiCode.shift();
            }
            
            // Check if sequence matches
            if (this.konamiCode.length === this.konamiSequence.length) {
                const matches = this.konamiCode.every((key, index) => 
                    key === this.konamiSequence[index]
                );
                
                if (matches) {
                    this.activateKonamiCode();
                    this.konamiCode = []; // Reset
                }
            }
        });
    }
    
    activateKonamiCode() {
        // Create confetti effect
        this.createConfetti();
        
        // Show secret message
        if (window.showNotification) {
            window.showNotification('🎉 Konami Code Activated! You found the secret! 🎉', 'success', 5000);
        }
        
        // Add rainbow effect to desktop
        document.body.classList.add('konami-active');
        setTimeout(() => {
            document.body.classList.remove('konami-active');
        }, 5000);
        
        // Play sound effect (if available)
        this.playSecretSound();
    }
    
    createConfetti() {
        const colors = ['#64ffda', '#4ade80', '#fbbf24', '#f87171', '#a78bfa', '#60a5fa'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    left: ${Math.random() * 100}vw;
                    top: -10px;
                    z-index: 100000;
                    pointer-events: none;
                    border-radius: 50%;
                    animation: confetti-fall ${1 + Math.random() * 2}s linear forwards;
                `;
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 3000);
            }, i * 20);
        }
    }
    
    playSecretSound() {
        // Create a simple beep sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            // Silently fail if audio context is not available
        }
    }
    
    initSecretCounter() {
        // Triple-click on profile photo in boot screen
        const bootLogo = document.querySelector('.logo-profile-pic');
        if (bootLogo) {
            let clickCount = 0;
            let clickTimeout;
            
            bootLogo.addEventListener('click', () => {
                clickCount++;
                clearTimeout(clickTimeout);
                
                if (clickCount === 3) {
                    this.secretCount++;
                    if (window.showNotification) {
                        window.showNotification(`🔍 Secret found! (${this.secretCount})`, 'info', 2000);
                    }
                    clickCount = 0;
                }
                
                clickTimeout = setTimeout(() => {
                    clickCount = 0;
                }, 1000);
            });
        }
    }
    
    initHiddenShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl + Shift + D = Developer mode message
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                if (window.showNotification) {
                    window.showNotification('👨‍💻 Developer mode activated! Check console for details.', 'info', 3000);
                }
                console.log('%c👨‍💻 Developer Mode', 'font-size: 20px; font-weight: bold; color: #64ffda;');
                console.log('%cPortfolio built with vanilla JavaScript, no frameworks!', 'font-size: 14px; color: #4ade80;');
                console.log('%cCheck out the code: https://github.com/ryanjamesindangan/ryanjamesindangan.github.io', 'font-size: 12px; color: #60a5fa;');
            }
            
            // Ctrl + Shift + M = Matrix mode (rain effect)
            if (e.ctrlKey && e.shiftKey && e.key === 'M') {
                e.preventDefault();
                this.activateMatrixMode();
            }
            
            // Ctrl + Shift + S = Snake game shortcut
            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                if (window.openApp) {
                    window.openApp('snake');
                }
            }
        });
    }
    
    activateMatrixMode() {
        if (document.body.classList.contains('matrix-mode')) {
            document.body.classList.remove('matrix-mode');
            if (window.showNotification) {
                window.showNotification('Matrix mode deactivated', 'info');
            }
        } else {
            document.body.classList.add('matrix-mode');
            if (window.showNotification) {
                window.showNotification('Matrix mode activated! 🟢', 'success');
            }
            this.createMatrixEffect();
        }
    }
    
    createMatrixEffect() {
        // Simple matrix rain effect
        const canvas = document.createElement('canvas');
        canvas.id = 'matrix-canvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0.3;
        `;
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);
        
        function draw() {
            if (!document.body.classList.contains('matrix-mode')) {
                canvas.remove();
                return;
            }
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#0f0';
            ctx.font = `${fontSize}px monospace`;
            
            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            
            requestAnimationFrame(draw);
        }
        
        draw();
        
        // Cleanup on window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    
    initConsoleMessage() {
        // Show a friendly message in console
        console.log('%c👋 Hello Developer!', 'font-size: 24px; font-weight: bold; color: #64ffda;');
        console.log('%cWelcome to Ryan\'s Portfolio!', 'font-size: 16px; color: #4ade80;');
        console.log('%cBuilt with vanilla JavaScript, CSS3, and lots of ❤️', 'font-size: 12px; color: #60a5fa;');
        console.log('%cTry the Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A', 'font-size: 12px; color: #fbbf24;');
        console.log('%cOr press Ctrl+Shift+D for developer mode!', 'font-size: 12px; color: #f87171;');
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.easterEggs = new EasterEggs();
    });
} else {
    window.easterEggs = new EasterEggs();
}

