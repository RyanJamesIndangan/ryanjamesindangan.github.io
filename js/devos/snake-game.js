// ===========================
// Snake Game - Enhanced Version
// ===========================

let snakeGame = {
    canvas: null,
    ctx: null,
    gridSize: 20,
    tileCount: 20,
    snake: [{ x: 10, y: 10 }],
    dx: 0,
    dy: 0,
    food: { x: 15, y: 15 },
    specialFood: null,
    specialFoodTimer: 0,
    score: 0,
    highScore: 0,
    gameRunning: false,
    gameLoop: null,
    nextDirection: { x: 0, y: 0 },
    speed: 120,
    baseSpeed: 120,
    powerUp: null,
    powerUpTimer: 0,
    gamePaused: false,
    lastUpdateTime: 0,
    animationFrame: null
};

function initializeSnakeGame() {
    const canvas = document.getElementById('snakeCanvas');
    if (!canvas) return;
    
    snakeGame.canvas = canvas;
    snakeGame.ctx = canvas.getContext('2d');
    
    // Set canvas size based on container
    const container = canvas.parentElement;
    const maxSize = Math.min(container.offsetWidth - 40, container.offsetHeight - 40, 600);
    const size = Math.floor(maxSize / snakeGame.gridSize) * snakeGame.gridSize;
    canvas.width = size;
    canvas.height = size;
    snakeGame.tileCount = size / snakeGame.gridSize;
    
    // Load high score
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
        snakeGame.highScore = parseInt(savedHighScore);
        const highScoreEl = document.getElementById('snakeHighScore');
        if (highScoreEl) highScoreEl.textContent = snakeGame.highScore;
    }
    
    // Event listeners
    const startBtn = document.getElementById('snakeStartBtn');
    const restartBtn = document.getElementById('snakeRestartBtn');
    const pauseBtn = document.getElementById('snakePauseBtn');
    
    if (startBtn) {
        startBtn.addEventListener('click', startGame);
    }
    
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            document.getElementById('snakeGameOver').style.display = 'none';
            startGame();
        });
    }
    
    if (pauseBtn) {
        pauseBtn.addEventListener('click', togglePause);
    }
    
    // Keyboard controls
    document.addEventListener('keydown', handleSnakeKeyPress);
    
    // Draw initial state
    drawGame();
}

function handleSnakeKeyPress(e) {
    if (!snakeGame.gameRunning) return;
    
    // Pause with Space
    if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault();
        togglePause();
        return;
    }
    
    // Prevent default for arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }
    
    // Set next direction (prevents 180-degree turns)
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        if (snakeGame.dy !== 1) snakeGame.nextDirection = { x: 0, y: -1 };
    } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        if (snakeGame.dy !== -1) snakeGame.nextDirection = { x: 0, y: 1 };
    } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        if (snakeGame.dx !== 1) snakeGame.nextDirection = { x: -1, y: 0 };
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        if (snakeGame.dx !== -1) snakeGame.nextDirection = { x: 1, y: 0 };
    }
}

function togglePause() {
    if (!snakeGame.gameRunning) return;
    
    snakeGame.gamePaused = !snakeGame.gamePaused;
    const pauseBtn = document.getElementById('snakePauseBtn');
    if (pauseBtn) {
        pauseBtn.textContent = snakeGame.gamePaused ? 'Resume' : 'Pause';
        pauseBtn.style.display = 'inline-block';
    }
}

function startGame() {
    // Reset game state
    snakeGame.snake = [{ x: 10, y: 10 }];
    snakeGame.dx = 1;
    snakeGame.dy = 0;
    snakeGame.nextDirection = { x: 1, y: 0 };
    snakeGame.score = 0;
    snakeGame.speed = snakeGame.baseSpeed;
    snakeGame.specialFood = null;
    snakeGame.specialFoodTimer = 0;
    snakeGame.powerUp = null;
    snakeGame.powerUpTimer = 0;
    snakeGame.gameRunning = true;
    snakeGame.gamePaused = false;
    snakeGame.lastUpdateTime = performance.now();
    
    // Update UI
    const startBtn = document.getElementById('snakeStartBtn');
    const scoreEl = document.getElementById('snakeScore');
    const pauseBtn = document.getElementById('snakePauseBtn');
    if (startBtn) startBtn.textContent = 'Playing...';
    if (scoreEl) scoreEl.textContent = '0';
    if (pauseBtn) {
        pauseBtn.textContent = 'Pause';
        pauseBtn.style.display = 'inline-block';
    }
    
    // Generate food
    generateFood();
    
    // Start game loop using requestAnimationFrame for smooth animation
    if (snakeGame.gameLoop) clearInterval(snakeGame.gameLoop);
    if (snakeGame.animationFrame) cancelAnimationFrame(snakeGame.animationFrame);
    gameLoop();
}

