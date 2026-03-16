const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

let tile
let score = 0

let highscore = localStorage.getItem("pacmanHigh") || 0
document.getElementById("highscore").textContent = highscore


// SUURI PYSTYKARTTA
const map = [

[1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,3,2,2,2,2,1,1,2,2,2,2,3,1],
[1,2,1,1,2,2,2,2,2,2,1,1,2,1],
[1,2,2,2,2,1,1,1,1,2,2,2,2,1],
[1,2,1,2,1,1,2,2,1,1,2,1,2,1],
[1,2,2,2,2,2,2,2,2,2,2,2,2,1],
[1,2,1,1,2,1,1,1,1,2,1,1,2,1],
[1,2,2,2,2,2,2,2,2,2,2,2,2,1],
[1,1,1,2,1,1,2,2,1,1,2,1,1,1],
[1,2,2,2,2,2,2,2,2,2,2,2,2,1],
[1,2,1,1,2,1,1,1,1,2,1,1,2,1],
[1,2,2,2,2,2,2,2,2,2,2,2,2,1],
[1,2,1,2,1,1,2,2,1,1,2,1,2,1],
[1,2,2,2,2,1,1,1,1,2,2,2,2,1],
[1,2,1,1,2,2,2,2,2,2,1,1,2,1],
[1,3,2,2,2,2,1,1,2,2,2,2,3,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1]

]


function resize(){

let w = window.innerWidth * 0.9
let h = window.innerHeight * 0.75

canvas.width = w
canvas.height = h

// laskee ruudun koon niin että koko kenttä mahtuu
tile = Math.min(
    canvas.width / map[0].length,
    canvas.height / map.length
)

}

window.addEventListener("resize",resize)
resize()



// PACMAN
let pacman = {
x:1,
y:1,
dx:0,
dy:0,
mouth:0
}


// HAAMUT
let ghosts = [

{x:12,y:1,color:"red"},
{x:12,y:14,color:"pink"},
{x:1,y:14,color:"cyan"},
{x:7,y:8,color:"orange"}

]



// AUDIO
const audio = new AudioContext()

function beep(freq,time){

let osc = audio.createOscillator()
let gain = audio.createGain()

osc.connect(gain)
gain.connect(audio.destination)

osc.frequency.value = freq

osc.start()

gain.gain.setValueAtTime(0.1,audio.currentTime)
gain.gain.exponentialRampToValueAtTime(0.001,audio.currentTime+time)

osc.stop(audio.currentTime+time)

}



// PIIRRÄ KARTTA
function drawMap(){

for(let y=0;y<map.length;y++){

for(let x=0;x<map[y].length;x++){

if(map[y][x]===1){

let g = ctx.createLinearGradient(
x*tile,
y*tile,
x*tile,
y*tile+tile
)

g.addColorStop(0,"#3a6fff")
g.addColorStop(1,"#001b66")

ctx.fillStyle=g

ctx.fillRect(x*tile,y*tile,tile,tile)

}

if(map[y][x]===2){

ctx.fillStyle="white"

ctx.beginPath()

ctx.arc(
x*tile+tile/2,
y*tile+tile/2,
tile/10,
0,
Math.PI*2
)

ctx.fill()

}

if(map[y][x]===3){

ctx.fillStyle="orange"

ctx.beginPath()

ctx.arc(
x*tile+tile/2,
y*tile+tile/2,
tile/4,
0,
Math.PI*2
)

ctx.fill()

}

}

}

}



// PACMAN
function drawPacman(){

let a = 0.2 + Math.sin(pacman.mouth)*0.2

ctx.fillStyle="yellow"

ctx.beginPath()

ctx.arc(
pacman.x*tile+tile/2,
pacman.y*tile+tile/2,
tile/2.3,
a*Math.PI,
(2-a)*Math.PI
)

ctx.lineTo(
pacman.x*tile+tile/2,
pacman.y*tile+tile/2
)

ctx.fill()

pacman.mouth += 0.2

}



// HAAMU
function drawGhost(g){

let grad = ctx.createRadialGradient(
g.x*tile+tile/2,
g.y*tile+tile/2,
tile/6,
g.x*tile+tile/2,
g.y*tile+tile/2,
tile/2
)

grad.addColorStop(0,"white")
grad.addColorStop(1,g.color)

ctx.fillStyle=grad

ctx.beginPath()

ctx.arc(
g.x*tile+tile/2,
g.y*tile+tile/2,
tile/2.4,
0,
Math.PI*2
)

ctx.fill()

}



// HAAMUJEN LIIKE
function moveGhost(g){

let dirs=[[1,0],[-1,0],[0,1],[0,-1]]

let d = dirs[Math.floor(Math.random()*4)]

let nx = g.x+d[0]
let ny = g.y+d[1]

if(map[ny][nx]!==1){

g.x=nx
g.y=ny

}

}



// PELIN LOGIIKKA
function update(){

let nx = pacman.x+pacman.dx
let ny = pacman.y+pacman.dy

if(map[ny][nx]!==1){

pacman.x=nx
pacman.y=ny

if(map[ny][nx]===2){

map[ny][nx]=0
score++

beep(600,0.05)

}

if(map[ny][nx]===3){

map[ny][nx]=0
score+=10

beep(200,0.2)

}

document.getElementById("score").textContent=score

}

ghosts.forEach(g=>{

if(g.x===pacman.x && g.y===pacman.y){

gameOver()

}

})

}



// GAME OVER
function gameOver(){

beep(80,0.6)

if(score>highscore){

localStorage.setItem("pacmanHigh",score)

}

alert("Game Over")

location.reload()

}



// PIIRTO
function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height)

drawMap()
drawPacman()

ghosts.forEach(drawGhost)

}



// LOOP
function loop(){

update()
draw()

}

setInterval(loop,120)

setInterval(()=>{

ghosts.forEach(moveGhost)

},350)



// OHJAUS
function move(d){

if(d==="r"){pacman.dx=1;pacman.dy=0}
if(d==="l"){pacman.dx=-1;pacman.dy=0}
if(d==="u"){pacman.dx=0;pacman.dy=-1}
if(d==="d"){pacman.dx=0;pacman.dy=1}

}

document.addEventListener("keydown",(e)=>{

if(e.key==="ArrowRight") move("r")
if(e.key==="ArrowLeft") move("l")
if(e.key==="ArrowUp") move("u")
if(e.key==="ArrowDown") move("d")

})



// SWIPE
let sx=0
let sy=0

canvas.addEventListener("touchstart",(e)=>{

sx=e.touches[0].clientX
sy=e.touches[0].clientY

})

canvas.addEventListener("touchend",(e)=>{

let dx=e.changedTouches[0].clientX-sx
let dy=e.changedTouches[0].clientY-sy

if(Math.abs(dx)>Math.abs(dy)){

if(dx>0) move("r")
else move("l")

}else{

if(dy>0) move("d")
else move("u")

}

})