function Criticality(){
	
}


//Criticality is a range between 0 to 90. 0 is MIN criticality and 90 is MAX criticality
Criticality.get = function(){
	var criticality = -1;

	//Player contribution
	var playerCrit = 30 - ((hero.health*3)/10);

	//Bad NPC contribution
	var badNPCCritSum = 0;
	var badNPCCrit = 0;

	for (var i = 0; i < enemies.length; i++){
		badNPCCritSum += (30 - ((enemies[i].health*3)/10));
	}

	if (enemies.length > 0){
		badNPCCrit = badNPCCritSum/enemies.length;
	}
	
	//Good NPC contribution
	var goodNPCCritSum = 0;
	var goodNPCCrit = 0;
	for (var i = 0; i < ladies.length; i++){
		goodNPCCritSum += (30 - (ladies[i].health*3)/10);
	}

	if (ladies.length > 0){
		goodNPCCrit = goodNPCCritSum/ladies.length;
	}

	//Criticality inverted
	var critInv = badNPCCrit - playerCrit - goodNPCCrit + 60;

	criticality = 90 - critInv;

	console.log('Criticality is ' + criticality);

	return criticality;
}