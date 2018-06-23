const Assert = require("assert");
const Config = require("config");
const MongoDB = require("mongodb");
const Q = require("q");
const SchemaDocuments = require("./../schema/documents");

const sMongoConnectOptions = {
	"promiseLibrary" : Q.Promise
};
const sMongoConnectUrl = Config.get("databaseConnectUrl");
const sWriteLockKey = "_write_lock";
const sIDKey = "_id";

module.exports.addUniqueIndex = function(collectionName, keyName) {
	return MongoDB.MongoClient.connect(sMongoConnectUrl, sMongoConnectOptions).then(function(connection){
		var keys = {};
		keys[keyName] = 1;
		var options = {
			"unique" : true
			};
		return new Q(connection.collection(collectionName).createIndex(keys, options))
			.then(function(){
				connection.close();
				return true;
			});
		});
}

//db.inventory.find( { type: 'food' }, { item: 1, qty: 1 } )
module.exports.getCollection = function(collectionName, projectionQueryOrUndefined, projectionReturnFieldsOrUndefined) {
	//console.log("_Mongo.getPromiceCollection:" + this.m_url + " " + collectionName);
	return MongoDB.MongoClient.connect(sMongoConnectUrl, sMongoConnectOptions).then(function(connection){
		return new Q(connection.collection(collectionName).find(projectionQueryOrUndefined, projectionReturnFieldsOrUndefined).toArray())
			.then(function(input){
				connection.close();
				return input;
			});
		});
}

module.exports.deleteCollection = function(collectionName) {
	//console.log("_Mongo.deletePromiceDocument");
	return MongoDB.MongoClient.connect(sMongoConnectUrl, sMongoConnectOptions).then(function(db){
		return db.collection(collectionName).remove({}).then(function(){
			db.close();
			return collectionName;
		});
	});
}

module.exports.getDocument = function(collectionName, id, projectionReturnFieldsOrUndefined) {
	//return Q(true);
	return MongoDB.MongoClient.connect(sMongoConnectUrl, sMongoConnectOptions).then(function(connection){
		return connection.collection(collectionName).findOne({_id : id}, projectionReturnFieldsOrUndefined)
			.then(function(document){
				connection.close();
				return document;
			});
	});
}

module.exports.deleteDocument = function(collectionName, id) {
	//console.log("_Mongo.deletePromiceDocumentByID");
	return MongoDB.MongoClient.connect(sMongoConnectUrl, sMongoConnectOptions).then(function(connection){
		return connection.collection(collectionName).deleteOne({"_id": id})
			.then(function(document){
				connection.close();
				var found = ((document != null) && (0 < document.deletedCount));
				return found;
			});
	});
}


//return id
module.exports.insertDocument = function(collectionName, documentToInsert) {
	//console.log("_Mongo.insertDocumentReturnID:" + collectionName + " " + JSON.stringify(documentToInsert));
	return MongoDB.MongoClient.connect(sMongoConnectUrl, sMongoConnectOptions).then(function(db) {
		//console.log("mongoDB.connect");
		return db.collection(collectionName).insert(documentToInsert)
			.then(function(response) {
				//console.log("Mongo.insert");
				db.close();
				return documentToInsert._id;
			});
	});
}

module.exports.stringToObjectID = function(id) {
	var value = null;
	try {
		value = new MongoDB.ObjectID(id);
	} catch (error){
		console.log("bad id for database object ID");
		value = null;
	}
	return value;
}

/* update or insert */
module.exports.upsertDocument = function(collectionName, id, documentPatch) {
	//var flattenedDocumentPatch = {};
	//flattenObject(flattenedDocumentPatch, documentPatch);

	//console.log("_Mongo.upsertDocument:" + collectionName + " " + id + " " + JSON.stringify(flattenedDocumentPatch));
	return MongoDB.MongoClient.connect(sMongoConnectUrl, sMongoConnectOptions).then(function(db) {
		//console.log("mongoDB.connect");
		return db.collection(collectionName).update(
			{"_id": id},
			{"$set" : documentPatch},
			{
				upsert: true,
			}).then(function(response) {
				//console.log("Mongo.upsert");
				db.close();
				if (0 < response.result.nModified){
					return true;
				}
				return false;
			});
	});
}

