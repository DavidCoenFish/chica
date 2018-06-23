const Database = require("./database");
const SchemaDocuments = require("./../schema/documents");
const SchemaUsers = require("./../schema/users");
const SchemaGuests = require("./../schema/guests");

/*
	returns promice

	for any document has reached zero owners and is about to be delete
	any account (guest or user) that has read or write priviages on the document need to have their document reference removed
*/
module.exports.PreDeleteDocument = function(document, documentID, lastOwnerID) {
	var result = Q(true);
	var accountsWithWrite = document[SchemaDocuments.sWriteArray];
	var accountsWithRead = document[SchemaDocuments.sReadArray];

	if (accountsWithWrite != undefined){
		for (var index = 0, total = accountsWithWrite.length; index < total; index++) {
			var accountID = accountsWithWrite[index];
			if (accountID == lastOwnerID){
				continue;
			}
			result = result.then(function(input){
				return Database.removeItemFromArray(SchemaUsers._sCollectionName, accountID, SchemaUsers.sArrayWriteDocument, documentID);
			}).then(function(input){
				return Database.removeItemFromArray(SchemaGuests._sCollectionName, accountID, SchemaGuests.sArrayWriteDocument, documentID);
			});
		}
	}

	if (accountsWithRead != undefined){
		for (var index = 0, total = accountsWithRead.length; index < total; index++) {
			var accountID = accountsWithRead[index];
			if (accountID == lastOwnerID){
				continue;
			}
			result = result.then(function(input){
				return Database.removeItemFromArray(SchemaUsers._sCollectionName, accountID, SchemaUsers.sArrayReadDocument, documentID);
			}).then(function(input){
				return Database.removeItemFromArray(SchemaGuests._sCollectionName, accountID, SchemaGuests.sArrayReadDocument, documentID);
			});
		}
	}

	return result;
}
