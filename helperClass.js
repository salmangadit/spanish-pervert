/**
 * @author LOL
 * This class is used to declare methods that are generic and used throughout the project
 * It is a static class and hence no instantiation is required
 * Rule: Do not use specific methods that pertain to a certain class, try to generalize them
 * for the greater good of team
 */
var indexZero = 0;
function helperClass(){
	console.log('The helper class has been constructed');
}

helperClass.clearArray = function(thisArray){
	thisArray.splice(indexZero, thisArray.length);
}

helperClass.sortNumericalDataTypeAscending = function(thisType){
	thisType.sort(function(a,b){return a-b});
}

helperClass.sortNumericalDataTypeDescending = function(thisType){
	thisType.sort(function(a,b){return b-a});
}

helperClass.sortStringDataType = function(thisType){
	thisType.sort();
}

helperClass.checkIfTwoRectanglesIntersect = function(xCoordOfRect1, yCoordOfRect1, widthOfRect1, heightOfRect1, 
													 xCoordOfRect2, yCoordOfRect2, widthOfRect2, heightOfRect2) {
													 	
    widthOfRect1 += xCoordOfRect1;
    widthOfRect2 += xCoordOfRect2;
    if (xCoordOfRect2 > widthOfRect1 || xCoordOfRect1 > widthOfRect2) 
    	return false;
    
    heightOfRect1 += yCoordOfRect1;
    heightOfRect2 += yCoordOfRect2;
    if (yCoordOfRect2 > heightOfRect1 || yCoordOfRect1 > heightOfRect2) 
    	return false;
  	
  	return true;
	
}

helperClass.distanceBetweenTwoPoints = function(x1, y1, x2, y2){
	return Math.sqrt(Math.pow((x1-x2),2) + Math.pow((y1-y2),2));
}

helperClass.findNearestFreeSpace = function(pointX, pointY, jump){
		//go round, declustering style
		var found = false;
		var position = 1;
		var nearestFree;

		do {
			var x, y;
			if (position == 1){
				x = pointX + jump;
				y = pointY;
			} else if (position == 2){
				x = pointX;
				y = pointY + jump;
			} else if (position == 3){
				x = pointX - jump;
				y = pointY;
			} else if (position == 4){
				x = pointX;
				y = pointY - jump;
			}

			if(helperClass.CheckArrayIndex(x, y) != null){
				if (grid[x][y] == 0){
					found = true;
					nearestFree = new Array(x, y)
				} else {
					position++;
					if (position == 5){
						position = 1;
						jump++;
					}
				}
			}
		} while (!found);

		return nearestFree;
	}

helperClass.CheckArrayIndex = function(x, y) {
    if (grid.length-1 > x && grid[x].length-1 > y) {
        return grid[x][y];
    }

    return null;
}


/*Array.prototype.last = function(){
	console.log('array.last() was invoked');
	return this[this.length -1];
}
*/