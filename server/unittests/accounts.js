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
	promiseFactoryArray.push(RunGetAccountsEmpty);
	promiseFactoryArray.push(RunGetAccounts);
	promiseFactoryArray.push(RunGetAccountsMany);
	promiseFactoryArray.push(RunGetAccountsPagination);
	promiseFactoryArray.push(RunGetAccountsUser);
	promiseFactoryArray.push(RunGetAccountsGuest);
	promiseFactoryArray.push(RunPostAccountNoType);
	promiseFactoryArray.push(RunPostAccountUser);
	promiseFactoryArray.push(RunPostAccountUserBadEmail);
	promiseFactoryArray.push(RunPostAccountUserBadName);
	promiseFactoryArray.push(RunPostAccountUserBadPassword);
	promiseFactoryArray.push(RunDeleteAccountUser);
	promiseFactoryArray.push(RunDeleteAccountGuest);
	promiseFactoryArray.push(RunDeleteAccountWithoutSession);
	promiseFactoryArray.push(RunGetAccountFiles);
	promiseFactoryArray.push(RunPatchAccount);
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

const RunGetAccountsEmpty = function(){
	const name = "get accounts empty";
	return ClearDatabase().then(function(){
		return Requestify.get(kUrlStub + "/api/v1/accounts");
	}).then(function(input){
		Test.DealTest(name + " status", input.getCode(), 200);
		Test.DealTest(name + " record count", input.getBody().records.length, 0);
		//console.log(name + " done");
		return true;
	});
}

const RunGetAccounts = function(){
	const name = "get accounts";
	return ClearDatabase().then(function(){
		return Requestify.post(kUrlStub + "/api/v1/accounts", { "type" : "guest" });
	}).then(function(input){
		Test.DealTest(name + " post status", input.getCode(), 201);
		return Requestify.get(kUrlStub + "/api/v1/accounts");
	}).then(function(input){
		Test.DealTest(name + " status", input.getCode(), 200);
		Test.DealTest(name + " record count", input.getBody().records.length, 1);
		//console.log(name + " done");
		return true;
	});
}

const RunGetAccountsMany = function(){
	const name = "get accounts many";
	return ClearDatabase().then(function(){
		return Requestify.post(kUrlStub + "/api/v1/accounts", { "type" : "guest" });
	}).then(function(input){
		Test.DealTest(name + " post status", input.getCode(), 201);
		return Requestify.post(kUrlStub + "/api/v1/accounts", { "type" : "guest" });
	}).then(function(input){
		Test.DealTest(name + " post status", input.getCode(), 201);
		return Requestify.post(kUrlStub + "/api/v1/accounts", { "type" : "user", "email" : "a@b", "name" : "f", "password" : "1234567890ABCDEF" });
	}).then(function(input){
		Test.DealTest(name + " post status", input.getCode(), 201);
		return Requestify.get(kUrlStub + "/api/v1/accounts");
	}).then(function(input){
		Test.DealTest(name + " status", input.getCode(), 200);
		Test.DealTest(name + " record count", input.getBody().records.length, 3);
		//console.log(name + " done");
		return true;
	});
}

const RunGetAccountsPagination = function(){
	const name = "get accounts pagination";
	return ClearDatabase().then(function(){
		return Requestify.post(kUrlStub + "/api/v1/accounts", { "type" : "guest" });
	}).then(function(input){
		Test.DealTest(name + " post status", input.getCode(), 201);
		return Requestify.post(kUrlStub + "/api/v1/accounts", { "type" : "guest" });
	}).then(function(input){
		Test.DealTest(name + " post status", input.getCode(), 201);
		return Requestify.post(kUrlStub + "/api/v1/accounts", { "type" : "guest" });
	}).then(function(input){
		Test.DealTest(name + " post status", input.getCode(), 201);
		return Requestify.post(kUrlStub + "/api/v1/accounts", { "type" : "guest" });
	}).then(function(input){
		Test.DealTest(name + " post status", input.getCode(), 201);
		return Requestify.post(kUrlStub + "/api/v1/accounts", { "type" : "guest" });
	}).then(function(input){
		Test.DealTest(name + " post status", input.getCode(), 201);
		return Requestify.get(kUrlStub + "/api/v1/accounts?page=0&perpage=2");
	}).then(function(input){
		Test.DealTest(name + " status", input.getCode(), 200);
		var body = input.getBody();
		//console.log(JSON.stringify(body));

		Test.DealTest(name + " per page", body.metadata.per_page, 2);
		Test.DealTest(name + " total count", body.metadata.total_count, 5);
		Test.DealTest(name + " record count", body.records.length, 2);

		//console.log(name + " done");
		return true;
	});
}

