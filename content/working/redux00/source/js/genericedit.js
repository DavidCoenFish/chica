class GenericEditArray extends React.Component {
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
		if ((0 == this.props.count) || (true === this.props.locked)){
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
			e("input", newPropsIndex),
			e("span", null, " of "),
			e("input", newPropsCount)
		);
	}
}


const GenericValueMapDispatchToProps = function(in_dispatch, in_props){
	return {
		"onSet" : function(in_documentManager, in_name, in_navigation, in_value){ in_dispatch({ "type" : "set", "documentManager" : in_documentManager, "name" : in_name, "navigation" : in_navigation, "value" : in_value })}
	}
}
const GenericValueMapStateToProps = function(in_state, in_props){
	value = in_props.document.GetValue(in_props.name);
	return {
		"value" : value,
		"flatvalue" : JSON.stringify(value),
		"navigation" : in_state.editNavigation
	}
}

const GenericEditBool = window.ReactRedux.connect(GenericValueMapStateToProps, GenericValueMapDispatchToProps)(function(in_props){
	return e("li", { "className" : "gedit"}, 
		e("p", null, in_props.name + "(" + in_props.flatvalue + ")"),
		e("input", {
			"className": "interact",
			"type":"checkbox",
			"onChange" : function(in_event){ in_props.onSet(in_props.documentManager, in_props.name, in_props.navigation, in_event.target.checked); },
			"checked" : in_props.value,
			"style": {
				"height":"1.333em"
			}})
	);
});

class GenericEditBoolArrayClass extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			"index" : 0
		};
		this.onChange = this.onChange.bind(this);
		this.onChangeIndex = this.onChangeIndex.bind(this);
		this.onChangeCount = this.onChangeCount.bind(this);
	}

	onChange(in_event){
		var valueArray = this.props.value.concat([]);
		if ((valueArray != undefined) && (0 <= this.state.index) && (this.state.index < valueArray.length)){
			valueArray[this.state.index] = in_event.target.checked;
			this.props.onSet(this.props.documentManager, this.props.name, this.props.navigation, valueArray);
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
			this.props.onSet(this.props.documentManager, this.props.name, this.props.navigation, valueArray);
		}
	}
	render() {
		var valueArray = this.props.value;
		console.log("GenericEditBoolArray.render valueArray:" + JSON.stringify(valueArray));
		var value = false;
		var count = 0;
		if (valueArray != undefined){
			count = valueArray.length;
		};
		if ((0 <= this.state.index) && (this.state.index < count)){
			value = valueArray[this.state.index];
			if (value === undefined){
				console.log("undefined in array:" + JSON.stringify(valueArray) + " index:" + this.state.index + " count:" + count);
				value = false; //wtf? 
			}
		}
		var newProps = {
			"className": "interact",
			"type":"checkbox",
			"onChange" : this.onChange,
			"checked" : value,
			"style": {
				"height":"1.333em"
			}
		};
		if (0 == count){
			newProps["disabled"] = "disabled";
		}
		return e("li", { "className" : "gedit"}, 
			e("p", null, this.props.name + "(" + this.props.flatvalue + ") valueArray:" + JSON.stringify(valueArray)),
			e("input", newProps),
			e(GenericEditArray, {
				"index" : this.state.index,
				"count" : count,
				"locked" : this.props.data.locked,
				"onChangeIndex" : this.onChangeIndex,
				"onChangeCount" : this.onChangeCount
			})
		);
	}
}

const GenericEditBoolArray = window.ReactRedux.connect(GenericValueMapStateToProps, GenericValueMapDispatchToProps)(GenericEditBoolArrayClass);



const GenericEditParentDispatch = function(in_dispatch){
	return {
		"onPop" : function(){
			in_dispatch({"type" : "pop"});
		}
	};
}

const GenericEditParent = window.ReactRedux.connect(undefined, GenericEditParentDispatch)(function(in_props){
	return e("li", { "className" : "gedit"}, 
		e("p", null, "return to parent"),
		e("div", { "className" : "iconwrapper", "onClick" : in_props.onPop},
			e("div", { "className" : "icon"}),
			e("a", { "className" : "icontext interactive"}, "..")
		)
	);
});

