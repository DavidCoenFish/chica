const Q = require('q');
const Cursor = require("./modules/cursor.js");
const Util = require("./modules/util.js");
const DriveToObject = require("./modules/drivetoobject.js");
const DataServer = require("./modules/dataserver.js");
const Version = require("./modules/version.js");

console.log("Drive to json");
const drivePath = process.argv[2];
console.log(" drivePath:" + drivePath);
const output = process.argv[3];
console.log(" output:" + output);
const product = process.argv[4];
console.log(" product:" + product);
const sku = process.argv[5];
console.log(" sku:" + sku);
const dataset = process.env.DSC_DATASET;
//console.log(" dataset:" + dataset);

const versionMajor = process.argv[6]; 
const versionMinor = process.argv[7];

var dataArray = undefined;
if (dataset != undefined) {
	dataArray = JSON.parse(dataset);
}
if (false === Array.isArray(dataArray)) {
	dataArray = [];
}

console.log(" dataArray:" + JSON.stringify(dataArray));

var gVersion = "";
const dataServer = DataServer();

const RunSheetToObject = function (drivePath, dataObject, outputJson, outputJS, in_locale) {
	return function () {
		console.log(" RunSheetToObject drivePath:" + JSON.stringify(drivePath) + " dataObject:" + JSON.stringify(dataObject));

		const cursor = Cursor(dataObject);
		const baseObject = {};

		return DriveToObject.driveToObject(dataServer, drivePath, cursor, baseObject).then(function () {
			baseObject["version"] = gVersion;
			baseObject["locale_id"] = in_locale;
		}).then(function () {
			var data = JSON.stringify(baseObject);
			console.log("write:" + outputJson);
			return Util.writeFilePromise(outputJson, data);
		}).then(function () {
			var data = "const gStatic" + product + " = " + JSON.stringify(baseObject);
			console.log("write:" + outputJS);
			return Util.writeFilePromise(outputJS, data);
		});
	}
}

var promiseArray = [];
for (var index = 0, length = dataArray.length; index < length; index++) {
	var subDataSet = dataArray[index];
	//by convention, the first key in the data set is the name token
	var nameToken = subDataSet[0];

	var dataObject = {};
	var locale = "";
	for (var subIndex = 0, subLength = subDataSet.length; subIndex < subLength; subIndex++) {
		var item = subDataSet[subIndex];
		if (subIndex === 0){
			locale = item;
		}
		dataObject[item] = true;
	}

	var outputArray = output.split(".");
	outputArray.length -= 1;
	outputArray.push(nameToken);
	outputArray.push("json");
	var localOutputJson = outputArray.join(".");
	outputArray.length -= 1;
	outputArray.push("js");
	var localOutputJS = outputArray.join(".");

	promiseArray.push(RunSheetToObject(drivePath, dataObject, localOutputJson, localOutputJS, locale));
}


const totalCount = promiseArray.length;
var exitCode = 0;
var passCount = 0;

Version.IncrementVersionPromice(product, sku, versionMajor, versionMinor).then(function (input) {
	//console.log("GetVersionStringPromice product:" + product + " sku:" + sku);
	return Version.GetVersionStringPromice(product, sku);
}).then(function (input) {
	gVersion = input;
	//console.log(" gVersion:" + gVersion);
	return true;
}).then(function (input) {

	const promise = promiseArray.reduce(function (input, factory) {
		return input.then(function () {
			return factory();
		}).then(function (input) {
			passCount += 1;
		}).catch(function (error) {
			exitCode = 1;
			console.log("main threw:" + JSON.stringify(error));
		});
	}, Q.resolve());

	return promise;
}).done(function () {
	console.log("done version:" + gVersion + " exitCode:" + exitCode + " passCount:" + passCount + "/" + totalCount + " time:" + (new Date).toLocaleTimeString());
	process.exit(exitCode);
}, function (error) {
	console.log("FAILED:" + error + " time:" + (new Date).toLocaleTimeString());
	exitCode = 1; //error
	process.exit(exitCode);
});