const RunGetAccountsUser = function(){
	const name = "get accounts user";
	var accountID;
	var sessionKey;
	return ClearDatabase().then(function(){
		return Requestify.post(kUrlStub + "/api/v1/accounts", { "type" : "user", "email" : "a@b", "name" : "f", "password" : "1234567890ABCDEF" });
	}).then(function(input){
		Test.DealTest(name + " post status", input.getCode(), 201);
		var body = input.getBody();
		Test.DealProperty(name + " post accountID", body, "id");
		accountID = body["id"];
		Test.DealProperty(name + " post sessionKey", body, "sessionkey");
		sessionKey = body["sessionkey"];

		//console.log("accountID:" + accountID);
		//console.log("sessionkey:" + sessionKey);

		return Requestify.get(kUrlStub + "/api/v1/accounts/" + accountID + "?sessionkey=" + sessionKey);
	}).then(function(input){
		Test.DealTest(name + " status", input.getCode(), 200);
		var body = input.getBody();
		//console.log(body);
		Test.DealPropertyNot(name + " property _id", body, "_id");
		Test.DealProperty(name + " property id", body, "id");
		Test.DealTest(name + " id", body.id, accountID);
		Test.DealProperty(name + " property email", body, "email");
		Test.DealTest(name + " email", body.email, "a@b");
		Test.DealProperty(name + " property name", body, "name");
		Test.DealTest(name + " name", body.name, "f");

		return Requestify.get(kUrlStub + "/api/v1/accounts/" + accountID);
	}).then(function(input){
		Test.DealTest(name + " status", input.getCode(), 200);
		var body = input.getBody();
		//console.log(body);
		Test.DealPropertyNot(name + " property _id", body, "_id");
		Test.DealProperty(name + " property id", body, "id");
		Test.DealTest(name + " id", body.id, accountID);
		Test.DealPropertyNot(name + " property email", body, "email");
		Test.DealProperty(name + " property name", body, "name");
		Test.DealTest(name + " name", body.name, "f");
		//console.log(name + " done");
		return true;
	});
}

const RunGetAccountsGuest = function(){
	const name = "get accounts guest";
	var accountID;
	var sessionKey;
	return ClearDatabase().then(function(){
		return Requestify.post(kUrlStub + "/api/v1/accounts", { "type" : "guest" });
	}).then(function(input){
		Test.DealTest(name + " post status", input.getCode(), 201);
		var body = input.getBody();
		Test.DealProperty(name + " post accountID", body, "id");
		accountID = body["id"];
		Test.DealProperty(name + " post sessionKey", body, "sessionkey");
		sessionKey = body["sessionkey"];

		//console.log("accountID:" + accountID);
		//console.log("sessionkey:" + sessionKey);

		return Requestify.get(kUrlStub + "/api/v1/accounts/" + accountID + "?sessionkey=" + sessionKey);
	}).then(function(input){
		Test.DealTest(name + " status", input.getCode(), 200);
		var body = input.getBody();
		//console.log(body);
		Test.DealPropertyNot(name + " property _id", body, "_id");
		Test.DealProperty(name + " property id", body, "id");
		Test.DealTest(name + " id", body.id, accountID);
		Test.DealPropertyNot(name + " property email", body, "email");
		Test.DealPropertyNot(name + " property name", body, "name");

		return Requestify.get(kUrlStub + "/api/v1/accounts/" + accountID);
	}).then(function(input){
		Test.DealTest(name + " status", input.getCode(), 200);
		var body = input.getBody();
		//console.log(body);
		Test.DealPropertyNot(name + " property _id", body, "_id");
		Test.DealProperty(name + " property id", body, "id");
		Test.DealTest(name + " id", body.id, accountID);
		Test.DealPropertyNot(name + " property email", body, "email");
		Test.DealPropertyNot(name + " property name", body, "name");
		//console.log(name + " done");
		return true;
	});
}


const RunPostAccountNoType = function(){
	const name = "post account no type";
	return ClearDatabase().then(function(){
		return Requestify.post(kUrlStub + "/api/v1/accounts", {});
	}).then(function(input){
		Test.DealTestFail(name + " post status input:" + input.getCode());
		return false;
	}, function(input){
		//console.log("fail input:" + input);
		Test.DealTest(name + " status", input.getCode(), 400);
		//console.log(name + " done");
		return true;
	});
}

const RunPostAccountUser = function(){
	const name = "post account";
	return ClearDatabase().then(function(){
		return Requestify.post(kUrlStub + "/api/v1/accounts", { "type" : "user", "email" : "a@b", "name" : "f", "password" : "1234567890ABCDEF" });
	}).then(function(input){
		Test.DealTest(name + " post status", input.getCode(), 201);
		var body = input.getBody();
		Test.DealProperty(name + " post accountID", body, "id");
		Test.DealProperty(name + " post sessionKey", body, "sessionkey");
		//console.log(name + " done");
		return true;
	});
}

