"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const bgMusic = document.getElementById("bg-music");

let ROWS = 20;
let COLS = 10;
let BLOCK_SIZE = 30;

let grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
console.log(grid);

let currentShape = {
  shape: [
    [1, 1, 1],
    [1, 1, 0],
  ],
  color: "orange",
};
let posX = 2;
let posY = 0;

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "black";

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (grid[y][x] === 0) {
        ctx.fillStyle = "white";
      } else {
        ctx.fillStyle = "lightseagreen";
      }
      ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }
  }
}

function drawShape() {
  for (let y = 0; y < currentShape.shape.length; y++) {
    for (let x = 0; x < currentShape.shape[y].length; x++) {
      if (currentShape.shape[y][x]) {
        ctx.fillStyle = currentShape.color;
        //to draw when the shape drop into the white grid area
        if (posY > -1) {
          ctx.fillRect(
            (posX + x) * BLOCK_SIZE,
            (posY + y) * BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE
          );
          ctx.strokeRect(
            (posX + x) * BLOCK_SIZE,
            (posY + y) * BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE
          );
        }
      }
    }
  }
}

function checkCollision(shape, offsetX, offsetY) {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        let newY = y + offsetY;
        let newX = x + offsetX;

        if (newY >= ROWS || newX < 0 || newX >= COLS || grid[newY][newX]) {
          return true;
        }
      }
    }
  }
  return false;
}

function fixShape() {
  for (let y = 0; y < currentShape.shape.length; y++) {
    for (let x = 0; x < currentShape.shape[y].length; x++) {
      if (currentShape.shape[y][x]) {
        grid[posY + y][posX + x] = 1;
      }
    }
  }
}

///////////////
//to generage different shape
///////////////////
function generateNewShape() {
  const shapeArray = [
    {
      shape: [
        [1, 1, 1],
        [0, 1, 0],
      ],
      color: "#FA5A5A",
    },
    {
      shape: [
        [1, 1],
        [1, 1],
      ],
      color: "#6CC55F",
    },
    {
      shape: [
        [1, 0, 0],
        [1, 1, 1],
      ],
      color: "#C878E6",
    },
    {
      shape: [
        [1, 1, 0],
        [0, 1, 1],
      ],
      color: "#78AAF0",
    },
    { shape: [[1, 1, 1, 1]], color: "#F050BE" },
    {
      shape: [
        [1, 1, 1],
        [1, 1, 0],
      ],
      color: "orange",
    },
  ];
  const n = shapeArray.length;
  currentShape = shapeArray[Math.floor(Math.random() * n)];
  posX = 3;
  posY = 0;
}

const score = document.querySelector(".score");

let scoreUpdated = 0;
function clearLines() {
  for (let y = 0; y < ROWS; y++) {
    if (grid[y].every((cell) => cell === 1)) {
      grid.splice(y, 1);
      grid.unshift(Array(COLS).fill(0));
      scoreUpdated++;
      score.textContent = scoreUpdated * 10;
    }
  }
}

function gameLoop() {
  drawGrid();
  drawShape();
}

const scoreBox = document.querySelector(".scoreBox");
const messageBox = document.querySelector(".messages");
const messageAdded = document.createElement("div");
messageAdded.classList.add("message");
messageAdded.classList.add("scoreInfo");
messageAdded.textContent = "Game over !";
function update() {
  if (!checkCollision(currentShape.shape, posX, posY + 1)) {
    posY++;
  } else if (checkCollision(currentShape.shape, posX, posY)) {
    fixShape();

    scoreBox.append(messageAdded);
    currentShape = [];
  } else {
    fixShape();
    clearLines();
    generateNewShape();
  }
}

//real actions
function gameRun1() {
  gameLoop();
  update();
}

let intervalId;

function startInverval() {
  intervalId = setInterval(() => {
    gameRun1();
  }, 800);
}

startInverval();

function restartInterval() {
  if (intervalId) {
    clearInterval(intervalId);
    startInverval();
  }
}

//to move left right and down
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    rotateShape();
    gameLoop();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.code === "KeyA") {
    event.preventDefault();
    rotateShapeAnti();
    gameLoop();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft") {
    event.preventDefault();
    moveLeftShape();
    gameLoop();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowRight") {
    moveRightShape();
    gameLoop();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowDown") {
    event.preventDefault();
    moveDownShape();
    gameLoop();
  }
});
// to pause the game
const btnP = document.querySelector(".pause");

btnP.addEventListener("click", function () {
  clearInterval(intervalId);
  bgMusic.pause();
});
//continue;
const btnC = document.querySelector(".continue");
btnC.addEventListener("click", function () {
  restartInterval();
  if (btnMu.textContent === "Stop music") bgMusic.play();
});

////Restart the game
const btnRe = document.querySelector(".restart");
btnRe.addEventListener("click", function () {
  messageAdded.remove();
  //to set the grid and shape to its original value
  grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  currentShape = {
    shape: [
      [1, 1, 1],
      [1, 1, 0],
    ],
    color: "orange",
  };
  posX = 2;
  posY = 0;
  //loop the game;
  restartInterval();
  bgMusic.currentTime = 0;
  if (btnMu.textContent === "Stop music") bgMusic.play();
});

