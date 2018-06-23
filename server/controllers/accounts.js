const app = require("./../server");
const Config = require("config");
const Encript = require("./../modules/encript");
const Express = require("express");
const Database = require("./../modules/database");
const Q = require("q");
const RestListResponse = require("./../modules/restlistresponse");
const Session = require("./../modules/session");
const SchemaDocuments = require("./../schema/documents");
const SchemaUsers = require("./../schema/users");
const SchemaGuests = require("./../schema/guests");
const Util = require("./../modules/util");

const router = Express.Router({ mergeParams: true });
module.exports = router;

router.all("*", Session.middleware);

const _isGuest = function(in_data){
	return ((in_data != null) && 
		("type" in in_data) &&
		(in_data["type"] === "guest"));
}

const _isUser = function(in_data){
	return ((in_data != null) && 
		("type" in in_data) &&
		(in_data["type"] === "user"));
}

const _cleanName = function(in_name){
	if (typeof in_name === "string" || in_name instanceof String){
		return in_name.trim();
	}
	return "";
}

const _validatePassword = function(in_password){
	if (typeof in_password === "string" || in_password instanceof String){
		return (14 < in_password.length);
	}
	return false;
}

const _validateEmail = function(in_email){
	//console.log("_validateEmail in_email:" + in_email); 

	if ((typeof in_email === "string" || in_email instanceof String) &&
		(/@/.test(in_email))){
		//console.log(" true"); 
		return true;
	}
	//console.log(" false"); 
	return false;
}

const _validateName = function(in_name){
	if (typeof in_name === "string" || in_password instanceof String){
		return (0 < in_name.length);
	}
	return false;
}

const _createGuestAccount = function(data, in_response, in_errorArray) {
	//console.log("_createGuestAccount:" + JSON.stringify(data));
	var document = {};
	document[SchemaGuests.sCreationTime] = new Date().valueOf();
	var accountID;
	return Database.insertDocument(SchemaGuests._sCollectionName, document).then(function(input){
		accountID = input;
		return _makeSessionKey(accountID);
	}).then(function(input){
		var sessionKey = input;
		return _finishNewAccountRequest(accountID, sessionKey, in_response);
	});
}

const _createUserAccount = function(data, in_response, in_errorArray) {
	var error = false;
	var email = data["email"];
	if (false === _validateEmail(email)){
		in_errorArray.push({ "message" : "invalid email"});
		error = true;
	}

	var name = _cleanName(data["name"]);
	if (false === _validateName(name)){
		in_errorArray.push({ "message" : "invalid name"});
		error = true;
	}

	var password = data["password"];
	if (false === _validatePassword(password)){
		in_errorArray.push({ "message" : "invalid password"});
		error = true;
	}

	if (true === error){
		return null;
	}

	var salt = Util.randomString(32, Util.sRandomStringChars);
	var document = {};
	document[SchemaUsers.sName] = name;
	document[SchemaUsers.sCreationTime] = new Date().valueOf();
	document[SchemaUsers.sEmail] = email;
	document[SchemaUsers.sSalt] = salt;
	document[SchemaUsers.sPasswordHash] = Encript.encodeStringBase64(salt + password, Config.userEncodePassword);
	var accountID;
	return Database.insertDocument(SchemaUsers._sCollectionName, document).then(function(input){
		accountID = input;
		return _makeSessionKey(accountID, in_response);
	}).then(function(input){
		var sessionKey = input;
		return _finishNewAccountRequest(accountID, sessionKey, in_response);
	});
}

const _makeSessionKey = function(in_accountID) {
	//console.log("_makeSessionKey in_accountID:" + in_accountID);
	var sessionKey = Session.sessionKeyFactory(in_accountID, new Date());
	return sessionKey;
}

const _finishNewAccountRequest = function(in_accountID, in_sessionKey, in_response) {
	//console.log("_finishNewAccountRequest in_accountID:" + in_accountID + " in_sessionKey:" + in_sessionKey);
	in_response.statusCode = 201;
	in_response.setHeader("Content-Type", "application/json");
	in_response.location("/accounts/" + in_accountID)
	Session.setSession(in_response, in_accountID); 
	var result = {
		"id" : in_accountID,
		"sessionkey" : in_sessionKey
	};
	in_response.json(result);
	in_response.end();
}



