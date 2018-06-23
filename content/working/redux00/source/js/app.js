const Undo = function(in_dispatch){
	//console.log("Undo");
	in_dispatch({"type" : "undo"});
}
const Redo = function(in_dispatch){
	//console.log("Redo");
	in_dispatch({"type" : "redo"});
}
const Clear = function(in_dispatch){
	//console.log("Clear");
	in_dispatch({"type" : "clear"});
}
const New = function(in_dispatch, in_type, in_documentManager){
	//console.log("New type:" + in_type + " in_documentManager:" + in_documentManager);
	in_dispatch({"type" : "new", "documentEditType" : in_type, "documentManager" : in_documentManager});
}
const Load = function(in_dispatch, in_file, in_documentManager){
	//console.log("Load file.name:" + in_file.name + " in_documentManager:" + in_documentManager);
	var reader = new FileReader();
	reader.onload = function(in_event){
		//console.log("onload in_event.target.result:" + in_event.target.result);
		var documentData = JSON.parse(in_event.target.result);
		in_dispatch({"type" : "load", "documentData" : documentData, "documentManager" : in_documentManager});
	};
	reader.readAsText(in_file);
}
const Save = function(in_dispatch, in_state, in_documentManager){
	//console.log("Save in_state:" + in_state + " JSON:" + JSON.stringify(in_state));
	var saveData = JSON.stringify(in_state.editDocument.present);
	var blob = new Blob([saveData], {"type":"text/plain:charset=utf-8"});
	saveAs(blob, "output.txt");
	//saveAs();
}
const GetUndoEnabled = function(in_state){
	var canUndo = (0 < in_state.editDocument.past.length);
	//console.log("GetUndoEnabled canUndo:" + canUndo);
	//var canUndo = false;
	return canUndo;
}
const GetRedoEnabled = function(in_state){
	var canRedo = (0 < in_state.editDocument.future.length);
	//console.log("GetRedoEnabled canRedo:" + canRedo);
	//var canRedo = false;
	return canRedo;
}

/*
{
	"left" : "1em",
	"children" : [
		{
			"name" : "menu0",
			"method" : function(in_dispatch, in_state){},
			"methodLoad" : function(in_dispatch, in_file){},
			"enabled" : true, //default true
			"children" : [...]
		},
		...
	]
}
*/
const GenerateMenuData = function(in_state, in_props){
	var newDocumentChildren = [];
	const staticData = in_props.staticData;
	for (var type in staticData.documenttypes){
		//console.log("GenerateMenuData type:" + type);
		newDocumentChildren.push({
			"name" : type,
			"method" : (function(in_type){ return function(in_dispatch){ New(in_dispatch, in_type, in_props.documentManager); }; })(type)
		});
	}

	var menuData = {
		"left" : "1em",
		"children" : [
			{
				"name" : "File",
				"children" : [
					{
						"name" : "New",
						"children" : newDocumentChildren
					},
					{
						"name" : "Load",
						"accept" : ".txt,.json",
						"methodLoad" : function(in_dispatch, in_file){ Load(in_dispatch, in_file, in_props.documentManager); }
					},
					{
						"name" : "Save",
						"method" : function(in_dispatch, in_state){ Save(in_dispatch, in_state, in_props.documentManager); }
					},
					{
						"name" : "Info"
					}
				]
			},
			{
				"name" : "Edit",
				"children" : [
					{
						"name" : "Undo",
						"method" : Undo,
						"enabled" : GetUndoEnabled(in_state)
					},
					{
						"name" : "Redo",
						"method" : Redo,
						"enabled" : GetRedoEnabled(in_state)
					},
					{
						"name" : "Clear history",
						"method" : Clear,
						"enabled" : (GetRedoEnabled(in_state) || GetUndoEnabled(in_state))
					}
				]
			},
			{
				"name" : "Debug",
				"children" : [
					{
						"name" : "Test0"
					}
				]
			}
		]
	};

	return menuData;
}

