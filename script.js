const grid = document.getElementById("grid");
const movesCountElement = document.getElementById("moves-count");
const colorButtons = document.querySelectorAll(".color-button");
const statusElement = document.getElementById("status");
const messageElement = document.getElementById("message");
const clickSoundSource = document.getElementById("click-sound").src;

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
let moveLimit = 30;
let level = 1;
let gameOver = false;

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
  gameOver = false;
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
        const clickSound = new Audio(clickSoundSource);
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
  checkWinOrLose(); // Still check win or lose
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
            <button onclick="nextLevel()" style="background-color: white;
    cursor: pointer;
    font-size: large;
    border: 1px solid black;
    padding: 10px 15px;
    border-radius: 0.5rem;">Next Level</button>
        `;
  } else if (movesCount >= moveLimit) {
    gameOver = true;
    messageElement.innerHTML = `
            <p>You Lost! Levels Cleared: ${level - 1}</p>
            <button onclick="restartGame()" style="background-color: white;
    cursor: pointer;
    font-size: large;
    border: 1px solid black;
    padding: 10px 15px;
    border-radius: 0.5rem;">Try Again</button>
        `;
  }
}

// Move to the next level
function nextLevel() {
  level++;
  moveLimit -= 1; // Increase move limit for the next level
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
  const clickSound = new Audio(clickSoundSource);
  clickSound.play();
}

// Start the game
initGame();