/*
	post /accounts
create a new account
expect data { "type" : "guest" }
or data { "type" : "user", "name" : "name", "email" : "xx@yy", "password" : "zzzz" }
return account ID and sessionkey
*/
router.post("/accounts", function(in_request, in_response, in_next) {
	try {
		_routerPostAccounts(in_request, in_response);
	} catch (error) {
		console.log("accounts post threw:" + error);
		in_response.status(500).send("server error");
		//nop
	}

	return;
});

const _routerPostAccounts = function(in_request, in_response){
	var data = in_request.body;
	//console.log("accounts post data:" + JSON.stringify(data));

	var errorArray = [];
	var promise = null;
	if (true === _isGuest(data)){
		promise = _createGuestAccount(data, in_response, errorArray);
	}
	else if (true === _isUser(data)){
		promise = _createUserAccount(data, in_response, errorArray);
	}
	
	if (promise == null) {
		Util.responseSendError(in_response, 400, "malformed syntax", errorArray);
		return;
	}

	promise.fail(function(error){
		console.log("accounts post fail:" + JSON.stringify(error));

		errorArray.push({"message" : error});
		Util.responseSendError(in_response, 500, "server error post accounts", errorArray);
	}).done(function(input){
		//nop
	});
}

/*
	get /accounts
	get /accounts?page=0&perpage=100
return the list of accounts
*/
router.get("/accounts", function(in_request, in_response, in_next) {
	try {
		_routerGetAccounts(in_request, in_response);
	} catch (error) {
		console.log("accounts get threw:" + error);
		in_response.status(500).send("server error");
	}
});

const _makeArrayData = function(in_arrayUsers, in_arrayGuests){
	var outputArray = [];
	for (var index = 0, total = in_arrayUsers.length; index < total; index++) {
		var document = in_arrayUsers[index];
		document["type"] = "user";
		outputArray.push(document);
	}

	for (var index = 0, total = in_arrayGuests.length; index < total; index++) {
		var document = in_arrayGuests[index];
		document["type"] = "guest";
		outputArray.push(document);
	}

	return outputArray;
}

const _routerGetAccounts = function(in_request, in_response){
	//console.log("accounts query:" + JSON.stringify(in_request.query) + " url:" + in_request.url + " originalUrl:" + in_request.originalUrl);
	var arrayGuests = [];
	var arrayUsers = [];
	Q(true).then(function(input){
		var filter = {"_id":1};
		filter[SchemaUsers.sName] = 1;
		return Database.getCollection(SchemaUsers._sCollectionName, undefined, filter);
	}).then(function(input){
		var filter = {"_id":1};
		arrayUsers = input;
		return Database.getCollection(SchemaGuests._sCollectionName, undefined, filter);
	}).then(function(input){
		arrayGuests = input;
		var allData = _makeArrayData(arrayUsers, arrayGuests);

		RestListResponse(in_request, in_response, allData);

		return true;
	}).fail(function(error){
		console.log("accounts get error:" + error);
		in_response.status(500).send("server error");
	}).done(function(input){
		//nop
	});
}

/*
	get /accounts/:ID 
get public data for account
	get /accounts/:ID?sessionkey=xxxxxxxxxxx
get data for account with the permissions of the given session key
*/
router.get("/accounts/:ID", function(in_request, in_response, in_next) {
	try {
		_routerGetAccountByID(in_request, in_request.params.ID, in_response);
	} catch (error) {
		console.log("accountByID get threw:" + error);
		in_response.status(500).send("server error");
	}
});

const _routerGetAccountByID = function(in_request, in_accountID, in_response) {
	var id = Database.stringToObjectID(in_accountID);
	Q(true).then(function(input){
		var userFilter = {};

		userFilter[SchemaUsers.sName] = 1;
		userFilter[SchemaUsers.sCreationTime] = 1;
		var owner = ((in_request.session != null) && (in_accountID === in_request.session.id));

		//console.log("owner:" + owner + " in_accountID:" + in_accountID + " in_request.session:" + JSON.stringify(in_request.session));

		if (true == owner){
			userFilter[SchemaUsers.sEmail] = 1;
			//userFilter[SchemaUsers.sValidated] = 1;
		}
		userFilter[SchemaUsers.sFileReference] = 1;
		userFilter[SchemaUsers.sID] = 0;
		return Database.getDocument(SchemaUsers._sCollectionName, id, userFilter);
	}).then(function(input){
		if (input != null){
			in_response.statusCode = 200;
			input["id"] = in_accountID;
			in_response.json(input);
			in_response.end();
			return true;
		}
		var guestFilter = {};
		guestFilter[SchemaGuests.sCreationTime] = 1;
		guestFilter[SchemaGuests.sID] = 0;
		return Database.getDocument(SchemaGuests._sCollectionName, id, guestFilter).then(function(input){
			if (input != null){
				in_response.statusCode = 200;
				input["id"] = in_accountID;
				in_response.json(input);
				in_response.end();
				return true;
			}

			in_response.statusCode = 404;
			in_response.json({"message" : "The item does not exist"});
			in_response.end();

			return true;
			});
	}).fail(function(error){
		console.log("accountByID get error:" + error + " in_accountID:" + in_accountID);
		in_response.status(500).send("server error");
	}).done(function(input){
		//nop
	});
	
}

