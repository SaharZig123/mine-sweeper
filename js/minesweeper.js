'use strict'
const MINE = '💣'
const MARKED_CELL = '🚩'
var gboard = []
var gLevel = {
  size: 4,
  mines: 2,
}
var gGame = {
  isOn: false,
  showenCount: 0,
  markedCount: 0,
}

function initGame() {
  buildBoard(gLevel.size, gboard)
  renderBoard(gboard)
}

function buildBoard(size, board) {
  for (var i = 0; i < size; i++) {
    board[i] = []
    for (var j = 0; j < size; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShowen: false,
        isMine: false,
        isMarked: false,
      }
    }
  }
  getRandomMineCell(board)
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      board[i][j].minesAroundCount = setMineNegsCount(i, j, board)
    }
  }
  console.log(board)
  return board
}

function setMineNegsCount(cellI, cellJ, mat) {
  var minesCount = 0
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= mat.length) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= mat[i].length) continue
      if (i === cellI && j === cellJ) continue
      if (mat[i][j].isMine) minesCount++
    }
  }
  return minesCount
}

function renderBoard(board) {
  var strHtml = ''
  for (var i = 0; i < board.length; i++) {
    strHtml += '<tr>'
    for (var j = 0; j < board.length; j++) {
      var tdId = `cell-${i}-${j}`

      strHtml += `<td id="${tdId}" class="cell hide" onmousedown="markedCell(event,this)"  onclick="cellClicked(this)"></td>`
    }
    strHtml += '</tr>'
  }
  var elMat = document.querySelector('.board')
  elMat.innerHTML = strHtml
}

function cellClicked(elCell) {
  var cellPos = getCellPosition(elCell.id)
  gboard[cellPos.i][cellPos.j].isShowen = true
  elCell.classList.remove('.hide')
  if (gboard[cellPos.i][cellPos.j].isMine) {
    elCell.innerText = MINE
    alert('Game Over')
    return
  }
  if (gboard[cellPos.i][cellPos.j].minesAroundCount === 0) {
    elCell.classList.add('showenCells')
    expandShowen(gboard, cellPos.i, cellPos.j)
    return
  }
  if (gboard[cellPos.i][cellPos.j].minesAroundCount > 0) {
    elCell.innerText = gboard[cellPos.i][cellPos.j].minesAroundCount
    elCell.classList.add('showenCells')
  }
}

function checkGameOver(board) {
  var rightFlagCounter=0
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      if (board[i][j].isMarked && board[i][j].isMine) rightFlagCounter++
      if(rightFlagCounter===gGame.mines) alert('You win!')
    }
  }
  
}

function expandShowen(board, cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= board[i].length) continue
      if (i === cellI && j === cellJ) continue
      board[i][j].isShowen = true
      var elNegs = document.querySelector(`#cell-${i}-${j}`)
      if (board[i][j].minesAroundCount > 0) {
        elNegs.innerText = board[i][j].minesAroundCount
        elNegs.classList.add('showenCells')
      } else {
        elNegs.classList.add('showenCells')
      }
    }
  }
}

function getRandomMineCell(board) {
  var counter = 0
  while (counter < gLevel.mines) {
    var randomI = getRandomInt(0, board.length)
    var randomJ = getRandomInt(0, board.length)
    if (board[randomI][randomJ].isMine) continue
    board[randomI][randomJ].isMine = true
    counter++
  }
}

function markedCell(ev, elCell) {
  var flagCounter = 0
  var position = getCellPosition(elCell.id)
  if (ev.which === 3) {
    if (gboard[position.i][position.j].isMarked) {
      gboard[position.i][position.j].isMarked = false
      elCell.innerText = ' '
      flagCounter--
    } else {
      gboard[position.i][position.j].isMarked = true
      elCell.innerText = MARKED_CELL
      flagCounter++
    }
    if (flagCounter === gGame.mines) {
      checkGameOver(gboard)
    }
  }
}

function getCellPosition(strCellId) {
  var parts = strCellId.split('-')
  var pos = { i: +parts[1], j: +parts[2] }
  return pos
}
