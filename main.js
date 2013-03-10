var FPS = 30;
var screenUpdateTime = 1000/FPS;

var canvas;
var context;
var baseCanvas;
var baseContext;
var gameW = 800;
var gameH = 600;
var hero = null;
var virtualGrid = null;

// Variable to hold XML data
var savedData = null;

// Variable to hold the time stamp for the last game loop call
var lastUpdate = null;

// holds the integer size value of each tile in the grid
var tileSize = null;

// array to hold all of the unique game objects from the XML
var gameObjects = null;

// variable to hold the baseColor value for the gamegrid
var baseColor = null;

// array to hold all of the collidable objects we have
var collidables = new Array();

// array to hold all the non-collidable objects we have
var scenery = new Array();

// array to hold all of the enemy objects we have
var enemies = new Array();

// array to hold the good npc's
var ladies = new Array();

var grid = new Array();

var currentPhase = "A";
var currentWave = "1";

var Spawner = new Spawner();
var AI = new AIController();

var rows = 0;
var columns = 0;


function init() {
	xmlhttp = new XMLHttpRequest();
	//http://www.salmangadit.me/spanish-pervert/data/data.xmlC:/Users/Salman/Documents/GitHub/spanish-pervert/data/data.xml
	// /Users/TheGreatOne/Desktop/Sem_6/EE4702/Project/Project_2/spanish-pervert/data/data.xml
	xmlhttp.open("GET", "C:/Users/Salman/Documents/GitHub/spanish-pervert/data/data.xml", false);
	xmlhttp.send();
	xmlDoc = xmlhttp.responseXML;

	savedData = xmlDoc;

	initGameBoard();
	initCanvas();
	initGameTiles();

	lastUpdate = Date.now();
	setInterval(gameLoop, screenUpdateTime);

	document.addEventListener('keydown', function(event) {
		// check if the key being pressed is one of the arrow keys -- 
		// 80 is the p key (punch), 75 is k (kick), 82 is r (rescue)
		if ((event.keyCode < 41 && event.keyCode > 36) || event.keyCode == 80 || event.keyCode == 75 || event.keyCode == 82) {
			// block the default browser action for the arrow keys
			event.preventDefault();

			// check to see if this key is already in the array
			// of keys being pressed, if not add it to the array
			//curKey = $.inArray(event.keyCode, hero.keys);
			if (hero.keys.indexOf(event.keyCode) == -1)
				hero.keys.push(event.keyCode);
		}
	});

	document.addEventListener('keyup', function(event) {
		// check if the key being pressed is one of the arrow keys -- 
		// 80 is the p key (punch), 75 is k (kick), 82 is r (rescue)
		if ((event.keyCode < 41 && event.keyCode > 36) || event.keyCode == 80 || event.keyCode == 75 || event.keyCode == 82) {
			event.preventDefault();

			// check to see if this key is already in the array
			// of keys being pressed, if so remove it from the array
			//curKey = $.inArray(event.keyCode, hero.keys);
			if (hero.keys.indexOf(event.keyCode) > -1)
				hero.keys.splice(hero.keys.indexOf(event.keyCode), 1);
		}
	});

}


