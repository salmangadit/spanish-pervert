/* This file creates the Heads Up Display on the screen
 * the static displays are: Hero's health
 * the dynamic displays are:
 		-> message to the player: from AI controller
  		-> frame rate per second: if debug mode is triggered
 */

// For the frame per second display
var fps = 0;
var fpsOut;

// For the hero health 
var healthOut;
var localHeroReference;

// For the message display
var messageOut;

function displayHUD(){
	// Display the hero's health
	displayHeroHealth();
}

function keepHeroReference(thisReference){
	localHeroReference = thisReference;
}

var healthImage = new Image();
healthImage.src = "images/innerHealthMeter.png";
var outerHealthImage = new Image();
outerHealthImage.src = "images/outerHealthMeter.png";
function displayHeroHealth(){
	//healthOut = document.getElementById("hero_health");
	//healthOut.innerHTML = "Your Health: " + (localHeroReference.health * 3.33333).toFixed(5);

	// Draw the health bar also
	gameOverCanvas.width = gameOverCanvas.width;
	gameOverContext.drawImage(healthImage, 1060, 3.0, localHeroReference.health*20, 20);
	//graphCanvas.width = graphCanvas.width;
	graphContext.drawImage(outerHealthImage,1060,3.0,600,20);
}

function displayFPS(thisUpdate){
	fps = 1000 / (Date.now() - thisUpdate);
  	fpsOut = document.getElementById("fps");
  	fpsOut.innerHTML = "Fps: " + fps.toFixed(2);
}

function clearFPS(){
	fpsOut = document.getElementById("fps");
	fpsOut.innerHTML = " ";
}

function displayMessage(thisMessage){
	messageOut = document.getElementById("message");
	messageOut.innerHTML = "Message to the player: " + thisMessage;
}

function clearDisplayMessage(){
	messageOut = document.getElementById("message");
	messageOut.innerHTML = "";
}