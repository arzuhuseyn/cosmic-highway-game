# Cosmic Highway Game

A space-themed arcade game built with HTML5 Canvas and JavaScript. Navigate your spaceship through dangerous cosmic barriers, dodge enemy fire, and shoot your way to victory!

## 🎮 Game Features

- **Dynamic Gameplay**: Navigate through procedurally generated obstacles
- **Combat System**: Shoot barriers to destroy them (requires 5 hits per obstacle)
- **Enemy Attacks**: Some barriers have guns that fire at your ship
- **Bullet Management**: Limited ammunition that regenerates as you pass obstacles
- **Score Tracking**: High score persistence using localStorage
- **Responsive Design**: Works on desktop and mobile devices
- **Touch Controls**: Full mobile support with touch controls

## 🚀 How to Play

### Controls

**Desktop:**
- `↑ Arrow Up`: Move ship upward
- `↓ Arrow Down`: Move ship downward
- Shooting is automatic

**Mobile:**
- Tap the screen to move the ship upward
- Release to let gravity take over
- Shooting is automatic

### Objective

- Navigate through the gaps in the barriers
- Shoot barriers to destroy them (5 hits each)
- Avoid colliding with barriers or enemy bullets
- Collect bullets by passing or destroying obstacles
- Achieve the highest score possible!

## 📁 Project Structure

```
cosmic-highway-game/
├── entities/           # Game entity classes
│   ├── Ship.js        # Player spaceship
│   ├── Obstacle.js    # Barriers and enemies
│   └── Bullet.js      # Player projectiles
├── game.js            # Main game logic and loop
├── gameState.js       # State management
├── renderer.js        # Rendering utilities
├── main.js            # Initialization
├── styles.css         # All styles
├── index.html         # HTML structure
└── icon/
    └── ship2.svg      # Ship sprite asset
```

## 🛠️ Technical Details

### Built With

- **HTML5 Canvas**: For rendering
- **Vanilla JavaScript**: No frameworks or libraries
- **CSS3**: Responsive styling
- **LocalStorage API**: High score persistence

### Architecture

The game follows object-oriented principles with clear separation of concerns:

- **Entity System**: Separate classes for Ship, Obstacle, and Bullet
- **Game Loop**: Centralized animation and update logic
- **State Management**: Dedicated GameState class for score and bullet tracking
- **Renderer**: Isolated rendering logic for backgrounds and effects

See [REFACTORING.md](REFACTORING.md) for detailed architecture documentation.

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Optional: A local web server (for development)

### Installation & Running

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cosmic-highway-game.git
   cd cosmic-highway-game
   ```

2. Open the game:

   **Option 1 - Direct File Access:**
   ```bash
   # Simply open index.html in your browser
   # (works in most browsers)
   ```

   **Option 2 - Local Server (recommended):**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Then navigate to http://localhost:8000
   ```

   **Option 3 - Using VS Code:**
   ```bash
   # Install Live Server extension
   # Right-click index.html and select "Open with Live Server"
   ```

## 🎯 Scoring System

- **Destroying a Barrier**: +1 point
- **Bullets Earned**:
  - Pass undamaged barrier: +20 bullets
  - Pass damaged barrier: +4 bullets per hit landed
  - Destroy barrier: No additional bullets (already earned from hits)

## 📝 Development

### Code Style

- ES6+ JavaScript
- Class-based architecture
- Clear naming conventions
- Commented code for complex logic

### Future Enhancements

- Multiple ship types
- Power-ups system
- Different enemy types
- Level progression
- Sound effects and music
- Particle effects
- Leaderboards

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👤 Author

Your Name - [GitHub Profile](https://github.com/yourusername)

## 🙏 Acknowledgments

- Inspired by classic arcade games
- Built as a learning project for HTML5 game development