function initGameBoard() {
	// if we're IE we have to do a little prep to be able to query with XPath
	if (navigator.appName == "MSIE") {
		savedData.setProperty("SelectionLanguage", "XPath");
	}

	var curItem = null;
	var tmpSpan = "";
	var iter = null;

	// Load in object data using XPath
	if (navigator.appName == "MSIE") {
		iter = savedData.selectNodes("/GameData/Objects/Object");
	} else {
		iter = savedData.evaluate("/GameData/Objects/Object", savedData, null, XPathResult.ANY_TYPE, null);
	}

	curItem = null;
	gameObjects = new Array();
	for (var i = 0, curItem = (iter.length != null ? iter[i] : iter.iterateNext()); curItem; i++, curItem = (iter.length != null ? iter[i] : iter.iterateNext())) {
		// retrieve the associative array index "key"
		var index = curItem.attributes.getNamedItem("id").value;
		// create a new game object to hold the details
		gameObjects[index] = new gameObject();
		// store the width of the game object
		gameObjects[index].width = parseInt(curItem.attributes.getNamedItem("width").value);
		// store the height of the game object
		gameObjects[index].height = parseInt(curItem.attributes.getNamedItem("height").value);
		// store the SRC link for the image for the game object
		gameObjects[index].imageSrc = curItem.attributes.getNamedItem("src").value;
		// store out what type of object this is
		gameObjects[index].type = curItem.attributes.getNamedItem("type").value;
	}

	//Load in grid data using XPath
	if (navigator.appName == "MSIE") {
		iter = savedData.selectNodes("/GameData/Grid");
	} else {
		iter = savedData.evaluate("/GameData/Grid", savedData, null, XPathResult.ANY_TYPE, null);
	}

	// There's only one Grid node, so we just grab it
	curItem = (iter.length != null ? iter[0] : iter.iterateNext());
	tileSize = parseInt(curItem.attributes.getNamedItem("tileSize").value);
	gameW = parseInt(curItem.attributes.getNamedItem("width").value) * tileSize;
	gameH = parseInt(curItem.attributes.getNamedItem("height").value) * tileSize;
	baseColor = curItem.attributes.getNamedItem("baseColor").value;
	
}


