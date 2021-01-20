'use strict';

//regular function to count mine negs;
function mineNegsCount(pos) {
    var minesAround = 0;
    for (let i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === pos.i && j === pos.j) continue
            var currCell = gBoard[i][j];
            if (currCell.isMine === true) {
                minesAround++;
            }
        }
    }
    return minesAround;
}

//regular func to randomly set the numbers of mines
function setRandomMines() {
    for (let i = 0; i < gLevel.MINES; i++) {
        setRandomMine();
    }
}

//func to set random mine
function setRandomMine() {
    var randomRow = getRandomInt(0, gLevel.SIZE);
    var randomCol = getRandomInt(0, gLevel.SIZE);
    if (gBoard[randomRow][randomCol].isMine === false) {
        gBoard[randomRow][randomCol].isMine = true;
    } else setRandomMine()
}

//get random int func not include max
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}