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
export const CharacterSkills = function(in_props){
	var arrayContent = [];
	var arrayDocuments = in_props.document.GetValue("skill_array");

	var addedSkills = {};
	var index = 0;
	for (var total = arrayDocuments.length; index < total; index++) {
		var item = arrayDocuments[index];

		var skillName = in_props.documentManager.GetLocaleData(item.GetValue("skill"));
		var skillLevel = item.GetValue("skill_level");

		var content = {
			"left" : ["✓", skillName],
			"right" : [skillLevel],
			"onClick":(function(in_index){ 
				return function(in_event){ 
					in_event.preventDefault();
					//if (in_event.currentTarget == in_event.target){
						console.log("table body onClick index:" + in_index);
						in_props.onNavDown(["skill_array", in_index]);
					//}
				};
			})(index)
		};
		arrayContent.push(content);
		addedSkills[skill] = true;
	}

	//disableRemove
	var skillTrainingMap = in_props.document.GetValue("skill_training_map");

	for (var skill in skillTrainingMap) {
		if (false === skillTrainingMap.hasOwnProperty(skill)) {
			continue;
		}
		if (skill in addedSkills){
			continue;
		}

		var skillName = in_props.documentManager.GetLocaleData(skill);
		var skillLevel = skillTrainingMap[skill];

		var content = {
			"left" : ["✗", skillName],
			"right" : [skillLevel],
			"disableRemove" : true
		};
		arrayContent.push(content);
	}

	var newProps = {
		"top" : {
			"headingLeft" : in_props.documentManager.GetLocaleData("skills"),
			"headingRight" : undefined,
			"onAdd" : function(){ 
				var arrayDocuments = in_props.document.GetValue("skill_array");
				//console.log("enchantments onAdd:" + enchantmentsInner.length);
				var newDocumentData = in_props.documentManager.NewDocumentData("skill");
				var newDocument = in_props.documentManager.DocumentDataToDocument(newDocumentData);
				var newArray = arrayDocuments.concat([newDocument]);
				in_props.onSetValue("skill_array", newArray);
			},
		},
		"body" : {
			"onRemove" : function(in_index){
				var arrayDocuments = in_props.document.GetValue("skill_array");
				//console.log("enchantments onRemove:" + enchantmentsInner.length);
				var newArray = arrayDocuments.concat([]);
				newArray.splice(in_index, 1);
				in_props.onSetValue("skill_array", newArray);
			},
			"leftProps" : [{"style":{"flexGrow":0,"flexShrink":0,"flexBasis":"1em"}},{"style":{"flexGrow":0,"flexShrink":0}}],
			"rightProps" : [{"style":{"flexGrow":0,"flexShrink":0,"flexBasis":"2em"}}],
			"content" : arrayContent,
		}
	};
	return e(CharacterTable, newProps);
}