function initGameTiles() {
	//Load in grid rows
	if (navigator.appName == "MSIE") {
		iter = savedData.selectNodes("/GameData/Grid/GridRow");
	} else {
		iter = savedData.evaluate("/GameData/Grid/GridRow", savedData, null, XPathResult.ANY_TYPE, null);
	}

	curItem = null;
	var collidableCount = 0;
	var enemyCount = 0;
	var sceneryCount = 0;
	
	
	//Added in by beeb
	var ladiesCount = 0;
	
	for (var i = 0, curItem = (iter.length != null ? iter[i] : iter.iterateNext()); curItem; i++, curItem = (iter.length != null ? iter[i] : iter.iterateNext())) {
		var curRow = curItem.textContent;
		if (curRow === undefined)
			curRow = curItem.text;

		grid[i] = new Array();

		for (var j = 0; j < curRow.length; j++) {
			var objIndex = curRow[j];
			columns = curRow.length;
			if (gameObjects[objIndex].type == "collidable") {
				grid[i][j] = 1;
			} else {
				grid[i][j] = 0;
			}

			if (gameObjects[objIndex].type == "collidable") {
				// Create a new static object
				collidables[collidableCount] = new staticObject();
				// load in the width and height
				collidables[collidableCount].width = gameObjects[objIndex].width;
				collidables[collidableCount].height = gameObjects[objIndex].height;
				// position it based upon where we are in the grid
				collidables[collidableCount].x = (j * tileSize) + 2;
				collidables[collidableCount].y = (i * tileSize) + 2;

				// set up the image to use the value loaded from the XML
				collidables[collidableCount].image = new Image();
				collidables[collidableCount].image.src = gameObjects[objIndex].imageSrc;
				// we are storing out the index of this object, to make sure we can
				// render it once it has loaded
				collidables[collidableCount].image.index = collidableCount;
				collidables[collidableCount].image.onload = function() {
					collidables[this.index].render();
				};
				collidableCount++;
			} else if (gameObjects[objIndex].type == "scenery") {
				// Create a new static object
				scenery[sceneryCount] = new staticObject();
				// load in the width and height
				scenery[sceneryCount].width = gameObjects[objIndex].width;
				scenery[sceneryCount].height = gameObjects[objIndex].height;
				// position it based upon where we are in the grid
				scenery[sceneryCount].x = j * tileSize;
				scenery[sceneryCount].y = i * tileSize;

				// set up the image to use the value loaded from the XML
				scenery[sceneryCount].image = new Image();
				scenery[sceneryCount].image.src = gameObjects[objIndex].imageSrc;
				// we are storing out the index of this object, to make sure we can
				// render it once it has loaded
				scenery[sceneryCount].image.index = sceneryCount;
				scenery[sceneryCount].image.onload = function() {
					scenery[this.index].render();
				};
				sceneryCount++;
			} else if (gameObjects[objIndex].type == "player") {
				//0 is for mainCharacter
				hero = new heroObject(0);
				hero.width = gameObjects[objIndex].width;
				hero.height = gameObjects[objIndex].height;
				hero.x = j * tileSize;
				hero.y = i * tileSize;
				hero.gridX = hero.x / hero.width;
				hero.gridY = hero.y / hero.height;
				hero.image = new Image();
				// set it's image to the proper src URL
				hero.image.src = gameObjects[objIndex].imageSrc;
				// once the image has completed loading, render it to the screen
				hero.image.onload = function() {
					hero.render();
					//hero.render();
				};
				
			} else if (gameObjects[objIndex].type == "monkey" || gameObjects[objIndex].type == "gorilla") {
				// 1 is for monkey_badNPC & 2 is for gorilla_badNPC
				// 3 is for thin_goodNPC  & 4 is for fiesty_goodNPC 
				if(gameObjects[objIndex].type == "monkey"){
					enemies[enemyCount] = new heroObject(1);
				} else {
					enemies[enemyCount] = new heroObject(2);
				}
				
				enemies[enemyCount].width = gameObjects[objIndex].width;
				enemies[enemyCount].height = gameObjects[objIndex].height;
				enemies[enemyCount].x = j * tileSize;
				enemies[enemyCount].y = i * tileSize;
				enemies[enemyCount].gridX = enemies[enemyCount].x / enemies[enemyCount].width;
				enemies[enemyCount].gridY = enemies[enemyCount].y / enemies[enemyCount].height;

				// set the enemy to be moving a random direction at the start
				//enemies[enemyCount].keys[0] = Math.floor(Math.random() * 4) + 37;

				enemies[enemyCount].image = new Image();
				enemies[enemyCount].image.src = gameObjects[objIndex].imageSrc;
				enemies[enemyCount].image.index = enemyCount;
				enemies[enemyCount].image.onload = function() {
					enemies[this.index].render();
				};
				enemyCount++;
			
			} else if (gameObjects[objIndex].type == "thin" || gameObjects[objIndex].type == "fiesty") {
				
				if(gameObjects[objIndex].type == "thin"){
					ladies[ladiesCount] = new heroObject(3);	
				} else {
					ladies[ladiesCount] = new heroObject(4);
				}
				
				ladies[ladiesCount].width = gameObjects[objIndex].width;
				ladies[ladiesCount].height = gameObjects[objIndex].height;
				ladies[ladiesCount].x = j * tileSize;
				ladies[ladiesCount].y = i * tileSize;
				ladies[ladiesCount].gridX = ladies[ladiesCount].x / ladies[ladiesCount].width;
				ladies[ladiesCount].gridY = ladies[ladiesCount].y / ladies[ladiesCount].height;
				
				ladies[ladiesCount].image = new Image();
				ladies[ladiesCount].image.src = gameObjects[objIndex].imageSrc;
				ladies[ladiesCount].image.index = ladiesCount;
				ladies[ladiesCount].image.onload = function(){
					ladies[this.index].render();
				}
				ladiesCount++; 
			}
		}
	}

	rows = grid.length;
}


