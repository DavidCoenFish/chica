const app = require("./../server");
const Config = require("config");
const Express = require("express");
const Database = require("./../modules/database");
const Q = require("q");
const RestListResponse = require("./../modules/restlistresponse");
const Session = require("./../modules/session");
const SchemaDocuments = require("./../schema/documents");
const SchemaUsers = require("./../schema/users");
const SchemaGuests = require("./../schema/guests");

const Util = require("./../modules/util");

const _cleanName = function(in_name){
	if (typeof in_name === "string" || in_name instanceof String){
		return in_name.trim();
	}
	return "";
}

const _postEndpoint = function(in_request, in_response, in_applicationName, in_documentType, in_endpointRoot){
	//console.log("_postEndpoint in_applicationName:" + in_applicationName + " in_documentType:" + in_documentType + " in_endpointRoot:" + in_endpointRoot);
	try {
		_postEndpointInternal(in_request, in_response, in_applicationName, in_documentType, in_endpointRoot);
	} catch (error) {
		console.log(in_applicationName + " " + in_documentType + " post threw:" + error);
		in_response.status(500).send("server error");
		//nop
	}
	return;
}

const _databaseObjectIDInArray = function(in_array, in_id){
	var idString = JSON.stringify(in_id);
	for (var index = 0, total = in_array.length; index < total; index++) {
		var item = JSON.stringify(in_array[index]);
		if (idString == item){
			return true;
		}
	}
	return false;
}

const _checkDocumentIsFolder = function(in_databaseDocument, in_accountID){
	var applicationName = in_databaseDocument[SchemaDocuments.sApplication];
	if ((applicationName != "folder") && (applicationName != "systemfolder")){
		return false;
	}
	var arrayOwners = in_databaseDocument[SchemaDocuments.sOwnerArray];
	//console.log("_checkDocumentIsFolder arrayOwners:" + JSON.stringify(arrayOwners) + " in_accountID:" + in_accountID);
	if (true !== _databaseObjectIDInArray(arrayOwners, in_accountID)){
		return false;
	}

	return true;
}

