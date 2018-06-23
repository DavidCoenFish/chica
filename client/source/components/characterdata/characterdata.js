import {BackBoard} from "./../backboard/backboard.js";
import {CharacterEdit} from "./characteredit.js";
import React from "react";
const e = React.createElement;

export const CharacterData = function(in_props){
	const newProps = {
		"className" : "backboardparent",
		"style" : {
			"flexGrow":1,
			"flexShrink":0
		}
	};
	return e("div", newProps, 
		e(BackBoard, {"top":"-0.75em","right":"0.5em","bottom":"0.0em","left":"0.5em"}), 
		e(CharacterEdit, in_props)
	);
}
