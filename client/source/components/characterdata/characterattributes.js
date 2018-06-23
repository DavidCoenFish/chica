import React from "react";
const e = React.createElement;

import {ToolTip} from "./../tooltip/tooltip.js";
import {ButtonFactoryAttributeTop, ButtonFactoryAttributeBottom} from "./../button/button.js";

/*
	"document": in_props.currentDocument,
	"documentManager" : in_props.documentManager,
	"onNavDown" : in_props.onNavDown, 
	"onSetValue" : in_props.onSetValue
 */
export const CharacterAttributes = function(in_props){
	var newProps = {"style" : {"width":"25em","height":"12em","margin":"0 0 0.5em 0.5em","position":"relative"}};

	return e("div", newProps,
		e(SimpleBox, {"top":"0","left":"0", "name":"remaining_attribute_points", "document":in_props.document, "documentManager":in_props.documentManager}),
		e(SimpleBox, {"top":"0","left":"10em", "name":"attribute_he", "document":in_props.document, "documentManager":in_props.documentManager}),
		e(AttributeBox, {"top":"0","left":"15em","borderStyle":"solid none none solid", "name":"attribute_fa", "spent":"spent_fa","racialMax":"racialmax_fa", "document":in_props.document, "documentManager":in_props.documentManager, "onSetValue":in_props.onSetValue}),
		e(EmptyBox, {"top":"0","left":"20em","borderStyle":"none none none solid"}),

		e(SimpleBox, {"top":"3em","left":"5em", "name":"attribute_vg", "document":in_props.document, "documentManager":in_props.documentManager}),
		e(AttributeBox, {"top":"3em","left":"10em","borderStyle":"solid none none solid", "name":"attribute_pc", "spent":"spent_pc","racialMax":"racialmax_pc", "document":in_props.document, "documentManager":in_props.documentManager, "onSetValue":in_props.onSetValue}),
		e(AttributeBox, {"top":"3em","left":"15em","borderStyle":"solid none none solid", "name":"attribute_wp", "spent":"spent_wp","racialMax":"racialmax_wp", "document":in_props.document, "documentManager":in_props.documentManager, "onSetValue":in_props.onSetValue}),
		e(SimpleBox, {"top":"3em","left":"20em", "borderStyle":"none none none solid", "name":"attribute_in", "document":in_props.document, "documentManager":in_props.documentManager}),

		e(SimpleBox, {"top":"6em","left":"0","name":"attribute_cd", "document":in_props.document, "documentManager":in_props.documentManager}),
		e(AttributeBox, {"top":"6em","left":"5em","borderStyle":"solid none none solid","name":"attribute_ag", "spent":"spent_ag","racialMax":"racialmax_ag", "document":in_props.document, "documentManager":in_props.documentManager, "onSetValue":in_props.onSetValue}),
		e(AttributeBox, {"top":"6em","left":"10em","borderStyle":"solid none none solid","name":"attribute_md", "spent":"spent_md","racialMax":"racialmax_md", "document":in_props.document, "documentManager":in_props.documentManager, "onSetValue":in_props.onSetValue}),
		e(SimpleBox, {"top":"6em","left":"15em", "borderStyle":"solid none none solid","name":"attribute_ch", "document":in_props.document, "documentManager":in_props.documentManager}),

		e(AttributeBox, {"top":"9em","left":"0","borderStyle":"solid none none solid","name":"attribute_st", "spent":"spent_st","racialMax":"racialmax_st", "document":in_props.document, "documentManager":in_props.documentManager, "onSetValue":in_props.onSetValue}),
		e(AttributeBox, {"top":"9em","left":"5em","borderStyle":"solid none none solid","name":"attribute_ps", "spent":"spent_ps","racialMax":"racialmax_ps", "document":in_props.document, "documentManager":in_props.documentManager, "onSetValue":in_props.onSetValue}),
		e(SimpleBox, {"top":"9em","left":"10em", "borderStyle":"solid none none solid","name":"attribute_br", "document":in_props.document, "documentManager":in_props.documentManager}),

		e(EmptyBox, {"top":"12em","left":"0","borderStyle":"solid none none none"}),
		e(EmptyBox, {"top":"12em","left":"5em","borderStyle":"solid none none none"}),
	);
}

