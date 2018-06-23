import {ModalDialogSelectFactory, ModalDialogTextSelectFactory} from "./../modaldialog/modaldialog.js";
import './style.css';
import React from "react";
const e = React.createElement;

const DocumentEditWrapper = function(in_name, in_content){
	return e("li", { "className" : "gedit", "key" : in_name}, 
		e("p", null, in_name),
		in_content
		);
}

const DocumentEditParent = function(in_props){
	return e("a", { "className":"button interactive", "onClick" : function(in_event){ in_props.onNavUp(); }}, "..");
}

class DocumentEditArray extends React.Component {
	constructor(props) {
		super(props);
		this.onChangeIndex = this.onChangeIndex.bind(this);
		this.onChangeCount = this.onChangeCount.bind(this);
	}
	onChangeIndex(event){
		var index = parseInt(event.target.value);
		this.props.onChangeIndex(index);
	}
	onChangeCount(event){
		var count = parseInt(event.target.value);
		this.props.onChangeCount(count);
	}
	render() {
		var newPropsIndex = {
				"className": "interact",
				"type":"number",
				"onChange" : this.onChangeIndex,
				"value" : this.props.index,
				"style": {
					"width":"4em",
					"height":"1.333em"
				}};
		if (0 == this.props.count){ //index is a view, if count is not zero, we can still change it
			newPropsIndex["disabled"] = "disabled";
		}		
		var newPropsCount = {
			"className": "interact",
			"type":"number",
			"onChange" : this.onChangeCount,
			"value" : this.props.count,
			"style": {
				"width":"4em",
				"height":"1.333em"
			}
		}
		if (true === this.props.locked){
			newPropsCount["disabled"] = "disabled";
		}		
		return e("div", null, 
			e("p", null, this.props.name),
			e("span", null, "array index "),
			e("input", newPropsIndex),
			e("span", null, " of "),
			e("input", newPropsCount)
		);
	}
}

const DocumentEditBool = function(in_props){
	var value = in_props.value;
	if (value === undefined){
		console.log("DocumentEditBool undefined value in_props.value for " + in_props.name);
		value = false;
	}
	return e("input", {
		"className": "interact",
		"type":"checkbox",
		"disabled" : ((true === in_props.locked) ? "disabled" : undefined),
		"onChange" : function(in_event){ in_props.onSetValue(in_props.name, in_event.target.checked); },
		"checked" : value,
		"style": {
			"height":"1.333em"
		}});
};

const DocumentEditInt = function(in_props){
	return e("input", {
		"className": "interact",
		"type":"number",
		"disabled" : ((true === in_props.locked) ? "disabled" : undefined),
		"onChange" : function(in_event){ 
			var newValue = Math.round(parseFloat(in_event.target.value));
			in_props.onSetValue(in_props.name, newValue); 
			},
		"value" : in_props.value,
		"style": {
			"width":"100%",
			"height":"1.333em"
		}});
};

const DocumentEditFloat = function(in_props){
	return e("input", {
		"className": "interact",
		"type":"number",
		"disabled" : ((true === in_props.locked) ? "disabled" : undefined),
		"onChange" : function(in_event){ 
			var newValue = parseFloat(in_event.target.value);
			in_props.onSetValue(in_props.name, newValue); 
			},
		"value" : in_props.value,
		"style": {
			"width":"100%",
			"height":"1.333em"
		}});
};

const DocumentEditString = function(in_props){
	return e("input", {
		"className" : "interact",
		"type":"text",
		"disabled" : ((true === in_props.locked) ? "disabled" : undefined),
		"onChange" : function(in_event){ 
			in_props.onSetValue(in_props.name, in_event.target.value); 
			if (in_props.name === "id"){
				in_props.onNavUp();
				in_props.onNavDown(in_event.target.value);
			}
		},
		"value" : in_props.value,
		"style": {
			"width":"100%",
			"height":"1.333em",
		}});
};

