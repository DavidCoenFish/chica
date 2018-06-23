import React from "react";
const e = React.createElement;
import {ToolTip} from "./../tooltip/tooltip.js";

export const CharacterStatsStatic = function(in_props){
	var tooltipData = in_props.document.GetTooltip(in_props.name, in_props.units);
	//console.log(" CharacterStatsStatic:"
	return e("div", {"style":{"height":"1.333em"}}, e(ToolTip, {"text":[tooltipData]}));
}