/*
	put /accounts/:ID?sessionkey=xxxxxxxxxxx
edit account information (email? name?)
expect data { "name" : "new name", "email" : "new@email" }
*/
router.put("/accounts/:ID", function(in_request, in_response, in_next) {
	//console.log("router put /accounts/:ID:" + in_request.params.ID);
	try {
		_routerPatchAccountByID(in_request, in_request.params.ID, in_response);
	} catch (error) {
		console.log("accountByID patch threw:" + error);
		Util.responseSendError(in_response, 500, "server error", [error]);
	}
});

const _routerPatchAccountByID = function(in_request, in_accountID, in_response) {
	var owner = ((in_request.session != null) && (in_accountID === in_request.session.id));
	if (false == owner){
		Util.responseSendError(in_response, 403, "access is not allowed");
		//console.log("deleteDocument sent");
		return;
	}

	var data = in_request.body;
	if (data == null){
		Util.responseSendError(in_response, 400, "malformed syntax", ["no body"]);
		return;
	}

	var error = false;
	var errorArray = [];
	var email = data["email"];
	if ((email != undefined) && (false === _validateEmail(email))){
		errorArray.push({ "message" : "invalid email"});
		error = true;
		email = undefined;
	}

	var name = _cleanName(data["name"]);
	if ((name != "") && (false === _validateName(name))){
		errorArray.push({ "message" : "invalid name"});
		error = true;
		name = undefined;
	}
	if (name == ""){
		name = undefined;
	}

	if (error === true){
		Util.responseSendError(in_response, 400, "malformed syntax", errorArray);
		return;
	}

	if ((name == undefined) && (email == undefined)){
		in_response.statusCode = 204;
		in_response.end();
	}

	var id = Database.stringToObjectID(in_accountID);
	var patch = {};
	patch[SchemaUsers.sEmail] = email;
	patch[SchemaUsers.sName] = name;
	Database.updateDocument(SchemaUsers._sCollectionName, id, patch).then(function(input){
		//console.log("patchAccountByID updateDocument input:" + input);
		if (true == input){
			in_response.statusCode = 200;
			in_response.end();
		} else {
			Util.responseSendError(in_response, 400, "error on update", ["account not found or mail not unique"]);
		}
	}).fail(function(error){
		console.log("patchAccountByID get error:" + error + " in_accountID:" + in_accountID);
		in_response.status(500).send("server error");
	}).done(function(input){
		//console.log("patchAccountByID done input:" + input);
		//nop
	});

	return;
}

/*
	delete /accounts/:ID 
get public data for account
	get /accounts/:ID?sessionkey=xxxxxxxxxxx
get data for account with the permissions of the given session key
*/
router.delete("/accounts/:ID", function(in_request, in_response, in_next) {
	//console.log("router delete /accounts/:ID:" + in_request.params.ID);
	try {
		_routerDeleteAccountByID(in_request, in_request.params.ID, in_response);
	} catch (error) {
		console.log("accountByID delete threw:" + error);
		Util.responseSendError(in_response, 500, "server error", [error]);
	}
});

