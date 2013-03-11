function AIController(){
	this.phases = gamePhases;
	this.strategies = gameStrategies;
	this.currentPhaseIndex = 0;
	this.currPhase =  new Phase();

	var playerLevel = "medium";

	this.executePhase = function(){
		//Update JSON objects for current phase
		this.currPhase.phaseName = this.phases[this.currentPhaseIndex].phaseName;
		this.currPhase.wave = this.phases[this.currentPhaseIndex].wave;
		this.currPhase.scenarioRatio = this.phases[this.currentPhaseIndex].scenario;
		this.currPhase.phaseType = this.phases[this.currentPhaseIndex].phaseType;

		console.log("Current Phase: " + currentPhase);
		console.log("Current Wave: " + currentWave);

		//Now pick out appropriate wave details and update strategy for phase
		for (var j= 0; j< this.strategies.length; j++){
			if (this.strategies[j].wave == this.currPhase.wave){
				this.currPhase.attackStrategy = this.strategies[j].attack;
				this.currPhase.defenseStrategy = this.strategies[j].target;
			}
		}

		//Set spawning params only if attacking phase
		if (this.currPhase.phaseType == "attack"){
			if (playerLevel == "medium"){
				//Spawn enemy
				for (var key in this.currPhase.attackStrategy.medium) {
					// Where to spawn le NPC, choose random location as per strategy
					var randomNumber = Math.floor(Math.random()*10);
					var spawnLocation = spawnLocations.medium[randomNumber];
					var coords = spawnLocation.split(",");

					//Type of NPC to spawn
				  	if (this.currPhase.attackStrategy.medium.hasOwnProperty(key)) {
	    				//Spawn different levels of attackers for that location
	    				for (var i=0; i<this.currPhase.attackStrategy.medium[key].length; i++){
	    					if (this.currPhase.attackStrategy.medium[key][i] == "w"){
	    						//console.log('Spawn a weak one here');
	    						Spawner.spawnAt("monkey", parseInt(coords[0]), parseInt(coords[1]),1);
	    						console.log("Spawned monkey at " + coords[0] + "," + coords[1]);
	    					} else {
	    						//console.log('Spawn a strong one here');
	    						Spawner.spawnAt("gorilla", parseInt(coords[0]), parseInt(coords[1]),1);
	    						console.log("Spawned gorilla at " + coords[0] + "," + coords[1]);
	    					}
	    				}
	    				console.log(key + " -> " + this.currPhase.attackStrategy.medium[key]);
	  				}
				}
			} else if (playerLevel == "hard"){
				//Spawn enemy
				for (var key in this.currPhase.attackStrategy.hard) {
					// Where to spawn le NPC, choose random location as per strategy
					var randomNumber = Math.floor(Math.random()*10);
					var spawnLocation = spawnLocations.hard[randomNumber];
					var coords = spawnLocation.split(",");

					//Type of NPC to spawn
				  	if (this.currPhase.attackStrategy.hard.hasOwnProperty(key)) {
	    				//Spawn different levels of attackers for that location
	    				for (var i=0; i<this.currPhase.attackStrategy.hard[key].length; i++){
	    					if (this.currPhase.attackStrategy.hard[key][i] == "w"){
	    						//console.log('Spawn a weak one here');
	    						Spawner.spawnAt("monkey", parseInt(coords[0]), parseInt(coords[1]),1);
	    						console.log("Spawned monkey at " + coords[0] + "," + coords[1]);
	    					} else {
	    						//console.log('Spawn a strong one here');
	    						Spawner.spawnAt("gorilla", parseInt(coords[0]), parseInt(coords[1]),1);
	    						console.log("Spawned gorilla at " + coords[0] + "," + coords[1]);
	    					}
	    				}
	    				console.log(key + " -> " + this.currPhase.attackStrategy.hard[key]);
	  				}
				}
			} else if (playerLevel == "easy"){
				//Spawn enemy
				for (var key in this.currPhase.attackStrategy.easy) {
					// Where to spawn le NPC, choose random location as per strategy
					var randomNumber = Math.floor(Math.random()*10);
					var spawnLocation = spawnLocations.easy[randomNumber];
					var coords = spawnLocation.split(",");

					//Type of NPC to spawn
				  	if (this.currPhase.attackStrategy.easy.hasOwnProperty(key)) {
	    				//Spawn different levels of attackers for that location
	    				for (var i=0; i<this.currPhase.attackStrategy.easy[key].length; i++){
	    					if (this.currPhase.attackStrategy.easy[key][i] == "w"){
	    						//console.log('Spawn a weak one here');
	    						Spawner.spawnAt("monkey", parseInt(coords[0]), parseInt(coords[1]),1);
	    						console.log("Spawned monkey at " + coords[0] + "," + coords[1]);
	    					} else {
	    						//console.log('Spawn a strong one here');
	    						Spawner.spawnAt("gorilla", parseInt(coords[0]), parseInt(coords[1]),1);
	    						console.log("Spawned gorilla at " + coords[0] + "," + coords[1]);
	    					}
	    				}
	    				console.log(key + " -> " + this.currPhase.attackStrategy.easy[key]);
	  				}
				}
			}
		}

		/*Next steps
		1. DONE. Set parameters to spawn the required scenario
		2. Set targets for each spawn
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