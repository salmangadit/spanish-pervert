var FPS = 30;
var screenUpdateTime = 1000/FPS;

var canvas;
var context;
var baseCanvas;
var baseContext;
var gameW = 800;
var gameH = 600;
var hero = null;

// Variable to hold the time stamp for the last game loop call
var lastUpdate = null;

function init() {
    initCanvas();
    initHero();

    lastUpdate = Date.now();
    setInterval(gameLoop, screenUpdateTime);
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

function initHero()
{
    //  // instantiate a heroObject
    // hero = new heroObject();
    // // set its image to the proper src URL
    // hero.image.src = "";
    // // once the image has completed loading, render it to the screen
    // hero.image.onload = function()
    // {
    //     hero.render();
    // };
}

function gameLoop()
{
    var now = Date.now();
    // calculate how long as passed since our last iteration
    var elapsed = now - lastUpdate;

    canvas.width = gameW;
    canvas.height = gameH;

    // draw the player to the screen again
    hero.render();

    // update the lastUpdate variable
    lastUpdate = now;
}