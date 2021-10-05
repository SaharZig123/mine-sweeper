'use strict'
const MINE = '💣'
const MARKED_CELL = '🚩'
var gboard = []
var gLevel = {
  size: 8,
  mines: 12,
  lives: 3,
}
var gGame = {
  isOn: false,
  showenCount: 0,
}
var gHintCounter = 3
var gSafeClick = 3
var gLives = +gLevel.lives
var gStepsArray = []
var gMineExplode = 0
var gRightMark = 0
var gIsOnInterval
var gHintMode = false

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

      strHtml += `<td id="${tdId}" class="cell " onmousedown="markedCell(event,this,${i},${j})"  onclick="cellClicked(this,${i},${j})"></td>`
    }
    strHtml += '</tr>'
  }
  var elMat = document.querySelector('.board')
  elMat.innerHTML = strHtml
}

function cellClicked(elCell, posI, posJ) {
  if (gLives === 0 && !gGame.isOn) return
  if (gboard[posI][posJ].isMarked) return
  if (gboard[posI][posJ].isShowen) return
  if (clickIsMine(elCell, posI, posJ)) return
  if (gboard[posI][posJ].isMarked) return
  if (gHintMode) {
    expandForSec(gboard, posI, posJ)
    return
  }
  gGame.isOn = true
  start()
  var elEmoji = document.querySelector('.btnEmoji')
  elEmoji.innerText = '😊'
  gboard[posI][posJ].isShowen = true
  elCell.classList.remove('cell')
  elCell.classList.add('cell2')
  if (gboard[posI][posJ].minesAroundCount === 0) {
    elCell.classList.add('showenCells')
    expandShowen(gboard, posI, posJ)

    return
  }
  if (gboard[posI][posJ].minesAroundCount > 0) {
    elCell.innerText = gboard[posI][posJ].minesAroundCount
    cellsColor(gboard[posI][posJ], elCell)
  }
}

