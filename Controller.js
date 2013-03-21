//keeps track of all vendor positions in order for ladies to loiter
// var vendorPosX = new Array(	2, 3, 4, 5, 2, 3, 4, 5,	9, 10, 22, 23, 23, 26, 24, 25,
							// 9, 10, 11, 9, 10, 25, 26, 22, 23, 21, 22, 23, 16, 16, 16, 
							// 27, 28, 29, 30, 31, 26, 32,	27, 28, 29, 30, 31);
// var vendorPosY = new Array(	4, 4, 4, 4,	6, 6, 6, 6,	8, 8, 8, 8,	11, 11, 12, 12,	15, 15, 
							// 16, 17, 17, 18, 18, 17, 17, 18, 19, 19,	22, 23, 24,	23, 23, 
							// 23, 23, 23,	24, 24,	25, 25, 25, 25, 25);

var vendorPosX = new Array(	2, 3, 4, 5, 9, 10, 22, 23, 24, 
					25, 9, 10, 25, 26, 22, 23, 17, 
					17, 17, 27, 28, 29, 30, 31);

var vendorPosY = new Array(	5, 5, 5, 5, 7, 7, 7, 7, 11, 11,
					16, 16, 17, 17, 18, 18, 22, 23,
					24, 24, 24, 24, 24, 24);
var vendorTaken = new Array(false, false, false, false, false, false,
							false, false, false, false, false, false,
							false, false, false, false, false, false,
							false, false, false, false, false, false);
var vendorCount = 24

function Controller(){
	//requestAnimFrame(Controller);
	setGrid();
	for(iter in enemies){
		EnemyAwareness(enemies[iter]);
		enemies[iter].targetGrid = new Array(enemies[iter].gridX, enemies[iter].gridY);
		if(enemies[iter].moveTarget!=null){
			if(enemies[iter].moveTarget.selfType == 3 || enemies[iter].selfType == 4){
				enemies[iter].ladyTarget = enemies[iter].moveTarget;
			}
			var tx = enemies[iter].moveTarget.gridX;
			var ty = enemies[iter].moveTarget.gridY;
			enemies[iter].targetGrid = new Array(tx,ty);
		}
		//console.log(enemies[iter].targetGrid[0] + "," + enemies[iter].targetGrid[1]);
		//console.log(enemies[0].targetGrid[0] + "," + enemies[0].targetGrid[1]);
		//can put the enemies punching inside here, based on the actionType
	}

	
	moveLion();
	setMaxOcc();
	ladiesLoiterTimer();
	for(iter in ladies){
		LadyAwareness(ladies[iter]);
	}
	heroBehaviour(hero,VG);
	LadyAwareness(lion);
	if(lion.actionType == 1 && lion.keepMoving == false && lion.targetBot != null && lionStatus == true){
		//alert("a");
		lion.HeroType.strikeWithUmbrella(lion.targetBot);
		lionMaxKills--;
		if(lionMaxKills <= 0){
			lionStatus = false;
			var lionRandom = new Randomiser();
			lionActivationRequirement = lionRandom.randomise(3,5);
			lionMaxKills = 3;
		}
	}
	// Habeeb, uncomment the following to test -- max we should update only if action type is 1
	// because only then he can attack and thats when we need to monitor
	overallSafety();
	if(hero.actionType == 1){
		hero.HeroType.fightController.updateSurroundingEnemies(returnSurroundingArray(hero));
		hero.HeroType.fightController.monitorHeroObjectSituation();
	}

	
	EnemiesRadialAwareness();
	for(iter in enemies){
		if(enemies[iter].keepMoving == false){
			switch(enemies[iter].actionType){
				case 1:	
						enemies[iter].HeroType.pullSkirt(enemies[iter].targetBot);
						break;
				case 2: enemies[iter].HeroType.attackPlayer(enemies[iter].targetBot);
						break;
				default: 
						break;
			}
		}
	}//for-each loop
	
	
	for(iter in ladies){
		//default targetGrid, the movement behaviour depending on AI will change the targetGrid
		//function for updating the surrounding enemies
		//Habeeb, note here, uncomment the following function to test
		ladies[iter].HeroType.fightController.updateSurroundingEnemies(returnSurroundingArray(ladies[iter]))
		if(	ladies[iter].selfType == 4 && ladies[iter].actionType == 1 && 
			ladies[iter].keepMoving == false && ladies[iter].targetBot != null &&
			ladies[iter].keepMoving == false && ladies[iter].targetBot != null &&
			(ladies[iter].targetBot.selfType == 1 || ladies[iter].targetBot.selfType == 2)){
			ladies[iter].targetGrid = new Array(ladies[iter].targetBot.gridX,ladies[iter].targetBot.gridY);
			ladies[iter].HeroType.fightController.monitorHeroObjectSituation();
			ladies[iter].HeroType.strikeWithUmbrella(ladies[iter].targetBot);
		}
		if(ladies[iter].selfType == 3 && ladies[iter].actionType == 1){
			ladies[iter].targetGrid = new Array(ladies[iter].targetBot.gridX,ladies[iter].targetBot.gridY);
			ladies[iter].HeroType.fightController.monitorHeroObjectSituation();
		}
		if(ladies[iter].actionType == 3){
			ladies[iter].targetGrid = new Array(hero.gridX,hero.gridY);			
		}
		if(ladies[iter].gridX<=2 && ladies[iter].gridY>=25){

			// Update global flag that a lady was saved
			ladyWasSaved = true;
			// Update the player learning also
			playerLearningObj.ladyRescueUpdate(ladies[iter]);//.spawnTime, ladies[iter].health);
			// To clear the health bar issue upon reaching safe zone
			ladies[iter].HeroType.specialRender();
			// I will update the destroyed in playerLearning
			//ladies[iter].destroyed = true;
			ladies[iter].targetGrid = (0,27);
			savedLadiesCount++;
			hero.targetBot = null;
		}
	}
	//console.log(ladies.length);
	overallSafety();
	if(lionActivationRequirement>0){
		displayMessage("kill " + lionActivationRequirement + " more enemies to activate combo");
	}
	else{
		displayMessage("press 'c' to activate lion");
	}
}

