function Spawner(){
	//Objective - To spawn required NPC at target location
	var TILE_SIZE = 32;
	var NPC_GOOD_WEAK_SRC = "images/shy_32x32.png";
	var NPC_GOOD_STRONG_SRC = "images/fiesty-move.png";
	var NPC_BAD_WEAK_SRC = "images/monkey_32x32.png";
	var NPC_BAD_STRONG_SRC = "images/gorilla-move.png";
	
	//spawnAt is used to spawn 1 enemy
	//NPCType should be "monkey", "gorilla", "thin", "feisty"
	this.spawnSingleAt = function(NPCType, locationX, locationY){
		if (NPCType == "monkey" || NPCType == "gorilla"){
			if (NPCType == "monkey"){
				enemies[enemies.length] = new heroObject(1);
				enemies[enemies.length-1].image = new Image();
				enemies[enemies.length-1].image.index = enemies.length-1;
				enemies[enemies.length-1].image.src = NPC_BAD_WEAK_SRC;
			} else {
				enemies[enemies.length] = new heroObject(2);
				enemies[enemies.length-1].image = new Image();
				enemies[enemies.length-1].image.index = enemies.length-1;
				enemies[enemies.length-1].image.src = NPC_BAD_STRONG_SRC;
			}
			
			enemies[enemies.length-1].width = TILE_SIZE;
			enemies[enemies.length-1].height = TILE_SIZE;
			enemies[enemies.length-1].x = locationX * TILE_SIZE;
			enemies[enemies.length-1].y = locationY * tileSize;
			enemies[enemies.length-1].gridX = locationX;
			enemies[enemies.length-1].gridY = locationY;
			enemies[enemies.length-1].image.onload = function() {
				enemies[this.index].render();
			};
		}
		else if (NPCType == "thin" || NPCType == "feisty"){
			if (NPCType == "thin"){
				ladies[ladies.length] = new heroObject(3);
				ladies[ladies.length-1].image = new Image();
				ladies[ladies.length-1].image.index = ladies.length-1;
				ladies[ladies.length-1].image.src = NPC_GOOD_WEAK_SRC;
			} else {
				ladies[ladies.length] = new heroObject(4);
				ladies[ladies.length-1].image = new Image();
				ladies[ladies.length-1].image.index = ladies.length-1;
				ladies[ladies.length-1].image.src = NPC_GOOD_STRONG_SRC;
			}
			
			ladies[ladies.length-1].width = TILE_SIZE;
			ladies[ladies.length-1].height = TILE_SIZE;
			ladies[ladies.length-1].x = locationX * TILE_SIZE;
			ladies[ladies.length-1].y = locationY * tileSize;
			ladies[ladies.length-1].gridX = locationX;
			ladies[ladies.length-1].gridY = locationY;
			ladies[ladies.length-1].image.onload = function() {
				ladies[this.index].render();
			};
		}
	}

	this.spawnAt = function(NPCType, locationX, locationY, numberOfNPCs){
		for (var i =0; i < numberOfNPCs; i++){
			this.spawnSingleAt(NPCType, locationX, locationY);
		}
	}
}