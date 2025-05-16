// filepath: c:\Users\paulj\Desktop\Gomycode\tic-tac-toe tutorial\src\index.js

const cells = document.querySelectorAll('.cell');
const currentPlayerDisplay = document.getElementById('current-player');
const gameResultDisplay = document.getElementById('game-result');
const restartButton = document.getElementById('restart-button');
const gameBoard = document.querySelector('.game-board');
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let isGameActive = true;
let winLineEl = null;

const winningConditions = [
    [0, 1, 2], // row 1
    [3, 4, 5], // row 2
    [6, 7, 8], // row 3
    [0, 3, 6], // col 1
    [1, 4, 7], // col 2
    [2, 5, 8], // col 3
    [0, 4, 8], // diag \
    [2, 4, 6]  // diag /
];

// For drawing the win line
const winLineCoords = [
    // [x1, y1, x2, y2] in cell grid units
    [0,0,2,0], // row 1
    [0,1,2,1], // row 2
    [0,2,2,2], // row 3
    [0,0,0,2], // col 1
    [1,0,1,2], // col 2
    [2,0,2,2], // col 3
    [0,0,2,2], // diag \
    [2,0,0,2], // diag /
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = Array.from(cells).indexOf(clickedCell);

    if (board[clickedCellIndex] !== '' || !isGameActive) return;

    board[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());

    checkResult();
}

function checkResult() {
    let roundWon = false;
    let winIndex = -1;

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
        drawWinLine(winIndex);
        return;
    }

    if (!board.includes('')) {
        gameResultDisplay.textContent = "It's a draw!";
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    currentPlayerDisplay.textContent = `Current Player: ${currentPlayer}`;
}

function restartGame() {
    isGameActive = true;
    currentPlayer = 'X';
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayerDisplay.textContent = `Current Player: X`;
    gameResultDisplay.textContent = '';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    if (winLineEl) {
        winLineEl.remove();
        winLineEl = null;
    }
}

// Draws a line over the winning cells
function drawWinLine(winIndex) {
    if (winLineEl) winLineEl.remove();
    const [x1, y1, x2, y2] = winLineCoords[winIndex];
    const cellSize = 80; // px, must match .cell width/height
    const offset = cellSize / 2;
    const startX = x1 * cellSize + offset;
    const startY = y1 * cellSize + offset;
    const endX = x2 * cellSize + offset;
    const endY = y2 * cellSize + offset;
    const length = Math.sqrt((endX - startX)**2 + (endY - startY)**2);
    const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

    winLineEl = document.createElement('div');
    winLineEl.className = 'win-line';
    winLineEl.style.width = `${length}px`;
    winLineEl.style.left = `${startX}px`;
    winLineEl.style.top = `${startY}px`;
    winLineEl.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    winLineEl.style.background = '#222';

    gameBoard.appendChild(winLineEl);
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);