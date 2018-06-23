import './style.css';
import {connect} from "react-redux";
import {BackBoard} from "./../backboard/backboard.js";
import {ToolTip} from "./../tooltip/tooltip.js";
import {ButtonFactoryShrinkwrapInteractive, ButtonFactoryStandardInteractive, ButtonFactoryStandardDisable, ButtonFactoryStandardCall, ButtonFactoryStandardDestruct} from "./../button/button.js";
import React from "react";
const e = React.createElement;

export const ModalDialogSimpleFactory = function(in_heading, in_body){
	return {
		"contents" : [
			{
				"title" : in_heading,
				"text" : in_body,
				"bottomBar" : [
					{"text":"ok", "flavor":"call", "method":function(in_data){ console.log("ok in_data:" + JSON.stringify(in_data))}},
				]
			}
		]
	};
}

export const ModalDialogSelectFactory = function(in_heading, in_body, in_selectData, in_okCallback){
	return {
		"contents" : [
			{
				"title" : in_heading,
				"text" : in_body,
				"form" : {
					"select" : {
						"type" : "select",
						options: in_selectData
					}
				},
				"bottomBar" : [
					{"text":"ok", "flavor":"call", "method":in_okCallback}
				]
			}
		]
	};
}

export const ModalDialogTextSelectFactory = function(in_heading, in_body, in_selectData, in_text, in_okCallback){
	return {
		"contents" : [
			{
				"title" : in_heading,
				"text" : in_body,
				"form" : {
					"text" : {
						"type" : "text",
						"value" : in_text
					},
					"select" : {
						"type" : "select",
						options: in_selectData
					}
				},
				"bottomBar" : [
					{"text":"ok", "flavor":"call", "method":in_okCallback}
				]
			}
		]
	};
}

const GenerateTestModalDialog = function(){
	return {
		//for tooltip'able text, we pass an array, string is default text, all else gets wrapped in objects with extra data such as colour and tooltip data
		"contents" : [
			{
				"tabName" : "one",
				"title" : "Modal dialog",
				"text" : [
					"dialog body text ", 
					{"text" : "tooltip", "tooltip":[
						"the popup text of the ", 
						{"text" : "tooltip", "tooltip":["another layer"]}
						]}
				],
				"form" : {
					"a" : { 
						"type" : "select",
						"options" : {"b" : "B", "c" : "C", "d" : "D" },
						"value" : "d"
					},
					"e" : {
						"type" : "text",
						"value" : "foo"
					},
					"f" : {
						"type" : "radio",
						"options" : { 
							"g" : { "label" : "gl", "text" : ["some text for choice g"], "method" : function(in_data){ console.log("radio option g"); }},
							"h" : { "label" : "hl", "text" : ["some text for choice h"], "method" : function(in_data){ console.log("radio option h"); }},
							"i" : { "label" : "il", "text" : ["some text for choice i"], "method" : function(in_data){ console.log("radio option i"); }},
						}
					}
				},
				"bottomBar" : [
					{"text":"ok", "flavor":"call", "method":function(in_data){ console.log("ok in_data:" + JSON.stringify(in_data))}},
					{"text":"cancel", "flavor":"interact", "method":function(in_data){ console.log("cancel in_data:" + JSON.stringify(in_data))}},
					{"text":"other", "flavor":"destruct", "method":function(in_data){ console.log("other in_data:" + JSON.stringify(in_data))}},
				]
			},
			{
				"tabName" : "two",
				"text" : [ "hello world" ]
			}
		]
	};
}
const GenerateTestModalDialogStack = function(){
	return [GenerateTestModalDialog()];
}

export const ReducerModalDialogStack = function(in_state, in_action){
	if (in_state === undefined){
		//return GenerateTestModalDialogStack();
		return [];
	}

	switch (in_action.type){
		case "addModal":
			//var newState = ([in_action.data]).concat(in_state);
			// we are presuming in_action.data to be an array of modal data, by default 1, but allow push of more than one dialog?
			var newState = in_state.concat(in_action.data);
			return newState;
		case "popModal":
			var newState = in_state.concat([]);
			newState.length -= 1;
			return newState;
	}
	return in_state;
}