const _routerDeleteAccountByID = function(in_request, in_accountID, in_response) {
	var owner = ((in_request.session != null) && (in_accountID === in_request.session.id));
		//console.log("deleteDocument owner:" + owner);
	if (false == owner){
		Util.responseSendError(in_response, 403, "access is not allowed");
		//console.log("deleteDocument sent");
		return;
	}
	var id = Database.stringToObjectID(in_accountID);

	var arrayDocumentsOwnership = [];
	var arrayDocumentsWrite = [];
	var arrayDocumentsRead = [];

	var statusCode = 0;
	var responseJson = {"message" : "The item does not exist"};

	Database.getDocument(SchemaUsers._sCollectionName, id).then(function(input){

		//console.log("get account user id:" + id + " input:" + JSON.stringify(input));

		if (input != null){
			arrayDocumentsOwnership = input[SchemaUsers.sArrayOwnedDocument];
			arrayDocumentsWrite = input[SchemaUsers.sArrayWriteDocument];
			arrayDocumentsRead = input[SchemaUsers.sArrayReadDocument];
			return Database.deleteDocument(SchemaUsers._sCollectionName, id).then(function(input){
				in_response.statusCode = 200;
				Session.setSession(in_response, null);
				in_response.end();
			});
		} else {
			return Database.getDocument(SchemaGuests._sCollectionName, id).then(function(input){

				//console.log("get account guest id:" + id + " input:" + JSON.stringify(input));

				if (input != null){
					arrayDocumentsOwnership = input[SchemaGuests.sArrayOwnedDocument];
					arrayDocumentsWrite = input[SchemaGuests.sArrayWriteDocument];
					arrayDocumentsRead = input[SchemaGuests.sArrayReadDocument];
					return Database.deleteDocument(SchemaGuests._sCollectionName, id).then(function(input){
						in_response.statusCode = 200;
						Session.setSession(in_response, null);
						in_response.end();
					});
				}
				Util.responseSendError(in_response, 404, "The item does not exist")

				return true;
			});
		}
	}).then(function(input){
		var result = Q(true);

		//console.log("arrayDocumentsOwnership:" + arrayDocumentsOwnership + " arrayDocumentsWrite:" + arrayDocumentsWrite + " arrayDocumentsRead:" + arrayDocumentsRead);

		result = _RemoveAccountDocumentOwner(result, arrayDocumentsOwnership, id);
		result = _RemoveAccountDocument(result, arrayDocumentsWrite, id, SchemaDocuments.sWriteArray);
		result = _RemoveAccountDocument(result, arrayDocumentsRead, id, SchemaDocuments.sReadArray);

		return result;
	}).fail(function(error){
		console.log("deleteAccountByID get error:" + error + " in_accountID:" + in_accountID);
		//in_response.status(500).send("server error");
	}).done(function(input){
		//console.log("deleteAccountByID done input:" + input);
		//nop
	});
}

const _RemoveAccountDocumentOwner = function(result, arrayDocuments, accountID){
	if (arrayDocuments == undefined){
		return result;
	}
	var fields = {};
	fields[SchemaDocuments.sArrayOwnedDocument] = 1;
	fields[SchemaDocuments.sWriteArray] = 1;
	fields[SchemaDocuments.sReadArray] = 1;
	for (var index = 0, total = arrayDocuments.length; index < total; index++) {
		var documentID = arrayDocuments[index];
		result = result.then(function(input){
			return Database.getDocument(SchemaDocuments._sCollectionName, documentID, fields)			
		}).then(function(input){
			console.log(" documentID:" + documentID + "input:" + input + " " + JSON.stringify(input));
			if (input == null){
				return true;
			}
			var arrayData = input[SchemaDocuments.sArrayOwnedDocument];
			if (arrayData == null){
				return true;
			}
			var subIndex = arrayData.indexOf(accountID);
			if (subIndex == -1){
				return true;
			}
			arrayData.splice(subIndex, 1);

			if (arrayData.length !== 0){
				return Database.removeItemFromArray(SchemaDocuments._sCollectionName, documentID, SchemaDocuments.sArrayOwnedDocument, accountID);
			}

			//document has no more owners, so we will be deleting it, 
			//as each document is being deleted, it should remove iteself from users/ guests which are not the accountID
			return Document.PreDeleteDocument(input, documentID, accountID).then(function(input){
				return Database.deleteDocument(SchemaDocuments._sCollectionName, item);
			});
		});
	}
}

//we are deleteing an account, all the documents that the account had write or read access to, we have to remove reference
const _RemoveAccountDocument = function(result, arrayDocuments, accountID, documentArrayName){
	if (arrayDocuments == undefined){
		return result;
	}
	for (var index = 0, total = arrayDocuments.length; index < total; index++) {
		var documentID = arrayDocuments[index];
		result = result.then(function(input){
			return Database.removeItemFromArray(SchemaDocuments._sCollectionName, documentID, documentArrayName, accountID);
		});
	}
}


