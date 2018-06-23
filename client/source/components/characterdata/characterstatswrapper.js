import React from "react";
const e = React.createElement;
import {ToolTip} from "./../tooltip/tooltip.js";

export const CharacterStatsWrapper = function(in_props){
	var style = {
		"position":"absolute",
		"top":((in_props.top !== undefined) ? in_props.top : "0"),
		"left":((in_props.left !== undefined) ? in_props.left : "0"),
		"width":((in_props.width !== undefined) ? in_props.width : "8em"),
		"height":((in_props.height !== undefined) ? in_props.height : "3em")
	};

	//var displayName = in_props.documentManager.GetLocaleData(in_props.name);
	var tooltipData = in_props.documentManager.MakePropertyNameTooltipData(in_props.name, in_props.document, in_props.units);

	//var innerProps = Object.assign({}, in_props, {"displayName":displayName});
	//return e("div", { "style" : style}, e(in_props.factory, innerProps), e("p", {"style":{"fontSize":"0.8em"}}, displayName));
	return e("div", { "style" : style}, e(in_props.factory, in_props), e(ToolTip, {"style":{"fontSize":"0.8em"}, "text":tooltipData}));
}
