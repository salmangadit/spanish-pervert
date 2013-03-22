/*
* The FightController is a regular "class" and the implementation scope of this controller
* is to facilitate the fight sequence betweeen heroObjects that are currently involved in a fight
*
* Only the mainCharacter and goodNPC's will create this FightController object
* The thin lady will not have a hit miss ratio attached to her self, but will still
* have this FightController property to affect her surrounding enemies' hitMissRatio
*/

var iter = 0;

// Local variables for enemy reference
var enemyTempHealth = 0;
var enemySelfType = 0;
var enemyFightStatus = null;

// This local variable is used to refer to the mainCharacter or goodNPC's health
var tempHealthValue = 0;

// thisOwner will be a reference to either a mainCharacter or goodNPC (type: fiesty lady)
// remember that the mainCharacter or goodNPC have a reference to their parent - heroObject
var FightController = function(thisOwner){
	console.log('The fight controller has been instantiated');
	
	// Set the current phase (if we need it here..)
	this.currentPhase = null;
	
	// Set the difficulty level at the end of the phase
	this.difficultyLevelDetermined = null;
	
	// Set the owner of this fight
	this.owner = thisOwner;
	
	// The badNPC types surrounding the owner (basically the monkey or gorilla)
	this.surroundingArrayOfObjects = new Array();

	// An array containing the enemy objects to increase/decrease hit ratio
	this.hitMissRatioEnemyArray = new Array();

	/*  Update the fight status of the player depending on the current health
	 *  There are 4 regions which I have split up the health bar to represent
	 *  0  - 9  -> critical
	 *  10 - 15 -> bad
	 *  16 - 20 -> stable
	 *  21 - 30 -> good
	 */
	this.fightStatus = null;
}

// Lesser damage will be done by the target (which will be a monkey or gorilla)
// the amount will be always positive values
FightController.prototype.decreaseHitRatioOfEnemy = function (thisIndex, thisAmount) {
	this.surroundingArrayOfObjects[thisIndex].HeroType.hitMissRatio = thisAmount;
	this.checkHitMissRatioAndCalibrateIfNecessary(this.surroundingArrayOfObjects[thisIndex]);
	this.surroundingArrayOfObjects[thisIndex].updateHitMissRatio();
}

// Less damage done by a number of badNPC's surrounding the heroObject
FightController.prototype.decreaseHitRatioOfEnemies = function(thisArray, thisAmount) {
	
	for(iter=0; iter < thisArray.length; iter++) {
		thisArray[iter].HeroType.hitMissRatio = thisAmount;
		this.checkHitMissRatioAndCalibrateIfNecessary(thisArray[iter]);
		thisArray[iter].updateHitMissRatio();
	}
}

// Lesser damage will be done by yourself (either hero or fiesty lady)
FightController.prototype.decreaseHitRatioOfSelf = function(thisAmount) {
	this.owner.hitMissRatio = thisAmount;
	this.checkHitMissRatioAndCalibrateIfNecessary(this.owner.parentRef);
	this.owner.parentRef.updateHitMissRatio();
}

// More damage will be done by the target (which will be a monkey or gorilla) 
FightController.prototype.increaseHitRatioOfEnemy = function (thisIndex, thisAmount) {
	this.surroundingArrayOfObjects[thisIndex].HeroType.hitMissRatio = thisAmount;
	this.checkHitMissRatioAndCalibrateIfNecessary(this.surroundingArrayOfObjects[thisIndex]);
	this.surroundingArrayOfObjects[thisIndex].parentRef.updateHitMissRatio();
}

// More damage will be done by a number of badNPC's surrounding the heroObject
FightController.prototype.increaseHitRatioOfEnemies = function(thisArray, thisAmount) {

	for(iter=0; iter < thisArray.length; iter++) {
		thisArray[iter].HeroType.hitMissRatio = thisAmount;
		this.checkHitMissRatioAndCalibrateIfNecessary(thisArray[iter]);
		thisArray[iter].updateHitMissRatio();
	}
}

// More damage wil be done by yourself (either hero or fiesty lady)
FightController.prototype.increaseHitRatioOfSelf = function (thisAmount) {
	this.owner.hitMissRatio = thisAmount;
	this.checkHitMissRatioAndCalibrateIfNecessary(this.owner.parentRef);
	this.owner.parentRef.updateHitMissRatio();
}

