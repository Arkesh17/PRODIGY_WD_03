
const floatingShapes = document.getElementById('floating-shapes');

function createShape() {
  const shape = document.createElement('div');
  shape.classList.add('shape');
  shape.style.left = `${Math.random() * 100}vw`;
  shape.style.top = `${Math.random() * 100}vh`;
  shape.style.animationDuration = `${Math.random() * 10 + 5}s`;
  floatingShapes.appendChild(shape);

  setTimeout(() => {
    shape.remove();
  }, 15000); 
}

setInterval(createShape, 1000); 


const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset-button');
const message = document.getElementById('message');
const confettiContainer = document.getElementById('confetti');
const victoryPopup = document.getElementById('victory-popup');
const victoryMessage = document.getElementById('victory-message');
const closePopupButton = document.getElementById('close-popup');

let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningConditions = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal
  [2, 4, 6]  // Diagonal
];

// Function to update the message display
function updateMessage(text) {
  message.textContent = text;
}

// Initial message
updateMessage(`Player ${currentPlayer}'s turn`);

function handleCellClick(event) {
  const clickedCell = event.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

  if (gameState[clickedCellIndex] !== '' || !gameActive) {
    return;
  }

  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;
  clickedCell.setAttribute('data-player', currentPlayer);

  checkForWinner();
}

function checkForWinner() {
  let roundWon = false;
  let winningCombo = [];

  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
      continue;
    }
    if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
      roundWon = true;
      winningCombo = winningConditions[i];
      break;
    }
  }

  if (roundWon) {
    highlightWinningCells(winningCombo);
    gameActive = false;
    updateMessage(`Player ${currentPlayer} wins!`);
    showVictoryPopup(`Player ${currentPlayer} wins!`);
    startConfetti();
    return;
  }

  if (!gameState.includes('')) {
    gameActive = false;
    updateMessage('It\'s a draw!');
    showVictoryPopup('It\'s a draw!');
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateMessage(`Player ${currentPlayer}'s turn`);
}

function highlightWinningCells(winningCombo) {
  winningCombo.forEach(index => {
    cells[index].classList.add('winning-cell');
  });
}

function showVictoryPopup(message) {
  victoryMessage.textContent = message;
  victoryPopup.style.display = 'block';
}

function startConfetti() {
  for (let i = 0; i < 100; i++) {
    const confettiPiece = document.createElement('div');
    confettiPiece.classList.add('confetti-piece');
    confettiPiece.style.left = `${Math.random() * 100}vw`;
    confettiPiece.style.animationDelay = `${Math.random() * 2}s`;
    confettiContainer.appendChild(confettiPiece);

    setTimeout(() => {
      confettiPiece.remove();
    }, 5000); // Remove confetti after 5 seconds
  }
}

function resetGame() {
  gameState = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = 'X';
  cells.forEach(cell => {
    cell.textContent = '';
    cell.removeAttribute('data-player');
    cell.classList.remove('winning-cell');
  });
  victoryPopup.style.display = 'none';
  confettiContainer.innerHTML = ''; // Clear confetti
  updateMessage(`Player ${currentPlayer}'s turn`);
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
closePopupButton.addEventListener('click', () => {
  victoryPopup.style.display = 'none';
});