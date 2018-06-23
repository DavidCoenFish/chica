const Q = require('q');

const DataServer = require("./modules/dataserver.js");
const SheetToObject = require("./modules/sheettoobject.js");
const Cursor = require("./modules/cursor.js");
const Util = require("./modules/util.js");


const dataServer = DataServer();

console.log("Gather locale");
const localePath = process.argv[2];
console.log(" localePath:" + localePath);
const outputLocalePath = process.argv[3];
console.log(" outputLocalePath:" + outputLocalePath);
const outputEnvPath = process.argv[4];
console.log(" outputEnvPath:" + outputEnvPath);
const outputLocaleDataPath = process.argv[5];
console.log(" outputLocaleDataPath:" + outputLocaleDataPath);

const exitCode = 0;
const baseObject = {};
const dataObject = {};
var sheetId = undefined;

Q(true).then(function(input){
	return dataServer.getFolderMetaDataByName(localePath);
}).then(function(input){
	sheetId = input.id;
	const cursor = Cursor({});
	return SheetToObject.sheet5thToObject(dataServer, sheetId, "set", cursor, baseObject, localePath);
}).then(function(input){
	var dataString = JSON.stringify(baseObject);
	return Util.writeFilePromise(outputLocalePath, dataString);
}).then(function(){
	var keyArray = Object.keys(baseObject);
	var dataString = "DSC_DATASET=[";
	for (var index = 0; index < keyArray.length; ++index){
		if (index !== 0){
			dataString += ",";
		}
		dataString += "[\"" + keyArray[index] + "\"]";
	}
	dataString += "]";
	return Util.writeFilePromise(outputEnvPath, dataString);
}).then(function(input){
	const cursor = Cursor({});
	return SheetToObject.sheet3rdToObject(dataServer, sheetId, "title", cursor, dataObject, localePath);
}).then(function(input){
	var dataString = JSON.stringify(dataObject);
	return Util.writeFilePromise(outputLocaleDataPath, dataString);
}).done(function(){
	console.log("done exitCode:" + exitCode);
	process.exit(exitCode);
},function(error){
	console.log("FAILED:" + error);
	process.exit(1);
});
