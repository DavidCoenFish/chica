/* navigation could be a figment of ui state? */
const ReducerNavigation = function(in_state, in_action){
	if (in_state === undefined){
		return [];
	}

	switch (in_action.type){
		case "navDown":
			var newState = in_state.concat([]);
			newState.push(in_action.data);
			return newState;
		case "navUp":
			if (0 < in_state.length){
				var newState = in_state.concat([]);
				newState.length -= 1;
				return newState;
			}
			break;
		default:
			break;
	}

	return in_state;
}

//e(Navigation, {"navigation": in_props.navigation, "onNavUp" : in_props.onNavUp, "document": in_props.currentDocument}),
const Navigation = function(in_props){
	const newProps = {
		"style":{
			"flexGrow":0,
			"flexShrink":0
		}
	};
	const buttonProps = {
		"className" : "button interact",
		"onClick" : function(in_event){ in_props.onNavUp(); }
	};
	var spanText = "";
	if (in_props.document != null){
		spanText = "current document type:" + in_props.document.GetType() + " [root]";
		for (var index = 0, total = in_props.navigation.length; index < total; index++) {
			var nav = in_props.navigation[index];
			spanText += ("." + JSON.stringify(nav));
		}
	} else {
		spanText = "no current document";
	}
	return e("div", newProps,
			e("a", buttonProps, ".."),
			e("span", null, spanText)
		);
}

const Footer = function(in_props){
	const newProps = {
		"style":{
			"flexGrow":0,
			"flexShrink":0,
			"alignSelf":"center"
		}
	};
	const newChildProps = {
		"style":{
			"fontSize":"0.7em"
		}
	};
	return e("div", newProps,
			e("p", newChildProps, in_props.version)
	);
}

const GetUndoEnabled = function(in_undoRedo){
	//console.log("GetUndoEnabled in_props:" + JSON.stringify(in_props)); 
	var canUndo = (0 < in_undoRedo.past.length);
	return canUndo;
}
const GetRedoEnabled = function(in_undoRedo){
	var canRedo = (0 < in_undoRedo.future.length);
	return canRedo;
}
const GetNavUpEnabled = function(in_navigation){
	var canNavUp = (0 < in_navigation.length);
	return canNavUp;
}

const GenerateMenuData = function(in_staticData, in_undoRedo, in_navigation, in_props){
	//console.log("GenerateMenuData in_staticData:" + in_staticData);
	var menuDataNewChildren = [];
	for (var type in in_staticData.documenttypes){
		//console.log("GenerateMenuData type:" + type);
		menuDataNewChildren.push({
			"factory" : HMenuFactoryInteractive,
			"text" : type,
			"documentType" : type,
			"method" : function(in_item){ in_props.onNew(in_item.documentType); }
		});
	}

	return [
	{
		"factory" : HMenuFactoryTop,
		"text" : "File",
		"children" : [
			{
				"factory" : HMenuFactoryInteractive,
				"text" : "New",
				"children" : menuDataNewChildren
			},
			{
				"factory" : HMenuFactorySeperator
			},
			{
				"factory" : HMenuFactoryFileOpen,
				"text" : "Open",
				"method" : function(in_file){
					var reader = new FileReader();
					reader.onload = function(in_event){
						//console.log("onload in_event.target.result:" + in_event.target.result);
						var documentData = JSON.parse(in_event.target.result);
						in_props.onLoad(documentData); 
					};
					reader.readAsText(in_file);				
				 }
			},
			{
				"factory" : HMenuFactoryInteractive,
				"text" : "Save",
				"method" : function(){
					var saveData = JSON.stringify(in_props.documentData);
					var blob = new Blob([saveData], {"type":"text/plain:charset=utf-8"});
					saveAs(blob, "output.txt");
				}
			},
			{
				"factory" : HMenuFactorySeperator
			},
			{
				"factory" : HMenuFactoryInteractive,
				"text" : "Info"
			},
		]
	},
	{
		"factory" : HMenuFactoryTop,
		"text" : "Edit",
		"children" : [
			{
				"factory" : HMenuFactoryInteractive,
				"text" : "Undo",
				"enabled" : GetUndoEnabled(in_undoRedo),
				"method" : function(){ in_props.onUndo(); }
			},
			{
				"factory" : HMenuFactoryInteractive,
				"text" : "Redo",
				"enabled" : GetRedoEnabled(in_undoRedo),
				"method" : function(){ in_props.onRedo(); }
			},
			{
				"factory" : HMenuFactorySeperator
			},
			{
				"factory" : HMenuFactoryInteractive,
				"text" : "Clear history",
				"enabled" : (GetUndoEnabled(in_undoRedo) || GetRedoEnabled(in_undoRedo)),
				"method" : function(){ in_props.onClear(); }
			},
			{
				"factory" : HMenuFactorySeperator
			},
			{
				"factory" : HMenuFactoryInteractive,
				"text" : "Nav up",
				"enabled" : GetNavUpEnabled(in_navigation),
				"method" : function(){ in_props.onNavUp(); }
			},
		]
	}
	];
}

