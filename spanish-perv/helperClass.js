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

