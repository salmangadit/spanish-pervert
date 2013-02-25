/***************** This is sal's implmentation ****************************
function heroObject()
{
    this.width = 32;
    this.height = 32;
    this.x = this.width * Math.floor(Math.random() * (gameW / this.width));
    this.y = this.height * Math.floor(Math.random() * (gameH / this.height));
    this.keys = new Array();
    this.lastRender = Date.now();
    this.animSpeed = 250;
    this.image = new Image();
    this.whichSprite = 0;

    this.render = function()
    {
        context.drawImage(this.image, this.whichSprite, 0, 
            this.width, this.height, this.x, this.y, this.width, this.height);
    };
}
***************** End of sal's implementation ********************************/

function heroObject(thisType){
	
    this.width = 32;
    this.height = 32;
    this.x = this.width * Math.floor(Math.random() * (gameW / this.width));
    this.y = this.height * Math.floor(Math.random() * (gameH / this.height));
    this.keys = new Array();
    this.lastRender = Date.now();
    this.animSpeed = 250;
    this.image = new Image();
    this.whichSprite = 0;

    this.render = function(){
        context.drawImage(this.image, this.whichSprite, 0, 
            			  this.width, this.height, this.x, 
            			  this.y, this.width, this.height);
    };
    
    /*
     this.move = function(){
     	//left as an abstract function to be implemented by the child
     };
     */
    
    //We need to realise the kind of hero being created & the values for now have been arbritrarily assigned
    /*
     //0 -> Main playing character
     //1 -> Bad NPC
     //2 -> Good NPC
     switch(thisType){
     	
     	case 0:		this.punch = function(){
     		
     				};	//not sure here must be comma or semi-colon within a switch case
     				this.kick = function(){
     					
     				};
     				break;
     	
     	case 1:		this.pullSkirt = function(){
     		
     				};
     				this.defend = function(){
     					
     				};
     				break;
     	
     	case 2:		this.strikeWithUmbrella = function(){
     		
     				};
     				break;
     
     }//switch case statement
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