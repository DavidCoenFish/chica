const Q = require("q");
const Path = require("path");
const FileSystem = require("fs");
const SpawnPromice = require("./modules/spawnpromice.js");

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
//require("./unittests/core.js")(promiseFactoryArray);
//require("./unittests/dagnodevaluehelper.js")(promiseFactoryArray);
//require("./unittests/document.js")(promiseFactoryArray);
//require("./unittests/documentmanager.js")(promiseFactoryArray);
//require("./unittests/documentmanagerlocalehelper.js")(promiseFactoryArray);
//require("./unittests/language.js")(promiseFactoryArray);
//require("./unittests/objectdelta.js")(promiseFactoryArray);

console.log("unittest:" + promiseFactoryArray.length);

var exitCode = 0;
var passCount = 0;
const getPromice = function(){
	const promise = promiseFactoryArray.reduce(function(input, factory){
		return input.then(function(){
			return factory();
		}).then(function(input){
			passCount += 1;
		}).catch(function(error){
			exitCode = 1;
			console.log("error:" + error);
		});
	}, Q.resolve());
	return promise;
}

Q(true).then(function(in_input){
	return SpawnPromice("node", ["build.js", "common", "prod", ".\\output\\"]);
}).then(function(in_input){
	return getPromice();
}).done(function(){
	console.log("PASS:" + passCount + "/" + promiseFactoryArray.length);
	process.exit(exitCode);
},function(error){
	console.log("FAILED 2:" + error);
	exitCode = 1; //error
	process.exit(exitCode);
});

