import {CharacterStatsFloat} from "./characterstatsfloat.js"

import React from "react";
const e = React.createElement;

const OnChangeFactory = function(in_props){
	return function(in_event){
		in_event.preventDefault();
		//console.log("CharacterStatsUnits:" + in_event.target.value); 
		in_props.onSetValueDisplay(in_props.name, in_event.target.value);
	};
}

export const CharacterStatsUnits = function(in_props){

	//do we have a displayValue verion of the value
	const displayValue = in_props.document.GetDisplayValue(in_props.name, in_props.units);
	//console.log("CharacterStatsUnits name:" + in_props.name + " units:" + in_props.units + " displayValue:" + displayValue); 
	if (displayValue === undefined){
		return e(CharacterStatsFloat, in_props);
	}

	return e("textarea", {
		"className":"interact",
		"disabled" : ((true === in_props.locked) ? "disabled" : undefined),
		"rows":"1",
		"placeholder":in_props.displayName,
		"style":{"width":"100%","resize":"none","verticalAlign":"top"},
		"value":displayValue,
		"onChange":OnChangeFactory(in_props)
	});
}
