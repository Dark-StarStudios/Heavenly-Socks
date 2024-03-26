'use strict';
const canvas = document.querySelector('canvas');
canvas.width = 640;
canvas.height = 640;

const g = canvas.getContext('2d');

const right = { x: 1, y: 0 };
const down = { x: 0, y: 1 };
const left = { x: -1, y: 0 };

let EMPTY = -1;
let BORDER = -2;

let fallingShape;
let nextShape;
let dim = 640;
let nRows = 18;
let nCols = 12;
let blockSize = 30;
let topMargin = 50;
let leftMargin = 20;
let scoreX = 400;
let scoreY = 330;
let titleX = 130;
let titleY = 160;
let clickX = 120;
let clickY = 400;
let previewCenterX = 467;
let previewCenterY = 97;
let mainFont = 'bold 48px monospace';
let smallFont = 'bold 18px monospace';
let colors = ['green', 'red', 'blue', 'purple', 'orange', 'blueviolet', 'magenta'];
let gridRect = { x: 46, y: 47, w: 308, h: 517 };
let previewRect = { x: 387, y: 47, w: 200, h: 200 };
let titleRect = { x: 100, y: 95, w: 252, h: 100 };
let clickRect = { x: 50, y: 375, w: 252, h: 40 };
let outerRect = { x: 5, y: 5, w: 630, h: 630 };
let squareBorder = '#264653';
let titlebgColor = 'white';
let textColor = 'black';
let bgColor = 'white';
let gridColor = 'rgba(104, 204, 191, 1)';
let gridBorderColor = '#E26F51';
let largeStroke = 5;
let smallStroke = 2;

// position of falling shape
let fallingShapeRow;
let fallingShapeCol;

let keyDown = false;
let fastDown = false;

let grid = [];
let scoreboard = new Scoreboard();

addEventListener('keydown', function (event) {
    if (!keyDown) {
        // keyDown = true;

        if (scoreboard.isGameOver())
            return;
            console.log(event.key);
        switch (event.key) {

            case 'w':
            case 'ArrowUp':
                if (canRotate(fallingShape))
                    rotate(fallingShape);
                break;

            case 'a':
            case 'ArrowLeft':
                if (canMove(fallingShape, left))
                    move(left);
                break;

            case 'd':
            case 'ArrowRight':
                if (canMove(fallingShape, right))
                    move(right);
                break;

            case 's':
            case 'ArrowDown':
                if (canMove(fallingShape, down))
                    move(down);
                break;

            case ' ':
                if (!fastDown) {
                    fastDown = true;
                    while (canMove(fallingShape, down)) {
                        move(down);
                        draw();
                    }
                    shapeHasLanded();
                }
        }
        draw();
    }
});

addEventListener('click', function () {
    startNewGame();
});

addEventListener('keyup', function () {
    keyDown = false;
    fastDown = false;
});

function canRotate(s) {
    if (s === Shapes.Square)
        return false;

        let pos = new Array(4);
    for (let i = 0; i < pos.length; i++) {
        pos[i] = s.pos[i].slice();
    }

    pos.forEach(function (row) {
        let tmp = row[0];
        row[0] = row[1];
        row[1] = -tmp;
    });

    return pos.every(function (p) {
        let newCol = fallingShapeCol + p[0];
        let newRow = fallingShapeRow + p[1];
        return grid[newRow][newCol] === EMPTY;
    });
}

function rotate(s) {
    if (s === Shapes.Square)
        return;

    s.pos.forEach(function (row) {
        var tmp = row[0];
        row[0] = row[1];
        row[1] = -tmp;
    });
}

function move(dir) {
    fallingShapeRow += dir.y;
    fallingShapeCol += dir.x;
}

function canMove(s, dir) {
    return s.pos.every(function (p) {
        let newCol = fallingShapeCol + dir.x + p[0];
        let newRow = fallingShapeRow + dir.y + p[1];
        return grid[newRow][newCol] === EMPTY;
    });
}

function shapeHasLanded() {
    addShape(fallingShape);
    if (fallingShapeRow < 2) {
        scoreboard.setGameOver();
        scoreboard.setTopscore();
    } else {
        scoreboard.addLines(removeLines());
    }
    selectShape();
}

