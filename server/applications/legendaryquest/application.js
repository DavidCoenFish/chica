const Config = require("config");
const Express = require("express");
const Application = require("./../../modules/application");
const RestApplicationWrapper = require("./../../modules/restapplicationwrapper");

const app = require("./../../server");

module.exports = function() {
	//console.log("application legendaryquest");

	//register the stiatic files for the application
	app.use(Express.static("public"))

	//register the application routes
	RestApplicationWrapper("legendaryquest", "character", "/api/v1", "/legendaryquest/character");
	//RestApplicationWrapper("legendaryquest", "monster", "/api/v1", "/legendaryquest/monster");

	return new Application("legendaryquest", Config.contentPublicDir + "/icon/legendaryquest.png", Config.contentPublicDir + "/js/legendaryquest.json", Config.contentPublicDir + "/js/legendaryquest.js");

}
