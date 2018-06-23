import React from "react";
const e = React.createElement;

export const CharacterStatsFloat = function(in_props){
	var value = in_props.document.GetValue(in_props.name);
	//if (value === undefined){
	//	value = 0;
	//}

	return e("input", {
		"className": "interact",
		"type":"number",
		"disabled" : ((true === in_props.locked) ? "disabled" : undefined),
		"onChange":function(in_event){
			in_event.preventDefault();
			//console.log("CharacterStatsFloat:" + in_event.target.value); 
			var newValue = parseFloat(in_event.target.value);
			if (true === isNaN(newValue)){
				newValue = 0;
			}
			//console.log("newValue:" + newValue); 
			in_props.onSetValue(in_props.name, newValue);
		},
		"value": value,
		"style": {
			"width":"100%",
			"height":"1.333em"
		}});
}