const btnMu = document.querySelector(".music");
btnMu.addEventListener("click", function (e) {
  e.preventDefault();
  if (bgMusic.paused) {
    bgMusic.play();
    btnMu.textContent = "Stop music";
  } else {
    bgMusic.pause();
    bgMusic.currentTime = 0;
    btnMu.textContent = "Play music";
  }
});

function rotateMatrix(matrix) {
  const rotated = matrix[0].map((_, index) =>
    matrix.map((row) => row[index]).reverse()
  );
  return rotated;
}

function rotateMatrixAnti(matrix) {
  const rotated1 = matrix.map((row) => row.reverse());
  const rotated2 = rotated1[0].map((_, index) =>
    rotated1.map((row) => row[index])
  );
  return rotated2;
}

function rotateShapeAnti() {
  const rotatedShape = rotateMatrixAnti(currentShape.shape);
  if (!checkCollision(rotatedShape, posX, posY)) {
    currentShape.shape = rotatedShape;
  }
}

function rotateShape() {
  const rotatedShape = rotateMatrix(currentShape.shape);
  if (!checkCollision(rotatedShape, posX, posY)) {
    currentShape.shape = rotatedShape;
  }
}
//to move left right and down
function moveLeftShape() {
  if (!checkCollision(currentShape.shape, posX - 1, posY)) {
    posX--;
  }
}

function moveRightShape() {
  if (!checkCollision(currentShape.shape, posX + 1, posY)) {
    posX++;
  }
}

function moveDownShape() {
  if (!checkCollision(currentShape.shape, posX, posY + 1)) {
    posY++;
  }
}

//////pause,clearInterval, or set time to very big number.
//continue, when click pause, put current grid and position x,y into variables.
//when continue, put these variable into initial grid and position xy.
//restart, clear grid, all set to 0; clear position x,y.
///end (y all cell===1,then, stop generate new shape,if,click restart, clear y, add new y,)

////////Responsive Design

const btnLeft = document.querySelector(".left");
const btnRight = document.querySelector(".right");
const btnRotate = document.querySelector(".rotate");
const btnDown = document.querySelector(".down");

btnLeft.addEventListener("touchstart", function () {
  btnLeft.classList.add("touched");
  moveLeftShape();
  gameLoop();
});

btnLeft.addEventListener("touchend", function () {
  btnLeft.classList.remove("touched");
});

btnRight.addEventListener("touchstart", function () {
  btnRight.classList.add("touched");
  moveRightShape();
  gameLoop();
});

btnRight.addEventListener("touchend", function () {
  btnRight.classList.remove("touched");
});

btnRotate.addEventListener("touchstart", function () {
  btnRotate.classList.add("touched");
  rotateShapeAnti();
  gameLoop();
});

btnRotate.addEventListener("touchend", function () {
  btnRotate.classList.remove("touched");
});

btnDown.addEventListener("touchstart", function () {
  btnDown.classList.add("touched");
  moveDownShape();
  gameLoop();
});

btnDown.addEventListener("touchend", function () {
  btnDown.classList.remove("touched");
});

////medium screen

const btnsResponsive = document.querySelector(".btns-responsive");
const mediaQueryMedium = window.matchMedia(
  "(min-width: 430px) and (max-width: 1024px)"
);
function handleMediaQueryMediumChange(event) {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const devicePixelRatio = window.devicePixelRatio || 1;

  if (event.matches) {
    canvas.height = 600 * devicePixelRatio;
    canvas.width = 300 * devicePixelRatio;
    canvas.style.height = "600px"; // Set the CSS height
    canvas.style.width = "300px"; // Set the CSS width
    ROWS = 20;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    btnsResponsive.classList.remove("hidden");
    messageBox.classList.add("hidden");
  } else {
    canvas.height = 600 * devicePixelRatio;
    canvas.width = 300 * devicePixelRatio;
    canvas.style.height = "600px"; // Set the CSS height
    canvas.style.width = "300px"; // Set the CSS width
    ROWS = 20;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    btnsResponsive.classList.add("hidden");
    messageBox.classList.remove("hidden");
  }
}
// Initial check
handleMediaQueryMediumChange(mediaQueryMedium);
// Add listener for media query changes
mediaQueryMedium.addEventListener("change", handleMediaQueryMediumChange);

/////small screen

const mediaQuerySmall = window.matchMedia(
  "(min-width: 390px) and (max-width: 430px)"
);

function handleMediaQuerySmallChange(event) {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const devicePixelRatio = window.devicePixelRatio || 1;

  if (event.matches) {
    canvas.height = 450 * devicePixelRatio;
    canvas.width = 300 * devicePixelRatio;
    canvas.style.height = "450px"; // Set the CSS height
    canvas.style.width = "300px"; // Set the CSS width
    ROWS = 15;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    btnsResponsive.classList.remove("hidden");
    messageBox.classList.add("hidden");
  } else {
    canvas.height = 600 * devicePixelRatio;
    canvas.width = 300 * devicePixelRatio;
    canvas.style.height = "600px"; // Set the CSS height
    canvas.style.width = "300px"; // Set the CSS width
    ROWS = 20;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    btnsResponsive.classList.add("hidden");
    messageBox.classList.remove("hidden");
  }
}
// Initial check
handleMediaQuerySmallChange(mediaQuerySmall);
// Add listener for media query changes
mediaQuerySmall.addEventListener("change", handleMediaQuerySmallChange);

//////////
