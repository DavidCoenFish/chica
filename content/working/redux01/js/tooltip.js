/*
		//for tooltip'able text, we pass an array, string is default text, all else gets wrapped in objects with extra data such as colour and tooltip data
		"text" : [
			"dialog body text", 
			{"text" : "tooltip", "tooltip":["the popup text of the ", {"text" : "tooltip", "tooltip":"another layer"]}
		]


		<span>this is some text with a 
			<span class="tooltip">
				<span class="tooltext">tooltip</span>
				<span class="toolpop">this is the popup text of the tooltip</span>
			</span>
		</span>
*/

const ToolTip = function(in_props){
	console.log("ToolTip in_props:" + JSON.stringify(in_props));

	if ((in_props.text === undefined) || (in_props.text.length <= 0)){
		return null;
	}

	var arrayChildren = [];

	for (var index = 0, total = in_props.text.length; index < total; index++) {
		var data = in_props.text[index];
		if ("string" === typeof(data)){
			arrayChildren.push(e("span", {"key":index}, data));
		} else {
			arrayChildren.push(e("span", {"key":index, "className":"tooltip"},
					e("span", {"className":"tooltext"}, data.text),
					e(ToolTip, {"newPop":"newPop", "text":data.tooltip}),
				),
			);
		}
	}

	var newProps = {};
	if ("newPop" in in_props){
		newProps["className"] = "toolpop";
	}

	return e("span", newProps, arrayChildren);
}