const RunPostAccountUserBadEmail = function(){
	const name = "post account bad email";
	return ClearDatabase().then(function(){
		return Requestify.post(kUrlStub + "/api/v1/accounts", { "type" : "user", "email" : "a", "name" : "f", "password" : "1234567890ABCDEF" });
	}).then(function(input){
		Test.DealTestFail(name + " post status input:" + input.getCode());
		return false;
	}, function(input){
		Test.DealTest(name + " post status", input.getCode(), 400);
		//console.log(name + " done");
		return true;
	});
}

const RunPostAccountUserBadName = function(){
	const name = "post account bad name";
	return ClearDatabase().then(function(){
		return Requestify.post(kUrlStub + "/api/v1/accounts", { "type" : "user", "email" : "a@b", "name" : "", "password" : "1234567890ABCDEF" });
	}).then(function(input){
		Test.DealTestFail(name + " post status input:" + input.getCode());
		return false;
	}, function(input){
		Test.DealTest(name + " post status", input.getCode(), 400);
		//console.log(name + " done");
		return true;
	});
}

const RunPostAccountUserBadPassword = function(){
	const name = "post account bad password";
	return ClearDatabase().then(function(){
		return Requestify.post(kUrlStub + "/api/v1/accounts", { "type" : "user", "email" : "a@b", "name" : "f", "password" : "1234" });
	}).then(function(input){
		Test.DealTestFail(name + " post status input:" + input.getCode());
		return false;
	}, function(input){
		Test.DealTest(name + " post status", input.getCode(), 400);
		//console.log(name + " done");
		return true;
	});
}

const RunDeleteAccountUser = function(){
	const name = "delete account user";
	var accountID;
	var sessionKey;
	return ClearDatabase().then(function(){
		return Requestify.post(kUrlStub + "/api/v1/accounts", { "type" : "user", "email" : "a@b", "name" : "f", "password" : "1234567890ABCDEF" });
	}).then(function(input){
		Test.DealTest(name + " post status", input.getCode(), 201);
		var body = input.getBody();
		Test.DealProperty(name + " post accountID", body, "id");
		accountID = body["id"];
		Test.DealProperty(name + " post sessionKey", body, "sessionkey");
		sessionKey = body["sessionkey"];

		return Requestify.delete(kUrlStub + "/api/v1/accounts/" + accountID + "?sessionkey=" + sessionKey);
	}).then(function(input){
		Test.DealTest(name + " status", input.getCode(), 200);

		//console.log(name + " done");
		return true;
	});
}

const RunDeleteAccountGuest = function(){
	const name = "delete account guest";
	var accountID;
	var sessionKey;
	return ClearDatabase().then(function(){
		return Requestify.post(kUrlStub + "/api/v1/accounts", { "type" : "guest" });
	}).then(function(input){
		Test.DealTest(name + " post status", input.getCode(), 201);
		var body = input.getBody();
		Test.DealProperty(name + " post accountID", body, "id");
		accountID = body["id"];
		Test.DealProperty(name + " post sessionKey", body, "sessionkey");
		sessionKey = body["sessionkey"];

		return Requestify.delete(kUrlStub + "/api/v1/accounts/" + accountID + "?sessionkey=" + sessionKey);
	}).then(function(input){
		Test.DealTest(name + " status", input.getCode(), 200);

		//console.log(name + " done");
		return true;
	});
}

const RunDeleteAccountWithoutSession = function(){
	const name = "delete account guest";
	var accountID;
	var sessionKey;
	return ClearDatabase().then(function(){
		return Requestify.post(kUrlStub + "/api/v1/accounts", { "type" : "guest" });
	}).then(function(input){
		Test.DealTest(name + " post status", input.getCode(), 201);
		var body = input.getBody();
		Test.DealProperty(name + " post accountID", body, "id");
		accountID = body["id"];
		Test.DealProperty(name + " post sessionKey", body, "sessionkey");
		sessionKey = body["sessionkey"];

		//console.log("delete guest account without session key " + kUrlStub + "/api/v1/accounts/" + accountID);

		return Requestify.delete(kUrlStub + "/api/v1/accounts/" + accountID);
	}).then(function(input){
		Test.DealTestFail(name + " post status input:" + input.getCode());
		return false;
	}, function(input){
		Test.DealTest(name + " status", input.getCode(), 403);

		//console.log("delete guest account with session key " + kUrlStub + "/api/v1/accounts/" + accountID + "?sessionkey=" + sessionKey);

		return Requestify.delete(kUrlStub + "/api/v1/accounts/" + accountID + "?sessionkey=" + sessionKey);
	}).then(function(input){
		Test.DealTest(name + " status", input.getCode(), 200);

		//console.log("delete guest account with session key again " + kUrlStub + "/api/v1/accounts/" + accountID + "?sessionkey=" + sessionKey);

		return Requestify.delete(kUrlStub + "/api/v1/accounts/" + accountID + "?sessionkey=" + sessionKey);
	}).then(function(input){
		Test.DealTestFail(name + " post status input:" + input.getCode());
		return false;
	}, function(input){
		Test.DealTest(name + " status", input.getCode(), 404);

		//console.log("delete guest account without session key again " + kUrlStub + "/api/v1/accounts/" + accountID);

		return Requestify.delete(kUrlStub + "/api/v1/accounts/" + accountID);
	}).then(function(input){
		Test.DealTestFail(name + " post status input:" + input.getCode());
		return false;
	}, function(input){
		Test.DealTest(name + " status", input.getCode(), 403);

		//console.log(name + " done");
		return true;
	});
}

