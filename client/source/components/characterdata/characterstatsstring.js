import React from "react";
const e = React.createElement;

export const CharacterStatsString = function(in_props){
	return e("textarea", {
		"className":"interact",
		"rows":"1",
		"placeholder":in_props.displayName,
		"style":{"width":"100%","resize":"none","verticalAlign":"top"},
		"value":in_props.document.GetValue(in_props.name),
		"onChange":function(in_event){ in_props.onSetValue(in_props.name, in_event.target.value);},
	});
}
