// ===========================
// Desktop Enhancements
// ===========================

class DesktopEnhancements {
    constructor() {
        this.particles = [];
        this.init();
    }

    init() {
        this.initParticleEffects();
        this.initDesktopContextMenu();
        this.initWallpaperEffects();
    }

    initParticleEffects() {
        // Subtle particle effects on desktop (only on desktop, not mobile)
        if (window.innerWidth > 768) {
            const desktop = document.querySelector('.desktop');
            if (!desktop) return;

            const canvas = document.createElement('canvas');
            canvas.id = 'particleCanvas';
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '1';
            canvas.style.opacity = '0.3';
            desktop.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Create particles
            for (let i = 0; i < 30; i++) {
                this.particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 2 + 0.5,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5,
                    opacity: Math.random() * 0.5 + 0.2
                });
            }

            const animate = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                this.particles.forEach(particle => {
                    particle.x += particle.speedX;
                    particle.y += particle.speedY;

                    // Wrap around edges
                    if (particle.x < 0) particle.x = canvas.width;
                    if (particle.x > canvas.width) particle.x = 0;
                    if (particle.y < 0) particle.y = canvas.height;
                    if (particle.y > canvas.height) particle.y = 0;

                    // Draw particle
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(100, 181, 246, ${particle.opacity})`;
                    ctx.fill();
                });

                requestAnimationFrame(animate);
            };

            animate();

            // Resize handler
            window.addEventListener('resize', () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });
        }
    }

    initDesktopContextMenu() {
        const desktop = document.querySelector('.desktop');
        const contextMenu = document.getElementById('contextMenu');
        
        if (!desktop || !contextMenu) return;

        // Enhanced context menu items
        const viewCodeItem = contextMenu.querySelector('[data-action="view-code"]');
        if (viewCodeItem) {
            viewCodeItem.innerHTML = '<span class="icon">👁️</span> View Source Code';
        }

        // Add refresh desktop option
        const refreshItem = contextMenu.querySelector('[data-action="refresh"]');
        if (refreshItem) {
            refreshItem.innerHTML = '<span class="icon">🔄</span> Refresh Desktop';
        }
    }

    initWallpaperEffects() {
        // Add subtle parallax effect to wallpaper
        const wallpaper = document.querySelector('.wallpaper');
        if (!wallpaper || window.innerWidth <= 768) return;

        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
        });

        const animate = () => {
            targetX += (mouseX - targetX) * 0.05;
            targetY += (mouseY - targetY) * 0.05;
            
            wallpaper.style.transform = `translate(${targetX}px, ${targetY}px)`;
            requestAnimationFrame(animate);
        };
        
        animate();
    }
}

// Initialize desktop enhancements
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth > 768) {
        window.desktopEnhancements = new DesktopEnhancements();
    }
});