const EmptyBox = function(in_props){
	var newProps = {
		"style" : {
			"position":"absolute",
			"borderStyle":((in_props.borderStyle !== undefined) ? in_props.borderStyle : "solid"),
			"borderWidth":"1px",
			"top":((in_props.top !== undefined) ? in_props.top : "0"),
			"left":((in_props.left !== undefined) ? in_props.left : "0"),
			"width":"5em",
			"height":"3em"
		}
	};
	return e("div", newProps);
}

const GetClassNameTop = function (in_document){
	var remainingPoints = in_document.GetValue("remaining_attribute_points");
	if (0 < remainingPoints){
		return "interact";
	}
	return "disable";
}

const GetClassNameBottom = function (in_document, in_spentName){
	var remainingPoints = in_document.GetValue("remaining_attribute_points");
	var spentPoints = in_document.GetValue(in_spentName);
	if (remainingPoints < 0){
		return "destruct";
	}
	if (0 < spentPoints){
		return "interact";
	}
	return "disable";
}

const AttributeBox = function(in_props){
	var newProps = {
		"style" : {
			"position":"absolute",
			"borderStyle":((in_props.borderStyle !== undefined) ? in_props.borderStyle : "solid"),
			"borderWidth":"1px",
			"top":((in_props.top !== undefined) ? in_props.top : "0"),
			"left":((in_props.left !== undefined) ? in_props.left : "0"),
			"width":"5em",
			"height":"3em",
			"display":"flex",
			"flexDirection":"column",
			"flexWrap":"nowrap",
			"justifyContent":"flex-end",
			"alignItems":"center"
		}
	};
	var topClassName = GetClassNameTop(in_props.document);
	var bottomClassName = GetClassNameBottom(in_props.document, in_props.spent);
	var displayName = in_props.document.GetLocaleName(in_props.name);
	var tooltipData = in_props.document.GetTooltip(in_props.name, in_props.units);
	//var tooltipDataThreshold = in_props.document.GetTooltip(in_props.racialMax, in_props.units);
	return e("div", newProps,
		e(ToolTip, {"text":[tooltipData], "style":{"fontSize":"2em"}}),

		e("span", { "style":{"fontSize":"0.7em"}}, displayName),
		e("div", { "style":{"left":0,"top":0,"position":"absolute","borderStyle":"none solid solid none","borderWidth":"1px","width":"0.85em","height":"1em"}}, 
			e("span", {"style":{"fontSize":"0.8em","width":"100%","top":"-0.1em","position":"absolute","textAlign":"center"}}, in_props.document.GetValue(in_props.racialMax))
			//e(ToolTip, {"text":tooltipDataThreshold, "style":{"fontSize":"0.8em","width":"100%","top":"-0.1em","position":"absolute","textAlign":"center"}}),
		),
		ButtonFactoryAttributeTop("tinybutton" + " " + topClassName, function(in_event){
			if (topClassName === "disable"){
				return;
			}
			var spent = in_props.document.GetValue(in_props.spent);
			spent += 1;
			in_props.onSetValue(in_props.spent, spent);
		}),
		ButtonFactoryAttributeBottom("tinybutton" + " " + bottomClassName, function(in_event){
			var spent = in_props.document.GetValue(in_props.spent);
			spent -= 1;
			in_props.onSetValue(in_props.spent, spent);
		})
	);
}

const SimpleBox = function(in_props){
	var tooltipData = in_props.document.GetTooltip(in_props.name, in_props.units);

	var newProps = {
		"style" : {
			"position":"absolute",
			"borderStyle":((in_props.borderStyle !== undefined) ? in_props.borderStyle : "none"),
			"borderWidth":"1px",
			"top":((in_props.top !== undefined) ? in_props.top : "0"),
			"left":((in_props.left !== undefined) ? in_props.left : "0"),
			"width":"5em",
			"height":"3em",
			"display":"flex",
			"flexDirection":"column",
			"flexWrap":"nowrap",
			"justifyContent":"flex-end",
			"alignItems":"center"
		}
	};
	var displayName = in_props.documentManager.GetLocaleData(in_props.name);
	return e("div", newProps,
		e(ToolTip, {"text":[tooltipData], "style":{"fontSize":"2em"}}),
		e("span", { "style":{"fontSize":"0.7em"}}, displayName),
	);
}
