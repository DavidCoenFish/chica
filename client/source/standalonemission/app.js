import React from "react";
import {combineReducers} from "redux";
import {connect} from "react-redux";
import {createSelector} from "reselect";
import {Navigation, ReducerNavigation} from "./../components/navigation/navigation.js";
import {DocumentData, ReducerDocumentData, NavigateDocument} from "./../components/documentdata/documentdata.js";
import {DropDownMenu} from "./../components/dropdownmenu/dropdownmenu.js";

import {Footer} from "./../components/footer/footer.js";
import {ReducerUndoRedo} from "./../components/undoredo/undoredo.js";
import {GenerateMenuData} from "./menu.js";
import {ModalDialog, ReducerModalDialogStack} from "./../components/modaldialog/modaldialog.js";

import {StandaloneMissionData} from "./standalonemissiondata.js"

const e = React.createElement;

export const ReducerGenericApp = function(in_state, in_action){
	if (in_state === undefined){
		return { 
			"units" : "metric",
		}
	}

	switch (in_action.type){
		case "setUnits":
			var result = Object.assign({}, in_state);
			result.units = in_action.units;
			return result;
		default:
			break;
	}

	return in_state;
}

export const AppReducer = combineReducers({
	"navigation" : ReducerNavigation,
	"undoRedo" : ReducerUndoRedo(ReducerDocumentData),
	"modalDialogStack" : ReducerModalDialogStack,
	"genericApp" : ReducerGenericApp
});

const StaticDataSelector = function(in_state, in_props){
	return in_props.staticData;
} 
const UndoRedoSelector = function(in_state, in_props){
	return in_state.undoRedo;
} 
const DocumentManagerSelector = function(in_state, in_props){ 
	//console.log("DocumentManagerSelector in_state:" + in_state + " in_props:" + in_props);// + JSON.stringify(in_props));
	return in_props.documentManager; 
};
const DocumentDataSelector = createSelector(function(in_state){ return in_state.undoRedo.present; }, function(in_present){ return in_present; });
const DocumentSelector = createSelector([DocumentDataSelector, DocumentManagerSelector], function(in_documentData, in_documentManager){
	//console.log("DocumentSelector in_documentData:" + in_documentData + " in_documentManager:" + in_documentManager);
	if (("object" === typeof(in_documentData)) && ("type" in in_documentData)){
		return in_documentManager.DocumentDataToDocument(in_documentData);
	}
	return null;
});
const NavigationSelector = function(in_state, in_props){
	return in_state.navigation;
}
const CurrentDocumentSelector = createSelector([DocumentSelector, NavigationSelector, DocumentManagerSelector], function(in_document, in_navigation, in_documentManager){
	//console.log("CurrentDocumentSelector");
	return NavigateDocument(in_document, in_navigation, in_documentManager);
});

const ModalDialogSelector = function(in_state, in_props){
	//console.log("ModalDialogSelector");
	if (0 < in_state.modalDialogStack.length){
		return in_state.modalDialogStack[in_state.modalDialogStack.length - 1];
	}
	return null;
}

const AppMapState = function(in_state, in_props){
	return {
		"navigation" : NavigationSelector(in_state, in_props),
		"documentData" : DocumentDataSelector(in_state, in_props),
		"document" : DocumentSelector(in_state, in_props),
		"currentDocument" : CurrentDocumentSelector(in_state, in_props),
		"undoRedo" : UndoRedoSelector(in_state, in_props),
		"modalDialog" : ModalDialogSelector(in_state, in_props),
		"genericApp" : in_state.genericApp
	}
}

