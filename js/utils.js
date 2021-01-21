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

//fucntion to reveal the cell for 1 sec
function revealsNegsCellForSec(el, row, col) {

    for (let i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            var currCell = gBoard[i][j];
            renderCellReveals(currCell)

        }
    }
    gHintTimeOut = setTimeout(removeRevealNegsAfterSec, 1000, el, row, col)
}

//funtion to remove the negs cell shown after 1 sec 
function removeRevealNegsAfterSec(el, row, col) {
    for (let i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            var currCell = gBoard[i][j];
            removeReveals(currCell)
        }
    }
    clearTimeout(gHintTimeOut);
    gHintTimeOut = null;
}

//function to remove the shown of cell in the dom only;
function removeReveals(cell) {
    var elCell = document.querySelector(`td[data-pos="${cell.pos.i}-${cell.pos.j}"]`)
    if (cell.isMine === true) {
        elCell.innerText = '';
        elCell.classList.remove(`mine-game`);
    } else if (cell.minesAroundCount === 0) {
        elCell.classList.remove(`negs${cell.minesAroundCount}`);
    } else {
        elCell.classList.remove(`negs${cell.minesAroundCount}`);
        elCell.innerText = '';
    }
}

//func to mark random cell without mine for few sec
function markRandomForFewSec() {
    //get random cell which is not mine till we have one

    var randomRow = getRandomInt(0, gLevel.SIZE);
    var randomCol = getRandomInt(0, gLevel.SIZE);
    if (gBoard[randomRow][randomCol].isMine === false && gBoard[randomRow][randomCol].isShown === false) {
        var random = gBoard[randomRow][randomCol];
        //revael the random cell- add class
        var elChooseCell = document.querySelector(`td[data-pos="${random.pos.i}-${random.pos.j}"]`)
        elChooseCell.classList.add(`safe-cell`);
        gSafeTimeOut = setTimeout(removeRandomSafe, 5000, random);
    } else {
        markRandomForFewSec();
    }
}

//remove the revael of random cell- remove the class class
function removeRandomSafe(randomPos) {
    var elChoose = document.querySelector(`td[data-pos="${randomPos.pos.i}-${randomPos.pos.j}"]`)
    elChoose.classList.remove(`safe-cell`);
    clearTimeout(gSafeTimeOut);
    gSafeTimeOut = null;
}

//func to give to the user to option to choose random mine
function userSetMine() {
    if (gGameState.isRandomMine === true) {
        alert('Please Select user choose mine for use this Buttom or you can click the smiley and start play')
        return;
    }
    if (gGameState.isOn === false) {
        alert('Need to restart the game click on the smiley to restart and after that put again mine in set mine buttom')
        return;
    }
    var strHTML = '';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += `<tr>`
        for (var j = 0; j < gBoard[0].length; j++) {
            //get cell model and option to update class/ inner text in advance- for now not in use
            strHTML += `<td>
            <div class="form-check">
            <input data-pos="${i}-${j}" onchange="changeMineModel(this, ${i}, ${j})"  class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                </div>  
                </td>\t`
        }
        strHTML += `</tr>\n`
    }
    var elmines = document.querySelector('.setMine tbody');
    elmines.innerHTML = strHTML;

    var elModal = document.querySelector('.setMine');
    elModal.classList.add('open');
    return;
}

//func to close the modal
function finish() {
    var elModal = document.querySelector('.setMine');
    elModal.classList.remove('open');
    // newGame();
}

