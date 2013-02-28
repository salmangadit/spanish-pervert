/**
 * This js file realises the object creation of different heroObjects and implements their 
 * methods
 */

function heroObject(){
	
    this.width = 32;
    this.height = 32;
    this.x = this.width * Math.floor(Math.random() * (gameW / this.width));
    this.y = this.height * Math.floor(Math.random() * (gameH / this.height));
    this.centerX = this.x + (this.width / 2);
    this.centerY = this.y + (this.height / 2);
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

	//salman i edited the this.x to Math.floor(this.x) and same for the this.y..the reason being is that I read from a book that described
	//that the sprites might have fractional values and if we render with those values, we may see glitches on the canvas..sprites should be
	//drawn at integer positions only...also it is important when we use start using the physics formulas...
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
        }
        if (this.x >= gameW-this.width)
        {
            this.x = gameW-this.width;
        }
        if (this.y < 0)
        {
            this.y = 0;
        }
        if (this.y >= gameH-this.height)
        {
            this.y = gameH-this.height;
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
    /*
     this.move = function(){
     	//left as an abstract function to be implemented by the child
     };
     */
}

/**
 * The general idea in implementing attacking mechanism of a 
 * heroObject: the move action
 * hero specific mechansim:
 * -> Main playing character: the punch action, the kick action
 * -> Bad NPC a.k.a Monkeys: able to pull the skirts (pulling action) & fight back the main character
 * -> Good NPC a.k.a Ladies: the ability to strike the monkey using umbrella
 */

/*
 * -------------------------------------------------------------------------------------
 * I thought of a way to do the different object creation based on single function call
 * 
 * 
 
 var maximumHealthLife = 100;
 var genericAttributes = {
 	health: maximumHealthLife
 };
 
 var innerHealthMeter = function(){
 	this.sourceWidth = 32;
 	this.sourceHeight = 32;
 	this.width = 32;
 	this.height = 32;
 	//We need to place the inner health meter above the its parent sprite image
 	this.x = heroObject.x - 16;
 	this.y = heroObject.y - 16; 
 }
 
 var outerHealthMeter = function(){
 	this.sourceWidth = 32;
 	this.sourceHeight = 32;
 	this.width = 32;
 	this.height = 32;
 	//We need to place the outer health meter at the exact position where the inner health meter is...
 	this.x = heroObject.x - 16;
 	this.y = heroObject.y - 16;
 }
 
 //------------------------ mainCharacter implementation -------------------------
 
 var mainCharacter = function(){

	//Attributes associated with the main character specifically
	this.arrayOfLastTenMoves = new Array();		//to be used for probability distribution or if same as the keys array then, this can be deemed redundant
	this.gameExp = 0;
	
	//Any action done by the sprite be it punch or kick has to be in the standing state facing us
	this.punch = function() {
		console.log('the hero is gonna punch);
		goToStandingStillSprite();
		//Set the locations of where the new sprite image is to be drawn
		//Then render
		this.render();
		//If the hero managed to punch successfully, update gameExp
		if(the punch was successful)
			this.gameExp++;
	};
	
	this.kick = function() {
		console.log('the hero is gonna kick');
		goToStandingStillSprite();
		//Set the locations of where the new sprite image is to be drawn
		//Then render
		this.render();
		//If the hero managed to kick successfully, update gameExp
		if(the kick was successfull)
			this.gameExp += 2;
	};	
	
	this.defend(){
		console.log('the hero is defending');
	};
	
	this.goToStandingStillSprite = function() {
		//this.currentSpriteImage = whatever the array containing the sprite is and whichever index/offset the standing still sprite is located
		this.render();
	};
	

 }//end of mainCharacter constructor
 
 //Inherit heroObject properties...
 mainCharacter.prototype = new heroObject();	
 //add the generic properties..the reason it is done this way, lady sprites i believe do not need health?..thus dont put in the main construtctor
 mainCharacter.prototype = new genericAttributes();
 
 //------------------------ end of mainCharacter implementation ------------------
 
 
 
 //------------------------ badNPC implementation --------------------------------
 
 var badNPC = function(){
 	
 	this.pullSkirt = function(){
 		console.log('badNPC is pulling the skirts);
     		
    };
    
    this.defend = function(){
     	console.log('the badNPC is defending');
    };
    
 }//end of badNPC constructor
 badNPC.prototype = new heroObject();
 badNPC.prototype = new genericAttributes();
 
 //----------------------- End of badNPC implementation --------------------------
 
 
 
 //----------------------- goodNPC implementation --------------------------------
 
 var goodNPC = function(){
	
	this.strikeWithUmbrella = function(){
     		
    };
    
 }//end of goodNPC constructor
 goodNPC.prototype = new heroObject();
 
 //----------------------- end of goodNPC implementation -------------------------
 
 var thisObject;
 function createHeroObject(thisType){
 	
 	switch(thisType){
 		case 0:		thisObject  = new mainCharacter();
 					break;
 		
 		case 1:		thisObject  = new badNPC();
 					break;
 		
 		case 2:		thisObject = new goodNPC();
 					break;	
 	}
 	return thisObject;
 }
 
 */