function removeLines() {
    let count = 0;
    for (let r = 0; r < nRows - 1; r++) {
        for (let c = 1; c < nCols - 1; c++) {
            if (grid[r][c] === EMPTY)
                break;
            if (c === nCols - 2) {
                count++;
                removeLine(r);
            }
        }
    }
    return count;
}

function removeLine(line) {
    for (let c = 0; c < nCols; c++)
        grid[line][c] = EMPTY;

    for (let c = 0; c < nCols; c++) {
        for (let r = line; r > 0; r--)
            grid[r][c] = grid[r - 1][c];
    }
}

function addShape(s) {
    s.pos.forEach(function (p) {
        grid[fallingShapeRow + p[1]][fallingShapeCol + p[0]] = s.ordinal;
    });
}

function Shape(shape, o) {
    this.shape = shape;
    this.pos = this.reset();
    this.ordinal = o;
}

let Shapes = {
    ZShape: [[0, -1], [0, 0], [-1, 0], [-1, 1]],
    SShape: [[0, -1], [0, 0], [1, 0], [1, 1]],
    IShape: [[0, -1], [0, 0], [0, 1], [0, 2]],
    TShape: [[-1, 0], [0, 0], [1, 0], [0, 1]],
    Square: [[0, 0], [1, 0], [0, 1], [1, 1]],
    LShape: [[-1, -1], [0, -1], [0, 0], [0, 1]],
    JShape: [[1, -1], [0, -1], [0, 0], [0, 1]]
};

function getRandomShape() {
    let keys = Object.keys(Shapes);
    let ord = Math.floor(Math.random() * keys.length);
    let shape = Shapes[keys[ord]];
    return new Shape(shape, ord);
}

Shape.prototype.reset = function () {
    this.pos = new Array(4);
    for (let i = 0; i < this.pos.length; i++) {
        this.pos[i] = this.shape[i].slice();
    }
    return this.pos;
}

function selectShape() {
    fallingShapeRow = 1;
    fallingShapeCol = 5;
    fallingShape = nextShape;
    nextShape = getRandomShape();
    if (fallingShape != null) {
        fallingShape.reset();
    }
}

function Scoreboard() {
    this.MAXLEVEL = 9;

    let level = 0;
    let lines = 0;
    let score = 0;
    let topscore = 0;
    let gameOver = true;

    this.reset = function () {
        this.setTopscore();
        level = lines = score = 0;
        gameOver = false;
    }

    this.setGameOver = function () {
        gameOver = true;
    }

    this.isGameOver = function () {
        return gameOver;
    }

    this.setTopscore = function () {
        if (score > topscore) {
            topscore = score;
        }
    }

    this.getTopscore = function () {
        return topscore;
    }

    this.getSpeed = function () {

        switch (level) {
            case 0: return 700;
            case 1: return 600;
            case 2: return 500;
            case 3: return 400;
            case 4: return 350;
            case 5: return 300;
            case 6: return 250;
            case 7: return 200;
            case 8: return 150;
            case 9: return 100;
            default: return 100;
        }
    }

    this.addScore = function (sc) {
        score += sc;
    }

    this.addLines = function (line) {

        switch (line) {
            case 1:
                this.addScore(10);
                break;
            case 2:
                this.addScore(20);
                break;
            case 3:
                this.addScore(30);
                break;
            case 4:
                this.addScore(40);
                break;
            default:
                return;
        }

        lines += line;
        if (lines > 10) {
            this.addLevel();
        }
    }

    this.addLevel = function () {
        lines %= 10;
        if (level < this.MAXLEVEL) {
            level++;
        }
    }

    this.getLevel = function () {
        return level;
    }

    this.getLines = function () {
        return lines;
    }

    this.getScore = function () {
        return score;
    }
}

function draw() {
    g.clearRect(0, 0, canvas.width, canvas.height);

    drawUI();

    if (scoreboard.isGameOver()) {
        drawStartScreen();
    } else {
        drawFallingShape();
    }
}

