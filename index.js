// Select all important DOM elements for game logic and UI updates
const cells = document.querySelectorAll('.cell');
const currentPlayerDisplay = document.getElementById('current-player');
const gameResultDisplay = document.getElementById('game-result');
const restartButton = document.getElementById('restart-button');
const modeButton = document.getElementById('mode-button');
const gameBoard = document.querySelector('.game-board');
const scoreX = document.getElementById('score-x');
const scoreO = document.getElementById('score-o');
const scoreDraw = document.getElementById('score-draw');
const symbolModal = document.getElementById('symbol-modal');
const symbolChoices = document.querySelectorAll('.symbol-choice');

// Game state variables
let currentPlayer = 'X'; // Tracks whose turn it is
let playerSymbol = 'X';  // Human player's symbol
let aiSymbol = 'O';      // AI's symbol
let board = ['', '', '', '', '', '', '', '', '']; // Board state
let isGameActive = true; // Is the game ongoing?
let winLineEl = null;    // Reference to the win line element
let isSinglePlayer = false; // Single or two player mode
let scores = { X: 0, O: 0, D: 0 }; // Scoreboard

// All possible win conditions (by cell index)
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
];

// Coordinates for drawing the win line (startX, startY, endX, endY in grid units)
const winLineCoords = [
    [0,0,2,0], [0,1,2,1], [0,2,2,2], // rows
    [0,0,0,2], [1,0,1,2], [2,0,2,2], // columns
    [0,0,2,2], [2,0,0,2],            // diagonals
];

// --- Symbol selection modal logic ---
function showSymbolModal() {
    symbolModal.classList.add('show'); // Show modal
}
function hideSymbolModal() {
    symbolModal.classList.remove('show'); // Hide modal
}
// When a symbol is chosen, set player/AI symbols and start game
symbolChoices.forEach(btn => {
    btn.onclick = () => {
        playerSymbol = btn.dataset.symbol; // Get symbol from data-symbol attribute
        aiSymbol = playerSymbol === 'X' ? 'O' : 'X'; // AI gets the other symbol
        currentPlayer = playerSymbol; // Start with the chosen symbol
        restartGame(); // Reset board and state
        hideSymbolModal(); // Hide modal
    };
});

// --- Game logic ---

// Handle a cell click (player move)
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = Array.from(cells).indexOf(clickedCell);

    // Ignore if cell is filled or game is over
    if (board[clickedCellIndex] !== '' || !isGameActive) return;

    makeMove(clickedCellIndex, currentPlayer); // Place symbol

    // If single player and it's now AI's turn, let AI play
    if (isSinglePlayer && isGameActive && currentPlayer === aiSymbol) {
        setTimeout(aiMove, 400); // Delay for realism
    }
}

// Place a symbol on the board and update UI
function makeMove(index, symbol) {
    board[index] = symbol; // Update board state
    const cell = cells[index];
    cell.textContent = symbol; // Show symbol
    cell.classList.add(symbol.toLowerCase()); // Add class for styling
    cell.style.pointerEvents = 'none'; // Prevent further clicks
    checkResult(); // Check for win/draw
}

// Check if the game is won, drawn, or should continue
function checkResult() {
    let roundWon = false;
    let winIndex = -1;

    // Check all win conditions
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            winIndex = i;
            break;
        }
    }

    if (roundWon) {
        isGameActive = false;
        gameResultDisplay.textContent = `🎉 Player ${currentPlayer} wins!`;
        drawWinLine(winIndex); // Draw animated win line
        scores[currentPlayer]++; // Update score
        updateScores();
        return;
    }

    // If board is full and no winner, it's a draw
    if (!board.includes('')) {
        gameResultDisplay.textContent = "It's a draw!";
        scores.D++;
        updateScores();
        return;
    }

    // Switch turns
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    currentPlayerDisplay.textContent = `Current Player: ${currentPlayer}`;
}

// Reset the board and state for a new game
function restartGame() {
    isGameActive = true;
    currentPlayer = playerSymbol; // Always start with the chosen symbol
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayerDisplay.textContent = `Current Player: ${currentPlayer}`;
    gameResultDisplay.textContent = '';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
        cell.style.pointerEvents = 'auto';
    });
    if (winLineEl) {
        winLineEl.remove();
        winLineEl = null;
    }
    // If single player and AI goes first, let AI play
    if (isSinglePlayer && currentPlayer === aiSymbol) {
        setTimeout(aiMove, 400);
    }
}

// Update the scoreboard UI
function updateScores() {
    scoreX.textContent = `X: ${scores.X}`;
    scoreO.textContent = `O: ${scores.O}`;
    scoreDraw.textContent = `Draws: ${scores.D}`;
}

