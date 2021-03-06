
import {DropDownMenuFactoryTop, DropDownMenuFactoryInteractive, DropDownMenuFactorySeperator, DropDownMenuFactoryFileOpen} from "./../components/dropdownmenu/dropdownmenu.js";
import {ModalDialogSimpleFactory} from "./../components/modaldialog/modaldialog.js";
var FileSaver = require("file-saver");

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

const GenerateMenuData = function(in_undoRedo, in_navigation, in_props){
	//console.log("GenerateMenuData in_staticData:" + in_staticData);
	var menuDataNewChildren = [];
	var typeMap = in_props.documentManager.GetTypeMap();
	for (var key in typeMap){
		//console.log("GenerateMenuData type:" + type);
		menuDataNewChildren.push({
			"factory" : DropDownMenuFactoryInteractive,
			"text" : typeMap[key],
			"documentType" : key,
			"method" : function(in_item){ in_props.onNew(in_item.documentType); }
		});
	}

	var menuDataUnitChildren = [];
	var unitMap = in_props.documentManager.GetUnitMap();
	for (var key in unitMap){
		menuDataUnitChildren.push({
			"factory" : DropDownMenuFactoryInteractive,
			"text" : unitMap[key],
			"unit" : key,
			"toggle" : (in_props.genericApp.units === key),
			"method" : function(in_item){ in_props.onSetUnits(in_item.unit); }
		});
	}

	return [
	{
		"factory" : DropDownMenuFactoryTop,
		"text" : in_props.documentManager.GetLocaleData("menu_file"),
		"children" : [
			{
				"factory" : DropDownMenuFactoryInteractive,
				"text" : in_props.documentManager.GetLocaleData("menu_file_new"),
				"children" : menuDataNewChildren
			},
			{
				"factory" : DropDownMenuFactorySeperator
			},
			{
				"factory" : DropDownMenuFactoryFileOpen,
				"text" : in_props.documentManager.GetLocaleData("menu_file_open"),
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
				"factory" : DropDownMenuFactoryInteractive,
				"text" : in_props.documentManager.GetLocaleData("menu_file_save"),
				"method" : function(){
					var saveData = JSON.stringify(in_props.documentData);
					var blob = new Blob([saveData], {"type":"text/plain:charset=utf-8"});
					FileSaver.saveAs(blob, "documentdata.json");
				}
			},
			{
				"factory" : DropDownMenuFactoryInteractive,
				"text" : in_props.documentManager.GetLocaleData("menu_file_dump"),
				"method" : function(){
					var saveData = "" + in_props.document;
					var blob = new Blob([saveData], {"type":"text/plain:charset=utf-8"});
					FileSaver.saveAs(blob, "dump.json");
				}
			},
			{
				"factory" : DropDownMenuFactorySeperator
			},
			{
				"factory" : DropDownMenuFactoryInteractive,
				"text" : in_props.documentManager.GetLocaleData("menu_file_info"),
				"method" : function(){
					var spanText = "";
					if (in_props.document != null){
						spanText = "current document type:" + in_props.document.GetType(); //this was way too much + " " + in_props.document;
					} else {
						spanText = "no current document";
					}
					
					in_props.onAddModalDialog([ModalDialogSimpleFactory("Info", spanText)]);
				}
			},
		]
	},
	{
		"factory" : DropDownMenuFactoryTop,
		"text" : in_props.documentManager.GetLocaleData("menu_edit"),
		"children" : [
			{
				"factory" : DropDownMenuFactoryInteractive,
				"text" : in_props.documentManager.GetLocaleData("menu_edit_undo"),
				"enabled" : GetUndoEnabled(in_undoRedo),
				"method" : function(){ in_props.onUndo(); }
			},
			{
				"factory" : DropDownMenuFactoryInteractive,
				"text" : in_props.documentManager.GetLocaleData("menu_edit_redo"),
				"enabled" : GetRedoEnabled(in_undoRedo),
				"method" : function(){ in_props.onRedo(); }
			},
			{
				"factory" : DropDownMenuFactorySeperator
			},
			{
				"factory" : DropDownMenuFactoryInteractive,
				"text" : in_props.documentManager.GetLocaleData("menu_edit_clear"),
				"enabled" : (GetUndoEnabled(in_undoRedo) || GetRedoEnabled(in_undoRedo)),
				"method" : function(){ in_props.onClear(); }
			},
			{
				"factory" : DropDownMenuFactorySeperator
			},
		]
	},
	{
		"factory" : DropDownMenuFactoryTop,
		"text" : in_props.documentManager.GetLocaleData("menu_view"),
		"children" : [
			{
				"factory" : DropDownMenuFactoryInteractive,
				"text" : in_props.documentManager.GetLocaleData("menu_view_navup"),
				"enabled" : GetNavUpEnabled(in_navigation),
				"method" : function(){ in_props.onNavUp(); }
			},
			{
				"factory" : DropDownMenuFactoryInteractive,
				"text" : in_props.documentManager.GetLocaleData("menu_view_generic"),
				"toggle" : in_props.genericApp.generic,
				"method" : function(){ in_props.onToggleGeneric(); }
			},
			{
				"factory" : DropDownMenuFactoryInteractive,
				"text" : in_props.documentManager.GetLocaleData("menu_view_units"),
				"children" : menuDataUnitChildren
			}
		]
	}
	];
}



export {GenerateMenuData}