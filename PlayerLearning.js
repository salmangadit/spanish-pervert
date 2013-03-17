/* This PlayerLearning file realises the movements of the mainCharacter, analyses his/her actions,
 * and determines what is the players playing level i.e. easy, medium, or hard.
 * There are 2 process to learning a player's playing level: 
 * 
 *	-> first gather data on what his actions are, how long it takes the player to kill the badNPC's,
 * 	   how long it takes him to rescue a lady, what is the health damage incurrred by the lady,
 *	   what is his health over a period of time
 *     **** AN IMPORTANT POINT TO TAKE NOTE ****: We will NOT use hit miss ratio as a metric to measure how
 *	   well the player is doing. That is because we control the hit miss ratio, and metrics should
 *	   be of the nature that he controls so that it is useful for us to understand about him. 
 * 	
 *	-> secondly with this gathered data we analyse his play. Compare that with a pre-defined model
 *	   and from there conclude what is the playing level is. 
 */

var iter = 0;
var localAverageKillTime = 0;
var localAverageRescueTime = 0;

var PlayerLearning = function(thisReference){
	console.log('the PlayerLearning object has been instantiated');

	/****** Properties of PlayerLearning ********/

	// A reference to the heroObject will be passed in
	this.owner = thisReference;

	// Health of hero is logged over a period of time
	this.healthArray = new Array();

	//At the start of every wave, we need to specify how many enemies will there be in this wave
	this.noOfEnemiesThisWave = null;
	this.timeTakenToKillNPC = null;
	this.arrayOfKillTime = new Array();
	
	// Whenever a lady is rescued, we need to calculate how long it took for the player to save her
	// the time would be set when they are first initialised and/or reset with each wave
	this.timeTakenToRescueThisLady = null;
	this.healthDamageIncurredByThisLady = null;	//**** how to use this parameter hmmm
	this.arrayOfRescueTime = new Array();
	this.arrayOfHealthDamage = new Array();

	// we will compute the time taken to complete this wave when the objective is met
	this.startTimeOfThisWave = null;
	this.expectedTimeTakenToCompleteThisWave = null;
	this.actualTimeTakenToCompleteThisWave = null;
	this.isCurrentWaveObjectiveAchieved = false;

	// These are the model timings received from AI (bufferTime and rescueTime are in terms of ms e.g 1000) 
	// and ******* QUESTION IS who determines them? *********
	this.bufferTimeForKill = 0;
	this.bufferTimeForRescue = 0;
	this.rescueTimeAnalysedLevel = 0;
	this.killTimeAnalysedLevel = 0;
	this.modelTimeTakenToKill = null;
	this.modelTimeTakenToRescue = null;


	/****** Methods of PlayerLearning ********/

	//******* Have to implement this collect data function ********************

	// The data generated will be compared against a model for the current wave
	this.analyseData = function(){

		// There will be 2 flags to determine, kill time, rescue time.
		
		// Determine average kill time
		for(iter = 0; iter < arrayOfKillTime.length; iter++) {
			localAverageKillTime += arrayOfKillTime[iter];
		}
		localAverageKillTime = localAverageKillTime / (arrayOfKillTime.length);
		// Compare (averageTime + bufferTime) with modelTime, each level has a different bufferTimeForKill
		// that will be set by ....
		this.compareTimingAndUpdateFlag(localAverageKillTime, 
										this.modelTimeTakenToKill, 
										this.bufferTimeForKill, 
										this.killTimeAnalysedLevel);
		
		// Determine average rescue time
		for(iter = 0; iter < arrayOfRescueTime.length; iter++) {
			localAverageRescueTime += arrayOfRescueTime[iter];
		}
		localAverageRescueTime = localAverageRescueTime / (arrayOfRescueTime.length);
		this.compareTimingAndUpdateFlag(localAverageRescueTime, 
										this.modelTimeTakenToRescue,
										this.bufferTimeForRescue,
										this.rescueTimeAnalysedLevel);


		/* Now compare the flags and set the playing level -  What the flags indicate:
		 *	-> 4 is hard & it means the player is very good and playing very well
		 *	-> 2 is medium & it  means he is within our ideal player, playing at the desired level we want
		 *	-> 0 is easy & it means he is not a good player with sufficient skills, make the game easier for him
		 *	-> 1 & 3 is in between the respective ranges
		 */

		// Both have the same levels
		if(this.rescueTimeAnalysedLevel == this.killTimeAnalysedLevel) {
			
			AI.playerLevel = this.rescueTimeAnalysedLevel;

		// When they have different levels, take the highest level amongst the two
		} else  {
			if(this.rescueTimeAnalysedLevel > this.killTimeAnalysedLevel) {
				AI.playerLevel = this.rescueTimeAnalysedLevel;
			} else {
				AI.playerLevel = this.killTimeAnalysedLevel;
			}
		}

		// Reset the objective flag
		this.isCurrentWaveObjectiveAchieved = false;
	};

	// Whenever a lady is rescued, this function is invoked 
	// and the necessary parameters are updated
	this.ladyRescueUpdate = function(thisLadyReference){
		// I am assuming that there is a spawnTime for the lady which
		// either corresponds to the start of the current phase
		this.timeTakenToRescueThisLady = Date.now() - thisLadyReference.HeroType.spawnTime;
		console.log('time taken to rescue this lady type ' + thisLadyReference.selfType + ' is: ' + this.timeTakenToRescueThisLady);
		
		this.healthDamageIncurredByThisLady = 30 - thisLadyReference.innerHealthMeterWidth;
		console.log('health damage incurred by this lady is: ' + this.healthDamageIncurredByThisLady);
		
		this.arrayOfRescueTime.push(this.timeTakenToRescueThisLady);
		this.arrayOfHealthDamage.push(this.healthDamageIncurredByThisLady);

	};

	// Whenever a badNPC is killed, this function is invoked
	this.badNPCKilledUpdate = function(thisBadNPCReference){
		this.timeTakenToKillNPC = Date.now() - thisBadNPCReference.HeroType.spawnTime;
		console.log('time taken to kill badNPC type: ' + thisBadNPCReference.selfType + ' is: ' + this.timeTakenToKillNPC);

		this.arrayOfKillTime.push(this.timeTakenToKillNPC);
	};

	// Update the model parameters when the wave changes (can change if we want to update wave parameters dynamically per se)
	this.updateWaveParameters = function(){
		//this.noOfEnemiesThisWave = //get from AI controller
		//this.modelTimeTakenToRescue = //get from AI Controller;
		//this.modelTimeTakenToKill = //get from AI Controller;
		//this.bufferTimeForKill = //get from AI controller
		//this.bufferTimeForRescue = //get from AI controller
	};

	// This function will compare the rescue and kill timing taken by the player against the model timing
	// and set the level (either rescueAnalyseLevel or killAnalyseLevel)
	this.compareTimingAndUpdateFlag = function(actualTime, modelTime, bufferTime, thisLevel) {

		// This is used only to determine if he is an medium (level 2) kikd of player
		var localSmallBuffer = 100;

		// At most only 3 conditions will be checked
		if(actualTime+localSmallBuffer == modelTime || actualTime-localSmallBuffer == modelTime) {
			thisLevel = 2;

		} else if(actualTime < modelTime) {

			if(actualTime < modelTime-bufferTime) {
				// the player is really good
				thisLevel = 4;
			} else {
				// the player is better than medium level
				thisLevel = 3;
			}

		} else if (actualTime > modelTime) {
			if(actualTime > modelTime+bufferTime) {
				// This is a realy lousy player!
				thisLevel = 0;
			} else {
				// the player is better than a lousy standard but still below our medium level
				thisLevel = 1;
			}

		}
	};
}

/*

List of things that I am required to know if it is there in our current implementation:

-> timeStamp when a lady is created or when a wave is crossed, timeStamp must update
-> the no of enemies this wave will have and also timeStamp attached to each badNPC when they spawn
-> whenever a lady is rescued, there should be an indication and reference to that lady updated
*/

// Commented out code

		/*
		 
		if(this.rescueTimeAnalysedLevel == "hard" && this.killTimeAnalysedLevel == "hard") {
			AI.playerLevel = "hard";
		
		} else if(this.rescueTimeAnalysedLevel == "easy" && this.killTimeAnalysedLevel == "easy") {
			AI.playerLevel = "easy";
		
		} else if(this.rescueTimeAnalysedLevel == "medium" && this.killTimeAnalysedLevel == "medium") {
			AI.playerLevel = "medium";

		// Tricky sitiuation, player is killing fast but taking his own time to rescue
		} else if(this.killTimeAnalysedLevel == "hard" && this.rescueTimeAnalysedLevel == "easy") {
			AI.playerLevel = "hard";
		// More conditions will be added in	
		} else if() {
		} else {
			// medium for now
			AI.playerLevel = "medium";

		}
		*/