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

function Controller(VG, hero, enemies,ladies,savedLadies){
	
	ladiesLoiterTimer();
	for(iter in enemies){
		awareness(enemies[iter],VG);
		enemies[iter].targetGrid = new Array(enemies[iter].gridX, enemies[iter].gridY);
		//can put the enemies punching inside here, based on the actionType
	}
	heroBehaviour(hero,VG);
	// Habeeb, uncomment the following to test -- max we should update only if action type is 1
	// because only then he can attack and thats when we need to monitor
	if(hero.actionType == 1){
		hero.HeroType.fightController.updateSurroundingEnemies(returnSurroundingArray(hero,VG));
		hero.HeroType.fightController.monitorHeroObjectSituation();
	}
	
	for(iter in enemies){
		switch(enemies[iter].actionType){
			case 1:	enemies[iter].HeroType.pullSkirt(enemies[iter].targetBot);
					break;
			case 2: enemies[iter].HeroType.attackPlayer(enemies[iter].targetBot);
					break;
			default: 
					break;
		}
	}//for-each loop

	for(iter in ladies){
		//default targetGrid, the movement behaviour depending on AI will change the targetGrid
		//function for updating the surrounding enemies
		//Habeeb, note here, uncomment the following function to test
		ladies[iter].HeroType.fightController.updateSurroundingEnemies(returnSurroundingArray(ladies[iter],VG))
		if(ladies[iter].selfType == 4 && ladies[iter].actionType == 1){
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
			ladies[iter].destroyed = true;
			// Update that the lady has been rescued
			ladyWasSaved = true;
			playerLearningObj.ladyRescueUpdate(ladies[iter]);
			ladies[iter].targetGrid = (0,27);
			savedLadies++;
			hero.targetBot = null;
		}
	}
	// console.log("Target Grid is: (" + ladies[0].targetGrid[0] + "," + ladies[0].targetGrid[1] + ")" +
				// "Current Grid is: (" + ladies[0].gridX + "," + ladies[0].gridY + ")");
	
		
}

function ladiesLoiterTimer(){
	for(iter in ladies){
		if(	(ladies[iter].gridX + 1 == ladies[iter].targetGrid[0]	&& ladies[iter].gridY == ladies[iter].targetGrid[1]) ||
			(ladies[iter].gridX - 1 == ladies[iter].targetGrid[0]	&& ladies[iter].gridY == ladies[iter].targetGrid[1]) ||
			(ladies[iter].gridX == ladies[iter].targetGrid[0]	&& ladies[iter].gridY + 1 == ladies[iter].targetGrid[1]) ||
			(ladies[iter].gridX == ladies[iter].targetGrid[0]	&& ladies[iter].gridY - 1 == ladies[iter].targetGrid[1])){
			ladies[iter].loiterTime++;
		}
		if(ladies[iter].loiterTime>=50){	
				var randomNo = Math.floor(Math.random() * 23);
				while(vendorTaken[randomNo]!=false){
					randomNo = Math.floor(Math.random() * 23);
				}				
				if(ladies[iter].targetVendor!=-1){
					vendorTaken[ladies[iter].targetVendor] = false;
				}
				var x = vendorPosX[randomNo];
				var y = vendorPosY[randomNo];
				vendorTaken[randomNo] = true;
				ladies[iter].targetVendor = randomNo;
				//console.log(x + "," + y);
				ladies[iter].targetGrid = new Array(x,y);
				ladies[iter].loiterTime = 0;
		}
	}
}

function ladiesLoiter(){
	for (iter in ladies){
		if(ladies[iter].actionType == 0){
			if(ladies[iter].targetGrid[0] == ladies[iter].gridX && ladies[iter].targetGrid[1] == ladies[iter].gridY){
				//ladies[iter].targetGrid = new Array( vendorPos[Math.floor(Math.random() * 42)][0], vendorPos[Math.floor(Math.random() * 42)][1]);
				alert("a");
				var randomNo = Math.floor(Math.random() * 43);
				var x = vendorPosX[randomNo];
				var y = vendorPosY[randomNo];
				console.log(randomNo);
				ladies[iter].targetGrid = new Array(x,y);
			}
		}
	}
}

//returns an array of heroObjects surrounding the heroObject, main
//puts into array in the top->right->down->left sequence
function returnSurroundingArray(main, VG){
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
			}
		}
	}
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
		if(ladies[iter1].actionType != 3){
			ladies[iter1].actionType = 0;	//resets actionType
		}
		ladies[iter1].targetBot = null;	//resets targetBot
	}
	
	return VG;
}

//instantly breaks off from function if hero is detected
//only need to handle checking for enemies
function awareness(bot, VG){
	//above
	if(bot.gridY-1>=0){
		if(VG[bot.gridX][bot.gridY-1] != null){
			if(VG[bot.gridX][bot.gridY-1].selfType == 0){		
				bot.facingWhichDirection = "up";
				bot.actionType = 2;
				bot.targetBot = VG[bot.gridX][bot.gridY-1];
			}
			if(	VG[bot.gridX][bot.gridY-1].selfType == 3 || 
				VG[bot.gridX][bot.gridY-1].selfType == 4){
				if((bot.targetBot != null && bot.targetBot.selfType!=0) ||
					bot.targetBot == null){
					bot.facingWhichDirection = "up";
					bot.actionType = 1;					
					bot.targetBot = VG[bot.gridX][bot.gridY-1];
				}
				VG[bot.gridX][bot.gridY-1].actionType = 1;
				VG[bot.gridX][bot.gridY-1].facingWhichDirection = "down";
				VG[bot.gridX][bot.gridY-1].targetBot = bot;
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
			if(	VG[bot.gridX][bot.gridY+1].selfType == 3 ||
				VG[bot.gridX][bot.gridY+1].selfType == 4){				
				if((bot.targetBot != null && bot.targetBot.selfType!=0) ||
					bot.targetBot == null){
					bot.facingWhichDirection = "down";
					bot.actionType = 1;
					bot.targetBot = VG[bot.gridX][bot.gridY+1];
				}
				VG[bot.gridX][bot.gridY+1].actionType = 1;
				VG[bot.gridX][bot.gridY+1].facingWhichDirection = "up";
				VG[bot.gridX][bot.gridY+1].targetBot = bot;
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
			if(	VG[bot.gridX-1][bot.gridY].selfType == 3 ||
				VG[bot.gridX-1][bot.gridY].selfType == 4){
				if((bot.targetBot != null && bot.targetBot.selfType!=0) ||
					bot.targetBot == null){
					bot.facingWhichDirection = "left";
					bot.actionType = 1;
					bot.targetBot = VG[bot.gridX-1][bot.gridY];
				}
				VG[bot.gridX-1][bot.gridY].actionType = 1;
				VG[bot.gridX-1][bot.gridY].facingWhichDirection = "right";
				VG[bot.gridX-1][bot.gridY].targetBot = bot;
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
			if(	VG[bot.gridX+1][bot.gridY].selfType == 3 ||
				VG[bot.gridX+1][bot.gridY].selfType == 4){				
				if((bot.targetBot != null && bot.targetBot.selfType!=0) ||
					bot.targetBot == null){
					bot.facingWhichDirection = "right";
					bot.actionType = 1;
					bot.targetBot = VG[bot.gridX+1][bot.gridY];
				}
				VG[bot.gridX+1][bot.gridY].actionType = 1;
				VG[bot.gridX+1][bot.gridY].facingWhichDirection = "left";
				VG[bot.gridX+1][bot.gridY].targetBot = bot;
			}
			
		}
	}
}
