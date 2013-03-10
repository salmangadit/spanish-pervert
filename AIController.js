function AIController(){
	this.phases = gamePhases;
	this.strategies = gameStrategies;
	this.currentPhaseIndex = 0;
	var currPhase =  new Phase();

	this.executePhase = function(){
		//Update JSON objects for current phase
		currPhase.phaseName = this.phases[this.currentPhaseIndex].phaseName;
		currPhase.wave = this.phases[this.currentPhaseIndex].wave;
		currPhase.scenarioRatio = this.phases[this.currentPhaseIndex].scenario;
		currPhase.phaseType = this.phases[this.currentPhaseIndex].phaseType;

		//Now pick out appropriate wave details and update strategy for phase
		for (var j= 0; j< this.strategies.length; j++){
			if (this.strategies[j].wave == currPhase.wave){
				currPhase.attackStrategy = this.strategies[j].attack;
				currPhase.defenseStrategy = this.strategies[j].target;
			}
		}

		/*Next steps
		1. Set parameters to spawn the required scenario
		2. Set targets for each spawn
		3. Set spawn location as per strategy
		4. Execute phase globally, by calling Spawner.Execute;
		5. Put a checker for end of phase? This should (probably) run on its own thread
		*/

		//console.log("Found current phase details");
	}

	this.checkEndOfPhase = function(){
		// If the phase is over, call updateForNextPhase function
		if (currPhase.phaseType){
			if (currPhase.phaseType == "attack"){
				// An attack phase is ended by killing all enemies
			}
			else if (currPhase.phaseType == "defense"){
				//A defense phase is ended by saving the required total of ladies saved
			}
		}
	}

	this.updateForNextPhase = function(){
		this.currentPhaseIndex++;
		if (this.currentPhaseIndex < 10){
			//we have more phases to go

		}
		else {
			//End game
		}
	}
}