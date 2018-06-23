const ClosureCompiler = require('google-closure-compiler').compiler;
const Q = require("q");
const Util = require("./util.js");


//return Compile.Run(versionString, sourceFileArray, outputFile, outputSourceMapOrUndefined, DEBUG, STACK, LOG);
module.exports.Run = function(in_versionString, in_sourceFileArray, in_outputFile, in_outputSourceMapOrUndefined, in_DEBUG, in_STACK, in_LOG){

	return Q(true).then(function(input){
		return AppendVersionData(in_sourceFileArray, in_versionString);
	}).then(function(in_input){
		return CompilerPromice(in_versionString, in_sourceFileArray, in_outputFile, in_outputSourceMapOrUndefined, in_DEBUG, in_STACK, in_LOG);
	}).then(function(in_input){
		var compileExitCode = in_input;
		return OutputDoctor(in_outputFile, compileExitCode);
	});
}

const AppendVersionData = function(in_sourceFileArray, in_versionString){
	var data = "c[\"version\"] = \"" + in_versionString + "\";";
	var filePath = ".\\data\\version.js";
	in_sourceFileArray.push(filePath);
	return Util.writeFilePromise(filePath, data);
}

const CompilerPromice = function(in_versionString, in_sourceFileArray, in_outputFile, in_outputSourceMapOrUndefined, in_DEBUG, in_STACK, in_LOG){
	var deferred = Q.defer();

	var param = {
		js: in_sourceFileArray,
		compilation_level: 'ADVANCED_OPTIMIZATIONS',
		js_output_file: in_outputFile,
		externs: ".\\source\\common\\extern.js",
		define:["DEBUG=" + in_DEBUG, "STACK=" + in_STACK, "LOG=" + in_LOG],
	};
	if (in_outputSourceMapOrUndefined !== undefined){
		param["create_source_map"] = in_outputSourceMapOrUndefined;
		param["source_map_format"] = "V3";
	}

	var closureCompiler = new ClosureCompiler(param);

	//console.log(" closureCompiler getFullCommand:" + closureCompiler.getFullCommand());

	var compilerProcess = closureCompiler.run(function(exitCode, stdOut, stdErr) {
		console.log(" closureCompiler.run exitCode:" + exitCode);
		deferred.resolve(exitCode);
	});

	compilerProcess.stdout.on('data', (data) => {
		console.log(`${data}`);
	});

	compilerProcess.stderr.on('data', (data) => {
		console.error(`${data}`);
	});

	return deferred.promise;
}

const OutputDoctor = function(in_outputFile, in_compileExitCode){
	return Util.readFilePromise(in_outputFile).then(function(in_input){
		in_input = in_input.replace("/*", "");
		in_input = in_input.replace("*/", "");
		return in_input;
	}).then(function(in_input){
		return Util.writeFilePromise(in_outputFile, in_input);
	}).then(function(in_input){
		return in_compileExitCode;
	});
}


//console.log(ClosureCompiler.COMPILER_PATH); // absolute path the compiler jar
//console.log(ClosureCompiler.CONTRIB_PATH); // absolute path the contrib folder which contains
 

 

/*
Code	Description 
0	The operation completed successfully. 
1	Incorrect function. 
2	The system cannot find the file specified. 
3	The system cannot find the path specified. 
4	The system cannot open the file. 
5	Access is denied. 
6	The handle is invalid. 
7	The storage control blocks were destroyed. 
8	Not enough storage is available to process this command. 
9	The storage control block address is invalid. 
10	The environment is incorrect. 
11	An attempt was made to load a program with an incorrect format. 
12	The access code is invalid. 
13	The data is invalid. 
*/
/*
compilerProcess.on("exit", function(code, status){
	//console.log("compilerProcess exit code:" + code + " status:" + status);
	//process.exit(code);
});

compilerProcess.on("disconnect", function(param){
	console.log("compilerProcess exit param:" + param);
});

compilerProcess.on("error", function(param){
	console.log("compilerProcess error param:" + param);
});

compilerProcess.on("close", function(param){
	console.log("compilerProcess close param:" + param);
});

compilerProcess.on("message", function(param){
	console.log("compilerProcess message param:" + param);
});

compilerProcess.stdout.on('data', (data) => {
  console.log(`${data}`);
});

compilerProcess.stderr.on('data', (data) => {
  console.error(`${data}`);
});
*/