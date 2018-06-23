const Path = require("path");
const Util = require("./util");

/*
object to own all the (plugins) applications found
*/

const GatherApplications = function(in_applicationMap) {
	const pluginsPath = Path.join(__dirname, "/../applications/");
	//console.log("plugin:" + pluginsPath);
	Util.DirSync(pluginsPath, function(filePath, stat){
		var modulePath = "./" + Path.relative(__dirname, filePath).replace(/\\/g, "/") + "/application.js";
		//console.log("application:" + modulePath);
		try{
			var application = require(modulePath)();
			var applicationName = application.GetName();
			in_applicationMap[applicationName] = application;
		}catch (err){
			console.log("application:" + modulePath + " threw:" + err);
		}
	});
}


const ApplicationManager = function(in_applicationMap){
	this.m_applicationMap = in_applicationMap;
}

ApplicationManager.prototype.DocumentDataToDocument = function(in_applicationName, in_documentData) {
	if (in_applicationName in this.m_applicationMap){
		return this.m_applicationMap[in_applicationName].DocumentDataToDocument(in_documentData);
	}
	return null;
}

ApplicationManager.prototype.DocumentToDocumentData = function(in_applicationName, in_document) {
	if (in_applicationName in this.m_applicationMap){
		return this.m_applicationMap[in_applicationName].DocumentToDocumentData(in_document);
	}
	return null;
}

ApplicationManager.prototype.NewDocumentData = function(in_applicationName, in_documentType) {
	if (in_applicationName in this.m_applicationMap){
		return this.m_applicationMap[in_applicationName].NewDocumentData(in_documentType);
	}
	return null;
}

ApplicationManager.prototype.ApplyDelta = function(in_applicationName, in_base, in_delta) {
	if (in_applicationName in this.m_applicationMap){
		return this.m_applicationMap[in_applicationName].ApplyDelta(in_base, in_delta);
	}
	return null;
}

/*
return promise of application manager
*/
module.exports = function(){
	var applicationMap = {};
	GatherApplications(applicationMap);
	return new ApplicationManager(applicationMap);
}