// Check hitMissRatio range and recalibrate if out of range (0 - 1 is the range)
FightController.prototype.checkHitMissRatioAndCalibrateIfNecessary = function(thisReference){
	if(thisReference.hitMissRatio > 1){
		thisReference.HeroType.hitMissRatio = 1;
	} else if (thisReference.hitMissRatio < 0){
		thisReference.HeroType.hitMissRatio = 0;
	}
}

/* *** Important - do read **** 
 * This function takes in an array of references to the enemy objects and is
 * to be updated whenever the fight field changes - i.e. if a badNPC 
 * surrounding the heroObject dies, we need to update the fight controller
 */
FightController.prototype.updateSurroundingEnemies = function(thisArray) { 
	this.surroundingArrayOfObjects = thisArray;
	//console.log(' surroundingArrayOfObjects is: ' + this.surroundingArrayOfObjects);
}

// Update the enemies surrounding the heroObject to toggle hitMissRatio
// this depends on a few factors: the heroObject must have a bad health, not critical
FightController.prototype.updateEnemiesToToggleHitMissRatio = function(){

	// Loop through the current badNPC's surrounding the heroObject,
	// check their fightStatus, their selfType.
	for(iter=0; iter < this.surroundingArrayOfObjects.length; iter++){
		enemySelfType   = this.surroundingArrayOfObjects[iter].selfType;
		//enemyTempHealth = this.surroundingArrayOfObjects[iter].parentRef.health;
		this.updateFightStatusOfEnemy(this.surroundingArrayOfObjects[iter]);

		// Health and fght status are the same
		// SelfType 1 refers to a monkey
		if(enemySelfType == 1) {
			// If a monkey is not in bad or critical heath, we can toggle it's hit miss ratio
			if(enemyFightStatus != "critical"){
				this.hitMissRatioEnemyArray[iter] = this.surroundingArrayOfObjects[iter];
				console.log('a monkey was added to the array to toggle hitMissRatio');
			}

		
		} else if(enemySelfType == 2) {
			// If a gorilla's heath is not critical then we can toggle it's hit miss ratio
			if(enemyFightStatus != "critical"){
				this.hitMissRatioEnemyArray[iter] = this.surroundingArrayOfObjects[iter];
				console.log('a gorilla was added to the array to toggle hitMissRatio');
			}
		
		} else {
			console.log('the enemySelfType is invalid');
		}
	}//for loop
}

// This function will update the fight status of the heroObject depending on the health bar
FightController.prototype.updateFightStatus = function(){
	tempHealthValue = this.owner.parentRef.health;
	//console.log(this.owner.parentRef.selfType + 'health during fight is: ' + tempHealthValue);
	if(tempHealthValue < 1 && hollywoodScenario == true && this.owner.parentRef.selfType == 0){
		this.fightStatus = "hollyWood";
		console.log('hollywood for hero activated');
	}else if(tempHealthValue < 10){
		this.fightStatus = "critical";

	} else if(tempHealthValue >= 10 && tempHealthValue <= 15) {
		this.fightStatus = "bad";
	
	} else if(tempHealthValue >= 16 && tempHealthValue <= 20) {
		this.fightStatus = "stable";
	
	} else {
		this.fightStatus = "good";
	}
	//console.log(this.owner.parentRef.selfType + 'fightStatus is: ' + this.fightStatus);
}

// This function is used to update the badNPC's "fight status locally"..
// the badNPC's do not have a fightController thus we just keep a create a local copy
// when we need to refer
FightController.prototype.updateFightStatusOfEnemy = function(thisReference){
	enemyTempHealth = thisReference.health;
	if(enemyTempHealth < 10){
		enemyFightStatus = "critical";

	} else if(enemyTempHealth >= 10 && enemyTempHealth <= 15) {
		enemyFightStatus = "bad";
	
	} else if(enemyTempHealth >= 16 && enemyTempHealth <= 20) {
		enemyFightStatus = "stable";
	
	} else {
		enemyFightStatus = "good";
	}
}


