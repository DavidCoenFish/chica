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
export const CharacterCombat = function(in_props){
	var newProps = {"style" : {"width":"25em","height":"12em","margin":"0 0 0.5em 0.5em","position":"relative"}};

	return e("div", newProps,
		e(CharacterStatsWrapper, Object.assign({"top":"0","left":"0", "factory": CharacterStatsSelect, "name":"current_loadout"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"0","left":"8.5em", "factory": CharacterStatsStatic, "name":"attribute_sp"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"0","left":"17em", "factory": CharacterStatsStatic, "name":"max_speed"}, in_props)),

		e(CharacterStatsWrapper, Object.assign({"top":"3em","left":"0", "factory": CharacterStatsStatic, "name":"right_hand_equipment_name"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"3em","left":"8.5em", "factory": CharacterStatsStatic, "name":"right_hand_attack_bonus"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"3em","left":"17em", "factory": CharacterStatsStatic, "name":"parry"}, in_props)),

		e(CharacterStatsWrapper, Object.assign({"top":"6em","left":"0", "factory": CharacterStatsStatic, "name":"left_hand_equipment_name"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"6em","left":"8.5em", "factory": CharacterStatsStatic, "name":"left_hand_attack_bonus"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"6em","left":"17em", "factory": CharacterStatsStatic, "name":"combat_level"}, in_props)),

		e(CharacterStatsWrapper, Object.assign({"top":"9em","left":"0", "factory": CharacterStatsStatic, "name":"armor_name"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"9em","left":"8.5em", "factory": CharacterStatsStatic, "name":"attribute_df"}, in_props)),
		e(CharacterStatsWrapper, Object.assign({"top":"9em","left":"17em", "factory": CharacterStatsStatic, "name":"loadout_absorption"}, in_props)),
	);
}

