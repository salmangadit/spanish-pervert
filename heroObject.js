// This js file realises the object creation of different heroObjects and implements their methods

/*
 * The general idea in implementing attacking mechanism of a 
 * heroObject: the move action
 * hero specific mechansim:
 * -> Main playing character: the punch action, the kick action
 * -> Bad NPC a.k.a Monkeys: able to pull the skirts (pulling action) & fight back the main character
 * -> Good NPC a.k.a Ladies: the ability to strike the monkey using umbrella
 */


 var maximumHealthLife = 30;
 var constantMainCharcterHealthRecovery = 0.03;
 var constantGoodNPCRecoveryHealth = 0.01;
  
 //------------------------ mainCharacter implementation -------------------------
 
 var mainCharacter = function(thisReference){

	this.parentRef = thisReference;
//	console.log('health upon instantaiation is:  ' + this.parentRef.health);
	//Attributes associated with the main character specifically
	this.arrayOfLastMoves = new Array();		//to be used for probability distribution or if same as the keys array then, this can be deemed redundant
	this.gameExp = 0;
	
	//I need to render the 2 sprites sequentially, so I use this render stuff
	this.now;// = Date.now();
	this.delta;// = this.now - this.parentRef.lastRender;
	
	this.defaultDamageDelivered = -2;
	this.damageDelivered = this.defaultDamageDelivered;

	this.fightController  = new FightController(this);

	/* Measure of hit miss ratio: range from 0 to 1
	 * the lesser the hit miss ratio, the lesser the chance of executing that move
	 * e.g if hit miss ratio is 0.3, means out of every 10 times, the player will be able to
	 * succesfully execute the current move only 3 times.
	 *
	 * so if it is 0.7, then he will execute the move (be it kick or punch) successfully
	 * every 7 times out of 10 tries
	 */
	this.hitMissRatio = 1;
	this.hit = false;
	this.miss = false;
	
	/* Punch sprite indicators:
	 * 28 -> retreat punch down
	 * 29 -> punch down
	 * 17 -> punch left
	 * 16 -> retreat left punch
	 * 19 -> punch right
	 * 18 -> retreat right punch
	 * 24 -> retreat punch up
	 * 25 -> punch up
	 */
	this.punch = function(targetReference) {
	
		//console.log('punch status is: ' + this.parentRef.actionType);
		 if (this.parentRef.actionType == 1) {
			//console.log('the hero is gonna punch and his ratio is: ' + this.hitMissRatio);
			
			// Draw the sprite to punch	
			switch(this.parentRef.facingWhichDirection){
				case 'left':
					this.parentRef.whichSprite = this.parentRef.width * 17;
					break;
				case 'right':
					this.parentRef.whichSprite = this.parentRef.width * 19;
					break;
				case 'up':
					this.parentRef.whichSprite = this.parentRef.width * 25;
					break;
				case 'down':
					this.parentRef.whichSprite = this.parentRef.width * 29;
					break;
				default:
					console.log('this is a weird direction');
					break;
			}//switch case statement						
			
			// Render the image
			this.parentRef.render();

			//Then update attributes (because it will always be a hit)
			targetReference.updateHealth(this.damageDelivered);
			//For testing
			//console.log(this.parentRef.selfType + ' delivered ' + this.damageDelivered + ' damage');
			//console.log(this.parentRef.selfType + ' updated ' + targetReference.selfType + ' health');
			this.arrayOfLastMoves.push("punch");					
			
			// A simple loop to delay time
			do {
				this.now = Date.now();
				this.delta = this.now - this.parentRef.lastRender;
				//console.log('delta is: ' + this.delta);
			} while(this.delta < 15);

			// Move the hand back
			if(this.delta > this.parentRef.animSpeed){
				switch(this.parentRef.facingWhichDirection){
					case 'left':
						this.parentRef.whichSprite = this.parentRef.width * 16;
						break;
					case 'right':
						this.parentRef.whichSprite = this.parentRef.width * 18;
						break;
					case 'up':
						this.parentRef.whichSprite = this.parentRef.width * 24;
						break;
					case 'down':
						this.parentRef.whichSprite = this.parentRef.width * 28;
						break;
					default:
						console.log('this is a weird direction');
						break;
				}//switch case statement

				// Render the image
				this.parentRef.render();			
			}//if statement
			
		}//actionType if statement
		
	};
	
	/* Kick sprite indicators:
	 * 31 -> kick down
	 * 30 -> retreat down kick
	 * 21 -> kick left
	 * 4  -> retreat left kick
	 * 8  -> retreat right kick
	 * 23 -> kick right
	 * 26 -> kick up
	 * 13 -> retreat up kick
	 */
	this.kick = function(targetReference) {
				
		//console.log('kick status is: ' + this.parentRef.actionType);
		if (this.parentRef.actionType == 1) {
			//console.log('the hero is gonna kick and his ratio is: ' + this.hitMissRatio);
			
			// Draw the sprite to kick	
			switch(this.parentRef.facingWhichDirection){
				case 'left':
					this.parentRef.whichSprite = this.parentRef.width * 21;
					break;
				case 'right':
					this.parentRef.whichSprite = this.parentRef.width * 23;
					break;
				case 'up':
					this.parentRef.whichSprite = this.parentRef.width * 26;
					break;
				case 'down':
					this.parentRef.whichSprite = this.parentRef.width * 31;
					break;
				default:
					console.log('this is a weird direction');
					break;
			}//switch case statement						
			
			// Render the image
			this.parentRef.render();

			//Then update attributes (because it will always be a hit)
			targetReference.updateHealth(this.damageDelivered);

			// A simple loop to delay time
			do {
				this.now = Date.now();
				this.delta = this.now - this.parentRef.lastRender;
				//console.log('delta is: ' + this.delta);
			} while(this.delta < 15);

			// Move the leg back
			if(this.delta > this.parentRef.animSpeed){
				switch(this.parentRef.facingWhichDirection){
					case 'left':
						this.parentRef.whichSprite = this.parentRef.width * 4;
						break;
					case 'right':
						this.parentRef.whichSprite = this.parentRef.width * 8;
						break;
					case 'up':
						this.parentRef.whichSprite = this.parentRef.width * 13;
						break;
					case 'down':
						this.parentRef.whichSprite = this.parentRef.width * 30;
						break;
					default:
						console.log('this is a weird direction');
						break;
				}//switch case statement

				// Render the image
				this.parentRef.render();				
			}//if statement
			
		}//actionType if statement

	};	
	
	// Added new mechanism
	this.rescue = function(targetReference){
		if(this.parentRef.actionType == 3){
			console.log('the hero is rescuing a lady');
			// Require a sprite image here....will inform kendrick
			targetReference.actionType = 3;
		}
	}
	//No defending as of now..
	/*this.defend = function(){
		console.log('the hero is defending');
		
	};
	*/
	
	
 }//end of mainCharacter constructor
 
 mainCharacter.prototype = new heroObject();	
 
 
 //------------------------ end of mainCharacter implementation ------------------
 
 
 
 //------------------------ badNPC implementation --------------------------------
 
 var badNPC = function(thisReference){
 	
 	this.parentRef = thisReference;
// 	console.log('health upon instantaiation is:  ' + this.parentRef.health);
 	this.attackPower = null;
 	if(this.parentRef.badNPC_Type == "monkey"){
 		this.defaultAttackPower = -0.15;
 		this.attackPower = this.defaultAttackPower;
 	}else if(this.parentRef.badNPC_Type == "gorilla"){
 		this.defaultAttackPower = -0.4;
 		this.attackPower = this.defaultAttackPower;
 	}
 	
 	this.hitMissRatio = 1;
	this.hit = false;
	this.miss = false;

	this.now;
	this.delta;


 	this.pullSkirt = function(targetReference){
 		
		if (this.parentRef.actionType == 1) {
			//console.log('badNPC is pulling the skirts of: ' + targetReference.goodNPC_Type);

			// Draw the sprite to pull the skirt
			switch(this.parentRef.facingWhichDirection) {

				case 'up':
					if (this.parentRef.badNPC_Type == "monkey") {
						this.parentRef.whichSprite = this.parentRef.width * 14;//need to update
					} else {
						this.parentRef.whichSprite = this.parentRef.width * 14;
					}
					break;

				case 'down':
					if (this.parentRef.badNPC_Type == "monkey") {
						this.parentRef.whichSprite = this.parentRef.width * 14;//need to update
					} else {
						this.parentRef.whichSprite = this.parentRef.width * 14;
					}
					break;

				case 'right':
					if (this.parentRef.badNPC_Type == "monkey") {
						this.parentRef.whichSprite = this.parentRef.width * 22;
					} else {
						this.parentRef.whichSprite = this.parentRef.width * 22;
					}
					break;

				case 'left':
					if (this.parentRef.badNPC_Type == "monkey") {
						this.parentRef.whichSprite = this.parentRef.width * 20;
					} else {
						this.parentRef.whichSprite = this.parentRef.width * 20;
					}
					break;

			}//switch case

			// Render the image
			this.parentRef.render();

			//Then update attributes if it is a hit
			targetReference.updateHealth(this.attackPower);
			
			// A simple loop to delay time
			do {
				this.now = Date.now();
				this.delta = this.now - this.parentRef.lastRender;
				//console.log('delta is: ' + this.delta);
			} while(this.delta < 15);

			// Retreat the pulling action
			if(this.delta > this.parentRef.animSpeed){
				switch(this.parentRef.facingWhichDirection) {

					case 'up':
						if (this.parentRef.badNPC_Type == "monkey") {
							this.parentRef.whichSprite = this.parentRef.width * 14;//need to update
						} else {
							this.parentRef.whichSprite = this.parentRef.width * 14;
						}
						break;

					case 'down':
						if (this.parentRef.badNPC_Type == "monkey") {
							this.parentRef.whichSprite = this.parentRef.width * 14;//need to update
						} else {
							this.parentRef.whichSprite = this.parentRef.width * 14;
						}
						break;

					case 'right':
						if (this.parentRef.badNPC_Type == "monkey") {
							this.parentRef.whichSprite = this.parentRef.width * 23;
						} else {
							this.parentRef.whichSprite = this.parentRef.width * 23;
						}
						break;

					case 'left':
						if (this.parentRef.badNPC_Type == "monkey") {
							this.parentRef.whichSprite = this.parentRef.width * 21;
						} else {
							this.parentRef.whichSprite = this.parentRef.width * 21;
						}
						break;

				}//switch case
			}

			// Render the image
			this.parentRef.render();

		}//actionType if statement
		
    };//end of pullskirt function
    
    this.attackPlayer = function(targetReference){
    	
		if (this.parentRef.actionType == 2) {

			// Draw the attack sprite
			switch(this.parentRef.facingWhichDirection) {

				case 'up':
					if (this.parentRef.badNPC_Type == "monkey") {
						this.parentRef.whichSprite = this.parentRef.width * 27;
					} else {
						this.parentRef.whichSprite = this.parentRef.width * 25;
					}
					break;

				case 'down':
					if (this.parentRef.badNPC_Type == "monkey") {
						this.parentRef.whichSprite = this.parentRef.width * 25;//need to update
					} else {
						this.parentRef.whichSprite = this.parentRef.width * 27;
					}
					break;

				case 'right':
					if (this.parentRef.badNPC_Type == "monkey") {
						this.parentRef.whichSprite = this.parentRef.width * 19;
					} else {
						this.parentRef.whichSprite = this.parentRef.width * 19;
					}
					break;

				case 'left':
					if (this.parentRef.badNPC_Type == "monkey") {
						this.parentRef.whichSprite = this.parentRef.width * 17;
					} else {
						this.parentRef.whichSprite = this.parentRef.width * 17;
					}
					break;

			}//switch case

			// Render the image
    		this.parentRef.render();

			// Then update attributes if it is a hit
			targetReference.updateHealth(this.attackPower);

			// A simple loop to delay time
			do {
				this.now = Date.now();
				this.delta = this.now - this.parentRef.lastRender;
				//console.log('delta is: ' + this.delta);
			} while(this.delta < 15);

			// Retreat the pulling action
			if(this.delta > this.parentRef.animSpeed){
			
				switch(this.parentRef.facingWhichDirection) {

					case 'up':
						if (this.parentRef.badNPC_Type == "monkey") {
							this.parentRef.whichSprite = this.parentRef.width * 26;
						} else {
							this.parentRef.whichSprite = this.parentRef.width * 24;
						}
						break;

					case 'down':
						if (this.parentRef.badNPC_Type == "monkey") {
							this.parentRef.whichSprite = this.parentRef.width * 24;//need to update
						} else {
							this.parentRef.whichSprite = this.parentRef.width * 26;
						}
						break;

					case 'right':
						if (this.parentRef.badNPC_Type == "monkey") {
							this.parentRef.whichSprite = this.parentRef.width * 18;
						} else {
							this.parentRef.whichSprite = this.parentRef.width * 18;
						}
						break;

					case 'left':
						if (this.parentRef.badNPC_Type == "monkey") {
							this.parentRef.whichSprite = this.parentRef.width * 16;
						} else {
							this.parentRef.whichSprite = this.parentRef.width * 16;
						}
						break;

				}//switch case
			}

			// Render the image
    		this.parentRef.render();

		}//actionType if statement

    };
    
 }//end of badNPC constructor
 
 badNPC.prototype = new heroObject();
 

 //----------------------- End of badNPC implementation --------------------------
 
 
 
 //----------------------- goodNPC implementation --------------------------------
 
 var goodNPC = function(thisReference){
	
	this.parentRef = thisReference;
//	console.log('health upon instantaiation is:  ' + this.parentRef.health);
	this.fightController = new FightController(this);
	this.now;
	this.delta;
	//Only the fiesty lady can attack
	if (this.parentRef.goodNPC_Type == "fiesty"){
		this.defaultAttackPower = -1;		
		this.attackPower = this.defaultAttackPower;
		this.hitMissRatio = 1;
		//this.hit = false;
		//this.miss = false;
	}
	
	if (this.parentRef.goodNPC_Type == "combo"){
		this.defaultAttackPower = 30;
		this.attackPower = this.defaultAttackPower;
		this.hitMissRatio = 1;
	}
 	 		
	this.strikeWithUmbrella = function(targetReference){
    	
    	
    	if (this.parentRef.actionType == 1) {
    		//console.log('the fiesty lady is attacking and her target reference is: ' + targetReference);
    		// Get the lady to attack with the umbrella
    		switch(this.parentRef.facingWhichDirection) {

				case 'up':
					this.parentRef.whichSprite = this.parentRef.width * 21;
					break;

				case 'down':
					this.parentRef.whichSprite = this.parentRef.width * 23;
					break;

				case 'right':
					this.parentRef.whichSprite = this.parentRef.width * 19;
					break;

				case 'left':
					this.parentRef.whichSprite = this.parentRef.width * 17;
					break;

			}//switch case statement
    	
    		// Render the image
    		this.parentRef.render();

    		//Update the target's health only for a fiesty lady
    		if(this.parentRef.goodNPC_Type == "fiesty"){
				targetReference.updateHealth(this.attackPower);
			}
			
			// A simple loop to delay time
			do {
				this.now = Date.now();
				this.delta = this.now - this.parentRef.lastRender;
				//console.log('delta is: ' + this.delta);
			} while(this.delta < 15);


			// Retreat the umbrella action
			if(this.delta > this.parentRef.animSpeed){
				// Retreat the umbrella hit
				switch(this.parentRef.facingWhichDirection) {

					case 'up':
						this.parentRef.whichSprite = this.parentRef.width * 20;
						break;

					case 'down':
						this.parentRef.whichSprite = this.parentRef.width * 22;
						break;

					case 'right':
						this.parentRef.whichSprite = this.parentRef.width * 18;
						break;

					case 'left':
						this.parentRef.whichSprite = this.parentRef.width * 16;
						break;

				}//switch case statement
			}

			// Render the image
    		this.parentRef.render();

    	}//actionType if statement	
    	    	
    };//strike with umbrella function  

    // To clear the health bar issue when rescued
    this.specialRender = function(){
    	console.log('special render was called upon rescue');
    	iHMCanvasContext.clearRect(0,0,iHMCanvas.width,iHMCanvas.height);
    };
      
 }//end of goodNPC constructor
 
 goodNPC.prototype = new heroObject();

 //----------------------- end of goodNPC implementation -------------------------
 

 function heroObject(thisType){
	
    this.width = 32;
    this.height = 32;

    this.x;// = this.width * Math.floor(Math.random() * (gameW / this.width));
    this.y;// = this.height * Math.floor(Math.random() * (gameH / this.height));
    this.centerX = this.x + (this.width / 2);
    this.centerY = this.y + (this.height / 2);
    this.gridX = parseInt(this.x/this.width);
    this.gridY = parseInt(this.y/this.height);
	//--------------Max code-----------------------------
	this.targetGrid = new Array(this.gridX,this.gridY);
	//action type will describe what kind of action the object will take
	//for enemies, 0 = movement, 1 = attack lady, 2 = attack player
	//for player, 0 = no use punching, 1 = if player punch, it hits
	this.actionType = 0; 
	this.selfType = thisType;
	this.targetBot;
	this.moveTarget;
	this.loiterTime = 151;
	this.targetVendor = -1;
	//maxOccupants gives the maximum objects that can be around any heroObject at any point in time
	this.maxOccupants = 0;
	this.partIndex;
	this.ladyTarget;
	//--------------End of Max code----------------------

    this.keys = new Array();
    this.lastRender = Date.now();
    this.animSpeed = 250;
    this.image = new Image();
	
	//Specifies the type of character
    this.whichSprite = 0;	
    // How many pixels do we want to move the hero each loop
    this.moveSpeed = (thisType == 0? 8 : 4);
    //Can use this and * by number of pixels an image is to get the current sprite image
    //this.currentSpriteImageIndex = 0;
    //Set these during collision detections
    this.vectorX = 0;				
    this.vectorY = 0;

    // Do we have a collision event?
    this.collision = false;
    
    //Maximum health life is 100
    this.health = maximumHealthLife;
	this.destroyed = false;
	//For the grid thing
	this.targetGrid = new Array();
	
	//The direction he is travelling
	this.facingWhichDirection = null;
	
	//To display the players health properties
	this.innerHealthMeterX = 0;
	this.innerHealthMeterY = 0;
	this.innerHealthMeterWidth  = 30;
	this.innerHealthMeterHeight = 6;
	//this.innerHealthMeterImage  = document.getElementById("innerHealthMeterImage");
	this.innerHealthMeterImage = new Image();
	this.innerHealthMeterImage.src = "images/innerHealthMeter.png";
	
	this.outerHealthMeterX = 0;
	this.outerHealthMeterY = 0;
	this.outerHealthMeterWidth  = 32;
	this.outerHealthMeterHeight = 8;
	this.outerHealthMeterImage  = new Image();
	this.outerHealthMeterImage.src = "images/outerHealthMeter.png";
	
	this.coordinateToClearX = 0;
	this.coordinateToClearY = 0;

	this.internalX = -1;
	this.internalY = -1;
	this.elapseSum = 0;

	this.playerSpeed = 2;
	this.NPCSpeed = 6;
	this.spawnTime = 0;
	this.keepMoving = false;
	this.lastMovedDirection = 0;
	// For the randomly acquired number to toggle hit miss ratio
	this.randomMiser = new Randomiser();
	
	//Pass a reference of the parent to the child..
	this.HeroType = null;
	this.badNPC_Type = null;
	this.goodNPC_Type = null;
//	console.log('the heroObject type to be created is: ' + thisType);
	switch(thisType){
 		case 0:		this.HeroType = new mainCharacter(this);
 					break;
 		
 		case 1:		this.badNPC_Type = "monkey";
 					this.HeroType = new badNPC(this);
 					break;
 		
 		case 2:		this.badNPC_Type = "gorilla";
 					this.HeroType = new badNPC(this);
 					break;
 		
 		case 3:		this.goodNPC_Type = "thin";
 					this.HeroType = new goodNPC(this);
 					break;	
 		
 		case 4:		this.goodNPC_Type = "fiesty";
 					this.HeroType = new goodNPC(this);
 					break;	

		case 5:		this.goodNPC_Type = "combo";
					this.HeroType = new goodNPC(this);
					break;
 	}
  
	//this function allows the setting of a specific point for any heroObject to move towards
	this.setTarget = function(targetX, targetY){
		this.targetGrid = new Array(targetX, targetY);
	};
	
	//this function makes the heroObject head towards a specific hero
	this.homing = function(specHero){
		this.targetGrid = new Array(specHero.gridX, specHero.gridY);
	};
	
    this.render = function(){
        context.drawImage(this.image, this.whichSprite, 0, 
            			  this.width, this.height, Math.floor(this.x), 
            			  Math.floor(this.y), this.width, this.height);	
        
        //Clear the canvas that the innerHealthMeter is drawn, then render
        //iHMCanvasContext.clearRect(this.coordinateToClearX, this.coordinateToClearY, 50, 50);//currently working but cross over issue version
        iHMCanvasContext.clearRect(this.coordinateToClearX, this.coordinateToClearY, 50, 50);					   
        iHMCanvasContext.drawImage(this.innerHealthMeterImage, this.innerHealthMeterX, this.innerHealthMeterY,
        						   this.innerHealthMeterWidth, this.innerHealthMeterHeight);
        
        //The outer health meter is drawn on the same canvas
        context.drawImage(this.outerHealthMeterImage,            			    
            			  Math.floor(this.outerHealthMeterX), 
            			  Math.floor(this.outerHealthMeterY),
            			  this.outerHealthMeterWidth, 
            			  this.outerHealthMeterHeight);	
    };

    this.update = function(elapsed)
    {
        // store out the current x and y coordinates
        var prevX = this.x;
        var prevY = this.y;

        if (this.x%32 != 0 || this.y%32 !=0){
        	this.keepMoving = true;
        } else {
        	this.keepMoving = false;
        }

        if (this.keepMoving){
        	this.keys[0] = this.lastMovedDirection;
        }

        this.elapseSum += elapsed;

        if (this.internalX == -1)
        	this.internalX = this.x;
        if (this.internalY == -1)
        	this.internalY = this.y;

        // reset the collision property
        this.collision = false;

        var now = Date.now();
        // How long has it been since we last updated the sprite
        var delta = now - this.lastRender;

        // perform a switch statement on the last key pushed into the array
        // this allows us to always move the direction of the most recently pressed
        // key
        switch (this.keys[this.keys.length - 1])
        {	
			//togglling debugMode
			case 68:				
				debugMode=true;
				break;
				
			case  79:
				debugMode=false;
				debugContext.clearRect(0,0,debugCanvas.width,debugCanvas.height);
				graphContext.clearRect(0,0,graphCanvas.width,graphCanvas.height);
				clearFPS();
				break;

            case 37:
					this.lastMovedDirection = 37;
					this.x -= this.moveSpeed * 1;
					//if (this.x%32 == 0){
						this.gridX = parseInt(this.x/this.width);
						if (this.x%32 != 0 || this.y%32 !=0){
				        	this.keepMoving = true;
				        } else {
				        	this.keepMoving = false;
				        	if (this.keys.indexOf(37) > -1) 
				        		this.keys.splice(hero.keys.indexOf(37), 1);
				        }

                // Check if the animation timer has elapsed or if we aren't using one of the
                // two valid sprites for this direction
                if (delta > this.animSpeed 
                    || (this.whichSprite != this.width * 4 && this.whichSprite != this.width * 5 
                        && this.whichSprite != this.width * 6 && this.whichSprite != this.width * 7))
                {
                    // The sprites for moving left are the 4th - 7th sprites in the image (0 based index)
                    //this.whichSprite = this.whichSprite == this.width * 2 ? this.width * 3 : this.width * 2;
                    if (this.whichSprite == this.width * 4)
                    {
                        this.whichSprite = this.width * 5;
                    } else if (this.whichSprite == this.width * 5) {
                        this.whichSprite = this.width * 6;
                    } else if (this.whichSprite == this.width * 6) {
                        this.whichSprite = this.width * 7;
                    } else {
                        this.whichSprite = this.width * 4;
                    }

                    this.lastRender = now;
                    this.facingWhichDirection = "left";
                }
                break;
            case 38:
                // move the hero up on the screen
					this.lastMovedDirection = 38;
					this.y -= this.moveSpeed * 1;
					this.gridY = parseInt(this.y/this.height);

					if (this.x%32 != 0 || this.y%32 !=0){
			        	this.keepMoving = true;
			        } else {
			        	this.keepMoving = false;
			        	if (this.keys.indexOf(38) > -1) 
			        		this.keys.splice(hero.keys.indexOf(38), 1);
			        }
            
                // Check if the animation timer has elapsed or if we aren't using one of the
                // two valid sprites for this direction
                if (delta > this.animSpeed 
                    || (this.whichSprite != this.width * 12 && this.whichSprite != this.width * 13 
                        && this.whichSprite != this.width * 14 && this.whichSprite != this.width * 15-1))
                {
                    if (this.whichSprite == this.width * 12)
                    {
                        this.whichSprite = this.width * 13;
                    } else if (this.whichSprite == this.width * 13) {
                        this.whichSprite = this.width * 14;
                    } else if (this.whichSprite == this.width * 14) {
                        this.whichSprite = this.width * 15 - 1;
                    } else {
                        this.whichSprite = this.width * 12;
                    }

                    this.lastRender = now;
                    this.facingWhichDirection = "up";
                }
                break;
            case 39:
                // move the hero right on the screen
					this.lastMovedDirection = 39;
					this.x += this.moveSpeed * 1;
					this.gridX = parseInt(this.x/this.width);

					if (this.x%32 != 0 || this.y%32 !=0){
			        	this.keepMoving = true;
			        } else {
			        	this.keepMoving = false;
			        	if (this.keys.indexOf(39) > -1) 
			        		this.keys.splice(hero.keys.indexOf(39), 1);
			        }

                // Check if the animation timer has elapsed or if we aren't using one of the
                // two valid sprites for this direction
                if (delta > this.animSpeed 
                    || (this.whichSprite != this.width * 8 && this.whichSprite != this.width * 9 
                        && this.whichSprite != this.width * 10 && this.whichSprite != this.width * 11))
                {
                    if (this.whichSprite == this.width * 8)
                    {
                        this.whichSprite = this.width * 9;
                    } else if (this.whichSprite == this.width * 9) {
                        this.whichSprite = this.width * 10;
                    } else if (this.whichSprite == this.width * 10) {
                        this.whichSprite = this.width * 11;
                    } else {
                        this.whichSprite = this.width * 8;
                    }

                    this.lastRender = now;
                    this.facingWhichDirection = "right";
                }
                break;
            case 40:
                // move the hero down on the screen
				this.lastMovedDirection = 40;
				this.y += this.moveSpeed * 1;

				this.gridY = parseInt(this.y/this.height);
				if (this.x%32 != 0 || this.y%32 !=0){
		        	this.keepMoving = true;
		        } else {
		        	this.keepMoving = false;
		        	if (this.keys.indexOf(40) > -1) 
		        		this.keys.splice(hero.keys.indexOf(40), 1);
		        }

                // Check if the animation timer has elapsed or if we aren't using one of the
                // two valid sprites for this direction
                if (delta > this.animSpeed 
                    || (this.whichSprite != this.width * 0 && this.whichSprite != this.width * 1 
                        && this.whichSprite != this.width * 2 && this.whichSprite != this.width * 3))
                {
                    if (this.whichSprite == this.width * 0)
                    {
                        this.whichSprite = this.width * 1;
                    } else if (this.whichSprite == this.width * 1) {
                        this.whichSprite = this.width * 2;
                    } else if (this.whichSprite == this.width * 2) {
                        this.whichSprite = this.width * 3;
                    } else {
                        this.whichSprite = this.width * 0;
                    }

                    this.lastRender = now;
                    this.facingWhichDirection = "down";
                }
                break;
                
            case 75:
            	/*** Previous working implementation ****/
            	//Make the hero kick
            	/*this.HeroType.kick(this.targetBot);
            	if(delta > this.animSpeed){
            		this.lastRender = now;	
            	}***************************************/

            	// Trying new implementation to get smoother transition
            	// This loop exits once delta is greater than animation speed
            	do {
            		now = Date.now();
            		delta = now - this.lastRender;
            	} while(delta < 15);
            	
            	// Now we are ready to perform the action inline
            	if(delta > this.animSpeed){
            		this.HeroType.kick(this.targetBot);
            		this.lastRender = now;	
            	}
            	break;
            	
        	case 80:
        		// Smoothen the transition
        		do {
            		now = Date.now();
            		delta = now - this.lastRender;
            	} while(delta < 15);
        		
        		// Now we are ready tp punch
        		if(delta > this.animSpeed){
        			this.HeroType.punch(this.targetBot);
        			this.lastRender = now;	
        		}
        		break;     
        	
        	case 82:
        		//Make the hero rescue the lady
        		console.log('the r key was pressed');
        		this.HeroType.rescue(this.targetBot);
        		if(delta > this.animSpeed){
        			this.lastRender = now;
        		}   
        		break;		
        }

        // This code handles wrapping the hero from the edge of the canvas
        if (this.x < 0)
        {
            this.x = 0;
            this.gridX = parseInt(this.x/this.width);
        }
        if (this.x >= gameW-this.width)
        {
            this.x = gameW-this.width;
            this.gridX = parseInt(this.x/this.width);
        }
        if (this.y < 0)
        {
            this.y = 0;
            this.gridY = parseInt(this.y/this.height);
        }
        if (this.y >= gameH-this.height)
        {
            this.y = gameH-this.height;
            this.gridY = parseInt(this.y/this.height);
        }
		
		//Get the current location of the health meter to clear
		this.coordinateToClearX = this.innerHealthMeterX - 10;
		this.coordinateToClearY = this.innerHealthMeterY - 10;

		//Update the new health and locations
		this.innerHealthMeterX = this.x;
		this.innerHealthMeterY = this.y - 10;
		this.outerHealthMeterX = this.innerHealthMeterX;
		this.outerHealthMeterY = this.innerHealthMeterY; 
		
        // loop through all of the rocks in the array
        // we use an for-in loop to go through the rocks in case
        // we later add some logic that can destroy static objects
        // a regular for loop could break with null values if that happens
        for (iter in collidables)
        {
            // if we already have a collision there's no need to continue
            // checking the other rocks
            if (this.collision)
            {
                break;
            }
            else
            {
                // check to see if we have a collision event with the
                // current rock
                if (this.checkCollision(collidables[iter]))
                {
	                    // reset our x and y coordinates and set our collision property to true
	                    this.x = prevX;
	                    //this.internalX = this.x;
	                    this.y = prevY;
	                    //this.internalY = this.y;
	                    this.collision = true;

	                    if (this.x%32 != 0 || this.y%32 !=0){
				        	this.keepMoving = true;
				        } else {
				        	this.keepMoving = false;
				        }
                }
            }
        }
		for (iter in enemies)
		{
			// if we already have a collision there's no need to continue
			// checking the other rocks
			if (this.collision)
			{
				break;
			}
			else
			{
				// check to see if we have a collision event with the
				// current rock
				if(this.gridX != enemies[iter].gridX && this.gridY != enemies[iter].gridY){
					if (this.checkCollision(enemies[iter]))
					{
						if (!this.keepMoving){
							// reset our x and y coordinates and set our collision property to true
							this.x = prevX;
							//this.internalX = this.x;
							this.y = prevY;
							//this.internalY = this.y;
							this.collision = true;

							if (this.x%32 != 0 || this.y%32 !=0){
					        	this.keepMoving = true;
					        } else {
					        	this.keepMoving = false;
					        }
						}
					}
				}
			}
		}
		for (iter in ladies)
		{
			// if we already have a collision there's no need to continue
			// checking the other rocks
			if (this.collision)
			{
				break;
			}
			else
			{
				// check to see if we have a collision event with the
				// current rock
				if(this.gridX != ladies[iter].gridX && this.gridY != ladies[iter].gridY){
					if (this.checkCollision(ladies[iter]))
					{
						if (!this.keepMoving){						
							// reset our x and y coordinates and set our collision property to true
							this.x = prevX;
							//this.internalX = this.x;
							this.y = prevY;
							//this.internalY = this.y;
							this.collision = true;

							if (this.x%32 != 0 || this.y%32 !=0){
					        	this.keepMoving = true;
					        } else {
					        	this.keepMoving = false;
					        }
						}
					}
				}
			}
		}

		// Means they are walking around, recover their health (only good npcs and mainCharacter)
		if(this.actionType == 0 && this.selfType != 1 && this.selfType != 2) {						
			// The actual health update
			if(this.selfType == 0){
				this.updateHealth(constantMainCharcterHealthRecovery * 3);
			} else {
				this.updateHealth(constantGoodNPCRecoveryHealth * 3);
			}
		}
    };

	this.updateHealth = function(thisHealth){
		//console.log('the health passed in is: ' + thisHealth);
		this.innerHealthMeterWidth += thisHealth;
		this.health = this.innerHealthMeterWidth;
		// 30 is the maximum width of the innerHealthMeter
		if(this.innerHealthMeterWidth > 30){
			this.innerHealthMeterWidth = 30;	
			this.health = maximumHealthLife;
		
		} else if(this.innerHealthMeterWidth < 0) {
			this.innerHealthMeterWidth = 0;
			this.health = this.innerHealthMeterWidth;
			// If the hero is dead..update the necessary parameters
			this.destroyed = true;
			console.log(this.selfType + ' is dead');
		}

		// For testing only
		if(this.selfType == 1 || this.selfType == 2){
//			console.log(this.HeroType.badNPC_Type + ' health is: ' + this.health);
		}
	}; 
    
    this.checkCollision = function(obj)
    {
        // check to see if our x coordinate is inside the object and
        // our y coordinate is also inside the object
        if ((this.x < (obj.x + obj.width) && Math.floor(this.x + this.width) > obj.x)
            && (this.y < (obj.y + obj.height) && Math.floor(this.y + this.height) > obj.y))
        {
            return true;
        }
    };

    // Okay a small change, this function will update the attackPower 
    // using the hitMissRatio, instead of setting hit or miss to TRUE
    this.updateHitMissRatio = function(){

    	// New implementation to toggleAttackPower
    	switch(this.selfType) {
    		case 0:
    			//console.log('the previous damageDelivered for hero is: ' + this.HeroType.damageDelivered);
    			this.HeroType.damageDelivered = this.HeroType.defaultDamageDelivered;
    			this.HeroType.damageDelivered *= this.HeroType.hitMissRatio;
    			//console.log('the updated damageDelivered for hero is: ' + this.HeroType.damageDelivered);
    			break;
    		case 1:
    			//console.log('the previous attackPower for monkey is: ' + this.HeroType.attackPower);
    			this.HeroType.attackPower = this.HeroType.defaultAttackPower;
    			this.HeroType.attackPower *= this.HeroType.hitMissRatio;
    			//console.log('the updated attackPower for monkey is: ' + this.HeroType.attackPower);
    			break;
    		case 2:
    			//console.log('the previous attackPower for gorilla is: ' + this.HeroType.attackPower);
    			this.HeroType.attackPower = this.HeroType.defaultAttackPower;
    			this.HeroType.attackPower *= this.HeroType.hitMissRatio;
    			//console.log('the updated attackPower for gorilla is: ' + this.HeroType.attackPower);
    			break;
    		case 3:
    			//console.log('the attack to update is non existence for thin lady');
    			break;
    		case 4:
    			//console.log('the previous attackPower for fiesty lady is: ' + this.HeroType.attackPower);
    			this.HeroType.attackPower = this.HeroType.defaultAttackPower;
    			this.HeroType.attackPower *= this.HeroType.hitMissRatio;
    			//console.log('the updated attackPower for fiesty lady is: ' + this.HeroType.attackPower);
    			break;
    		default:
    			console.log('the self type is invalid');
    			break;
    	
    	}//switch case statement

    };
	  
}//heroObject constructor
 