/*
	<div class="container" style="margin-right:0.5em;margin-left:0.5em;">
		<a class="button standard disable">option 0</a>
		<a class="button standard interact">option 1</a>
		<a class="button standard interact">option 2</a>
	</div>
	{ "tabNameArray" : tabNameArray, "onSetTab" : this.onSetTab, "tab" : this.state.tab, "onClick" }),
*/
const ModalDialogTopbar = function(in_props){
	var arrayChildren = [];

	//console.log("ModalDialogTopbar in_props:" + JSON.stringify(in_props));

	if (1 < in_props.tabNameArray.length){
		for (var index = 0, total = in_props.tabNameArray.length; index < total; index++) {
			var name = in_props.tabNameArray[index];
			if (in_props.tab === index){
				arrayChildren.push(ButtonFactoryStandardDisable(undefined, name, index));
			} else {
				var func = (function(in_index){ return function(){ in_props.onSetTab(in_index); } })(index);
				arrayChildren.push(ButtonFactoryStandardInteractive(func, name, index));
			}
			//arrayChildren.push(e("a", newProps, name));
		}
	}

	arrayChildren.push(e("div", { "style" : { "flexGrow":1, "flexShrink":0 }, "key":"space"}));
	arrayChildren.push(ButtonFactoryShrinkwrapInteractive(function(in_event){in_props.onClick();}, "X", "close"));
	
	return e("div", {"className" : "container", "style" : {"marginRight":"0.5em", "marginLeft":"0.5em"}}, arrayChildren);
}

const AppendFormArray = function(inout_formArray, in_key, in_data, in_props){
	var type = in_data.type;
	switch (type){
	default:
		console.log("modal dialog unknown type in form:" + type);
		break;
	case "select":
		inout_formArray.push(e(ModalDialogBodySelect, { 
			"name" : in_key, 
			"key" : in_key, 
			"options" : in_data.options,
			"onSetValue" : in_props.onSetValue,
			"value" : ((in_data.value != undefined) ? in_data.value : undefined)
		}));
		break;
	case "text":
		inout_formArray.push(e(ModalDialogBodyText, { 
			"name" : in_key, 
			"key" : in_key, 
			"onSetValue" : in_props.onSetValue,
			"value" : ((in_data.value != undefined) ? in_data.value : undefined)
		}));
		break;
	case "radio":
		inout_formArray.push(e(ModalDialogBodyRadio, { 
			"name" : in_key, 
			"key" : in_key, 
			"options" : in_data.options,
			"onClick" : in_props.onClick
		}));
		break;
	}
	return;
}

const ModalDialogBodySelect = function(in_props){
	var childrenArray = [];
	if ((undefined != in_props) && (undefined != in_props.options)){
		for (var key in in_props.options) {
			if (false === in_props.options.hasOwnProperty(key)) {
				continue;
			}
			var option = in_props.options[key];
			var newProps = { "value" : key, "key" : key};
			childrenArray.push(e("option", newProps, option));
		}
	}

	return e("div", null, 
		e("select", { 
			"className":"interact", 
			"style":{"width":"100%","padding":"1px"},
			"value":in_props.value,
			"onChange":function(in_event){in_props.onSetValue(in_props.name, in_event.target.value);},
		}, childrenArray)
	);
}

const ModalDialogBodyText = function(in_props){
	return e("div", null,
		e("input", {
			"className" : "interact",
			"type":"text",
			"onChange" : function(in_event){ 
				in_props.onSetValue(in_props.name, in_event.target.value); 
				},
			"value" : in_props.value,
			"style": {
				"width":"100%",
				"height":"1.333em",
				}
			})
	);
}
/*
	var childrenArray = [];
	if ((undefined != in_props) && (undefined != in_props.options)){
		for (var key in in_props.options) {
			console.log("ModalDialogBodyRadio key:" + key);
			if (false === in_props.options.hasOwnProperty(key)) {
				continue;
			}
			var option = in_props.options[key];
			var newProps = { 
				"type" : "radio", 
				"name" : in_props.name,
				"id" : key,
				"onChange": function(in_key){
						return function(in_event){
							console.log("ModalDialogBodyRadio name:" + in_props.name + " key:" + in_key + " value:" + in_event.target.value + " checked:" + in_event.target.checked);
							console.log(JSON.stringify(in_event.target));
							//in_event.target.checked = "checked";
							in_event.preventDefault();
						};
					}(key)
				};
			if (in_props.value === key){
				newProps["checked"] = true;
			//} else {
			//	newProps["checked"] = false;
			}
			childrenArray.push(e("div", 
				{ "key" : key },
				e("input", newProps),
				e("label", { "htmlFor" : key }, option)
			));
		}
	}

	return e("div", null, childrenArray);


					"f" : {
						"type" : "radio",
						"options" : { 
							"g" : { "label" : "label", "text" : ["some text for choice g"], "method" : function(in_data){ console.log("radio option g"); }},

	"name" : in_key, 
	"key" : in_key, 
	"options" : in_data.options

 */

