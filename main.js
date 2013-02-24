var FPS = 30;
var screenUpdateTime = 1000/FPS;

var canvas;
var context;
var gameW = 800;
var gameH = 600;
var hero = null;

function init() {
    // retrieve a reference to the cavas object
    canvas = document.getElementById("mainCanvas");
    // create a context object from our canvas
    context = canvas.getContext("2d");

    // set the width and height of the canvas
    canvas.width = gameW;
    canvas.height = gameH;
}