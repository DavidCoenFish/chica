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
export const CharacterMisc = function(in_props){
	var newProps = {"style" : {"width":"25em","height":"12em","margin":"0 0 0.5em 0.5em","position":"relative"}};

	return e("div", newProps,
		e(CharacterStatsWrapper, Object.assign({"top":"0","left":"0", "factory": CharacterStatsInt, "name":"copper_coins"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"0","left":"8.5em", "factory": CharacterStatsInt, "name":"latten_coins"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"0","left":"17em", "factory": CharacterStatsInt, "name":"silver_coins"}, in_props)),

		e(CharacterStatsWrapper, Object.assign({"top":"3em","left":"0", "factory": CharacterStatsInt, "name":"electrum_coins"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"3em","left":"8.5em", "factory": CharacterStatsInt, "name":"gold_coins"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"3em","left":"17em", "factory": CharacterStatsInt, "name":"platinum_coins"}, in_props)),
//mass_coins//
		e(CharacterStatsWrapper, Object.assign({"top":"6em","left":"0", "factory": CharacterStatsStatic, "name":"mass_carried"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"6em","left":"8.5em", "factory": CharacterStatsStatic, "name":"attribute_ten"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"6em","left":"17em", "factory": CharacterStatsStatic, "name":"attribute_tem"}, in_props)),

		e(CharacterStatsWrapper, Object.assign({"top":"9em","left":"0", "factory": CharacterStatsSelect, "name":"deity"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"9em","left":"8.5em", "factory": CharacterStatsSelect, "name":"culture"}, in_props)),

	);
}

