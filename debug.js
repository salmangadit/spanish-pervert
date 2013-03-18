//Debug mode

function Debug(){
	renderGrids();
	drawGraphs();
}

function renderGrids(){
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

function drawGraphs(){
	maintainCritArray();
	graphContext.clearRect(0,0,graphCanvas.width,graphCanvas.height);
	//console.log(critArray[0]+","+critArray[1]+","+critArray[2]+","+critArray[3]+"," +critArray[4]+","+
		//		critArray[5]+","+critArray[6]+","+critArray[7]+","+critArray[8]+","+critArray[9]);
	var line = new RGraph.Line('graphCanvas', critArray);
	//graphContext.translate(gameW, 0);
	line.Draw();
}