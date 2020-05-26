const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let sizeCell = 20;
let density = 5;
let cols;
let rows;
let field = [];
let gen;
let isManual = false;
let isStarted = false;

const input_sizeCell = document.getElementById('sizeCell');
const input_density = document.getElementById('density');

window.addEventListener('resize', resizeCanvas, false);

document.getElementById('l_sizeCell').textContent = `Размер клетки: ${input_sizeCell.value}`;
document.getElementById('l_density').textContent = `Плотность: ${input_density.value}`;

function inputChange(id) {
  if (id == 'sizeCell') {
    sizeCell = document.getElementById(id).value;
    initNewField();
  } else {
    density = document.getElementById(id).value;
  }
  document.getElementById(`l_${id}`).textContent = `${id == 'sizeCell' ? 'Размер клетки:' : 'Плотность:'} ${
    document.getElementById(id).value
  }`;
}

function resizeCanvas() {
  canvas.width = document.querySelector('.game-field').clientWidth;
  canvas.height = document.querySelector('.game-field').clientHeight;
  initNewField();
}
resizeCanvas();

function initNewField() {
  field = [];
  cols = Math.floor(canvas.width / sizeCell);
  rows = Math.floor(canvas.height / sizeCell);
  for (let x = 0; x < cols; x++) {
    field[x] = [];
    for (let y = 0; y < rows; y++) {
      field[x][y] = false;
    }
  }
}

function start() {
  if (isStarted) return;
  if (!isManual) {
    let random;
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        random = Math.floor(Math.random() * density);
        if (random == 0) {
          field[x][y] = true;
          context.fillStyle = 'rgb(255,0,0)';
          context.fillRect(x * sizeCell, y * sizeCell, sizeCell, sizeCell);
        }
      }
    }
  }
  input_sizeCell.setAttribute('disabled', true);
  input_density.setAttribute('disabled', true);
  gen = setInterval(iteration, 100);
  isStarted = true;
}

function stop() {
  clearInterval(gen);
  isStarted = false;
  isManual = false;
  context.clearRect(0, 0, canvas.width, canvas.height);
  input_sizeCell.removeAttribute('disabled');
  input_density.removeAttribute('disabled');
}

function pause() {
  clearInterval(gen);
  isStarted = false;
}

function iteration() {
  let neighborsCount;
  let newField = [];
  for (let x = 0; x < cols; x++) {
    newField[x] = [];
    for (let y = 0; y < rows; y++) {
      neighborsCount = countOFLivingNeighbors(x, y);
      if (neighborsCount == 3 && !field[x][y]) {
        newField[x][y] = true;
      } else if (field[x][y] && (neighborsCount < 2 || neighborsCount > 3)) {
        newField[x][y] = false;
      } else newField[x][y] = field[x][y];
    }
  }
  field = newField;
  redraw();
}

function countOFLivingNeighbors(col, row) {
  let count = 0;
  for (let x = -1; x < 2; x++) {
    for (let y = -1; y < 2; y++) {
      let chekingX = (x + col + cols) % cols;
      let chekingY = (y + row + rows) % rows;
      if (x == 0 && y == 0) continue;
      if (field[chekingX][chekingY]) {
        count++;
      }
    }
  }
  return count;
}

function redraw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      if (field[x][y]) {
        context.fillStyle = 'rgb(255,0,0)';
        context.fillRect(x * sizeCell, y * sizeCell, sizeCell, sizeCell);
      }
    }
  }
}

function getMousePos(e) {
  let canvasRect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - canvasRect.left,
    y: e.clientY - canvasRect.top,
  };
}

function manualDraw(e) {
  isManual = true;
  let pos = getMousePos(e);
  let xCellPos = Math.floor(pos.x / sizeCell);
  let yCellPos = Math.floor(pos.y / sizeCell);

  input_sizeCell.setAttribute('disabled', true);
  input_density.setAttribute('disabled', true);

  if (field[xCellPos][yCellPos]) {
    context.fillStyle = 'rgb(0,0,0)';
    field[xCellPos][yCellPos] = false;
  } else {
    context.fillStyle = 'rgb(255,0,0)';
    field[xCellPos][yCellPos] = true;
  }
  context.fillRect(xCellPos * sizeCell, yCellPos * sizeCell, sizeCell, sizeCell);
}