const ReducerEditDocumentInternal = function(in_state, in_action){
	if (in_state === undefined){
		return {};
	}

	switch (in_action.type){
		case "new":
			var documentData = in_action.documentManager.NewDocumentData(in_action.documentEditType);
			if (JSON.stringify(documentData) !== JSON.stringify(in_state)){
				return documentData;
			}
			break;
		case "set":
			console.log("set name:" + in_action.name + " value:" + JSON.stringify(in_action.value));
		//		{ "type" : "set", "documentManager" : in_documentManager, "name" : in_name, "navigation" : in_navigation, "value" : in_value })}
			var document = in_action.documentManager.DocumentDataToDocument(in_state);
			if (document == undefined){
				break;
			}
			document.SetValue(in_action.name, in_action.value);
			var documentData = in_action.documentManager.DocumentToDocumentData(document);
			if (JSON.stringify(documentData) !== JSON.stringify(in_state)){
				return documentData;
			}
			break;
		case "load":
			var document = in_action.documentManager.DocumentDataToDocument(in_action.documentData);
			var documentData = in_action.documentManager.DocumentToDocumentData(document);
			if (JSON.stringify(documentData) !== JSON.stringify(in_state)){
				return documentData;
			}
			break;
	}

	return in_state;
}

/*
	in_state is immutable, so not using .splice, .pop on any of it's member arrays (make shallow copy with concat)
*/
const ReducerEditDocument = function(in_state, in_action){
	if (in_state === undefined){
		return {
			"past" : [],
			"present" : ReducerEditDocumentInternal(undefined, in_action),
			"future" : []
		};
	}

	switch (in_action.type){
		case "undo":
			if (0 < in_state.past.length){
				var newPast = in_state.past.concat();
				newPast.length -= 1;
				var newPresent = in_state.past[in_state.past.length - 1];
				var newFuture = in_state.future.concat([in_state.present]);
				return {
					"past" : newPast,
					"present" : newPresent,
					"future" : newFuture
				};
			}
			break;
		case "redo":
			if (0 < in_state.future.length){
				var newPast = in_state.past.concat([in_state.present]);
				var newPresent = in_state.future[in_state.future.length - 1];
				var newFuture = in_state.future.concat();
				newFuture.length -= 1;
				return {
					"past" : newPast,
					"present" : newPresent,
					"future" : newFuture
				};
			}
			break;
		case "clear":
			if ((0 < in_state.past.length) || (0 < in_state.future.length)){
				return {
					"past" : [],
					"present" : in_state.present,
					"future" : []
				};
			}
			break;
		default:
			var newPresent = ReducerEditDocumentInternal(in_state.present, in_action);
			if (newPresent === in_state.present){
				return in_state;
			}
			var newPast = in_state.past.concat([in_state.present]);
			return {
				"past" : newPast,
				"present" : newPresent,
				"future" : []
			};
	}
	//console.log("ReducerEditDocument default");
	return in_state;
}

/* navigation could be a figment of ui state? */
const ReducerEditNavigation = function(in_state, in_action){
	if (in_state === undefined){
		return [];
	}

	switch (in_action.type){
		case "push":
			var newState = in_state.concat([]);
			newState.push(in_action.navData);
			break;
		case "pop":
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

class App extends React.Component {
	constructor(props) {
		super(props);
		this.DocumentManager = c.DocumentManager.Factory(this.props.staticData, c.InstructionContext);
	}
	render() {
		//console.log("App render");
		const newProps = {
			"style":{
				"display":"flex",
				"flexDirection":"column",
				"justifyContent":"space-between",
				"alignItems":"stretch",
				"height":"100%"
			}
		};
		return e("div", newProps, 
			e(HMenu, { "generateMenuData" : GenerateMenuData, "staticData" : this.props.staticData, "documentManager" : this.DocumentManager}),
			e(GenericEdit, { "documentManager" : this.DocumentManager }),
			e(Footer, { "version" : this.props.staticData.version}),
			);	
	}
}
