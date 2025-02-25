let gameField = new Array()
let board = document.getElementById("game-table")
let currentCol
let currentRow
let currentPlayer
let id = 1

newgame();

function newgame(){
  prepareField()
  placeDisc(Math.floor(Math.random()*2)+1)
}

function checkForVictory(row,col){
  if(getAdj(row,col,0,1)+getAdj(row,col,0,-1) > 2){
    return true
  } else {
    if(getAdj(row,col,1,0) > 2){
      return true
    } else {
      if(getAdj(row,col,-1,1)+getAdj(row,col,1,-1) > 2){
        return true
      } else {
        if(getAdj(row,col,1,1)+getAdj(row,col,-1,-1) > 2){
          return true
        } else {
          return false
        }
      }
    }
  }
}

function getAdj(row,col,row_inc,col_inc){
  if(cellVal(row,col) == cellVal(row+row_inc,col+col_inc)){
    return 1+getAdj(row+row_inc,col+col_inc,row_inc,col_inc)
  } else {
    return 0
  }
}

function cellVal(row,col){
  if(gameField[row] == undefined || gameField[row][col] == undefined){
    return -1
  } else {
    return gameField[row][col]
  }
}

function firstFreeRow(col,player){
  for(let i = 0; i<6; i++){
    if(gameField[i][col]!=0){
      break
    }
  }
  gameField[i-1][col] = player
  return i-1
}

function possibleColumns(){
  let moves_array = new Array()
  for(let i=0; i<7; i++){
    if(gameField[0][i] == 0){
      moves_array.push(i)
    }
  }
  return moves_array
}

function think(){
  let possibleMoves = possibleColumns()
  let aiMoves = new Array()
  let blocked
  let bestBlocked = 0
  
  for(let i=0; i<possibleMoves.length; i++){
    for(let j=0; j<6; j++){
      if(gameField[j][possibleMoves[i]] != 0){
        break
      }
    }
    
    gameField[j-1][possibleMoves[i]] = 1
    blocked = getAdj(j-1,possibleMoves[i],0,1)+getAdj(j-1,possibleMoves[i],0,-1)
    blocked = Math.max(blocked,getAdj(j-1,possibleMoves[i],1,0))
    blocked = Math.max(blocked,getAdj(j-1,possibleMoves[i],-1,1))
    blocked = Math.max(blocked,getAdj(j-1,possibleMoves[i],1,1)+getAdj(j-1, possibleMoves[i],-1,-1))
    
    if(blocked >= bestBlocked){
      if(blocked>bestBlocked){
        bestBlocked = blocked
        aiMoves = new Array()
      }
      aiMoves.push(possibleMoves[i])
    }
    gameField[j-1][possibleMoves[i]] = 0
  }
  
  return aiMoves
}

function Disc(player){
  this.player = player
  this.color = player == 1 ? 'red' : 'yellow'
  this.id = id.toString()
  id++
  
  this.addToScene = function(){
    board.innerHTML += '<div id="d'+this.id+'" class="disc '+this.color+'"></div>'
    if(currentPlayer==2){
      let possibleMoves = think()
      let cpuMove = Math.floor( Math.random() * possibleMoves.length)
      currentCol = possibleMoves[cpuMove]
      document.getElementById('d'+this.id).style.left = (14+60*currentCol)+"px"
      dropDisc(this.id,currentPlayer)
    }
  }
  
  let $this = this;
  document.onmousemove = function(evt){
    if(currentPlayer == 1){
    currentCol = Math.floor((evt.clientX - board.offsetLeft)/60)
    if(currentCol<0){currentCol=0}
    if(currentCol>6){currentCol=6}
    document.getElementById('d'+$this.id).style.left = (14+60*currentCol)+"px"
    document.getElementById('d'+$this.id).style.top = "-55px"
    }
  }
  document.onload = function(evt){
    if(currentPlayer == 1){
    currentCol = Math.floor((evt.clientX - board.offsetLeft)/60)
    if(currentCol<0){currentCol=0}
    if(currentCol>6){currentCol=6}
    document.getElementById('d'+$this.id).style.left = (14+60*currentCol)+"px"
    document.getElementById('d'+$this.id).style.top = "-55px"
    }
  }
  
  document.onclick = function(evt){
    if(currentPlayer == 1){
      if(possibleColumns().indexOf(currentCol) != -1){
        dropDisc($this.id,$this.player)
      }
    }
  }
}

function dropDisc(cid,player){
  currentRow = firstFreeRow(currentCol,player);
  moveit(cid,(14+currentRow*60))
  currentPlayer = player
  checkForMoveVictory()
}

function checkForMoveVictory(){
  if(!checkForVictory(currentRow,currentCol)){
    placeDisc(3-currentPlayer)
  } else {
    let ww = currentPlayer == 2 ? 'Computer' : 'Player'
    placeDisc(3-currentPlayer)
    alert(ww+" win!")
    board.innerHTML = ""
    newgame();
  }
}

function placeDisc(player){
  currentPlayer = player
  let disc = new Disc(player)
  disc.addToScene()
}

function prepareField(){
  gameField = new Array()
  for(let i=0; i<6; i++){
    gameField[i] = new Array()
    for(let j=0; j<7; j++){
      gameField[i].push(0)
    }
  }
}

function moveit(who,where){
    document.getElementById('d'+who).style.top = where+'px'
}