const AppMapDispatch = function(in_dispatch, in_props){
	return {
		"onNew" : function(in_type){ in_dispatch({"type" : "new", "documentType" : in_type, "documentManager" : in_props.documentManager});},
		"onUndo" : function(){ in_dispatch({"type" : "undo"});}, 
		"onRedo" : function(){ in_dispatch({"type" : "redo"});},
		"onClear" : function(){ in_dispatch({"type" : "clear"});},
		"onLoad" : function(in_documentData){ in_dispatch({"type" : "load", "documentData" : in_documentData, "documentManager" : in_props.documentManager});},
		"onNavUp" : function(){ in_dispatch({"type":"navUp"}); },
		"onNavDown" : function(in_data){ in_dispatch({"type":"navDown", "data":in_data}); },
		"onAddModalDialog" : function(in_data){ in_dispatch({"type":"addModal", "data":in_data}); },
		"onSetUnits" : function(in_units){ in_dispatch({"type":"setUnits", "units":in_units}); },
		"onSetAction" : function(in_action){ in_dispatch({"type":"setAction", "action":in_action}); },
	}
}
const AppMenuMapState = function(in_state, in_props){
	return {
		//"menuData" : MenuDataSelector(in_state, in_props),
		"menuData" : createSelector([UndoRedoSelector, NavigationSelector], function(in_undoRedo, in_navigation){
			//console.log("AppMenuMapState menuData createSelector");

			// the menu data wants the props for access to the dispatcher functions, but dependancies should be on selectors, not the in_props directly
			return GenerateMenuData(in_undoRedo, in_navigation, in_props);
		})(in_state, in_props)
	}
}
// also use the AppMenu to add dispatch functions using app state information via the props (else we could pass it around as function params)
const AppMenuMapDispatch = function(in_dispatch, in_props){
	return {
		"onSetValue" : function(in_name, in_value){ in_dispatch({"type":"setValue", "navigation" : in_props.navigation, "name" : in_name, "value" : in_value, "documentManager" : in_props.documentManager });},
		"onSetValueDisplay" : function(in_name, in_valueDisplay){ in_dispatch({"type":"setValueDisplay", "navigation" : in_props.navigation, "units" : in_props.genericApp.units, "name" : in_name, "valueDisplay" : in_valueDisplay, "documentManager" : in_props.documentManager });},
	}
}

const MakeVersionString = function(in_props){ //in_props.staticData.version
	var versionString = "";
	versionString += in_props.documentManager.GetLocaleData("client_bundle") + ":" + in_props.clientVersion;
	versionString += " " + in_props.documentManager.GetLocaleData("document_engine") + ":" + in_props.documentManagerVersion;
	versionString += " " + in_props.documentManager.GetLocaleData("static_data") + ":" + in_props.staticData.version;
	return versionString;
}

//	because generate menu wants to use state and dispatch into the same data tree, 
//	need to be after state and dispatch have been added to props by App
const AppMenu = connect(AppMenuMapState, AppMenuMapDispatch)(function(in_props){
	//console.log("AppMenu");

	const newProps = {
		"style":{
			"display":"flex",
			"flexDirection":"column",
			"justifyContent":"space-between",
			"alignItems":"stretch",
			"height":"100%"
		}
	};
	
	//console.log("navigation:" + in_props.navigation);
	//console.log("locale:" + in_props.locale);

	var propsData = {
			"document": in_props.currentDocument,
			"documentManager" : in_props.documentManager,
			"documentData" : in_props.documentData,
			"onNavDown" : in_props.onNavDown, 
			"onSetValue" : in_props.onSetValue,
			"onSetValueDisplay" : in_props.onSetValueDisplay,
			"onAddModalDialog" : in_props.onAddModalDialog,
			"units" : in_props.genericApp.units,
			"action" : in_props.genericApp.action
		};
	var componentData = DocumentData;
	if ((null != in_props.currentDocument) && (undefined !== in_props.specialise) && (true !== in_props.genericApp.generic)){
		var type = in_props.currentDocument.GetType();
		if (type in in_props.specialise){
			componentData = in_props.specialise[type];
		}
	}

	var versionString = MakeVersionString(in_props); //in_props.staticData.version

	return e("div", newProps, 
		e(DropDownMenu, { "children" : in_props.menuData, "paddLeft" : "1em" }),
		e(StandaloneMissionData, propsData),
		e(Footer, { "version" : versionString}),
		e(ModalDialog, { "modalDialog" : in_props.modalDialog}),
	);	
});
//in_props {
//	"staticData" : , 
//	"documentManager" : ,
//	"specialise" : 
export const App = connect(AppMapState, AppMapDispatch)(function(in_props){
	//console.log("App");
	return React.createElement(AppMenu, in_props);
});
