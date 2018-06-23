const Server = require("./server");
const Q = require("q");
const Path = require("path");
const FileSystem = require("fs");

const WalkSync = function (currentDirPath, callback) {
	FileSystem.readdirSync(currentDirPath).forEach(function (name) {
		var filePath = Path.join(currentDirPath, name);
		var stat = FileSystem.statSync(filePath);
		if (stat.isFile()) {
			callback(filePath, stat, name);
		}
	});
}

const GatherUnitTestPromises = function(promiseFactoryArray) {
	const unittestPath = Path.join(__dirname, "/unittests/");
	//console.log("unittestPath:" + unittestPath);
	WalkSync(unittestPath, function(filePath, stat, name){
		var testPath = "./" + Path.relative(__dirname, filePath).replace(/\\/g, "/");
		//console.log("testPath:" + name);
		try{
			require(testPath)(promiseFactoryArray);
		}catch (err){
			promiseFactoryArray.push(function(){ return Q.reject("unittestPath:" + testPath + " threw:" + err)});
			//console.log("testPath:" + testPath + " threw:" + err);
		}
	});
	return;
}

var promiseFactoryArray = [];
GatherUnitTestPromises(promiseFactoryArray);
//require("./unittests/accounts.js")(promiseFactoryArray);
//require("./unittests/database.js")(promiseFactoryArray);
//require("./unittests/encript.js")(promiseFactoryArray);
//require("./unittests/folder.js")(promiseFactoryArray);
//require("./unittests/legendaryquest.js")(promiseFactoryArray);
//require("./unittests/session.js")(promiseFactoryArray);
//require("./unittests/server.js")(promiseFactoryArray);
//require("./unittests/util.js")(promiseFactoryArray);


/*
promiseArray.push(Q.Promise(function(resolve, reject){
	console.log("Q(function(resolve, reject)");
	return true;
}));
*/

console.log("unittest promiseArray.length:" + promiseFactoryArray.length + " environment:" + process.env.NODE_ENV);

var exitCode = 0;
var passCount = 0;
const promise = promiseFactoryArray.reduce(function(input, factory){
	return input.then(function(){
		return factory();
	}).then(function(input){
		passCount += 1;
	}).catch(function(error){
		exitCode = 1;
		console.log("test threw:" + error + " " + JSON.stringify(error));
	});
}, Q.resolve());

promise.done(function(){
	console.log("PASS:" + passCount);
	process.exit(exitCode);
},function(error){
	console.log("FAILED 2:" + error);
	exitCode = 1; //error
	process.exit(exitCode);
});

