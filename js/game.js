'use strict';

const MINE = '💣';
const FLAG = '🚩';
const NORMAL = '😀';
const LOSE = '🤯';;
const WIN = '😎';
const HINTS = '💡';

//the globals: 1-board-model -- 2- level -- game state
var gBoard;
var gLevel = { SIZE: 4, MINES: 2 };
var gGameState = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0, livesLeft: 0, hintsLeft: 0, safeClickLeft: 0, isRandomMine: true };
var gameOverTimeOut;
var gTimerStart;
var gTimeInterval;
var isFirstMove;
var isHintOn;
var isSafeOn;
var gHintTimeOut;
var gSafeTimeOut;


function init() {
    console.log('game init');
    gBoard = buildBoard(gLevel.SIZE);
    gGameState.isOn = true;
    gGameState.shownCount = 0;
    gGameState.markedCount = 0;
    gGameState.secsPassed = 0;
    gGameState.livesLeft = 3;
    gGameState.hintsLeft = 3;
    gGameState.safeClickLeft = 3;
    isHintOn = false;
    isSafeOn = false;
    if (gLevel.SIZE === 4) gGameState.livesLeft = 2;
    isFirstMove = true;
    updateScore(gLevel.MINES);
    getLocalStoarge()
    updateLive(gGameState.livesLeft);
    renderBoard(gBoard);
}

//this func get size of board and build the board model
function buildBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            var cell = { minesAroundCount: null, isShown: false, isMine: false, isMarked: false, pos: { i: i, j: j } };
            board[i][j] = cell;
        }
    }
    return board;
}

//the fucntion is set ech cell object in the model with the correct number of mines around him
function setMinesNegsCount(gBoard) {
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];
            var mineCount = mineNegsCount(cell.pos);
            cell.minesAroundCount = mineCount;
        }
    }
}

//this func will render the board model to the dom inside the table
function renderBoard(gboard) {
    var strHTML = '';
    for (var i = 0; i < gboard.length; i++) {
        strHTML += `<tr class="mines-row" >`
        for (var j = 0; j < gboard[0].length; j++) {
            //get cell model and option to update class/ inner text in advance- for now not in use
            var cell = gboard[i][j];
            var className = ``;
            var innerText = ``;
            strHTML += `<td data-pos="${i}-${j}" class="cell ${className}" 
            onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this, ${i}, ${j}); return false"> ${innerText}
            </td>\t`
        }
        strHTML += `</tr>\n`
    }
    var elmines = document.querySelector('.mines-body');
    elmines.innerHTML = strHTML;
}

//get the cell and update the model and after that render the dom
function cellClicked(el, i, j) {

    var cell = gBoard[i][j];
    if (gGameState.isOn === false) return
    if (cell.isMarked === true) return
    if (isHintOn) {
        revealsNegsCellForSec(el, i, j);
        isHintOn = false;
        return;
    }

    if (cell.isShown && cell.isMine) return;

    cell.isShown = true;
    gGameState.shownCount++;
    //handle start time
    if (!gTimeInterval) {
        gTimerStart = new Date();
        gTimeInterval = setInterval(updateTime, 1000);
    }

    if (isFirstMove) {
        cell.minesAroundCount = 0;
        if (gGameState.isRandomMine) {
            setRandomMines(i, j);
        }
        setMinesNegsCount(gBoard);
        isFirstMove = false;
    }

    if (cell.minesAroundCount === 0 && cell.isMine === false) {
        expandShown(cell);
    }

    renderCellReveals(cell)
    checkGameOver(cell);
    checkVictory();
}

//function to add the css class and render the cell to the dom with the amount of mine around the cell
function renderCellReveals(cell) {

    var elCell = document.querySelector(`td[data-pos="${cell.pos.i}-${cell.pos.j}"]`)
    if (cell.isMine === true) {
        elCell.innerText = MINE;
        elCell.classList.add('mine-game');
    } else if (cell.minesAroundCount === 0) {
        elCell.classList.add(`negs${cell.minesAroundCount}`);
    } else {
        elCell.classList.add(`negs${cell.minesAroundCount}`);
        elCell.innerText = cell.minesAroundCount;
    }

}

//update the model cell to marked and render the dom (add flag class)
function cellMarked(el, i, j) {
    if (gGameState.isOn === false) return
    if (!gTimeInterval) {
        gTimerStart = new Date();
        gTimeInterval = setInterval(updateTime, 1000);
    }
    var cell = gBoard[i][j];
    if (cell.isShown) return;
    if (cell.isMarked) {
        cell.isMarked = false;
        gGameState.markedCount--;
        updateScore(gLevel.MINES - gGameState.markedCount);
        el.innerText = '';
    } else {
        cell.isMarked = true;
        gGameState.markedCount++;
        updateScore(gLevel.MINES - gGameState.markedCount);
        el.innerText = FLAG;
    }
    el.classList.toggle('flag');
    checkVictory();
}

//update the level and init the game again
function levelChange(event) {

    var boardSize = event.target.value;
    //update the game state
    switch (boardSize) {
        case '4':
            gLevel = { SIZE: 4, MINES: 2 };
            newGame()
            break;
        case '8':
            gLevel = { SIZE: 8, MINES: 12 };
            newGame()
            break;
        case '12':
            gLevel = { SIZE: 12, MINES: 30 };
            newGame()
            break;
        default:
            break;
    }

}