function moveLion(){
	var strongestEnemy = enemies[0];
	if(lionStatus){
		if(lion.moveTarget == null){
			for(iter in enemies){
				if(enemies[iter].health>strongestEnemy.health){
					strongestEnemy = enemies[iter]
				}
			}
			lion.moveTarget = strongestEnemy;
		}
		if(lion.moveTarget == null){
			lion.moveTarget = enemies[0];
		}
		if(lion.moveTarget != null){
			var tx = lion.moveTarget.gridX;
			var ty = lion.moveTarget.gridY;
			lion.targetGrid = new Array(tx,ty);
		}
	}
	if(!lionStatus){
		lion.targetGrid = new Array(17,14);
	}
}

function ladiesLoiterTimer(){
	for(iter in ladies){
		if(ladies[iter].actionType == 0){
			if(	(ladies[iter].gridX + 1 == ladies[iter].targetGrid[0]	&& ladies[iter].gridY == ladies[iter].targetGrid[1]) ||
				(ladies[iter].gridX - 1 == ladies[iter].targetGrid[0]	&& ladies[iter].gridY == ladies[iter].targetGrid[1]) ||
				(ladies[iter].gridX == ladies[iter].targetGrid[0]	&& ladies[iter].gridY + 1 == ladies[iter].targetGrid[1]) ||
				(ladies[iter].gridX == ladies[iter].targetGrid[0]	&& ladies[iter].gridY - 1 == ladies[iter].targetGrid[1])){
				ladies[iter].loiterTime++;
			}
			if(ladies[iter].loiterTime>=150){	
					while(1){
						var random = new Randomiser();
						var randomNo = random.randomise(0,23);
						var x = vendorPosX[randomNo];
						var y = vendorPosY[randomNo];	
						if(VG[x][y].maxOccupants > 1){
							break;
						}
					}	
					VG[x][y].maxOccupant--;
					ladies[iter].targetGrid = new Array(x,y);
					ladies[iter].loiterTime = 0;
			}
		}
	}
}

