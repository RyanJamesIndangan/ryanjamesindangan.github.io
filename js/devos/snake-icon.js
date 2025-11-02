// ===========================
// Dynamic Snake Icon
// ===========================

function createSnakeIcon() {
    const canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 48;
    canvas.style.width = '48px';
    canvas.style.height = '48px';
    canvas.style.imageRendering = 'pixelated';
    
    const ctx = canvas.getContext('2d');
    const gridSize = 8;
    const tileCount = 6;
    
    // Simple snake pattern: 3 segments moving right
    const snake = [
        { x: 1, y: 2 },
        { x: 2, y: 2 },
        { x: 3, y: 2 }
    ];
    const food = { x: 4, y: 4 };
    
    function draw() {
        // Clear canvas
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid background
        ctx.fillStyle = '#1e293b';
        for (let i = 0; i < tileCount; i++) {
            for (let j = 0; j < tileCount; j++) {
                if ((i + j) % 2 === 0) {
                    ctx.fillRect(i * gridSize, j * gridSize, gridSize, gridSize);
                }
            }
        }
        
        // Draw food
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
        ctx.fillStyle = '#fff';
        ctx.fillRect(food.x * gridSize + 2, food.y * gridSize + 2, 4, 4);
        
        // Draw snake
        snake.forEach((segment, index) => {
            if (index === 0) {
                // Head - darker green
                ctx.fillStyle = '#22c55e';
            } else {
                // Body - lighter green
                ctx.fillStyle = '#4ade80';
            }
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
            
            // Add highlight
            if (index === 0) {
                ctx.fillStyle = '#86efac';
                ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, 2, 2);
            }
        });
    }
    
    draw();
    
    // Animate snake moving
    let frame = 0;
    setInterval(() => {
        frame++;
        if (frame % 30 === 0) {
            // Move snake
            snake.shift();
            snake.push({ x: (snake[snake.length - 1].x + 1) % tileCount, y: snake[snake.length - 1].y });
            draw();
        }
    }, 50);
    
    return canvas;
}

// Replace snake icons with dynamic canvas
function initializeSnakeIcons() {
    // Replace desktop icon
    const desktopIcon = document.querySelector('.desktop-icon[data-app="snake"] .icon');
    if (desktopIcon) {
        const canvas = createSnakeIcon();
        desktopIcon.innerHTML = '';
        desktopIcon.appendChild(canvas);
    }
    
    // Replace start menu icon
    const startMenuIcon = document.querySelector('.app-tile[data-app="snake"] .app-icon');
    if (startMenuIcon) {
        const canvas = createSnakeIcon();
        startMenuIcon.innerHTML = '';
        startMenuIcon.appendChild(canvas);
    }
    
    // Replace taskbar icon when window is created
    document.addEventListener('snakeWindowCreated', () => {
        const taskbarIcon = document.querySelector('.taskbar-app[data-app="snake"] .app-icon');
        if (taskbarIcon) {
            const canvas = createSnakeIcon();
            taskbarIcon.innerHTML = '';
            taskbarIcon.appendChild(canvas);
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSnakeIcons);
} else {
    initializeSnakeIcons();
}

