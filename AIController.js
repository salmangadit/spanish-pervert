/************************************
Done by Salman Gadit (U095146E)
************************************/
function AIController(){
	this.phases = gamePhases;
	this.currentPhaseIndex = 0;
	this.currPhase =  new Phase();
	this.playerLevel = 2;

	this.executePhase = function(){
		//Update JSON objects for current phase
		this.currPhase.phaseName = this.phases[this.currentPhaseIndex].phaseName;
		this.currPhase.wave = this.phases[this.currentPhaseIndex].wave;
		this.currPhase.scenarioRatio = this.phases[this.currentPhaseIndex].scenario;
		this.currPhase.phaseType = this.phases[this.currentPhaseIndex].phaseType;
		this.currPhase.modelKillTime = parseInt(playerLearningModels[currentWave].modelTimeKill);
		this.currPhase.bufferKillTime = parseInt(playerLearningModels[currentWave].bufferTimeKill);
		this.currPhase.modelRescueTime = parseInt(playerLearningModels[currentWave].modelTimeRescue);
		this.currPhase.bufferRescueTime = parseInt(playerLearningModels[currentWave].bufferTimeRescue);

		//Update player learning
		playerLearningObj.updateWaveParameters(this.currPhase.modelKillTime, this.currPhase.bufferKillTime,
									this.currPhase.modelRescueTime, this.currPhase.bufferRescueTime);


		//console.log("Current Phase: " + currentPhase);
		//console.log("Current Wave: " + currentWave);

		//Set spawning params only if attacking phase
		if (this.currPhase.phaseType == "attack"){
			displayMessage("Fight the enemies and save the ladies!")

			//Number of enemies sent AI - send according to scenario ratio
			var parsedPhaseRatio = this.currPhase.scenarioRatio.split(':');
			var alreadyTargeted = new Array();
			var alreadySpawned = new Array();
			var targetingPlayer = 0;

			for (var m = 0; m<parsedPhaseRatio.length; m++){
				
				var chosenTarget = this.targetNPCAI(alreadyTargeted);

				var spawnLocation = this.spawnLocationAI(chosenTarget, alreadySpawned);

				//Find number of enemies to spawn
				//Create a custom randomiser and select type of enemy to spawn according to global ratio
				var monkeyGorillaRandomiser = new Randomiser();

				for (var n = 0; n < parsedPhaseRatio[m]; n++){
					if (n > 0){
						spawnLocation = helperClass.findNearestFreeSpace(parseInt(spawnLocation[0]), 
							parseInt(spawnLocation[1]), 1)
					}
					var isHero = false;
					if (currentPhase == "E" && targetingPlayer < 3){
						chosenTarget = hero;
						targetingPlayer++;
						isHero = true;
					}
					this.enemyStrengthAI(monkeyGorillaRandomiser, chosenTarget, spawnLocation, isHero);
				}
			}
		}
		else{
			displayMessage("Save the ladies and recover health!")
		}
	}

	this.targetNPCAI = function(alreadyTargeted){
		//Figure out the target for this NPC
		var ratio = targetRatio[this.playerLevel];
		var parts = ratio.split(":");
		var pickerArray = new Array();

		for (var i=0; i< parseInt(parts[0]); i++){
			pickerArray.push(0);
		}

		for (var i=0; i< parseInt(parts[1]); i++){
			pickerArray.push(1);
		}

		var targetRandomiser = new Randomiser();
		var targetNPCtype = targetRandomiser.randomise(0, pickerArray.length - 1);
		var chosenTarget;
		var targetFound = false;

		//find appropriate lady, else send to other options
		for (var k=0; k<ladies.length; k++){
			if ((pickerArray[targetNPCtype] == 0 && ladies[k].goodNPC_Type == "fiesty") ||
				(pickerArray[targetNPCtype] == 1 && ladies[k].goodNPC_Type == "thin")){
				
				if (alreadyTargeted.indexOf(k) == -1){
					if(ladies[k].maxOccupant>1){
						alreadyTargeted.push(k);
						chosenTarget = ladies[k]; 
						targetFound = true;
					}
					break;
				}
			}
		}

		if (!targetFound && ladies.length > 0){
			var randomLady;
			do {
				var random = new Randomiser();
				randomLady = random.randomise(0, ladies.length - 1);
			} while (alreadyTargeted.indexOf(randomLady)!= -1 && ladies[randomLady].maxOccupant>1);

			chosenTarget = ladies[randomLady];
			targetFound = true;
			alreadyTargeted.push(randomLady);
		}

		return chosenTarget;		
	}

	this.spawnLocationAI = function(chosenTarget, alreadySpawned){
		//Spawning locations AI
		var locations = spawnLocations[this.playerLevel];

		//Find all distances to target and figure out action
		var distances = new Array();
		var distancesOriginal = new Array();

		for (var i = 0; i < 10; i++){
			var coords = locations[i].split(',');
			distances.push(helperClass.distanceBetweenTwoPoints(parseInt(coords[0]), 
				parseInt(coords[1]), chosenTarget.gridX, chosenTarget.gridY));
			distancesOriginal.push(helperClass.distanceBetweenTwoPoints(parseInt(coords[0]), 
				parseInt(coords[1]), chosenTarget.gridX, chosenTarget.gridY));
		}

		distances.sort(function(a,b){return a - b});
		var spawnLocation;
		var targetRandomiser = new Randomiser();
		var spawnIndex = targetRandomiser.randomise(
			(this.playerLevel == 0 ? this.playerLevel*2:this.playerLevel*2-1), 
			(this.playerLevel == 4 ? this.playerLevel*2:this.playerLevel*2+1));
		var spawnLocationDesired = distances[spawnIndex];

		var trueIndex = distancesOriginal.indexOf(spawnLocationDesired);

		if (alreadySpawned.indexOf(locations[trueIndex])==-1){
			spawnLocation = locations[trueIndex].split(',');
		} else {
			//Return nearest free space
			var coords = locations[trueIndex].split(',');
			spawnLocation = helperClass.findNearestFreeSpace(coords[0], coords[1], 1);
		}

		return spawnLocation;
	}

	this.enemyStrengthAI = function(monkeyGorillaRandomiser, chosenTarget, spawnLocation, isHero){
		var MGratio = monkeyGorillaRatio[this.playerLevel];
		var MGparts = MGratio.split(":");
		var MGpickerArray = new Array();

		//0: Monkey, 1:Gorilla
		for (var i=0; i< parseInt(MGparts[0]); i++){
			MGpickerArray.push(0);
		}

		for (var i=0; i< parseInt(MGparts[1]); i++){
			MGpickerArray.push(1);
		}

		var chosenStrength = monkeyGorillaRandomiser.randomise(0, MGpickerArray.length - 1);

		var reference = Spawner.spawnAt((MGpickerArray[chosenStrength] == 0 ? "monkey":"gorilla"), 
			parseInt(spawnLocation[0]), parseInt(spawnLocation[1]));

		//Set deciphered target
		reference.moveTarget = chosenTarget;
		reference.ladyTarget = chosenTarget;

		console.log("Spawned " + (MGpickerArray[chosenStrength] == 0 ? "monkey":"gorilla")+ " at "
			+ spawnLocation[0] + "," + spawnLocation[1] + " . The target of this NPC is a " +
			chosenTarget.goodNPC_Type + " lady at location " + chosenTarget.gridX + "," + chosenTarget.gridY);
	}

	this.checkEndOfPhase = function(){
		// If the phase is over, call updateForNextPhase function

		// DONE: change for phases with Criticality and NOT objectives.
		// DONE: Add predictor function, and therefore time-based spawner to predict criticality
		// DONE: TO DO: Specific AI situation (gorilla walk away from player / woman if either is crap)
		// DONE: TO DO: Hollywood scenario
		// TO DO: Toggle enemy AI speeds

		var currentCriticalityRequirement = criticalityRequirement[currentPhase];
		if (this.currPhase.phaseType){
			if (this.currPhase.phaseType == "attack"){
				// An attack phase is ended meeting criticality requirement
				if (Criticality.get() >= currentCriticalityRequirement){
					console.log("Changing from Phase: "+ currentPhase + "to next phase");
					this.updateForNextPhase();
				} else {
					if (enemies.length <= 1){
						console.log("Enemies killed but criticality requirement not met. Applying prediction analysis to spawn");
						var projectedCriticality = predictor.getProjectedCriticality();

						//Check if projected criticality will meet criticality requirement and spawn 1
						//else figure out how many to spawn as per phase ratio
						var criticalityDiff = projectedCriticality - Criticality.get();
						var requirementDiff = currentCriticalityRequirement - Criticality.get();

						var numberToSpawn = requirementDiff/criticalityDiff;

						var parsedPhaseRatio = this.currPhase.scenarioRatio.split(':');
						var alreadyTargeted = new Array();
						var alreadySpawned = new Array();

						if (numberToSpawn%2 != 0 && numberToSpawn != 1){
							numberToSpawn--;
						}

						var chosenRatioIndex = parsedPhaseRatio.length - 1;
						for (var i =0; i<parsedPhaseRatio.length; i++){
							if (numberToSpawn < parsedPhaseRatio[i]){
								continue;
							} else {
								chosenRatioIndex = i;
								break;
							}
						}

						var chosenTarget = this.targetNPCAI(alreadyTargeted);
						var spawnLocation = this.spawnLocationAI(chosenTarget, alreadySpawned);
						var monkeyGorillaRandomiser = new Randomiser();
						for (var n = 0; n < parsedPhaseRatio[chosenRatioIndex]; n++){
							if (n > 0){
								spawnLocation = helperClass.findNearestFreeSpace(parseInt(spawnLocation[0]), 
									parseInt(spawnLocation[1]), 1)
							}
							var isHero = false;
							this.enemyStrengthAI(monkeyGorillaRandomiser, chosenTarget, spawnLocation);
						}
					}
				}
			} else if (this.currPhase.phaseType == "defense"){
				//A defense phase is ended by meeting the criticality requirement or savig ladies
				if ((Criticality.get() <= currentCriticalityRequirement || savedLadiesCount == this.currPhase.scenarioRatio)&&(enemies.length == 0)){
					//console.log("Changing from Phase: "+ currentPhase + "to next phase");
					this.updateForNextPhase();
				} else {
					//console.log("Not reached criticality requirement - save ladies or let them heal!")
				}
			}
		}
	}

	this.updateForNextPhase = function(){
		this.currentPhaseIndex++;
		if (this.currentPhaseIndex < 6){
			
			for (var i=0; i< ladies.length; i++){
				ladies[i].spawnTime = Date.now();
			}

			// Update the playerLearning object that the wave objective has been achieved
			playerLearningObj.isCurrentWaveObjectiveAchieved = true;

			//we have more phases to go
			currentPhase = this.phases[this.currentPhaseIndex].phaseName;
			currentWave = this.phases[this.currentPhaseIndex].wave;
			this.executePhase();
		}
		else {
			//End game
			console.log("Game over!");
			displayMessage("Game over!")
		}
	}
}