import {CharacterTable} from "./charactertable.js";
import {ToolTip} from "./../tooltip/tooltip.js";
import {ModalDialogSelectFactory} from "./../modaldialog/modaldialog.js";
import React from "react";
const e = React.createElement;

/*
	"document": in_props.currentDocument,
	"documentManager" : in_props.documentManager,
	"onNavDown" : in_props.onNavDown, 
	"onSetValue" : in_props.onSetValue
*/
export const CharacterEquipment = function(in_props){
	var arrayContent = [];
	var documentArray = in_props.document.GetValue("equipment_array");

	for (var index = 0, total = documentArray.length; index < total; index++) {
		var document = documentArray[index];
		//✓✗
		
		var loadoutValid = document.GetValue("loadout_valid");
		var active = document.GetValue("active");
		const name = document.GetDisplayValue("name", in_props.units);
		const mass = document.GetDisplayValue("mass", in_props.units);

		var content = {
			"left" : [loadoutValid ? "✓" : "✗", active ? "✓" : "✗", name],
			"right" : [mass],
			"onClick":(function(in_index){ 
				return function(in_event){ 
					in_event.preventDefault();
					in_props.onNavDown(["equipment_array", in_index]);
				};
			})(index)
		};
		arrayContent.push(content);
	}

	var displayName = in_props.documentManager.GetLocaleData("magic_items") + " ";
	var tooltipDataA = in_props.document.GetTooltip("loadout_magic_count", in_props.units);
	var tooltipDataB = in_props.document.GetTooltip("attribute_mg", in_props.units);
	//console.log("tooltipDataA:" + JSON.stringify(tooltipDataA));
	var headingRight = e("div", null, displayName, e(ToolTip, {"text":[tooltipDataA]}), "/", e(ToolTip, {"text":[tooltipDataB]}));	

	var newProps = {
		"top" : {
			"headingLeft" : in_props.documentManager.GetLocaleData("equipment"),
			"headingRight" : headingRight,
			"onAdd" : DealOnAdd("equipment_array", in_props),
		},
		"body" : {
			"onRemove" : function(in_index){
				var documentsInner = in_props.document.GetValue("equipment_array");
				var newArray = documentsInner.concat([]);
				newArray.splice(in_index, 1);
				in_props.onSetValue("equipment_array", newArray);
			},
			"leftProps" : [{"style":{"flexGrow":0,"flexShrink":0,"flexBasis":"1em"}},{"style":{"flexGrow":0,"flexShrink":0,"flexBasis":"1em"}},{"style":{"flexGrow":0,"flexShrink":0}}],
			"rightProps" : [{"style":{"flexGrow":0,"flexShrink":0,"flexBasis":"4em"}}],
			"content" : arrayContent,
		}
	};
	return e(CharacterTable, newProps);
}

const DealOnAdd = function(in_propertyName, in_props){
	var propertyData = in_props.documentManager.GetDocumentPropertyData(in_props.document.GetType(), in_propertyName);
	return function(){ 
		if ((undefined === propertyData) || (undefined === propertyData.childtypeoptions)){
			return;
		}

		var keyArray = Object.keys(propertyData.childtypeoptions);
		if (1 === keyArray.length){
			var type = keyArray[0];
			DealOnAddType(in_propertyName, in_props, type);
			return;
		}

		if (1 < keyArray.length){
			in_props.onAddModalDialog(ModalDialogSelectFactory(
				"Add Child",//in_heading, 
				"select type to add", //in_body, 
				propertyData.childtypeoptions, //in_selectArray, 
				function(in_data){
					//console.log("DealOnAdd modal ok data:" + JSON.stringify(in_data));
					var type = in_data.data.select;
					DealOnAddType(in_propertyName, in_props, type);
				},//in_okCallback, 
			));
		}
	}
}	

const DealOnAddType = function(in_propertyName, in_props, in_type){
	//console.log("DealOnAddType in_propertyName:" + in_propertyName + " in_props:" + in_props + " in_type:" + in_type);
	if (undefined === in_type){
		return;
	}

	var valueArray = in_props.document.GetValue(in_propertyName);
	var newDocumentData = in_props.documentManager.NewDocumentData(in_type);
	if (undefined === newDocumentData){
		return;
	}

	//console.log("DocumentDataToDocument newDocumentData:" + JSON.stringify(newDocumentData));
	var newDocument = in_props.documentManager.DocumentDataToDocument(newDocumentData);
	var newArray = valueArray.concat([newDocument]);
	in_props.onSetValue(in_propertyName, newArray);
	//console.log("DealOnAddType end");
}