const RunGetAccountFiles = function(){
	const name = "get account files";

	var accountID;
	var sessionKey;
	var accountID2;
	var sessionKey2;

	return ClearDatabase().then(function(){
		//make guest account 1
		return Requestify.post(kUrlStub + "/api/v1/accounts", { "type" : "guest" });
	}).then(function(input){
		Test.DealTest(name + " post status", input.getCode(), 201);
		var body = input.getBody();
		Test.DealProperty(name + " post accountID", body, "id");
		accountID = body["id"];
		Test.DealProperty(name + " post sessionKey", body, "sessionkey");
		sessionKey = body["sessionkey"];

		// add file to account 2
		return Requestify.post(kUrlStub + "/api/v1/folder?sessionkey=" + sessionKey, { "name" : "folder01" });
	}).then(function(input){

		//make guest account 2
		return Requestify.post(kUrlStub + "/api/v1/accounts", { "type" : "guest" });
	}).then(function(input){
		Test.DealTest(name + " post status", input.getCode(), 201);
		var body = input.getBody();
		Test.DealProperty(name + " post accountID", body, "id");
		accountID2 = body["id"];
		Test.DealProperty(name + " post sessionKey", body, "sessionkey");
		sessionKey2 = body["sessionkey"];

		// add file to account 2
		return Requestify.post(kUrlStub + "/api/v1/folder?sessionkey=" + sessionKey2, { "name" : "folder02" });
	}).then(function(input){

		//try to see the files of account2 with the session key of account1
		return Requestify.get(kUrlStub + "/api/v1/accounts/" + accountID2 + "/files?sessionkey=" + sessionKey);
	}).then(function(input){
		Test.DealTest(name + " status", input.getCode(), 200);

		var body = input.getBody();
		Test.DealProperty(name + " get no records", body, "records");
		Test.DealTest(name + " get no records length", body.records.length, 0);

		return Requestify.get(kUrlStub + "/api/v1/accounts/" + accountID + "/files?sessionkey=" + sessionKey);
	}).then(function(input){
		Test.DealTest(name + " status", input.getCode(), 200);

		var body = input.getBody();
		Test.DealProperty(name + " get records", body, "records");
		Test.DealTest(name + " get records length", 0 < body.records.length, true);

		//console.log(name + " done");
		return true;
	});
}

const RunPatchAccount = function(){
	const name = "put account";
	var accountID;
	var sessionKey;
	return ClearDatabase().then(function(){
		return Requestify.post(kUrlStub + "/api/v1/accounts", { "type" : "user", "email" : "a@b", "name" : "f", "password" : "1234567890ABCDEF" });
	}).then(function(input){
		Test.DealTest(name + " post status", input.getCode(), 201);
		var body = input.getBody();
		Test.DealProperty(name + " post accountID", body, "id");
		accountID = body["id"];
		Test.DealProperty(name + " post sessionKey", body, "sessionkey");
		sessionKey = body["sessionkey"];

		return Requestify.put(kUrlStub + "/api/v1/accounts/" + accountID + "?sessionkey=" + sessionKey, { "email" : "foo@bar", "name" : "hello" });
	}).then(function(input){
		Test.DealTest(name + " put status", input.getCode(), 200);
		//var body = input.getBody();
		//console.log(body);

		return Requestify.get(kUrlStub + "/api/v1/accounts/" + accountID + "?sessionkey=" + sessionKey);
	}).then(function(input){
		Test.DealTest(name + " get status", input.getCode(), 200);
		var body = input.getBody();
		//console.log(body);
		Test.DealPropertyNot(name + " property _id", body, "_id");
		Test.DealProperty(name + " property id", body, "id");
		Test.DealTest(name + " id", body.id, accountID);
		Test.DealProperty(name + " property email", body, "email");
		Test.DealTest(name + " email", body.email, "foo@bar");
		Test.DealProperty(name + " property name", body, "name");
		Test.DealTest(name + " name", body.name, "hello");

		return true;
	});
}

RunPatchAccount
