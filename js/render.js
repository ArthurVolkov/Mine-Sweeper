'use strict'

function renderStart() {
    var elTimer = document.querySelector('.timer');
    var elFlags = document.querySelector('.flags');
    var elSmyle = document.querySelector('.smyle');
    var elLives = document.querySelector('.lives');
    var elHints = document.querySelectorAll('.hints');
    var elSafe = document.querySelector('.safe-count');
    var elScoreBeginner = document.querySelector('.beginner-score span');
    var elScoreMedium = document.querySelector('.medium-score span');
    var elScoreExpert = document.querySelector('.expert-score span');
    var elToggles = document.querySelectorAll('.toggle')

    var elIfUndo = document.querySelector('.toggle-undo')
    var elIfSafe = document.querySelector('.toggle-safe')
    var elIfHints = document.querySelector('.toggle-hints')
    var elIfLives = document.querySelector('.toggle-lives')

    for (var i = 0; i < elHints.length; i++) {
        elHints[i].innerText = HINT;
        elHints[i].setAttribute('onclick', 'hint(this)')
    }
    for (var i = 0; i < elToggles.length; i++) {
        elToggles[i].innerText = '❌';
    }

    elTimer.innerText = '000'
    elFlags.innerText = gGame.flagsLeft + MARK + ' ';
    elSmyle.innerHTML = SMYLE;
    elLives.innerText = LIVE.repeat(3);
    elSafe.innerText = gGame.safeClick;
    elScoreBeginner.innerText = (localStorage.beginer === undefined) ? '0' : localStorage.beginer;
    elScoreMedium.innerText = (localStorage.medium === undefined) ? '0' : localStorage.medium;
    elScoreExpert.innerText = (localStorage.expert === undefined) ? '0' : localStorage.expert;
    elIfUndo.innerText = '❌';
    elIfSafe.innerText = '❌';
    elIfHints.innerText = '❌';
    elIfLives.innerText = '❌';
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
                        oncontextmenu="cellMarked(${i}, ${j}); return false">${toShow}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML = strHTML;
}