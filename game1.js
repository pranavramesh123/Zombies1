myAudio = new Audio('music.mp3'); 
myAudio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
myAudio.play();

var CANVAS_WIDTH = 1000;
var CANVAS_HEIGHT = 500;
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");


var speed = 1;
var cont = 0;
var health = 3;
var score = 1;
var roundNum = 0;

document.addEventListener("keydown",keyDownHandler, false);

var playerImage = new Image();
playerImage.src = 'PlayerRight.png';

var zombieImage = new Image();
zombieImage.src = 'ZombieDown2.png';

var graveyard = new Image();
graveyard.src = 'graveyard.png';

var bulletImage = new Image();
bulletImage.src = 'bullet.png';

var healthPack = new Image();
healthPack.src = 'healthpack.png'


var player = {sprite:playerImage,x:100,y:100};

objectList = [];
objectList.push(player);
bulletList = [];
healthpackList = [];
enemyList = [];

var direction = 'right';


function keyDownHandler(event){
	
	if(event.keyCode == 38){
		//alert("GOING UP");
		direction = 'up';
		objectList[0].sprite.src = 'PlayerUp.png';
		objectList[0].y -= 6+speed; 
	}
	if(event.keyCode == 37){
		//alert("GOING Left");
		direction = 'left';
		objectList[0].sprite.src = 'PlayerLeft.png';
		objectList[0].x -= 6+speed;
	}
	if(event.keyCode == 39){
		//alert("GOING Right");
		direction = 'right';
		objectList[0].sprite.src = 'PlayerRight.png';
		objectList[0].x += 6+speed;
	}
	if(event.keyCode == 40){
		//alert("GOING Down");
		direction = 'down';
		objectList[0].sprite.src = 'PlayerDown.png';
		objectList[0].y += 6+speed;
	}
	if(event.keyCode == 32){
		//alert("Shoot");
		shoot();
	}
	else if(event.keyCode == 35){
		spawnHealthpack();
	}
	else if(event.keyCode == 33){
		roundNum++;
	}
	cont ++;
}

function nextRound(){
	spawnEnemy();
	for(i=0;i<roundNum;i++){
		rand = Math.floor((Math.random() * 5) + 1);
		if(rand==1)
			spawnEnemy();
	}
	rand = Math.floor((Math.random() * 5) + 1);
		if(rand==1)
			spawnHealthpack();
	roundNum++;
	if(roundNum >= speed*10){
		var audio = new Audio('powerup.mp3');
		audio.play();
		speed++;
	}
}

function shoot(){
	var audio = new Audio('bulletSound.mp3');
	audio.play();
	var bullet = {sprite:bulletImage,x:objectList[0].x,y:objectList[0].y,dir:direction};
	bulletList.push(bullet);
}

function clearCanvas(){
	ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
}

function draw(){
	
	//clear canvas
	clearCanvas();
	ctx.drawImage(graveyard,0,0);

	for(i = 0; i<objectList.length;i++)
		ctx.drawImage(objectList[i].sprite,objectList[i].x,objectList[i].y);

	for(i = 0; i<bulletList.length;i++)
		ctx.drawImage(bulletList[i].sprite,bulletList[i].x,bulletList[i].y);
	
	for(i = 0; i<enemyList.length;i++)
		ctx.drawImage(enemyList[i].sprite,enemyList[i].x,enemyList[i].y);

	for(i = 0; i<healthpackList.length;i++)
		ctx.drawImage(healthpackList[i].sprite,healthpackList[i].x,healthpackList[i].y);
}

function updateZombies(){
	for(i=0;i<enemyList.length;i++){
		if(enemyList[i].dir=='left')
			enemyList[i].sprite.src = 'ZombieLeft.png';
		else if(enemyList[i].dir=='right')
			enemyList[i].sprite.src = 'ZombieRight.png';
		else if(enemyList[i].dir=='up')
			enemyList[i].sprite.src = 'ZombieUp.png';
		else if(enemyList[i].dir=='down')
			enemyList[i].sprite.src = 'ZombieDown2.png';
	}
}

