import './style.css';
import React from "react";
const e = React.createElement;

/*
		//for tooltip'able text, we pass an array, string is default text, all else gets wrapped in objects with extra data such as colour and tooltip data
		"text" : [
			"some text ", 
			{"text" : "...", "style":"...", "tooltip":["the popup text of the ", {"text" : "tooltip", "tooltip":"another layer"]},
			{"text" : "...", "style":"..."},
		]


		<span>this is some text with a 
			<span class="tooltip">
				<span class="tooltext">tooltip</span>
				<span class="toolpop">this is the popup text of the tooltip</span>
			</span>
		</span>
*/
export const ToolTip = function(in_props){
	//console.log("ToolTip in_props:" + JSON.stringify(in_props));

	if ((in_props.text === undefined) || (in_props.text.length <= 0)){
		return null;
	}

	var arrayChildren = [];

	for (var index = 0, total = in_props.text.length; index < total; index++) {
		var data = in_props.text[index];
		if ("string" === typeof(data)){
			arrayChildren.push(e("span", {"key":index, "style":in_props.style}, data));
		} else if (data !== undefined) {
			var style = Object.assign({}, in_props.style, data.style);
			var test = e("span", {"key":index, "className":"tooltip"}, 
					e("span", {"className":"tooltext","style":style}, data.text),
					e(ToolTip, {"newPop":"newPop", "text":data.tooltip})
			);
			arrayChildren.push(test);
		}
	}
	
	var newProps = {};
	if ("newPop" in in_props){
		newProps["className"] = "toolpop";
	}

	//console.log("newProps:" + JSON.stringify(newProps));

	return e("span", newProps, arrayChildren);
}

/*
export const ToolTip = function(in_props){
	return e("div", "tooltip");
}
*/
