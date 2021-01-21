'use strict';


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function countMinesAround(board, rowIdx, colIdx) {
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;
            var currCell = board[i][j];
            if (currCell.isMine) count++;
        }
    }
    return count;
}

function gameTimer() {
    var elTimer = document.querySelector('.timer');
    gTimer = setInterval(function () {
        // if (gTimer !== 1) gTimer = 1  ////

        gGame.secsPassed++;
        if (gGame.secsPassed < 10) elTimer.innerText = '00' + gGame.secsPassed;
        else if (gGame.secsPassed < 100) elTimer.innerText = '0' + gGame.secsPassed;
        else elTimer.innerText = gGame.secsPassed;
    }, 1000)
}


function getFontColor(cell) {
    var color = ''
    switch (cell.minesAroundCount) {
        case 1:
            color = 'blue';
            break;
        case 2:
            color = 'green';
            break;
        case 3:
            color = 'red';
            break;
        case 4:
            color = 'magenta';
            break;
        case 5:
            color = 'maroon';
            break;
        case 6:
            color = 'lightseagreen';
            break;
        case 7:
            color = 'black';
            break;
        case 8:
            color = 'lightslategray';
            break;
    }
    return color;
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


// function hintShow(board, rowIdx, colIdx) {
//     var hintCells = [];


//     for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
//         if (i < 0 || i > board.length - 1) continue;
//         for (var j = colIdx - 1; j <= colIdx + 1; j++) {
//             if (j < 0 || j > board[0].length - 1) continue;
//             var currCell = board[i][j];
//             var elCurrCell = document.querySelector(`.cell${i}-${j}`)
//             var toShow = EMPTY;
//             if (!elCurrCell.classList.contains('shown')){
//                 if (currCell.isMine) toShow = MINE;
//                 else if (currCell.minesAroundCount) toShow = currCell.minesAroundCount;
//                 elCurrCell.innerText = toShow;

//                 // setTimeout(function () { elCurrCell.innerText = EMPTY}, 1000);
//             }
//         }
//     }
// }