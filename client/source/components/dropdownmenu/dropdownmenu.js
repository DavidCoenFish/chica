import React from "react";
import './style.css';

const e = React.createElement;
/*
{
	"factory" : function(in_data),
	"text" : "",
	"enabled" : true,
	"method" : function()
	"children" : [...]
}
*/

export const DropDownMenuFactoryTop = function(in_item, in_index, in_subMenu){
	var childProps = { className:"standard" };
	if (false !== in_item.enabled){
		childProps["className"] += " interact";
	} else {
		childProps["className"] += " disable";
	}
	//return e("a", childProps, in_item.text);
	return e("li", {key:in_index}, 
		e("a", childProps, in_item.text), in_subMenu);
}

export const DropDownMenuFactoryInteractive = function(in_item, in_index, in_subMenu){
	var content = undefined;
	var spanContent = (true === in_item.toggle) ? "✔" : "";
	var span = e("span", {"style" :{ "display":"inline-block", "width":"1em"}}, spanContent);
	if (false !== in_item.enabled){
		var childProps = { className:"wide interact" };
		if ("method" in in_item){
			childProps["onClick"] = function(in_event){ in_item.method(in_item); return; }
		}
		if ("children" in in_item){
			childProps["className"] += " expand";
		}
		content = e("a", childProps, span, in_item.text);
	} else {
		content = e("label", {className:"wide"}, span, in_item.text);
	}
	return e("li", {key:in_index}, content, in_subMenu);
}
export const DropDownMenuFactorySeperator = function(in_item, in_index, in_subMenu){
	return e("li", {"key":in_index, "className" : "wide", "style" : {"display" : "block", "minHeight" : "0.2em"}});
}

export const DropDownMenuFactoryFileOpen = function(in_item, in_index, in_subMenu){
	var content = undefined;
	var spanContent = (true === in_item.toggle) ? "✔" : "";
	var span = e("span", {"style" :{ "display":"inline-block", "width":"1em"}}, spanContent);
	if (false !== in_item.enabled){
		var childProps = { className:"wide interact" };
		if ("children" in in_item){
			childProps["className"] += " expand";
		}
		content = e("label", childProps, 
			e("input", { 
				"type":"file", 
				"required":"required",
				"accept": in_item.accept,
				"onChange": function(in_event){
					if (0 < in_event.target.files.length){
						var file = in_event.target.files[0];
						in_item.method(file);
					}
					return;
				},
				"style" : { "position" : "fixed", "top" : "-100em" }
			}),
			span,
			in_item.text
			);
	} else {
		content = e("label", {className:"wide"}, span, in_item.text);
	}

	return e("li", {key:in_index}, content, in_subMenu);
}

/*
in_props.children = []
[in_props.paddLeft] ~ style?
*/
export const DropDownMenu = function(in_props){
	//console.log("HMenu in_props:" + JSON.stringify(in_props) + " " + (typeof(in_props.children)));
	var childContents = undefined;
	if ((in_props != undefined) && (in_props.children != undefined)){
		childContents = in_props.children.map((item, index) => {
			var subMenu = undefined;
			if ("children" in item){
				subMenu = e(VMenu, item);
			}
			return item.factory(item, index, subMenu);
			//return e("li", {key:index}, content, subMenu);
		});
	}
	var newProps = {};
	newProps["className"] = "menu";
	newProps["style"] = {display:"flex", "paddingLeft":in_props.paddLeft, "flexGrow":"0", "flexShrink":"0"};
	return e("ul", newProps, childContents);
}

/*
*/
const VMenu = function(in_props){
	var childContents = undefined;
	if ((in_props !== undefined) && (in_props.children !== undefined)){
		childContents = in_props.children.map((item, index) => {
			var subMenu = undefined;
			if ("children" in item){
				subMenu = e(VMenu, item);
			}
			return item.factory(item, index, subMenu);
			//return e("li", {key:index}, content, subMenu);
		});
	}

	return e("ul", null, childContents);
}

//export {DropDownMenu, DropDownMenuFactoryTop, DropDownMenuFactoryInteractive, DropDownMenuFactorySeperator, DropDownMenuFactoryFileOpen }
