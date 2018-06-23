import './style.css';
import React from "react";
const e = React.createElement;

export const ButtonFactoryStandardInteractive = function(in_onClick, in_label, in_key){
	return e(Button, { "className" : "button standard interact", "onClick" : in_onClick, "key" : in_key, "label" : in_label});
}
export const ButtonFactoryStandardDestruct = function(in_onClick, in_label, in_key){
	return e(Button, { "className" : "button standard destruct", "onClick" : in_onClick, "key" : in_key, "label" : in_label});
}
export const ButtonFactoryStandardCall = function(in_onClick, in_label, in_key){
	return e(Button, { "className" : "button standard call", "onClick" : in_onClick, "key" : in_key, "label" : in_label});
}
export const ButtonFactoryStandardDisable = function(in_onClick, in_label, in_key){
	return e(Button, { "className" : "button standard disable", "onClick" : in_onClick, "key" : in_key, "label" : in_label});
}
export const ButtonFactoryShrinkwrapInteractive = function(in_onClick, in_label, in_key){
	return e(Button, { "className" : "button interact", "onClick" : in_onClick, "key" : in_key, "label" : in_label});
}
export const ButtonFactoryAttributeTop = function(in_className, in_onClick, in_label){
	return e("a", { "className" : in_className, "onClick" : in_onClick, "style":{"position":"absolute","top":"0","right":"0","width":"0.85em","height":"1em", "borderStyle":"none none solid solid"}},
		e("span", {"style":{"position":"absolute","top":"-0.25em","left":"0","width":"100%","textAlign":"center"}}, "▴")
	);
}
export const ButtonFactoryAttributeBottom = function(in_className, in_onClick, in_label){
	return e("a", { "className" : in_className, "onClick" : in_onClick, "style":{"position":"absolute","bottom":"0","right":"0","width":"0.85em","height":"1em", "borderStyle":"solid none none solid"}},
		e("span", {"style":{"position":"absolute","top":"-0.25em","left":"0","width":"100%","textAlign":"center"}}, "▾")
	);
}

/*
	{"className" : "button interact", "key":"close", "onClick" : function(in_event){in_props.onClick();}}, "X"));
	in_props("passKey":optional, "onClick":optional, "label":, "flavour"
*/
export const Button = function(in_props){
	var newProps = {
		"className" : in_props.className, // "button",
		"onClick" : in_props.onClick,
		"style" : in_props.style
	};
	//console.log("Button newProps:" + JSON.stringify(newProps) + " in_props:" + JSON.stringify(in_props));
	return e("a", newProps, in_props.label);
}