function reduceMO(xCor, yCor){
	VG[xCor][yCor].maxOccupant--;
	//top
	if(VG[xCor][yCor-1].selfType == 9){
		VG[xCor][yCor-1].maxOccupant--;
	}
	//down
	if(VG[xCor][yCor+1].selfType == 9){
		VG[xCor][yCor+1].maxOccupant--;
	}
	//left
	if(VG[xCor-1][yCor].selfType == 9){
		VG[xCor-1][yCor].maxOccupant--;
	}
	//right
	if(VG[xCor+1][yCor].selfType == 9){
		VG[xCor+1][yCor].maxOccupant--;
	}
	
}

//returns an array of heroObjects surrounding the heroObject, main
//puts into array in the top->right->down->left sequence
function returnSurroundingArray(main){
	var count = 0;
	var SurArray = new Array();
	//top
	if((main.gridY - 1) >= 0){
		if (VG[main.gridX][main.gridY-1] != null){
			if(	VG[main.gridX][main.gridY-1].selfType == 1 ||
				VG[main.gridX][main.gridY-1].selfType == 2){
				SurArray[count] = VG[main.gridX][main.gridY-1];
				count++;
			}
		}
	}
	//right
	if((main.gridX + 1) <= 32){
		if (VG[main.gridX+1][main.gridY] != null){
			if(	VG[main.gridX+1][main.gridY].selfType == 1 ||
				VG[main.gridX+1][main.gridY].selfType == 2){
				SurArray[count] = VG[main.gridX+1][main.gridY];
				count++;
			}
		}
	}
	//down
	if((main.gridY + 1) <= 28){
		if (VG[main.gridX][main.gridY+1] != null){
			if(	VG[main.gridX][main.gridY+1].selfType == 1 ||
				VG[main.gridX][main.gridY+1].selfType == 2){
				SurArray[count] = VG[main.gridX][main.gridY+1];
				count++;
			}
		}
	}
	//left
	if((main.gridX - 1) >= 0){
		if (VG[main.gridX-1][main.gridY] != null){
			if(	VG[main.gridX-1][main.gridY].selfType == 1 ||
				VG[main.gridX-1][main.gridY].selfType == 2){
				SurArray[count] = VG[main.gridX-1][main.gridY];
				count++;
			}
		}
	}
	return SurArray;
}

