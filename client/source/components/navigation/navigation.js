/* navigation could be a figment of ui state? */
const ReducerNavigation = function(in_state, in_action){
	if (in_state === undefined){
		return [];
	}

	switch (in_action.type){
		case "navDown":
			var newState = in_state.concat([]);
			newState.push(in_action.data);
			return newState;
		case "navUp":
			if (0 < in_state.length){
				var newState = in_state.concat([]);
				newState.length -= 1;
				return newState;
			}
			break;
		default:
			break;
	}

	return in_state;
}

const Navigation = function(in_props){
	const newProps = {
		"style":{
			"flexGrow":0,
			"flexShrink":0
		}
	};
	const buttonProps = {
		"className" : "button interact",
		"onClick" : function(in_event){ in_props.onNavUp(); }
	};
	var spanText = "";
	if (in_props.document != null){
		spanText = "current document type:" + in_props.document.GetType() + " [root]";
		for (var index = 0, total = in_props.navigation.length; index < total; index++) {
			var nav = in_props.navigation[index];
			spanText += ("." + JSON.stringify(nav));
		}
	} else {
		spanText = "no current document";
	}
	return e("div", newProps,
			e("a", buttonProps, ".."),
			e("span", null, spanText)
		);
}


export {ReducerNavigation, Navigation}
