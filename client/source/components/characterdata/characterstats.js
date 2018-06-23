import React from "react";
const e = React.createElement;
import {CharacterStatsFloat} from "./characterstatsfloat.js"
import {CharacterStatsInt} from "./characterstatsint.js"
import {CharacterStatsSelect} from "./characterstatsselect.js"
import {CharacterStatsStatic} from "./characterstatsstatic.js"
import {CharacterStatsString} from "./characterstatsstring.js"
import {CharacterStatsWrapper} from "./characterstatswrapper.js"


/*
	"document": in_props.currentDocument,
	"documentManager" : in_props.documentManager,
	"onNavDown" : in_props.onNavDown, 
	"onSetValue" : in_props.onSetValue
 */
export const CharacterStats = function(in_props){
	var newProps = {"style" : {"width":"25em","height":"12em","margin":"0 0 0.5em 0.5em","position":"relative"}};

	return e("div", newProps,
		e(CharacterStatsWrapper, Object.assign({"top":"0","left":"0", "factory": CharacterStatsInt, "name":"experence_points"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"0","left":"8.5em", "factory": CharacterStatsStatic, "name":"remaining_experence_points"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"0","left":"17em", "factory": CharacterStatsStatic, "name":"level"}, in_props)),

		e(CharacterStatsWrapper, Object.assign({"top":"3em","left":"0", "factory": CharacterStatsStatic, "name":"attribute_dhr"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"3em","left":"8.5em", "factory": CharacterStatsStatic, "name":"attribute_tu"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"3em","left":"17em", "factory": CharacterStatsStatic, "name":"attribute_td"}, in_props)),

		e(CharacterStatsWrapper, Object.assign({"top":"6em","left":"0", "factory": CharacterStatsFloat, "name":"physical_damage"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"6em","left":"8.5em", "factory": CharacterStatsFloat, "name":"illusion_damage"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"6em","left":"17em", "factory": CharacterStatsFloat, "name":"fatigue"}, in_props)),

		e(CharacterStatsWrapper, Object.assign({"top":"9em","left":"0", "factory": CharacterStatsStatic, "name":"current_dt"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"9em","left":"8.5em", "factory": CharacterStatsStatic, "name":"attribute_dt"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"9em","left":"17em", "factory": CharacterStatsStatic, "name":"status"}, in_props)),
	);
}

