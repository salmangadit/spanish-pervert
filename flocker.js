var FT = 3;
//Number of flocker bots surrounding target type in order to activate flocking
var GT = 5;
//Threshold for grids around target bots so as to be considered for flocking

function flocker(target, flocker){
	var flockers = new Array();
	var index = 0;
	
	//loop through all flockers, and check if they are in the same vicinity as target
	for (iter in flocker){
		//sets the default targetGrid
		flocker[iter].targetGrid = new Array(5,20);
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

//takes in 2 parameters, bot referring to self, and VG which is the virtual grid
function collisionChecker(VG){
	for (var i = 0; i < 32; i++){
		for (var j = 0; j < 32; j++){
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