class Game {
    constructor(canvas, ctx, gameState, shipImage) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.gameState = gameState;
        this.shipImage = shipImage;
        
        // Game entities
        this.ship = new Ship(50, 150, shipImage, canvas);
        this.obstacles = [];
        this.bullets = [];
        
        // Game state
        this.frameCount = 0;
        this.gameActive = false; // Don't start active - wait for start button
        this.animationId = null;
        
        // Delta time tracking for consistent speed across different frame rates
        this.lastFrameTime = performance.now();
        this.targetFPS = 60;
        this.deltaMultiplier = 1;
        
        // Renderer
        this.renderer = new Renderer(canvas, ctx);
        
        // Setup
        this.setupControls();
        this.setupAutoShooting();
    }

    setupControls() {
        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            if (!this.gameActive) return;
            
            if (e.code === 'ArrowUp') {
                this.ship.applyLift();
            } else if (e.code === 'ArrowDown') {
                this.ship.applyDownForce();
            }
        });

        // Touch controls
        document.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.gameActive) {
                this.ship.applyLift();
            }
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });

        document.addEventListener('touchend', (e) => {
            e.preventDefault();
        }, { passive: false });
    }

    setupAutoShooting() {
        setInterval(() => {
            if (this.gameActive && this.gameState.useBullet()) {
                this.bullets.push(new Bullet(this.ship));
                this.updateScoreDisplay();
            }
        }, 100);
    }

    start() {
        this.gameActive = true; // Activate the game
        this.lastFrameTime = performance.now(); // Reset frame time to avoid large delta on first frame
        this.updateScoreDisplay();
        this.animate();
    }

    reset() {
        // Save high score before reset
        this.gameState.resetGame();
        
        // Reset game entities
        this.ship.reset();
        this.obstacles = [];
        this.bullets = [];
        this.frameCount = 0;
        this.gameActive = true;
        this.lastFrameTime = performance.now(); // Reset frame time to avoid large delta on first frame
        
        // Reset renderer
        this.renderer.resetStars();
        
        // Update score display
        this.updateScoreDisplay();
        
        // Hide game over screen
        document.getElementById('game-over').style.display = 'none';
        
        // Restart animation
        this.animate();
    }

    animate() {
        if (!this.gameActive) {
            return;
        }

        // Calculate delta time for consistent speed across different frame rates
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;
        
        // Calculate delta multiplier (1.0 = 60 FPS, higher/lower adjusts accordingly)
        this.deltaMultiplier = deltaTime / (1000 / this.targetFPS);

        // Clear and draw background
        this.renderer.clear();
        this.renderer.drawStars();
        this.ctx.shadowBlur = 0;
        
        // Update and draw ship
        this.ship.draw(this.ctx);
        this.ship.update(this.deltaMultiplier);

        // Check if ship is out of bounds
        if (this.ship.isOutOfBounds()) {
            this.gameOver();
            return;
        }

        // Spawn new obstacles
        if (this.frameCount % 100 === 0) {
            this.obstacles.push(new Obstacle(this.canvas, this.gameState, this.frameCount));
        }

        // Update and check obstacles
        if (!this.updateObstacles(this.deltaMultiplier)) {
            return; // Game over
        }

        // Update and check bullets
        this.updateBullets(this.deltaMultiplier);

        this.frameCount++;
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    updateObstacles(deltaMultiplier) {
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            
            obstacle.draw(this.ctx);
            obstacle.update(this.frameCount, deltaMultiplier);

            // Check collision with ship
            if (obstacle.checkCollision(this.ship)) {
                this.gameOver();
                return false;
            }

            // Check collision with enemy bullets
            if (obstacle.checkEnemyBulletCollision(this.ship)) {
                this.gameOver();
                return false;
            }

            // Check if ship passed the obstacle
            if (obstacle.x + obstacle.width < this.ship.x && !obstacle.passed) {
                obstacle.passed = true;
                const hits = this.gameState.getObstacleHits(obstacle.id);
                if (hits > 0) {
                    this.gameState.addBullets(hits * 4);
                } else {
                    this.gameState.addBullets(20);
                }
                this.updateScoreDisplay();
            }

            // Remove obstacles that are off screen or fully destroyed
            if (obstacle.isOffScreen() || obstacle.isFullyDestroyed()) {
                this.obstacles.splice(i, 1);
            }
        }
        return true;
    }

    updateBullets(deltaMultiplier) {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            bullet.draw(this.ctx);
            bullet.update(deltaMultiplier);
            
            // Check collision with obstacles
            let bulletHit = false;
            for (let j = this.obstacles.length - 1; j >= 0; j--) {
                const obstacle = this.obstacles[j];
                
                if (obstacle.checkBulletCollision(bullet)) {
                    const hits = this.gameState.recordHit(obstacle.id);
                    this.bullets.splice(i, 1);
                    bulletHit = true;
                    
                    if (hits >= 5) {
                        obstacle.startDestruction();
                        this.gameState.currentScore++;
                        this.updateScoreDisplay();
                    }
                    break;
                }
            }
            
            // Remove bullets that are off screen
            if (!bulletHit && bullet.isOffScreen(this.canvas)) {
                this.bullets.splice(i, 1);
            }
        }
    }

    updateScoreDisplay() {
        document.getElementById('current-score').textContent = this.gameState.currentScore;
        document.getElementById('high-score').textContent = this.gameState.highScore;
        document.getElementById('bullet-count').textContent = this.gameState.bullets;
    }

    gameOver() {
        this.gameActive = false;
        
        // Save high score
        this.gameState.saveHighScore();
        
        // Show game over screen
        const gameOverScreen = document.getElementById('game-over');
        document.getElementById('final-score').textContent = this.gameState.currentScore;
        document.getElementById('end-high-score').textContent = this.gameState.highScore;
        gameOverScreen.style.display = 'block';
        
        // Start countdown
        this.startCountdown();
    }

    startCountdown() {
        let countdown = 5;
        const countdownElement = document.getElementById('countdown-timer');
        countdownElement.textContent = countdown;

        const countdownInterval = setInterval(() => {
            countdown--;
            countdownElement.textContent = countdown;

            if (countdown <= 0) {
                clearInterval(countdownInterval);
                window.location.reload();
            }
        }, 1000);
    }
}
