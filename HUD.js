
// For the frame per second display
var fps = 0;
var fpsOut;

// For the hero health 
var healthOut;
var localHeroReference;

// For the message display
var messageOut;

function displayHUD(){
	//console.log('the update received is: ' + thisUpdate);
	// Display the hero's health
	displayHeroHealth();

	// Display message --for now this is a manual case later it would be called directly
	// by salman
	displayMessage("hiiiiiii Playaaaa");
}


function keepHeroReference(thisReference){
	localHeroReference = thisReference;
}

function displayHeroHealth(){
	healthOut = document.getElementById("hero_health");
	healthOut.innerHTML = "Your Health: " + (localHeroReference.health * 3);
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