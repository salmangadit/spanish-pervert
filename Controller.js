function Controller(VG, hero, enemies){
	for(iter in enemies){
		awareness(enemies[iter],VG);
		//can put the enemies punching inside here, based on the actionType
	}
	//or can set a loop to iterate through all gameObjects to get them doing their specific actions
}

function setGrid(hero, enemies /*, girls*/){
	VG = new Array();
	for (var i = 0; i < 32; i++){
		VG[i] = new Array();
		for (var j = 0; j < 32; j++){
			VG[i][j] = new Array();
			//VG[i][j][0] = 0;
		}
	}
	VG[hero.gridX][hero.gridY] = hero;
	hero.actionType = 0;	//resets actionType
	for (iter in enemies){
		//slots the gameObject into its grid
		VG[enemies[iter].gridX][enemies[iter].gridY] = enemies[iter];
		enemies[iter].actionType = 0;	//resets actionType
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
		if(VG[bot.gridX][bot.gridY-1].selfType == 0){		
			bot.actionType = 2;
			console.log("hero up");
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
		if(VG[bot.gridX][bot.gridY+1].selfType == 0){			
			bot.actionType = 2;
			console.log("hero down");
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
		if(VG[bot.gridX-1][bot.gridY].selfType == 0){			
			bot.actionType = 2;
			console.log("hero left");
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
		if(VG[bot.gridX+1][bot.gridY].selfType == 0){	
			bot.actionType = 2;
			console.log("hero right");
			return;
		}
		if(VG[bot.gridX+1][bot.gridY].selfType == 3){
			bot.actionType = 1;
			VG[bot.gridX+1][bot.gridY].actionType = 1;
			VG[bot.gridX+1][bot.gridY].facingWhichDirection = "left";
		}
		
	}
}
