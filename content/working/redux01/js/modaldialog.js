const GenerateTestModalDialogStack = function(){
	return [{
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
				]

			},
			{
				"tabName" : "two",
				"text" : [ "hello world" ]
			}
		],
		"bottomBar" : [
			{"text":"ok", "flavor":"call", "method":function(in_data){ console.log("ok in_data:" + JSON.stringify(in_data))}},
			{"text":"cancel", "flavor":"interact", "method":function(in_data){ console.log("cancel in_data:" + JSON.stringify(in_data))}},
			{"text":"other", "flavor":"destruct", "method":function(in_data){ console.log("other in_data:" + JSON.stringify(in_data))}},
		]
	}];
}

const ReducerModalDialogStack = function(in_state, in_action){
	if (in_state === undefined){
		return GenerateTestModalDialogStack();
		return [];
	}

	switch (in_action.type){
		case "addModal":
			var newState = ([in_action.data]).concat(in_state);
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

	for (var index = 0, total = in_props.tabNameArray.length; index < total; index++) {
		var name = in_props.tabNameArray[index];
		var newProps = {"className" : "button standard"};
		if (in_props.tab === index){
			newProps["className"] += " disable";
		} else {
			newProps["className"] += " interact";
			newProps["onClick"] = function(in_index){ return function(){ in_props.onSetTab(in_index); } };
		}
		arrayChildren.push(e("a", newProps, name));
	}

	arrayChildren.push(e("div", { "style" : { "flexGrow":1, "flexShrink":0 }}));
	arrayChildren.push(e("a", {"className" : "button standard interact", "onClick" : function(in_event){in_props.onClick();}}, "X"));
	return null;
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
	var heading = e("h1", {"style" : {"textAlign":"center"}}, "Heading");
	//var body = e("p", {"className" : "text", "style" : {"textAlign":"center"}}, "Text hhhh hhhhhhhhhh hhhhhh hhhh hh hhhhhh hh h hhhh hh hhh hhh h hhhhh hh h hhhh hh hhhhhh hh hhhhh hh h hhhhh h h");
	var body = e(ToolTip, {"text" : in_props.text});
	return e("div", {"className":"framewrapperparent", "style":{"padding":"1em"}},
		e("div", {"className":"framewrapper"},
			e("div", {"className":"foreground frame"})
		),
		heading,
		body
	);
}

/*
	<div class="container" style="justify-content:flex-end;margin-right:1.0em;margin-left:0.5em;">
		<a class="button standard interact">interact</a>
		<a class="button standard call">call</a>
		<a class="button standard destruct">destruct</a>
	</div>
*/
const ModalDialogBottombar = function(in_props){
	return null;
}

const ModalDialogDispatch = function(in_dispatch, in_props){
	return {
		"popModal" : function(){ in_dispatch({"type" : "popModal"})},
	}
}

/*
	state is current selected tab, plus hold the 'form' data?
*/
const ModalDialog = window.ReactRedux.connect(null, ModalDialogDispatch)(class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			"tab" : 0,
			"data" : {}
		};
		this.onSetTab = this.onSetTab.bind(this);
		this.onClick = this.onClick.bind(this);
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
	render() {
		if (null === this.props.modalDialog){
			return null;
		}

		var tabNameArray = [];
		if (0 < this.props.modalDialog.contents.length){
			for (var index = 0, total = this.props.modalDialog.contents.length; index < total; index++) {
				var data = this.props.modalDialog.contents[index];
				tabNameArray.push(data.tabName);
			}
		}

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
					e(ModalDialogTopbar, { "tabNameArray" : tabNameArray, "onSetTab" : this.onSetTab, "tab" : this.state.tab, "onClick" : this.onClick }),
					e(ModalDialogBody, this.props.modalDialog.contents[this.state.tab]),
					e(ModalDialogBottombar, this.props)
				)
			)
		);

	}
})