function gameLoop() {
    if (!snakeGame.gameRunning) return;
    
    const currentTime = performance.now();
    const deltaTime = currentTime - snakeGame.lastUpdateTime;
    
    if (deltaTime >= snakeGame.speed) {
        if (!snakeGame.gamePaused) {
            gameUpdate();
        }
        snakeGame.lastUpdateTime = currentTime;
    }
    
    // Always draw (for smooth animations even when paused)
    drawGame();
    
    // Update special food timer
    if (snakeGame.specialFoodTimer > 0) {
        snakeGame.specialFoodTimer--;
        if (snakeGame.specialFoodTimer === 0) {
            snakeGame.specialFood = null;
        }
    }
    
    // Update power-up timer
    if (snakeGame.powerUpTimer > 0) {
        snakeGame.powerUpTimer--;
        if (snakeGame.powerUpTimer === 0) {
            snakeGame.powerUp = null;
            snakeGame.speed = snakeGame.baseSpeed;
        }
    }
    
    snakeGame.animationFrame = requestAnimationFrame(gameLoop);
}

function gameUpdate() {
    if (!snakeGame.gameRunning || snakeGame.gamePaused) return;
    
    // Update direction
    snakeGame.dx = snakeGame.nextDirection.x;
    snakeGame.dy = snakeGame.nextDirection.y;
    
    // Move snake
    const head = {
        x: snakeGame.snake[0].x + snakeGame.dx,
        y: snakeGame.snake[0].y + snakeGame.dy
    };
    
    // Check wall collision
    if (head.x < 0 || head.x >= snakeGame.tileCount || 
        head.y < 0 || head.y >= snakeGame.tileCount) {
        gameOver();
        return;
    }
    
    // Check self collision
    for (let segment of snakeGame.snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }
    
    snakeGame.snake.unshift(head);
    
    // Check food collision
    if (head.x === snakeGame.food.x && head.y === snakeGame.food.y) {
        snakeGame.score += 10;
        generateFood();
        updateScore();
        
        // Increase speed slightly every 5 foods
        if (snakeGame.score % 50 === 0 && snakeGame.speed > 60) {
            snakeGame.speed = Math.max(60, snakeGame.speed - 5);
        }
    } else {
        snakeGame.snake.pop();
    }
    
    // Check special food collision
    if (snakeGame.specialFood && 
        head.x === snakeGame.specialFood.x && head.y === snakeGame.specialFood.y) {
        snakeGame.score += 50;
        snakeGame.specialFood = null;
        snakeGame.specialFoodTimer = 0;
        updateScore();
        
        // Random power-up
        if (Math.random() < 0.5) {
            activatePowerUp();
        }
    }
}

function generateFood() {
    do {
        snakeGame.food = {
            x: Math.floor(Math.random() * snakeGame.tileCount),
            y: Math.floor(Math.random() * snakeGame.tileCount)
        };
    } while (
        snakeGame.snake.some(segment => 
            segment.x === snakeGame.food.x && segment.y === snakeGame.food.y
        )
    );
    
    // Chance to spawn special food
    if (Math.random() < 0.15 && !snakeGame.specialFood) {
        do {
            snakeGame.specialFood = {
                x: Math.floor(Math.random() * snakeGame.tileCount),
                y: Math.floor(Math.random() * snakeGame.tileCount)
            };
        } while (
            (snakeGame.specialFood.x === snakeGame.food.x && 
             snakeGame.specialFood.y === snakeGame.food.y) ||
            snakeGame.snake.some(segment => 
                segment.x === snakeGame.specialFood.x && 
                segment.y === snakeGame.specialFood.y
            )
        );
        snakeGame.specialFoodTimer = 300; // 5 seconds at 60fps
    }
}

function activatePowerUp() {
    const powerUps = ['speed', 'slow', 'shield'];
    snakeGame.powerUp = powerUps[Math.floor(Math.random() * powerUps.length)];
    snakeGame.powerUpTimer = 600; // 10 seconds
    
    if (snakeGame.powerUp === 'speed') {
        snakeGame.speed = Math.max(40, snakeGame.speed - 30);
    } else if (snakeGame.powerUp === 'slow') {
        snakeGame.speed = snakeGame.baseSpeed + 40;
    }
    // Shield power-up is visual only (no collision for 3 hits)
}

