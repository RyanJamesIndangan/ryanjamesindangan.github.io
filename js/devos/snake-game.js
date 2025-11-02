// ===========================
// Snake Game
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
    score: 0,
    highScore: 0,
    gameRunning: false,
    gameLoop: null,
    nextDirection: { x: 0, y: 0 }
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
    
    if (startBtn) {
        startBtn.addEventListener('click', startGame);
    }
    
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            document.getElementById('snakeGameOver').style.display = 'none';
            startGame();
        });
    }
    
    // Keyboard controls
    document.addEventListener('keydown', handleSnakeKeyPress);
    
    // Draw initial state
    drawGame();
}

function handleSnakeKeyPress(e) {
    if (!snakeGame.gameRunning) return;
    
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

function startGame() {
    // Reset game state
    snakeGame.snake = [{ x: 10, y: 10 }];
    snakeGame.dx = 1;
    snakeGame.dy = 0;
    snakeGame.nextDirection = { x: 1, y: 0 };
    snakeGame.score = 0;
    snakeGame.gameRunning = true;
    
    // Update UI
    const startBtn = document.getElementById('snakeStartBtn');
    const scoreEl = document.getElementById('snakeScore');
    if (startBtn) startBtn.textContent = 'Playing...';
    if (scoreEl) scoreEl.textContent = '0';
    
    // Generate food
    generateFood();
    
    // Start game loop
    if (snakeGame.gameLoop) clearInterval(snakeGame.gameLoop);
    snakeGame.gameLoop = setInterval(gameUpdate, 150);
}

function gameUpdate() {
    if (!snakeGame.gameRunning) return;
    
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
    } else {
        snakeGame.snake.pop();
    }
    
    drawGame();
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
}

function drawGame() {
    if (!snakeGame.ctx || !snakeGame.canvas) return;
    
    // Clear canvas
    snakeGame.ctx.fillStyle = '#0a0a0a';
    snakeGame.ctx.fillRect(0, 0, snakeGame.canvas.width, snakeGame.canvas.height);
    
    // Draw grid
    snakeGame.ctx.strokeStyle = '#1a1a1a';
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
    
    // Draw food
    snakeGame.ctx.fillStyle = '#64ffda';
    snakeGame.ctx.beginPath();
    snakeGame.ctx.arc(
        snakeGame.food.x * snakeGame.gridSize + snakeGame.gridSize / 2,
        snakeGame.food.y * snakeGame.gridSize + snakeGame.gridSize / 2,
        snakeGame.gridSize / 2 - 2,
        0,
        2 * Math.PI
    );
    snakeGame.ctx.fill();
    
    // Draw snake
    snakeGame.snake.forEach((segment, index) => {
        if (index === 0) {
            // Head
            snakeGame.ctx.fillStyle = '#64ffda';
        } else {
            // Body
            const gradient = snakeGame.ctx.createLinearGradient(
                segment.x * snakeGame.gridSize,
                segment.y * snakeGame.gridSize,
                (segment.x + 1) * snakeGame.gridSize,
                (segment.y + 1) * snakeGame.gridSize
            );
            gradient.addColorStop(0, '#64ffda');
            gradient.addColorStop(1, '#5eb3ff');
            snakeGame.ctx.fillStyle = gradient;
        }
        
        snakeGame.ctx.fillRect(
            segment.x * snakeGame.gridSize + 1,
            segment.y * snakeGame.gridSize + 1,
            snakeGame.gridSize - 2,
            snakeGame.gridSize - 2
        );
    });
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
    
    if (snakeGame.gameLoop) {
        clearInterval(snakeGame.gameLoop);
        snakeGame.gameLoop = null;
    }
    
    // Update UI
    const startBtn = document.getElementById('snakeStartBtn');
    if (startBtn) startBtn.textContent = 'Start';
    
    const gameOverEl = document.getElementById('snakeGameOver');
    const finalScoreEl = document.getElementById('finalScore');
    
    if (gameOverEl) gameOverEl.style.display = 'block';
    if (finalScoreEl) finalScoreEl.textContent = snakeGame.score;
}

