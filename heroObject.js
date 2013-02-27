/**
 * This js file realises the object creation of different heroObjects and implements their 
 * methods
 */

function heroObject(){
	
    this.width = 32;
    this.height = 32;
    this.x = this.width * Math.floor(Math.random() * (gameW / this.width));
    this.y = this.height * Math.floor(Math.random() * (gameH / this.height));
    this.keys = new Array();
    this.lastRender = Date.now();
    this.animSpeed = 250;
    this.image = new Image();
    this.whichSprite = 0;
    // How many pixels do we want to move the hero each loop
    this.moveSpeed = 4;

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
        // move the hero left on the screen
        if (this.keys.indexOf(37) > -1)
        {
            this.x -= this.moveSpeed * elapsed;
        }
        // move the hero up on the screen
        else if (this.keys.indexOf(38) > -1)
        {
            this.y -= this.moveSpeed * elapsed;
        }
        // move the hero right on the screen
        else if (this.keys.indexOf(39) > -1)
        {
            this.x += this.moveSpeed * elapsed;
        }
        // move the hero down on the screen
        else if (this.keys.indexOf(40) > -1)
        {
            this.y += this.moveSpeed * elapsed;
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
 
 //------------------------ mainCharacter implementation -------------------------
 
 var mainCharacter = function(){

	this.punch = function() {

	};
	
	this.kick = function() {

	};	
	
 }//end of mainCharacter constructor
 mainCharacter.prototype = new heroObject();	//Inherit heroObject properties...
 
 //------------------------ end of mainCharacter implementation ------------------
 
 
 
 //------------------------ badNPC implementation --------------------------------
 
 var badNPC = function(){
 	
 	this.pullSkirt = function(){
     		
    };
    
    this.defend = function(){
     					
    };
    
 }//end of badNPC constructor
 badNPC.prototype = new heroObject();
 
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