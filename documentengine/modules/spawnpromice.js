const Q = require("q");
var ChildProcess = require('child_process');

module.exports = function(in_command, in_arrayArgs){
	console.log("SpawnPromice in_command:" + in_command + " in_arrayArgs:" + JSON.stringify(in_arrayArgs));

	var deferred = Q.defer();

	const child = ChildProcess.execFile(in_command, in_arrayArgs, function(exitCode, stdOut, stdErr) {
		//console.log(" SpawnPromice exitCode:" + exitCode);
		//deferred.resolve(exitCode); //undefined, so resolve in child.on("exit"
	});

	//const child = ChildProcess.spawn(in_command, in_arrayArgs);

	child.stdout.on("data", (data) => {
		console.log(`${data.replace("\n", "")}`);
	});

	child.stderr.on("data", (data) => {
		console.error(`${data.replace("\n", "")}`);
	});

	child.on("exit", (code) => {
		console.log(`child process exit code: ${code}`);
		deferred.resolve(code);
	});

	return deferred.promise;
} 