const GenericEditMapStateToProps = function(in_state, in_props){
	var documentData = in_state.editDocument.present;
	//console.log("GenericEditMapStateToProps documentData:" + JSON.stringify(documentData)); 
	var currentDocumentEdit = undefined;
	if ((documentData != undefined) && ("type" in documentData)){
		currentDocumentEdit = in_props.documentManager.DocumentDataToDocument(documentData);
	}

	var navigation = in_state.editNavigation;
	if ((currentDocumentEdit != undefined) && (navigation != undefined)){
		for (var index = 0, total = navigation.length; index < total; index++) {
			var propertyNameArray = navigation[index];
			var propertyName = propertyNameArray[0];
			var type = currentDocumentEdit.GetType();
			var propertyData = this.state.documentManager.GetDocumentPropertyData(type, propertyName);
			//console.log(" propertyName:" + propertyName + " propertyData:" + JSON.stringify(propertyData));
			var child = undefined;
			switch (propertyData.type){
				case "document":
					child = currentDocumentEdit.GetValue(propertyName);
					//console.log(" child:" + child + " type:" + child.GetType());
					break;
				case "documentarray":
					var cusrorIndex = propertyNameArray[1];
					var childArray = currentDocumentEdit.GetValue(propertyName);
					if ((childArray != undefined) && (0 <= cusrorIndex) && (cursorIndex < childArray.length)){
						child = childArray[cusrorIndex];
					}
					break;
				case "iddocumentmap":
					var cusrorKey = propertyNameArray[1];
					var childObject = currentDocumentEdit.GetValue(propertyName);
					if ((childObject != undefined) && (cusrorKey in childObject)){
						child = childObject[cusrorKey];
					}
					break;
				default:
					break;
			}
			if (child !== undefined){
				currentDocumentEdit = child;
			} else {
				break;
			}
		}
	}

	//console.log("GenericEditMapStateToProps document:" + document); 
	return { 
		"document" : currentDocumentEdit,
		"navigation" : navigation
	};
}

const GenericEditInner = window.ReactRedux.connect(GenericEditMapStateToProps)(function(in_props){
	var propertyNameArray = (in_props.document != null) ? in_props.document.GetPropertyNameArray() : [];
	var type = (in_props.document != null) ? in_props.document.GetType() : undefined;
	var arrayPropertData = [];
	for (var index = 0, total = propertyNameArray.length; index < total; index++) {
		var propertyName = propertyNameArray[index];
		var propertyData = in_props.documentManager.GetDocumentPropertyData(type, propertyName);
		propertyData["name"] = propertyName;
		arrayPropertData.push(propertyData);
	}

	var childArray = [];

	//if there is a cursor then we have a jump to parent
	if (0 < in_props.navigation.length){
		childArray.push(e(GenericEditParent));
	}

	arrayPropertData.map(function(item){
		var editProp = {
			"data" : item,
			"key" : item.name,
			"name" : item.name,
			"document" : in_props.document,
			"documentManager" : in_props.documentManager
		};

		switch (item.type){
			case "bool":
				childArray.push(e(GenericEditBool, editProp));
				break;
			case "boolarray":
				childArray.push(e(GenericEditBoolArray, editProp));
				break;
			case "int":
				childArray.push(e(GenericEditInt, editProp));
				break;
			case "intarray":
				childArray.push(e(GenericEditIntArray, editProp));
				break;
			case "float":
				childArray.push(e(GenericEditFloat, editProp));
				break;
			case "floatarray":
				childArray.push(e(GenericEditFloatArray, editProp));
				break;
			case "string":
				childArray.push(e(GenericEditString, editProp));
				break;
			case "stringarray":
				childArray.push(e(GenericEditStringArray, editProp));
				break;
			case "key":
				childArray.push(e(GenericEditKey, editProp));
				break;
			case "keyarray":
				childArray.push(e(GenericEditKeyArray, editProp));
				break;
			case "document":
				childArray.push(e(GenericEditDocument, editProp));
				break;
			case "documentarray":
				childArray.push(e(GenericEditDocumentArray, editProp));
				break;			
			case "iddocumentmap":
				childArray.push(e(GenericEditIDDocumentMap, editProp));
				break;			
			case "hashset":
				childArray.push(e(GenericEditHashSet, editProp));
				break;			
			default:
				childArray.push(e(GenericStaticValue, editProp));
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
			"padding":"0.25em 1em 0 1.5em"
		}
	};
	return e("ul", newProps, childArray);

	//return e("div", null, JSON.stringify(in_props.documentData));
});

const FrameWrapper = function(props){
	return e("div", {
		"className":"framewrapper",
		"style":props
	}, e("div", {"className":"frame"}))
}

const GenericEdit = function(in_props){
	const newProps = {
		"className" : "framewrapperparent",
		"style" : {
			"flexGrow":1,
			"flexShrink":0
		}
	};
	return e("div", newProps, 
		e(FrameWrapper, {"top":"-0.75em","right":"0.5em","bottom":"0.0em","left":"0.5em"}), 
		e(GenericEditInner, in_props)
	);
};
