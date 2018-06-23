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
export const CharacterTalents = function(in_props){
	var arrayContent = [];
	var talentArrayBase = in_props.document.GetValue("talent_array_base"); //talents we have purchased
	var talentMap = in_props.document.GetValue("talent_map"); //all the talents, added those gained from class or deity

	//console.log("talentMap:" + JSON.stringify(talentMap));

	var addedTalents = {};
	for (var index = 0, total = talentArrayBase.length; index < total; index++) {
		var talent = talentArrayBase[index];
		var name = in_props.documentManager.GetLocaleData(talent);

		var content = {
			"left" : ["✓", name],
		};
		arrayContent.push(content);

		addedTalents[talent] = true;
	}

	//disableRemove
	for (var talent in talentMap) {
		if (false === talentMap.hasOwnProperty(talent)) {
			continue;
		}
		if (talent in addedTalents){
			continue;
		}

		var name = in_props.documentManager.GetLocaleData(talent);

		var content = {
			"left" : ["✗", name],
			"disableRemove" : true,
		};
		arrayContent.push(content);

	}

	var newProps = {
		"top" : {
			"headingLeft" : in_props.documentManager.GetLocaleData("talents"),
			"headingRight" : undefined,
			"onAdd" : DealOnAdd("talent_array_base", in_props),
		},
		"body" : {
			"onRemove" : function(in_index){
				var arrayDocuments = in_props.document.GetValue("talent_array_base");
				//console.log("enchantments onRemove:" + enchantmentsInner.length);
				var newArray = arrayDocuments.concat([]);
				newArray.splice(in_index, 1);
				in_props.onSetValue("talent_array_base", newArray);
			},
			"leftProps" : [{"style":{"flexGrow":0,"flexShrink":0,"flexBasis":"1em"}},{"style":{"flexGrow":0,"flexShrink":0}}],
			"content" : arrayContent,
		}
	};
	return e(CharacterTable, newProps);
}

const DealOnAdd = function(in_propertyName, in_props){
	var talentOptions = in_props.document.GetValue("talent_options");
	//console.log("talentOptions:" + JSON.stringify(talentOptions));
	return function(){ 
		if (undefined === talentOptions){
			return;
		}

		var keyArray = Object.keys(talentOptions);
		var selectData = {};
		for (var index = 0, total = keyArray.length; index < total; index++) {
			var talent = keyArray[index];
			selectData[talent] = in_props.documentManager.GetLocaleData(talent);
		}

		in_props.onAddModalDialog(ModalDialogSelectFactory(
			"Add Talent",//in_heading, 
			"select talent to add", //in_body, 
			selectData,
			function(in_data){
				//console.log("DealOnAdd modal ok data:" + JSON.stringify(in_data));
				var talent = in_data.data.select;
				DealOnAddType(in_propertyName, in_props, talent);
			},//in_okCallback, 
		));
	}
}	

const DealOnAddType = function(in_propertyName, in_props, in_talent){
	//console.log("DealOnAddType in_propertyName:" + in_propertyName + " in_props:" + in_props + " in_talent:" + in_talent);
	if (undefined === in_talent){
		return;
	}

	var valueArray = in_props.document.GetValue(in_propertyName);
	var newArray = valueArray.concat([in_talent]);
	in_props.onSetValue(in_propertyName, newArray);
}
