// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Declare game and renderer variables at the top
let game;
let startScreenRenderer;

// Canvas resizing function
function resizeCanvas() {
    // Get actual window dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Limit canvas width to maximum 800px
    const maxWidth = 800;
    const canvasWidth = Math.min(windowWidth, maxWidth);
    const canvasHeight = windowHeight;
    
    // Set canvas to calculated size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Set CSS to match (no scaling)
    canvas.style.width = canvasWidth + 'px';
    canvas.style.height = canvasHeight + 'px';
    
    // If game exists, update its entities and renderer
    if (game) {
        // Update ship dimensions
        if (game.ship) {
            game.ship.updateDimensions();
            // Recalculate physics based on new canvas size
            game.ship.lift = -canvas.height * 0.0067;
            game.ship.downForce = canvas.height * 0.0067;
            game.ship.velocityIncrement = canvas.height * 0.0002;
        }
        
        // Reset renderer stars
        if (game.renderer) {
            game.renderer.stars = game.renderer.createStars();
        }
    }
    
    // Update start screen renderer
    if (startScreenRenderer) {
        startScreenRenderer.stars = startScreenRenderer.createStars();
    }
}

// Setup resize listener
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Initialize renderer for start screen background
startScreenRenderer = new Renderer(canvas, ctx);

// Animate start screen background
function animateStartScreen() {
    startScreenRenderer.clear();
    startScreenRenderer.drawStars();
    requestAnimationFrame(animateStartScreen);
}
animateStartScreen();

// Load ship image from external SVG file
const shipImage = new Image();
shipImage.src = 'icon/rocket.svg';

// Initialize game when ship image loads (but don't start yet)
shipImage.onload = function() {
    game = new Game(canvas, ctx, gameState, shipImage);
    // Don't start the game yet - wait for start button
};

// Start button event listeners (both click and touch)
function startGame() {
    if (game) {
        // Hide start screen
        const startScreen = document.getElementById('start-screen');
        startScreen.classList.add('hidden');
        
        // Show score display and game controls
        document.getElementById('score-display').style.display = 'block';
        document.getElementById('game-controls').style.display = 'flex';
        
        // Start the game
        game.start();
    }
}

const startButton = document.getElementById('start-button');
startButton.addEventListener('click', startGame);
startButton.addEventListener('touchend', (e) => {
    e.preventDefault(); // Prevent double-firing with click event
    startGame();
});

// Restart button event listeners (both click and touch)
function restartGame() {
    if (game) {
        game.reset();
    }
}

const restartButton = document.getElementById('restart-button');
restartButton.addEventListener('click', restartGame);
restartButton.addEventListener('touchend', (e) => {
    e.preventDefault(); // Prevent double-firing with click event
    restartGame();
});

