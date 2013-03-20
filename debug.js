//Debug mode
var lastCritUpdate = Date.now();

function Debug(){
	renderGrids();
	drawGraphs();
	displayParameters();
}

function renderGrids(){
	debugContext.clearRect(0,0,debugCanvas.width,debugCanvas.height);
	var recImage = new Image();
	var rescueRecImage = new Image();
	rescueRecImage.src = "images/rescueRec.png";
	recImage.src = "images/rec.png";
	for (var i = 0; i < 33; i++){
		for (var j = 0; j < 28; j++){
			debugContext.drawImage(recImage, i * 32, j * 32, 32, 32);
			if(	VG[i][j]!= null && 
				(VG[i][j].selfType == 3 || VG[i][j].selfType == 4) &&
				VG[i][j].actionType == 3){
				debugContext.drawImage(rescueRecImage, i*32, j*32, 32, 32);
			}
		}
	}

	var locations = spawnLocations[AI.playerLevel];

	for (var i = 0; i < 10; i++){
		var coords = locations[i].split(',');
		debugContext.drawImage(rescueRecImage, coords[0]*32, coords[1]*32, 32, 32);
	}
}

function maintainCritArray(){
	if (Date.now() - lastCritUpdate >= 1000){
		var newValue = Criticality.get();
		critArray.push(newValue);

		if (critArray.length > 10){
			critArray.shift();
		}
		lastCritUpdate = Date.now();
	}
}

function displayParameters(){
	var textX = gameW+30;
	var textY = 320;
	debugContext.fillStyle = "rgb(0,0,0)";
	debugContext.font = "18px Helvetica";
	
	/* To add in new lines for data, copy these 2 lines of codes:
		debugContext.fillText("YOUR TEXT " + YOUR_PARAMETER, textX, textY);
		textY+=20;
	*/		
	
	
	debugContext.fillText("Current AI Phase is: " + currentPhase, textX, textY);
	textY+=20;
	debugContext.fillText("Current AI Wave is: " + currentWave, textX, textY);
	textY+=20;
	debugContext.fillText("Ladies saved: " + savedLadiesCount, textX, textY);
	textY+=20;
	debugContext.fillText("Ladies left on field: " + ladies.length, textX, textY);
	textY+=20;
	debugContext.fillText("Enemies destroyed: " + enemyDestroyCount, textX, textY);
	textY+=20;
	debugContext.fillText("Criticality: " + Criticality.get(), textX, textY);
	textY+=20;
	debugContext.fillText("Projected criticality: " + predictor.getProjectedCriticality(), textX, textY);
	textY+=20;

	var criticalityDiff = (predictor.getProjectedCriticality() - Criticality.get())
	var requirementDiff = criticalityRequirement[currentPhase] - Criticality.get();
	var numberToSpawn = requirementDiff/criticalityDiff;

	debugContext.fillText("Projected spawn: " + numberToSpawn, textX, textY);
	textY+=20;
	textY+=20;
	debugContext.fillText("Required criticality to change: " + criticalityRequirement[currentPhase], textX, textY);
	textY+=20;

	debugContext.fillText("Player level: " + AI.playerLevel, textX, textY);
	textY+=20;
	debugContext.fillText("Enemy info: ", textX, textY);
	textY+=20;
	textY+=20;

	//Enemy, their health and target
	for (var i =0; i < enemies.length; i++){
		debugContext.fillText("Type: " + enemies[i].badNPC_Type + " , Health: " + enemies[i].health + 
			(enemies[i].moveTarget ? ", Target: " + enemies[i].moveTarget.goodNPC_Type : ""), textX, textY);
		textY+=20;
	}
	textY+=20;
	debugContext.fillText("Lady info: ", textX, textY);
	textY+=20;

	for (var i =0; i < ladies.length; i++){
		debugContext.fillText("Type: " + ladies[i].goodNPC_Type + " , Health: " + ladies[i].health, textX, textY);
		textY+=20;
	}
	
	var maxOccValue = false;
	
	for(iter in collidables){
		if(collidables[iter].maxOccupants<0){
			maxOccValue = true;
		}
	}
	if(maxOccValue == true){
		debugContext.fillText("Max occupants less than 0", textX, textY);
		textY+=20;
	}
	else{
		debugContext.fillText("Nothing wrong", textX, textY);
		textY+=20;
	}
	
	debugContext.fillText("Player health: " + hero.health, textX, textY);
	textY+=20;
	textY+=20;
	if(AImanipulated){
		debugContext.fillText("Specific AI kicks in!", textX, textY);
		textY+=20;
	}
	debugContext.fillText("Lion action type: " + lion.actionType, textX, textY);
	textY+=20;
	
	
}

function drawGraphs(){
	maintainCritArray();
	graphContext.clearRect(0,0,graphCanvas.width,graphCanvas.height);
	//console.log(critArray[0]+","+critArray[1]+","+critArray[2]+","+critArray[3]+"," +critArray[4]+","+
		//		critArray[5]+","+critArray[6]+","+critArray[7]+","+critArray[8]+","+critArray[9]);
	var line = new RGraph.Line('graphCanvas', critArray);
	//graphContext.translate(gameW, 0);
	line.Draw();
}