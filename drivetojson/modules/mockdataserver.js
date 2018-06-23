const Q = require('q');
const TypeEnum = require("./dataserver.js").TypeEnum;


const MockDataServer = function(in_mockData) {
	this.m_mockData = in_mockData;
}

/*
mockdata {
	"xxx_id" : {
		"metaData" : {
			"name" : name,
			"id" : id,
			"type" : type,
			"mimeType" : mimeType
		},
		childrenArray : [], //folder children data
		data : { 
			"worksheetName" : [[...],...] //spread sheet data
		}
	}
}

*/
module.exports = function(in_mockData){
	var mockDataServer = new MockDataServer(in_mockData);
	return mockDataServer;
}

/*
returns promise
resolve null if not found
resolve object {
	"name" : name,
	"id" : id,
	"type" : type
}
*/
MockDataServer.prototype.getFolderMetaDataByName = function(in_name) {
	var deferred = Q.defer();
	var found = false;
	for (var key in this.m_mockData) {
		var metaData = this.m_mockData[key].metaData;
		if ((in_name == metaData.name) && (TypeEnum.folder == metaData.type)) {
			deferred.resolve(metaData);
			found = true;
			break;
		}
	}
	if (false === found){
		deferred.resolve(null);
	}
	return deferred.promise;
};

/*
returns promise
resolve null if not found
resolve object {
	"name" : name,
	"id" : id,
	"type" : type
}
*/
MockDataServer.prototype.getMetaDataByID = function(in_id){
	var deferred = Q.defer();
	if (in_id in this.m_mockData){
		var metaData = this.m_mockData[in_id].metaData;
		deferred.resolve(metaData);
	} else {
		deferred.resolve(null);
	}

	return deferred.promise;
};

MockDataServer.prototype.getFolderChildrenMetaDataArray = function(in_id){
	var deferred = Q.defer();
	if (in_id in this.m_mockData){
		var metaDataArray = [];
		var childrenArray = this.m_mockData[in_id].childrenArray;
		if (null != childrenArray){ 
			for (var index = 0, length = childrenArray.length; index < length; index++) {
				var id = childrenArray[index];
				if (id in this.m_mockData){
					metaDataArray.push(this.m_mockData[id].metaData);
				}
			}
		}
		deferred.resolve(metaDataArray);
	} else {
		deferred.resolve(null);
	}

	return deferred.promise;
};

MockDataServer.prototype.getSpreadsheetWorksheetData = function(in_id, in_worksheetName){
	var deferred = Q.defer();
	var found = false;
	if (in_id in this.m_mockData){
		var data = this.m_mockData[in_id].data;
		if ((data != null) && (in_worksheetName in data)) {
			deferred.resolve(data[in_worksheetName]);
			found = true;
		}
	}
	if (false === found){
		deferred.resolve([]);
	}
	return deferred.promise;
};

MockDataServer.prototype.TypeEnum = TypeEnum;