const ModalDialogBodyRadio = function(in_props){
	var childrenArray = [];
	if ((undefined != in_props) && (undefined != in_props.options)){
		for (var key in in_props.options) {
			//console.log("ModalDialogBodyRadio key:" + key);
			if (false === in_props.options.hasOwnProperty(key)) {
				continue;
			}
			var option = in_props.options[key];
			var func = undefined;
			if (option.method !== undefined){
				func = (function(in_method){ return function(in_event){ in_props.onClick(in_method); }})(option.method);
			}
			childrenArray.push(e("div", { "key" : key}, 
				ButtonFactoryStandardInteractive(func, option.label),
				e(ToolTip, {"text" : option.text})
			));
		}
	}

	return e("div", null, childrenArray);
}

/*
	<div class="framewrapperparent" style="padding:1em;">
		<div class="framewrapper">
			<div class="foreground frame"></div>
		</div>
		<h1 style="text-align:center;">Heading</h1>
		<p class="text" style="text-align: center;">Text hhhh hhhhhhhhhh hhhhhh hhhh hh hhhhhh hh h hhhh hh hhh hhh h hhhhh hh h hhhh hh hhhhhh hh hhhhh hh h hhhhh h h</p>
	</div>
*/
const ModalDialogBody = function(in_props){
	var heading = e("h1", {"style" : {"textAlign":"center"}}, in_props.title);
	var body = e(ToolTip, {"text" : in_props.text});
	var formArray = undefined;
	if ("form" in in_props){
		formArray = [];
		for (var key in in_props.form) {
			if (false === in_props.form.hasOwnProperty(key)) {
				continue;
			}
			AppendFormArray(formArray, key, in_props.form[key], in_props);
		}
	}
	
	return e("div", {"className":"backboardparent", "style":{"padding":"1em"}},
		e(BackBoard, {"top":"-0.75em","right":"0","bottom":"-0.75em","left":"0"}), 
		heading,
		body,
		formArray
	);
}

/*
	<div class="container" style="justify-content:flex-end;margin-right:1.0em;margin-left:0.5em;">
		<a class="button standard interact">interact</a>
		<a class="button standard call">call</a>
		<a class="button standard destruct">destruct</a>
	</div>
			"bottomBar" : [
				{"text":"ok", "flavor":"call", "method":function(in_data){ console.log("ok in_data:" + JSON.stringify(in_data))}},
			]
"flavor": .disable .interact .call .destruct
	*/
const ModalDialogBottombar = function(in_props){
	//console.log("ModalDialogBottombar in_props:" + JSON.stringify(in_props));

	if (in_props === undefined){
		return null;
	}

	var arrayChildren = [];

	if (in_props.bottomBar !== undefined){
		for (var index = 0, total = in_props.bottomBar.length; index < total; index++) {
			var buttonData = in_props.bottomBar[index];
			var func = undefined;
			if (buttonData.method !== undefined){
				func = (function(in_method){ return function(in_event){ in_props.onClick(in_method); }})(buttonData.method);
			}

			var factory = undefined;
			switch (buttonData.flavor){
				default:
				case "interact":
					factory = ButtonFactoryStandardInteractive;
					break;
				case "disable":
					factory = ButtonFactoryStandardDisable;
					break;
				case "call":
					factory = ButtonFactoryStandardCall;
					break;
				case "destruct":
					factory = ButtonFactoryStandardDestruct;
					break;
			}

			if (factory !== undefined){
				arrayChildren.push(factory(func, buttonData.text, index));
			}
		}
	}

	return e("div", {"className" : "container", "style" : {"justifyContent":"flex-end", "marginRight":"0.5em", "marginLeft":"0.5em"}}, arrayChildren);

}