function update(){
	if(enemyList.length == 0){
		nextRound();
	}

	for(i = 0; i<bulletList.length;i++){
		if(bulletList[i].dir == 'right')
			bulletList[i].x+=6;
		else if (bulletList[i].dir == 'left')
			bulletList[i].x-=6;
		else if (bulletList[i].dir == 'up')
			bulletList[i].y-=6;
		else if (bulletList[i].dir == 'down')
			bulletList[i].y+=6;
		if(bulletList[i].y>1500||bulletList[i].x>1500)
			bulletList.splice(i, 1);
	}

//check collison with bullets
	for(i = 0; i<bulletList.length;i++)
	{
		for(z = 0;z<enemyList.length;z++)
		{
			if(20>=Math.abs(enemyList[z].x-bulletList[i].x)&&20>=Math.abs(enemyList[z].y-bulletList[i].y)){
				var audio = new Audio('zombieDeath.mp3');
				audio.play();
				//remove bullet
				bulletList.splice(i, 1);
				//remove enemy
				enemyList.splice(z,1);
				score++;
			}
		}
	}

	for(i = 0; i<enemyList.length;i++){
		if(enemyList[i].y > objectList[0].y){
			enemyList[i].y-=2+speed;
			enemyList[i].dir = 'up';
			//enemyList[i].sprite.src = 'ZombieLeft.png';
		}
		if(enemyList[i].y < objectList[0].y){
			enemyList[i].y+=2+speed;
			enemyList[i].dir = 'down';
			//enemyList[i].sprite.src = 'ZombieLeft.png';
		}
		if(enemyList[i].x <= objectList[0].x){
			enemyList[i].x+=2+speed;
			enemyList[i].dir = 'right';
			//enemyList[i].sprite.src = 'ZombieLeft.png';
		}
		if(enemyList[i].x > objectList[0].x){
			enemyList[i].x-=2+speed;
			enemyList[i].dir = 'left';
		}
	}

	for(i=0;i<enemyList.length;i++){
		if(10>Math.abs(objectList[0].x-enemyList[i].x)&& 10>Math.abs(objectList[0].y-enemyList[i].y)){
			var audio = new Audio('zombieAttack.mp3');
			audio.play();
			enemyList.splice(i,1);
			health--;
		}

	}
	for(i=0;i<healthpackList.length;i++){
		if(10>Math.abs(objectList[0].x-healthpackList[i].x)&&10>Math.abs(objectList[0].y-healthpackList[i].y)){
			var audio = new Audio('healthpack.mp3');
			audio.play();
			healthpackList.splice(i, 1);
			health++;
		}
	}
}

function drawStats(){
	ctx.font = "50px Gothic";
	ctx.fillStyle = "red";
	//ctx.textAlign = "center";
	ctx.fillText("Score:"+score, 0, 50);
	ctx.fillText("Round:"+roundNum, 400, 50);
	ctx.fillText("Health:"+health, 750, 50);
}

function spawnEnemy(){
		randX = Math.floor((Math.random() * 1000) + 1);
		randY = Math.floor((Math.random() * 500) + 1);
		var zombie = {sprite:zombieImage,x:randX,y:randY,dir:"right"};
		enemyList.push(zombie);
}

function spawnHealthpack(){
	randX = Math.floor((Math.random() * 1000) + 1);
	randY = Math.floor((Math.random() * 500) + 1);
	var hp = {sprite:healthPack,x:randX,y:randY}
	healthpackList.push(hp);
}

function checkDeath(){
	if(health<1){
		var audio = new Audio('die.mp3');
		audio.play();
		enemyList.length = 0
		healthpackList.length = 0;
		health=3;
		roundNum = 0;
		score = 0;
		speed = 0;
		
	}
}

var FPS = 30;
setInterval(function() {
  update();
  draw();
  updateZombies();
  drawStats();
  checkDeath();
}, 1000/FPS);