const StaticDataSelector = function(in_state, in_props){
	return in_props.staticData;
} 
const UndoRedoSelector = function(in_state, in_props){
	return in_state.undoRedo;
} 
const DocumentManagerSelector = function(in_state, in_props){ 
	//console.log("DocumentManagerSelector in_state:" + in_state + " in_props:" + in_props + JSON.stringify(in_props));
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
	return NavigateDocument(in_document, in_navigation, in_documentManager);
});

const ModalDialogSelector = function(in_state, in_props){
	if (0 < in_state.modalDialogStack.length){
		return in_state.modalDialogStack[in_state.modalDialogStack.length - 1];
	}
	return null;
}

//is the use of props as a dependant going to cause pain to reselect?
//const MenuDataSelector = createSelector([StaticDataSelector, UndoRedoSelector, NavigationSelector, PropsSelector], GenerateMenuData);

const AppMapState = function(in_state, in_props){
	return {
		"navigation" : NavigationSelector(in_state, in_props),
		"documentData" : DocumentDataSelector(in_state, in_props),
		"document" : DocumentSelector(in_state, in_props),
		"currentDocument" : CurrentDocumentSelector(in_state, in_props),
		"undoRedo" : UndoRedoSelector(in_state, in_props),
		"modalDialog" : ModalDialogSelector(in_state, in_props)
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
	}
}
const AppContainerMapState = function(in_state, in_props){
	return {
		//"menuData" : MenuDataSelector(in_state, in_props),
		"menuData" : createSelector([StaticDataSelector, UndoRedoSelector, NavigationSelector], function(in_staticData, in_undoRedo, in_navigation){
			// the menu data wants the props for access to the dispatcher functions, but dependancies should be on selectors, not the in_props directly
			return GenerateMenuData(in_staticData, in_undoRedo, in_navigation, in_props);
		})(in_state, in_props)
	}
}
const AppContainerMapDispatch = function(in_dispatch, in_props){
	return {
		"onSetValue" : function(in_name, in_value){ in_dispatch({"type":"setValue", "navigation" : in_props.navigation, "name" : in_name, "value" : in_value, "documentManager" : in_props.documentManager });},
	}
}

/*
	because generate menu wants to use state and dispatch into the same data tree, 
	need to be after state and dispatch have nbeen added to props by App
*/
const AppContainer = window.ReactRedux.connect(AppContainerMapState, AppContainerMapDispatch)(function(in_props){
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

	return e("div", newProps, 
		e(HMenu, { "children" : in_props.menuData, "paddLeft" : "1em" }),
		e(DocumentEdit, {
			"document": in_props.currentDocument,
			"documentManager" : in_props.documentManager,
			"onNavDown" : in_props.onNavDown, 
			"onSetValue" : in_props.onSetValue
		}),
		e(Footer, { "version" : in_props.staticData.version}),
		e(ModalDialog, { "modalDialog" : in_props.modalDialog}),
	);	
});

const App = window.ReactRedux.connect(AppMapState, AppMapDispatch)(function(in_props){
	return e(AppContainer, in_props);
});
