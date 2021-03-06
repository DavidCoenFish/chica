const Q = require('q');
const GoogleHelper = require("./googlehelper.js");

const TypeEnum = Object.freeze({
	"unknown":0,
	"folder":1, //"mimeType": "application/vnd.google-apps.folder"
	"spreadsheet":2 //"mimeType": "application/vnd.google-apps.spreadsheet"
	//"array_auto":2 //nope, wont work, data design is reentrant
});

const DataServer = function() {
	this.m_folderMetaDataMap = {};
	this.m_metaDataDataMap = {};
	this.m_childrenOfFolderDataMap = {};
	this.m_spreadsheetWorksheetDataMap = {};
	this.m_test = 0;
}

module.exports = function(){
	var dataServer = new DataServer();
	return dataServer;
}

const getType = function(in_mimeType){
	//var mimeType = in_metaData.mimeType;
	if (in_mimeType === "application/vnd.google-apps.folder"){
		return TypeEnum.folder;
	}
	if (in_mimeType === "application/vnd.google-apps.spreadsheet"){
		return TypeEnum.spreadsheet;
	}
	return TypeEnum.unknown;
}

DataServer.prototype.getMetaDataByNameArray = function(in_input, in_dirArray) {
	//console.log("getMetaDataByNameArray in_input:" + JSON.stringify(in_input) + " in_dirArray:" + JSON.stringify(in_dirArray));
	if (in_dirArray.length <= 0){
		return in_input;
	}

	var that = this;
	var childName = in_dirArray.shift();
	return Q.delay(100).then(function(){
		return GoogleHelper.getChildMetaDataByName(in_input.id, childName, that);
	}).then(function(input){
		return that.getMetaDataByNameArray(input, in_dirArray);
	})
}

/*
returns promise
resolve null if not found
resolve object {
	"name" : name,
	"id" : id,
	"type" : type,
	"mimeType" : mimeType
}
*/
DataServer.prototype.getFolderMetaDataByName = function(in_name) {
	//console.log("getFolderMetaDataByName in_name:" + in_name);
	var dirArray = in_name.split("/");
	//console.log(" dirArray:" + dirArray);
	var rootDir = dirArray.shift();

	var that = this;

	return Q.delay(100).then(function(){
		return GoogleHelper.getFolderMetaDataByName(rootDir, that);
	}).then(function(input){
		return that.getMetaDataByNameArray(input, dirArray);
	}).then(function(input){
		if (input != null){
			input.type = getType(input.mimeType);
		}
		//console.log(" input:" + input);
		return input;
	});
};

/*
returns promise
resolve null if not found
resolve object {
	"name" : name,
	"id" : id,
	"type" : type,
	"mimeType" : mimeType
}
*/
DataServer.prototype.getMetaDataByID = function(in_id){
	var that = this;
	return Q.delay(100).then(function(){
		return GoogleHelper.getMetaData(in_id, that);
	}).then(function(input){
		if (input != null){
			input.type = getType(input.mimeType);
		}
		return input;
	});
};

DataServer.prototype.getFolderChildrenMetaDataArray = function(in_id){
	var that = this;
	return Q.delay(100).then(function(){
		return GoogleHelper.getChildrenOfFolder(in_id, that);
	}).then(function(input){
		for (var index = 0, length = input.length; index < length; index++) {
			var item = input[index];
			if (item != null){
				item.type = getType(item.mimeType);
			}
		}
		return input;
	});
};

DataServer.prototype.getSpreadsheetWorksheetData = function(in_id, in_worksheetName){
	var that = this;
	return Q.delay(100).then(function(){
		return GoogleHelper.getSpreadsheetWorksheet(in_id, in_worksheetName, that);
	});
};

DataServer.prototype.TypeEnum = TypeEnum;
