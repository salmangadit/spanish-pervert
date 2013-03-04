var FT = 4;
//Number of flocker bots surrounding target type in order to activate flocking
var GT = 3;
//Threshold for grids around target bots so as to be considered for flocking

function flocker(target, flocker){
	var flockers = new Array();
	var index = 0;
	
	//loop through all flockers, and check if they are in the same vicinity as target
	for (iter in flocker){
		//sets the default targetGrid
		if (flocker[iter].gridX <= target.gridX + GT && 
			flocker[iter].gridX >= target.gridX - GT &&
			flocker[iter].gridY <= target.gridY + GT &&
			flocker[iter].gridY >= target.gridY - GT){
				flockers[index] = flocker[iter];
				index++;
			}
	}
	if(index >= FT){
		for (curFlocker in flockers){
			flockers[curFlocker].targetGrid = new Array(target.gridX, target.gridY);
		}
	}
}	

//puts all the gameObjects into a virtual grid for collision checking
//The grid is basically a 25x19 grid, with each grid being size 32
function setGrid(hero, enemies /*, girls*/){
	VG = new Array();
	for (var i = 0; i < 20; i++){
		VG[i] = new Array();
		for (var j = 0; j < 12; j++){
			VG[i][j] = new Array();
			//VG[i][j][0] = 0;
		}
	}
	VG[hero.gridX][hero.gridY][VG[hero.gridX][hero.gridY].length] = hero;
	hero.actionType = 0;	//resets actionType
	for (iter in enemies){
		//slots the gameObject into its grid
		VG[enemies[iter].gridX][enemies[iter].gridY][VG[enemies[iter].gridX][enemies[iter].gridY].length] = enemies[iter];
		enemies[iter].actionType = 0;	//resets actionType
	}
	
	//console.log(VG[19][11].length);
	return VG;
}

function separation(){
}

function collisionChecker(VG){
	for (var i = 0; i < 20; i++){
		for (var j = 0; j < 12; j++){
			if (VG[i][j].length >= 2){
				//check thru array
				ArrayChecker(VG[i][j]);
			}
		}
	}
}

function ArrayChecker(array){
	for (var m = 0; m < array.length; m++){
		for (var n = m + 1; n < array.length; n++){
			checker(array[m], array[n]);
		}
	}
}

function checker(o1,o2){
	if (helperClass.checkIfTwoRectanglesIntersect(	o1.x,o1.y,o1.width,o1.height,
										o2.x,o2.y,o2.width,o2.height))
		if(o1.selfType == 0 && o2.selfType == 1){
			o1.actionType = 1;
			o2.actionType = 2;	//attack player
		}
		if(o1.selfType == 1 && o2.selfType != o1.selfType){
			//implies it is a girl collision with enemy as there'll never be a situation
			//where o1.selfType == 0 and o2.selfType == 1, due to the way the objects are slotted
			o1.actionType = 1;	//attack girl
		}
		else if(o1.selfType == o2.selfType){
			//both are of similar types with each other, then they just continue moving
			o1.actionType = o2.actionType = 0;
		}
}