function printMat(mat, selector) {
  var strHTML = '<table border="0"><tbody>'
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j]
      var className = 'cell cell' + i + '-' + j
      strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>'
  var elContainer = document.querySelector(selector)
  elContainer.innerHTML = strHTML
}

function createMat(ROWS, COLS) {
  var mat = []
  for (var i = 0; i < ROWS; i++) {
    var row = []
    for (var j = 0; j < COLS; j++) {
      row.push('')
    }
    mat.push(row)
  }
  return mat
}

function shuffle(items) {
  var randIdx, keep, i
  for (i = items.length - 1; i > 0; i--) {
    randIdx = getRandomInt(0, items.length - 1)
    keep = items[i]
    items[i] = items[randIdx]
    items[randIdx] = keep
  }
  return items
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`)
  elCell.innerHTML = value
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

function getRandomColor() {
  var r = Math.floor(Math.random() * 255)
  var g = Math.floor(Math.random() * 255)
  var b = Math.floor(Math.random() * 255)
  return 'rgb(' + r + ',' + g + ',' + b + ')'
}

function createMat(ROWS, COLS) {
  var mat = []
  for (var i = 0; i < ROWS; i++) {
    var row = []
    for (var j = 0; j < COLS; j++) {
      row.push('')
    }
    mat.push(row)
  }
  return mat
}

function countNeighbors(cellI, cellJ, mat) {
  var neighborsCount = 0
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= mat.length) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= mat[i].length) continue
      if (i === cellI && j === cellJ) continue
      if (mat[i][j] === LIFE || mat[i][j] === SUPER_LIFE) neighborsCount++
      // if (mat[i][j]) neighborsCount++;
    }
  }
  return neighborsCount
}




var hour = 0
var minute = 0
var second = 0
var millisecond = 0

var cron

function start() {
  pause()
  cron = setInterval(() => {
    timer()
  }, 10)
}

function pause() {
  clearInterval(cron)
}

function reset() {
  pause()
  hour = 0
  minute = 0
  second = 0
  millisecond = 0
  document.getElementById('hour').innerText = '00'
  document.getElementById('minute').innerText = '00'
  document.getElementById('second').innerText = '00'
  document.getElementById('millisecond').innerText = '000'
}

function timer() {
  if ((millisecond += 10) == 1000) {
    millisecond = 0
    second++
  }
  if (second == 60) {
    second = 0
    minute++
  }
  if (minute == 60) {
    minute = 0
    hour++
  }
  document.getElementById('hour').innerText = returnData(hour)
  document.getElementById('minute').innerText = returnData(minute)
  document.getElementById('second').innerText = returnData(second)
  document.getElementById('millisecond').innerText = returnData(millisecond)
}

function returnData(input) {
  return input > 10 ? input : `0${input}`
}