const DocumentEditKey = function(in_props){
	var optionsData = in_props.item.keyoptions;
	//console.log("DocumentEditKey in_props:" + JSON.stringify(in_props));
	var childrenArray = [];
	if (undefined !== optionsData){
		for (var key in optionsData) {
			if (false === optionsData.hasOwnProperty(key)) {
				continue;
			}
			var option = optionsData[key];
			var newProps = { "value" : key, "key" : key};
			childrenArray.push(e("option", newProps, option));
		}
	}

	return e("select", {
			"className": "interact",
			"value": in_props.value,
			"disabled" : ((true === in_props.locked) ? "disabled" : undefined),
			"onChange" : function(in_event){ 
				in_props.onSetValue(in_props.name, in_event.target.value); 
				},
			"style": {
				"width":"100%",
				"height":"1.3333em"
			}
		},
		childrenArray
	);
}

const DocumentEditDocument = function(in_props){
	//return e("div", { "className" : "iconwrapper", "onClick": function(in_event){ in_props.onNavDown([in_props.name]); }},
	return e("div", { "className" : "iconwrapper", "onClick": function(in_event){ in_props.onClick(); }},
		e("div", { "className" : "icon"}),
		e("div", { "className" : "icontext"}, in_props.name)
	);
}

const DocumentEditDocumentArray = function(in_props){
	var arrayChildren = [];
	if (false === in_props.locked){
		arrayChildren.push(e(DocumentEditDocument, { "name" : "add", "key":"__internal_add__", "onClick" : in_props.onAdd }));
		arrayChildren.push(e(DocumentEditDocument, { "name" : "trash", "key":"__internal_trash__", "onClick" : function(){ console.log("trash"); }}));
	}

	var arrayDocumentChildren = in_props.value;
	for (var index = 0, total = arrayDocumentChildren.length; index < total; index++) {
		var document = arrayDocumentChildren[index];
		arrayChildren.push(e(DocumentEditDocument, { 
			"name" : index, 
			"key" : index,
			"onClick" : function(in_index){ 
				return function(){ in_props.onNavDown([in_props.name, in_index])}; 
				}(index)
		}));
			
	}

	return e("ul", { "className" : "container foreground", "style" : { "height":"4em","overflowY":"scroll","borderStyle":"solid","borderWidth": "1px"}}, arrayChildren )
}

const DocumentEditDocumentMap = function(in_props){
	var arrayChildren = [];
	if (false === in_props.locked){
		arrayChildren.push(e(DocumentEditDocument, { "name" : "add", "key":"__internal_add__", "onClick" : in_props.onAdd }));
		arrayChildren.push(e(DocumentEditDocument, { "name" : "trash", "key":"__internal_trash__", "onClick" : function(){ console.log("trash"); }}));
	}

	var mapDocumentChildren = in_props.value;
	for (var key in mapDocumentChildren) {
		if (false === mapDocumentChildren.hasOwnProperty(key)) {
			continue;
		}
		var document = mapDocumentChildren[key];
		arrayChildren.push(e(DocumentEditDocument, { 
			"name" : key, 
			"key" : key,
			"onClick" : function(in_key){ 
				return function(){ in_props.onNavDown([in_props.name, in_key])}; 
				}(key)
		}));
	}

	return e("ul", { "className" : "container foreground", "style" : { "height":"4em","overflowY":"scroll","borderStyle":"solid","borderWidth": "1px"}}, arrayChildren )
}

/*
		arrayChildren.push(e(GenericEditDocumentAdd, {"key" : "__internalAdd"}));
		arrayChildren.push(e(GenericEditDocumentTrash, {"key" : "__internalTrash"}));

		return e("li", { "className" : "gedit"}, 
			e("p", null, this.props.name),
			e("ul", { "className" : "container foreground", "style" : { "height":"4em","overflowY":"scroll","borderStyle":"solid","borderWidth": "1px"}}, arrayChildren )
			);
*/

class DocumentEditGenericArray extends React.Component {
	constructor(in_props) {
		super(in_props);
		this.state = {
			"index" : 0
		};
		this.onSetValue = this.onSetValue.bind(this);
		this.onChangeIndex = this.onChangeIndex.bind(this);
		this.onChangeCount = this.onChangeCount.bind(this);
	}

	onSetValue(in_name, in_value){
		var valueArray = this.props.value.concat([]);
		if ((valueArray != undefined) && (0 <= this.state.index) && (this.state.index < valueArray.length)){
			valueArray[this.state.index] = in_value;
			this.props.onSetValue(this.props.name, valueArray);
		}
	}

