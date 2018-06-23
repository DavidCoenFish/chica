import {BackBoard} from "./../backboard/backboard.js";
import {DocumentEdit} from "./documentedit.js";
import React from "react";
const e = React.createElement;

export const ReducerDocumentData = function(in_state, in_action){
	if (in_state === undefined){
		return {};
	}

	switch (in_action.type){
		case "new":
			//console.log("new in_action:" + JSON.stringify(in_action));
			var newState = in_action.documentManager.NewDocumentData(in_action.documentType);
			if (JSON.stringify(in_state) !== JSON.stringify(newState)){
				return newState;
			}
			break;
		case "load": //function(in_documentData){ in_dispatch({"type" : "load", "documentData" : in_documentData, "documentManager" : in_props.documentManager});},
			//console.log("new in_action:" + JSON.stringify(in_action));
			var newDocument = in_action.documentManager.DocumentDataToDocument(in_action.documentData);
			var newState = (newDocument != null) ? in_action.documentManager.DocumentToDocumentData(newDocument) : {};
			if (JSON.stringify(in_state) !== JSON.stringify(newState)){
				return newState;
			}
			break;
		case "setValue": //"navigation", "name", "value"
			//console.log("setValue in_action.name:" + JSON.stringify(in_action.name) + " value:" + JSON.stringify(in_action.value) + " navigation:" + JSON.stringify(in_action.navigation));
			var document = in_action.documentManager.DocumentDataToDocument(in_state);
			if (document == null){
				break; 
			}
			var currentDocument = NavigateDocument(document, in_action.navigation, in_action.documentManager);
			if (currentDocument === undefined){
				break;
			}
			currentDocument.SetValue(in_action.name, in_action.value);
			var newState = in_action.documentManager.DocumentToDocumentData(document);
			if (JSON.stringify(in_state) !== JSON.stringify(newState)){
				return newState;
			}
			break;
		case "setValueDisplay": //"navigation", "name", "value"
			//console.log("setValueDisplay in_action.name:" + in_action.name + " valueDisplay:" + in_action.valueDisplay + " navigation:" + JSON.stringify(in_action.navigation) + " units:" + in_action.units);
			var document = in_action.documentManager.DocumentDataToDocument(in_state);
			if (document == null){
				break; 
			}
			var currentDocument = NavigateDocument(document, in_action.navigation, in_action.documentManager);
			if (currentDocument === undefined){
				break;
			}
			currentDocument.SetDisplayValue(in_action.name, in_action.units, in_action.valueDisplay);

			var newState = in_action.documentManager.DocumentToDocumentData(document);
			if (JSON.stringify(in_state) !== JSON.stringify(newState)){
				return newState;
			}
			break;
	}

	return in_state;
}

export const NavigateDocument = function(in_document, in_navigation, in_documentManager){
	var currentDocument = in_document;
	if ((in_document != null) && (in_navigation != undefined)){
		for (var index = 0, total = in_navigation.length; index < total; index++) {
			var propertyNameArray = in_navigation[index];
			//console.log("NavigateDocument propertyNameArray:" + JSON.stringify(propertyNameArray));
			var propertyName = propertyNameArray[0];
			var type = currentDocument.GetType();
			var propertyData = in_documentManager.GetDocumentPropertyData(type, propertyName);
			//console.log(" propertyName:" + propertyName + " propertyData:" + JSON.stringify(propertyData));
			var child = undefined;
			switch (propertyData.type){
				case "document":
					child = currentDocument.GetValue(propertyName);
					//console.log(" child:" + child + " type:" + child.GetType());
					break;
				case "documentarray":
					var cursorIndex = propertyNameArray[1];
					var childArray = currentDocument.GetValue(propertyName);
					if ((childArray != undefined) && (0 <= cursorIndex) && (cursorIndex < childArray.length)){
						child = childArray[cursorIndex];
					}
					break;
				case "iddocumentmap":
					var cusrorKey = propertyNameArray[1];
					var childObject = currentDocument.GetValue(propertyName);
					if ((childObject != undefined) && (cusrorKey in childObject)){
						child = childObject[cusrorKey];
					}
					break;
				default:
					break;
			}
			if (child !== undefined){
				currentDocument = child;
			} else {
				break;
			}
		}
	}

	return currentDocument;
}

export const DocumentData = function(in_props){
	const newProps = {
		"className" : "backboardparent",
		"style" : {
			"flexGrow":1,
			"flexShrink":0
		}
	};
	return e("div", newProps, 
		e(BackBoard, {"top":"-0.75em","right":"0.5em","bottom":"0.0em","left":"0.5em"}), 
		e(DocumentEdit, in_props)
	);
}
