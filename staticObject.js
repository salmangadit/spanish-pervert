/************************************
Done by Salman Gadit (U095146E)
************************************/
function staticObject()
{
    this.width = 32;
    this.height = 32;
    this.x = this.width * Math.floor(Math.random() * ((gameW - this.width * 2) / this.width)) + this.width;
    this.y = this.height * Math.floor(Math.random() * ((gameH - this.height * 2) / this.height)) + this.height;
    this.image;

    // Do we have a collision event?
    this.collision = false;

    this.render = function()
    {
        baseContext.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    };
};