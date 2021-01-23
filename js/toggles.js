'use strict'

function undoToggle(elCell) {
    if (gGame.ifUndo) {
        gGame.ifUndo = false;
        elCell.innerText = '❌';
    }
    else {
        gGame.ifUndo = true;
        elCell.innerText = '✅';
    }
}


function safeToggle(elCell) {
    if (gGame.ifSafe) {
        gGame.ifSafe = false;
        elCell.innerText = '❌';
    }
    else {
        gGame.ifSafe = true;
        elCell.innerText = '✅';
    }
}


function hintsToggle(elCell) {
    if (gGame.ifHints) {
        gGame.ifHints = false;
        elCell.innerText = '❌';
    }
    else {
        gGame.ifHints = true;
        elCell.innerText = '✅';
    }
}


function livesToggle(elCell) {
    if (gGame.ifLives) {
        gGame.ifLives = false;
        elCell.innerText = '❌';
    }
    else {
        gGame.ifLives = true;
        elCell.innerText = '✅';
    }
}