const ModalDialogDispatch = function(in_dispatch, in_props){
	return {
		"popModal" : function(){ in_dispatch({"type" : "popModal"})},
	}
}

const ModalDialogInternal = class extends React.Component{
	constructor(props) {
		super(props);

		//we need initial data for all the select options in the state, else if they are never changed, the values will not get into the state...
		var data = {};
		//console.log("ModalDialogInternal constructor props.modalDialog:" + props.modalDialog);
		for (var index = 0, total = props.modalDialog.contents.length; index < total; index++) {
			var content = props.modalDialog.contents[index];
			if (false === ("form" in content)){
				continue;
			}

			for (var key in content.form) {
				if (false === content.form.hasOwnProperty(key)) {
					continue;
				}
				const formData = content.form[key];
				const type = formData.type;
				var initialValue = undefined;
				switch (type){
					default:
						//console.log("modal dialog unkown form type in ctor:" + type);
						break;
					case "select":
						//console.log("state select:" + JSON.stringify(formData));
						for (var subKey in formData.options) {
							if (false === formData.options.hasOwnProperty(subKey)) {
								continue;
							}
							initialValue = subKey;
							break;
						}
						break;
					case "text":
						initialValue = "";
						if ("value" in formData){
							initialValue = formData.value;
						}
						break;
				}
				data[key] = initialValue;
			}
		}

		this.state = {
			"tab" : 0,
			"data" : data
		};
		//console.log("state:" + JSON.stringify(this.state));
		this.onSetTab = this.onSetTab.bind(this);
		this.onClick = this.onClick.bind(this);
		this.onSetValue = this.onSetValue.bind(this);
	}
	onSetTab(in_tab){
		this.setState({"tab": in_tab});
	}
	onClick(in_method){
		this.props.popModal();
		if (in_method !== undefined){
			in_method(this.state);
		}
	}
	onSetValue(in_name, in_value){
		var data = Object.assign({}, this.state.data);
		data[in_name] = in_value;
		this.setState({"data": data});
	}
	render() {
		//console.log("ModalDialogInternal render state:" + JSON.stringify(this.state));

		var tabNameArray = [];
		if (0 < this.props.modalDialog.contents.length){
			for (var index = 0, total = this.props.modalDialog.contents.length; index < total; index++) {
				var data = this.props.modalDialog.contents[index];
				tabNameArray.push(data.tabName);
			}
		}

		var bodyProps = Object.assign({}, this.props.modalDialog.contents[this.state.tab], {
			"onSetValue" : this.onSetValue,
			"data" : this.state.data,
			"onClick" : this.onClick
		}); 

		return e("div", { "className" : "wash", "style" : {
				"position" : "fixed",
				"top": "0",
				"left": "0",
				"bottom": "0",
				"right": "0",
				"display":"flex",
				"justifyContent":"center"
			}},
			e("div", { "style" : { "width":"30em","alignSelf":"center"}},
				e("div", { "style" : { "display":"flex","flexDirection":"column","flexWrap":"nowrap","justifyContent":"spaceBetween"}},
					e(ModalDialogTopbar, { "tabNameArray" : tabNameArray, "onSetTab" : this.onSetTab, "tab" : this.state.tab, "onSetTab" : this.onSetTab, "onClick":this.onClick }),
					e(ModalDialogBody, bodyProps),
					e(ModalDialogBottombar, {"bottomBar" : this.props.modalDialog.contents[this.state.tab].bottomBar, "onClick":this.onClick})
				)
			)
		);

	}
}

/*
	state is current selected tab, plus hold the 'form' data?
*/
export const ModalDialog = connect(null, ModalDialogDispatch)(function(in_props) {
	if (null === in_props.modalDialog){
		return null;
	}

	//console.log("ModalDialog constructor props.modalDialog:" + props.modalDialog);
	return e(ModalDialogInternal, in_props);
})
