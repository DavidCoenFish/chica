import React from "react";
const e = React.createElement;

export const CharacterStatsInt = function(in_props){
	return e("input", {
		"className": "interact",
		"type":"number",
		"disabled" : ((true === in_props.locked) ? "disabled" : undefined),
		"onChange":function(in_event){ 
			in_event.preventDefault();
			//console.log("CharacterStatsInt:" + in_event.target.value); 
			var newValue = Math.round(parseFloat(in_event.target.value));
			if (true === isNaN(newValue)){
				newValue = 0;
			}
			//console.log("newValue:" + newValue); 
			in_props.onSetValue(in_props.name, newValue);
		},
		"value":in_props.document.GetValue(in_props.name),
		"style": {
			"width":"100%",
			"height":"1.333em"
		}});
}