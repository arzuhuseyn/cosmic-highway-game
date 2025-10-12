// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas resizing function
function resizeCanvas() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Set canvas size while maintaining aspect ratio
    if (windowWidth / windowHeight > 2/3) {
        // Window is wider than game ratio
        canvas.style.height = '100vh';
        canvas.style.width = 'auto';
    } else {
        // Window is taller than game ratio
        canvas.style.width = '100vw';
        canvas.style.height = 'auto';
    }

    // Keep game resolution constant
    canvas.width = 400;
    canvas.height = 600;
}

// Setup resize listener
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Initialize renderer for start screen background
const startScreenRenderer = new Renderer(canvas, ctx);

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
let game;
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
        
        // Show score display
        document.getElementById('score-display').style.display = 'block';
        
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

