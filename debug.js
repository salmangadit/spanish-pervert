//Debug mode

function Debug(){
	renderGrids();
	drawGraphs();
	displayParameters();
}

function renderGrids(){
	debugContext.clearRect(0,0,debugCanvas.width,debugCanvas.height);
	var recImage = new Image();
	recImage.src = "images/rec.png";
	for (var i = 0; i < 33; i++){
		for (var j = 0; j < 28; j++){
			debugContext.drawImage(recImage, i * 32, j * 32, 32, 32);
		}
	}
}

function maintainCritArray(){
	var tmp = 0;
	var newValue = Criticality.get();
	for(var i = 0; i<10; i++){
		tmp = critArray[i];
		critArray[i] = newValue;
		newValue = tmp;		
	}
}

function displayParameters(){
	var textX = gameW+10;
	var textY = 520;
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