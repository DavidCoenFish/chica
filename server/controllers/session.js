const Config = require("config");
const Encript = require("./../modules/encript");
const Express = require("express");
const Q = require("q");
const Session = require("./../modules/session");
const Database = require("./../modules/database");
const SchemaUsers = require("./../schema/users");
const SchemaGuests = require("./../schema/guests");
const Util = require("./../modules/util");

const router = Express.Router({ mergeParams: true });
router.all("*", Session.middleware);

/*
	get /session
	get /session&sessionkey=XXXX
if session valid, return { "id":xxx }, 
if not valid, return 404
*/
router.get("/session", function(in_request, in_response, in_next) {
	try {
		_routerGetSession(in_request, in_response);
	} catch (error) {
		console.log("session get threw:" + error);
		Util.responseSendError(in_response, 500, "server error", [error]);
	}
	//console.log("polo");
});

const _routerGetSession = function(in_request, in_response){
	//console.log("_routerGetSession in_request.session:" + JSON.stringify(in_request.session));
	if (undefined == in_request.session){
		Util.responseSendError(in_response, 404, "no session");
		return;
	}
	in_response.statusCode = 200;
	in_response.setHeader("Content-Type", "application/json");
	in_response.json({"id": in_request.session.id});
	in_response.end();
	return;
}

/*
	post /session
if session created, return 201
if password incorrect, account expired 403/ not found return 400
*/
router.post("/session", function(in_request, in_response, in_next) {
	try {
		_routerPostSession(in_request, in_response);
	} catch (error) {
		console.log("session post threw:" + error);
		Util.responseSendError(in_response, 500, "server error", [error]);
	}
});

const _routerPostSession = function(in_request, in_response){
	var data = in_request.body;
	var accountID = null;
	if ((data != null) &&
		("id" in data)){
		accountID = data["id"];
	}

	if (accountID == null){
		Util.responseSendError(in_response, 400, "malformed syntax");
		return;
	}

	//console.log("id:" + accountID);
	var id = Database.stringToObjectID(accountID);

	//is user account?
	//is guest account?
	Database.getDocument(SchemaUsers._sCollectionName, id).then(function(input){
		if (input != null){
			//console.log("user input:" + JSON.stringify(input));
			_routerPostSessionUser(in_response, data, input, accountID);
			return;
		}
		return Database.getDocument(SchemaGuests._sCollectionName, id).then(function(input){
			if (input != null){
				//console.log("guest input:" + JSON.stringify(input));
				_routerPostSessionGuest(in_response, input, accountID);
				return;
			}

			Util.responseSendError(in_response, 404, "account doen not exist");
			return;
		});
	}).fail(function(error){
		console.log("session post error:" + error);
		Util.responseSendError(in_response, 500, "server error", [error]);
	}).done(function(input){
		//nop
	});

	return;
}

const _routerPostSessionUser = function(in_response, in_data, in_userDocument, in_accountID){
	var salt = in_userDocument[SchemaUsers.sSalt];
	var password = in_data["password"];
	var passwordHash = in_userDocument[SchemaUsers.sPasswordHash];
	var inputPasswordHash = Encript.encodeStringBase64(salt + password, Config.userEncodePassword);
	if (inputPasswordHash === passwordHash){
		_returnSession(in_response, in_accountID, new Date());
		return;
	}

	Util.responseSendError(in_response, 401, "password incorrect");
	return;
}

const _routerPostSessionGuest = function(in_response, in_guestDocument, in_accountID){
	//check data
	var now = new Date();
	var creationDateValue = in_guestDocument[SchemaGuests.sCreationTime];
	//console.log(now.valueOf());
	//console.log(creationDateValue + Config.guestAccountLifespan);
	if (now.valueOf() < creationDateValue + Config.guestAccountLifespan){
		//console.log("guest return:" + JSON.stringify(in_guestDocument));
		_returnSession(in_response, in_accountID, now);
		return;
	}

	Util.responseSendError(in_response, 403, "guest account expired");
	return;
}

const _returnSession = function(in_response, in_accountID, in_date){
	var sessionKey = Session.sessionKeyFactory(in_accountID, in_date);
	in_response.statusCode = 201;
	in_response.setHeader("Content-Type", "application/json");
	in_response.location("/accounts/" + in_accountID)
	Session.setSession(in_response, in_accountID); 
	var result = {
		"id" : in_accountID,
		"sessionkey" : sessionKey
	};
	in_response.json(result);
	in_response.end();
	return;
}

/*
	delete /session
if session valid, return 204, 
if not valid, return 404
*/
router.delete("/session", function(in_request, in_response, in_next) {
	//console.log("router delete /session");
	try {
		_routerDeleteSession(in_request, in_response);
	} catch (error) {
		console.log("session delete threw:" + error);
		Util.responseSendError(in_response, 500, "server error", [error]);
	}
	//console.log("router delete /session end");
});

const _routerDeleteSession = function(in_request, in_response){
	if (undefined == in_request.session){
		Util.responseSendError(in_response, 404, "no session");
		return;
	}
	in_response.statusCode = 204;
	Session.setSession(in_response, null);
	in_response.end();
}

module.exports = router;