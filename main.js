var FPS = 30;
var screenUpdateTime = 1000/FPS;

var canvas;
var context;
var baseCanvas;
var baseContext;
var gameW = 800;
var gameH = 600;
var hero = null;

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

function init() {
  xmlhttp=new XMLHttpRequest();

  xmlhttp.open("GET","http://www.salmangadit.me/spanish-pervert/data/data.xml",false);
  xmlhttp.send();
  xmlDoc=xmlhttp.responseXML;

  savedData = xmlDoc;

  initGameBoard();
  initCanvas();
  initGameTiles();

  lastUpdate = Date.now();
  setInterval(gameLoop, screenUpdateTime);

  document.addEventListener('keydown', function(event) {
    // check if the key being pressed is one of the arrow keys
    if (event.keyCode < 41 && event.keyCode > 36)
    {
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
    if (event.keyCode < 41 && event.keyCode > 36)
    {
        // block the default browser action for the arrow keys
        event.preventDefault();

        // check to see if this key is already in the array
        // of keys being pressed, if so remove it from the array
        //curKey = $.inArray(event.keyCode, hero.keys);
        if (hero.keys.indexOf(event.keyCode) > -1)
            hero.keys.splice(hero.keys.indexOf(event.keyCode), 1);
    }
  });
}

function initGameBoard(){
  // if we're IE we have to do a little prep to be able to query with XPath
  if (navigator.appName == "MSIE")
  {
    savedData.setProperty("SelectionLanguage", "XPath");
  }

  var curItem = null;
  var tmpSpan = "";
  var iter = null;

    // Load in object data using XPath
    if (navigator.appName == "MSIE")
    {
      iter = savedData.selectNodes("/GameData/Objects/Object");
    }
    else
    {
      iter = savedData.evaluate("/GameData/Objects/Object", savedData, null, XPathResult.ANY_TYPE, null);
    }

    curItem = null;
    gameObjects = new Array();
    for (var i = 0, curItem = (iter.length != null ? iter[i] : iter.iterateNext()); curItem; i++, curItem = (iter.length != null ? iter[i] : iter.iterateNext()))
    {
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
    if (navigator.appName == "MSIE")
    {
        iter = savedData.selectNodes("/GameData/Grid");
    }
    else
    {
        iter = savedData.evaluate("/GameData/Grid", savedData, null, XPathResult.ANY_TYPE, null);
    }

    // There's only one Grid node, so we just grab it
    curItem = (iter.length != null ? iter[0] : iter.iterateNext());
    tileSize = parseInt(curItem.attributes.getNamedItem("tileSize").value);
    gameW = parseInt(curItem.attributes.getNamedItem("width").value) * tileSize;
    gameH = parseInt(curItem.attributes.getNamedItem("height").value) * tileSize;
    baseColor = curItem.attributes.getNamedItem("baseColor").value;
}

function initGameTiles(){
  //Load in grid rows
    if (navigator.appName == "MSIE")
    {
        iter = savedData.selectNodes("/GameData/Grid/GridRow");
    }
    else
    {
        iter = savedData.evaluate("/GameData/Grid/GridRow", savedData, null, XPathResult.ANY_TYPE, null);
    }

    curItem = null;
    var collidableCount = 0;
    var enemyCount = 0;
    var sceneryCount = 0;

    for (var i = 0, curItem = (iter.length != null ? iter[i] : iter.iterateNext()); curItem; i++, curItem = (iter.length != null ? iter[i] : iter.iterateNext()))
    {
        var curRow = curItem.textContent;
        if (curRow === undefined)
            curRow = curItem.text;

        for (var j = 0; j < curRow.length; j++)
        {
            var objIndex = curRow[j];

            if (gameObjects[objIndex].type == "collidable")
            {
                // Create a new static object
                collidables[collidableCount] = new staticObject();
                // load in the width and height
                collidables[collidableCount].width = gameObjects[objIndex].width;
                collidables[collidableCount].height = gameObjects[objIndex].height;
                // position it based upon where we are in the grid
                collidables[collidableCount].x = j * tileSize;
                collidables[collidableCount].y = i * tileSize;

                // set up the image to use the value loaded from the XML
                collidables[collidableCount].image = new Image();
                collidables[collidableCount].image.src = gameObjects[objIndex].imageSrc;
                // we are storing out the index of this object, to make sure we can 
                // render it once it has loaded
                collidables[collidableCount].image.index = collidableCount;
                $(collidables[collidableCount].image).load(function ()
                {
                    collidables[this.index].render();
                });
                collidableCount++;
            }
            else if (gameObjects[objIndex].type == "scenery")
            {
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
                $(scenery[sceneryCount].image).load(function ()
                {
                    scenery[this.index].render();
                });
                sceneryCount++;
            }
            else if (gameObjects[objIndex].type == "player")
            {
                hero = new heroObject();
                hero.width = gameObjects[objIndex].width;
                hero.height = gameObjects[objIndex].height;
                hero.x = j * tileSize;
                hero.y = i * tileSize;

                hero.image = new Image();
                // set it's image to the proper src URL
                hero.image.src = gameObjects[objIndex].imageSrc;
                // once the image has completed loading, render it to the screen
                hero.image.onload = function ()
                {
                    hero.render();
                };
            }
            else if (gameObjects[objIndex].type == "enemy")
            {
                enemies[enemyCount] = new heroObject();
                enemies[enemyCount].width = gameObjects[objIndex].width;
                enemies[enemyCount].height = gameObjects[objIndex].height;
                enemies[enemyCount].x = j * tileSize;
                enemies[enemyCount].y = i * tileSize;
                // set the enemy to be moving a random direction at the start
                enemies[enemyCount].keys[0] = Math.floor(Math.random() * 4) + 37;

                enemies[enemyCount].image = new Image();
                enemies[enemyCount].image.src = gameObjects[objIndex].imageSrc;
                enemies[enemyCount].image.index = enemyCount;
                $(enemies[enemyCount].image).load(function ()
                {
                    enemies[this.index].render();
                });
                enemyCount++;
            }
        }
    }
}

function initCanvas()
{
  // retrieve a reference to the canvas object
  canvas = document.getElementById("mainCanvas");
  // create a context object from our canvas
  context = canvas.getContext("2d");

  // retrieve a reference to the base canvas object
  baseCanvas = document.getElementById("baseCanvas");
  // create a context object from our baseCanvas
  baseContext = baseCanvas.getContext("2d");

  // set the width and height of the canvas
  canvas.width = gameW;
  canvas.height = gameH;

  // set the width and height of the baseCanvas
  baseCanvas.width = gameW;
  baseCanvas.height = gameH;
}

function gameLoop()
{
  var now = Date.now();
  // calculate how long as passed since our last iteration
  var elapsed = now - lastUpdate;

  canvas.width = gameW;
  canvas.height = gameH;

  // Update the hero based upon how long it took for the game loop
  hero.update(elapsed / screenUpdateTime);

  // draw the player to the screen again
  hero.render();

  // update the lastUpdate variable
  lastUpdate = now;
}