function initCanvas() {
	// retrieve a reference to the canvas object
	canvas = document.getElementById("mainCanvas");
	// create a context object from our canvas
	context = canvas.getContext("2d");

	// retrieve a reference to the base canvas object
	baseCanvas = document.getElementById("baseCanvas");
	// create a context object from our baseCanvas
	baseContext = baseCanvas.getContext("2d");

	 
	// retrieve a reference to the innerHealthMeter canvas
	iHMCanvas = document.getElementById("innerHealthMeter");
	// create a context object form the innerHealthMeter canvas
	iHMCanvasContext = iHMCanvas.getContext("2d");
	
	// set the width and height of the canvas
	canvas.width = gameW;
	canvas.height = gameH;

	// set the width and height of the baseCanvas
	baseCanvas.width = gameW;
	baseCanvas.height = gameH;
	
	//Set the width and height of the innerHealthMeter canvas
	iHMCanvas.width = gameW;
	iHMCanvas.height = gameH;
	
	baseContext.fillStyle = baseColor;
	// fill the entire baseContext with the color
	baseContext.fillRect(0, 0, gameW, gameH);
	
	/* If i include this piece of code, the whole screen is empty with only the health meter images..
	iHMCanvasContext.fillStyle = baseColor;
	iHMCanvasContext.fillRect(0, 0, gameW, gameH);
	*/
}


