'use strict';

const EMPTY = '';
const MINE = '💣';
const FOUND_MINE = '❌'
const MARK = '🚩';
const SMYLE = '🙂';
const WIN = '😎';
const LOSE = '🤯';
const LIVE = '💙';
const HINT = '💡';
const TIP = '✅';

var gBoard = [];
var gTimer;
var gLevel = {
    size: 8,
    mines: 12
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    flagsLeft: 0,
    secsPassed: 0,
    lives: 3,
    ifHint: false,
    safeClick: 3,
    ifUndo: false,
    ifSafe: false,
    ifHints: false,
    ifLives: false,

    ifManual: false
}
var gGameMemory = [];
var saving = false;


function initGame() {
    gGame.isOn = true;
    gBoard = buildBoard(gLevel.size);
    gGame.flagsLeft = gLevel.mines;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    gGame.lives = 3;
    gGame.ifHints = false;
    gGame.safeClick = 3;
    gGame.ifUndo = false;
    gGame.ifSafe = false;
    gGame.ifHints = false;
    gGame.ifLives = false;
    clearInterval(gTimer);
    renderBoard(gBoard);
    renderStart();
    gTimer = null;
    gGameMemory = [];
    saving = false;
}


function buildBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            };
        }
    }
    return board;
}


function getMines(minesAmount, i, j) {
    var amount = minesAmount;
    while (amount) {
        var randI = getRandomInt(0, gBoard.length - 1);
        var randJ = getRandomInt(0, gBoard[0].length - 1);
        if (randI === i && randJ === j) continue;
        if (!gBoard[randI][randJ].isMine) {
            gBoard[randI][randJ].isMine = true;
            amount--;
        }
    }
}


function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var count = countMinesAround(board, i, j);
            gBoard[i][j].minesAroundCount = count;
        }
    }
}


function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return;

    var cell = gBoard[i][j];

    if (cell.isMarked || cell.isShown) return;
    if (gGame.ifHint) {
        hintShow(gBoard, i, j);
        gGame.ifHint = false;
        return;
    }
    var saveTurn = {
        board: JSON.parse(JSON.stringify(gBoard)),
        game: JSON.parse(JSON.stringify(gGame)),
    }
    gGameMemory.push(saveTurn);

    if (!gGame.shownCount && !gGame.markedCount) {
        if (!saving) {
            gGame.isOn = true;
            gameTimer();
        }
    }
    saving = true;

    if (cell.isMine) {
        if (gGame.lives && gGame.ifLives) {
            gGame.lives--;
            var elLives = document.querySelector('.lives');
            elLives.innerText = LIVE.repeat(gGame.lives);
            elCell.innerText = MINE;
            setTimeout(function () { elCell.innerText = EMPTY }, 1000)
            return;
        }
        else {
            lose();
            elCell.style.backgroundColor = "red";
            return;
        }
    }
    if (!gGame.shownCount) {
        getMines(gLevel.mines, i, j);
        setMinesNegsCount(gBoard);
    }
    if (!cell.minesAroundCount) {
        expandShown(gBoard, i, j)
        renderBoard(gBoard)
        checkGameOver();
    } else {
        cell.isShown = true;
        renderBoard(gBoard)
        gGame.shownCount++;
        checkGameOver();
    }
}


function expandShown(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue;
            var currCell = board[i][j];
            if (currCell.isShown) continue;
            currCell.isShown = true;
            gGame.shownCount++;
            if (!currCell.minesAroundCount) expandShown(board, i, j);
        }
    }
}


function cellMarked(i, j) {
    if (!gGame.isOn) return;
    if (!gGame.shownCount && !gGame.markedCount) {
        gGame.isOn = true;
        gameTimer()
    }
    var cell = gBoard[i][j];
    var elFlags = document.querySelector('.flags')
    if (cell.isShown) return;
    else if (cell.isMarked) {
        cell.isMarked = false;
        gGame.markedCount--;
        gGame.flagsLeft++;
    } else if (!gGame.flagsLeft) return;
    else {
        cell.isMarked = true;
        gGame.markedCount++;
        gGame.flagsLeft--;
    }
    elFlags.innerText = gGame.flagsLeft + MARK;
    renderBoard(gBoard)
    checkGameOver();
}


function checkGameOver() {
    var cellsAmount = gBoard.length * gBoard[0].length;
    if (gGame.markedCount === gLevel.mines &&
        gGame.shownCount === cellsAmount - gLevel.mines) {
        win()
    }
}


function lose() {
    var elSmyle = document.querySelector('.smyle');
    animation();
    elSmyle.innerText = LOSE;

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            if (cell.isMine) cell.isShown = true;
        }
    }
    gGame.isOn = false;
    renderBoard(gBoard)
    clearInterval(gTimer);
    gTimer = null;
    console.log('lose')
}


function win() {
    var elSmyle = document.querySelector('.smyle');
    animation();
    elSmyle.innerHTML = WIN;
    gGame.isOn = false;
    renderBoard(gBoard)
    clearInterval(gTimer);
    gTimer = null;
    console.log('win')
    highScore();
}


function restart() {
    initGame()
}


function levelOption(size, mines) {
    gLevel.size = size;
    gLevel.mines = mines;
    initGame()
}


function animation() {
    var elSmyle = document.querySelector('.smyle');
    elSmyle.style.position = 'absolute';
    elSmyle.style.fontSize = '100px';
    elSmyle.style.left = '40%'
    elSmyle.style.top = '1%'
    elSmyle.style.backgroundColor = 'orangered';
    elSmyle.style.borderRadius = '50%'
    elSmyle.style.transition = 'width 2s, height 2s, background-color 2s, transform 2s';
    setTimeout(function () {
        elSmyle.style.position = 'static';
        elSmyle.style.fontSize = 'x-large';
        elSmyle.style.left = '0%'
        elSmyle.style.top = '0%'
        elSmyle.style.backgroundColor = 'yellowgreen';
        elSmyle.style.borderRadius = '20%'
    }, 2000)
}