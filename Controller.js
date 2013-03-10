function Controller(VG, hero, enemies,ladies){
	for(iter in enemies){
		awareness(enemies[iter],VG);
		//can put the enemies punching inside here, based on the actionType
	}
	for(iter1 in ladies){
		ladies[iter1].targetGrid = new Array(5,18);
	}
	hero.targetBot = null;
	hero.actionType = 0;
	if(	hero.gridX + 1 <= 32 && 
		hero.gridX - 1 >=0 && 
		hero.gridY + 1 <= 27 
		&& hero.gridY - 1 >= 0){
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
	
	//Iterate through the loop to see if any of the enemies actionType has changed, 
	//and if did do the necessary attack
	/*for(iter in enemies){
		
		switch(enemies[iter].actionType){
			case 1:	enemies[iter].HeroType.pullSkirt(enemies[iter].targetBot);
					break;
			case 2: enemies[iter].HeroType.attackPlayer(enemies[iter].targetBot);
					break;
			default: 
					break;
		}
	
	}//for-each loop*/
}

//33X28 grid
function setGrid(hero, enemies ,ladies){
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
	
	for(iter1 in ladies){
		VG[ladies[iter1].gridX][ladies[iter1].gridY] = ladies[iter1];
		ladies[iter1].actionType = 0;	//resets actionType
		ladies[iter1].targetBot = null;	//resets targetBot
	}
	
	//console.log(VG[19][11].length);
	return VG;
}

//instantly breaks off from function if hero is detected
//only need to handle checking for enemies
function awareness(bot, VG){
	if(	bot.gridX + 1 <= 32 
		&& bot.gridX - 1 >=0 
		&& bot.gridY + 1 <= 27 
		&& bot.gridY - 1 >= 0){
		//above	
		if(VG[bot.gridX][bot.gridY-1] != null){
			bot.facingWhichDirection = "up";
			
			if(VG[bot.gridX][bot.gridY-1].selfType == 0){		
				bot.actionType = 2;
				bot.targetBot = VG[bot.gridX][bot.gridY-1];
				//console.log("hero up");
				return;
			}
			if(VG[bot.gridX][bot.gridY-1].selfType == 3){
				bot.actionType = 1;
				bot.targetBot = VG[bot.gridX][bot.gridY-1];
				VG[bot.gridX][bot.gridY-1].actionType = 1;
				VG[bot.gridX][bot.gridY-1].facingWhichDirection = "down";
			}			
		}
		//below
		if(VG[bot.gridX][bot.gridY+1] != null){
			bot.facingWhichDirection = "down";
			
			if(VG[bot.gridX][bot.gridY+1].selfType == 0){			
				bot.actionType = 2;	
				bot.targetBot = VG[bot.gridX][bot.gridY+1];				
				//console.log("hero down");
				return;
			}
			if(VG[bot.gridX][bot.gridY+1].selfType == 3){
				bot.actionType = 1;
				bot.targetBot = VG[bot.gridX][bot.gridY+1];
				VG[bot.gridX][bot.gridY+1].actionType = 1;
				VG[bot.gridX][bot.gridY+1].facingWhichDirection = "up";
			}
		}	
		//left
		if(VG[bot.gridX-1][bot.gridY] != null){
			bot.facingWhichDirection = "left";
			
			if(VG[bot.gridX-1][bot.gridY].selfType == 0){			
				bot.actionType = 2;
				bot.targetBot = VG[bot.gridX-1][bot.gridY];
				//console.log("hero left");
				return;
			}
			if(VG[bot.gridX-1][bot.gridY].selfType == 3){
				bot.actionType = 1;
				bot.targetBot = VG[bot.gridX-1][bot.gridY];
				VG[bot.gridX-1][bot.gridY].actionType = 1;
				VG[bot.gridX-1][bot.gridY].facingWhichDirection = "right";
			}
		}	
		//right
		if(VG[bot.gridX+1][bot.gridY] != null){
			bot.facingWhichDirection = "right";
			
			if(VG[bot.gridX+1][bot.gridY].selfType == 0){	
				bot.actionType = 2;
				bot.targetBot = VG[bot.gridX+1][bot.gridY];
				//console.log("hero right");
				return;
			}
			if(VG[bot.gridX+1][bot.gridY].selfType == 3){
				bot.actionType = 1;
				bot.targetBot = VG[bot.gridX+1][bot.gridY];
				VG[bot.gridX+1][bot.gridY].actionType = 1;
				VG[bot.gridX+1][bot.gridY].facingWhichDirection = "left";
			}
			
		}
	}
}
