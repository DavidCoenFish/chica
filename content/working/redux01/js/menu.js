/*
{
	"factory" : function(in_data),
	"text" : "",
	"enabled" : true,
	"method" : function()
	"children" : [...]
}
*/

const HMenuFactoryTop = function(in_item, in_index, in_subMenu){
	var childProps = { className:"standard" };
	if (false !== in_item.enabled){
		childProps["className"] += " interact";
	} else {
		childProps["className"] += " disable";
	}
	//return e("a", childProps, in_item.text);
	return e("li", {key:in_index}, 
		e("a", childProps, in_item.text), in_subMenu);
}

const HMenuFactoryInteractive = function(in_item, in_index, in_subMenu){
	var content = undefined;
	if (false !== in_item.enabled){
		var childProps = { className:"wide interact" };
		if ("method" in in_item){
			childProps["onClick"] = function(in_event){ in_item.method(in_item); return; }
		}
		if ("children" in in_item){
			childProps["className"] += " expand";
		}
		content = e("a", childProps, in_item.text);
	} else {
		content = e("label", {className:"wide"}, in_item.text);
	}
	return e("li", {key:in_index}, content, in_subMenu);
}
const HMenuFactorySeperator = function(in_item, in_index, in_subMenu){
	return e("li", {"key":in_index, "className" : "wide", "style" : {"display" : "block", "minHeight" : "0.2em"}});
}

const HMenuFactoryFileOpen = function(in_item, in_index, in_subMenu){
	var content = undefined;
	if (false !== in_item.enabled){
		var childProps = { className:"wide interact" };
		if ("children" in in_item){
			childProps["className"] += " expand";
		}
		content = e("label", childProps, 
			e("input", { 
				"type":"file", 
				"required":"required",
				"accept": in_item.accept,
				"onChange": function(in_event){
					if (0 < in_event.target.files.length){
						var file = in_event.target.files[0];
						in_item.method(file);
					}
					return;
				},
				"style" : { "position" : "fixed", "top" : "-100em" }
			}),
			in_item.text
			);
	} else {
		content = e("label", {className:"wide"}, in_item.text);
	}

	return e("li", {key:in_index}, content, in_subMenu);
}

/*
in_props.children = []
[in_props.paddLeft] ~ style?
*/
const HMenu = function(in_props){
	//console.log("HMenu in_props:" + JSON.stringify(in_props) + " " + (typeof(in_props.children)));
	var childContents = undefined;
	if ((in_props != undefined) && (in_props.children != undefined)){
		childContents = in_props.children.map((item, index) => {
			var subMenu = undefined;
			if ("children" in item){
				subMenu = e(VMenu, item);
			}
			return item.factory(item, index, subMenu);
			//return e("li", {key:index}, content, subMenu);
		});
	}
	var newProps = {};
	newProps["className"] = "menu";
	newProps["style"] = {display:"flex", "paddingLeft":in_props.paddLeft, "flexGrow":"0", "flexShrink":"0"};
	return e("ul", newProps, childContents);
}

/*
*/
const VMenu = function(in_props){
	var childContents = undefined;
	if ((in_props !== undefined) && (in_props.children !== undefined)){
		childContents = in_props.children.map((item, index) => {
			var subMenu = undefined;
			if ("children" in item){
				subMenu = e(VMenu, item);
			}
			return item.factory(item, index, subMenu);
			//return e("li", {key:index}, content, subMenu);
		});
	}

	return e("ul", null, childContents);
}








