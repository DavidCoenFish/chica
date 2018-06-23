const Config = require("config");
const Database = require("./../modules/database.js");
const Q = require("q");
const Requestify = require("requestify");
const Test = require("./../modules/test.js");
const SchemaUsers = require("./../schema/users");
const SchemaGuests = require("./../schema/guests");
const SchemaDocuments = require("./../schema/documents");

const kUrlStub = "http://localhost:" + Config.port;

module.exports = function(promiseFactoryArray) {
	promiseFactoryArray.push(RunPutFolder);
	return;
}

const ClearDatabase = function(){
	return Q(true).then(function(){
		return Database.deleteCollection(SchemaUsers._sCollectionName);
	}).then(function(){
		return Database.deleteCollection(SchemaGuests._sCollectionName);
	}).then(function(){
		return Database.deleteCollection(SchemaDocuments._sCollectionName);
	});
}

const RunPutFolder = function(){
	const name = "put folder";
	return ClearDatabase().then(function(){
		return Requestify.post(kUrlStub + "/api/v1/accounts", { "type" : "guest" });
	}).then(function(input){
		Test.DealTest(name + " post status", input.getCode(), 201);

		var body = input.getBody();
		Test.DealProperty(name + " post accountID", body, "id");
		accountID = body["id"];
		Test.DealProperty(name + " post sessionKey", body, "sessionkey");
		sessionKey = body["sessionkey"];

		//return Requestify.get(kUrlStub + "/api/v1/accounts/" + accountID + "?sessionkey=" + sessionKey);

		//return Requestify.post(kUrlStub + "/api/v1/folders", { "name" : "hello" });
	//}).then(function(input){
		//Test.DealTest(name + " post status", input.getCode(), 201);

		//console.log(name + " done");
		return true;
	});
}
