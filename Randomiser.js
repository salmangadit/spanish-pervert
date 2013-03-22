/************************************
Done by Salman Gadit (U095146E)
************************************/
function Randomiser(randArray){
	this.randArray = new Array();

	this.randomise = function(min, max){
		var range = new Array();

		if (min < max){
			for (var i=min; i<= max; i++){
				range.push(i);
			}
		} else {
			console.log("min is greater than max!");
		}

		var newRange = this.shuffle(range);
		var number;
		var found = false;

		for (var i = 0; i < newRange.length; i++){
			if (this.randArray.indexOf(newRange[i]) == -1){
				number = newRange[i];
				this.randArray.push(newRange[i]);
				found  = true;
				break;
			}
		}

		if (found){
			return number;
		} else {
			this.resetRandomiser();
			return newRange[0];
		}
	}

	this.randomiseArray = function (randomArray){
		var shuffled = this.shuffle(randomArray);
		return shuffled[0];
	}

	this.shuffle = function (o){ 
		for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
			return o;
	};

	this.resetRandomiser = function(){
		console.log("Randomiser cleaned!");
		this.randArray = [];
	}
}