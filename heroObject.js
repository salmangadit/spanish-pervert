// This js file realises the object creation of different heroObjects and implements their methods

/**
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
	console.log(this.parentRef);
	//Attributes associated with the main character specifically
	this.arrayOfLastTenMoves = new Array();		//to be used for probability distribution or if same as the keys array then, this can be deemed redundant
	this.gameExp = 0;
	
	//Any action done by the sprite be it punch or kick has to be in the standing state facing us
	this.punch = function() {
		console.log('the hero is gonna punch');
		console.log(this.parentRef.whichSprite);
		//Make the sprite stand stil
		this.parentRef.whichSprite = this.parentRef.width * 2;//I need to know which is the number exactly to stand still
		this.parentRef.render();
		//Now attack your opponent
		this.parentRef.whichSprite = this.parentRef.width * 3; //suppose 3 is the attacking image
		//Set the locations of where the new sprite image is to be drawn
		//The hero will be moved back by one tile for now...and assuming the hero is on our right
		this.parentRef.x = this.parentRef.x + 32;
		//Then render
		this.parentRef.render();
		//If the hero managed to punch successfully, update gameExp
		//if(the punch was successful)
			//this.gameExp++;
	};
	
	this.kick = function() {
		console.log('the hero is gonna kick');
		//this.goToStandingStillSprite();
		
		this.parentRef.whichSprite = this.parentRef.width * 2;
		this.parentRef.render();
		this.parentRef.whichSprite = this.parentRef.width * 3;
		//Set the locations of where the new sprite image is to be drawn
		this.parentRef.x = this.parentRef.x + 32;
		//Then render
		this.parentRef.render();
		//If the hero managed to kick successfully, update gameExp
		//if(the kick was successfull)
			//this.gameExp += 2;
	};	
	
	this.defend = function(){
		console.log('the hero is defending');
	};
	
	
 }//end of mainCharacter constructor
 
 mainCharacter.prototype = new heroObject();	
 
 
 //------------------------ end of mainCharacter implementation ------------------
 
 
 
 //------------------------ badNPC implementation --------------------------------
 
 var badNPC = function(thisReference){
 	
 	this.parentThis = thisReference;
 	this.pullSkirt = function(){
 		console.log('badNPC is pulling the skirts');
     		
    };
    
    this.defend = function(){
     	console.log('the badNPC is defending');
    };
    
 }//end of badNPC constructor
 
 badNPC.prototype = new heroObject();
 

 //----------------------- End of badNPC implementation --------------------------
 
 
 
 //----------------------- goodNPC implementation --------------------------------
 
 var goodNPC = function(thisReference){
	
	this.parentThis = thisReference;
	this.strikeWithUmbrella = function(){
     		
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
	this.targetGrid;

    this.keys = new Array();
    this.lastRender = Date.now();
    this.animSpeed = 250;
    this.image = new Image();
	
	//Specifies the type of character
    this.whichSprite = 0;	
    // How many pixels do we want to move the hero each loop
    this.moveSpeed = 4;
    //Can use this and * by number of pixels an image is to get the current sprite image
    this.currentSpriteImageIndex = 0;
    //Set these during collision detections
    this.vectorX = 0;				
    this.vectorY = 0;

    // Do we have a collision event?
    this.collision = false;
    
    //Maximum health life is 100
    this.health = maximumHealthLife;


    this.render = function(){
        context.drawImage(this.image, this.whichSprite, 0, 
            			  this.width, this.height, Math.floor(this.x), 
            			  Math.floor(this.y), this.width, this.height);	
    };


    this.update = function(elapsed)
    {
        // store out the current x and y coordinates
        var prevX = this.x;
        var prevY = this.y;
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
            case 37:
                // move the hero left on the screen
                this.x -= this.moveSpeed * elapsed;
                this.gridX = parseInt(this.x/this.width);
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
                }
                break;
            case 38:
                // move the hero up on the screen
                this.y -= this.moveSpeed * elapsed;
                this.gridY = parseInt(this.y/this.height);
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
                }
                break;
            case 39:
                // move the hero right on the screen
                this.x += this.moveSpeed * elapsed;
                this.gridX = parseInt(this.x/this.width);
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
                }
                break;
            case 40:
                // move the hero down on the screen
                this.y += this.moveSpeed * elapsed;
                this.gridY = parseInt(this.y/this.height);
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
                    this.y = prevY;
                    this.collision = true;
                }
            }
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

	//To display the players health properties
	this.innerHealthMeterX = 0;
	this.innerHealthMeterY = 0;
	this.outerHealthMeterX = 0;
	this.outerHealthMeterY = 0;
	this.innerHealthMeterImage  = new Image();
	this.outerHealthMeterImage  = new Image();

	//For the grid thing
	this.targetGrid = new Array();
	
	//Pass a reference of the parent to the child..
	this.HeroType = null;
	switch(thisType){
 		case 0:		this.HeroType = new mainCharacter(this);
 					break;
 		
 		case 1:		this.HeroType = new badNPC(this);
 					break;
 		
 		case 2:		this.HeroType = new goodNPC(this);
 					break;	
 	}
  
}//heroObject constructor
 