function heroBehaviour(hero, VG){
hero.targetBot = null;
	hero.actionType = 0;
	if(hero.facingWhichDirection == "up" && hero.gridY-1>=0){
		if(VG[hero.gridX][hero.gridY-1] != null){
			hero.targetBot = VG[hero.gridX][hero.gridY-1];
			if(	VG[hero.gridX][hero.gridY-1].selfType == 1 || 
				VG[hero.gridX][hero.gridY-1].selfType == 2){
					hero.actionType = 1;
			}
			if( VG[hero.gridX][hero.gridY-1].selfType == 3 || 
				VG[hero.gridX][hero.gridY-1].selfType == 4){
					hero.actionType = 3;
					hero.targetBot = VG[hero.gridX][hero.gridY-1];					
			}
		}
	}
	if(hero.facingWhichDirection == "down" && hero.gridY+1<=27){
		if(VG[hero.gridX][hero.gridY+1] != null){
			hero.targetBot = VG[hero.gridX][hero.gridY+1];
			if( VG[hero.gridX][hero.gridY+1].selfType == 1 || 
				VG[hero.gridX][hero.gridY+1].selfType == 2){				
					hero.actionType = 1;
			}
			if( VG[hero.gridX][hero.gridY+1].selfType == 3 || 
				VG[hero.gridX][hero.gridY+1].selfType == 4){				
					hero.actionType = 3;
					hero.targetBot = VG[hero.gridX][hero.gridY+1];
			}
		}
	}
	if(hero.facingWhichDirection == "left" && hero.gridX-1>=0){
		if(VG[hero.gridX-1][hero.gridY] != null){
			hero.targetBot = VG[hero.gridX-1][hero.gridY];
			if(	VG[hero.gridX-1][hero.gridY].selfType == 1 || 
				VG[hero.gridX-1][hero.gridY].selfType == 2){				
					hero.actionType = 1;
			}
			if(	VG[hero.gridX-1][hero.gridY].selfType == 3 || 
				VG[hero.gridX-1][hero.gridY].selfType == 4){				
					hero.actionType = 3;
					hero.targetBot = VG[hero.gridX-1][hero.gridY];
			}					
		}
	}
	if(hero.facingWhichDirection == "right" && hero.gridX+1<=32){
		if(VG[hero.gridX+1][hero.gridY] != null){
			hero.targetBot = VG[hero.gridX+1][hero.gridY];
			if( VG[hero.gridX+1][hero.gridY].selfType == 1 || 
				VG[hero.gridX+1][hero.gridY].selfType == 2){				
					hero.actionType = 1;
			}
			if( VG[hero.gridX+1][hero.gridY].selfType == 3 || 
				VG[hero.gridX+1][hero.gridY].selfType == 4){				
					hero.actionType = 3;
					hero.targetBot = VG[hero.gridX+1][hero.gridY];
			}
		}
	}
}

//33X28 grid
function setGrid(){
	VG = [];
	VG = new Array();
	for (var i = 0; i < 33; i++){
		VG[i] = new Array();
		for (var j = 0; j < 28; j++){
			VG[i][j] = new Array();
			//VG[i][j][0] = 0;
		}
	}
	VG[hero.gridX][hero.gridY] = hero;
	hero.maxOccupants = 4;
	
	VG[lion.gridX][lion.gridY] = lion;
	lion.actionType = 0;
	lion.targetBot = null;
	lion.maxOccupants = 4;
	
	for (iter in enemies){
		//slots the gameObject into its grid
		VG[enemies[iter].gridX][enemies[iter].gridY] = enemies[iter];
		enemies[iter].actionType = 0;	//resets actionType
		enemies[iter].targetBot = null;	//resets targetBot
		enemies[iter].maxOccupants = 4;
	}
	
	for(iter in ladies){
		VG[ladies[iter].gridX][ladies[iter].gridY] = ladies[iter];
		if(ladies[iter].actionType != 3){
			ladies[iter].actionType = 0;	//resets actionType
		}
		ladies[iter].targetBot = null;	//resets targetBot
		ladies[iter].maxOccupants = 4;
	}
	
	for(iter in collidables){
		VG[collidables[iter].gridX][collidables[iter].gridY] = collidables[iter];
		collidables[iter].maxOccupants = 4;
	}	
}

function setMaxOcc(){
	//sets for those that are already being occupied
	singleMO(hero);
	singleMO(lion);
	for(iter in collidables){
		singleMO(collidables[iter]);
	}
	for(iter in ladies){
		singleMO(ladies[iter]);
	}
	for(iter in enemies){
		singleMO(enemies[iter]);
	}
	
	//sets to limit the number of people targeting that grid
	for(iter in ladies){
		if(ladies[iter] != null && ladies[iter].targetGrid != null){
			if(ladies[iter].targetGrid[0]!=null && ladies[iter].targetGrid[1]!=null){
				VG[ladies[iter].targetGrid[0]][ladies[iter].targetGrid[1]].maxOccupants--;
			}
		}
	}
	for(iter in enemies){
		if(enemies[iter].targetGrid != null){
			if(VG[enemies[iter].targetGrid[0]][enemies[iter].targetGrid[1]].maxOccupants!=null){
				VG[enemies[iter].targetGrid[0]][enemies[iter].targetGrid[1]].maxOccupants--;
			}
		}
	}
}

