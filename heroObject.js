// This js file realises the object creation of different heroObjects and implements their methods

/*
 * The general idea in implementing attacking mechanism of a 
 * heroObject: the move action
 * hero specific mechansim:
 * -> Main playing character: the punch action, the kick action
 * -> Bad NPC a.k.a Monkeys: able to pull the skirts (pulling action) & fight back the main character
 * -> Good NPC a.k.a Ladies: the ability to strike the monkey using umbrella
 */


 var maximumHealthLife = 100;
  
 //------------------------ mainCharacter implementation -------------------------
 
 var mainCharacter = function(thisReference){

	this.parentRef = thisReference;
	//console.log(this.parentRef);
	//Attributes associated with the main character specifically
	this.arrayOfLastMoves = new Array();		//to be used for probability distribution or if same as the keys array then, this can be deemed redundant
	this.gameExp = 0;
	
	//I need to render the 2 sprites sequentially, so I use this render stuff
	this.now;// = Date.now();
	this.delta;// = this.now - this.parentRef.lastRender;
	
	this.damageDelivered = -2;

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
	 * 18 -> retreat punch down
	 * 19 -> punch down
	 * 21 -> punch left
	 * 22 -> retreat left punch
	 * 24 -> punch right
	 * 25 -> retreat right punch
	 * 28 -> retreat punch up
	 * 29 -> punch up
	 */
	this.punch = function(targetReference) {
	
		console.log('punch status is: ' + this.parentRef.actionType);
		 if (this.parentRef.actionType == 1) {
			console.log('the hero is gonna punch and his ratio is: ' + this.hitMissRatio);
			
			//Set the locations of where the new sprite image is to be drawn			
			if (this.arrayOfLastMoves == 0 || this.arrayOfLastMoves[this.arrayOfLastMoves.length - 1] != "punch"){
				if(this.parentRef.facingWhichDirection == "left"){
					this.parentRef.x = this.parentRef.x + 4;
					this.parentRef.whichSprite = this.parentRef.width * 24;
				
				} else if (this.parentRef.facingWhichDirection == "right"){
					this.parentRef.x = this.parentRef.x - 4;
					this.parentRef.whichSprite = this.parentRef.width * 23;
				
				} else if (this.parentRef.facingWhichDirection == "down"){
					this.parentRef.x = this.parentRef.x - 4;
					this.parentRef.whichSprite = this.parentRef.width * 19;
				
				} else if (this.parentRef.facingWhichDirection == "up"){
					this.parentRef.x = this.parentRef.x - 4;
					this.parentRef.whichSprite = this.parentRef.width * 29;
				
				} else {
					alert("this is a weird direction");
				}
				
			//The hero could have been punching
			} else {
				if(this.arrayOfLastMoves[this.arrayOfLastMoves.length - 1] == "punch") {
					if(this.parentRef.facingWhichDirection == "left"){
						this.parentRef.whichSprite = this.parentRef.width * 24;
					
					} else if(this.parentRef.facingWhichDirection == "right") {
						this.parentRef.whichSprite = this.parentRef.width * 23;
					
					} else if(this.parentRef.facingWhichDirection == "down"){
						this.parentRef.whichSprite = this.parentRef.width * 19;					
					
					} else if(this.parentRef.facingWhichDirection == "up"){
						this.parentRef.whichSprite = this.parentRef.width * 29;
					
					} else {
						alert('this is the wrong direction and thus no appropriate sprite');
					}
				}							
			}//outer most if-else statement
			
			// Update the targets health
			//console.log('targetReference is of type: ' + targetReference.selfType);
						
			this.parentRef.render();
						
			//Then update attributes if it is a hit
			if(true == this.hit){
				targetReference.updateHealth(this.damageDelivered);
				this.arrayOfLastMoves.push("punch");
				console.log('the player did a punch`');
			} else {
				console.log('the player missed a punch');
			}
			
			//Move the hand back
			this.now = Date.now();
			this.delta = this.now - this.parentRef.lastRender;
			if(this.delta > this.parentRef.animSpeed){
				if(this.parentRef.facingWhichDirection == "left"){
					this.parentRef.whichSprite = this.parentRef.width * 25;
				
				} else if (this.parentRef.facingWhichDirection == "right"){
					this.parentRef.whichSprite = this.parentRef.width * 22;
				
				} else if(this.parentRef.facingWhichDirection == "down"){
					this.parentRef.whichSprite = this.parentRef.width * 18;
				
				} else if(this.parentRef.facingWhichDirection == "up"){
					this.parentRef.whichSprite = this.parentRef.width * 28;
				
				} else {
					alert('this is the wrong direction and thus no appropriate sprite');
				}				
				this.parentRef.render();				
			}
			
		}//actionType if statement
		
	};
	
	/* Kick sprite indicators:
	 * 1  -> kick down
	 * 2  -> retreat down kick
	 * 4  -> kick left
	 * 5  -> retreat left kick
	 * 10 -> retreat right kick
	 * 11 -> kick right
	 * 13 -> kick up
	 * 14 -> retreat up kick
	 */
	this.kick = function(targetReference) {
				
		console.log('kick status is: ' + this.parentRef.actionType);
		if (this.parentRef.actionType == 1) {
			console.log('the hero is gonna kick and his ratio is: ' + this.hitMissRatio);

			//Set the locations of where the new sprite image is to be drawn
			if (this.arrayOfLastMoves == 0 || this.arrayOfLastMoves[this.arrayOfLastMoves.length - 1] != "kick") {
				if (this.parentRef.facingWhichDirection == "left") {
					this.parentRef.x = this.parentRef.x + 4;
					this.parentRef.whichSprite = this.parentRef.width * 4;
				
				} else if (this.parentRef.facingWhichDirection == "right") {
					this.parentRef.x = this.parentRef.x - 4;
					this.parentRef.whichSprite = this.parentRef.width * 11;
				
				} else if (this.parentRef.facingWhichDirection == "down") {
					this.parentRef.x = this.parentRef.x - 4;
					this.parentRef.whichSprite = this.parentRef.width * 1;
					
				
				} else if (this.parentRef.facingWhichDirection == "up") {
					this.parentRef.x = this.parentRef.x - 4;
					this.parentRef.whichSprite = this.parentRef.width * 13;
				
				} else {
					alert('this is a weird direction');
				}

				//The hero has already made some moves
			} else {
				if (this.arrayOfLastMoves[this.arrayOfLastMoves.length - 1] == "kick") {
					if (this.parentRef.facingWhichDirection == "left") {
						this.parentRef.whichSprite = this.parentRef.width * 4;
					
					} else if (this.parentRef.facingWhichDirection == "right") {
						this.parentRef.whichSprite = this.parentRef.width * 11;
					
					} else if (this.parentRef.facingWhichDirection == "down") {
						this.parentRef.whichSprite = this.parentRef.width * 1;
					
					} else if (this.parentRef.facingWhichDirection == "up") {
						this.parentRef.whichSprite = this.parentRef.width * 13;
					
					} else {
						alert('this is a weird direction');
					}
				}
			}//outer most if-else statement

			this.parentRef.render();

			//Then update attributes if it is a hit
			if(true == this.hit){
				targetReference.updateHealth(this.damageDelivered);
				this.arrayOfLastMoves.push("kick");
				console.log('the player did a kick');
			} else {
				console.log('the player missed a kick');
			}

			//Move the hand back
			this.now = Date.now();
			this.delta = this.now - this.parentRef.lastRender;
			if (this.delta > this.parentRef.animSpeed) {
				if (this.parentRef.facingWhichDirection == "left") {
					this.parentRef.whichSprite = this.parentRef.width * 5;
				
				} else if (this.parentRef.facingWhichDirection == "right") {
					this.parentRef.whichSprite = this.parentRef.width * 10;
				
				} else if(this.parentRef.facingWhichDirection == "down") {
					this.parentRef.whichSprite = this.parentRef.width * 2;
				
				} else if(this.parentRef.facingWhichDirection == "up") {
					this.parentRef.whichSprite = this.parentRef.width * 14;
				
				} else {
					alert('this is the wrong direction and thus no appropriate sprite');
				}
				this.parentRef.render();
			}
		
		}//actionType if statement

	};	
	
	//Added new mechanism
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
 	this.attackPower = null;
 	if(this.parentRef.badNPC_Type == "monkey"){
 		this.attackPower = -0.000003;
 	}else if(this.parentRef.badNPC_Type == "gorilla"){
 		this.attackPower = -0.000005;
 	}
 	
 	this.hitMissRatio = 1;
	this.hit = false;
	this.miss = false;


 	this.pullSkirt = function(targetReference){
 		// I need to know the number of the sprite to change to... waiting for max..
 		
		if (this.parentRef.actionType == 1) {
			//console.log('badNPC is pulling the skirts');
			switch(this.parentRef.facingWhichDirection) {

				case 'up':
					if (this.parentRef.badNPC_Type == "monkey") {
						this.parentRef.whichSprite = this.parentRef.width * 14;
					} else {
						this.parentRef.whichSprite = this.parentRef.width * 14;
					}
					break;

				case 'down':
					if (this.parentRef.badNPC_Type == "monkey") {
						this.parentRef.whichSprite = this.parentRef.width * 14;
					} else {
						this.parentRef.whichSprite = this.parentRef.width * 14;
					}
					break;

				case 'right':
					if (this.parentRef.badNPC_Type == "monkey") {
						this.parentRef.whichSprite = this.parentRef.width * 14;
					} else {
						this.parentRef.whichSprite = this.parentRef.width * 14;
					}
					break;

				case 'left':
					if (this.parentRef.badNPC_Type == "monkey") {
						this.parentRef.whichSprite = this.parentRef.width * 14;
					} else {
						this.parentRef.whichSprite = this.parentRef.width * 14;
					}
					break;

			}//switch case
		}//actionType if statement
		
		this.parentRef.render();

		//Then update attributes if it is a hit
		if(true == this.hit){
			targetReference.updateHealth(this.attackPower);
			//console.log('the badNPC pulled a skirt');
		} else {
			//console.log('the badNPC missed pulling the skirt');
		}
    	
    };//end of pullskirt function
    
    this.attackPlayer = function(targetReference){
    	
		if (this.parentRef.actionType == 2) {
			//console.log('the badNPC is attacking the Hero');
			//console.log('the ' + this.parentRef.badNPC_Type + ' is gonna attack');
			switch(this.parentRef.facingWhichDirection) {

				case 'up':
					if (this.parentRef.badNPC_Type == "monkey") {
						this.parentRef.whichSprite = this.parentRef.width * 14;
					} else {
						this.parentRef.whichSprite = this.parentRef.width * 14;
					}
					break;

				case 'down':
					if (this.parentRef.badNPC_Type == "monkey") {
						this.parentRef.whichSprite = this.parentRef.width * 14;
					} else {
						this.parentRef.whichSprite = this.parentRef.width * 14;
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
		}//actionType if statement
    	
    	this.parentRef.render();

		//Then update attributes if it is a hit
		if(true == this.hit){
			targetReference.updateHealth(this.attackPower);
			//console.log('the badNPC attacked the player');
		} else {
			//console.log('the badNPC missed the player');
		}

    };
    
 }//end of badNPC constructor
 
 badNPC.prototype = new heroObject();
 

 //----------------------- End of badNPC implementation --------------------------
 
 
 
 //----------------------- goodNPC implementation --------------------------------
 
 var goodNPC = function(thisReference){
	
	this.parentRef = thisReference;
	this.fightController = new FightController(this);
	//Only the fiesty lady can attack
	if (this.parentRef.goodNPC_Type == "fiesty"){		
		this.attackPower = -5;
		this.hitMissRatio = 1;
		this.hit = false;
		this.miss = false;
	
	}
 	 		
	this.strikeWithUmbrella = function(targetReference){
    	
    	console.log('lady target reference is: ' + targetReference);
    	if (this.parentRef.actionType == 1) {
    		switch(this.parentRef.facingWhichDirection) {

				case 'up':
					this.parentRef.whichSprite = this.parentRef.width * 14;
					break;

				case 'down':
					this.parentRef.whichSprite = this.parentRef.width * 14;
					break;

				case 'right':
					this.parentRef.whichSprite = this.parentRef.width * 19;
					break;

				case 'left':
					this.parentRef.whichSprite = this.parentRef.width * 17;
					break;

			}//switch case statement
    	
    	}//actionType if statement	
    	
    	//Update the target's health	
    	this.parentRef.render();
    	if(this.parentRef.goodNPC_Type == "fiesty" && true == this.hit){
			targetReference.updateHealth(this.attackPower);
			console.log('the goodNPC hit with an umbrella');
		} else {
			console.log('the goodNPC missed the hit');
		}
    	
    };//strike with umbrella function  
      
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
	this.loiterTime = 151;
	this.targetVendor = -1;
	//maxOccupants gives the maximum objects that can be around any heroObject at any point in time
	this.maxOccupants = 0;
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
	
	//Pass a reference of the parent to the child..
	this.HeroType = null;
	this.badNPC_Type = null;
	this.goodNPC_Type = null;
	console.log('the heroObject type to be created is: ' + thisType);
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
        //iHMCanvasContext.clearRect(this.coordinateToClearX, this.coordinateToClearY, this.innerHealthMeterWidth, this.innerHealthMeterHeight);
        iHMCanvasContext.clearRect(this.coordinateToClearX, this.coordinateToClearY, 64, 64);					   
        iHMCanvasContext.drawImage(this.innerHealthMeterImage, this.innerHealthMeterX, this.innerHealthMeterY,
        						   this.innerHealthMeterWidth, this.innerHealthMeterHeight);
        //iHMCanvasContext.restore();
        
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
				
				if(debugMode == true){
					debugMode = false;
				}
				else{
					debugMode = true;
				}
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
            	//Make the hero kick
            	this.HeroType.kick(this.targetBot);
            	if(delta > this.animSpeed){
            		this.lastRender = now;	
            	}
            	break;    
            	
        	case 80:
        		//Make the hero punch
        		this.HeroType.punch(this.targetBot);
        		if(delta > this.animSpeed){
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
		
		//Update the hit miss ratio
		this.updateHitMissRatio();

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
						// reset our x and y coordinates and set our collision property to true
						this.x = prevX;
						//this.internalX = this.x;
						this.y = prevY;
						//this.internalY = this.y;
						this.collision = true;
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
						// reset our x and y coordinates and set our collision property to true
						this.x = prevX;
						//this.internalX = this.x;
						this.y = prevY;
						//this.internalY = this.y;
						this.collision = true;
					}
				}
			}
		}
    };

	this.updateHealth = function(thisHealth){
		
		this.innerHealthMeterWidth += (thisHealth*0.3);
		// 30 is the maximum width of the innerHealthMeter
		if(this.innerHealthMeterWidth > 30){
			this.innerHealthMeterWidth = 30;	
		
		} else if(this.innerHealthMeterWidth < 0) {
			this.innerHealthMeterWidth = 0;
			// If the hero is dead..update the necessary parameters
			this.destroyed = true;
			console.log(this.selfType + ' is dead');
		}
		//console.log('the ' + this.selfType + ' health meter is: ' + this.innerHealthMeterWidth);

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


    this.updateHitMissRatio = function(){

    	// Generate a random number between 1 and 10
    	var localRandomNumber = Math.floor((Math.random()*10)+1);
    	
    	// Check the hit miss ratio for example if it is 0.3, 
    	// the heroObject has to hit 3 times and miss 7 times
    	if((this.HeroType.hitMissRatio * 10) <= localRandomNumber) {
    		//This implies a hit should occur
    		//console.log('a hit was computed');
    		this.HeroType.hit = true;
    		this.HeroType.miss = false;
    	} else {
    		//This implies a miss should occur
    		//console.log('a miss was computed');
    		this.HeroType.hit = false;
    		this.HeroType.miss = true;
    	}
    };
	  
}//heroObject constructor
 
