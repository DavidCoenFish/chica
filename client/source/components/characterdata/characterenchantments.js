import {CharacterTable} from "./charactertable.js";
import React from "react";
const e = React.createElement;

/*
	"document": in_props.currentDocument,
	"documentManager" : in_props.documentManager,
	"onNavDown" : in_props.onNavDown, 
	"onSetValue" : in_props.onSetValue

*/
export const CharacterEnchantments = function(in_props){
	var arrayContent = [];
	var enchantments = in_props.document.GetValue("enchantment_array");

	for (var index = 0, total = enchantments.length; index < total; index++) {
		var item = enchantments[index];
		//✓✗
		var active = item.GetValue("active");
		var attribute = in_props.documentManager.GetLocaleData(item.GetValue("attribute"));
		var delta = item.GetValue("delta");
		var level = item.GetValue("level");

		var content = {
			"left" : [active ? "✓" : "✗", attribute, delta],
			"right" : [level],
			"onClick":(function(in_index){ 
				return function(in_event){ 
					in_event.preventDefault();
					in_props.onNavDown(["enchantment_array", in_index]);
				};
			})(index)
		};
		arrayContent.push(content);
	}

	var newProps = {
		"top" : {
			"headingLeft" : in_props.documentManager.GetLocaleData("enchantments"),
			"headingRight" : undefined,
			"onAdd" : function(){ 
				var enchantmentsInner = in_props.document.GetValue("enchantment_array");
				var newEnchantmentData = in_props.documentManager.NewDocumentData("enchantment");
				var newEnchantment = in_props.documentManager.DocumentDataToDocument(newEnchantmentData);
				var newArray = enchantmentsInner.concat([newEnchantment]);
				in_props.onSetValue("enchantment_array", newArray);
			},
		},
		"body" : {
			"onRemove" : function(in_index){
				var enchantmentsInner = in_props.document.GetValue("enchantment_array");
				var newArray = enchantmentsInner.concat([]);
				newArray.splice(in_index, 1);
				in_props.onSetValue("enchantment_array", newArray);
			},
			"leftProps" : [{"style":{"flexGrow":0,"flexShrink":0,"flexBasis":"1em"}},{"style":{"flexGrow":0,"flexShrink":0}},{"style":{"flexGrow":0,"flexShrink":0}}],
			"rightProps" : [{"style":{"flexGrow":0,"flexShrink":0,"flexBasis":"1em"}}],
			"content" : arrayContent,
		}
	};
	return e(CharacterTable, newProps);
}