function singleMO(obj){
	//top
	if((obj.gridY - 1 >= 0 && VG[obj.gridX][obj.gridY-1].selfType != null) || obj.gridY-1 < 0){
		obj.maxOccupants--;
	}
	//down
	if((obj.gridY + 1 <= 27 && VG[obj.gridX][obj.gridY+1].selfType != null) || obj.gridY + 1 > 27){
		obj.maxOccupants--;
	}
	//left
	if((obj.gridX - 1 >= 0 && VG[obj.gridX-1][obj.gridY].selfType != null) || obj.gridX - 1 < 0){
		obj.maxOccupants--;
	}
	//right
	if((obj.gridX + 1 <= 32 && VG[obj.gridX+1][obj.gridY].selfType != null) || obj.gridX + 1 > 32){
		obj.maxOccupants--;
	}
}


//instantly breaks off from function if hero is detected
//only need to handle checking for enemies
function EnemyAwareness(bot){
	//above
	if(bot.gridY-1>=0){
		if(VG[bot.gridX][bot.gridY-1] != null){
			if(VG[bot.gridX][bot.gridY-1].selfType == 0){		
				bot.facingWhichDirection = "up";
				bot.actionType = 2;
				bot.targetBot = VG[bot.gridX][bot.gridY-1];
			}
			if(	VG[bot.gridX][bot.gridY-1].partIndex == bot.moveTarget.partIndex &&
				(VG[bot.gridX][bot.gridY-1].selfType == 3 || 
				VG[bot.gridX][bot.gridY-1].selfType == 4)){
				if((bot.targetBot != null && bot.targetBot.selfType!=0) ||
					bot.targetBot == null){
					bot.facingWhichDirection = "up";
					bot.actionType = 1;					
					bot.targetBot = VG[bot.gridX][bot.gridY-1];
				}
			}			
		}
	}
	//below
	if(bot.gridY+1<=27){
		if(VG[bot.gridX][bot.gridY+1] != null){
			if(VG[bot.gridX][bot.gridY+1].selfType == 0){			
				bot.facingWhichDirection = "down";
				bot.actionType = 2;	
				bot.targetBot = VG[bot.gridX][bot.gridY+1];				
			}
			if(	VG[bot.gridX][bot.gridY+1].partIndex == bot.moveTarget.partIndex &&
				(VG[bot.gridX][bot.gridY+1].selfType == 3 ||
				VG[bot.gridX][bot.gridY+1].selfType == 4)){			
				if((bot.targetBot != null && bot.targetBot.selfType!=0) ||
					bot.targetBot == null){
					bot.facingWhichDirection = "down";
					bot.actionType = 1;
					bot.targetBot = VG[bot.gridX][bot.gridY+1];
				}
			}
		}
	}
	//left
	if(bot.gridX-1>=0){
		if(VG[bot.gridX-1][bot.gridY] != null){			
			if(VG[bot.gridX-1][bot.gridY].selfType == 0){			
				bot.facingWhichDirection = "left";
				bot.actionType = 2;
				bot.targetBot = VG[bot.gridX-1][bot.gridY];
			}
			if(	VG[bot.gridX-1][bot.gridY].partIndex == bot.moveTarget.partIndex &&
				(VG[bot.gridX-1][bot.gridY].selfType == 3 ||
				VG[bot.gridX-1][bot.gridY].selfType == 4)){
				if((bot.targetBot != null && bot.targetBot.selfType!=0) ||
					bot.targetBot == null){
					bot.facingWhichDirection = "left";
					bot.actionType = 1;
					bot.targetBot = VG[bot.gridX-1][bot.gridY];
				}
			}
		}
	}
	//right
	if(bot.gridX+1<=32){
		if(VG[bot.gridX+1][bot.gridY] != null){			
			if(VG[bot.gridX+1][bot.gridY].selfType == 0){	
				bot.facingWhichDirection = "right";
				bot.actionType = 2;
				bot.targetBot = VG[bot.gridX+1][bot.gridY];
			}
			if(	VG[bot.gridX+1][bot.gridY].partIndex == bot.moveTarget.partIndex &&
				(VG[bot.gridX+1][bot.gridY].selfType == 3 ||
				VG[bot.gridX+1][bot.gridY].selfType == 4) ){				
				if((bot.targetBot != null && bot.targetBot.selfType!=0) ||
					bot.targetBot == null){
					bot.facingWhichDirection = "right";
					bot.actionType = 1;
					bot.targetBot = VG[bot.gridX+1][bot.gridY];
				}
			}			
		}
	}
}

