
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

const gExamples = {
	"luck_roll" : {
		"display" : "Luck",
		"actionKey" : "luckroll",
		"documentData" : {
			"type": "action_luck_roll_input",
			"random_seed": 57906,
			"agent": {
				"type": "character",
				"name": "Miko",
				"race": "half-elf",
				"gender": "female",
				"handedness": "righthanded",
				"spent_md": 3
			},
			"has_pertinent_attribute": true,
			"pertinent_attribute": "attribute_md",
			"baneful_force_level": 5
		}
	},
	"successroll" : {
		"display" : "Success",
		"actionKey" : "successroll",
		"documentData" : {
			"type": "action_success_roll_input",
			"random_seed": 169782,
			"agent": {
				"type": "character",
				"name": "Liv",
				"experence_points": 32,
				"race": "half-fae",
				"gender": "female",
				"handedness": "righthanded",
				"skill_array": [
					{
						"type": "skill",
						"skill": "appraising",
						"level": 2
					}
				]
			},
			"skill": "appraising",
			"bonus": 1,
			"level_opposing_agent": 5
		}
	},
	"competing_attribute_roll_mark_bruce" : {
		"display" : "Mark vrs Bruce",
		"actionKey" : "competingattributeroll",
		"documentData" : {
			"type": "action_competing_attribute_roll_input",
			"random_seed": 148341,
			"attribute": "attribute_ps",
			"agent_a": {
				"type": "character",
				"name": "Mark the Manly",
				"race": "half-fae",
				"gender": "male",
				"handedness": "righthanded",
				"spent_ps": 5
			},
			"agent_b": {
				"type": "character",
				"name": "Bruce the Bicep",
				"race": "half-gnome",
				"gender": "male",
				"handedness": "righthanded",
				"spent_ps": 11
			}
		}
	}
};

const GetMenuDataExampleChildren = function(in_props){
	var result = [];
	for (var key in gExamples){
		result.push({
			"factory" : DropDownMenuFactoryInteractive,
			"text" : gExamples[key].display,
			"documentData" : gExamples[key].documentData,
			"actionKey" : gExamples[key].actionKey,
			"method" : function(in_item){ 
				in_props.onSetAction(in_item.actionKey);
				in_props.onLoad(in_item.documentData);
			}
		});
	}
	return result;
}

const GenerateMenuData = function(in_undoRedo, in_navigation, in_props){
	const menuDataExampleChildren = GetMenuDataExampleChildren(in_props);

	var menuDataActionChildren = [];
	var actionMap = in_props.documentManager.GetActionMap();
	for (var key in actionMap){
		menuDataActionChildren.push({
			"factory" : DropDownMenuFactoryInteractive,
			"text" : actionMap[key],
			"actionKey" : key,
			"method" : function(in_item){ 
				//in_props.onAction(in_item.actionKey); 
				var documentType = in_props.documentManager.GetActionInputType(in_item.actionKey);
				in_props.onSetAction(in_item.actionKey);
				in_props.onNew(documentType);
			}
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
				"text" : in_props.documentManager.GetLocaleData("menu_file_example"),
				"children" : menuDataExampleChildren
			},
			{
				"factory" : DropDownMenuFactoryInteractive,
				"text" : in_props.documentManager.GetLocaleData("menu_file_new"),
				"children" : menuDataActionChildren
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
				"text" : in_props.documentManager.GetLocaleData("menu_view_units"),
				"children" : menuDataUnitChildren
			}
		]
	}
	];
}



export {GenerateMenuData}