import React from "react";


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

	return React.createElement("div", newProps,
			React.createElement("p", newChildProps, in_props.version)
	);
}

export {Footer}

