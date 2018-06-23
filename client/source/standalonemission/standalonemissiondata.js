import React from "react";
import ReactDOM from "react-dom";
import {BackBoard} from "./../components/backboard/backboard.js";
import {DocumentData} from "./../components/documentdata/documentdata.js";
import {ToolTip} from "./../components/tooltip/tooltip.js";
import {ButtonFactoryStandardInteractive, ButtonFactoryStandardDisable} from "./../components/button/button.js";

const e = React.createElement;

export const StandaloneActionData = class extends React.Component{
	constructor(in_props) {
		//console.log("StandaloneActionData ctor");
		super(in_props);

		this.onRunAction = this.onRunAction.bind(this);
	
		const newString = JSON.stringify(this.props.documentData);
		//console.log("ctor newString:" + newString);
		this.state = {
			result : {
				"finished" : false,
				"state" : undefined,
				"delta_log" : []
			},
			inputString : newString
		};
	}
	blastState(in_documentData){
		const newString = JSON.stringify(in_documentData);
		//console.log("blastState newString:" + newString);
		if (newString !== this.state.inputString){
			this.setState({
				result : {
					"finished" : false,
					"state" : undefined,
					"delta_log" : []
				},
				inputString : newString
			})
		}
	}
	onRunAction(in_event){
		//console.log("onRunAction props.action:" + this.props.action);
		var newResults = this.props.documentManager.RunAction(this.props.action, this.props.document, this.props.units, true, this.state.result.state);
		//console.log("newResults:" + JSON.stringify(newResults));
		if (newResults !== undefined){
			this.setState({"result": newResults});
		}
	}

	componentWillReceiveProps(nextProps){
		//console.log("componentWillReceiveProps documentData:" + JSON.stringify(nextProps.documentData));
		this.blastState(nextProps.documentData);
		//super.componentWillReceiveProps(nextProps);
	}

	render() {
		//console.log("render");
		const newProps = {
			"style" : {
				"flexGrow":1,
				"flexShrink":0,
				"display":"flex",
				"flexDirection":"column",
				"justifyContent":"space-between",
				"alignItems":"stretch"
			}
		};

		var button = undefined;
		if ((this.props.document != null) && (false === this.state.result.finished)){
			button = ButtonFactoryStandardInteractive(this.onRunAction, "Run Action");
		} else {
			button = ButtonFactoryStandardDisable(undefined, "Run Action");
		}

		const arrayResultTooltips = [];
		if (this.props.action !== undefined){
			arrayResultTooltips.push(e("div", {"key":-2}, this.props.documentManager.GetLocaleData(this.props.action)));
		}
		if (this.state.result.state !== undefined){
			arrayResultTooltips.push(e("div", {"key":-1}, "finished:" + JSON.stringify(this.state.result.finished) + " result:" + JSON.stringify(this.state.result.result) + " state:" + JSON.stringify(this.state.result.state)));
		} else {
			arrayResultTooltips.push(e("div", {"key":-1}, "finished:" + JSON.stringify(this.state.result.finished) + " result:" + JSON.stringify(this.state.result.result)));
		}

		if (this.state.result.delta_log !== undefined){
			for (var index = 0, length = this.state.result.delta_log.length; index < length; ++index){
				const arrayTooltip = this.state.result.delta_log[index];
				//arrayTooltip["key"] = index;
				const tooltip = e("p", {"key":index}, e(ToolTip, {"text" : arrayTooltip.tooltip}));
				//const tooltip = e(ToolTip, arrayTooltip);
				arrayResultTooltips.push(tooltip);
			}
		}

		return e("div", newProps, 
			e(DocumentData, this.props),
			e("div", { "style":{"paddingTop":"0.5em", "paddingLeft":"1em", "flexGrow":0, "flexShrink":0}}, button),
			e("div", { "className" : "backboardparent", "style":{"backgtound":"#ff0000", "flexGrow":1, "flexShrink":0}}, 
				e(BackBoard, {"top":"-0.75em","right":"0.5em","bottom":"0.0em","left":"0.5em"}),
				//e("div", {"style" : {"padding":"0.25em 1em 0 1.0em"}}, arrayResultTooltips),
				e("div", {"style" : {"padding":"0 1em 0 1.0em"}}, arrayResultTooltips),
			)
		);
	}
}