	onChangeIndex(in_index){
		var valueArray = this.props.value;
		var count = 0;
		if (valueArray != undefined){
			count = valueArray.length;
		};
		if ((0 <= in_index) && (in_index < count)){
			this.setState({"index": in_index});
		}
	}
	onChangeCount(in_count){
		var valueArray = this.props.value.concat([]);
		if (valueArray == undefined){
			valueArray = [];
		}
		if (0 <= in_count){
			valueArray.length = in_count;
			if (in_count <= this.state.index){
				var newIndex = Math.max(0, in_count - 1);
				this.setState({"index": newIndex});
			}
			this.props.onSetValue(this.props.name, valueArray);
		}
	}
	render() {
		var valueArray = this.props.value;
		//console.log("DocumentEditGenericArray.render name:" + this.props.name + " valueArray:" + JSON.stringify(valueArray));
		var value = this.props.default;
		var count = 0;
		if (valueArray != undefined){
			count = valueArray.length;
		};
		if ((0 <= this.state.index) && (this.state.index < count)){
			value = valueArray[this.state.index];
		}
		var innerLocked = ((0 === count) || (true === this.props.locked));
		return e("div", null,
			e(this.props.innerClass, {
				"value" : value,
				"name" : this.props.name,
				"item" : this.props.item,
				"onSetValue" : this.onSetValue,
				"locked" : innerLocked
			}),
			e(DocumentEditArray, {
				"index" : this.state.index,
				"count" : count,
				"onChangeIndex" : this.onChangeIndex,
				"onChangeCount" : this.onChangeCount,
				"locked" : this.props.locked
			})
		);
	}
}

class DocumentEditGenericMap extends React.Component {
	constructor(in_props) {
		super(in_props);
		this.state = {
			"index" : 0
		};
		this.onSetValue = this.onSetValue.bind(this);
		this.onChangeIndex = this.onChangeIndex.bind(this);
		this.onChangeCount = this.onChangeCount.bind(this);
	}

	objectToArray(in_array){
		var newValue = {};
		if (in_array !== undefined){
			for (var index = 0, total = in_array.length; index < total; index++) {
				var key = in_array[index];
				newValue[key] = 0;
			}
		}
		return newValue;
	}

	onSetValue(in_name, in_value){
		var valueArray = Object.keys(this.props.value);
		if ((valueArray != undefined) && (0 <= this.state.index) && (this.state.index < valueArray.length)){
			valueArray[this.state.index] = in_value;
			var newValue = this.objectToArray(valueArray);
			this.props.onSetValue(this.props.name, newValue);
		}
	}

	onChangeIndex(in_index){
		var valueArray = Object.keys(this.props.value);
		var count = 0;
		if (valueArray != undefined){
			count = valueArray.length;
		};
		if ((0 <= in_index) && (in_index < count)){
			this.setState({"index": in_index});
		}
	}
	onChangeCount(in_count){
		var valueArray = Object.keys(this.props.value);
		if (valueArray == undefined){
			valueArray = [];
		}
		if (0 <= in_count){
			valueArray.length = in_count;
			var newValue = this.objectToArray(valueArray);
			var count = newValue.length;
			if (count <= this.state.index){
				var newIndex = Math.max(0, count - 1);
				this.setState({"index": newIndex});
			}
			this.props.onSetValue(this.props.name, newValue);
		}
	}
	render() {
		var valueArray = Object.keys(this.props.value);
		//console.log("DocumentEditGenericMap.render name:" + this.props.name + "valueArray:" + JSON.stringify( valueArray) + " value:" + JSON.stringify(this.props.value));
		var value = this.props.default;
		var count = 0;
		if (valueArray != undefined){
			count = valueArray.length;
		};
		if ((0 <= this.state.index) && (this.state.index < count)){
			value = valueArray[this.state.index];
		}
		var innerLocked = ((0 === count) || (true === this.props.locked));
		return e("div", null,
			e(this.props.innerClass, {
				"value" : value,
				"name" : this.props.name,
				"item" : this.props.item,
				"onSetValue" : this.onSetValue,
				"locked" : innerLocked
			}),
			e(DocumentEditArray, {
				"index" : this.state.index,
				"count" : count,
				"onChangeIndex" : this.onChangeIndex,
				"onChangeCount" : this.onChangeCount,
				"locked" : this.props.locked
			})
		);
	}
}

