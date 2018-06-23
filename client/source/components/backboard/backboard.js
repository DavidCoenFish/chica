import './style.css';
import React from "react";
const e = React.createElement;

const BackBoard = function(props){
	return e("div", {
		"className":"backboard",
		"style":props
	}, e("div", {"className":"backboardinner"}))
}

export {BackBoard};