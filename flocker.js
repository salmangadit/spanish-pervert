var FT = 5;	//Number of flocker bots surrounding target type in order to activate flocking
var GT = 3;	//Threshold for grids around target bots so as to be considered for flocking

//for virtual grid, 1 represents flocker
//0 represents not taken
function flocker(target, flocker){
	var flockers = new Array();
	var index = 0;
	var OGrid = new Array();
	//iniitializes virtual grid
	for (var i=0;i<25;i++){
		OGrid[i]=new Array();
		for (var j=0;j<18;j++){
			OGrid[i][j] = null;
		}
	}
	//puts the flocker bots into the virtual grid
	for(iter in flocker){
		OGrid[flocker[iter].gridX][flocker[iter].gridY] = flocker;
		//for now, i set default targetGrid as [0,0] in order to see the effect
		flocker[iter].targetGrid = new Array(0,0);
	}
	for(curTarget in target){
		//check for flocker bots in vicinity based on the grid
		for(var i=target[curTarget].gridX - GT;i<target[curTarget].gridX + GT;i++){
			for(var j=target[curTarget].gridY - GT;j<target[curTarget].gridX + GT;j++){
				//if there exists a flocker bot in the surrounding area
				if(OGrid[i][j] != null){
					//put that flocker bot into a flockers array
					flockers[index] = OGrid[i][j];
					index++;
				}
			}
		}
		//if the total number of flockers surrounding the target is more than FT
		if(flockers.length>=FT){
			//set the flockers to move towards target, based on a_path algorithm
			for(curFlocker in flockers){
				flockers[curFlocker].targetGrid 
					= new Array(target[curTarget].gridX ,target[curTarget].gridY);
			}
		}
		else{
			//it just means that there's no need to flock, might not need this else statement
			/*	in a way, this else statement can also be used to define where the flockers
				would move to in the case where separation occurs*/
		}		
	}
}