function drawStartScreen() {
    g.font = mainFont;

    fillRect(titleRect, titlebgColor);
    fillRect(clickRect, titlebgColor);

    g.fillStyle = textColor;
    g.fillText('Tetris', titleX, titleY);

    g.font = smallFont;
    g.fillText('click to start', clickX, clickY);
}

function fillRect(r, color) {
    g.fillStyle = color;
    g.fillRect(r.x, r.y, r.w, r.h);
}

function drawRect(r, color) {
    g.strokeStyle = color;
    g.strokeRect(r.x, r.y, r.w, r.h);
}

function drawSquare(colorIndex, r, c) {
    var bs = blockSize;
    g.fillStyle = colors[colorIndex];
    g.fillRect(leftMargin + c * bs, topMargin + r * bs, bs, bs);

    g.lineWidth = smallStroke;
    g.strokeStyle = squareBorder;
    g.strokeRect(leftMargin + c * bs, topMargin + r * bs, bs, bs);
}

function drawUI() {

    // background
    fillRect(outerRect, bgColor);
    fillRect(gridRect, gridColor);

    // the blocks dropped in the grid
    for (let r = 0; r < nRows; r++) {
        for (let c = 0; c < nCols; c++) {
            let idx = grid[r][c];
            if (idx > EMPTY)
                drawSquare(idx, r, c);
        }
    }

    // the borders of grid and preview panel
    g.lineWidth = largeStroke;
    drawRect(gridRect, gridBorderColor);
    drawRect(previewRect, gridBorderColor);
    drawRect(outerRect, "white");

    // scoreboard
    g.fillStyle = textColor;
    g.font = smallFont;
    g.fillText('hiscore    ' + scoreboard.getTopscore(), scoreX, scoreY);
    g.fillText('level      ' + scoreboard.getLevel(), scoreX, scoreY + 30);
    g.fillText('lines      ' + scoreboard.getLines(), scoreX, scoreY + 60);
    g.fillText('score      ' + scoreboard.getScore(), scoreX, scoreY + 90);

    // preview
    let minX = 5, minY = 5, maxX = 0, maxY = 0;
    nextShape.pos.forEach(function (p) {
        minX = Math.min(minX, p[0]);
        minY = Math.min(minY, p[1]);
        maxX = Math.max(maxX, p[0]);
        maxY = Math.max(maxY, p[1]);
    });
    let cx = previewCenterX - ((minX + maxX + 1) / 2.0 * blockSize);
    let cy = previewCenterY - ((minY + maxY + 1) / 2.0 * blockSize);

    g.translate(cx, cy);
    nextShape.shape.forEach(function (p) {
        drawSquare(nextShape.ordinal, p[1], p[0]);
    });
    g.translate(-cx, -cy);
}

function drawFallingShape() {
    let idx = fallingShape.ordinal;
    fallingShape.pos.forEach(function (p) {
        drawSquare(idx, fallingShapeRow + p[1], fallingShapeCol + p[0]);
    });
}

function animate(lastFrameTime) {
    let requestId = requestAnimationFrame(function () {
        animate(lastFrameTime);
    });
                
    let time = new Date().getTime();
    let delay = scoreboard.getSpeed();

    if (lastFrameTime + delay < time) {

        if (!scoreboard.isGameOver()) {

            if (canMove(fallingShape, down)) {
                move(down);
            } else {
                shapeHasLanded();
            }
            draw();
            lastFrameTime = time;

        } else {
            cancelAnimationFrame(requestId);
        }
    }
}

function startNewGame() {
    initGrid();
    selectShape();
    scoreboard.reset();
    animate(-1);
}

function initGrid() {
    function fill(arr, value) {
        for (let i = 0; i < arr.length; i++) {
            arr[i] = value;
        }
    }
    for (let r = 0; r < nRows; r++) {
        grid[r] = new Array(nCols);
        fill(grid[r], EMPTY);
        for (let c = 0; c < nCols; c++) {
            if (c === 0 || c === nCols - 1 || r === nRows - 1)
                grid[r][c] = BORDER;
        }
    }
}

function init() {
    initGrid();
    selectShape();
    draw();
}

init();