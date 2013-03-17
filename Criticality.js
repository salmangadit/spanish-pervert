function Criticality(){
	
}


//Criticality is a range between 0 to 90. 0 is MIN criticality and 90 is MAX criticality
Criticality.get = function(){
	var criticality = -1;

	//Player contribution
	var playerCrit = 30 - hero.health;

	//Good NPC contribution
	var goodNPCCritSum = 0;
	var goodNPCCrit = 0;

	for (var i = 0; i < enemies.length; i++){
		goodNPCCritSum += (30 - enemies[i].health);
	}

	if (enemies.length > 0){
		goodNPCCrit = goodNPCCritSum/enemies.length;
	}

	//Bad NPC contribution
	var badNPCCritSum = 0;
	var badNPCCrit = 0;

	for (var i = 0; i < ladies.length; i++){
		badNPCCritSum += (30 - ladies[i].health);
	}

	if (ladies.length > 0){
		badNPCCrit = badNPCCritSum/ladies.length;
	}

	//Criticality inverted
	var critInv = badNPCCrit - playerCrit - goodNPCCrit + 60;

	criticality = 90 - critInv;

	console.log('Criticality is ' + criticality);

	return criticality;
}