class GameState {
    constructor() {
        this.currentScore = 0;
        this.highScore = this.loadHighScore();
        this.obstacleHits = new Map(); // Stores hits for each obstacle
        this.bullets = 100; // Initial bullet count
        this.maxBullets = 100; // Maximum bullets capacity
    }

    // Load high score from localStorage
    loadHighScore() {
        const saved = localStorage.getItem('highScore');
        return saved ? parseInt(saved) : 0;
    }

    // Save high score to localStorage
    saveHighScore() {
        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
            localStorage.setItem('highScore', this.highScore.toString());
        }
    }

    // Track hits on obstacles
    recordHit(obstacleId) {
        const hits = this.obstacleHits.get(obstacleId) || 0;
        this.obstacleHits.set(obstacleId, hits + 1);
        return hits + 1;
    }

    // Reset current game state
    resetGame() {
        this.saveHighScore();
        this.currentScore = 0;
        this.obstacleHits.clear();
        this.bullets = 20; // Reset bullets on game reset
    }

    // Get hits for an obstacle
    getObstacleHits(obstacleId) {
        return this.obstacleHits.get(obstacleId) || 0;
    }

    // Add new methods for bullet management
    addBullets(amount) {
        this.bullets = Math.min(this.bullets + amount, this.maxBullets);
    }

    useBullet() {
        if (this.bullets > 0) {
            this.bullets--;
            return true;
        }
        return false;
    }
}

// Export a single instance to be used across the game
const gameState = new GameState(); 