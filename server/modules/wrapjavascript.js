var VirtualMachine = require("vm");
var FileSystem = require("fs");

module.exports = function(path, context, dataPrepend) {
	var data = FileSystem.readFileSync(path);
	if (dataPrepend != null){
		data = dataPrepend + data;
	}

	VirtualMachine.runInNewContext(data, context, path);
	return context;
}