function EnemiesRadialAwareness(){

	for(iter in enemies){
		if(enemies[iter].radialAwareness == true)
		{
			var awareness = false;
			var imin = enemies[iter].gridX - 3;
			var imax = enemies[iter].gridX + 3;
			var jmin = enemies[iter].gridY - 3;
			var jmax = enemies[iter].gridY + 3;
			if(imin<0){imin=0;}
			if(imax>32){imax=33;}
			if(jmin<0){jmin=0;}
			if(jmax>27){jmax=28;}
			for(var i = imin; i < imax; i++){
				for(var j = jmin; j < jmax; j++){
					if(VG[i][j].selfType == 0 && VG[i][j].maxOccupants > 0){
						enemies[iter].moveTarget = VG[i][j];
						awareness = true;
					}
				}
			}
			if(awareness == false &&  enemies[iter].moveTarget!=null && enemies[iter].moveTarget.selfType == 0){
				enemies[iter].moveTarget = enemies[iter].ladyTarget;
			}
		}
	}
}

function LadyAwareness(bot){

	//above
	if(bot.gridY-1>=0){
		if(VG[bot.gridX][bot.gridY-1] != null){
			if( VG[bot.gridX][bot.gridY-1].moveTarget != null &&
				VG[bot.gridX][bot.gridY-1].moveTarget.partIndex == bot.partIndex &&
				(VG[bot.gridX][bot.gridY-1].selfType == 1 ||
				VG[bot.gridX][bot.gridY-1].selfType == 2 )){		
				bot.facingWhichDirection = "up";
				bot.actionType = 1;
				bot.targetBot = VG[bot.gridX][bot.gridY-1];
			}
			if(VG[bot.gridX][bot.gridY-1].selfType == 0){
				if(bot.targetBot != null && (bot.targetBot.selfType != 1 || bot.targetBot.selfType != 2)){
					bot.facingWhichDirection = "up";
					if(bot.actionType!=3){
						bot.actionType = 4;
					}					
					bot.targetBot = VG[bot.gridX][bot.gridY-1];
				}			
			}
			if( bot.selfType == 5 &&
				(VG[bot.gridX][bot.gridY-1].selfType == 1 ||
				VG[bot.gridX][bot.gridY-1].selfType == 2 )){		
				bot.facingWhichDirection = "up";
				bot.actionType = 1;
				bot.targetBot = VG[bot.gridX][bot.gridY-1];
			}
		}
	}
	//below
	if(bot.gridY+1<=27){
		if(VG[bot.gridX][bot.gridY+1] != null){
			if( VG[bot.gridX][bot.gridY+1].moveTarget != null &&
				VG[bot.gridX][bot.gridY+1].moveTarget.partIndex == bot.partIndex &&
				(VG[bot.gridX][bot.gridY+1].selfType == 1 ||
				VG[bot.gridX][bot.gridY+1].selfType == 2 )){		
				bot.facingWhichDirection = "down";
				bot.actionType = 1;
				bot.targetBot = VG[bot.gridX][bot.gridY+1];
			}
			if(VG[bot.gridX][bot.gridY+1].selfType == 0){
				if(bot.targetBot != null && (bot.targetBot.selfType != 1 || bot.targetBot.selfType != 2)){
					bot.facingWhichDirection = "down";
					if(bot.actionType!=3){
						bot.actionType = 4;
						bot.targetGrid = new Array(VG[bot.gridX][bot.gridY+1].gridX, VG[bot.gridX][bot.gridY+1].gridY);
					}					
					bot.targetBot = VG[bot.gridX][bot.gridY+1];
				}			
			}
			if( bot.selfType == 5 &&
				(VG[bot.gridX][bot.gridY+1].selfType == 1 ||
				VG[bot.gridX][bot.gridY+1].selfType == 2 )){		
				bot.facingWhichDirection = "down";
				bot.actionType = 1;
				bot.targetBot = VG[bot.gridX][bot.gridY+1];
			}
		}
	}
	//left
	if(bot.gridX-1>=0){
		if(VG[bot.gridX-1][bot.gridY] != null){
			if( VG[bot.gridX-1][bot.gridY].moveTarget != null &&
				VG[bot.gridX-1][bot.gridY].moveTarget.partIndex == bot.partIndex &&
				(VG[bot.gridX-1][bot.gridY].selfType == 1 ||
				VG[bot.gridX-1][bot.gridY].selfType == 2 )){		
				bot.facingWhichDirection = "left";
				bot.actionType = 1;
				bot.targetBot = VG[bot.gridX-1][bot.gridY];
			}
			if(VG[bot.gridX-1][bot.gridY].selfType == 0){
				if(bot.targetBot != null && (bot.targetBot.selfType != 1 || bot.targetBot.selfType != 2)){
					bot.facingWhichDirection = "left";
					if(bot.actionType!=3){
						bot.actionType = 4;
					}					
					bot.targetBot = VG[bot.gridX-1][bot.gridY];
				}			
			}
			if( bot.selfType == bot &&
				(VG[bot.gridX-1][bot.gridY].selfType == 1 ||
				VG[bot.gridX-1][bot.gridY].selfType == 2 )){		
				bot.facingWhichDirection = "left";
				bot.actionType = 1;
				bot.targetBot = VG[bot.gridX-1][bot.gridY];
			}
		}
	}
	//right
	if(bot.gridX+1<=32){
		if(VG[bot.gridX+1][bot.gridY] != null){
			if( VG[bot.gridX+1][bot.gridY].moveTarget != null &&
				VG[bot.gridX+1][bot.gridY].moveTarget.partIndex == bot.partIndex &&
				(VG[bot.gridX+1][bot.gridY].selfType == 1 ||
				VG[bot.gridX+1][bot.gridY].selfType == 2 )){		
				bot.facingWhichDirection = "right";
				bot.actionType = 1;
				bot.targetBot = VG[bot.gridX+1][bot.gridY];
			}
			if(VG[bot.gridX+1][bot.gridY].selfType == 0){
				if(bot.targetBot != null && (bot.targetBot.selfType != 1 || bot.targetBot.selfType != 2)){
					bot.facingWhichDirection = "right";
					if(bot.actionType!=3){
						bot.actionType = 4;
					}					
					bot.targetBot = VG[bot.gridX+1][bot.gridY];
				}			
			}
			if( bot.selfType == 5 &&
				(VG[bot.gridX+1][bot.gridY].selfType == 1 ||
				VG[bot.gridX+1][bot.gridY].selfType == 2 )){		
				bot.facingWhichDirection = "right";
				bot.actionType = 1;
				bot.targetBot = VG[bot.gridX+1][bot.gridY];
			}
		}
	}

}

function overallSafety(){
	safetyLock(hero);
	safetyLock(lion);
	for(iter in ladies){
		safetyLock(ladies[iter]);
	}
	for(iter in enemies){
		safetyLock(enemies[iter]);
	}
}

function safetyLock(bot){
	if(bot.targetGrid[0] == null){
		bot.targetGrid[0] = 0;
	}
	if(bot.targetGrid[1] == null){
		bot.targetGrid[1] = 0;
	}
	if(bot.actionType == null){
		bot.actionType = 0;
	}
	if(bot.selfType!= 0 && bot.targetBot == null){
		bot.targetBot = hero;
	}
	if(bot.moveTarget == null){
		bot.moveTarget = hero;
	}
}