const _RemoveDocument = function(result, arrayDocuments, deleteOnEmptyArray, accountID, documentArrayName){
	if (arrayDocuments == undefined){
		return result;
	}
	var fields = {};
	fields[documentArrayName] = 1;
	fields[SchemaDocuments.sWriteArray] = 1;
	fields[SchemaDocuments.sReadArray] = 1;
	for (var index = 0, total = arrayDocuments.length; index < total; index++) {
		var documentID = arrayDocuments[index];
		result = result.then(function(input){
			return Database.getDocument(SchemaDocuments._sCollectionName, documentID, fields)			
		}).then(function(input){
			console.log(" documentID:" + documentID + "input:" + input + " " + JSON.stringify(input));
			if (input == null){
				return true;
			}
			var arrayData = input[documentArrayName];
			if (arrayData == null){
				return true;
			}
			var subIndex = arrayData.indexOf(accountID);
			if (subIndex == -1){
				return true;
			}
			arrayData.splice(subIndex, 1);

			if ((true === deleteOnEmptyArray) && (arrayData.length === 0)){
				//as each document is being deleted, it should remove iteself from users/ guests which are not the accountID
				return Document.PreDeleteDocument(item, accountID).then(function(input){
					return Database.deleteDocument(SchemaDocuments._sCollectionName, item);
				});
			}

			var patch = {};
			patch[documentArrayName] = arrayData;
			return Database.upsertDocument(SchemaDocuments._sCollectionName, item, patch);
		});
	}
}


/*
	get /accounts/:ID/files
return return public files for account
	get /accounts/:ID/files?sessionkey=xxxxxxxxxxx
return files for account with the permission of the given session key (test if owner)

fileArray [
	{ 
		"id", "parent", "name", "type", "created", "last_modified", 
	}
	]
*/
router.get("/accounts/:ID/files", function(in_request, in_response, in_next) {
	//console.log("router get /accounts/:ID:" + in_request.params.ID + "/files");
	try {
		_routerGetAccountFiles(in_request, in_request.params.ID, in_response);
	} catch (error) {
		console.log("accountFiles get threw:" + error);
		Util.responseSendError(in_response, 500, "server error", [error]);
	}
});

const _routerGetAccountFiles = function(in_request, in_accountID, in_response) {
	//console.log("_routerGetAccountFiles in_accountID:" + in_accountID);
	var id = Database.stringToObjectID(in_accountID);
	//get the fileref for account
	var arrayFiles = [];
	var sessionID = (in_request.session != null) ? in_request.session.id : null;

	var arrayOwnedDocument;
	var arrayWriteDocument;
	var arrayReadDocument;
	Q(true).then(function(input){
		var userFilter = {};
		userFilter[SchemaUsers.sArrayOwnedDocument] = 1;
		userFilter[SchemaUsers.sArrayWriteDocument] = 1;
		userFilter[SchemaUsers.sArrayReadDocument] = 1;
		return Database.getDocument(SchemaUsers._sCollectionName, id, userFilter);
	}).then(function(input){
		//console.log("user:" + JSON.stringify(input));
		if (input != null){
			arrayOwnedDocument = input[SchemaUsers.sArrayOwnedDocument];
			arrayWriteDocument = input[SchemaUsers.sArrayWriteDocument];
			arrayReadDocument = input[SchemaUsers.sArrayReadDocument];

			//console.log("arrayOwnedDocument:" + arrayOwnedDocument + " arrayWriteDocument:" + arrayWriteDocument + " arrayReadDocument:" + arrayReadDocument); 
		} else {
			var guestFilter = {};
			guestFilter[SchemaGuests.sArrayOwnedDocument] = 1;
			guestFilter[SchemaGuests.sArrayWriteDocument] = 1;
			guestFilter[SchemaGuests.sArrayReadDocument] = 1;
			return Database.getDocument(SchemaGuests._sCollectionName, id, guestFilter).then(function(input){
				//console.log("guest:" + JSON.stringify(input));
				if (input != null){
					arrayOwnedDocument = input[SchemaGuests.sArrayOwnedDocument];
					arrayWriteDocument = input[SchemaGuests.sArrayWriteDocument];
					arrayReadDocument = input[SchemaGuests.sArrayReadDocument];
					//console.log("arrayOwnedDocument:" + arrayOwnedDocument + " arrayWriteDocument:" + arrayWriteDocument + " arrayReadDocument:" + arrayReadDocument); 
				}
				return;
			});
		}
		return;
	}).then(function(){
		var arrayFiles = [];
		var result = Q(arrayFiles);
	
		//console.log("arrayOwnedDocument:" + arrayOwnedDocument + " arrayWriteDocument:" + arrayWriteDocument + " arrayReadDocument:" + arrayReadDocument); 

		result = _getDocuments(result, arrayFiles, arrayOwnedDocument, sessionID, "owned");
		result = _getDocuments(result, arrayFiles, arrayWriteDocument, sessionID, "write");
		result = _getDocuments(result, arrayFiles, arrayReadDocument, sessionID, "read");
		return result;
	}).then(function(arrayFiles){
		RestListResponse(in_request, in_response, arrayFiles);

	}).fail(function(error){
		console.log("accountFiles get error:" + error + " in_accountID:" + in_accountID);
		in_response.status(500).send("server error");
	}).done(function(){
		//console.log("accountFiles get done input:" + input);
		//nop
	});
	return;
}

