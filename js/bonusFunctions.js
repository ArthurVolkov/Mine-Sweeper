'use strict'

function undo() {
    if (!gGame.ifUndo) return;
    var elSmyle = document.querySelector('.smyle');
    var elFlags = document.querySelector('.flags');
    if (gGameMemory.length === 0) return;
    var time = gGame.secsPassed;
    var safeClick = gGame.safeClick;
    var lives = gGame.lives
    var lastTurn = gGameMemory.pop();
    var ifUndo = gGame.ifUndo;
    var ifSafe = gGame.ifSafe;
    var ifHints = gGame.ifHints;
    var ifLives = gGame.ifLives;
    gBoard = JSON.parse(JSON.stringify(lastTurn.board));
    gGame = JSON.parse(JSON.stringify(lastTurn.game));
    gGame.secsPassed = time;
    gGame.lives = lives;
    gGame.safeClick = safeClick;
    elFlags.innerText = gGame.flagsLeft + MARK + ' ';
    gGame.ifUndo = ifUndo;
    gGame.ifSafe = ifSafe;
    gGame.ifHints = ifHints;
    gGame.ifLives = ifLives;
    if (!gGame.isOn) gGame.isOn = true;
    if (elSmyle.innerText === LOSE) {
        elSmyle.innerText = SMYLE;
        gameTimer()
    }
    if (elSmyle.innerText === WIN) {
        elSmyle.innerText = SMYLE;
        gameTimer()
    }
    renderBoard(gBoard);
}


function highScore() {
    var highScore = gGame.secsPassed;
    var elCell;

    if (gLevel.size === 4) {
        if (localStorage.beginer === undefined) {
            localStorage.beginer = highScore;
        }
        else if (localStorage.beginer > highScore) {
            localStorage.beginer = highScore;
        }
        elCell = document.querySelector('.beginner-score span')
        elCell.innerText = localStorage.beginer;
    }
    if (gLevel.size === 8) {
        if (localStorage.medium === undefined) {
            localStorage.medium = highScore;
        }
        else if (localStorage.medium > highScore) {
            localStorage.medium = highScore;
        }
        elCell = document.querySelector('.medium-score span')
        elCell.innerText = localStorage.medium;
    }
    if (gLevel.size === 12) {
        if (localStorage.expert === undefined) {
            localStorage.expert = highScore;
        }
        else if (localStorage.expert > highScore) {
            localStorage.expert = highScore;
        }
        elCell = document.querySelector('.expert-score span')
        elCell.innerText = localStorage.expert;
    }
}


function hint(elCell) {
    if (!gGame.ifHints) return;
    if (!gGame.shownCount && !gGame.markedCount) return;
    gGame.ifHint = true;
    elCell.innerText = '💥'
    elCell.onclick = '';
}


function hintShow(board, rowIdx, colIdx) {
    var hintCells = [];
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue;
            var currCell = board[i][j];
            var elCurrCell = document.querySelector(`.cell${i}-${j}`)
            var toShow = EMPTY;
            if (!elCurrCell.classList.contains('shown')) {
                if (currCell.isMine) toShow = MINE;
                else if (currCell.minesAroundCount) toShow = currCell.minesAroundCount;
                elCurrCell.innerText = toShow;
                hintCells.push(elCurrCell);
            }
        }
    }
    setTimeout(function () {
        for (var i = 0; i < hintCells.length; i++) {
            elCurrCell = hintCells[i];
            elCurrCell.innerText = EMPTY
        }
    }, 1000);
}


function safeClick() {
    if (!gGame.ifSafe) return;
    if (!gGame.safeClick) return;
    if (!gGame.shownCount && !gGame.markedCount) return;
    var freeBoard = []

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            if (!cell.isMine && !cell.isShown) {
                freeBoard.push({ i: i, j: j })
            }
        }
    }
    if (freeBoard.length === 0) return;
    freeBoard.sort(() => Math.random() - 0.5);
    var randIndex = freeBoard[0];
    var elCell = document.querySelector(`.cell${randIndex.i}-${randIndex.j}`)
    elCell.innerText = TIP;
    gGame.safeClick--;
    var elButton = document.querySelector('.safe-count')
    elButton.innerText = gGame.safeClick;
    setTimeout(function () { elCell.innerText = EMPTY }, 1500)
}