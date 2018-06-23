const ReducerUndoRedo = function(in_dataReducer){
	return function(in_state, in_action){
		if (in_state === undefined){
			return {
				"past" : [],
				"present" : in_dataReducer(undefined, in_action),
				"future" : []
			};
		}

		switch (in_action.type){
			case "undo":
				if (0 < in_state.past.length){
					var newPast = in_state.past.concat();
					newPast.length -= 1;
					var newPresent = in_state.past[in_state.past.length - 1];
					var newFuture = in_state.future.concat([in_state.present]);
					return {
						"past" : newPast,
						"present" : newPresent,
						"future" : newFuture
					};
				}
				break;
			case "redo":
				if (0 < in_state.future.length){
					var newPast = in_state.past.concat([in_state.present]);
					var newPresent = in_state.future[in_state.future.length - 1];
					var newFuture = in_state.future.concat();
					newFuture.length -= 1;
					return {
						"past" : newPast,
						"present" : newPresent,
						"future" : newFuture
					};
				}
				break;
			case "clear":
				if ((0 < in_state.past.length) || (0 < in_state.future.length)){
					return {
						"past" : [],
						"present" : in_state.present,
						"future" : []
					};
				}
				break;
			default:
				var newPresent = in_dataReducer(in_state.present, in_action);
				if (newPresent === in_state.present){
					return in_state;
				}
				var newPast = in_state.past.concat([in_state.present]);
				return {
					"past" : newPast,
					"present" : newPresent,
					"future" : []
				};
		}
		//console.log("ReducerEditDocument default");
		return in_state;
	}
}

export {ReducerUndoRedo}
