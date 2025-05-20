# Tic-Tac-Toe Game

This is a feature-rich, fully responsive Tic-Tac-Toe game built using HTML, CSS, and JavaScript. The game supports both two-player and single-player (AI) modes, allows players to choose their symbol (X or O), and keeps track of scores for X, O, and draws. The design includes smooth animations, a modern interface with a gradient title, and a clear animated win line when a player wins. Scores are saved using your browser's localStorage.

## Features

- Play against another player or an unbeatable AI opponent (minimax algorithm).
- Choose your symbol (X or O) before starting.
- Animated, colorful, and responsive design that works on desktop, tablet, and mobile.
- Scoreboard tracks wins for X, O, and draws, and persists scores using localStorage.
- Clear animated win line highlights the winning combination.
- **Restart Game** button resets the board for a new round.
- **Switch to AI/2-Player** button toggles between single-player and two-player modes.
- **Reset Scores** button clears all scores (appears after a game ends).
- Modern UI with a gradient title and smooth button effects.

## Project Structure

```
tic-tac-toe
├── index.html      # Game structure and UI
├── index.css       # Game styles and animations
├── index.js        # Game logic, AI, and interactivity
└── README.md       # Project documentation
```

## How to Play

1. Open `index.html` in your web browser.
2. Choose your symbol (X or O) in the modal dialog.
3. Select single-player (AI) or two-player mode.
4. Take turns clicking on the grid to place your symbol.
5. The game will announce the winner or a draw, and update the scoreboard.
6. Click **Restart Game** to play again, or **Switch to AI/2-Player** to change modes.
7. After a game ends, you can click **Reset Scores** to clear all scores.

Enjoy playing Tic-Tac-Toe on any device!