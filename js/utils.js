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
function setRandomMines(row, col) {
    for (let i = 0; i < gLevel.MINES; i++) {
        setRandomMine(row, col);
    }
}

//func to set random mine
function setRandomMine(row, col) {
    var randomRow = getRandomInt(0, gLevel.SIZE);
    var randomCol = getRandomInt(0, gLevel.SIZE);
    if (gBoard[randomRow][randomCol].isMine === false && isMinePossible(row, col, randomRow, randomCol)) {
        gBoard[randomRow][randomCol].isMine = true;
    } else setRandomMine(row, col)
}

//make sure not to put  mine around the first click which is set to 0 return true if possible else return false
function isMinePossible(row, col, randomRow, randomCol) {
    // console.log(`the pos is: ${pos} ===row is ${randomRow} and col is ${randomCol}`)
    for (let i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            var currCell = gBoard[i][j];
            if (currCell.pos.i === randomRow && currCell.pos.j === randomCol) {
                return false
            }
        }
    }
    return true;
}

//get random int func not include max
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

//random function to update time 
function updateTime() {
    var currTime = new Date();
    var diffrent = Math.floor((currTime - gTimerStart) / 1000);
    gGameState.secsPassed = diffrent;
    //update the dom
    var elspan = document.querySelector('.time span');
    elspan.innerText = diffrent;
}

//function to stop the time
function stopTime() {
    //hanle reset time
    clearTimeout(gTimeInterval);
    gTimeInterval = null;
}

//function to update score
function updateScore(score) {
    if (score < 0) return
    var elScore = document.querySelector('.score span');
    elScore.innerText = score;
}

