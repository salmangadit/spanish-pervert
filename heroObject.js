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