/*
<div id="classes" style="width:25em;height:12em;margin:0 0 0.5em 0.5em;position:relative;">
	<div style="height:1.25em;border-style:none none solid none;border-width:1px;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:space-between;">
		<span>Classes</span>
		<span>0 of 
			<span class="tooltipparent">
				<span class="tooltiptext">1</span>
				<span class="tooltip">3 + (Intelegence(-4) / 2)</span>
			</span>
		</span>
	</div>
	<div class="table" style="height:calc(100% - 1.25em);overflow-y:auto;">
		<div style="height:1em;">none</div>
		<div style="height:1em;"></div>
		<div style="height:1em;"></div>
		<div style="height:1em;"></div>
		<div style="height:1em;"></div>
		<div style="height:1em;"></div>
		<div style="height:1em;"></div>
		<div style="height:1em;"></div>
		<div style="height:1em;"></div>
		<div style="height:1em;"></div>
	</div>
</div>
*/

import {Button} from "./../button/button.js";
import React from "react";
const e = React.createElement;

/*
	headingLeft
	headingRight
	onAdd()
*/
const CharacterTableTop = function(in_props){
	var newProps = {"style" : { 
		"height":"1.25em",
		"borderStyle":"none none solid none",
		"borderWidth":"1px",
		"display":"flex",
		"flexDirection":"row",
		"flexWrap":"nowrap",
		"justifyContent":"space-between"
	}};
	var innerButton = e(Button, { 
		"className" : "button interact",
		"style" : {"flexGrow":0, "flexShrink":0,"flexBasis":"1em", "height":"1.1em"}, 
		"label":"+", 
		"onClick":function(in_event){ in_props.onAdd(); }
	});

	return e("div", newProps,
		e("span", { "style" : {"flexGrow":0,"flexShrink":0}}, in_props.headingLeft),
		e("span", { "style" : {"flexGrow":1,"flexShrink":0}}),
		e("span", { "style" : {"flexGrow":0,"flexShrink":0, "marginRight":"0.5em"}}, in_props.headingRight),
		innerButton
	);
}

/*
	onRemove(index)
	leftProps[{"flexGrow":X,"flexShrink":X,"flexBasis":X}]
	rightProps[{"flexGrow":X,"flexShrink":X,"flexBasis":X}]
	content[
		disableRemove,
		left[string or react element (tooltip)]
		right[string or react element (tooltip)]
	]
*/
const CharacterTableBody = function(in_props){
	var bodyProps = {"className":"table", "style" : { "overflowY":"auto", "height":"calc(100% - 1.25em)"}};

	var flexSpacerProps = { "style" : {"flexGrow":1,"flexShrink":0}};

	var arrayChildren = [];
	var total = Math.max(8, in_props.content.length);
	for (var index = 0; index < total; index++) {
		var dataObject = (index < in_props.content.length) ? in_props.content[index] : undefined;
		var newPropsInner = {"style" : { 
			"display":"flex",
			"flexDirection":"row",
			"flexWrap":"nowrap",
			"justifyContent":"space-between",
			"height":"1.25em",
			},
			"key":index,
		};
		if ((dataObject !== undefined) && ("onClick" in dataObject)){
			newPropsInner["onClick"] = dataObject.onClick;
		}

		var subArrayChildren = [];
		var trace = 0;
		if (dataObject !== undefined){
			//left
			if (dataObject.left !== undefined){
				for (var subIndex = 0, subTotal = dataObject.left.length; subIndex < subTotal; subIndex++) {
					var subObject = dataObject.left[subIndex];
					subArrayChildren.push(e("div", Object.assign({}, in_props.leftProps[subIndex], {"key":trace}), subObject));
					trace += 1;
				}
			}

			//spacer
			subArrayChildren.push(e("div", Object.assign({}, flexSpacerProps, {"key":trace})));
			trace += 1;

			//right
			if (dataObject.right !== undefined){
				for (var subIndex = 0, subTotal = dataObject.right.length; subIndex < subTotal; subIndex++) {
					var subObject = dataObject.right[subIndex];
					subArrayChildren.push(e("span", Object.assign({}, in_props.rightProps[subIndex], {"key":trace}), subObject));
					trace += 1;
				}
			}

			//button
			if (dataObject.disableRemove !== true){
				var propButton = { "className" : "button interact", 
					"label":"-", 
					"onClick":function(in_index){ return function(in_event){ 
						//console.log("remove button:" + in_index);
						in_event.preventDefault();
						in_event.stopPropagation();
						in_props.onRemove(in_index); };}(index),
					"style" : {"flexGrow":0, "flexShrink":0,"flexBasis":"1em", "height":"1.1em"},
					"key":trace
				};
				subArrayChildren.push(e(Button, propButton));
				trace += 1;
			} else {
				subArrayChildren.push(e("div", {"key":trace, "style" : {"flexGrow":0, "flexShrink":0,"flexBasis":"1em"}}));
				trace += 1;
			}
		}

		arrayChildren.push(e("div", newPropsInner, subArrayChildren));
	}

	return e("div", bodyProps, arrayChildren);
}

/*
	top
	body
*/
export const CharacterTable = function(in_props){
	var newProps = {"style" : {
		"width":"25em",
		"height":"12em",
		"margin":"0 0 0.5em 0.5em",
		"position":"relative"
	}};
	return e("div", newProps, 
		e(CharacterTableTop, in_props.top),
		e(CharacterTableBody, in_props.body),
	);
}