// This function will monitor the health status and fight status of the hero,
// and make the necessary adjustments 
FightController.prototype.monitorHeroObjectSituation = function(){

	if(true == this.owner.fightControlMonitor){
		
		// Update the fight status of the heroObject
		this.updateFightStatus();

		//We have monitor the situation of both the mainCharacter and the fiesty lady
		switch(this.owner.parentRef.selfType){
			
			//Main character
			case 0:
				// Depending on the fight status 
				switch(this.fightStatus) {
					// I will need to update a global flag to indicate the hero is dying also.how..
					case 'hollyWood':
						console.log('hollywood scenario triggered and gonna make the enemy ratio to 0');
						if(this.surroundingArrayOfObjects.length != 0){
							this.decreaseHitRatioOfEnemies(this.surroundingArrayOfObjects,
								0);
						}
						break;

					// Increase your hit ratio, decrease the surrounding enemies hit ratio
					case 'critical': 

					this.increaseHitRatioOfSelf(0.9);
					if(this.surroundingArrayOfObjects.length != 0){
						this.decreaseHitRatioOfEnemies(this.surroundingArrayOfObjects,
							0.2);
					}
					break;

					// Increase your hit ratio, decrease the hit ratio of the surrounding enemies
					case 'bad':  
					this.increaseHitRatioOfSelf(0.5);
					this.updateEnemiesToToggleHitMissRatio();
					if(this.hitMissRatioEnemyArray.length != 0){
						this.decreaseHitRatioOfEnemies(this.hitMissRatioEnemyArray,
							0.3);
					}
					break;
					
					/* What to do here?
					case 'stable':
						this.increaseHitRatioOfSelf(0);
						break;
						*/

					// Increase all the surrounding enemies hit miss ratio
					case 'good':
					this.decreaseHitRatioOfSelf(0.3);
					if(this.surroundingArrayOfObjects.length != 0){
						this.increaseHitRatioOfEnemies(this.surroundingArrayOfObjects,
							0.6);
					}
					break;

					default:
					console.log('the fight status is invalid');
					break;
				}//inner switch case statement
				break;

			//Thin lady
			case 3:
				//Depending on the fight status
				switch(this.fightStatus) {
					
					// For a thin lady with critical fight status, we need to make all the enemies
					// surrounding her weak
					case 'critical':
					if(this.surroundingArrayOfObjects.length != 0){
						this.decreaseHitRatioOfEnemies(this.surroundingArrayOfObjects,
							0.1);
					}
					break;

					// Decrease the selected enemies' hit miss ratio surrounding her
					case 'bad':
					this.updateEnemiesToToggleHitMissRatio();
					if(this.hitMissRatioEnemyArray.length != 0){
						this.decreaseHitRatioOfEnemies(this.hitMissRatioEnemyArray,
							0.3);
					}
					break;

					/*
					case 'stable':
						this.increaseHitRatioOfSelf(0);
						break;
						*/	

					// Increase all the enemies surrounding hit miss ratio
					case 'good':
					if(this.surroundingArrayOfObjects.length != 0){
						this.increaseHitRatioOfEnemies(this.surroundingArrayOfObjects,
							0.6);
					}
					break;

					default:	
					console.log('the fight status is invalid');
					break;
				}//inner switch case statement
				break;

			//Fiesty lady
			case 4:
				//Depending on the fight status
				switch(this.fightStatus) {
					case 'critical':
					this.increaseHitRatioOfSelf(0.7);
					if(this.surroundingArrayOfObjects.length != 0){
						this.decreaseHitRatioOfEnemies(this.surroundingArrayOfObjects,
							0.2);
					}
					break;

					case 'bad':
					this.increaseHitRatioOfSelf(0.5);
					this.updateEnemiesToToggleHitMissRatio();
					if(this.hitMissRatioEnemyArray.length != 0){
						this.decreaseHitRatioOfEnemies(this.hitMissRatioEnemyArray,
							0.3);
					}
					break;

					/*
					case 'stable':
						this.increaseHitRatioOfSelf(0);
						break;
						*/

						case 'good':
						this.decreaseHitRatioOfSelf(0.3);
						if(this.surroundingArrayOfObjects.length != 0){
							this.increaseHitRatioOfEnemies(this.surroundingArrayOfObjects,
								0.6);
						}
						break;

						default:	
						console.log('the fight status is invalid');
						break;
				}//inner switch case statement
				break;

			//The selfType is invalid
			default:
			console.log('the selfType is invalid');
			break;

		}//outer swtch case statement
	
	}//fightControlMonitor if statement
	
}

