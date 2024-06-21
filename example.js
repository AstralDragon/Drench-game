const grid = document.getElementById("grid");
const movesCountElement = document.getElementById("moves-count");
const colorButtons = document.querySelectorAll(".color-button");
const statusElement = document.getElementById("status");
const messageElement = document.getElementById("message");
const clickSoundSrc = document.getElementById("click-sound").src;

const colors = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#F3FF33",
  "#FF33B5",
  "#33FFF5",
];
const gridSize = 14;
let gridData = [];
let movesCount = 0;
let moveLimit = 25;
let level = 1;
let gameOver = false; // Flag to track game state

// Initialize the game
function initGame() {
  gridData = [];
  for (let i = 0; i < gridSize; i++) {
    const row = [];
    for (let j = 0; j < gridSize; j++) {
      const colorIndex = Math.floor(Math.random() * colors.length);
      row.push(colorIndex);
    }
    gridData.push(row);
  }
  movesCount = 0;
  gameOver = false; // Reset game over flag
  updateMovesCount();
  renderGrid();
  setColorButtons();
  messageElement.innerHTML = "";
}

// Update the moves count display
function updateMovesCount() {
  movesCountElement.textContent = `Moves: ${movesCount}/${moveLimit}`;
}

// Render the grid
function renderGrid() {
  grid.innerHTML = "";
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.style.backgroundColor = colors[gridData[i][j]];
      grid.appendChild(cell);
    }
  }
}

// Set up color buttons
function setColorButtons() {
  colorButtons.forEach((button, index) => {
    button.style.backgroundColor = colors[index];
    button.onclick = () => {
      if (!gameOver) {
        const clickSound = new Audio(clickSoundSrc); // Clone the audio element
        clickSound.play();
        changeColor(index);
      }
    };
  });
}

// Change color
function changeColor(newColorIndex) {
  const oldColorIndex = gridData[0][0];
  movesCount++; // Increment move count on every click
  updateMovesCount();

  if (newColorIndex !== oldColorIndex) {
    floodFill(0, 0, oldColorIndex, newColorIndex);
    renderGrid();
  }
  checkWinOrLose(); // Check win or lose conditions
}

// Flood fill algorithm
function floodFill(x, y, oldColorIndex, newColorIndex) {
  if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return;
  if (gridData[x][y] !== oldColorIndex) return;

  gridData[x][y] = newColorIndex;

  floodFill(x + 1, y, oldColorIndex, newColorIndex);
  floodFill(x - 1, y, oldColorIndex, newColorIndex);
  floodFill(x, y + 1, oldColorIndex, newColorIndex);
  floodFill(x, y - 1, oldColorIndex, newColorIndex);
}

// Check win or lose
function checkWinOrLose() {
  const allSameColor = gridData.flat().every((cell) => cell === gridData[0][0]);

  if (allSameColor) {
    gameOver = true;
    messageElement.innerHTML = `
            <p>Well Done! You Won</p>
            <button onclick="nextLevel()">Next Level</button>
        `;
  } else if (movesCount >= moveLimit) {
    gameOver = true;
    messageElement.innerHTML = `
            <p>You Lost! Levels Cleared: ${level - 1}</p>
            <button onclick="restartGame()">Try Again</button>
        `;
  }
}

// Move to the next level
function nextLevel() {
  level++;
  moveLimit += 5; // Increase move limit for the next level
  initGame();
}

// Restart the game
function restartGame() {
  level = 1;
  moveLimit = 30;
  initGame();
}

// Reset the current level
function resetLevel() {
  initGame(); // Reinitialize the game without changing the level or move limit
}

// Start the game
initGame();