// --- Win line animation ---
// Draws an animated line over the winning cells
function drawWinLine(winIndex) {
    if (winLineEl) winLineEl.remove(); // Remove previous line if any
    const [x1, y1, x2, y2] = winLineCoords[winIndex];
    const cellSize = 80; // Must match .cell width/height
    const offset = cellSize / 2;
    const startX = x1 * cellSize + offset;
    const startY = y1 * cellSize + offset;
    const endX = x2 * cellSize + offset;
    const endY = y2 * cellSize + offset;
    const extra = 40; // Try 40px extra (20px before start, 20px after end)
    const length = Math.sqrt((endX - startX)**2 + (endY - startY)**2) + extra;

    const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

    // Shift the start point back by extra/2 along the line direction
    const shiftX = Math.cos(Math.atan2(endY - startY, endX - startX)) * (extra / 2);
    const shiftY = Math.sin(Math.atan2(endY - startY, endX - startX)) * (extra / 2);

    winLineEl = document.createElement('div');
    winLineEl.className = 'win-line';
    winLineEl.style.width = `0px`; // Start at 0 for animation
    winLineEl.style.left = `${startX - shiftX}px`;
    winLineEl.style.top = `${startY - shiftY}px`;
    winLineEl.style.transform = `rotate(${angle}deg)`;
    winLineEl.style.transformOrigin = '0 50%';

    gameBoard.appendChild(winLineEl);

    setTimeout(() => {
        winLineEl.style.width = `${length}px`; // Animate to full length
    }, 50);
}

// --- AI logic (minimax for unbeatable AI) ---
// AI chooses the best move using minimax algorithm
function aiMove() {
    if (!isGameActive) return; // Don't move if game is over
    let bestScore = -Infinity; // Start with lowest possible score
    let move; // To store the best move index
    for (let i = 0; i < 9; i++) { // Loop through all cells
        if (board[i] === '') { // If cell is empty
            board[i] = aiSymbol; // Try AI's symbol here
            let score = minimax(board, 0, false); // Evaluate this move using minimax
            board[i] = ''; // Undo move
            if (score > bestScore) { // If this move is better than previous best
                bestScore = score; // Update best score
                move = i; // Update best move
            }
        }
    }
    makeMove(move, aiSymbol); // Make the best move found
}

// Minimax algorithm: recursively evaluates all possible moves
function minimax(newBoard, depth, isMaximizing) {
    let winner = getWinner(newBoard); // Check if game is over
    if (winner !== null) { // If game ended
        if (winner === aiSymbol) return 10 - depth; // AI win: prefer faster wins
        else if (winner === playerSymbol) return depth - 10; // Player win: prefer slower losses
        else return 0; // Draw
    }

    if (isMaximizing) { // AI's turn (maximize score)
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (newBoard[i] === '') {
                newBoard[i] = aiSymbol; // Try AI's move
                let score = minimax(newBoard, depth + 1, false); // Recurse for player
                newBoard[i] = ''; // Undo move
                bestScore = Math.max(score, bestScore); // Keep the best score
            }
        }
        return bestScore;
    } else { // Player's turn (minimize score)
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (newBoard[i] === '') {
                newBoard[i] = playerSymbol; // Try player's move
                let score = minimax(newBoard, depth + 1, true); // Recurse for AI
                newBoard[i] = ''; // Undo move
                bestScore = Math.min(score, bestScore); // Keep the lowest score
            }
        }
        return bestScore;
    }
}

// Checks if there's a winner or draw on the board
function getWinner(bd) {
    for (const [a, b, c] of winningConditions) { // Check all win conditions
        if (bd[a] && bd[a] === bd[b] && bd[a] === bd[c]) return bd[a]; // Return winner symbol
    }
    if (!bd.includes('')) return 'D'; // If board is full and no winner, it's a draw
    return null; // Game ongoing
}

// --- Mode switching ---
// Toggle between single-player and two-player modes
modeButton.onclick = () => {
    isSinglePlayer = !isSinglePlayer; // Switch mode
    modeButton.textContent = isSinglePlayer ? "Switch to 2-Player" : "Switch to AI"; // Update button text
    showSymbolModal(); // Ask for symbol again
};

// Add event listeners for cell clicks and buttons
cells.forEach(cell => cell.addEventListener('click', handleCellClick)); // Cell click
restartButton.addEventListener('click', restartGame); // Restart button

// --- Init ---
// Show symbol selection modal and update scores on page load
showSymbolModal();
updateScores();