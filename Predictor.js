/************************************
Done by Salman Gadit (U095146E)
************************************/
function Predictor(){
	var prevCriticality = 30;
	var projectedCriticality = 30;
	var accumulatedChange = 0;
	var totalCalls = 0;

	this.updatePredictor = function(){
		var change = Criticality.get() - prevCriticality;
		prevCriticality = Criticality.get();
		accumulatedChange += change;
		totalCalls++;
		projectedCriticality += (accumulatedChange/totalCalls);

		console.log('Enemy killed. Criticality is: ' + Criticality.get() + '. Predicted Criticality: '+projectedCriticality);
	}

	this.getProjectedCriticality = function(){
		return projectedCriticality;
	}
}