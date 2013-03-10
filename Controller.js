function Controller(VG, hero, enemies){
	for(iter in enemies){
		awareness(enemies[iter],VG);
		//can put the enemies punching inside here, based on the actionType
	}
	hero.targetBot = null;
	hero.actionType = 0;
	if(hero.gridX + 1 <= 32 && hero.gridX - 1 >=0 && hero.gridY + 1 <= 27 && hero.gridY - 1 >= 0){
		if(hero.facingWhichDirection == "up"){
			if(VG[hero.gridX][hero.gridY-1] != null && (VG[hero.gridX][hero.gridY-1].selfType == 1 || VG[hero.gridX][hero.gridY-1].selfType == 2) ){
				hero.targetBot = VG[hero.gridX][hero.gridY-1];
				hero.actionType = 1;
			}
		}
		if(hero.facingWhichDirection == "down"){
			if(VG[hero.gridX][hero.gridY+1] != null && (VG[hero.gridX][hero.gridY+1].selfType == 1 || VG[hero.gridX][hero.gridY+1].selfType == 2)){
				hero.targetBot = VG[hero.gridX][hero.gridY+1];
				hero.actionType = 1;
			}
		}
		if(hero.facingWhichDirection == "left"){
			if(VG[hero.gridX-1][hero.gridY] != null && (VG[hero.gridX-1][hero.gridY].selfType == 1 || VG[hero.gridX-1][hero.gridY].selfType == 2)){
				hero.targetBot = VG[hero.gridX-1][hero.gridY];
				hero.actionType = 1;
			}
		}
		if(hero.facingWhichDirection == "right"){
			if(VG[hero.gridX+1][hero.gridY] != null && (VG[hero.gridX+1][hero.gridY].selfType == 1 || VG[hero.gridX+1][hero.gridY].selfType == 2)){
				hero.targetBot = VG[hero.gridX+1][hero.gridY];
				hero.actionType = 1;
			}
		}
	}
	//console.log(hero.gridX + "," + hero.gridY);
	//or can set a loop to iterate through all gameObjects to get them doing their specific actions
}

//33X28 grid
function setGrid(hero, enemies /*, girls*/){
	VG = new Array();
	for (var i = 0; i < 33; i++){
		VG[i] = new Array();
		for (var j = 0; j < 28; j++){
			VG[i][j] = new Array();
			//VG[i][j][0] = 0;
		}
	}
	VG[hero.gridX][hero.gridY] = hero;
	for (iter in enemies){
		//slots the gameObject into its grid
		VG[enemies[iter].gridX][enemies[iter].gridY] = enemies[iter];
		enemies[iter].actionType = 0;	//resets actionType
		enemies[iter].targetBot = null;	//resets targetBot
	}
	
	//console.log(VG[19][11].length);
	return VG;
}

//instantly breaks off from function if hero is detected
//only need to handle checking for enemies
function awareness(bot, VG){
	//above
	
	if(VG[bot.gridX][bot.gridY-1] != null){
		bot.facingWhichDirection = "up";
		bot.targetBot = VG[bot.gridX][bot.gridY-1];
		if(VG[bot.gridX][bot.gridY-1].selfType == 0){		
			bot.actionType = 2;
			//console.log("hero up");
			return;
		}
		if(VG[bot.gridX][bot.gridY-1].selfType >= 3){
			bot.actionType = 1;
			VG[bot.gridX][bot.gridY-1].actionType = 1;
			VG[bot.gridX][bot.gridY-1].facingWhichDirection = "down";
		}			
	}
	//below
	if(VG[bot.gridX][bot.gridY+1] != null){
		bot.facingWhichDirection = "down";
		bot.targetBot = VG[bot.gridX][bot.gridY+1];
		if(VG[bot.gridX][bot.gridY+1].selfType == 0){			
			bot.actionType = 2;			
			//console.log("hero down");
			return;
		}
		if(VG[bot.gridX][bot.gridY+1].selfType >= 3){
			bot.actionType = 1;
			VG[bot.gridX][bot.gridY+1].actionType = 1;
			VG[bot.gridX][bot.gridY+1].facingWhichDirection = "up";
		}
	}
	
	//left
	if(VG[bot.gridX-1][bot.gridY] != null){
		bot.facingWhichDirection = "left";
		bot.targetBot = VG[bot.gridX-1][bot.gridY];
		if(VG[bot.gridX-1][bot.gridY].selfType == 0){			
			bot.actionType = 2;			
			//console.log("hero left");
			return;
		}
		if(VG[bot.gridX-1][bot.gridY].selfType >= 3){
			bot.actionType = 1;
			VG[bot.gridX-1][bot.gridY].actionType = 1;
			VG[bot.gridX-1][bot.gridY].facingWhichDirection = "right";
		}
	}	
	//right
	if(VG[bot.gridX+1][bot.gridY] != null){
		bot.facingWhichDirection = "right";
		bot.targetBot = VG[bot.gridX+1][bot.gridY];
		if(VG[bot.gridX+1][bot.gridY].selfType == 0){	
			bot.actionType = 2;			
			//console.log("hero right");
			return;
		}
		if(VG[bot.gridX+1][bot.gridY].selfType == 3){
			bot.actionType = 1;
			VG[bot.gridX+1][bot.gridY].actionType = 1;
			VG[bot.gridX+1][bot.gridY].facingWhichDirection = "left";
		}
		
	}
}
