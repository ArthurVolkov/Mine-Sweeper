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
        gGame.secsPassed++;
        if (gGame.secsPassed < 10) elTimer.innerText = '00' + gGame.secsPassed;
        else if (gGame.secsPassed < 100) elTimer.innerText = '0' + gGame.secsPassed;
        else elTimer.innerText = gGame.secsPassed;
    }, 1000)
}