import React from "react";
const e = React.createElement;

export const CharacterStatsSelect = function(in_props){
	var type = in_props.document.GetType();
	var propertyData = in_props.documentManager.GetDocumentPropertyData(type, in_props.name);
	//console.log("CharacterBasicSelect propertyData:" + JSON.stringify(propertyData));
	var childrenArray = [];
	if ((undefined != propertyData) && (undefined != propertyData.keyoptions)){
		for (var key in propertyData.keyoptions) {
			if (false === propertyData.keyoptions.hasOwnProperty(key)) {
				continue;
			}
			var option = propertyData.keyoptions[key];
			var newProps = { "value" : key, "key" : key};
			childrenArray.push(e("option", newProps, option));
		}
	}

	return e("select", { 
		"className":"interact", 
		"style":{"width":"100%","padding":"1px"},
		"value":in_props.document.GetValue(in_props.name),
		"onChange":function(in_event){ in_props.onSetValue(in_props.name, in_event.target.value);},
	}, childrenArray);
}