'use strict';

const MINE = '💣';
const FLAG = '🚩';

//the globals: 1-board-model -- 2- level -- game state
var gBoard;
var gLevel = { SIZE: 4, MINES: 2 };
var gGameState;


function init() {
    console.log('game init');
    gBoard = buildBoard(gLevel.SIZE);
    setRandomMines(gLevel);
    gGameState = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 };
    setMinesNegsCount(gBoard);
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
    console.log(strHTML);
    var elmines = document.querySelector('.mines-body');
    elmines.innerHTML = strHTML;
}

//get the cell and update the model and after that render the dom
function cellClicked(el, i, j) {
    var cell = gBoard[i][j];
    cell.isShown = true;
    renderCellReveals(cell)
}

//function to add the css class and render the cell to the dom with the amount of mine around the cell
function renderCellReveals(cell) {
    var elCell = document.querySelector(`td[data-pos="${cell.pos.i}-${cell.pos.j}"]`)
    if (cell.isMine === true) {
        elCell.classList.add('mine');
        elCell.innerText = MINE;
    } else {
        elCell.classList.add(`negs${cell.minesAroundCount}`);
        elCell.innerText = cell.minesAroundCount;
    }
    console.log(elCell);
}

//update the model cell to marked and render the dom (add flag class)
function cellMarked(el, i, j) {
    var cell = gBoard[i][j];
    if (cell.isShown) return;
    if (cell.isMarked) {
        cell.isMarked = false;
        el.innerText = '';
    } else {
        cell.isMarked = true;
        el.innerText = FLAG;
    }
    el.classList.toggle('flag');
}

function levelChange(event) {

    var boardSize = event.target.value;
    console.log(boardSize);
    //update the game state
    switch (boardSize) {
        case '4':
            console.log('change to 4');
            gLevel = { SIZE: 4, MINES: 2 };
            init()
            break;
        case '8':
            console.log('change to 8');
            gLevel = { SIZE: 8, MINES: 12 };
            init()
            break;
        case '12':
            console.log('change to 12');
            gLevel = { SIZE: 12, MINES: 30 };
            init()
            break;
        default:
            break;
    }

}


