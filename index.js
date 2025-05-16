// filepath: c:\Users\paulj\Desktop\Gomycode\tic-tac-toe tutorial\src\index.js

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

let currentPlayer = 'X';
let playerSymbol = 'X';
let aiSymbol = 'O';
let board = ['', '', '', '', '', '', '', '', ''];
let isGameActive = true;
let winLineEl = null;
let isSinglePlayer = false;
let scores = { X: 0, O: 0, D: 0 };

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const winLineCoords = [
    [0,0,2,0], [0,1,2,1], [0,2,2,2],
    [0,0,0,2], [1,0,1,2], [2,0,2,2],
    [0,0,2,2], [2,0,0,2],
];

// --- Symbol selection modal ---
function showSymbolModal() {
    symbolModal.classList.add('show');
}
function hideSymbolModal() {
    symbolModal.classList.remove('show');
}
symbolChoices.forEach(btn => {
    btn.onclick = () => {
        playerSymbol = btn.dataset.symbol;
        aiSymbol = playerSymbol === 'X' ? 'O' : 'X';
        currentPlayer = 'X';
        restartGame();
        hideSymbolModal();
    };
});

// --- Game logic ---
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = Array.from(cells).indexOf(clickedCell);

    if (board[clickedCellIndex] !== '' || !isGameActive) return;

    makeMove(clickedCellIndex, currentPlayer);

    if (isSinglePlayer && isGameActive && currentPlayer === aiSymbol) {
        setTimeout(aiMove, 400);
    }
}

function makeMove(index, symbol) {
    board[index] = symbol;
    const cell = cells[index];
    cell.textContent = symbol;
    cell.classList.add(symbol.toLowerCase());
    cell.style.pointerEvents = 'none';
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
        scores[currentPlayer]++;
        updateScores();
        return;
    }

    if (!board.includes('')) {
        gameResultDisplay.textContent = "It's a draw!";
        scores.D++;
        updateScores();
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    currentPlayerDisplay.textContent = `Current Player: ${currentPlayer}`;
}

function restartGame() {
    isGameActive = true;
    currentPlayer = 'X';
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
    if (isSinglePlayer && currentPlayer !== playerSymbol) {
        setTimeout(aiMove, 400);
    }
}

function updateScores() {
    scoreX.textContent = `X: ${scores.X}`;
    scoreO.textContent = `O: ${scores.O}`;
    scoreDraw.textContent = `Draws: ${scores.D}`;
}

// --- Win line animation ---
function drawWinLine(winIndex) {
    if (winLineEl) winLineEl.remove();
    const [x1, y1, x2, y2] = winLineCoords[winIndex];
    const cellSize = 80;
    const offset = cellSize / 2;
    const startX = x1 * cellSize + offset;
    const startY = y1 * cellSize + offset;
    const endX = x2 * cellSize + offset;
    const endY = y2 * cellSize + offset;
    const length = Math.sqrt((endX - startX)**2 + (endY - startY)**2);
    const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

    winLineEl = document.createElement('div');
    winLineEl.className = 'win-line';
    winLineEl.style.width = `0px`;
    winLineEl.style.left = `${startX}px`;
    winLineEl.style.top = `${startY}px`;
    winLineEl.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    winLineEl.style.background = '#222';
    gameBoard.appendChild(winLineEl);

    setTimeout(() => {
        winLineEl.style.width = `${length}px`;
    }, 50);
}

// --- AI logic (minimax for unbeatable AI) ---
function aiMove() {
    if (!isGameActive) return;
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = aiSymbol;
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    makeMove(move, aiSymbol);
}

function minimax(newBoard, depth, isMaximizing) {
    let winner = getWinner(newBoard);
    if (winner !== null) {
        if (winner === aiSymbol) return 10 - depth;
        else if (winner === playerSymbol) return depth - 10;
        else return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (newBoard[i] === '') {
                newBoard[i] = aiSymbol;
                let score = minimax(newBoard, depth + 1, false);
                newBoard[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (newBoard[i] === '') {
                newBoard[i] = playerSymbol;
                let score = minimax(newBoard, depth + 1, true);
                newBoard[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function getWinner(bd) {
    for (const [a, b, c] of winningConditions) {
        if (bd[a] && bd[a] === bd[b] && bd[a] === bd[c]) return bd[a];
    }
    if (!bd.includes('')) return 'D';
    return null;
}

// --- Mode switching ---
modeButton.onclick = () => {
    isSinglePlayer = !isSinglePlayer;
    modeButton.textContent = isSinglePlayer ? "Switch to 2-Player" : "Switch to AI";
    showSymbolModal();
};

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);

// --- Init ---
showSymbolModal();
updateScores();