function Predictor(){
	var prevCriticality = 30;
	var projectedCriticality = 30;
	var accumulatedChange = 0;
	var totalCalls = 0;

	this.updatePredictor = function(){
		var change = Criticality.get() - prevCriticality;
		accumulatedChange += change;
		totalCalls++;
		projectedCriticality += (accumulatedChange/totalCalls);
	}

	this.getProjectedCriticality = function(){
		return projectedCriticality;
	}
}