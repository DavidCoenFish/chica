import React from "react";
const e = React.createElement;
import {CharacterStatsWrapper} from "./characterstatswrapper.js"
import {CharacterStatsString} from "./characterstatsstring.js"
import {CharacterStatsFloat} from "./characterstatsfloat.js"
import {CharacterStatsUnits} from "./characterstatsunits.js"
import {CharacterStatsSelect} from "./characterstatsselect.js"


const CharacterBasicWrapper = function(in_style, in_innerReactFactory, in_innerProps){
	var style = {
		"position":"absolute",
		"top":((in_style.top !== undefined) ? in_style.top : "0"),
		"left":((in_style.left !== undefined) ? in_style.left : "0"),
		"width":((in_style.width !== undefined) ? in_style.width : "8em"),
		"height":((in_style.height !== undefined) ? in_style.height : "3em")
	};
	var name = in_innerProps.documentManager.GetLocaleData(in_innerProps.name);
	return e("div", { "style" : style}, e(in_innerReactFactory, in_innerProps), e("p", {"style":{"fontSize":"0.8em"}}, name));
}

/*
	"document": in_props.currentDocument,
	"documentManager" : in_props.documentManager,
	"onNavDown" : in_props.onNavDown, 
	"onSetValue" : in_props.onSetValue
 */
export const CharacterBasic = function(in_props){
	var newProps = {"style" : {"width":"25em","height":"12em","margin":"0 0 0.5em 0.5em","position":"relative"}};

	//console.log("units" + in_props.units);

	return e("div", newProps,
		e(CharacterStatsWrapper, Object.assign({"top":"0","left":"0","width":"25em", "factory": CharacterStatsString, "name":"name"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"3em","left":"0", "factory": CharacterStatsSelect, "name":"race"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"3em","left":"8.5em", "factory": CharacterStatsSelect, "name":"gender"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"3em","left":"17em", "factory": CharacterStatsFloat, "name":"age"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"6em","left":"0", "factory": CharacterStatsSelect, "name":"alignment_social"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"6em","left":"8.5em", "factory": CharacterStatsSelect, "name":"alignment_law"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"6em","left":"17em", "factory": CharacterStatsSelect, "name":"alignment_moral"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"9em","left":"0", "factory": CharacterStatsUnits, "name":"height"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"9em","left":"8.5em", "factory": CharacterStatsUnits, "name":"mass"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"9em","left":"17em", "factory": CharacterStatsSelect, "name":"handedness"}, in_props)),
	);
}
