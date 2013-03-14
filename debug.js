//Debug mode

function Debug(){
	renderGrids();
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