const Config = require("config");
const Express = require("express");
const Application = require("./../../modules/application");
const RestApplicationWrapper = require("./../../modules/restapplicationwrapper");

const app = require("./../../server");

module.exports = function() {
	//console.log("application system");

	//app.use(Express.static("public"));

	RestApplicationWrapper("system", "folder", "/api/v1", "/folder");

	return new Application("system", Config.contentPublicDir + "/icon/system.png", Config.contentPublicDir + "/js/system.json", Config.contentPublicDir + "/js/system.js");
}