const DealOnAdd = function(in_item, in_props){
	return function(){
		if (false === ("childtypeoptions" in in_item)){
			return;
		}

		//console.log("DealOnAdd in_item:" + JSON.stringify(in_item));

		var keyArray = Object.keys(in_item.childtypeoptions);
		if (1 === keyArray.length){
			var type = keyArray[0];
			DealOnAddType(in_item, in_props, type);
			return;
		}

		if (1 < keyArray.length){
			in_props.onAddModalDialog(ModalDialogSelectFactory(
				"Add Child",//in_heading, 
				"select type to add", //in_body, 
				in_item.childtypeoptions, //in_selectArray, 
				function(in_data){
					//console.log("DealOnAdd modal ok data:" + JSON.stringify(in_data));
					var type = in_data.data.select;
					DealOnAddType(in_item, in_props, type);
				},//in_okCallback, 
				//in_cancelCallback
			));
		}

		return;
	};
}

const DealOnAddType = function(in_item, in_props, in_type){
	if (undefined === in_type){
		return;
	}

	var valueArray = in_props.document.GetValue(in_item.name);
	var newDocumentData = in_props.documentManager.NewDocumentData(in_type);
	if (undefined === in_type){
		return;
	}
	var newDocument = in_props.documentManager.DocumentDataToDocument(newDocumentData);
	var newArray = valueArray.concat([newDocument]);
	in_props.onSetValue(in_item.name, newArray);
}

const DealOnAddMap = function(in_item, in_props){
	return function(){
		if (false === ("childtypeoptions" in in_item)){
			return;
		}

		//i want to pregenerate an appropriate id, if meta says randString, or randDatabaseId
		var suggestedId = undefined; //"enter id";

		//console.log("DealOnAdd in_item:" + JSON.stringify(in_item));

		var keyArray = Object.keys(in_item.childtypeoptions);
		in_props.onAddModalDialog(ModalDialogTextSelectFactory(
			"Add Child",//in_heading, 
			"select type to add", //in_body, 
			in_item.childtypeoptions, //in_selectArray, 
			suggestedId,
			function(in_data){
				console.log("DealOnAdd modal ok data:" + JSON.stringify(in_data));
				var type = in_data.data.select;
				var id = in_data.data.text;
				DealOnAddTypeMap(in_item, in_props, id, type);
			},//in_okCallback, 
			//in_cancelCallback
		));

		return;
	};
}

const DealOnAddTypeMap = function(in_item, in_props, in_id, in_type){
	if (undefined === in_type){
		return;
	}

	var valueMap = in_props.document.GetValue(in_item.name);
	var newDocumentData = in_props.documentManager.NewDocumentData(in_type);
	if (undefined === newDocumentData){
		return;
	}
	console.log("DealOnAddTypeMap:" + JSON.stringify(newDocumentData));
	var newDocument = in_props.documentManager.DocumentDataToDocument(newDocumentData);
	newDocument.SetValue("id", in_id);
	var key = newDocument.GetValue("id");
	var newMap = Object.assign({}, valueMap);
	newMap[key] = newDocument;
	//var newArray = valueArray.concat([newDocument]);
	in_props.onSetValue(in_item.name, newMap);
}


