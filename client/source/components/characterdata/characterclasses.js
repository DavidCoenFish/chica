import {CharacterTable} from "./charactertable.js";
import {ToolTip} from "./../tooltip/tooltip.js";
import React from "react";
const e = React.createElement;

/*
	"document": in_props.currentDocument,
	"documentManager" : in_props.documentManager,
	"onNavDown" : in_props.onNavDown, 
	"onSetValue" : in_props.onSetValue
*/
export const CharacterClasses = function(in_props){
	var arrayContent = [];
	var classes = in_props.document.GetValue("class_array");
	var activeClasses = in_props.document.GetValue("active_classes");

	if (classes !== undefined){
		for (var index = 0, total = classes.length; index < total; index++) {
			var item = classes[index];
			var active = false;
			if (-1 !== (activeClasses.indexOf(item))){
				active = true;
			}

			var className = in_props.documentManager.GetLocaleData(item.GetValue("class"));

			var content = {
				"left" : [active ? "✓" : "✗", className],
				"onClick":(function(in_index){ 
					return function(in_event){ 
						in_event.preventDefault();
						in_props.onNavDown(["class_array", in_index]);
					};
				})(index)
			};
			arrayContent.push(content);
		}
	}

	var displayName = in_props.documentManager.GetLocaleData("class_count") + " ";

	var tooltipDataA = in_props.document.GetTooltip("active_class_base_count", in_props.units);
	var tooltipDataB = in_props.document.GetTooltip("attribute_mc", in_props.units);
	var headingRight = e("div", null, displayName, e(ToolTip, {"text":[tooltipDataA]}), "/", e(ToolTip, {"text":[tooltipDataB]}));	


	var newProps = {
		"top" : {
			"headingLeft" : in_props.documentManager.GetLocaleData("classes"),
			"headingRight" : headingRight,
			"onAdd" : function(){ 
				var classesInner = in_props.document.GetValue("class_array");
				var newDocumentData = in_props.documentManager.NewDocumentData("class");
				var newDocument = in_props.documentManager.DocumentDataToDocument(newDocumentData);
				var newArray = classesInner.concat([newDocument]);
				in_props.onSetValue("class_array", newArray);
			},
		},
		"body" : {
			"onRemove" : function(in_index){
				var classesInner = in_props.document.GetValue("class_array");
				var newArray = classesInner.concat([]);
				newArray.splice(in_index, 1);
				in_props.onSetValue("class_array", newArray);
			},
			"leftProps" : [{"style":{"flexGrow":0,"flexShrink":0,"flexBasis":"1em"}},{"style":{"flexGrow":0,"flexShrink":0}}],
			"content" : arrayContent,
		}
	};
	return e(CharacterTable, newProps);
}