function checkGameOver() {
  if (gRightMark + gMineExplode === gLevel.mines) {
    var elH2 = document.querySelector('h2')
    var elEmoji = document.querySelector('.btnEmoji')
    elEmoji.innerText = '😎'
    elH2.innerText = 'Winner!'
    elH2.style.opacity = 100
    gGame.isOn = false
    pause()
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
        cellsColor(board[i][j], elNegs)
        elNegs.classList.remove('cell')
        elNegs.classList.add('cell2')
      } else {
        elNegs.classList.add('showenCells')
        elNegs.classList.remove('cell')
        elNegs.classList.add('cell2')
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
  if (ev.which === 3) {
    if (gGame.isOn) {
      var position = getCellPosition(elCell.id)
      if (gboard[position.i][position.j].isShowen) return
      if (gboard[position.i][position.j].isMarked) {
        gboard[position.i][position.j].isMarked = false
        elCell.innerText = ' '
        gGame.markedCount--
        if (gboard[position.i][position.j].isMine) gRightMark--
      } else {
        gboard[position.i][position.j].isMarked = true
        elCell.innerText = MARKED_CELL
        gGame.markedCount++
        if (gboard[position.i][position.j].isMine) {
          gRightMark++
          checkGameOver()
        }
      }
    }
  }
}

function getCellPosition(strCellId) {
  var parts = strCellId.split('-')
  var pos = { i: +parts[1], j: +parts[2] }
  return pos
}

function getLevel(elBtn) {
  gLevel.size = +elBtn.getAttribute('data-size')
  gLevel.mines = +elBtn.getAttribute('data-mines')
  gLevel.lives = +elBtn.getAttribute('data-lives')
  startNewGame()
  console.log(gLevel)
}

function clickIsMine(elCell, posI, posJ) {
  if (gboard[posI][posJ].isMine && !gboard[posI][posJ].isShowen) {
    if (gHintMode) {
      expandForSec(gboard, posI, posJ)
      return
    }

    gboard[posI][posJ].isShowen = true
    gLives--
    gMineExplode++
    var elEmoji = document.querySelector('.btnEmoji')
    elEmoji.innerText = '😮'
    var elLives = document.querySelector('.lives')
    switch (gLives) {
      case 2:
        elLives.innerText = '💖💖'
        break
      case 1:
        elLives.innerText = '💖'
        break
      case 0:
        elLives.innerText = ''
    }
    if (gLives > 0) {
      console.log('gLives', gLives)
      elCell.innerText = MINE
      checkGameOver()
      return 1
    }
    elCell.innerText = MINE
    var elH2 = document.querySelector('h2')
    elH2.innerText = 'You Lose 😣😣'
    elEmoji.innerText = '😭'
    elH2.style.opacity = 100
    gGame.isOn = false
    pause()
    return 1
  }
}

function startNewGame() {
  gboard = []
  gLives = gLevel.lives
  reset()
  gHintCounter = 3
  gSafeClick = 3
  var elHint = document.querySelector('.hint')
  elHint.innerText = `💡X${gHintCounter}`
  var elBtn = document.querySelector('.safeBtn')
  elBtn.innerText = `Safe Button X${gSafeClick}`
  var elEmoji = document.querySelector('.btnEmoji')
  elEmoji.innerText = '😊'
  var elLives = document.querySelector('.lives')
  elLives.innerText = gLives === 1 ? '💖' : '💖💖💖'
  var elH2 = document.querySelector('h2')
  elH2.innerText = ' '
  gRightMark = 0
  gMineExplode = 0
  buildBoard(gLevel.size, gboard)
  renderBoard(gboard)
}

function cellsColor(cell, elcell) {
  if (cell.minesAroundCount === 1) {
    elcell.classList.add('color1')
  }
  if (cell.minesAroundCount === 2) {
    elcell.classList.add('color2')
  }
  if (cell.minesAroundCount === 3) {
    elcell.classList.add('color3')
  }
  if (cell.minesAroundCount >= 4) {
    elcell.classList.add('color4')
  }
}

function hint() {
  var elHint = document.querySelector('.hint')
  if (gHintMode === true) {
    gHintMode = false
  }
  if (gHintCounter != 0) {
    var elCell = document.querySelector('.board')
    elCell.classList.add('hintCrusor')
    gHintMode = true
    gHintCounter--
    if (gHintCounter === 0) {
      elHint.innerText = '🤐'
      return
    }
    elHint.innerText = `💡X${gHintCounter}`
  } else {
    return
  }
}

function expandForSec(board, cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= board[i].length) continue
      var elNegs = document.querySelector(`#cell-${i}-${j}`)
      if (board[i][j].isMine) {
        elNegs.innerText = MINE
      } else {
        elNegs.innerText = board[i][j].minesAroundCount
      }
      elNegs.classList.add('hintCells')
    }
  }
  setTimeout(() => {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
      if (i < 0 || i >= board.length) continue
      for (var j = cellJ - 1; j <= cellJ + 1; j++) {
        if (j < 0 || j >= board[i].length) continue
        var elNegs = document.querySelector(`#cell-${i}-${j}`)
        elNegs.classList.remove('hintCells')
        if (board[i][j].isShowen) {
          if (board[i][j].isMine) {
            elNegs.innerText = MINE
            continue
          }
          elNegs.innerText = board[i][j].minesAroundCount
        } else {
          elNegs.innerText = ' '
        }
      }
    }
    var elCell = document.querySelector('.board')
    elCell.classList.remove('hintCrusor')
    gHintMode = false
  }, 1000)
}

function safeClickButton() {
  if (gSafeClick > 0) {
    var randomI = getRandomInt(0, gboard.length)
    var randomJ = getRandomInt(0, gboard.length)
    if (gboard[randomI][randomJ].isShowen) {
      safeClickButton(gboard)
    } else if (gboard[randomI][randomJ].isMine) {
      safeClickButton(gboard)
    } else {
      gSafeClick--
      var elBtn = document.querySelector('.safeBtn')
      elBtn.innerText = `Safe Button X${gSafeClick}`
      var elcell = document.querySelector(`#cell-${randomI}-${randomJ}`)
      elcell.classList.add('safeButton')
      setTimeout(() => {
        elcell.classList.remove('safeButton')
      }, 1000)
    }
  }
}