//"document"
//"documentManager"
//"showNavUp"
//"onNavUp"
//"onNavDown"
//"onSetValue"
export const DocumentEdit = function(in_props){
	var type = (in_props.document != null) ? in_props.document.GetType() : undefined;
	var propertyNameArray = ((type != undefined) && (in_props.documentManager != undefined)) ? in_props.documentManager.GetDocumentPropertyNameArray(type) : [];
	var arrayPropertData = [];
	for (var index = 0, total = propertyNameArray.length; index < total; index++) {
		var propertyName = propertyNameArray[index];
		var propertyData = in_props.documentManager.GetDocumentPropertyData(type, propertyName);
		propertyData["name"] = propertyName;
		arrayPropertData.push(propertyData);
	}
	//console.log("DocumentEdit arrayPropertData:" + JSON.stringify(arrayPropertData));

	var childArray = [];
	if (true === in_props.showNavUp){
		childArray.push(DocumentEditWrapper("navigate to parent", e(DocumentEditParent, in_props)));
	}

	arrayPropertData.map(function(item){
		var name = item.name;
		var value = in_props.document.GetValue(name);
		var editProp = {
			"name" : name,
			"value" : value,
			"item" : item,
			"locked" : item.locked,
			"onSetValue" : in_props.onSetValue,
		};
		//var valueString = "";
		//try{
		//	valueString = JSON.stringify(value);
		//} catch(e){
		//	valueString = value;
		//}
		//console.log("DocumentEdit item:" + JSON.stringify(item) + " value:" + valueString);

		switch (item.type){
			case "bool":
				childArray.push(DocumentEditWrapper(name, e(DocumentEditBool, editProp)));
				break;
			case "boolarray":
				editProp["innerClass"] = DocumentEditBool;
				editProp["default"] = false;
				childArray.push(DocumentEditWrapper(name, e(DocumentEditGenericArray, editProp)));
				break;
			case "int":
				childArray.push(DocumentEditWrapper(name, e(DocumentEditInt, editProp)));
				break;
			case "intarray":
				editProp["innerClass"] = DocumentEditInt;
				editProp["default"] = 0;
				childArray.push(DocumentEditWrapper(name, e(DocumentEditGenericArray, editProp)));
				break;
			case "float":
				childArray.push(DocumentEditWrapper(name, e(DocumentEditFloat, editProp)));
				break;
			case "floatarray":
				editProp["innerClass"] = DocumentEditFloat;
				editProp["default"] = 0.0;
				childArray.push(DocumentEditWrapper(name, e(DocumentEditGenericArray, editProp)));
				break;
			case "string":
				childArray.push(DocumentEditWrapper(name, e(DocumentEditString, editProp)));
				break;
			case "stringarray":
				editProp["innerClass"] = DocumentEditString;
				editProp["default"] = "";
				childArray.push(DocumentEditWrapper(name, e(DocumentEditGenericArray, editProp)));
				break;
			case "stringmap":
				editProp["innerClass"] = DocumentEditString;
				editProp["default"] = "";
				childArray.push(DocumentEditWrapper(name, e(DocumentEditGenericMap, editProp)));
				break;
			case "key":
				childArray.push(DocumentEditWrapper(name, e(DocumentEditKey, editProp)));
				break;
			case "keyarray":
				editProp["innerClass"] = DocumentEditKey;
				editProp["default"] = "";
				childArray.push(DocumentEditWrapper(name, e(DocumentEditGenericArray, editProp)));
				break;
			case "document":
				editProp["onClick"] = function(){ in_props.onNavDown([editProp.name]); };
				childArray.push(DocumentEditWrapper(name, e(DocumentEditDocument, editProp)));
				break;
			case "documentarray":
				editProp["onNavDown"] = in_props.onNavDown;
				editProp["onAdd"] = DealOnAdd(item, in_props);
				childArray.push(DocumentEditWrapper(name, e(DocumentEditDocumentArray, editProp)));
				break;
			case "iddocumentmap":
				editProp["onNavDown"] = in_props.onNavDown;
				editProp["onAdd"] = DealOnAddMap(item, in_props);
				childArray.push(DocumentEditWrapper(name, e(DocumentEditDocumentMap, editProp)));
				break;
			default:
				editProp["locked"] = true;
				editProp["value"] = JSON.stringify(value);
				childArray.push(DocumentEditWrapper(name, e(DocumentEditString, editProp)));
				break;
		}
	});


	const newProps = {
		"className" : "framewrapperparent",
		"style" : {
			"display":"flex",
			"flexDirection":"row",
			"justifyContent":"flex-start",
			"flexWrap":"wrap",
			"alignContent": "flex-start",
			"padding":"0.25em 1em 0 1.0em"
		}
	};
	return e("ul", newProps, childArray);
}