function gameLoop() {
	var now = Date.now();
	// calculate how long as passed since our last iteration
	var elapsed = now - lastUpdate;

	canvas.width = gameW;
	canvas.height = gameH;

	var path = new Array();

	// Update the hero based upon how long it took for the game loop
	hero.update(elapsed / screenUpdateTime);

	// draw the player to the screen again
	hero.render();
	
	//-----------------------Max code----------------------------------------
	//for testing purposes, let's make the enemies swarm towards the heroes
	flocker(ladies[0], enemies);
	
	//setting the grid
	VG = setGrid(hero, enemies, ladies);
	
	//collision checking
	//collisionChecker(VG);
	
	Controller(VG, hero,enemies,ladies);
	
	//------------------------End of Max code------------------------------------
	
	// do a foreach type loop through the enemies
	var index = 0;	
	for (curEnemy in enemies) {
		if (enemies[curEnemy].destroyed) {
			enemies.splice(curEnemy, 1);
		} else {
			
			//testing out of the targetGrid system
            var tempGrid = new Array();

            for (var x = 0; x < rows; x++){
            	tempGrid[x] = new Array();
            	for (var y = 0; y < columns; y++ ){
            		tempGrid[x][y] = grid[x][y];
            	}
            }

            for (var i =0; i<enemies.length; i++){
                if (enemies[curEnemy] != enemies[i]){
                    tempGrid[enemies[i].gridY][enemies[i].gridX] = 1;
                }
            }
            //tempGrid[hero.gridY][hero.gridX] = 1;
            path[index] = a_star(new Array(enemies[curEnemy].gridX, enemies[curEnemy].gridY),
			enemies[curEnemy].targetGrid, tempGrid, columns, rows, false);

			//path[index] = a_star(new Array(enemies[curEnemy].gridX, enemies[curEnemy].gridY), enemies[curEnemy].targetGrid, tempGrid, columns, rows, false);

			var nextPoint = path[index][1];

			// check if the enemy collided with a collidable, if it did turn it a random direction
			if (enemies[curEnemy].collision) {
				if (enemies[curEnemy].keys[0] == 37) {
					enemies[curEnemy].keys[0] = 38;
					enemies[curEnemy].lastKeyChange = Date.now();
				} else if (enemies[curEnemy].keys[0] == 38) {
					enemies[curEnemy].keys[0] = 39;
					enemies[curEnemy].lastKeyChange = Date.now();
				} else if (enemies[curEnemy].keys[0] == 39) {
					enemies[curEnemy].keys[0] = 40;
					enemies[curEnemy].lastKeyChange = Date.now();
				} else if (enemies[curEnemy].keys[0] == 40) {
					enemies[curEnemy].keys[0] = 37;
					enemies[curEnemy].lastKeyChange = Date.now();
				}

			} else {

				if (nextPoint) {
					if (nextPoint.x > enemies[curEnemy].gridX) {
						enemies[curEnemy].keys[0] = 39;
						enemies[curEnemy].lastKeyChange = Date.now();
					} else if (nextPoint.x < enemies[curEnemy].gridX) {
						enemies[curEnemy].keys[0] = 37;
						enemies[curEnemy].lastKeyChange = Date.now();
					} else if (nextPoint.y > enemies[curEnemy].gridY) {
						enemies[curEnemy].keys[0] = 40;
						enemies[curEnemy].lastKeyChange = Date.now();
					} else if (nextPoint.y < enemies[curEnemy].gridY) {
						enemies[curEnemy].keys[0] = 38;
						enemies[curEnemy].lastKeyChange = Date.now();
					}
				}
			}

			if (path[index].length == 2){
				enemies[curEnemy].keys.splice(0, 1);
			}

			// Update the enemy based upon how long it took for the game loop
			enemies[curEnemy].update(elapsed / screenUpdateTime);

			// draw the enemy to the screen again
			enemies[curEnemy].render();
		}

		index++;
	}
	
	//Do a for each loop for the ladies as well
	var ladyIndex = 0;
	for (curLady in ladies) {
		if (ladies[curLady].destroyed) {
			ladies.splice(curLady, 1);
		} else {

			//testing out of the targetGrid system
			var tempGrid = new Array();

			for (var x = 0; x < rows; x++) {
				tempGrid[x] = new Array();
				for (var y = 0; y < columns; y++) {
					tempGrid[x][y] = grid[x][y];
				}
			}

			for (var i = 0; i < ladies.length; i++) {
				if (ladies[curLady] != ladies[i]) {
					tempGrid[ladies[i].gridY][ladies[i].gridX] = 1;
				}
			}
			//tempGrid[hero.gridY][hero.gridX] = 1;
			path[ladyIndex] = a_star(new Array(ladies[curLady].gridX, ladies[curLady].gridY), ladies[curLady].targetGrid, tempGrid, columns, rows, false);

			//path[ladyIndex] = a_star(new Array(ladies[curLady].gridX, ladies[curLady].gridY), ladies[curLady].targetGrid, tempGrid, columns, rows, false);

			var nextPoint = path[ladyIndex][1];

			// check if the lady collided with a collidable, if it did turn it a random direction
			if (ladies[curLady].collision) {
				if (ladies[curLady].keys[0] == 37) {
					ladies[curLady].keys[0] = 38;
					ladies[curLady].lastKeyChange = Date.now();
				} else if (ladies[curLady].keys[0] == 38) {
					ladies[curLady].keys[0] = 39;
					ladies[curLady].lastKeyChange = Date.now();
				} else if (ladies[curLady].keys[0] == 39) {
					ladies[curLady].keys[0] = 40;
					ladies[curLady].lastKeyChange = Date.now();
				} else if (ladies[curLady].keys[0] == 40) {
					ladies[curLady].keys[0] = 37;
					ladies[curLady].lastKeyChange = Date.now();
				}

			} else {

				if (nextPoint) {
					if (nextPoint.x > ladies[curLady].gridX) {
						ladies[curLady].keys[0] = 39;
						ladies[curLady].lastKeyChange = Date.now();
					} else if (nextPoint.x < ladies[curLady].gridX) {
						ladies[curLady].keys[0] = 37;
						ladies[curLady].lastKeyChange = Date.now();
					} else if (nextPoint.y > ladies[curLady].gridY) {
						ladies[curLady].keys[0] = 40;
						ladies[curLady].lastKeyChange = Date.now();
					} else if (nextPoint.y < ladies[curLady].gridY) {
						ladies[curLady].keys[0] = 38;
						ladies[curLady].lastKeyChange = Date.now();
					}
				}
			}

			if (path[ladyIndex].length == 2) {
				ladies[curLady].keys.splice(0, 1);
			}

			// Update the lady based upon how long it took for the game loop
			ladies[curLady].update(elapsed / screenUpdateTime);

			// draw the lady to the screen again
			ladies[curLady].render();
		}

		ladyIndex++;
	}
	
	
	// update the lastUpdate variable
	lastUpdate = now;


	//temporarily putting basic AI calls here till controller is up
	AI.executePhase();
}
