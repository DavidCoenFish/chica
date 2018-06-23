import {CharacterAttributes} from "./characterattributes.js";
import {CharacterBasic} from "./characterbasic.js";
import {CharacterClasses} from "./characterclasses.js";
import {CharacterCombat} from "./charactercombat.js";
import {CharacterEnchantments} from "./characterenchantments.js";
import {CharacterEquipment} from "./characterequipment.js";
import {CharacterMisc} from "./charactermisc.js";
import {CharacterSkills} from "./characterskills.js";
import {CharacterStats} from "./characterstats.js";
import {CharacterTalents} from "./charactertalents.js";
import './style.css';
import React from "react";
const e = React.createElement;

export const CharacterEdit = function(in_props){
	var newProps = {
		"className" : "container",
		"style":{"padding":"0.5em 1.0em 0.5em 0.5em"}
	};
	//return e("span", null, "CharacterEdit");
	return e("div", newProps, 
		CharacterBasic(in_props),
		CharacterAttributes(in_props),
		CharacterEnchantments(in_props),
		CharacterStats(in_props),
		CharacterClasses(in_props),
		CharacterCombat(in_props),
		CharacterEquipment(in_props),
		CharacterMisc(in_props),
		CharacterSkills(in_props),
		CharacterTalents(in_props),
	);
}
