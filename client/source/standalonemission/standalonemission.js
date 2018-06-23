import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {createStore} from "redux";
import {App, AppReducer} from "./app.js";
import {CharacterData} from "./../components/characterdata/characterdata.js";

const e = React.createElement;

const ReduxStore = createStore(AppReducer);
const gDocumentManager = c.DocumentManager.Factory(gStaticlegendaryquest, c.InstructionContext, c.ActionContext);

//console.log("ReactDOM.render");

ReactDOM.render(
	e(Provider, {"store" : ReduxStore}, 
		e(App, {
			"staticData" : gStaticlegendaryquest, 
			"documentManager" : gDocumentManager,
			"documentManagerVersion" : c.version,
			"clientVersion" : "__webpack_plugin_version__"
		})), 
	document.getElementById("root")
);