const _addFileToArrayFiles = function(in_arrayFiles, in_id, in_parent, in_name, in_type, in_created, in_lastModified){
	in_arrayFiles.push({
			"id" : in_id,
			"parent" : in_parent,
			"name" : in_name,
			"type" : in_type,
			"created" : in_created,
			"last_modified" : in_lastModified
		});
}

const _databaseObjectIDInArray = function(in_array, in_id){
	for (var index = 0, total = in_array.length; index < total; index++) {
		var item = in_array[index];
		if (in_id == item){
			return true;
		}
	}
	return false;
}

const _documentCanRead = function(in_databaseDocument, in_sessionID){
	if ((in_databaseDocument[SchemaDocuments.sPublicRead] === true) ||
		(in_databaseDocument[SchemaDocuments.sPublicWrite] === true)){
		return true;
	}
	var id = Database.stringToObjectID(in_sessionID);
	if ((true === _databaseObjectIDInArray(in_databaseDocument[SchemaDocuments.sOwnerArray], in_sessionID)) ||
		(true === _databaseObjectIDInArray(in_databaseDocument[SchemaDocuments.sWriteArray], in_sessionID)) ||
		(true === _databaseObjectIDInArray(in_databaseDocument[SchemaDocuments.sReadArray], in_sessionID))){
		return true;
		}
	return false;
}

const _documentCanWrite = function(in_databaseDocument, in_owner, in_sessionID){
	if ((in_owner === true) ||
		(in_databaseDocument[SchemaDocuments.sPublicWrite] === true)){
		return true;
	}
	var id = Database.stringToObjectID(in_sessionID);
	if ((true === _databaseObjectIDInArray(in_databaseDocument[SchemaDocuments.sOwnerArray], in_sessionID)) ||
		(true === _databaseObjectIDInArray(in_databaseDocument[SchemaDocuments.sWriteArray], in_sessionID))){
		return true;
		}
	return false;
}

//result = _getDocuments(result, arrayFiles, arrayReadDocument, sessionID, "read");

const _getDocuments = function(result, in_arrayFiles, in_arrayItems, in_sessionID, in_type){
	if (in_arrayItems == undefined){
		return result;
	}

	var fields = {};
	fields[SchemaDocuments.sID] = 0;
	fields[SchemaDocuments.sName] = 1;
	fields[SchemaDocuments.sApplication] = 1;
	fields[SchemaDocuments.sCreationTime] = 1;
	fields[SchemaDocuments.sLastModifyTime] = 1;
	fields[SchemaDocuments.sParent] = 1;
	fields[SchemaDocuments.sOwnerArray] = 1;
	fields[SchemaDocuments.sWriteArray] = 1;
	fields[SchemaDocuments.sReadArray] = 1;
	fields[SchemaDocuments.sPublicWrite] = 1;
	fields[SchemaDocuments.sPublicRead] = 1;

	for (var index = 0, total = in_arrayItems.length; index < total; index++) {
		var item = in_arrayItems[index];
		result = result.then(function(input){
			return Database.getDocument(SchemaDocuments._sCollectionName, item, fields);
		}).then(function(input){

			if (true !== _documentCanRead(input, in_sessionID)){
				return in_arrayFiles;
			}

			var id = item.valueOf();
			var parent = undefined;
			if (input[SchemaDocuments.sParent] != undefined){
				parent = input[SchemaDocuments.sParent].valueOf();
			}

			_addFileToArrayFiles(in_arrayFiles, id, parent, input[SchemaDocuments.sName], in_type, input[SchemaDocuments.sCreationTime], input[SchemaDocuments.sLastModifyTime]);

			return in_arrayFiles;
		});
	}
	return result;
}

/*
	post /accounts/:ID/registerguest?sessionkey=xxxxxxxxxxx
create a new account
or data { "name" : "name", "email" : "xx@yy", "password" : "zzzz" }

promote a guest account to a user account
*/
