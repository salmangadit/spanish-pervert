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

		console.log("Current Phase: " + currentPhase);
		console.log("Current Wave: " + currentWave);

		//Set spawning params only if attacking phase
		if (this.currPhase.phaseType == "attack"){
			//Figure out the target for this NPC
			var ratio = targetRatio[this.playerLevel];
			var parts = ratio.split(":");
			var pickerArray = new Array();

			for (var i=0; i<= parseInt(parts[0]); i++){
				pickerArray.push(0);
			}

			for (var i=0; i<= parseInt(parts[1]); i++){
				pickerArray.push(1);
			}

			var targetRandomiser = new Randomiser();
			var targetNPCtype = targetRandomiser.randomiseArray(pickerArray);
			var chosenTarget;
			var targetFound = false;

			//find appropriate lady, else send to other options
			for (var k=0; k<ladies.length; k++){
				if ((targetNPCtype == 0 && ladies[k].goodNPC_Type == "fiesty") ||
					(targetNPCtype == 1 && ladies[k].goodNPC_Type == "thin")){
					chosenTarget = ladies[k]; 
					targetFound = true;
					break;
				}
			}

			if (!targetFound && ladies.length > 0){
					var random = new Randomiser();
					var randomLady = random.randomise(0, ladies.length - 1);
					chosenTarget = ladies[randomLady];
					targetFound = true;
			}

			//Spawning locations AI
			var locations = spawnLocations[this.playerLevel];

			//Find all distances to target and figure out action
			var distances = new Array();

			for (var i = 0; i < 10; i++){
				var coords = locations[i].split(',');
				distances.push(helperClass.distanceBetweenTwoPoints(parseInt(coords[0]), 
					parseInt(coords[1]), chosenTarget.gridX, chosenTarget.gridY));
			}

			distances.sort();
			var spawnIndex = targetRandomiser.randomise(this.playerLevel*2, this.playerLevel*2+1);
			var spawnLocation = locations[spawnIndex];

			//Number of enemies sent AI
			var a;

			//Enemy strength AI
		}

		/*Next steps
		1. DONE. Set parameters to spawn the required scenario
		2. DONE. Set targets for each spawn
		3. DONE. Set spawn location as per strategy
		4. DONE (temp) Execute phase globally, by calling Spawner.Execute;
		5. DONE Put a checker for end of phase? This should (probably) run on its own thread
		*/

		//console.log("Found current phase details");
	}

	this.checkEndOfPhase = function(){
		// If the phase is over, call updateForNextPhase function
		if (this.currPhase.phaseType){
			if (this.currPhase.phaseType == "attack"){
				// An attack phase is ended by killing all enemies
				if (enemies.length == 0){
					console.log("Changing from Phase: "+ currentPhase + "to next phase");
					this.updateForNextPhase();
				}
			}
			else if (this.currPhase.phaseType == "defense"){
				//A defense phase is ended by saving the required total of ladies saved
				if (savedLadiesCount >= this.currPhase.scenarioRatio){
					console.log("Changing from Phase: "+ currentPhase + "to next phase");
					this.updateForNextPhase();
				}
			}
		}
	}

	this.updateForNextPhase = function(){
		this.currentPhaseIndex++;
		if (this.currentPhaseIndex < 10){
			
			for (var i=0; i< ladies.length; i++){
				ladies[i].spawnTime = new Date();
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
		}
	}
}