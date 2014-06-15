var gameInterval = 100;
var pause = true;
var gridSize = 10;
var width = 800 / gridSize;
var height = 500 / gridSize;
var grid = [[]];
var canvas = document.getElementById('canvasElement');
var ctx = canvas.getContext('2d');

canvas.addEventListener('mousedown', draw, false);
canvas.addEventListener('mouseup', stopdraw, false);

var deadCells = [];
var lifeCells = [];

initializeGrid();

$(document).mousemove(function(e){
    mouseX = e.pageX - canvas.offsetLeft;
    mouseY = e.pageY - canvas.offsetTop;
});

function draw(){
    x=Math.floor(mouseX/gridSize);
    y=Math.floor(mouseY/gridSize);
    if(x>=0&&x<width&&y>=0&&y<=height){
        if ( grid[x][y] ) {
            shouldcreate = false;
        }else{
            shouldcreate = true;
        }
        t = setInterval(function(){
            x=Math.floor(mouseX/gridSize);
            y=Math.floor(mouseY/gridSize);
            if ( shouldcreate ) {
                drawSquareAt(x,y);
            }else{
                killSquareAt(x,y);
            }
        }, 10);
    }
}

function stopdraw(e){
    clearInterval(t);
}

drawSquareAt = function(x,y){
    if(x>=0&&x<width&&y>=0&&y<=height){
        grid[x][y] = 1;
        x *= gridSize;
        y *= gridSize;
        ctx.fillStyle = "rgba(0, 0, 0, 1)";  
        ctx.fillRect (x,y,gridSize,gridSize);
    }
}

killSquareAt = function(x,y){
    if(x>=0&&x<width&&y>=0&&y<=height){    
        grid[x][y] = 0;
        x *= gridSize;
        y *= gridSize;
        ctx.fillStyle = "rgba(255, 255, 255, 1)";  
        ctx.fillRect (x,y,gridSize,gridSize);
    }
}

function initializeGrid(){
    for (var x=0; x<width; x++){
        grid[x]=[];
        for (var y=0; y<height; y++){
            grid[x][y]=0;
        }
    }
}

startGame = function(x,y){
    for (var i=0; i<width; i++){
        for (var j=0; j<height; j++){
            checkNeighbors(i,j);
        }
    }
    for (var i = 0; i<lifeCells.length; i++){
        drawSquareAt(lifeCells[i][0],lifeCells[i][1])
    }
    lifeCells=[];
    for (var i = 0; i<deadCells.length; i++){
        killSquareAt(deadCells[i][0],deadCells[i][1])
    }
    deadCells=[];
}

checkNeighbors = function(x,y){
    var cellsAround = [[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]];
    var count = 0;
    for (var i = 0; i < 8; i++){
        xpart=x+cellsAround[i][0];
        ypart=y+cellsAround[i][1];
        if ( xpart < 0 || ypart < 0 || xpart >= width || ypart >= height ){
            continue;
        }
        count += grid[xpart][ypart];
    }
    if ( count < 2 && grid[x][y] || count > 3 && grid[x][y]){
        deadCells.push([x,y]);
    }
    if ( count == 3 ){
        lifeCells.push([x,y]);
    }
    return count;
}

function playGame(){
    startGame();
    if (pause){
        setTimeout(function(){playGame()},gameInterval);
    }
}


$('#start').click(function(){
   pause = true;
   playGame();
})