/*
//for connecting the react-redux providers store's state to the component's props
//the returned object is merged with the connected component's in_props
const MenuMapStateToProps = function(in_state, in_props){
	//console.log("MenuMapStateToProps");
	var menuData = in_props.generateMenuData(in_state, in_props);
	return { 
		"menuData" : menuData,
		"state" : in_state //for save, then in save logic, pull out data to save
	};
}

const MenuMapStateToProps2 = function(in_state, in_props){
	//console.log("MenuMapStateToProps");
	return { 
		"state" : in_state //for save, then in save logic, pull out data to save
	};
}

//for connecting the component back to the react-redux provider's dispatch 
//the returned object is merged with the connected component's in_props
const MenuMapDispatchToProps = function(in_dispatch, in_props){
	return {
		"onMenuClick" : function(in_method, in_state){
			in_method(in_dispatch, in_state);
		},
		"onLoadClick" : function(in_method, in_file){
			in_method(in_dispatch, in_file);
		}
	};
}


const HMenu = window.ReactRedux.connect(MenuMapStateToProps, MenuMapDispatchToProps)(function(in_props){
	var childContents = undefined;
	if ((in_props !== undefined) && (in_props.menuData.children !== undefined)){
		childContents = in_props.menuData.children.map((item, index) => {
			var subMenu = undefined;
			var childProps = { className:"standard" };
			if (false === item.enabled){
				childProps["className"] += " disable";
			} else {
				childProps["className"] += " interact";
			}
			if ("method" in item){
				childProps["onClick"] = function(in_method){ return function(){ 
					in_props.onMenuClick(in_method, in_props.state); 
					}}(item.method);
			}
			if ("children" in item){
				subMenu = e(VMenu, item);
			}
			return e("li", {key:index}, e("a", childProps, item.name ), subMenu);
		});
	}
	var newProps = {};
	newProps["className"] = "menu";
	newProps["style"] = {display:"flex", "paddingLeft":in_props.menuData.left, "flexGrow":"0", "flexShrink":"0"};
	return e("ul", newProps, childContents);
});

class MenuFileOpenClass extends React.Component {
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
	}
	onChange(event){
		//console.log("files:" + event.target.files + " value:" + event.target.value);
		if (0 < event.target.files.length){
			var file = event.target.files[0];
			//console.log("name:" + file.name + " type:" + file.type + " size" + file.size);
			this.props.onLoadClick(this.props.methodLoad, file);
		}
		return;
	}
	render() {
		var name = this.props.name;
		var childProps = { className:"wide"}; //, "htmlFor":name};
		var enabled = true;
		if ("enabled" in this.props){
			enabled = this.props.enabled;
		}
		if (false === enabled){
			childProps["className"] += " disable";
		} else {
			childProps["className"] += " interact";
		}

		return e("label", childProps, 
			e("input", { 
				"type":"file", 
				"required":"required",
				"accept": this.props.accept,
				//"name":name, 
				"onChange":this.onChange,
				"style" : { "position" : "fixed", "top" : "-100em" }
			}),
			name
		);
	}
}
const MenuFileOpen = window.ReactRedux.connect(undefined, MenuMapDispatchToProps)(MenuFileOpenClass);

const VMenu = window.ReactRedux.connect(MenuMapStateToProps2, MenuMapDispatchToProps)(function(in_props){
	var childContents = undefined;
	if ((in_props !== undefined) && (in_props.children !== undefined)){
		var childContents = in_props.children.map((item, index) => {
			var subMenu = undefined;
			var childProps = { className:"wide"};
			var enabled = true;
			if ("enabled" in item){
				enabled = item.enabled;
			}
			if (false === enabled){
				childProps["className"] += " disable";
			} else {
				childProps["className"] += " interact";
			}
			if ("children" in item){
				subMenu = e(VMenu, item);
				childProps["className"] += " expand";
			}
			if ("method" in item){
				childProps["onClick"] = function(in_method){ return function(){ 
					//console.log("onClick in_props:" + JSON.stringify(in_props));
					in_props.onMenuClick(in_method, in_props.state); 
					}}(item.method);
			}
			var childElement = undefined;
			if ("methodLoad" in item){
				childElement = e(MenuFileOpen, item);
			} else {
				childElement = e("a", childProps, item.name );
			}
			return e("li", {key:index}, childElement, subMenu);
		});
	}

	return e("ul", null, childContents);
});
*/