const _postEndpointInternal = function(in_request, in_response, in_applicationName, in_documentType, in_endpointRoot){
	//session id is user owner
	if (in_request.session == null){
		Util.responseSendError(in_response, 403, "access is not allowed");
		return;
	}
	var id = Database.stringToObjectID(in_request.session.id);

	var data = in_request.body;
	//console.log("restapplicationwrapper post data:" + JSON.stringify(data));

	if (data == null){
		Util.responseSendError(in_response, 400, "malformed syntax", ["no body"]);
		return;
	}

	// document name to create [required]
	var cleanName = _cleanName(data.name);
	if (cleanName == ""){
		Util.responseSendError(in_response, 400, "malformed syntax", ["blank name"]);
		return;
	}

	// parent document to make child under [optional]
	var parent = undefined;
	if ("parent" in data){
		parent = Database.stringToObjectID(data.parent);
	}

	var requestDocumentData = {};
	if ("data" in data){
		requestDocumentData = data["data"];
	}
	requestDocumentData["type"] = in_documentType;

	//does account exist
	var accountFound = false;
	var isUser = false;
	var createdDatabaseDocument = undefined;
	Q(true).then(function(input){
		var userFilter = {};
		userFilter[SchemaUsers.sID] = 1;
		return Database.getDocument(SchemaUsers._sCollectionName, id, userFilter);
	}).then(function(input){
		if (input != null){
			accountFound = true;
			isUser = true;
			return true;
		} else {
			var guestFilter = {};
			guestFilter[SchemaGuests.sID] = 1;
			return Database.getDocument(SchemaGuests._sCollectionName, id, guestFilter).then(function(input){
				if (input != null){
					accountFound = true;
				}
				return true;
			});
		}
	}).then(function(input){
		if (accountFound != true){
			Util.responseSendError(in_response, 404, "account not found");
			return Q.reject(null);
		}

		//create document
		var document = {};
		document[SchemaDocuments.sName] = cleanName;
		document[SchemaDocuments.sApplication] = in_applicationName;

		//document[SchemaDocuments.sParent] = parentDatabaseDocument._id;
		var date = new Date();
		document[SchemaDocuments.sCreationTime] = date.valueOf();
		document[SchemaDocuments.sLastModifyTime] = date.valueOf();
		document[SchemaDocuments.sWriteLock] = 0;

		//documentData = app.locals.applicationManager.NewDocumentData(in_applicationName, in_documentType);

		var dataDocument = app.locals.applicationManager.DocumentDataToDocument(in_applicationName, requestDocumentData);
		var documentData = app.locals.applicationManager.DocumentToDocumentData(in_applicationName, dataDocument);

		//console.log(" documentData:" + JSON.stringify(documentData));
		document[SchemaDocuments.sData] = documentData;

		document[SchemaDocuments.sOwnerArray] = [id];
		document[SchemaDocuments.sWriteArray] = [];
		document[SchemaDocuments.sReadArray] = [];

		document[SchemaDocuments.sPublicWrite] = false;
		document[SchemaDocuments.sPublicRead] = false;

		document[SchemaDocuments.sParent] = parent;

		return Database.insertDocument(SchemaDocuments._sCollectionName, document);
	}).then(function(input){
		if (input == null){
			return Q.reject("failed to create database document");
		}

		createdDatabaseDocument = input;
		if (true == isUser){
			return Database.pushItemToArray(SchemaUsers._sCollectionName, id, SchemaUsers.sArrayOwnedDocument, createdDatabaseDocument);
		} else {
			return Database.pushItemToArray(SchemaGuests._sCollectionName, id, SchemaGuests.sArrayOwnedDocument, createdDatabaseDocument);
		}
	}).then(function(input){


		in_response.statusCode = 201;
		in_response.setHeader("Content-Type", "application/json");
		in_response.location(in_endpointRoot + "/" + createdDatabaseDocument)
		var result = {
			"id" : createdDatabaseDocument,
		};
		in_response.json(result);
		in_response.end();

	}).fail(function(error){
		if (error !== null){
			console.log("FAIL: create document:" + cleanName + " error:" + error);
			in_response.status(500).send("server error");
		}
	}).done(function(){
		//console.log("accountFiles get done input:" + input);
		//nop
	});

	return;
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

const _documentCanWrite = function(in_databaseDocument, in_sessionID){
	if (in_databaseDocument[SchemaDocuments.sPublicWrite] === true){
		return true;
	}
	var id = Database.stringToObjectID(in_sessionID);
	if ((true === _databaseObjectIDInArray(in_databaseDocument[SchemaDocuments.sOwnerArray], in_sessionID)) ||
		(true === _databaseObjectIDInArray(in_databaseDocument[SchemaDocuments.sWriteArray], in_sessionID))){
		return true;
		}

	return false;
}

const _documentIsOwner = function(in_databaseDocument, in_sessionID){
	var id = Database.stringToObjectID(in_sessionID);
	if (true === _databaseObjectIDInArray(in_databaseDocument[SchemaDocuments.sOwnerArray], in_sessionID)){
		return true;
		}

	return false;
}

const _getEndpoint = function(in_request, in_response, in_applicationName, in_documentType){
	try {
		_getEndpointInternal(in_request, in_response, in_applicationName, in_documentType);
	} catch (error) {
		console.log(in_applicationName + " " + in_documentType + " get threw:" + error);
		in_response.status(500).send("server error");
		//nop
	}
	return;
}

const _getEndpointInternal = function(in_request, in_response, in_applicationName, in_documentType){
	if (in_request.session == null){
		Util.responseSendError(in_response, 403, "no session found");
		return Q.reject(null);
	}

	//console.log(in_applicationName + " " + in_documentType + " _getEndpointInternal ID:" + in_request.params.ID);
	var id = Database.stringToObjectID(in_request.params.ID);
	
	return Q(true).then(function(input){
		var userFilter = {};
		userFilter[SchemaDocuments.sName] = 1;
		userFilter[SchemaDocuments.sData] = 1;
		userFilter[SchemaDocuments.sWriteLock] = 1;
		userFilter[SchemaDocuments.sOwnerArray] = 1;
		userFilter[SchemaDocuments.sPublicRead] = 1;
		userFilter[SchemaDocuments.sPublicWrite] = 1;
		userFilter[SchemaDocuments.sReadArray] = 1;
		userFilter[SchemaDocuments.sWriteArray] = 1;
		return Database.getDocument(SchemaDocuments._sCollectionName, id, userFilter);
	}).then(function(input){
		//console.log(" _getEndpointInternal input:" + JSON.stringify(input));

		if (input == null){
			Util.responseSendError(in_response, 404, "document not found");
			return Q.reject(null);
		}

		if (false == _documentCanRead(input, in_request.session.id)){
			Util.responseSendError(in_response, 403, "access is not allowed");
			return Q.reject(null);
		}

		in_response.statusCode = 200;
		var result = {};
		result["id"] = in_request.params.ID;
		result["name"] = input[SchemaDocuments.sName];
		result["data"] = input[SchemaDocuments.sData];
		result["write_lock"] = input[SchemaDocuments.sWriteLock];
		in_response.json(result);
		in_response.end();
		return true;
	}).fail(function(error){
		if (error !== null){
			console.log("FAIL: get document:" + in_request.params.ID + " error:" + error);
			in_response.status(500).send("server error");
		}
	}).done(function(input){
		//console.log("_getEndpointInternal get done input:" + input);
		//nop
	});

}

const _putEndpoint = function(in_request, in_response, in_applicationName, in_documentType){
	try {
		_putEndpointInternal(in_request, in_response, in_applicationName, in_documentType);
	} catch (error) {
		console.log(in_applicationName + " " + in_documentType + " put threw:" + error);
		in_response.status(500).send("server error");
		//nop
	}
	return;
}

const _putEndpointInternal = function(in_request, in_response, in_applicationName, in_documentType){
	//we expect the request body to be an object delta, including lock (writeLock) and data
	if (in_request.session == null){
		Util.responseSendError(in_response, 403, "no session found");
		return Q.reject(null);
	}

	var data = in_request.body;
	//console.log("restapplicationwrapper put data:" + JSON.stringify(data));

	if (data == null){
		Util.responseSendError(in_response, 400, "malformed syntax", ["no body"]);
		return;
	}

	//console.log(in_applicationName + " " + in_documentType + " _getEndpointInternal ID:" + in_request.params.ID);
	var id = Database.stringToObjectID(in_request.params.ID);
	var sourceWriteLock = undefined;
	
	return Q(true).then(function(input){
		var userFilter = {};
		userFilter[SchemaDocuments.sData] = 1;
		userFilter[SchemaDocuments.sWriteLock] = 1;
		userFilter[SchemaDocuments.sOwnerArray] = 1;
		userFilter[SchemaDocuments.sPublicWrite] = 1;
		userFilter[SchemaDocuments.sWriteArray] = 1;
		return Database.getDocument(SchemaDocuments._sCollectionName, id, userFilter);
	}).then(function(input){
		//console.log(" _getEndpointInternal input:" + JSON.stringify(input));

		if (input == null){
			Util.responseSendError(in_response, 404, "document not found");
			return Q.reject(null);
		}

		if (false == _documentCanWrite(input, in_request.session.id)){
			Util.responseSendError(in_response, 403, "access is not allowed");
			return Q.reject(null);
		}

		//update document
		var sourceData = input[SchemaDocuments.sData];
		sourceWriteLock = input[SchemaDocuments.sWriteLock];

		var objectDelta = data;

		//writeLock out of date
		if (objectDelta["lock"] != sourceWriteLock){
			console.log(" write_lock sourceWriteLock:" + sourceWriteLock + " objectDelta.write_lock" + objectDelta["lock"]);
			Util.responseSendError(in_response, 409, "write lock out of date");
			return Q.reject(null);
		}

		// apply delta to sourceData
		var documentData = app.locals.applicationManager.ApplyDelta(in_applicationName, sourceData, data);
		var document = app.locals.applicationManager.DocumentDataToDocument(in_applicationName, documentData);
		var documentData2 = app.locals.applicationManager.DocumentToDocumentData(in_applicationName, document);
		var documentPatch = {};
		documentPatch[SchemaDocuments.sData] = documentData2;
		var date = new Date();
		documentPatch[SchemaDocuments.sLastModifyTime] = date.valueOf();

		return Database.updateDocumentWriteLock(SchemaDocuments._sCollectionName, id, sourceWriteLock, documentPatch);
	}).then(function(input){
		//console.log(" updateDocumentWriteLock input:" + JSON.stringify(input));
		if (input != true){
			Util.responseSendError(in_response, 409, "write lock out of date");
			return Q.reject(null);
		}
		in_response.statusCode = 200;
		var result = {};
		result["id"] = in_request.params.ID;
		result["write_lock"] = sourceWriteLock + 1;
		in_response.json(result);
		in_response.end();
		return true;
	}).fail(function(error){
		if (error !== null){
			console.log("FAIL: get document:" + in_request.params.ID + " error:" + error);
			in_response.status(500).send("server error");
		}
	}).done(function(input){
		//console.log("_getEndpointInternal get done input:" + input);
		//nop
	});
}

const _deleteEndpoint = function(in_request, in_response, in_applicationName, in_documentType){
	try {
		_deleteEndpointInternal(in_request, in_response, in_applicationName, in_documentType);
	} catch (error) {
		console.log(in_applicationName + " " + in_documentType + " delete threw:" + error);
		in_response.status(500).send("server error");
		//nop
	}
	return;
}

const _deleteEndpointInternal = function(in_request, in_response, in_applicationName, in_documentType){
	//console.log(" _deleteEndpointInternal in_applicationName:" + in_applicationName + " in_documentType:" + in_documentType);
	//call through to the file endpoint to remove ownership of file, and if it has no ownership, remove document from database
	// for now, just delete the document

	if (in_request.session == null){
		Util.responseSendError(in_response, 403, "no session found");
		return Q.reject(null);
	}

	var id = Database.stringToObjectID(in_request.params.ID);

	//get document to check ownership
	return Q(true).then(function(input){
		var userFilter = {};
		userFilter[SchemaDocuments.sData] = 1;
		userFilter[SchemaDocuments.sOwnerArray] = 1;
		return Database.getDocument(SchemaDocuments._sCollectionName, id, userFilter);
	}).then(function(input){
		//console.log(" _deleteEndpointInternal input:" + JSON.stringify(input));

		if (input == null){
			Util.responseSendError(in_response, 404, "document not found");
			return Q.reject(null);
		}

		if (false == _documentIsOwner(input, in_request.session.id)){
			Util.responseSendError(in_response, 403, "not owner");
			return Q.reject(null);
		}

		return Database.deleteDocument(SchemaDocuments._sCollectionName, id);
	}).then(function(input){
		//console.log(" _deleteEndpointInternal input:" + JSON.stringify(input));

		if (input != true){
			Util.responseSendError(in_response, 404, "document not deleted");
			return Q.reject(null);
		}

		in_response.statusCode = 200;
		in_response.end();
		return true;
	}).fail(function(error){
		if (error !== null){
			console.log("FAIL: get document:" + in_request.params.ID + " error:" + error);
			in_response.status(500).send("server error");
		}
	}).done(function(input){
		//console.log("_deleteEndpointInternal get done input:" + input);
		//nop
	});
}

/*
wrap up a document manager for a given application and type
provide rest crud endpoints
in_applicationName "folder" "foo"
in_documentType "folder" "bar"
in_routerMount "/api/v1"
in_endpointRoot "/folders" , "/foo/bar"

post /api/v1/folders
get /api/v1/folders/:ID
put /api/v1/folders/:ID
delete /api/v1/folder/:ID

*/
module.exports = function(in_applicationName, in_documentType, in_routerMount, in_endpointRoot){
	const router = Express.Router({ mergeParams: true });

	router.all("*", Session.middleware);

	router.post(in_endpointRoot, function(in_request, in_response, in_next) {
		//console.log(in_endpointRoot + " post body:" + JSON.stringify(in_request.body));
		_postEndpoint(in_request, in_response, in_applicationName, in_documentType, in_endpointRoot);
	});

	router.get(in_endpointRoot + "/:ID", function(in_request, in_response, in_next) {
		_getEndpoint(in_request, in_response, in_applicationName, in_documentType);
	});

	router.put(in_endpointRoot + "/:ID", function(in_request, in_response, in_next) {
		_putEndpoint(in_request, in_response, in_applicationName, in_documentType);
	});

	router.delete(in_endpointRoot + "/:ID", function(in_request, in_response, in_next) {
		_deleteEndpoint(in_request, in_response, in_applicationName, in_documentType);
	});

	app.use(in_routerMount, router);
	return;
}