function drawGame() {
    if (!snakeGame.ctx || !snakeGame.canvas) return;
    
    // Clear canvas with gradient background
    const bgGradient = snakeGame.ctx.createLinearGradient(
        0, 0, snakeGame.canvas.width, snakeGame.canvas.height
    );
    bgGradient.addColorStop(0, '#0a0a0a');
    bgGradient.addColorStop(1, '#1a1a1a');
    snakeGame.ctx.fillStyle = bgGradient;
    snakeGame.ctx.fillRect(0, 0, snakeGame.canvas.width, snakeGame.canvas.height);
    
    // Draw subtle grid
    snakeGame.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    snakeGame.ctx.lineWidth = 1;
    for (let i = 0; i <= snakeGame.tileCount; i++) {
        snakeGame.ctx.beginPath();
        snakeGame.ctx.moveTo(i * snakeGame.gridSize, 0);
        snakeGame.ctx.lineTo(i * snakeGame.gridSize, snakeGame.canvas.height);
        snakeGame.ctx.stroke();
        
        snakeGame.ctx.beginPath();
        snakeGame.ctx.moveTo(0, i * snakeGame.gridSize);
        snakeGame.ctx.lineTo(snakeGame.canvas.width, i * snakeGame.gridSize);
        snakeGame.ctx.stroke();
    }
    
    // Draw food with glow effect
    const foodX = snakeGame.food.x * snakeGame.gridSize + snakeGame.gridSize / 2;
    const foodY = snakeGame.food.y * snakeGame.gridSize + snakeGame.gridSize / 2;
    const foodRadius = snakeGame.gridSize / 2 - 2;
    
    // Glow
    snakeGame.ctx.shadowBlur = 15;
    snakeGame.ctx.shadowColor = '#64ffda';
    snakeGame.ctx.fillStyle = '#64ffda';
    snakeGame.ctx.beginPath();
    snakeGame.ctx.arc(foodX, foodY, foodRadius, 0, 2 * Math.PI);
    snakeGame.ctx.fill();
    snakeGame.ctx.shadowBlur = 0;
    
    // Draw special food with pulsing animation
    if (snakeGame.specialFood) {
        const specialX = snakeGame.specialFood.x * snakeGame.gridSize + snakeGame.gridSize / 2;
        const specialY = snakeGame.specialFood.y * snakeGame.gridSize + snakeGame.gridSize / 2;
        const pulse = Math.sin(Date.now() / 200) * 2;
        const specialRadius = snakeGame.gridSize / 2 - 2 + pulse;
        
        // Glow
        snakeGame.ctx.shadowBlur = 20;
        snakeGame.ctx.shadowColor = '#f59e0b';
        const specialGradient = snakeGame.ctx.createRadialGradient(
            specialX, specialY, 0,
            specialX, specialY, specialRadius
        );
        specialGradient.addColorStop(0, '#fbbf24');
        specialGradient.addColorStop(1, '#f59e0b');
        snakeGame.ctx.fillStyle = specialGradient;
        snakeGame.ctx.beginPath();
        snakeGame.ctx.arc(specialX, specialY, specialRadius, 0, 2 * Math.PI);
        snakeGame.ctx.fill();
        snakeGame.ctx.shadowBlur = 0;
    }
    
    // Draw snake with smooth gradients
    snakeGame.snake.forEach((segment, index) => {
        const x = segment.x * snakeGame.gridSize + snakeGame.gridSize / 2;
        const y = segment.y * snakeGame.gridSize + snakeGame.gridSize / 2;
        const radius = snakeGame.gridSize / 2 - 1;
        
        if (index === 0) {
            // Head - rounded with eyes and glow
            const headGradient = snakeGame.ctx.createRadialGradient(
                x - 3, y - 3, 0,
                x, y, radius
            );
            headGradient.addColorStop(0, '#4ade80');
            headGradient.addColorStop(0.7, '#22c55e');
            headGradient.addColorStop(1, '#16a34a');
            
            snakeGame.ctx.shadowBlur = 8;
            snakeGame.ctx.shadowColor = '#22c55e';
            snakeGame.ctx.fillStyle = headGradient;
            snakeGame.ctx.beginPath();
            snakeGame.ctx.arc(x, y, radius, 0, 2 * Math.PI);
            snakeGame.ctx.fill();
            snakeGame.ctx.shadowBlur = 0;
            
            // Draw eyes based on direction
            snakeGame.ctx.fillStyle = '#ffffff';
            const eyeOffset = 4;
            if (snakeGame.dx === 1) { // Moving right
                snakeGame.ctx.beginPath();
                snakeGame.ctx.arc(x + eyeOffset, y - 2, 2.5, 0, 2 * Math.PI);
                snakeGame.ctx.fill();
                snakeGame.ctx.beginPath();
                snakeGame.ctx.arc(x + eyeOffset, y + 2, 2.5, 0, 2 * Math.PI);
                snakeGame.ctx.fill();
            } else if (snakeGame.dx === -1) { // Moving left
                snakeGame.ctx.beginPath();
                snakeGame.ctx.arc(x - eyeOffset, y - 2, 2.5, 0, 2 * Math.PI);
                snakeGame.ctx.fill();
                snakeGame.ctx.beginPath();
                snakeGame.ctx.arc(x - eyeOffset, y + 2, 2.5, 0, 2 * Math.PI);
                snakeGame.ctx.fill();
            } else if (snakeGame.dy === -1) { // Moving up
                snakeGame.ctx.beginPath();
                snakeGame.ctx.arc(x - 2, y - eyeOffset, 2.5, 0, 2 * Math.PI);
                snakeGame.ctx.fill();
                snakeGame.ctx.beginPath();
                snakeGame.ctx.arc(x + 2, y - eyeOffset, 2.5, 0, 2 * Math.PI);
                snakeGame.ctx.fill();
            } else if (snakeGame.dy === 1) { // Moving down
                snakeGame.ctx.beginPath();
                snakeGame.ctx.arc(x - 2, y + eyeOffset, 2.5, 0, 2 * Math.PI);
                snakeGame.ctx.fill();
                snakeGame.ctx.beginPath();
                snakeGame.ctx.arc(x + 2, y + eyeOffset, 2.5, 0, 2 * Math.PI);
                snakeGame.ctx.fill();
            }
        } else {
            // Body segments - smooth gradient
            const bodyGradient = snakeGame.ctx.createRadialGradient(
                x, y, 0,
                x, y, radius
            );
            const alpha = 1 - (index / snakeGame.snake.length) * 0.3;
            bodyGradient.addColorStop(0, `rgba(74, 222, 128, ${alpha})`);
            bodyGradient.addColorStop(0.7, `rgba(34, 197, 94, ${alpha})`);
            bodyGradient.addColorStop(1, `rgba(22, 163, 74, ${alpha})`);
            
            snakeGame.ctx.fillStyle = bodyGradient;
            snakeGame.ctx.beginPath();
            snakeGame.ctx.arc(x, y, radius - 1, 0, 2 * Math.PI);
            snakeGame.ctx.fill();
            
            // Add subtle highlight
            snakeGame.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.2})`;
            snakeGame.ctx.beginPath();
            snakeGame.ctx.arc(x - 2, y - 2, 1.5, 0, 2 * Math.PI);
            snakeGame.ctx.fill();
        }
    });
    
    // Draw power-up indicator
    if (snakeGame.powerUp) {
        const powerUpText = snakeGame.ctx;
        powerUpText.fillStyle = '#fbbf24';
        powerUpText.font = '12px Segoe UI';
        powerUpText.textAlign = 'center';
        powerUpText.fillText(
            `Power-Up: ${snakeGame.powerUp.toUpperCase()} (${Math.ceil(snakeGame.powerUpTimer / 60)}s)`,
            snakeGame.canvas.width / 2,
            20
        );
    }
    
    // Draw pause indicator
    if (snakeGame.gamePaused) {
        snakeGame.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        snakeGame.ctx.fillRect(0, 0, snakeGame.canvas.width, snakeGame.canvas.height);
        snakeGame.ctx.fillStyle = '#ffffff';
        snakeGame.ctx.font = 'bold 24px Segoe UI';
        snakeGame.ctx.textAlign = 'center';
        snakeGame.ctx.fillText('PAUSED', snakeGame.canvas.width / 2, snakeGame.canvas.height / 2);
    }
}

function updateScore() {
    const scoreEl = document.getElementById('snakeScore');
    if (scoreEl) scoreEl.textContent = snakeGame.score;
    
    // Update high score
    if (snakeGame.score > snakeGame.highScore) {
        snakeGame.highScore = snakeGame.score;
        const highScoreEl = document.getElementById('snakeHighScore');
        if (highScoreEl) highScoreEl.textContent = snakeGame.highScore;
        localStorage.setItem('snakeHighScore', snakeGame.highScore.toString());
    }
}

function gameOver() {
    snakeGame.gameRunning = false;
    snakeGame.gamePaused = false;
    
    if (snakeGame.gameLoop) {
        clearInterval(snakeGame.gameLoop);
        snakeGame.gameLoop = null;
    }
    if (snakeGame.animationFrame) {
        cancelAnimationFrame(snakeGame.animationFrame);
        snakeGame.animationFrame = null;
    }
    
    // Update UI
    const startBtn = document.getElementById('snakeStartBtn');
    const pauseBtn = document.getElementById('snakePauseBtn');
    if (startBtn) startBtn.textContent = 'Start';
    if (pauseBtn) pauseBtn.style.display = 'none';
    
    const gameOverEl = document.getElementById('snakeGameOver');
    const finalScoreEl = document.getElementById('finalScore');
    
    if (gameOverEl) gameOverEl.style.display = 'block';
    if (finalScoreEl) finalScoreEl.textContent = snakeGame.score;
}
