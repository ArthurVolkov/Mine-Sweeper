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
    ifHint: false
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
    gGame.ifHint = false;
    clearInterval(gTimer);
    renderBoard(gBoard);
    renderStart();
    gTimer = null;
    console.log('gBoard:', gBoard)

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


function getMines(minesAmount) {
    var amount = minesAmount;
    while (amount) {
        var randI = getRandomInt(0, gBoard.length - 1);
        var randJ = getRandomInt(0, gBoard[0].length - 1);
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


function renderStart() {
    var elTimer = document.querySelector('.timer');
    var elFlags = document.querySelector('.flags');
    var elSmyle = document.querySelector('.smyle');
    var elLives = document.querySelector('.lives');
    var elHints = document.querySelectorAll('.hints');
    console.log('elHints:', elHints)
    for (var i = 0; i < elHints.length; i++){
        elHints[i].innerText = HINT;
        elHints[i].setAttribute('onclick', 'hint(this)')
    }

    elTimer.innerText = '000'
    elFlags.innerText = gGame.flagsLeft + MARK + ' ';
    elSmyle.innerHTML = SMYLE;
    elLives.innerText = LIVE.repeat(3);
}



function renderBoard(board) {
    var strHTML = '<table border="1" cellpadding="1"><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var className = `cell cell${i}-${j}`;
            var toShow = EMPTY;
            if (cell.isShown) {
                toShow = cell.minesAroundCount;
                className += ` shown ${getFontColor(cell)}`
            }
            if (!cell.minesAroundCount) toShow = EMPTY;
            if (cell.isMarked) toShow = MARK;
            if (cell.isMine && !gGame.isOn) toShow = MINE;
            if (cell.isMine && !gGame.isOn && cell.isMarked) toShow = FOUND_MINE;

            strHTML += `<td class="${className}" onclick="cellClicked(this, ${i}, ${j})"
                        oncontextmenu="cellMarked(this, ${i}, ${j}); return false">${toShow}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML = strHTML;
}


// function renderBoard(board) {
//     var strHTML = '<table border="1" cellpadding="1"><tbody>';
//     for (var i = 0; i < board.length; i++) {
//         strHTML += '<tr>';
//         for (var j = 0; j < board[0].length; j++) {
//             var cell = board[i][j];
//             var className = `cell cell${i}-${j}`;
//             var toShow = (cell.isShown) ? cell.minesAroundCount : EMPTY;
//             if (cell.isMarked) toShow = MARK;
//             if (cell.isMine && !gGame.isOn) toShow = MINE;
//             if (cell.isMine && !gGame.isOn && cell.isMarked) toShow = FOUND_MINE;
//             strHTML += `<td class="${className}" onclick="cellClicked(this, ${i}, ${j})"
//                         oncontextmenu="cellMarked(this, ${i}, ${j}); return false">${toShow}</td>`
//         }
//         strHTML += '</tr>'
//     }
//     strHTML += '</tbody></table>';
//     var elContainer = document.querySelector('.board-container');
//     elContainer.innerHTML = strHTML;
// }

function undo() {
    var elSmyle = document.querySelector('.smyle');


    if (gGameMemory.length === 0) return;
    console.log('gGameMemory:', gGameMemory)

    var time = gGame.secsPassed

    var lastTurn = gGameMemory.pop();
    gBoard = JSON.parse(JSON.stringify(lastTurn.board));
    gGame = JSON.parse(JSON.stringify(lastTurn.game));
    gGame.secsPassed = time;

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
    gGameMemory.push(saveTurn)

    if (!gGame.shownCount && !gGame.markedCount) {
        if (!saving) {
            gGame.isOn = true;
            gameTimer()
        }
    }
    saving = true;

    if (cell.isMine) {
        if (gGame.lives) {
            gGame.lives--;
            var elLives = document.querySelector('.lives');
            elLives.innerText = LIVE.repeat(gGame.lives);
            elCell.innerText = MINE;
            setTimeout(function () { elCell.innerText = EMPTY }, 1000)
            return
        }
        else {
            lose();
            elCell.style.backgroundColor = "red";
            return;
        }
    }
    if (!gGame.shownCount) {
        getMines(gLevel.mines);
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

// function cellClicked(elCell, i, j) {
//     if (!gGame.isOn) return;
//     var cell = gBoard[i][j];
//     if (cell.isMarked || cell.isShown) return;

//     if (cell.isMine) {
//         lose();
//         return;
//     }

//     if (!gGame.shownCount && !saving) {  ///
//         getMines(gLevel.mines);
//         setMinesNegsCount(gBoard);
//     }


//     var saveTurn = {
//         board: JSON.parse(JSON.stringify(gBoard)),
//         game: JSON.parse(JSON.stringify(gGame)),
//     }

//     gGameMemory.push(saveTurn)


//     if (!gGame.shownCount && !gGame.markedCount) {
//         if (!saving) {
//             gGame.isOn = true;
//             gameTimer()
//         }
//     }

//     saving = true;
//     // if (gTimer !== 1) gTimer = 1  ////



//     // if (cell.isMine) {
//     //     lose();
//     //     return;
//     // }
//     // if (!gGame.shownCount) {
//     //     getMines(gLevel.mines);
//     //     setMinesNegsCount(gBoard);
//     // }

//     if (!cell.minesAroundCount) {
//         expandShown(gBoard, i, j)
//         renderBoard(gBoard)
//         checkGameOver();
//     } else {
//         cell.isShown = true;
//         renderBoard(gBoard)
//         gGame.shownCount++;
//         checkGameOver();
//     }
// }


function expandShown(board, rowIdx, colIdx) {
    // var currCell = board[i][j];

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue;
            // if (i === rowIdx && j === colIdx) continue;
            var currCell = board[i][j];
            if (currCell.isShown) continue;
            currCell.isShown = true;
            gGame.shownCount++;
            if (!currCell.minesAroundCount) expandShown(board, i, j);
        }
    }
}


// function openAround(board, rowIdx, colIdx) {
//     for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
//         if (i < 0 || i > board.length - 1) continue;
//         for (var j = colIdx - 1; j <= colIdx + 1; j++) {
//             if (j < 0 || j > board[0].length - 1) continue;
//             if (i === rowIdx && j === colIdx) continue;
//             var currCell = board[i][j];
//             currCell.isShown = true;

//             if (!currCell.minesAroundCount && !currCell.isShown) openAround(board, i, j);
//         }
//     }
// }


function cellMarked(elCell, i, j) {
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
    console.log('cellsAmount:', cellsAmount)
    console.log('gGame.markedCount:', gGame.markedCount)
    console.log('gGame.shownCount:', gGame.shownCount)
    if (gGame.markedCount === gLevel.mines &&
        gGame.shownCount === cellsAmount - gLevel.mines) {
        win()
    }
}




function lose() {
    var elSmyle = document.querySelector('.smyle');
    elSmyle.innerText = LOSE; ///
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            if (cell.isMine) cell.isShown = true;
        }
    }
    gGame.isOn = false; ///
    renderBoard(gBoard)
    clearInterval(gTimer);///
    gTimer = null;
    console.log('lose')
}

function win() {
    var elSmyle = document.querySelector('.smyle');
    elSmyle.innerHTML = WIN;
    gGame.isOn = false;
    renderBoard(gBoard)
    clearInterval(gTimer);
    gTimer = null;
    console.log('win')
}


function restart() {
    initGame()
}


function levelOption(size, mines) {
    gLevel.size = size;
    gLevel.mines = mines;
    initGame()
}


function hint(elCell) {
    if (!gGame.shownCount && !gGame.markedCount) return;
    gGame.ifHint = true;
    elCell.innerText = '💥'
    elCell.onclick = '';
}