// unset 
module.exports.unsetDocument = function(collectionName, id, documentPatch) {
	//var flattenedDocumentPatch = {};
	//flattenObject(flattenedDocumentPatch, documentPatch);

	//console.log("_Mongo.unsetDocument:" + collectionName + " " + id + " " + JSON.stringify(documentPatch));
	return MongoDB.MongoClient.connect(sMongoConnectUrl, sMongoConnectOptions).then(function(db) {
		//console.log("mongoDB.connect");
		return db.collection(collectionName).update(
			{"_id": id},
			{"$unset" : documentPatch}
			).then(function(response) {
				//console.log("Mongo.update $unset");
				db.close();
				if (0 < response.result.nModified){
					return true;
				}
				return false;
			});
	});
}

module.exports.updateDocument = function(collectionName, id, documentPatch) {
	//console.log("updateDocument documentPatch:" + JSON.stringify(documentPatch));

	return MongoDB.MongoClient.connect(sMongoConnectUrl, sMongoConnectOptions).then(function(db) {
		//console.log("mongoDB.connect");
		return db.collection(collectionName).update(
			{"_id": id},
			{"$set" : documentPatch},
			{
				upsert: true,
				multi: false//,
				//writeConcern: <document>
			}).then(function(response) {
				db.close();
				if (0 < response.result.nModified){
					return true;
				}
				return false;
			});
	});
}

module.exports.pushItemToArray = function(collectionName, id, path, item) {
	var documentPatch = {};
	documentPatch[path] = item;

	return MongoDB.MongoClient.connect(sMongoConnectUrl, sMongoConnectOptions).then(function(db) {
		//console.log("mongoDB.connect");
		return db.collection(collectionName).update(
			{"_id": id},
			{"$push" : documentPatch},
			{
				multi: true
			}).then(function(response) {
				db.close();
				if (0 < response.result.nModified){
					return true;
				}
				return false;
			});
	});	
}

module.exports.removeItemFromArray = function(collectionName, id, path, item) {
	var documentPatch = {};
	documentPatch[path] = item;

	return MongoDB.MongoClient.connect(sMongoConnectUrl, sMongoConnectOptions).then(function(db) {
		//console.log("mongoDB.connect");
		return db.collection(collectionName).update(
			{"_id": id},
			{"$pull" : documentPatch},
			{
				multi: true
			}).then(function(response) {
				db.close();
				if (0 < response.result.nModified){
					return true;
				}
				return false;
			});
	});	
}

/* can only update document if you have the correct write lock, increments write lock */
module.exports.updateDocumentWriteLock = function(collectionName, id, writeLock, documentPatch) {
	//console.log("updateDocumentWriteLock documentPatch:" + JSON.stringify(documentPatch));

	return MongoDB.MongoClient.connect(sMongoConnectUrl, sMongoConnectOptions).then(function(db) {
		//console.log("mongoDB.connect");
		return db.collection(collectionName).update(
			{"_id": id, "write_lock": {$eq : writeLock }},
			{
				"$set" : documentPatch, 
				"$inc" : {"write_lock" : 1} 
			},
			{
				upsert: false,
				multi: false
			}).then(function(response) {
				var result = response.result;
				//console.log("Mongo.update writelock:" + JSON.stringify(response) +  " " + response.result);
				db.close();
				if ("nModified" in result){
					if (0 < result.nModified){
						return true;
					}
				}
				return false;
			});
	});
}

module.exports.sWriteLockKey = sWriteLockKey;
module.exports.sIDKey = sIDKey;
