const Version = require("./modules/version.js");
const Compile = require("./modules/compile.js");
const Path = require('path');

console.log("Document engine");
const product = process.argv[2];
console.log(" product:" + product);
const sku = process.argv[3];
console.log(" sku:" + sku);
const versionMajor = 0;
const versionMinor = 0;

var gVersionString = undefined;
Version.IncrementVersionPromice(product, sku, versionMajor, versionMinor).then(function(input){
	return Version.GetVersionStringPromice(product, sku);
}).then(function(input){
	gVersionString = input;
	var sourceFileArray = [];
	var DEBUG = false;
	var STACK = false;
	var LOG = false;
	var sourceFileArray = [
		".\\source\\common\\core.js",
		".\\source\\common\\schemastaticdatacalculate.js",
		".\\source\\common\\dagnodecalculatehelper.js",
		".\\source\\common\\dagnodecalculate.js",
		".\\source\\common\\schemastaticdatavalue.js",
		".\\source\\common\\dagnodevaluehelper.js",
		".\\source\\common\\dagnodevalue.js",
		".\\source\\common\\dagnodecollectionhelper.js",
		".\\source\\common\\schemadocument.js",
		".\\source\\common\\document.js",
		".\\source\\common\\documentmanagerlocalehelper.js",
		".\\source\\common\\documentmanager.js",
		".\\source\\common\\schemastaticdata.js",
		".\\source\\common\\schemaobjectdelta.js",
		".\\source\\common\\objectdelta.js",
		".\\source\\common\\randomsequence.js"
	];
	var outputFile = undefined;
	var outputSourceMapOrUndefined = undefined;
	switch (product){
	default:
		break;
	case "common":
		outputFile = ".\\output\\common.min.js";
		outputSourceMapOrUndefined = ".\\output\\common.map";
		sourceFileArray.unshift(".\\source\\common\\common.js");
		break;
	case "legendaryquest":
		outputFile = ".\\..\\client\\source\\static\\js\\legendaryquest.min.js";
		outputSourceMapOrUndefined = ".\\..\\client\\source\\static\\js\\legendaryquest.map";
		sourceFileArray.unshift(".\\source\\legendaryquest\\legendaryquest.js");
		sourceFileArray.push(".\\source\\legendaryquest\\instructioncontext.js");
		sourceFileArray.push(".\\source\\legendaryquest\\actioncontext.js");
		break;
	case "system":
		outputFile = ".\\..\\client\\source\\static\\js\\system.min.js";
		outputSourceMapOrUndefined = ".\\..\\client\\source\\static\\js\\system.map";
		sourceFileArray.unshift(".\\source\\system\\system.js");
		sourceFileArray.push(".\\source\\system\\instructioncontext.js");
		break;
	}
	
	return Compile.Run(gVersionString, sourceFileArray, outputFile, outputSourceMapOrUndefined, DEBUG, STACK, LOG);

}).done(function(in_input){
	console.log("DONE:" + in_input + " version:" + gVersionString + " time:" + (new Date).toLocaleTimeString());
	process.exit(in_input);
},function(error){
	console.log("FAILED:" + error);
	process.exit(1);
});