//cheack for game over if we click on mine
function checkGameOver(cell) {
    if (cell.isMine && gGameState.livesLeft > 1) {
        //update model and dom
        updateLive(gGameState.livesLeft - 1);
        alert(`be careful it was a mine ${gGameState.livesLeft} lives left `)
    } else if (cell.isMine) {
        updateLive(gGameState.livesLeft - 1);
        gGameState.isOn = false
        gameOverTimeOut = setTimeout(resetMeassage, 300)
        var elCell = document.querySelector(`td[data-pos="${cell.pos.i}-${cell.pos.j}"]`)
        revealAllMines();
        elCell.classList.remove('mine-game');
        elCell.classList.add('mine-game-over');
        stopTime()
        var elSmile = document.querySelector('.smile span');
        elSmile.innerText = LOSE;
    }
}

function resetMeassage() {
    //handle game over time out
    alert('game over');
    clearTimeout(gameOverTimeOut);
    gameOverTimeOut = null
}

//handle the click of the smiley for new game
function newGame() {
    stopTime()
    var elSpan = document.querySelector('.time span');
    elSpan.innerText = '';
    var elSmile = document.querySelector('.smile span');
    elSmile.innerText = NORMAL;
    init();
}

//function check if victory
function checkVictory() {
    //check the model for victory
    var count = 0;
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];
            count++;
            if ((cell.isMine === true && gBoard[i][j].isMarked === true) || (cell.isMine === false && cell.isShown === true)) {
                continue
            } else if (((cell.isMine === true && gBoard[i][j].isMarked === false && gGameState.livesLeft > 0)
                || (cell.isMine === false && cell.isShown === true)) && (cell.isMarked === true || cell.isShown === true)) {
                continue
            } else {
                return;
            }
        }
    }
    alert('victory');
    stopTime()
    var elSmile = document.querySelector('.smile span');
    elSmile.innerText = WIN;
    updateLocalStorage()
}

//open all the mines if game over
function revealAllMines() {
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];
            if (cell.isMine) {
                renderCellReveals(cell)
            }
        }
    }
}

//when we got cell with 0 mine negs- we reveal all negs (render the dom)
function expandShown(cell) {
    var pos = cell.pos;
    for (let i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === pos.i && j === pos.j) continue
            //get the cell
            var currCell = gBoard[i][j];
            if (currCell.isMarked === true) continue
            //update the model shown;
            currCell.isShown = true;
            gGameState.shownCount++;
            //update the dom
            renderCellReveals(currCell);
        }
    }
}

function updateLive(liveRemain) {
    //update the model
    gGameState.livesLeft = liveRemain;
    //render the dom
    var elLive = document.querySelector('.lives span')
    elLive.innerText = `${gGameState.livesLeft} lives left`;
}

//updae the local storage with best score
function updateLocalStorage() {
    //adding to local storage
    var level = gLevel.SIZE;
    //update the game state
    switch (level) {
        case 4:
            var currBest = localStorage.getItem("bestScoreEasy")
            if (!currBest) localStorage.setItem("bestScoreEasy", `${gGameState.secsPassed}`);
            if (gGameState.secsPassed < currBest) {
                localStorage.setItem("bestScoreEasy", `${gGameState.secsPassed}`);
            }
            break;
        case 8:
            var currBest = localStorage.getItem("bestScoreMedium")
            if (!currBest) localStorage.setItem("bestScoreMedium", `${gGameState.secsPassed}`);
            if (gGameState.secsPassed < currBest) {
                localStorage.setItem("bestScoreMedium", `${gGameState.secsPassed}`);
            }
            break;
        case 12:
            var currBest = localStorage.getItem("bestScoreHard")
            if (!currBest) localStorage.setItem("bestScoreHard", `${gGameState.secsPassed}`);
            if (gGameState.secsPassed < currBest) {
                localStorage.setItem("bestScoreHard", `${gGameState.secsPassed}`);
            }
            break;
        default:
            break;
    }


}

//function to get best local storage according to the level
function getLocalStoarge() {
    //adding to local storage
    var level = gLevel.SIZE;
    var elBestScore = document.querySelector('.time p')
    //update the game state
    switch (level) {
        case 4:
            var currBest = localStorage.getItem("bestScoreEasy")
            if (!currBest) {
                elBestScore.innerText = 'First game';
            } else {
                elBestScore.innerText = `Best Score: ${currBest}`;
            }
            break;
        case 8:
            var currBest = localStorage.getItem("bestScoreMedium")
            if (!currBest) {
                elBestScore.innerText = 'First game';
            } else {
                elBestScore.innerText = `Best Score: ${currBest}`
            }
            break;
        case 12:
            var currBest = localStorage.getItem("bestScoreHard")
            if (!currBest) {
                elBestScore.innerText = 'First game';
            } else {
                elBestScore.innerText = `Best Score: ${currBest}`
            }
            break;
        default:
            break;
    }
}

//function to toggle the hint and put the hint count down
function hint() {
    if (gGameState.hintsLeft > 0) {
        isHintOn = true;
        gGameState.hintsLeft--;
        alert(`${gGameState.hintsLeft} Hint Left`)
    } else {
        alert(` You dont have more Hints`)
    }
}

//function to toggle the hint and put the hint count down
function safeClick() {
    if (gGameState.safeClickLeft > 0 && !gSafeTimeOut) {
        isSafeOn = true;
        gGameState.safeClickLeft--;
        alert(`${gGameState.safeClickLeft} Safe Left`)
    } else {
        alert(` You dont have more Safe or you are already using safe cell`)
        return;
    }

    if (isSafeOn) {
        markRandomForFewSec()
        isSafeOn = false;
        return;
    }
}

//function to change the state of scattering mine (user/ randomly)
function scatteringMine(event) {
    var choose = event.target.value;
    gGameState.isRandomMine = (choose === 'random') ? true : false;
    newGame();
}

//func to get the user set mine and change the modal of mine
function changeMineModel(td, i, j) {
    var isUserWantMine = td.checked
    //update the model
    gBoard[i][j].isMine = isUserWantMine

    //update the model set count
    setMinesNegsCount(gBoard);

}





