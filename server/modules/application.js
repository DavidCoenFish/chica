const WrapJavaScript = require("./wrapjavascript");
const SchemaDocuments = require("./../schema/documents");

/*
helper modual for (plugin) application

?in_context is an object with {
	"data" : {
		"metadata" : {},
		"rules" : {},
	}
	""
	"gameObjectManager" : object;-
		"DocumentToGameObject" : function(in_document)
		"GameObjectToDocument" : function(in_document)
		"MakeUpdatePatch" : function(in_previousDocument, in_newDocument) returns update patch //client
		"ValidateUpdatePatch" : function(in_updatePatch) //server
		"PerformAction" : function(in_actionName, in_gameObject) returns new gameObject result //server?
}

*/

const _makeDocumentManager = function(in_pathDataJson, in_pathLibraryJS){
	const context = { "console": console };
	WrapJavaScript(in_pathDataJson, context, "const staticData = ");
	WrapJavaScript(in_pathLibraryJS, context);

	//console.log("_makeDocumentManager context.staticData:" + context.staticData + " " + JSON.stringify(context.staticData));
	//const documentManager = context.c.DocumentManager.Factory(staticData, instructionContext);

	const documentManager = context.c.DocumentManager.Factory(context.staticData, context.c.InstructionContext);
	return documentManager;
}


const Application = function(in_name, in_iconPath, in_documentManager) {
	this.m_name = in_name;
	this.m_iconPath = in_iconPath;
	this.m_documentManager = in_documentManager;
}

Application.prototype.GetName = function() {
	return this.m_name;
}

//for testing i wanteded access to document manager?
//Application.prototype.GetDocumentManager = function() {
//	return this.m_documentManager;
//}

Application.prototype.DocumentDataToDocument = function(in_documentData) {
	if (this.m_documentManager != null){
		//console.log("marko this:" + this + " this.m_documentManager:" + this.m_documentManager); // + " this.m_documentManager.DocumentDataToDocument:" + this.m_documentManager.DocumentDataToDocument);
		var result = this.m_documentManager.DocumentDataToDocument(in_documentData);
		//console.log("polo");
		return result;
	}
	return null;
}

Application.prototype.DocumentToDocumentData = function(in_document) {
	if (this.m_documentManager != null){
		//console.log("DocumentToDocumentData in_document:" + in_document);
		var result = this.m_documentManager.DocumentToDocumentData(in_document);
		return result;
	}
	return null;
}

Application.prototype.NewDocumentData = function(in_documentType){
	if (this.m_documentManager != null){
		var documentData = this.m_documentManager.NewDocumentData(in_documentType);
		//console.log("Application.NewDocumentData in_documentType:" + in_documentType + " documentData:" + JSON.stringify(documentData));
		return documentData;
	}
	return null;
}

Application.prototype.ApplyDelta = function(in_base, in_delta){
	if (this.m_documentManager != null){
		var documentData = this.m_documentManager.ApplyUpdatePatch(in_base, in_delta);
		//console.log("Application.ApplyDelta in_documentType:" + in_documentType + " documentData:" + JSON.stringify(documentData));
		return documentData;
	}
	return null;
}

module.exports = function(in_name, in_iconPath, in_pathDataJson, in_pathLibraryJS){
	const documentManager = _makeDocumentManager(in_pathDataJson, in_pathLibraryJS);
	return new Application(in_name, in_iconPath, documentManager);
}
