const Config = require("config");
const Database = require("./../modules/database.js");
const Q = require("q");
const Requestify = require("requestify");
const Test = require("./../modules/test.js");
const SchemaUsers = require("./../schema/users");
const SchemaGuests = require("./../schema/guests");
const SchemaDocuments = require("./../schema/documents");
const Server = require("./../server.js");

const kUrlStub = "http://localhost:" + Config.port;

module.exports = function(promiseFactoryArray) {
	promiseFactoryArray.push(RunPostLegendaryQuestCharacter);
	promiseFactoryArray.push(RunCreateDestoyLegendaryQuestCharacter);
	promiseFactoryArray.push(RunLegendaryQuestCharacter);
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

const RunPostLegendaryQuestCharacter = function(){
	const name = "PostLegendaryQuestCharacter";
	//console.log(name + " start");

	return ClearDatabase().then(function(){
		return Requestify.post(kUrlStub + "/api/v1/accounts", { "type" : "user", "email" : "a@b", "name" : "f", "password" : "1234567890ABCDEF" });
	}).then(function(input){
		//console.log(name + " input.getCode():" + input.getCode());

		var body = input.getBody();
		Test.DealProperty(name + " post accountID", body, "id");
		accountID = body["id"];
		Test.DealProperty(name + " post sessionKey", body, "sessionkey");
		sessionKey = body["sessionkey"];

		Test.DealTest(name + " post status", input.getCode(), 201);
		var url = kUrlStub + "/api/v1/legendaryquest/character?sessionkey=" + sessionKey;

		//console.log(name + " url:" + url);
		return Requestify.post(url, { "name" : "character00" });
	}).then(function(input){
		Test.DealTest(name + " post status", input.getCode(), 201);

		var body = input.getBody();
		documentID = body["id"];
		//console.log(name + " body:" + JSON.stringify(body));

		return Requestify.get(kUrlStub + "/api/v1/legendaryquest/character/" + documentID + "?sessionkey=" + sessionKey);
	}).then(function(input){
		Test.DealTest(name + " get status", input.getCode(), 200);

		var body = input.getBody();
		Test.DealTest(name + " body", body != null, true);
		//console.log(name + " body:" + JSON.stringify(body));
		Test.DealTest(name + " applicationManager", Server.locals.applicationManager != null, true);

		var document = Server.locals.applicationManager.DocumentDataToDocument("legendaryquest", body["data"]);
		Test.DealTest(name + " document", document != null, true);
		document.SetValue("name", "fred");
		var documentData = Server.locals.applicationManager.DocumentToDocumentData("legendaryquest", document);
		Test.DealTest(name + " applicationManager", Server.locals.applicationManager != null, true);

		//normally we don't need access on server, but unit test and i didn't want to have to make my own document manager.
		var documentManager = Server.locals.applicationManager.m_applicationMap["legendaryquest"].m_documentManager;
		var delta = documentManager.MakeUpdatePatch(body["data"], documentData, body["write_lock"], []); //["data"]);
		//console.log(name + " delta:" + JSON.stringify(delta));
		
		return Requestify.put(kUrlStub + "/api/v1/legendaryquest/character/" + documentID + "?sessionkey=" + sessionKey, delta);
	}).then(function(input){
		Test.DealTest(name + " get status", input.getCode(), 200);

		return Requestify.get(kUrlStub + "/api/v1/legendaryquest/character/" + documentID + "?sessionkey=" + sessionKey);
	}).then(function(input){
		Test.DealTest(name + " get status", input.getCode(), 200);
		var body = input.getBody();
		Test.DealTest(name + " body", body != null, true);
		//console.log(name + " body:" + JSON.stringify(body));
		Test.DealTest(name + " applicationManager", Server.locals.applicationManager != null, true);

		var document = Server.locals.applicationManager.DocumentDataToDocument("legendaryquest", body["data"]);
		var nameValue = document.GetValue("name");

		Test.DealTest(name + " name", nameValue, "fred");

		return true;
	}).fail(function(input){
		throw input;
	}).then(function(input){
		//console.log(name + " done");
	});
}

const RunCreateDestoyLegendaryQuestCharacter = function(){
	const name = "CreateDestoyLegendaryQuestCharacter";
	//console.log(name + " start");
	var accountID;
	var sessionKey;

	return ClearDatabase().then(function(){
		return Requestify.post(kUrlStub + "/api/v1/accounts", { "type" : "user", "email" : "a@b", "name" : "f", "password" : "1234567890ABCDEF" });
	}).then(function(input){
		Test.DealTest(name + " post account status", input.getCode(), 201);

		var body = input.getBody();
		Test.DealProperty(name + " post accountID", body, "id");
		accountID = body["id"];
		Test.DealProperty(name + " post sessionKey", body, "sessionkey");
		sessionKey = body["sessionkey"];

		Test.DealTest(name + " post status", input.getCode(), 201);
		var url = kUrlStub + "/api/v1/legendaryquest/character?sessionkey=" + sessionKey;

		//console.log(name + " url:" + url);
		return Requestify.post(url, { "name" : "character00" });
	}).then(function(input){
		Test.DealTest(name + " post document status", input.getCode(), 201);

		var body = input.getBody();
		documentID = body["id"];
		//console.log(name + " body:" + JSON.stringify(body));

		return Requestify.get(kUrlStub + "/api/v1/legendaryquest/character/" + documentID + "?sessionkey=" + sessionKey);
	}).then(function(input){
		Test.DealTest(name + " get status", input.getCode(), 200);

		return Requestify.delete(kUrlStub + "/api/v1/legendaryquest/character/" + documentID + "?sessionkey=" + sessionKey);
	}).then(function(input){
		Test.DealTest(name + " get status", input.getCode(), 200);

		return Requestify.get(kUrlStub + "/api/v1/legendaryquest/character/" + documentID + "?sessionkey=" + sessionKey);
	}).then(function(input){
		Test.DealTest(name + " get after delete", true, false);
		return false;
	}).fail(function(input){
		//console.log(name + " input:" + JSON.stringify(input));
		Test.DealTest(name + " get status after delete", input.getCode(), 404);

		return Requestify.delete(kUrlStub + "/api/v1/legendaryquest/character/" + documentID + "?sessionkey=" + sessionKey);
	}).then(function(input){
		Test.DealTest(name + " delete after delete", true, false);
		return false;
	}).fail(function(input){
		//console.log(name + " fail2");
		Test.DealTest(name + " delete status after delete", input.getCode(), 404);

		//console.log(name + " done");
		return true;
	}).fail(function(input){
		console.log(name + " fail3");
		throw input;
	}).then(function(input){
		//console.log(name + " done");
	});

}


const RunLegendaryQuestCharacter = function(){
	const name = "LegendaryQuestCharacter";
	//console.log(name + " start");
	var accountID;
	var sessionKey;

	return ClearDatabase().then(function(){
		return Requestify.post(kUrlStub + "/api/v1/accounts", { "type" : "user", "email" : "a@b", "name" : "f", "password" : "1234567890ABCDEF" });
	}).then(function(input){
		Test.DealTest(name + " post account status", input.getCode(), 201);

		var body = input.getBody();
		Test.DealProperty(name + " post accountID", body, "id");
		accountID = body["id"];
		Test.DealProperty(name + " post sessionKey", body, "sessionkey");
		sessionKey = body["sessionkey"];

		Test.DealTest(name + " post status", input.getCode(), 201);
		var url = kUrlStub + "/api/v1/legendaryquest/character?sessionkey=" + sessionKey;

		//console.log(name + " url:" + url);
		return Requestify.post(url, { "name" : "character00", "data" : { "experence_points" : 100, "name" : "fred", "race":"ork", "gender":"male", "handedness":"righthanded" } });
	}).then(function(input){
		Test.DealTest(name + " post document status", input.getCode(), 201);

		var body = input.getBody();
		documentID = body["id"];

		return Requestify.get(kUrlStub + "/api/v1/legendaryquest/character/" + documentID + "?sessionkey=" + sessionKey);
	}).then(function(input){
		Test.DealTest(name + " get status", input.getCode(), 200);

		var body = input.getBody();
		//console.log(name + " body:" + JSON.stringify(body));
		Test.DealTest(name + " applicationManager", Server.locals.applicationManager != null, true);

		var document = Server.locals.applicationManager.DocumentDataToDocument("legendaryquest", body["data"]);
		var spentPs = document.GetValue("spent_ps");
		//console.log(name + " spentPs:" + spentPs);
		Test.DealTest(name + " spentPs", spentPs != undefined, true);

		var level = document.GetValue("level");
		//console.log(name + " level:" + level);
		Test.DealTest(name + " level", level != undefined, true);


		var racialmaxpath = document.GetValue("racialmaxpath");
		//console.log(name + " racialmaxpath:" + racialmaxpath);
		Test.DealTest(name + " racialmaxpath", racialmaxpath != undefined, true);

		var racialmaxPs = document.GetValue("racialmax_ps");
		//console.log(name + " racialmax_ps:" + racialmaxPs);
		Test.DealTest(name + " racialmax_ps", racialmaxPs != undefined, true);

		var racialmax_st = document.GetValue("racialmax_st");
		//console.log(name + " racialmax_st:" + racialmax_st);
		Test.DealTest(name + " racialmax_st", racialmax_st != undefined, true);

		var racialmax_ag = document.GetValue("racialmax_ag");
		//console.log(name + " racialmax_ag:" + racialmax_ag);
		Test.DealTest(name + " racialmax_ag", racialmax_ag != undefined, true);

		var racialmax_md = document.GetValue("racialmax_md");
		//console.log(name + " racialmax_md:" + racialmax_md);
		Test.DealTest(name + " racialmax_md", racialmax_md != undefined, true);

		var racialmax_pc = document.GetValue("racialmax_pc");
		//console.log(name + " racialmax_pc:" + racialmax_pc);
		Test.DealTest(name + " racialmax_pc", racialmax_pc != undefined, true);

		var racialmax_wp = document.GetValue("racialmax_wp");
		//console.log(name + " racialmax_wp:" + racialmax_wp);
		Test.DealTest(name + " racialmax_wp", racialmax_wp != undefined, true);

		var racialmax_fa = document.GetValue("racialmax_fa");
		//console.log(name + " racialmax_fa:" + racialmax_fa);
		Test.DealTest(name + " racialmax_fa", racialmax_fa != undefined, true);

		var current_dt = document.GetValue("current_dt");
		//console.log(name + " current_dt:" + current_dt);
		Test.DealTest(name + " current_dt", current_dt != undefined, true);

	}).fail(function(input){
		console.log(name + " fail");
		throw input;
	}).then(function(input){
		//console.log(name + " done");
	});

}
